export default function bfResetDefaultValue(props) {
  const { fields, contentId } = props
  const form = bfSelect(`#form-${contentId}`)
  Object.keys(fields).forEach(fk => {
    const field = fields[fk]
    const { typ, val, defaultValue, config } = field
    const value = val || defaultValue || config?.defaultValue || ''
    if (typ === 'currency') {
      const elm = bfSelect(`.${fk}-currency-amount-input`, form)
      if (elm) elm.defaultValue = value
    } else if (typ === 'phone-number') {
      const elm = bfSelect(`.${fk}-phone-number-input`, form)
      if (elm) elm.defaultValue = value
    }
    const elm = bfSelect(`.${fk}-fld`, form)
    if (elm) elm.defaultValue = value
  })
}
