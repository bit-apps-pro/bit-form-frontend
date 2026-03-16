/* eslint-disable react/jsx-no-useless-fragment */
import loadable from '@loadable/component'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import logo from '../logo.svg'
import { $bits, $unsplashMdl } from './GlobalStates/GlobalStates'
import { __ } from './Utils/i18nwrap'
import ChangelogToggle from './components/ChangelogToggle'
import UnsplashImageViewer from './components/CompSettings/StyleCustomize/UnsplashImageViewer'
import BuilderLoader from './components/Loaders/BuilderLoader'
import Loader from './components/Loaders/Loader'
import MigrationModal from './components/MigrationModal'
import Modal from './components/Utilities/Modal'
import AllForms from './pages/AllForms'
import DocNSupport from './pages/DocNSupport'
import FormTemplatePage from './pages/FormTemplatePage'

const loaderStyle = { height: '90vh' }
const AppSettings = loadable(() => import('./pages/AppSettings'), { fallback: <Loader className="g-c" style={loaderStyle} /> })
const FormDetails = loadable(() => import('./pages/FormDetails'), { fallback: <BuilderLoader /> })
const Error404 = loadable(() => import('./pages/Error404'), { fallback: <Loader className="g-c" style={loaderStyle} /> })

const { backgroundColor } = window.getComputedStyle(document.querySelector('#wpadminbar'))

export default function App() {
  const [unsplashMdl, setUnsplashMdl] = useAtom($unsplashMdl)
  const bits = useAtomValue($bits)
  useEffect(removeUnwantedCSS, [])

  const isAppSettingsActive = () => {
    const { pathname } = useLocation()
    return pathname.includes('/app-settings')
  }

  return (
    <>
      <Toaster
        position="bottom-center"
        containerStyle={{ inset: '-25px 30px 20px -10px' }}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--dp-blue-bg)',
            color: '#fff',
            bottom: 40,
            padding: '15px 18px',
            borderRadius: 12,
            boxShadow: '0 2px 7px rgb(0 0 0 / 30%), 0 3px 30px rgb(0 0 0 / 20%)',
          },
        }}
      />
      <MigrationModal />
      <div className="Btcd-App" style={{ backgroundColor }}>
        <div className="nav-wrp" style={{ backgroundColor }}>
          <div className="top-wrp">
            <div className="flx flx-between">
              <div className="flx">
                <div className="logo flx" title={__('Bit Form')}>
                  <Link to="/" className="flx">
                    <img src={logo} alt="bit form logo" className="ml-2" />
                    <span className="ml-2">Bit Form</span>
                  </Link>
                </div>
                <nav className="top-nav ml-2">
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? 'app-link-active' : '')}
                  >
                    {__('Forms')}
                  </NavLink>

                  <NavLink
                    to="/form-templates"
                    className={({ isActive }) => (isActive ? 'app-link-active' : '')}
                  >
                    {__('Form Templates')}
                  </NavLink>

                  <NavLink
                    to="/app-settings/general"
                    className={isAppSettingsActive() ? 'app-link-active' : ''}
                  >
                    {__('App Settings')}
                  </NavLink>

                </nav>
              </div>
              <nav className="top-nav mr-2">
                {/* <a
                    target="_blank"
                    href="https://wordpress.org/support/plugin/bit-form/reviews/#new-post"
                    rel="noreferrer"
                  >
                    {__('Review Us')}
                  </a> */}
                <NavLink
                  to="/doc-support"
                  className={({ isActive }) => (isActive ? 'app-link-active' : '')}
                >
                  {__('Doc & Support')}
                </NavLink>
              </nav>
            </div>
            <div className="flx flx-center">
              {/* {!bits?.hideAnnouncementModal && <AnnouncementModal />} */}
              {/* {!bits?.hideCashbackModal && <CashbackModal />} */}
              <ChangelogToggle />
              {/* <ChangelogStepsModal /> */}
            </div>
          </div>
        </div>

        <div className="route-wrp">
          <Routes>
            <Route path="/" element={<AllForms />} />
            <Route path="/form/:page/:formType/:formID/*" element={<FormDetails />} />
            <Route path="/app-settings/*" element={<AppSettings />} />
            <Route path="/form-templates" element={<FormTemplatePage />} />
            <Route path="/doc-support" element={<DocNSupport />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </div>
      <Modal
        md
        autoHeight
        show={unsplashMdl}
        setModal={setUnsplashMdl}
        className="o-v"
        title={__('Unsplash Images')}
      >
        <div className="pos-rel" />
        <UnsplashImageViewer setModal={setUnsplashMdl} />
      </Modal>
    </>
  )
}

function removeUnwantedCSS() {
  const conflictStyles = ['bootstrap']
  const styles = document.styleSheets

  for (let i = 0; i < styles.length; i += 1) {
    if (styles[i].href !== null) {
      const regex = new RegExp(conflictStyles.join('.*css|'), 'gi')
      if (styles[i]?.href.match(regex)) {
        styles[i].disabled = true
      }
    }
  }
}
