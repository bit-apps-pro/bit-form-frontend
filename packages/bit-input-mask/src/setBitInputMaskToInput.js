export default function setBitInputMaskToInput(formContentId) {
  const contentIds = formContentId ? [formContentId] : Object.keys(bf_globals || {})

  if (typeof bit_input_mask !== 'undefined') {
    contentIds.forEach(contentId => {
      const props = bf_globals?.[contentId]
      if (props) {
        Object.values(props.fields || {}).forEach(fldData => {
          if (fldData?.valid?.inputMask) {
            const selector = `#form-${contentId} [name='${fldData.fieldName}']`
            // eslint-disable-next-line no-new
            new bit_input_mask(selector, { maskFormat: fldData.valid.inputMask })
          }
        })
      }
    })
  }
}
