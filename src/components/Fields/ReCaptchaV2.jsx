import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { $reCaptchaV2 } from '../../GlobalStates/AppSettingsStates'
import { $breakpoint, $fields, $flags } from '../../GlobalStates/GlobalStates'
import { reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { loadScript, removeScript, selectInGrid } from '../../Utils/globalHelpers'
import RenderStyle from '../style-new/RenderStyle'

export default function ReCaptchaV2({ fieldKey, formId, styleClasses }) {
  const recaptchaWrapElmRef = useRef(null)
  const recaptchaResetIntervalRef = useRef(null)
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const breakpoint = useAtomValue($breakpoint)
  const { styleMode } = useAtomValue($flags)
  const isHidden = fieldData.hidden?.includes(breakpoint) || false
  const recaptchaId = useRef(null)
  const reCaptchaV2 = useAtomValue($reCaptchaV2)
  const { siteKey = '' } = reCaptchaV2 || {}

  useEffect(() => {
    window.renderGrecaptcha = renderGrecaptcha

    const src = 'https://www.google.com/recaptcha/api.js?onload=renderGrecaptcha&render=explicit'
    const srcData = {
      src,
      integrity: '',
      id: 'bf-recaptcha-script',
      async: true,
      defer: true,
    }

    loadScript(srcData)

    return () => {
      clearInterval(recaptchaResetIntervalRef.current)
      removeScript(srcData.id)
    }
  }, [])

  function renderGrecaptcha() {
    let recaptchaElm = selectInGrid(`.${fieldKey}-recaptcha`)
    if (recaptchaId.current !== null) {
      recaptchaElm?.remove()
      window.grecaptcha.reset(recaptchaId.current)
      recaptchaElm = document.createElement('div')
      recaptchaElm.classList.add(`${fieldKey}-recaptcha`)
      recaptchaWrapElmRef.current.appendChild(recaptchaElm)
    }
    recaptchaId.current = window.grecaptcha.render(recaptchaElm, {
      sitekey: siteKey,
      theme: fieldData.config.theme,
      size: fieldData.config.size,
    })
    reCalculateFldHeights(fieldKey)
    if (recaptchaResetIntervalRef.current) {
      clearInterval(recaptchaResetIntervalRef.current)
    }
    recaptchaResetIntervalRef.current = setInterval(() => {
      window.grecaptcha.reset(recaptchaId.current)
    }, 30000)
  }

  useEffect(() => {
    if (window.grecaptcha) renderGrecaptcha()
  }, [fieldData])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <div data-dev-fld-wrp={fieldKey} className={`${fieldKey}-recaptcha-container ${fieldKey}-fld-wrp ${styleMode ? '' : 'drag'} ${isHidden ? 'fld-hide' : ''}`}>

        {siteKey !== '' ? (
          <div className={`${fieldKey}-recaptcha-wrp`} ref={recaptchaWrapElmRef}>
            <div className={`${fieldKey}-recaptcha`} />
          </div>
        ) : (
          <div>
            To Load reCaptcha Field, Please Configure Site Key and Secret.
            {' '}
            <strong>Go to App Settings</strong>
          </div>
        )}

      </div>
    </>
  )
}
