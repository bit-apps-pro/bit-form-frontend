export default function bfReset(contentId, customHook = false) {
  if (customHook) {
    const resetEvent = new CustomEvent('bf-form-reset', {
      detail: { formId: contentId },
    })
    bfSelect(`#form-${contentId}`).dispatchEvent(resetEvent)
  }

  const props = window.bf_globals[contentId]
  typeof resetPlaceholders !== 'undefined' && resetPlaceholders(props)
  typeof bfResetDefaultValue !== 'undefined' && bfResetDefaultValue(props)
  typeof customFieldsReset !== 'undefined' && customFieldsReset(props)
  typeof resetOtherOpt !== 'undefined' && resetOtherOpt(contentId)
  bfSelect(`#form-${contentId}`).reset()
  localStorage.setItem('bf-entry-id', '')
  window.bf_globals[contentId].modifiedFields = props.fields
  Object.keys(props.fields).forEach(fk => {
    const errWrp = bfSelect(`#form-${contentId} .${fk}-err-wrp`)
    if (errWrp) {
      setStyleProperty(errWrp, 'height', '0px')
      setStyleProperty(errWrp, 'opacity', 0)
      setStyleProperty(bfSelect(`.${fk}-err-msg`, errWrp), 'display', 'none')
    }
  })

  if (props.gRecaptchaSiteKey && props.gRecaptchaVersion === 'v2') {
    window?.grecaptcha?.reset()
  }

  if (props.turnstileSiteKey) {
    window?.turnstile?.reset()
  }

  if (props.hCaptchaSiteKey) {
    window?.hcaptcha?.reset()
  }
}
