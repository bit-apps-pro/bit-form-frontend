import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import { $reCaptchaV2, $reCaptchaV3 } from '../../GlobalStates/AppSettingsStates'
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

export default function GoogleCaptcha({ ver }) {
  const [snack, setSnack] = useState({ show: false })
  const [loading, setLoading] = useState(false)

  const [reCaptchaV2, setCaptchaV2] = useAtom($reCaptchaV2)
  const [reCaptchaV3, setCaptchaV3] = useAtom($reCaptchaV3)
  const bits = useAtomValue($bits)
  const { css } = useFela()
  const captcha = ver === 'v2' ? 'reCaptchaV2' : 'reCaptchaV3'

  const saveCaptcha = version => {
    setLoading(true)
    const reCaptcha = version === 'v2' ? reCaptchaV2 : reCaptchaV3
    const data = {
      reCaptcha,
      integrationName: 'google reCaptcha',
      integrationType: version === 'v2' ? 'gReCaptcha' : 'gReCaptchaV3',
    }
    bitsFetch(data, 'bitforms_save_grecaptcha')
      .then(res => {
        if (res !== undefined && res.success) {
          if (res.data && res.data.id) {
            if (version === 'v2') {
              setCaptchaV2({ ...reCaptchaV2, id: res.data.id })
            } else if (version === 'v3') {
              setCaptchaV3({ ...reCaptchaV3, id: res.data.id })
            }
          }
          setSnack({ ...{ show: true, msg: __('Captcha Settings Updated') } })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const onInput = (e, version) => {
    if (version === 'v2') {
      const tmp = deepCopy(reCaptchaV2)
      tmp[e.target.name] = e.target.value
      setCaptchaV2(tmp)
    } else if (version === 'v3') {
      const tmpv3 = deepCopy(reCaptchaV3)
      tmpv3[e.target.name] = e.target.value
      setCaptchaV3(tmpv3)
    }
  }

  // remove http & https from site url
  const siteURL = bits.siteURL.replace(/(^\w+:|^)\/\//, '')

  return (
    <>
      <div className={css({ ow: 'hidden', w: '70%' })}>
        <SnackMsg snack={snack} setSnackbar={setSnack} />
        <div className={css({ fd: 'row', flx: 'align-center' })}>
          <Link
            to="/app-settings/recaptcha"
            className={`${css(app.btn)} btcd-btn-o-gray`}
          >
            <BackIcn className="mr-1" />
            Back
          </Link>
          <h2 className={css({ w: '100%', ta: 'center' })}>
            {__(`Google reCAPTCHA ${ver}`)}
          </h2>

        </div>
        <small>
          {__('reCAPTCHA is a free service that protects your website from spam and abuse.')}
          <a
            className="btcd-link"
            href={`https://developers.google.com/recaptcha/docs/${ver === 'v3' ? 'v3' : 'display'}`}
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
                onChange={e => onInput(e, ver)}
                name="siteKey"
                className="btcd-paper-inp mt-1"
                value={(ver === 'v3' ? reCaptchaV3 : reCaptchaV2).siteKey}
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
                onChange={e => onInput(e, ver)}
                name="secretKey"
                className="btcd-paper-inp mt-1"
                value={(ver === 'v3' ? reCaptchaV3 : reCaptchaV2).secretKey}
                placeholder="Secret Key"
                type="text"
              />
            </label>
          </div>
          <div className="mt-2">
            <p>
              {__('To get Site Key and SECRET , Please Visit')}
              &nbsp;
              <a
                className="btcd-link"
                href="https://www.google.com/recaptcha/admin/"
                target="_blank"
                rel="noreferrer"
              >
                {__('Google reCAPTCHA Admin')}
              </a>
            </p>
          </div>
          <button
            onClick={() => saveCaptcha(ver)}
            type="button"
            className={`${css(app.btn)} btn-md f-left blue`}
            disabled={loading}
          >
            {(ver === 'v2' ? reCaptchaV2?.id : reCaptchaV3?.id) ? __('Update') : __('Save')}
            {loading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
          </button>
        </div>
      </div>
      <UserGuideCaptcha type={captcha} />
    </>
  )
}
