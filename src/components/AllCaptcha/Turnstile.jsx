import { useAtom, useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import { $turnstile } from '../../GlobalStates/AppSettingsStates'
import { $bits } from '../../GlobalStates/GlobalStates'
import BackIcn from '../../Icons/BackIcn'
import { deepCopy } from '../../Utils/Helpers'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import app from '../../styles/app.style'
import LoaderSm from '../Loaders/LoaderSm'
import CopyText from '../Utilities/CopyText'
import SnackMsg from '../Utilities/SnackMsg'
import UserGuideCaptcha from './UserGuideCaptcha'

export default function Turnstile() {
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState({ show: false })
  const [turnstile, setTurnstile] = useAtom($turnstile)
  const bits = useAtomValue($bits)
  const turnstileWrapElmRef = useRef(null)
  const { css } = useFela()

  const siteURL = bits.siteURL.replace(/(^\w+:|^)\/\//, '')

  const onInput = ({ target }) => {
    const { name, value } = target
    const temp = deepCopy(turnstile)
    temp[name] = value
    setTurnstile(temp)
  }

  const saveCaptcha = () => {
    setLoading(true)

    const data = {
      reCaptcha: turnstile,
      integrationName: 'turnstile reCaptcha',
      integrationType: 'turnstileCaptcha',
    }

    bitsFetch(data, 'bitforms_save_grecaptcha')
      .then(res => {
        if (res !== undefined && res.success) {
          if (res.data && res.data.id) {
            setTurnstile({ ...turnstile, id: res.data.id })
          }
          setSnack({ ...{ show: true, msg: __('Captcha Settings Updated') } })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  return (
    <>
      <div className={css({ ow: 'hidden', w: '70%' })}>
        <SnackMsg snack={snack} setSnackbar={setSnack} />
        <div className={css({ flx: 'align-center', fd: 'row' })}>
          <Link
            to="/app-settings/recaptcha"
            className={`${css(app.btn)} btcd-btn-o-gray`}
          >
            <BackIcn className="mr-1" />
            Back
          </Link>
          <h2 className={css({ w: '100%', ta: 'center' })}>{__('Cloudflare Turnstile CAPTCHA')}</h2>
        </div>
        <small>
          {__('Turnstile is a free service that protects your website from spam and abuse.')}
          <a
            className="btcd-link"
            href="https://developers.cloudflare.com/turnstile/"
            target="_blank"
            rel="noopener noreferrer"
          >
            &nbsp;
            {__('Learn More')}
          </a>
        </small>
        <div className="btcd-hr" />
        <div className={`btcd-captcha ${css({ m: 5 })}`}>
          <div className="mt-3">{__('Domain URL:')}</div>
          <CopyText value={siteURL} className="field-key-cpy ml-0" />
          <div className="mt-2">
            <label htmlFor="captcha-key">
              {__('Site Key')}
              <input
                id="captcha-key"
                onChange={e => onInput(e)}
                name="siteKey"
                className="btcd-paper-inp mt-1"
                value={turnstile?.siteKey}
                placeholder="Site Key"
                type="text"
              />
            </label>
          </div>
          <div className="mt-2">
            <label htmlFor="captcha-secret">
              {__('Secret Key')}
              <input
                id="captcha-secret"
                onChange={e => onInput(e)}
                name="secretKey"
                className="btcd-paper-inp mt-1"
                value={turnstile.secretKey}
                placeholder="Secret Key"
                type="text"
              />
            </label>
          </div>
          <div className="mt-2">
            <p>
              {__('To get Site Key and Secret, Please Visit')}
              &nbsp;
              <a
                className="btcd-link"
                href="https://dash.cloudflare.com/?to=/:account/turnstile"
                target="_blank"
                rel="noreferrer"
              >
                {__('Cloudflare Turnstile reCAPTCHA Admin')}
              </a>
            </p>
          </div>
          <div className="mt-2">
            {/* <span>{__('Preview')}</span> */}
            <div className="turnstile-wrp" ref={turnstileWrapElmRef}>
              <div className="turnstile-captcha-preview" />
            </div>
          </div>
          <button
            onClick={() => saveCaptcha()}
            type="button"
            className={`${css(app.btn)} btn-md f-left blue`}
            disabled={loading}
          >
            {turnstile?.id ? __('Update') : __('Save')}
            {loading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
          </button>
        </div>
      </div>
      <UserGuideCaptcha type="Turnstile" />
    </>
  )
}
