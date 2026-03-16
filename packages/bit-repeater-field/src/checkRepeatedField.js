export default function checkRepeatedField(fieldKey, props) {
  if (props.repeatFields) {
    const { repeatFields } = props
    const repeatField = Object.entries(repeatFields).find(([repeatFieldKey, repeatFieldsArray]) => repeatFieldsArray.includes(fieldKey))
    if (repeatField) return repeatField[0]
  }
  return false
}
