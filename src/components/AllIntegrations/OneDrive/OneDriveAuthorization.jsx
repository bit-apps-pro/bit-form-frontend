/* eslint-disable no-unused-expressions */
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { $bits } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import CopyText from '../../Utilities/CopyText'
import AuthorizeBtn from '../AuthorizeBtn'
import { getAllOneDriveFolders, handleAuthorize } from './OneDriveCommonFunc'

export default function OneDriveAuthorization({
  flowID: formID, oneDriveConf, setOneDriveConf, step, setStep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo, authorizedAction,
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ clientId: '', clientSecret: '' })
  const bits = useAtomValue($bits)
  const { siteURL } = bits

  const nextPage = () => {
    getAllOneDriveFolders(formID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar)
    setStep(2)
    document.querySelector('.btcd-s-wrp').scrollTop = 0
  }

  const handleInput = e => {
    const newConf = { ...oneDriveConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setOneDriveConf(newConf)
  }

  useEffect(() => {
    if (isAuthorized) {
      authorizedAction()
    }
  }, [isAuthorized])
  return (
    <div className="btcd-stp-page" style={{ width: 900, height: `${100}%` }}>
      <div className="mt-3">
        <b>{__('Integration Name:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={oneDriveConf.name}
        type="text"
        placeholder={__('Integration Name...')}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__('Homepage URL:')}</b>
      </div>
      <CopyText
        value={siteURL}
        className="field-key-cpy w-6 ml-0"
        readOnly={isInfo}
        setSnackbar={setSnackbar}
      />

      <div className="mt-3">
        <b>{__('Authorized Redirect URIs:')}</b>
      </div>
      <CopyText
        value={redirectLocation || `${bits.oneDriveRedirectURL}`}
        className="field-key-cpy w-6 ml-0"
        readOnly={isInfo}
      />
      <small className="d-blk mt-3">
        {__('To Get Client Id & Secret, Please Visit')}
        &nbsp;
        <a
          className="btcd-link"
          href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
          target="_blank"
          rel="noreferrer"
        >
          {__('Azure Portal')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('OneDrive Client Id:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientId"
        value={oneDriveConf.clientId}
        type="text"
        placeholder={__('Client Id...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.clientId}</div>

      <div className="mt-3"><b>{__('OneDrive Client Secret:')}</b></div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientSecret"
        value={oneDriveConf.clientSecret}
        type="text"
        placeholder={__('Client Secret...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.clientSecret}</div>

      {!isInfo && (
        <>
          <AuthorizeBtn
            isAuthorized={isAuthorized}
            isLoading={isLoading}
            handleAuthorize={() => handleAuthorize(oneDriveConf, setOneDriveConf, setIsAuthorized, setIsLoading, setError)}
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
