/* eslint-disable import/no-import-module-exports */
// eslint-disable-next-line import/no-relative-packages
import generateRollupConfig from '../configs/generate-rollup-config'

module.exports = generateRollupConfig({
  isFrontend: true, // Browser environment
  useBrowserResolution: false, // But use "main" field, not "browser"
  commonJSPackages: ['filepond-plugin-media-preview'],
})
