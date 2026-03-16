/* eslint-disable-next-line no-undef */
// import { withQuicklink } from 'quicklink/dist/react/hoc'
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { $connectedApps } from '../GlobalStates/AppSettingsStates'
import { $bits, $formId } from '../GlobalStates/GlobalStates'
import { compareBetweenVersions, deepCopy, sortArrOfObj } from '../Utils/Helpers'
import integs from '../Utils/StaticData/availableIntegrationsList'
import tutorialLinks from '../Utils/StaticData/tutorialLinks'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import style from '../styles/integrations.style'
import ConnectedAppInfo from './AllIntegrations/ConnectedAppInfo'
import ConnectedAppsList from './AllIntegrations/ConnectedAppsList'
import EditInteg from './AllIntegrations/EditInteg'
import NewAppConnection from './AllIntegrations/NewAppConnection'
import ConfirmModal from './Utilities/ConfirmModal'
import Modal from './Utilities/Modal'
import SnackMsg from './Utilities/SnackMsg'

function GlobalIntegrations() {
  const [connectApps, setConnectedApps] = useAtom($connectedApps)
  const connectedApps = deepCopy(connectApps)
  const [showMdl, setShowMdl] = useState(false)
  const [confMdl, setconfMdl] = useState({ show: false })
  const [snack, setSnackbar] = useState({ show: false })
  const { formType } = useParams()
  const formID = useAtomValue($formId)
  const navigate = useNavigate()
  const bits = useAtomValue($bits)
  const { isPro, proInfo } = bits
  const { css } = useFela()

  // const allIntegURL = `/form/settings/${formType}/${formID}/integrations`

  const allIntegURL = '/app-settings/integrations'

  const [availableIntegs, setAvailableIntegs] = useState(sortArrOfObj(integs, 'type'))

  const getStrInsideParenthesis = (str) => {
    const startIndex = str.indexOf('(')
    const endIndex = str.indexOf(')')
    return str.slice(startIndex + 1, endIndex)
  }

  const setNewInteg = inte => {
    if (inte.pro && !proInfo?.installedVersion && !isPro) {
      toast.error('This integration is only available in Bit Form Pro.')
      return false
    }
    if (inte.proVer && isPro && proInfo?.installedVersion && compareBetweenVersions(inte?.proVer, proInfo.installedVersion) === 1) {
      toast.error('Please update to the latest version of Bit Form Pro.')
      return false
    }
    const { type } = inte

    const action = type.includes('(') || type.includes(')') ? getStrInsideParenthesis(type) : type
    closeIntegModal()
    navigate(`${allIntegURL}/new/${action}`)
  }

  const closeIntegModal = () => {
    setShowMdl(false)
    setTimeout(() => setAvailableIntegs(sortArrOfObj(integs, 'type')), 500)
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const searchInteg = e => {
    const { value } = e.target
    const filtered = integs.filter(integ => {
      const integName = (integ.title || integ.type).toLowerCase()
      return integName.includes(value.toLowerCase())
    })
    setAvailableIntegs(sortArrOfObj(filtered, 'type'))
  }

  const deleteConnectedApp = appInfo => {
    // const tempIntegration = { ...connectedApps[appInfo] }
    // newInteg.splice(appInfo, 1)
    // setConnectedApps(newInteg)
    bitsFetch({ appId: appInfo.id }, 'bitforms_delete_connected_app')
      .then(response => {
        if (response && response.success) {
          toast.success(response.data.message || __('App delete successfully.'))
          setConnectedApps(oldApps => create(oldApps, drftApps => drftApps.filter(appConf => appConf.id !== appInfo.id)))
        } else if (response?.data?.data) {
          // setConnectedApps(newInteg)
          toast.error(`${__('App deletion failed Cause')}:${response.data.data}. ${__('please try again')}`)
        } else {
          // setConnectedApps(newInteg)
          toast.error(__('App deletion failed. please try again'))
        }
      })
  }

  const appDelConf = appInfo => {
    confMdl.btnTxt = __('Delete')
    confMdl.body = __('Are you sure to delete this App configuration?')
    confMdl.btnClass = ''
    confMdl.action = () => { deleteConnectedApp(appInfo); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
      <Routes>
        <Route
          index
          element={(
            <>
              <h2>{__('Integrations')}</h2>
              <h5>
                {__('How to setup Integrations:')}
                &nbsp;
                <a href={tutorialLinks.integrations.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
                  {__('YouTube')}
                </a>
                <a href={tutorialLinks.integrations.link} target="_blank" rel="noreferrer" className="doc-txt">
                  {__('Documentation')}
                </a>
              </h5>

              <div className="btcd-inte-wrp">
                <h4 className="txt-center">{__('Connected/Authorized Platforms')}</h4>
                <ConnectedAppsList allIntegURL={allIntegURL} deleteAction={appDelConf} />
              </div>
              <hr />
              <div className={css(style.integWrp)}>
                <input
                  aria-label="Search Ingegration"
                  type="search"
                  className="btcd-paper-inp w-5 mt-3"
                  onChange={searchInteg}
                  placeholder={__('Search Available Integrations...')}
                  style={{ height: 37 }}
                />
                <div className="">
                  {availableIntegs.map((inte, i) => (
                    <div
                      key={`inte-sm-${i + 2}`}
                      onClick={() => !inte.disable && setNewInteg(inte)}
                      onKeyDown={() => !inte.disable && setNewInteg(inte)}
                      role="button"
                      tabIndex="0"
                      className={`${css(style.thumb)} ${inte.disable && !inte.pro && css(style.integCardDisabled)}`}
                    >
                      {/* {(inte.pro && !isPro) && (
                            <div className={css(style.thumbPro)}>
                              <a className={css(style.thumbProTxt)} href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                                {__('Available on')}
                                <br />
                                {__('Pro')}
                              </a>
                            </div>
                          )} */}
                      <img className={css(style.thumbImg)} loading="lazy" src={inte.logo} alt="" />
                      <div className={css(style.thumbTitle)}>
                        {inte.title || inte.type}
                      </div>
                    </div>
                  ))}
                </div>

                <Modal
                  title={__('Available Integrations')}
                  show={showMdl}
                  setModal={closeIntegModal}
                  style={{ width: 1000 }}
                >
                  <div className=" btcd-inte-wrp txt-center">
                    <input
                      aria-label="Search Ingegration"
                      type="search"
                      className="btcd-paper-inp w-5 mt-3"
                      onChange={searchInteg}
                      placeholder="Search Integrations..."
                      style={{ height: 37 }}
                    />
                    <div className="flx flx-center flx-wrp pb-3">
                      {availableIntegs.map((inte, i) => (
                        <div
                          key={`inte-sm-${i + 2}`}
                          onClick={() => !inte.disable && setNewInteg(inte)}
                          onKeyDown={() => !inte.disable && setNewInteg(inte)}
                          role="button"
                          tabIndex="0"
                          className={`${css(style.thumb)} ${inte.disable && !inte.pro && css(style.integCardDisabled)}`}
                        >
                          <img className={css(style.thumbImg)} loading="lazy" src={inte.logo} alt="" />
                          <div className={css(style.thumbTitle)}>
                            {inte.title || inte.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Modal>
              </div>
            </>
          )}
        />
        <Route path="/new/:integUrlName/*" element={<NewAppConnection allIntegURL={allIntegURL} />} />
        {connectedApps?.length
          && (<Route path="/edit/:id/*" element={<EditInteg allIntegURL={allIntegURL} />} />)}
        {connectedApps && connectedApps.length > 0
          && (<Route path="/app-info/:id/*" element={<ConnectedAppInfo allIntegURL={allIntegURL} />} />)}
      </Routes>
    </div>
  )
}

export default GlobalIntegrations
