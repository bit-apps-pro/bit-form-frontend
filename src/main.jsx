/* eslint-disable camelcase */
/* eslint-disable no-undef */
import 'core-js/stable'
import { createRenderer } from 'fela'
import customProperty from 'fela-plugin-custom-property'
import ReactDOM from 'react-dom/client'
import { RendererProvider } from 'react-fela'
import { HashRouter } from 'react-router-dom'
import 'regenerator-runtime/runtime'
import App from './App'
import './resource/sass/app.scss'
import './resource/sass/global.scss'
import './resource/sass/responsive.scss'
import customProperties from './styles/1.customProperties'

const renderer = createRenderer({
  plugins: [
    customProperty(customProperties),
  ],
  filterClassName: cls => cls.indexOf('cp') !== -1,
  devMode: process.env.NODE_ENV === 'development',
})

// if (typeof bits !== 'undefined' && bits.assetsURL !== undefined) {
// eslint-disable-next-line camelcase
// __webpack_public_path__ = `${bits.assetsURL}/js/`
// }
// if (typeof bits !== 'undefined' && bits.baseURL && `${window.location.pathname + window.location.search}#` !== bits.baseURL) {
//   bits.baseURL = `${window.location.pathname + window.location.search}#`
// }
// if (window.location.hash === '') {
//   window.location = `${window.location.href}#/`
// }
// if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register(`${__webpack_public_path__}service-worker.js`).then(registration => {
//       // eslint-disable-next-line no-console
//       console.log('SW registered: ', registration)
//     }).catch(registrationError => {
//       // eslint-disable-next-line no-console
//       console.log('SW registration failed: ', registrationError)
//     })
//   })
// } else {
//   // eslint-disable-next-line no-console
//   console.log('no sw')
// }

const root = ReactDOM.createRoot(document.getElementById('btcd-app'))
root.render(
  <RendererProvider renderer={renderer}>
    <HashRouter>
      <App />
    </HashRouter>
  </RendererProvider>,
)

// serviceWorker.register();
