export default async function isFormValidatedWithoutError(formContentId, { step } = {}) {
  if (typeof validateForm !== 'undefined' && !validateForm({ form: formContentId }, { step })) {
    return new Promise((_, reject) => {
      reject(new Error('Form is not valid'))
    })
  }
  const formParent = document.getElementById(formContentId)
  formParent.classList.add('pos-rel', 'form-loading')
  let formData = new FormData(document.getElementById(`form-${formContentId}`))

  const props = window.bf_globals[formContentId]
  const { grecaptcha } = window
  if (props?.gRecaptchaVersion === 'v3' && props?.gRecaptchaSiteKey) {
    const token = await grecaptcha.execute(props?.gRecaptchaSiteKey, { action: 'submit' })
    formData.append('g-recaptcha-response', token)
  }
  if (typeof advancedFileHandle !== 'undefined') formData = advancedFileHandle(props, formData)
  if (typeof decisionFldHandle !== 'undefined') formData = decisionFldHandle(props, formData)
  if (typeof hideChildFldHandle !== 'undefined') formData = hideChildFldHandle(props, formData)
  if (props.GCLID) {
    formData.set('GCLID', props.GCLID)
  }
  if (step) {
    formData.set('form-current-step', step)
  }
  const hidden = []
  Object.entries(props?.fields || {}).forEach((fld) => {
    if (fld[1]?.valid?.hide) {
      hidden.push(fld[0])
    }
  })
  if (hidden.length) {
    formData.append('hidden_fields', hidden)
  }
  const uri = new URL(props.ajaxURL)
  uri.searchParams.append('action', 'bitforms_before_submit_validate')
  const res = await fetch(
    uri,
    {
      method: 'POST',
      body: formData,
    },
  )
  const data = await res.json()

  formParent.classList.remove('pos-rel', 'form-loading')

  if (!data.success) {
    bfValidationErrMsg(data, formContentId)
    return new Promise((_, reject) => {
      reject(new Error('Form is not valid'))
    })
  }
  return new Promise((resolve) => {
    resolve(true)
  })
}
