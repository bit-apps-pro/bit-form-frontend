export default function initHCaptchaFld(contentId, fldKey, fldType) {
  const src = 'https://js.hcaptcha.com/1/api.js?recaptchacompat=off'
  const attrs = {
    async: true,
    defer: true,
  }
  const id = `bit_hcaptcha_script-${contentId}`
  const initFunc = function () {
    bf_globals[contentId].inits[fldKey] = getFldInstance(contentId, fldKey, fldType)
  }
  scriptLoader(src, '', attrs, id, initFunc)
}
