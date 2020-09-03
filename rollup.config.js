import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

const env = process.env.BUILD || 'dev';

export default {
  input: './src/index.js',
  output: [
    {
      file: 'build/bundle.min.js',
      format: 'iife',
      name: 'bundle',
      plugins: [
        terser({
          mangle: {
            toplevel: true,
            properties: {
              debug: env === 'dev',
              reserved: [
                // protect these because they're called by name in world.js
                'tree1',
                'tree2',
                'tree3',
                'grass',
                'rock',
                'water',
                'sand',
                'tileGroup',
                // protect the note types!
                'quarter',
                'eighth',
                'triplet'
              ]
            }
          }
        })
      ],
      sourceMaps: env === 'production' ? false : 'inline'
    }
  ],
  plugins:
    env === 'production'
      ? [resolve(), json()]
      : [resolve(), json(), serve(), livereload()]
};
