export default function initRazorpayFld(contentId, fldKey, fldType) {
  const src = 'https://checkout.razorpay.com/v1/checkout.js'
  const attrs = {}
  const id = `bit_razorpay_script-${contentId}`
  const initFunc = function () {
    bf_globals[contentId].inits[fldKey] = getFldInstance(contentId, fldKey, fldType)
  }
  scriptLoader(src, '', attrs, id, initFunc)
}
