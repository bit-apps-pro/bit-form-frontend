const bfDatetimeFldValidation = (fldInstance, fldValue, fldData) => {
  const typ = fldData?.typ
  if (!['advanced-datetime', 'date', 'time', 'datetime-local', 'month', 'week'].includes(typ)) return ''
  // console.log('bfDatetimeFldValidation', fldInstance, fldValue, fldData)
  if (typ === 'advanced-datetime') {
    return fldInstance?.validationCheck(fldData) || ''
  }
  const parsedFldValue = bfParseDateTime(fldValue)
  if (fldData.mn) {
    const minimumValue = bfParseDateTime(fldData.mn)
    if (parsedFldValue < minimumValue) {
      return 'mn'
    }
  }
  if (fldData.mx) {
    const maximumValue = bfParseDateTime(fldData.mx)
    if (parsedFldValue > maximumValue) {
      return 'mx'
    }
  }
  return ''
}
export default bfDatetimeFldValidation
