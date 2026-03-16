import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { Link, useLocation } from 'react-router-dom'
import { $hCaptcha, $reCaptchaV2, $reCaptchaV3, $turnstile } from '../../GlobalStates/AppSettingsStates'
import EditIcn from '../../Icons/EditIcn'
import { __ } from '../../Utils/i18nwrap'
import cloudflare from '../../resource/img/cloudflare.svg'
import recaptcha from '../../resource/img/grecaptcha.svg'
import hCaptchaImg from '../../resource/img/hcaptcha.svg'
import style from '../../styles/integrations.style'
import Tip from '../Utilities/Tip'

export default function CaptchaList() {
  const { css } = useFela()
  const { pathname } = useLocation()

  const reCaptchaV2 = useAtomValue($reCaptchaV2)
  const reCaptchaV3 = useAtomValue($reCaptchaV3)
  const turnstile = useAtomValue($turnstile)
  const hCaptcha = useAtomValue($hCaptcha)
  const [searchTxt, setSearchTxt] = useState('')

  const captcha = [
    {
      name: 'reCaptcha V2',
      type: 'reCaptchaV2',
      logo: recaptcha,
      path: 'reCaptchaV2',
      siteKey: reCaptchaV2?.siteKey,
      secretKey: reCaptchaV2?.secretKey,
    },
    {
      name: 'reCaptcha V3',
      type: 'reCaptchaV3',
      logo: recaptcha,
      path: 'reCaptchaV3',
      siteKey: reCaptchaV3?.siteKey,
      secretKey: reCaptchaV3?.secretKey,
    },
    {
      name: 'Turnstile',
      type: 'Cloudflare Turnstile',
      logo: cloudflare,
      path: 'turnstile',
      siteKey: turnstile?.siteKey,
      secretKey: turnstile?.secretKey,
    },
    {
      name: 'hCaptcha',
      type: 'hcaptcha',
      logo: hCaptchaImg,
      path: 'hcaptcha',
      siteKey: hCaptcha?.siteKey,
      secretKey: hCaptcha?.secretKey,
    },
  ]

  const availableCaptchas = captcha.filter(c => c.name.toLowerCase().includes(searchTxt) || c.type.toLowerCase().includes(searchTxt))

  const subStr = str => {
    const len = str.length
    const first = str.substring(0, 5)
    const last = str.substring(len - 5, len)
    return (`${first}*****${last}`)
  }

  return (
    <div>
      <h2>{__('Captcha Settings')}</h2>
      <div className="btcd-hr" />
      <input
        aria-label="Search..."
        type="search"
        className="btcd-paper-inp w-5 mt-3"
        onChange={e => setSearchTxt(e.target.value.toLowerCase())}
        placeholder="Search..."
      />
      <p className={css({ fs: 16 })}>
        <strong>{__("Note:")}</strong>
        {' '}
        {__("Please click on the available Captcha option for configuration.")}
      </p>
      <div className={`pos-rel ${css(style.integWrp, { flx: 1, ai: 'normal', flxp: 1 })}`}>
        {availableCaptchas?.map((captch, i) => (
          <Link
            to={`${pathname}/${captch.path}`}
            role="button"
            className={css(style.itegCard, { mr: 0, w: '32%' })}
            key={`captch-${i + 3}`}
          >
            <img
              src={captch.logo}
              alt={captch.type}
              className={css(style.integLogo, { w: 60, h: 60 })}
            />
            <div title={`${captch.name} | ${captch.type}`}>
              <div className={css(style.integTitle)}>
                {captch.name}
              </div>
              <small className={css(style.integSubtitle)}>
                {captch.type}
              </small>
              {captch.siteKey && (
                <div className={css({ fs: 14 })}>
                  Site Key:
                  {' '}
                  {subStr(captch.siteKey)}
                </div>
              )}
              {captch.secretKey && (
                <div className={css({ fs: 14 })}>
                  Secret Key:
                  {' '}
                  {subStr(captch.secretKey)}
                </div>
              )}
              {(!captch.siteKey && !captch.secretKey) && (
                <div className={css({ fs: 14, cr: 'red' })}>
                  Not Configured
                </div>
              )}
            </div>
            <div className={`${css(style.actionWrp)} action-wrp`}>
              <Tip msg={__('Edit')}>
                <Link
                  to={`${pathname}/${captch.path}`}
                  className={`${css(style.actionBtn)}`}
                  type="button"
                >
                  <EditIcn size={19} />
                </Link>
              </Tip>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
