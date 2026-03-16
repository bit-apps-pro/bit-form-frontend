import { useEffect, useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import AuthorizeBtn from '../AuthorizeBtn'
import { fetchAllTags, handleAuthorize } from './GroundhoggCommonFunc'

export default function GroundhoggAuthorization({
  formID, groundhoggConf, setGroundhoggConf, step, setstep, isLoading, setIsLoading, setSnackbar, isInfo, authorizedAction,
}) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ token: '', public_key: '', domainName: '' })
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
    fetchAllTags(formID, groundhoggConf, setGroundhoggConf, setIsLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...groundhoggConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setGroundhoggConf(newConf)
  }

  useEffect(() => {
    if (isAuthorized) {
      authorizedAction()
    }
  }, [isAuthorized])

  return (
    <div
      className="btcd-stp-page"
      style={{ width: 900, height: 'auto' }}
    >
      <div className="mt-3">
        <b>{__('Integration Name:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={groundhoggConf.name}
        type="text"
        placeholder={__('Integration Name...')}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__('Your Domain Name:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="domainName"
        value={groundhoggConf.domainName}
        type="text"
        placeholder={__('Integration Name...')}
        disabled={isInfo}
      />
      <div className="mt-3">
        <b>{__('Public Key:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="public_key"
        value={groundhoggConf.public_key}
        type="text"
        placeholder={__('Public Key...')}
        disabled={isInfo}
      />
      <div className="mt-3">
        <b>{__('Token:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="token"
        value={groundhoggConf.token}
        type="text"
        placeholder={__('Token...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientSecret}</div>
      {!isInfo && (
        <>
          <AuthorizeBtn
            isAuthorized={isAuthorized}
            isLoading={isLoading}
            handleAuthorize={() => handleAuthorize(
              groundhoggConf,
              setGroundhoggConf,
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
