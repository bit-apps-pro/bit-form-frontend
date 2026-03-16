export default function initStripeFld(contentId, fldKey, fldType) {
  const src = 'https://js.stripe.com/v3/'
  const attrs = {}
  const id = `bit_stripe_field-${contentId}`
  const initFunc = function () {
    bf_globals[contentId].inits[fldKey] = getFldInstance(contentId, fldKey, fldType)
  }
  scriptLoader(src, '', attrs, id, initFunc)
}
