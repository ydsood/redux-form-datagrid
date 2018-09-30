import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import peerDeps from 'rollup-plugin-peer-deps-external';
import filesize from 'rollup-plugin-filesize';



export default {
  input: 'lib/index.js',
  output: {
    file: 'build/bundle.min.js',
    format: 'umd',
    sourcemap: true,
    name: 'redux-form-datagrid'
  },
  plugins: [
    peerDeps(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs(),
    uglify,
    filesize()
  ]
};
