/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import AuthorizeBtn from '../AuthorizeBtn'
import { getAllDropboxFolders, handleAuthorize } from './DropboxCommonFunc'

export default function DropboxAuthorization({
  formID, dropboxConf, setDropboxConf, step, setStep, isLoading, setIsLoading, isInfo, authorizedAction,
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ apiKey: '', apiSecret: '' })

  const nextPage = () => {
    getAllDropboxFolders(formID, dropboxConf, setDropboxConf, setIsLoading)
    setStep(2)
    document.querySelector('.btcd-s-wrp').scrollTop = 0
  }

  const handleInput = e => {
    const newConf = { ...dropboxConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setDropboxConf(newConf)
  }

  const getAccessCode = () => {
    if (!dropboxConf.apiKey || !dropboxConf.apiSecret) {
      toast.error(__('Please enter API key and API secret'))
      return
    }
    window.open(`https://www.dropbox.com/oauth2/authorize?client_id=${dropboxConf.apiKey}&token_access_type=offline&response_type=code`, '_blank')
  }

  useEffect(() => {
    if (isAuthorized) {
      authorizedAction()
    }
  }, [isAuthorized])

  return (
    <div
      className="btcd-stp-page"
      style={{ width: 900, height: `${100}%` }}
    >
      <TutorialLink
        title={tutorialLinks.dropbox.title}
        youTubeLink={tutorialLinks.dropbox.link}
      />
      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-form')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={dropboxConf.name}
        type="text"
        placeholder={__('Integration Name...')}
        disabled={isInfo}
      />

      <small className="d-blk mt-3">
        {__('To Get Api Key & Secret, Please Visit')}
        &nbsp;
        <a
          className="btcd-link"
          rel="noreferrer"
          target="_blank"
          href="https://www.dropbox.com/developers/apps/create?_tk=pilot_lp&_ad=ctabtn1&_camp=create"
        >
          {__('Dropbox API Console')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('Dropbox Api Key:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="apiKey"
        value={dropboxConf.apiKey}
        type="text"
        placeholder={__('Api Key...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.apiKey}</div>

      <div className="mt-3">
        <b>{__('Dropbox Api Secret:')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="apiSecret"
        value={dropboxConf.apiSecret}
        type="text"
        placeholder={__('Api Secret...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.apiSecret}</div>

      <small className="d-blk mt-3">
        {__('To Get Access Code, Please Visit')}
        &nbsp;
        <span
          className="btcd-link"
          style={{ cursor: 'pointer' }}
          onClick={getAccessCode}
          aria-hidden="true"
        >
          {__('Dropbox Access Code')}
        </span>
      </small>

      <div className="mt-3"><b>{__('Dropbox Access Code:')}</b></div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="accessCode"
        value={dropboxConf.accessCode}
        type="text"
        placeholder={__('Access Code...')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.accessCode}</div>

      {!isInfo && (
        <>
          <AuthorizeBtn
            isAuthorized={isAuthorized}
            isLoading={isLoading}
            handleAuthorize={() => handleAuthorize(dropboxConf, setDropboxConf, setIsAuthorized, setIsLoading)}
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
