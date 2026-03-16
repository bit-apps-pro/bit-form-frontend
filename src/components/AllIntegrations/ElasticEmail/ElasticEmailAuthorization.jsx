/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { useState } from 'react'
import { useFela } from 'react-fela'
import CloseIcn from '../../../Icons/CloseIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import LoaderSm from '../../Loaders/LoaderSm'
import TutorialLink from '../../Utilities/TutorialLink'
import AuthorizeBtn from '../AuthorizeBtn'
import NextBtn from '../NextBtn'
import { getAllList } from './ElasticEmailCommonFunc'

export default function ElasticEmailAuthorization({ elasticEmailConf, setElasticEmailConf, step, setstep, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState({ authorized: false, errorMsg: '' })
  const [error, setError] = useState({ name: '', api_key: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { css } = useFela()

  const handleAuthorize = () => {
    const newConf = { ...elasticEmailConf }
    if (!newConf.name || !newConf.api_key) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty') : '',
        api_key: !newConf.api_key ? __('API Key cann\'t be empty') : '',
      })
      return
    }
    setIsLoading('auth')
    const data = { api_key: newConf.api_key }
    bitsFetch(data, 'bitforms_elasticemail_authorize')
      .then(result => {
        if (result?.success) {
          setIsAuthorized({ authorized: true, errorMsg: '' })
        } else {
          setIsAuthorized({ authorized: false, errorMsg: result?.data || '' })
        }
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...elasticEmailConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setElasticEmailConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    !elasticEmailConf?.default && getAllList(elasticEmailConf, setElasticEmailConf, setIsLoading)
    setstep(2)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}
    >
      <TutorialLink
        title={tutorialLinks.elasticemail.title}
        youTubeLink={tutorialLinks.elasticemail.link}
      />

      <div className="mt-3"><b>{__('Integration Name:')}</b></div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={elasticEmailConf.name}
        type="text"
        placeholder={__('Integration Name...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>
      <div className="mt-3"><b>{__('API Key:')}</b></div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="api_key"
        value={elasticEmailConf.api_key}
        type="text"
        placeholder={__('API Key...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>
      <small className="d-blk mt-5">
        {__('To get API Key, Please Visit')}
        {' '}
        <a
          className="btcd-link"
          href="https://app.elasticemail.com/marketing/settings/new/manage-api"
          target="_blank"
          rel="noreferrer"
        >
          {__('Elastic Email API Console')}
        </a>
      </small>
      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking API Key!!!
        </div>
      )}

      {(showAuthMsg && !isAuthorized.authorized && !isLoading) && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <CloseIcn size="15" className={css({ mr: 10 })} />
          {' '}
          {isAuthorized.errorMsg || "Couldn't authorize, Please check API Key"}
        </div>
      )}
      {!isInfo && (
        <>
          <AuthorizeBtn
            isAuthorized={isAuthorized.authorized}
            isLoading={isLoading}
            handleAuthorize={() => handleAuthorize()}
          />
          <br />
          <NextBtn
            nextPageHandler={() => nextPage(2)}
            disabled={!isAuthorized.authorized}
          />
        </>
      )}
    </div>
  )
}
