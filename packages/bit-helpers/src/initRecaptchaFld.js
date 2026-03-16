export default function initRecaptchaFld(contentId, fldKey, fldType) {
  const src = 'https://www.google.com/recaptcha/api.js'
  const attrs = {
    async: true,
    defer: true,
  }
  const id = `bit_recaptcha_script-${contentId}`
  const initFunc = function () {
    bf_globals[contentId].inits[fldKey] = getFldInstance(contentId, fldKey, fldType)
  }
  scriptLoader(src, '', attrs, id, initFunc)
}
