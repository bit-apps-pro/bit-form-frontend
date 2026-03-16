const decisionFldHandle = (props, fromData) => {
  Object.entries(props.fields).forEach(([, fieldData]) => {
    if (['decision-box', 'gdpr'].includes(fieldData.typ) && bfSelect(`input[name="${fieldData.fieldName}"]`).checked) {
      fromData.set(fieldData.fieldName, fieldData.msg.checked)
    } else if (['decision-box', 'gdpr'].includes(fieldData.typ)) {
      fromData.set(fieldData.fieldName, fieldData.msg.unchecked)
    }
  })
  return fromData
}
export default decisionFldHandle
