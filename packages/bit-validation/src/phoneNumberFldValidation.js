const phoneNumberFldValidation = (fldInstance, fldData) => {
  const errorKey = fldInstance.isValidated()
  if (errorKey === 'invalid') return 'invalid'
  if (errorKey === 'required' && fldData?.valid?.req) return 'req'
  return errorKey
}
export default phoneNumberFldValidation
