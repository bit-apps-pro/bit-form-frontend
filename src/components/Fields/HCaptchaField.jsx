import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { $hCaptcha } from '../../GlobalStates/AppSettingsStates'
import { $breakpoint, $fields, $flags } from '../../GlobalStates/GlobalStates'
import { reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { loadScript, removeScript, selectInGrid } from '../../Utils/globalHelpers'
import RenderStyle from '../style-new/RenderStyle'

export default function HCaptchaField({ fieldKey, formId, styleClasses }) {
  const hCaptchaWrapElmRef = useRef(null)
  const hCaptchaResetIntervalRef = useRef(null)
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const breakpoint = useAtomValue($breakpoint)
  const { styleMode } = useAtomValue($flags)
  const isHidden = fieldData.hidden?.includes(breakpoint) || false
  const hCaptchaWidgetId = useRef(null)
  const hCaptcha = useAtomValue($hCaptcha)
  const { siteKey = '' } = hCaptcha || {}

  useEffect(() => {
    window.renderHCaptchaFunc = renderHCaptcha

    const src = 'https://js.hcaptcha.com/1/api.js?onload=renderHCaptchaFunc&render=explicit'
    const srcData = {
      src,
      integrity: '',
      id: 'bf-h-captcha-script',
      async: true,
      defer: true,
    }

    loadScript(srcData)

    return () => {
      clearInterval(hCaptchaResetIntervalRef.current)
      removeScript(srcData.id)
    }
  }, [])

  function renderHCaptcha() {
    if (!window.hcaptcha || !hCaptchaWrapElmRef.current) return

    let hCaptchaElm = selectInGrid(`.${fieldKey}-h-captcha`)

    // If widget already exists and is valid, just reset it
    if (hCaptchaWidgetId.current !== null && window.hcaptcha.widgets && window.hcaptcha.widgets[hCaptchaWidgetId.current] !== undefined) {
      try {
        window.hcaptcha.reset(hCaptchaWidgetId.current)
      } catch (e) {
        // Widget is invalid, need to re-render
        hCaptchaWidgetId.current = null
      }
    }

    // If widget doesn't exist or is invalid, create a new one
    if (hCaptchaWidgetId.current === null) {
      // Remove old element if exists
      if (hCaptchaElm) {
        hCaptchaElm.remove()
      }

      // Create new element
      hCaptchaElm = document.createElement('div')
      hCaptchaElm.id = `${fieldKey}-h-captcha`
      hCaptchaElm.classList.add(`${fieldKey}-h-captcha`, 'h-captcha')
      hCaptchaWrapElmRef.current.appendChild(hCaptchaElm)

      // Render widget
      hCaptchaWidgetId.current = window.hcaptcha.render(hCaptchaElm, {
        sitekey: siteKey,
        theme: fieldData.config.theme,
        size: fieldData.config.size,
      })

      // Expose widget ID globally for form submission
      if (!window.bitformHCaptchaWidgets) {
        window.bitformHCaptchaWidgets = {}
      }
      window.bitformHCaptchaWidgets[fieldKey] = hCaptchaWidgetId.current
    }

    reCalculateFldHeights(fieldKey)
  }

  useEffect(() => {
    renderHCaptcha()
  }, [fieldData])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <div data-dev-fld-wrp={fieldKey} className={`${fieldKey}-h-captcha-container ${fieldKey}-fld-wrp ${styleMode ? '' : 'drag'} ${isHidden ? 'fld-hide' : ''}`}>
        {siteKey !== '' ? (
          <div className={`${fieldKey}-h-captcha-wrp`} ref={hCaptchaWrapElmRef}>
            <div id={`${fieldKey}-h-captcha`} className={`${fieldKey}-h-captcha h-captcha`} />
          </div>
        ) : (
          <div>
            To Load hCaptcha Field, Please Configure Site Key and Secret.
            {' '}
            <strong>Go to App Settings</strong>
          </div>
        )}
      </div>
    </>
  )
}
