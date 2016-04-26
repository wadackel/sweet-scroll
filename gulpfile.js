"use strict";

const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const runSequence = require("run-sequence");
const server = require("browser-sync").create();
const KarmaServer = require("karma").Server;
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const banner = `
/*!
 * ${pkg.name}
 * ${pkg.description}
 * @author ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */
`;


gulp.task("server", (cb) => {
  server.init({
    notify: false,
    open: false,
    server: {
      baseDir: "./demo"
    },
    ghostMode: false
  });
  cb();
});


gulp.task("server:reload", (cb) => {
  server.reload();
  cb();
});


gulp.task("demo:sass", () => {
  return gulp.src("./demo/sass/**/*.scss")
    .pipe($.plumber())
    .pipe($.sass({outputStyle: "compressed"}).on("error", $.sass.logError))
    .pipe($.autoprefixer())
    .pipe(gulp.dest("./demo/css"))
    .pipe(server.stream());
});


gulp.task("demo", ["demo:sass"]);


gulp.task("rollup", (cb) => {
  process.env.NODE_ENV = "production";
  rollup.rollup({
    entry: "src/sweet-scroll.js",
    plugins: [babel()]
  }).then((bundle) => {
    var result = bundle.generate({
      format: "umd",
      moduleName: "SweetScroll",
      banner: banner
    });
    fs.writeFileSync("sweet-scroll.js", result.code);
    fs.writeFileSync("demo/js/sweet-scroll.js", result.code);
    server.reload();
    cb();
  }).catch((err) => {
    console.log(err);
    cb();
  });
});


gulp.task("uglify", () => {
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


gulp.task("lint", () => {
  return gulp.src(["./src/**/*.js", "./test/**/*.js"])
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});


gulp.task("test", ["lint", "karma"]);


gulp.task("build", (cb) => {
  runSequence(
    "rollup",
    "uglify",
    cb
  );
});


gulp.task("watch", (cb) => {
  gulp.watch("./src/**/*", ["rollup"]);
  gulp.watch("./test/**/*", ["test"]);
  gulp.watch("./demo/**/*.html", ["server:reload"]);
  gulp.watch("./demo/**/*.scss", ["demo:sass"]);
  cb();
});


gulp.task("start", ["server", "watch"]);
