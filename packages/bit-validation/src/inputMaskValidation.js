const inputMaskValidation = (contentId, fldKey, fldValue, fldData) => {
  const slNo = contentId.split('_').pop()
  const fldInput = bfSelect(`#form-${contentId} #${fldKey}-${slNo}`)
  if (fldInput && fldInput.inputmask) {
    return fldInput.inputmask?.isComplete() ? '' : 'inputMask'
  }
}
export default inputMaskValidation
