import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CloseIcn from '../../../Icons/CloseIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import LoaderSm from '../../Loaders/LoaderSm'
import TutorialLink from '../../Utilities/TutorialLink'
import AuthorizeBtn from '../AuthorizeBtn'
import { saveConnectedIntegrationApp } from '../integrationHelper'
import { refreshActiveCampaingHeader } from './ActiveCampaignCommonFunc'

export default function ActiveCampaignAuthorization({
  activeCampaingConf, setActiveCampaingConf, step, setstep, setSnackbar, isInfo, isLoading, setIsLoading, allIntegURL, authorizedAction,
}) {
  const navigate = useNavigate()
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_key: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)

  const handleAuthorize = () => {
    const newConf = { ...activeCampaingConf }
    if (!newConf.name || !newConf.api_key || !newConf.api_url) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty') : '',
        api_key: !newConf.api_key ? __('Access API Key cann\'t be empty') : '',
        api_url: !newConf.api_url ? __('Access API URL cann\'t be empty') : '',
      })
      return
    }
    setIsLoading('auth')
    const data = {
      api_key: newConf.api_key,
      api_url: newConf.api_url,
    }
    bitsFetch(data, 'bitforms_aCampaign_authorize')
      .then(result => {
        if (result?.success) {
          setisAuthorized(true)
          setSnackbar({ show: true, msg: __('Authorized Successfully', 'bitfrom') })
          saveConnectedIntegrationApp(newConf)
          setTimeout(() => { navigate(allIntegURL) }, 1000)
        }
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...activeCampaingConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setActiveCampaingConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    refreshActiveCampaingHeader(activeCampaingConf, setActiveCampaingConf, setIsLoading, setSnackbar)
    setstep(2)
  }

  useEffect(() => {
    if (isAuthorized) {
      authorizedAction()
    }
  }, [isAuthorized])

  return (
    <>
      <TutorialLink
        title={tutorialLinks.activeCampaign.title}
        youTubeLink={tutorialLinks.activeCampaign.link}
      />
      <div className="btcd-stp-page" style={{ width: 900, height: '100%' }}>
        <div className="mt-3 wdt-200"><b>{__('Integration Name:')}</b></div>
        <input
          aria-label="Integration name"
          className="btcd-paper-inp w-6 mt-1"
          onChange={handleInput}
          name="name"
          value={activeCampaingConf.name}
          type="text"
          placeholder={__('Integration Name...')}
          disabled={isInfo}
        />
        <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>

        <div className="mt-3 wdt-200"><b>{__('Access API URL:')}</b></div>
        <input
          aria-label="Access API URL"
          className="btcd-paper-inp w-6 mt-1"
          onChange={handleInput}
          name="api_url"
          value={activeCampaingConf.api_url}
          type="text"
          placeholder={__('Access API URL...')}
          disabled={isInfo}
        />
        <div style={{ color: 'red', fontSize: '15px' }}>{error.api_url}</div>

        <div className="mt-3 wdt-200"><b>{__('Access API Key:')}</b></div>
        <input
          aria-label="Access API Key"
          className="btcd-paper-inp w-6 mt-1"
          onChange={handleInput}
          name="api_key"
          value={activeCampaingConf.api_key}
          type="text"
          placeholder={__('Access API Key...')}
          disabled={isInfo}
        />
        <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>
        {isLoading === 'auth' && (
          <div className="flx mt-5">
            <LoaderSm size={25} clr="#022217" className="mr-2" />
            Checking API Key!!!
          </div>
        )}

        {(showAuthMsg && !isAuthorized && !isLoading) && (
          <div className="flx mt-5" style={{ color: 'red' }}>
            <span className="mr-2" style={{ fontSize: 30, marginTop: -5 }}>
              <CloseIcn size="15" />
            </span>
            Sorry, API key is invalid
          </div>
        )}
        {!isInfo && (
          <>
            <AuthorizeBtn
              isAuthorized={isAuthorized}
              handleAuthorize={handleAuthorize}
              isLoading={isLoading}
            />
            <br />
            {/* <NextBtn
              nextPageHandler={() => nextPage(2)}
              disabled={!isAuthorized}
            /> */}
          </>
        )}
      </div>
    </>
  )
}
