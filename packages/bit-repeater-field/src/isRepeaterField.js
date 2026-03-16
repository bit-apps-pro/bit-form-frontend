export default function isRepeaterField(fieldKey, props) {
  if (props?.repeatFields?.[fieldKey]) return true
  return false
}
