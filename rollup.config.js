"use strict";

import babel from "rollup-plugin-babel"

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
  moduleName: "SweetScroll",
  format: "umd",
  plugins: [
    babel()
  ]
}
