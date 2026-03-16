const advanceFileUpFldValidation = (fldInstance, fldData) => (fldData.valid.req && fldInstance.checkValidate() === 'req' ? 'req' : '')
export default advanceFileUpFldValidation
