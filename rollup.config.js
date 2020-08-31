import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

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
              reserved: [
                // 'getElementById',
                // 'getContext',
                // 'drawImage',
                // 'fill',
                // 'moveTo',
                // 'lineTo',
                // 'linearRampToValueAtTime',
                // 'createOscillator'
                // ... lots more lines ...
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
