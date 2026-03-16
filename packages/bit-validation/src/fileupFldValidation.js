const fileupFldValidation = (fldInstance, fldValue, fldData) => {
  const errKey = fldInstance?.checkValidate()
  if (fldData.config?.minFile && !(fldValue?.length >= fldData.config?.minFile || fldData.config?.minFile === 1)) return 'minFile'
  return (fldData.valid.req && !Array.isArray(fldValue) && !fldValue.name && errKey === 'req') ? 'req' : ''
}
export default fileupFldValidation
