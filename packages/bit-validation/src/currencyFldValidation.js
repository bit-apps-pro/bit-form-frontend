const currencyFldValidation = (fldInstance, fldData) => {
  const isValid = fldInstance.isValidated()
  if (isValid === 'required' && fldData?.valid?.req) return 'req'
  if (isValid === 'invalid') return 'invalid'
  if (isValid === 'minValue') return 'minValue'
  if (isValid === 'maxValue') return 'maxValue'
  return ''
}
export default currencyFldValidation
