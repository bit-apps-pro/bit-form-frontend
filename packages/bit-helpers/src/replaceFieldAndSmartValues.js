export default function replaceFieldAndSmartValues(valueContent, contentId) {
  const formId = `form-${contentId}`
  const formData = new FormData(bfSelect(`#${formId}`))
  const props = window?.bf_globals?.[contentId]
  const { smartTags } = props
  let tempValueContent = valueContent
  const fieldKeys = tempValueContent.match(/\${b\d+-\d+}/g)
  if (fieldKeys) {
    fieldKeys.forEach((fk) => {
      const fieldKey = fk.replace(/\${|}/g, '')
      const fieldData = props.fields[fieldKey]
      if (!fieldData) return
      const { fieldName } = fieldData
      const fieldValue = formData.get(fieldName)
      if (fieldValue !== null) {
        tempValueContent = tempValueContent.replace(fk, fieldValue)
      }
    })
  }

  const inputFieldNames = tempValueContent.match(/\${input.[a-zA-Z0-9-]+}/g)
  if (inputFieldNames) {
    inputFieldNames.forEach((ifn) => {
      const fieldName = ifn.replace(/\${input.|}/g, '')
      const fieldValue = formData.get(fieldName)
      if (fieldValue !== null) {
        tempValueContent = tempValueContent.replace(ifn, fieldValue)
      }
    })
  }

  const smartTagKeys = tempValueContent.match(/\$\{([^}]+)\}/g)
  if (smartTagKeys) {
    smartTagKeys.forEach((stk) => {
      const smartTag = stk.replace(/\${|}/g, '')
      const smartTagValue = smartTags[smartTag]
      if (smartTagValue !== undefined) {
        tempValueContent = tempValueContent.replace(stk, smartTagValue)
      }
    })
  }
  return tempValueContent
}
