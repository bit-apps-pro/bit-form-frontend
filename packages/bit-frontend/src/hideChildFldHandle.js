export default function hideChildFldHandle(props, formData) {
  Object.entries(props?.fields || {}).forEach(([fldKey, fld]) => {
    if (['section', 'repeater'].includes(fld?.typ) && fld?.valid?.hide) {
      const nestedFields = props.nestedLayout[fldKey]?.lg?.map(layObj => layObj.i)
      nestedFields?.forEach((nestedFldKey) => {
        if (!props.fields?.[nestedFldKey]?.valid) return
        props.fields[nestedFldKey].valid.hide = fld?.valid?.hide
      })
    }
  })
  return formData
}
