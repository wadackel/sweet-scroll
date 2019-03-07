import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const banner = `/*! @preserve ${pkg.name} v${pkg.version} - ${pkg.author} | ${
  pkg.license
} License */`;

export default {
  input: 'src/index.ts',
  output: {
    name: 'SweetScroll',
    file: 'sweet-scroll.js',
    format: 'umd',
    banner,
  },
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
};
