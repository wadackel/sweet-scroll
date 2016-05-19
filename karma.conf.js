module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["mocha", "browserify", "fixture", "phantomjs-shim"],
    files: [
      "test/**/*.spec.js",
      "test/fixtures/**/*.html"
    ],
    exclude: [],
    preprocessors: {
      "test/**/*.spec.js": "browserify",
      "test/**/*.html": "html2js"
    },
    browserify: {
      debug: true,
      transform: [
        ["babelify", { plugins: ["babel-plugin-espower"] }]
      ]
    },
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["PhantomJS"],
    singleRun: false,
    concurrency: Infinity
  });
};
