import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const banner = `/*! @preserve ${pkg.name} v${pkg.version} - ${pkg.author} | ${pkg.license} License */`;

export default {
  banner,
  entry: 'src/index.ts',
  dest: 'sweet-scroll.js',
  moduleName: 'SweetScroll',
  format: 'umd',
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
};
