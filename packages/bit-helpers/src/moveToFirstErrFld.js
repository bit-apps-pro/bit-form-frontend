export default function moveToFirstErrFld(props, fldKeys = []) {
  const layouts = props?.layout || {}
  const nestedLayouts = props?.nestedLayout || {}
  const isMultiStep = Array.isArray(layouts) && layouts.length > 1
  const lays = Array.isArray(layouts) ? layouts : [{ layout: layouts }]
  let fldMinStep = -1
  const fldKeysBasedOnLayOrder = lays.reduce((fldAcc, lay, layIndx) => {
    const layKeys = lay.layout.lg.reduce((layAcc, l) => {
      const fldKey = l.i
      if (fldKey in nestedLayouts) {
        const nestedKeys = nestedLayouts[fldKey].lg.map(nl => nl.i)
        return [...layAcc, fldKey, ...nestedKeys]
      }
      return [...layAcc, fldKey]
    }, [])
    const isErrKeyExists = layKeys.find(fld => fldKeys.includes(fld))
    if (fldMinStep === -1 && isErrKeyExists) fldMinStep = layIndx
    return [...fldAcc, ...layKeys]
  }, [])
  if (isMultiStep && fldMinStep > -1 && props.inits.multi_step_form.step !== fldMinStep + 1) {
    props.inits.multi_step_form.step = fldMinStep + 1
  }
  if (props.inits?.conversational_form) {
    props.inits.conversational_form.activeFieldStep = fldKeys[0]
  }
  fldKeysBasedOnLayOrder.some(fldKey => fldKeys.some(errKey => {
    const [fk, rowIndx] = getFldKeyAndRowIndx(errKey)
    if (fldKey === fk) {
      const selector = rowIndx ? `.rpt-index-${rowIndx}` : ''
      const fld = bfSelect(`#form-${props.contentId} ${selector} .btcd-fld-itm.${fldKey}`)
      // scrollToElm(fld)
      setTimeout(() => scrollToElm(fld), 0)
      return true
    }
    return false
  }))
}
