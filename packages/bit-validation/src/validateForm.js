/* eslint-disable no-continue */
let contentId
let fields
let fieldKeysByName = {}
let errors = []
export default function validateForm({ form, input }, { step, otherOptions } = {}) {
  if (form) contentId = form
  else if (input?.form?.id) [, contentId] = input.form.id.split('form-')
  const props = window?.bf_globals?.[contentId]
  if (typeof props === 'undefined') return false
  let formEntries = {}
  errors = []
  const bfSeparator = props.configs.bf_separator
  if (step) {
    let layout = props.layout[step - 1]
    if (!layout) return false
    layout = layout?.layout || layout
    const fldKeys = layout.lg.map(l => l.i)
    const nestedLayout = props.nestedLayout || {}
    Object.entries(nestedLayout).forEach(([key, lay]) => {
      if (fldKeys.includes(key)) {
        const flds = lay.lg.map(l => l.i)
        fldKeys.push(...flds)
      }
    })
    fields = fldKeys.reduce((acc, key) => ({ ...acc, [key]: props.fields[key] }), {})
  } else {
    fields = props.fields
  }
  const { modifiedFields } = props
  if (modifiedFields) Object.assign(fields, modifiedFields)
  if (form) {
    formEntries = generateFormEntries()
  } else if (input) {
    if (!props.validateFocusLost && !otherOptions?.validateOnInput) return true
    const fldKey = generateFieldKey(input.name)
    formEntries = generateFormEntries()
    fields = { [fldKey]: fields[fldKey] }
  }

  let formCanBeSubmitted = true
  const flds = Object.entries(fields)
  let { length } = flds
  // eslint-disable-next-line no-plusplus
  while (length--) {
    const [fldKey, fldData] = flds[length]
    let indexes = ['']
    if (typeof checkRepeatedField !== 'undefined') {
      const repeatedFieldKey = checkRepeatedField(fldKey, props)
      indexes = getRepeatedIndexes(repeatedFieldKey, props, input)
    }
    for (let i = 0; i < indexes.length; i += 1) {
      const index = indexes[i]
      const fldName = index ? `${fldData.fieldName}[${index}]` : fldData.fieldName
      const formSelector = `#form-${contentId}`
      const rowSelector = index ? `.rpt-index-${index}` : ''
      const fldType = fldData.typ
      const fldValue = typeof formEntries[fldName] === 'string' ? formEntries[fldName].trim() : formEntries[fldName]
      const initFldKey = getInitPropertyName(fldKey, props, index)

      const fldDiv = bfSelect(`${formSelector} ${rowSelector} .${fldKey}.fld-hide, ${formSelector} .fld-hide ${rowSelector} .${fldKey}`)
      if (fldDiv) {
        generateErrMsg('', fldKey, fldData, rowSelector)
        continue
      }

      let errKey = ''
      if (fldType === 'check' || fldType === 'image-select') {
        errKey = typeof checkFldValidation !== 'undefined' ? checkFldValidation(fldValue, fldData) : ''
      }
      if ((fldType === 'check' || fldType === 'radio') && !errKey && typeof customOptionValidation !== 'undefined') errKey = customOptionValidation(contentId, fldKey, fldData)
      if (!fldValue && !errKey && fldValue !== '0') {
        errKey = typeof requiredFldValidation !== 'undefined' ? requiredFldValidation(fldData) : null
      }
      generateErrMsg(errKey, fldKey, fldData, rowSelector)
      if (errKey) {
        formCanBeSubmitted = false
        continue
      }
      if (!fldValue) continue

      if (fldType === 'number' && typeof nmbrFldValidation !== 'undefined') errKey = nmbrFldValidation(fldValue, fldData)
      else if (fldType === 'email' && typeof emailFldValidation !== 'undefined') errKey = emailFldValidation(fldValue, fldData)
      else if (fldType === 'url' && typeof urlFldValidation !== 'undefined') errKey = urlFldValidation(fldValue, fldData)
      else if (['decision-box', 'gdpr'].includes(fldType) && typeof dcsnbxFldValidation !== 'undefined') errKey = dcsnbxFldValidation(fldValue, fldData)
      else if ((['check', 'select', 'image-select'].includes(fldType)) && typeof checkMinMaxOptions !== 'undefined') errKey = checkMinMaxOptions(fldValue, fldData, bfSeparator)
      else if (fldType === 'range' && typeof checkMinMaxValue !== 'undefined') errKey = checkMinMaxValue(fldValue, fldData)
      else if (fldType === 'file-up' && typeof fileupFldValidation !== 'undefined') errKey = fileupFldValidation(getFieldInstance(initFldKey), fldValue, fldData)
      else if (fldType === 'advanced-file-up' && typeof advanceFileUpFldValidation !== 'undefined') errKey = advanceFileUpFldValidation(getFieldInstance(initFldKey), fldData)
      else if (fldType === 'phone-number' && typeof phoneNumberFldValidation !== 'undefined') errKey = phoneNumberFldValidation(getFieldInstance(initFldKey), fldData)
      else if (fldType === 'currency' && typeof currencyFldValidation !== 'undefined') errKey = currencyFldValidation(getFieldInstance(initFldKey), fldData)
      if (!errKey && typeof bfDatetimeFldValidation !== 'undefined') errKey = bfDatetimeFldValidation(getFieldInstance(initFldKey), fldValue, fldData)

      if (fldData?.valid?.inputMask && !errKey) errKey = typeof inputMaskValidation !== 'undefined' ? inputMaskValidation(contentId, fldKey, fldValue, fldData) : null
      if (fldData?.valid?.regexr && !errKey) errKey = typeof regexPatternValidation !== 'undefined' ? regexPatternValidation(fldValue, fldData) : null

      generateErrMsg(errKey, fldKey, fldData, rowSelector)
      if (errKey) formCanBeSubmitted = false
    }
  }
  moveToFirstErrFld(props, errors)
  return formCanBeSubmitted
}

