import babel from "rollup-plugin-babel";

const pkg = require("./package.json");
const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 * @author ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */
`;

export default {
  banner,
  entry: "src/sweet-scroll.js",
  dest: "sweet-scroll.js",
  moduleName: "SweetScroll",
  format: "umd",
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ]
};
