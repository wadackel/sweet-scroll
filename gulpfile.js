var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var runSequence = require("run-sequence");
var server = require("browser-sync").create();
var KarmaServer = require("karma").Server;
var rollup = require("rollup");
var babel = require("rollup-plugin-babel");
var pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

var banner = [
  "/*!",
  " * " + pkg.name,
  " * " + pkg.description,
  " * ",
  " * @author " + pkg.author,
  " * @homepage " + pkg.homepage,
  " * @license " + pkg.license,
  " * @version " + pkg.version,
  " */"
].join("\n");


gulp.task("server", function(cb) {
  server.init({
    notify: false,
    open: false,
    server: {
      baseDir: "./demo"
    }
  });
  cb();
});


gulp.task("server:reload", function(cb) {
  server.reload();
  cb();
});


gulp.task("demo:sass", function() {
  return gulp.src("./demo/sass/**/*.scss")
    .pipe($.plumber())
    .pipe($.sass({outputStyle: "compressed"}).on("error", $.sass.logError))
    .pipe($.autoprefixer())
    .pipe(gulp.dest("./demo/css"))
    .pipe(server.stream());
});


gulp.task("demo", ["demo:sass"]);


gulp.task("rollup", function(cb) {
  process.env.NODE_ENV = "production";
  rollup.rollup({
    entry: "src/sweet-scroll.js",
    plugins: [babel()]
  }).then(function(bundle) {
    var result = bundle.generate({
      format: "umd",
      moduleName: "SweetScroll",
      banner: banner
    });
    fs.writeFileSync("sweet-scroll.js", result.code);
    fs.writeFileSync("demo/js/sweet-scroll.js", result.code);
    server.reload();
    cb();
  }).catch(function(err) {
    console.log(err);
    cb();
  });
});


gulp.task("uglify", function() {
  return gulp.src("sweet-scroll.js")
    .pipe($.plumber())
    .pipe($.uglify({preserveComments: "license"}))
    .pipe($.rename({extname: ".min.js"}))
    .pipe(gulp.dest("./"))
    .pipe(server.stream());
});


gulp.task("karma", function(cb) {
  process.env.NODE_ENV = "test";
  new KarmaServer({
    configFile: path.join(__dirname, "karma.conf.js"),
    singleRun: true
  }, cb).start();
});


gulp.task("lint", function() {
  return gulp.src(["./src/**/*.js", "./test/**/*.js"])
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});


gulp.task("test", ["lint", "karma"]);


gulp.task("build", function(cb) {
  runSequence(
    "rollup",
    "uglify",
    cb
  );
});


gulp.task("watch", function(cb) {
  gulp.watch("./src/**/*", ["rollup"]);
  gulp.watch("./test/**/*", ["test"]);
  gulp.watch("./demo/**/*.html", ["server:reload"]);
  gulp.watch("./demo/**/*.scss", ["demo:sass"]);
  cb();
});


gulp.task("start", ["server", "watch"]);