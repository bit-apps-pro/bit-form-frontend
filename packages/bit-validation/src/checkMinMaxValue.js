export default function checkMinMaxValue(fldValue, fldData) {
  const val = Number(fldValue || 0)
  const mn = Number(fldData.mn) || 0
  const mx = Number(fldData.mx)
  if (val < mn) return 'mn'
  if (!isNaN(mx) && val > mx) return 'mx'
  return ''
}