const getFieldInstance = fldKey => window?.bf_globals?.[contentId].inits?.[fldKey]

const getInitPropertyName = (fldKey, props, rowIndex) => {
  const initFldKey = Number(rowIndex) > 1 ? `${fldKey}[${rowIndex}]` : fldKey
  if (props.inits && !props.inits[initFldKey]) return fldKey
  return initFldKey
}

const generateFieldKey = keyName => {
  const fldName = keyName.replace(/\[\d*\]/g, '')
  if (fieldKeysByName[fldName]) return fieldKeysByName[fldName]
  const fldEntries = Object.entries(fields)
  for (let i = 0; i < fldEntries.length; i += 1) {
    const [key, fldData] = fldEntries[i]
    if (fldData?.fieldName === fldName) {
      fieldKeysByName[fldName] = key
      return key
    }
  }
  return ''
}

const generateFormEntries = () => {
  const formData = new FormData(bfSelect(`#form-${contentId}`))
  const formEntries = {}
  const entries = Array.from(formData.entries())
  fieldKeysByName = {}
  entries.forEach(([key, value]) => {
    const fldKey = generateFieldKey(key)
    const fldName = key.replace('[]', '')
    if (!(fldKey in fields)) return
    if (formEntries[fldName]) {
      if (!Array.isArray(formEntries[fldName])) formEntries[fldName] = [formEntries[fldName]]
      formEntries[fldName].push(value)
    } else formEntries[fldName] = value
  })

  return formEntries
}

const generateErrMsg = (errKey, fldKey, fldData, selector = '') => {
  const errWrp = bfSelect(`#form-${contentId} ${selector} .${fldKey}-err-wrp`)
  const errTxt = bfSelect(`.${fldKey}-err-txt`, errWrp)
  const errMsg = bfSelect(`.${fldKey}-err-msg`, errWrp)
  let isErrWrpGrid = false
  try {
    isErrWrpGrid = getComputedStyle(errWrp).display === 'grid'
    if (isErrWrpGrid) {
      errWrp.style.removeProperty('opacity')
      errWrp.style.removeProperty('height')
      errMsg.style.removeProperty('display')
    }
  } catch (_) {
    isErrWrpGrid = false
  }

  if (errTxt && 'err' in (fldData || {})) {
    if (errKey && fldData?.err?.[errKey]?.show) {
      errTxt.innerHTML = fldData.err[errKey].custom ? fldData.err[errKey].msg : fldData.err[errKey].dflt
      if (!isErrWrpGrid) {
        setTimeout(() => {
          errMsg.style.removeProperty('display')
          setStyleProperty(errWrp, 'height', `${errTxt.offsetHeight}px`)
          setStyleProperty(errWrp, 'opacity', 1)
        }, 100)
      } else {
        setStyleProperty(errWrp, 'grid-template-rows', '1fr')
      }
      errors.push(fldKey)
    } else {
      errTxt.innerHTML = ''
      if (!isErrWrpGrid) {
        setStyleProperty(errWrp, 'height', 0)
        setStyleProperty(errWrp, 'opacity', 0)
        setStyleProperty(errMsg, 'display', 'none')
      } else {
        setStyleProperty(errWrp, 'grid-template-rows', '0fr')
      }
    }
  }
}
