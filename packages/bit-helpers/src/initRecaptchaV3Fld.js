export default function initRecaptchaV3Fld(contentId, contentData) {
  const src = `https://www.google.com/recaptcha/api.js?render=${contentData.gRecaptchaSiteKey}`
  const attrs = {}
  const id = 'bitforms_recaptcha-js'
  const recaptchaScript = document.querySelector('script#bitforms_recaptcha-js')
  if (
    !window.recaptcha
    && recaptchaScript
    && recaptchaScript.getAttribute('data-borlabs-script-blocker-js-handle')
    && recaptchaScript.getAttribute('data-borlabs-script-blocker-id')
  ) {
    return
  }
  scriptLoader(src, '', attrs, id)
}
