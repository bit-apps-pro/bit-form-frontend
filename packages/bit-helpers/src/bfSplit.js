export default function bfSplit(targetString, props, separator = ',') {
  const bfSeprator = props?.configs?.bf_separator || '__bf__'
  if (targetString.includes(bfSeprator)) {
    return targetString.split(bfSeprator)
  }
  return targetString.split(separator)
}
