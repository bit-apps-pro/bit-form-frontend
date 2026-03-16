export default function getRepeatedIndexes(repeaterFieldKey, props, input) {
  if (!repeaterFieldKey) return ['']
  const { fieldName } = props.fields[repeaterFieldKey]
  const repeatIndexInput = bfSelect(`#form-${props.contentId} [name='${fieldName}-repeat-index']`)
  const indexes = []
  if (input) {
    const { name } = input
    const index = name.match(/\[(\d+)\]/)
    if (index) indexes.push(index[1])
  } else if (repeatIndexInput) {
    const { value } = repeatIndexInput
    if (value) indexes.push(...value.split(','))
  }
  return indexes
}
