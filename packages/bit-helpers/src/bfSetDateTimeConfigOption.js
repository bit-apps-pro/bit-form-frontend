export default function bfSetDateTimeConfigOption(actionDetail, actionParamsValue, props, fieldValues, rowIndex) {
  if (!props.fields[actionDetail.field]) return
  const fieldKey = actionDetail.field
  const fldData = props.fields[fieldKey]
  const { typ } = fldData
  if (typ !== 'advanced-datetime') return
  if (props.inits && props.inits[fieldKey] && props.inits[fieldKey].setConfigOption) {
    const [option, value] = bfSplit(actionParamsValue)
    props.inits[fieldKey].setConfigOption(option, value)
  }
}
