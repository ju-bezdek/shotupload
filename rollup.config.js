import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isDev = process.env.NODE_ENV === 'development';

// Library build configuration
const libConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript2({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: "ESNext"
        }
      },
      check: true,
      clean: true,
    }),
    postcss(),
    !isDev && terser(),
  ].filter(Boolean),
  external: ['react', 'react-dom']
};

// Vanilla JS bundle
const vanillaConfig = {
  input: 'src/vanilla/index.ts',
  output: {
    file: 'dist/shotupload.min.js',
    format: 'iife',
    name: 'ShotUpload',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript2({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: "ESNext"
        }
      },
      check: true,
      clean: true,
    }),
    postcss(),
    !isDev && terser(),
  ].filter(Boolean),
};

// Dev configuration
const devConfig = isDev ? {
  input: 'src/dev/index.tsx',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    }
  },
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    typescript2({
      tsconfig: './tsconfig.json',
      check: true,
      clean: true,
    }),
    postcss(),
    serve({
      open: true,
      contentBase: 'public',
      port: 3000,
    }),
    livereload({ watch: 'public' }),
  ],
  external: ['react', 'react-dom']
} : null;

export default isDev ? [libConfig, vanillaConfig, devConfig] : [libConfig, vanillaConfig];
