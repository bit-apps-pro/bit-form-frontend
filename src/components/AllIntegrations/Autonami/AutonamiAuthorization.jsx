/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react'
import CloseIcn from '../../../Icons/CloseIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import AuthorizeBtn from '../AuthorizeBtn'
import NextBtn from '../NextBtn'

export default function AutonamiAuthorization({ autonamiConf, setAutonamiConf, step, nextPage, setSnackbar, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  const [error, setError] = useState({ integrationName: '' })
  useEffect(() => () => {
    setIsMounted(false)
  }, [])

  const handleAuthorize = () => {
    setIsLoading('auth')
    bitsFetch({}, 'bitforms_autonami_authorize')
      .then(result => {
        if (isMounted) {
          if (result?.success) {
            setIsAuthorized(true)
            setSnackbar({ show: true, msg: __('Connect Successfully', 'bitfrom') })
          }
          setShowAuthMsg(true)
          setIsLoading(false)
        }
      })
  }
  const handleInput = e => {
    const newConf = { ...autonamiConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setAutonamiConf(newConf)
  }

  return (
    <>
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && `${100}%` } }}>
        <TutorialLink
          title={tutorialLinks.autonami.title}
          youTubeLink={tutorialLinks.autonami.link}
        />
        <div className="mt-3">
          <b>{__('Integration Name:', 'bit-form')}</b>
        </div>
        <input
          className="btcd-paper-inp w-5 mt-1"
          onChange={handleInput}
          name="name"
          value={autonamiConf.name}
          type="text"
          placeholder={__('Integration Name...')}
          disabled={isInfo}
        />

        {(showAuthMsg && !isAuthorized && !isLoading) && (
          <div className="flx mt-4" style={{ color: 'red' }}>
            <CloseIcn size="30" />
            Please! First Install or Active Autonami Pro Plugin
          </div>
        )}
        <br />
        <AuthorizeBtn
          isAuthorized={isAuthorized}
          isLoading={isLoading}
          handleAuthorize={() => handleAuthorize()}
        />
        <br />
        <NextBtn
          nextPageHandler={() => nextPage(2)}
          disabled={!isAuthorized}
        />
      </div>
    </>
  )
}
