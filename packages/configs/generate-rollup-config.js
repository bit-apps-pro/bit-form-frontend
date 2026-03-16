/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import { getPackageFileList } from './package-helpers'

export default function generateRollupConfig(options = {}) {
  const {
    isFrontend = true,
    useBrowserResolution = isFrontend,
    commonJSPackages = [], // Empty array = NO CommonJS processing by default
    esmPackages = [],
  } = options

  const packageJson = require('./package.json')
  const inputFileName = packageJson.name
  const fileNames = getPackageFileList(inputFileName)
  const isDev = process.env.NODE_ENV === 'dev'

  const terserOptions = {
    compress: {
      passes: 10,
      drop_console: true,
    },
    output: {
      comments: false,
    },
  }

  const external = [
    'window',
    'document',
    ...fileNames,
  ]

  const plugins = [
    ...isDev ? [
      serve({ open: true, port: 3030 }),
      livereload(),
    ] : [],
    resolve({
      browser: useBrowserResolution,
      preferBuiltins: !isFrontend, // ← This uses isFrontend!
    }),
    // Conditionally add CommonJS plugin only if needed
    ...(commonJSPackages.length > 0 ? [commonjs({
      include: commonJSPackages.map(pkg => new RegExp(`node_modules\\/(${pkg})`)),
      exclude: esmPackages.map(pkg => new RegExp(`node_modules\\/(${pkg})`)),
      transformMixedEsModules: false,
    })] : []),
    babel({
      presets: [
        [
          '@babel/preset-env',
          { targets: isDev ? '> 20%' : '> 2%' },
        ],
      ],
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
  ]

  const srcFolder = 'src'
  const distFolder = 'dist'

  const getOutputConfig = fileName => {
    const defaultConf = {
      file: `${distFolder}/${fileName}.min.js`,
      name: fileName.replace(/-/g, '_'),
      format: 'iife',
      globals: {
        document: 'document',
        window: 'window',
      },
    }
    if (!isDev) defaultConf.plugins = [terser(terserOptions)]
    return [defaultConf]
  }

  return fileNames.map(fileName => ({
    input: `${srcFolder}/${fileName}.js`,
    external,
    plugins,
    output: getOutputConfig(fileName),
    onwarn: (warning) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return
      console.warn(warning.message)
    },
  }))
}
