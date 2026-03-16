const addEventsToValidateFocusAndWorkflows = (formContentId = null) => {
  const allContentids = formContentId ? { [formContentId]: window.bf_globals[formContentId] } : window.bf_globals
  if (allContentids) {
    Object.keys(allContentids).forEach((contentId) => {
      const props = window.bf_globals[contentId]
      const form = document.getElementById(`form-${contentId}`)
      Object.values(props?.fields || {}).forEach(fldData => {
        const fldName = fldData.typ === 'check' || (fldData.typ === 'image-select' && fldData.inpType === 'checkbox') ? `${fldData.fieldName}[]` : fldData.fieldName
        const onaction = ['check', 'radio', 'decision-box', 'gdpr', 'rating', 'image-select'].includes(fldData.typ) ? 'input' : 'blur'
        form.querySelectorAll(`[name='${fldName}']`).forEach(elm => {
          if (props.validateFocusLost) {
            elm.addEventListener(onaction, e => validateForm({ input: e.target }))
          }
          if (props.onfieldCondition) {
            if (fldData.typ === 'button') {
              return elm.addEventListener('click', e => {
                if (bit_conditionals(e)) {
                  e.stopPropagation()
                }
              })
            }
            elm.addEventListener('input', e => bit_conditionals(e))
            observeElm(elm, 'value', (oldValue, newValue) => {
              if (oldValue !== newValue) {
                bit_conditionals({ target: elm })
              }
            })
          }
        })
      })
    })
  }
}

export default addEventsToValidateFocusAndWorkflows
