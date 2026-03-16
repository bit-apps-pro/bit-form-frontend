import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import AuthorizeBtn from '../AuthorizeBtn'
import { fetchAllList, handleAuthorize } from './AcumbamailCommonFunc'

export default function AcumbamailAuthorization({
  acumbamailConf, setAcumbamailConf, step, setstep, isLoading, setIsLoading, setSnackbar, isInfo, authorizedAction,
}) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ dataCenter: '', clientId: '' })
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
    fetchAllList(acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...acumbamailConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setAcumbamailConf(newConf)
  }

  if (isAuthorized) authorizedAction()

  return (
    <div className="btcd-stp-page" style={{ width: 900, height: 'auto' }}>

      <TutorialLink
        title={tutorialLinks.acumbamail.title}
        youTubeLink={tutorialLinks.acumbamail.link}
      />

      <div className="mt-3"><b>{__('Integration Name:', 'bit-form')}</b></div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={acumbamailConf.name}
        type="text"
        placeholder={__('Integration Name...')}
        disabled={isInfo}
      />

      <small className="d-blk mt-3">
        {__('To Get Auth token, Please Visit')}
        &nbsp;
        <a
          className="btcd-link"
          href="https://acumbamail.com/en/apidoc/"
          target="_blank"
          rel="noreferrer"
        >
          {__('Acumbamail documentation')}

        </a>
      </small>

      <div className="mt-3"><b>{__('Auth Token:', 'bit-form')}</b></div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="auth_token"
        value={acumbamailConf.auth_token}
        type="text"
        placeholder={__('Auth Token...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.auth_token}</div>

      {!isInfo && (
        <>
          <AuthorizeBtn
            isAuthorized={isAuthorized}
            isLoading={isLoading}
            handleAuthorize={() => handleAuthorize(
              acumbamailConf,
              setAcumbamailConf,
              setError,
              setisAuthorized,
              setIsLoading,
              setSnackbar,
            )}
          />
          <br />
          {/* <NextBtn
            nextPageHandler={() => nextPage()}
            disabled={!isAuthorized}
          /> */}
        </>
      )}
    </div>
  )
}
