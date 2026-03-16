export default class BitRepeaterField {
  #repeaterFieldWrapper

  #repeatableWrapper

  #hiddenIndexInput

  #window

  #document

  #allEventListeners = []

  #fieldKey

  #fieldName

  #contentId

  #defaultRow

  #defaultValue

  #minimumRow

  #maximumRow

  #showAddButton

  #showAddToEndButton

  #addToEndBtnWrapper

  #addToEndButton

  #rowNumber = 1

  #indexArray = []

  #customFields = []

  #isReset = false

  #customFieldTypes = ['select', 'country', 'currency', 'phone-number', 'file-up', 'rating', 'signature', 'advanced-datetime']

  constructor(selector, config) {
    this.#setConfigPropertiesToVariables(config)
    if (typeof selector === 'string') {
      this.#repeaterFieldWrapper = this.#document.querySelector(selector)
    } else {
      this.#repeaterFieldWrapper = selector
    }

    this.init()
  }

  #setConfigPropertiesToVariables(config) {
    this.#window = config.window || window
    this.#document = config.document || document
    this.#fieldKey = config.fieldKey
    this.#fieldName = config.fieldName
    this.#contentId = config.contentId
    this.#defaultRow = config.defaultRow
    this.#minimumRow = config.minimumRow
    this.#maximumRow = config.maximumRow
    this.#showAddButton = config.showAddBtn
    this.#showAddToEndButton = config.showAddToEndBtn
    this.#defaultValue = config.defaultValue
  }

  init() {
    if (this.#maximumRow > 0 && this.#maximumRow < this.#defaultRow) {
      this.#defaultRow = this.#maximumRow
    }
    if (this.#minimumRow > 0 && this.#minimumRow > this.#defaultRow) {
      this.#defaultRow = this.#minimumRow
    }
    if (this.#maximumRow > 0 && this.#maximumRow < this.#minimumRow) {
      this.#minimumRow = this.#maximumRow
    }
    if (this.#minimumRow < 1) { this.#minimumRow = 1 }
    this.#repeatableWrapper = this.#elementClone(this.#select(`.${this.#fieldKey}-rpt-wrp`))
    this.#hiddenIndexInput = this.#select(`[name='${this.#fieldName}-repeat-index']`)

    this.#detectFields()

    // this.#repeatableWrapper.remove()

    this.#selectAll(`.${this.#fieldKey}-rpt-wrp`).forEach((rptWrp) => {
      this.#replaceClassAndId(rptWrp, this.#rowNumber)
      this.#addRowIndex(this.#rowNumber)
      this.#initializeCustomFields(this.#rowNumber)
      this.#addSpecialFieldActions(this.#rowNumber)
      this.#rowNumber += 1
    })

    if (this.#showAddToEndButton) {
      this.#addToEndBtnWrapper = this.#select(`.${this.#fieldKey}-add-to-end-btn-wrp`)
      this.#addToEndButton = this.#select(`.${this.#fieldKey}-add-to-end-btn`)
      this.#addEvent(this.#addToEndButton, 'click', e => this.#handleAddToEnd(e))
      const props = this.#window.bf_globals[this.#contentId]
      if (props?.onfieldCondition) {
        this.#addEvent(this.#addToEndButton, 'click', e => {
          setTimeout(() => {
            if (bit_conditionals({ target: this.#addToEndButton })) {
              e.stopPropagation()
            }
          }, 0)
        })
      }
    }

    this.#handleButtonEnableDisable()
    if (this.#defaultValue) {
      this.value = this.#defaultValue
    }
  }

  #detectFields() {
    const props = bf_globals[this.#contentId]
    const fieldNames = []
    const fieldKeys = []
    const repeatFields = []

    this.#selectAll('input[name],select[name],textarea[name]', this.#repeatableWrapper).forEach((input) => {
      const name = input.getAttribute('name')
      fieldNames.push(name.replace('[]', ''))
    })
    const { fields } = props
    new Set(fieldNames).forEach((name) => {
      Object.entries(fields).forEach(([key, field]) => {
        if (field.fieldName === name) {
          repeatFields.push(key)
          if (this.#customFieldTypes.indexOf(field.typ) !== -1) {
            fieldKeys.push({ key, name, type: field.typ })
          }
        }
      })
    })

    if (!props.repeatFields) {
      props.repeatFields = {}
    }
    props.repeatFields = { ...props.repeatFields, [this.#fieldKey]: repeatFields }

    this.#customFields = fieldKeys
  }

  #initializeCustomFields(rowNumber) {
    if (rowNumber > 1) {
      this.#customFields.forEach((field) => {
        bf_globals[this.#contentId].inits[`${field.key}[${rowNumber}]`] = this.#window.getFldInstance(this.#contentId, field.key, field.type, `.rpt-index-${rowNumber} `)
      })
    }
  }

  #addSpecialFieldActions(rowNumber) {
    if (typeof initCheckDisableOnMax !== 'undefined') {
      initCheckDisableOnMax(this.#contentId, `.rpt-index-${rowNumber} `)
    }
  }

  #removeCustomFieldInstances(rowNumber) {
    this.#customFields.forEach((field) => {
      delete bf_globals[this.#contentId].inits[`${field.key}[${rowNumber}]`]
    })
  }

  #replaceClassAndId(element, rowNumber) {
    const replacedElement = element
    const inputs = this.#selectAll('input[name],select[name],textarea[name]', replacedElement)
    const buttons = this.#selectAll('button[data-parent-field-name]', replacedElement)
    const props = this.#window.bf_globals[this.#contentId]

    replacedElement.classList.add(`rpt-index-${rowNumber}`)
    replacedElement.dataset.index = rowNumber
    this.#setHeight(replacedElement, true)
    // replace name and id
    inputs.forEach((input) => {
      const id = input.getAttribute('id')
      if (id) this.#setAttribute(input, 'id', `${id}-rpt-${rowNumber}`)
      const name = input.getAttribute('name')
      // check is name contains '[]'
      if (name.indexOf('[]') !== -1) {
        this.#setAttribute(input, 'name', name.replace('[]', `[${rowNumber}][]`))
      } else {
        this.#setAttribute(input, 'name', `${name}[${rowNumber}]`)
      }
      const onaction = ['checkbox', 'radio'].includes(input.type) ? 'input' : 'blur'
      if (props.validateFocusLost) {
        input.addEventListener(onaction, e => validateForm({ input: e.target }))
      }
      if (props.onfieldCondition) {
        input.addEventListener('input', e => bit_conditionals(e))
        observeElm(input, 'value', (oldValue, newValue) => {
          if (oldValue !== newValue) {
            bit_conditionals({ target: input })
          }
        })
      }
    })

    // Add event to button
    if (props.onfieldCondition) {
      buttons.forEach((button) => {
        this.#addEvent(button, 'click', e => {
          setTimeout(() => {
            if (bit_conditionals({ target: button })) {
              e.stopPropagation()
            }
          })
        })
      })
    }

    // replace label for attribute
    const labels = this.#selectAll('label', replacedElement) || []
    labels.forEach((label) => {
      const forAttr = label.getAttribute('for')
      this.#setAttribute(label, 'for', `${forAttr}-rpt-${rowNumber}`)
    })

    if (this.#showAddButton) {
      // this.#addButton = this.#select(`.${this.#fieldKey}-rpt-add-btn`)
      const addButton = this.#select(`.${this.#fieldKey}-rpt-add-btn`, replacedElement)
      addButton.dataset.index = rowNumber
      this.#addEvent(addButton, 'click', e => this.#handleAdd(e))
    }
    // this.#removeButton = this.#select(`.${this.#fieldKey}-rpt-rmv-btn`)
    const removeButton = this.#select(`.${this.#fieldKey}-rpt-rmv-btn`, replacedElement)
    removeButton.dataset.index = rowNumber
    this.#addEvent(removeButton, 'click', e => this.#handleRemove(e))

    return replacedElement
  }

  #getHeight(element) {
    const fld = this.#window.getComputedStyle(element)
    let heightCount = 0
    if (fld.boxSizing === 'border-box') {
      heightCount = element.scrollHeight
    } else {
      heightCount = (
        parseInt(fld.paddingTop)
        + parseInt(fld.paddingBottom)
        + element.scrollHeight
        + parseInt(fld.marginTop)
        + parseInt(fld.marginBottom)
        + parseInt(fld.borderTopWidth)
        + parseInt(fld.borderBottomWidth)
      )
    }
    return heightCount
  }

  #setHeight(element, val) {
    let heightCount = this.#getHeight(element)
    setStyleProperty(element, 'height', `${heightCount}px`)
    if (!val) {
      setTimeout(() => { setStyleProperty(element, 'height', '0px') }, 0)
      element.classList.add('fld-hide')
    } else {
      element.classList.remove('fld-hide')
      heightCount = this.#getHeight(element)
      setStyleProperty(element, 'height', `${heightCount}px`)
    }
    setTimeout(() => {
      element.style.removeProperty('height')
      if (!val) element.remove()
    }, 300)
  }

  #handleAdd(e) {
    e.preventDefault()
    if (this.#maximumRow > 0 && this.#indexArray.length >= this.#maximumRow) return
    const { currentTarget } = e
    const indexNumber = currentTarget.dataset.index
    const parent = currentTarget.closest(`.${this.#fieldKey}-rpt-wrp`)
    const cloneElement = this.#elementClone(this.#repeatableWrapper)
    const replacedElement = this.#replaceClassAndId(cloneElement, this.#rowNumber)
    replacedElement.classList.add('fld-hide')
    this.#addRowIndex(this.#rowNumber, indexNumber)
    parent.after(replacedElement)
    this.#setHeight(replacedElement, true)
    this.#initializeCustomFields(this.#rowNumber)
    this.#addSpecialFieldActions(this.#rowNumber)
    this.#handleButtonEnableDisable()
    if (!this.#isReset) scrollToElm(replacedElement)
    this.#rowNumber += 1
  }

  #handleRemove(e) {
    e.preventDefault()
    if (this.#minimumRow >= this.#indexArray.length) return
    const { currentTarget } = e
    const rowNumber = currentTarget.dataset.index
    const parent = currentTarget.closest(`.${this.#fieldKey}-rpt-wrp`)
    this.#setHeight(parent, false)
    this.#removeRowIndex(rowNumber)
    this.#removeCustomFieldInstances(rowNumber)
    this.#handleButtonEnableDisable()
    if (parent.previousElementSibling && !this.#isReset) scrollToElm(parent.previousElementSibling)
  }

  #handleAddToEnd(e) {
    e.preventDefault()
    if (this.#maximumRow > 0 && this.#indexArray.length >= this.#maximumRow) return
    const cloneElement = this.#elementClone(this.#repeatableWrapper)
    const replacedElement = this.#replaceClassAndId(cloneElement, this.#rowNumber)
    replacedElement.classList.add('fld-hide')
    this.#addRowIndex(this.#rowNumber)
    this.#addToEndBtnWrapper.before(replacedElement)
    this.#setHeight(replacedElement, true)
    this.#initializeCustomFields(this.#rowNumber)
    this.#addSpecialFieldActions(this.#rowNumber)
    this.#handleButtonEnableDisable()
    this.#rowNumber += 1
  }

  #addRowIndex(indexNumber, beforeIndex) {
    // const tempArray = JSON.parse(this.#hiddenIndexInput.value)
    if (beforeIndex) {
      const index = this.#indexArray.indexOf(parseInt(beforeIndex, 10)) + 1
      this.#indexArray.splice(index, 0, indexNumber)
    } else {
      this.#indexArray.push(indexNumber)
    }
    this.#setAttribute(this.#hiddenIndexInput, 'value', this.#indexArray.join(','))
  }

  #removeRowIndex(indexNumber) {
    // const tempArray = JSON.parse(this.#hiddenIndexInput.value)
    const index = this.#indexArray.indexOf(parseInt(indexNumber, 10))
    this.#indexArray.splice(index, 1)
    this.#setAttribute(this.#hiddenIndexInput, 'value', this.#indexArray.join(','))
  }

  #handleButtonEnableDisable() {
    let disabled = false
    if (this.#maximumRow > 0 && this.#indexArray.length >= this.#maximumRow) {
      disabled = true
    } else {
      disabled = false
    }
    this.#selectAll(`.${this.#fieldKey}-rpt-add-btn`).forEach((btn) => {
      btn.disabled = disabled
    })
    if (this.#addToEndButton) this.#addToEndButton.disabled = disabled

    if (this.#minimumRow > 0 && this.#indexArray.length <= this.#minimumRow) {
      disabled = true
    } else {
      disabled = false
    }
    this.#selectAll(`.${this.#fieldKey}-rpt-rmv-btn`).forEach((btn) => {
      btn.disabled = disabled
    })
  }

  reset() {
    let currentRows = this.#indexArray.length
    if (currentRows === this.#defaultRow) return
    this.#isReset = true
    while (currentRows < this.#defaultRow) {
      const lastRow = this.#indexArray[this.#indexArray.length - 1]
      // Remove button is targeted because add button may not be available every time
      const lastRemoveBtn = this.#select(`.${this.#fieldKey}-rpt-rmv-btn[data-index="${lastRow}"]`)
      this.#handleAdd({ currentTarget: lastRemoveBtn, preventDefault: () => { } })
      currentRows += 1
    }
    while (currentRows > this.#defaultRow) {
      const lastRow = this.#indexArray[this.#indexArray.length - 1]
      this.#select(`.${this.#fieldKey}-rpt-rmv-btn[data-index="${lastRow}"]`).click()
      currentRows -= 1
    }
    this.#isReset = false
  }

  #select(selector, element) {
    if (element) return element.querySelector(selector)
    return this.#repeaterFieldWrapper.querySelector(selector)
  }

  #selectAll(selector, element) {
    if (element) return element.querySelectorAll(selector)
    return this.#repeaterFieldWrapper.querySelectorAll(selector)
  }

  #elementClone(element) { return element.cloneNode(true) }

  #setAttribute(elm, name, value) {
    elm?.setAttribute?.(name, value)
  }

  #addEvent(selector, eventType, cb) {
    selector.addEventListener(eventType, cb)
    this.#allEventListeners.push({ selector, eventType, cb })
    this.value = 0
  }

  #isValidJSON(dataString) {
    try {
      JSON.parse(dataString)
    } catch (e) {
      return false
    }
    return true
  }

  get value() {
    return this.#hiddenIndexInput.value
  }

  set value(dataString) {
    if (!dataString || !this.#isValidJSON(dataString)) return
    const dataArr = JSON.parse(dataString)
    if (!dataArr.length) return
    const dataLength = dataArr.length
    let currentRow = this.#indexArray.length
    if (currentRow < dataLength) {
      while (currentRow < dataLength) {
        const lastRow = this.#indexArray[this.#indexArray.length - 1]
        const lastRemoveBtn = this.#select(`.${this.#fieldKey}-rpt-rmv-btn[data-index="${lastRow}"]`)
        this.#handleAdd({ currentTarget: lastRemoveBtn, preventDefault: () => { } })
        currentRow += 1
      }
    }
    const props = this.#window.bf_globals[this.#contentId]
    const { fields } = props
    dataArr.forEach((data, index) => {
      const rowNumber = this.#indexArray[index]
      const row = this.#select(`.${this.#fieldKey}-rpt-wrp[data-index="${rowNumber}"]`)

      Object.entries(data).forEach(([fieldKey, fieldValue]) => {
        const fieldData = fields[fieldKey]
        if (!fieldData || !fieldValue) return
        const fldTyp = fieldData.typ
        let fldName = `${fieldData.fieldName}[${rowNumber}]`
        if (this.#customFieldTypes.includes(fldTyp)) {
          // custom fields
          const fldValues = Array.isArray(fieldValue) ? fieldValue.join(props?.configs?.bf_separator) : fieldValue
          if (props.inits[`${fieldKey}[${rowNumber}]`]) {
            props.inits[`${fieldKey}[${rowNumber}]`].value = fldValues
          } else if (props.inits[fieldKey]) {
            props.inits[fieldKey].value = fldValues
          }
        } else if (['radio', 'check', 'image-select'].includes(fldTyp)) {
          const fldValues = Array.isArray(fieldValue) ? fieldValue : (fieldValue?.split(props?.configs?.bf_separator) || [])
          // radio buttons, checkboxes
          if (fldTyp === 'check' || (fldTyp === 'image-select' && fieldData.inpType === 'checkbox')) fldName += '[]'
          const field = this.#selectAll(`input[name="${fldName}"]`, row)
          field.forEach(f => {
            if (fldValues.includes(f.value)) {
              f.checked = true
              const indx = fldValues.indexOf(f.value)
              fldValues.splice(indx, 1)
            }
          })
          // set other option value  input[data-oopt]: check input[data-bf-other-inp]: text
          if (fldValues.length) {
            const otherOpt = this.#select(`[data-oopt="${fieldKey}"]`, row)
            if (otherOpt) {
              otherOpt.checked = true
              const otherInp = this.#select(`.${fieldKey}-cw input[data-bf-other-inp]`, row)
              if (otherInp) {
                otherInp.value = fldValues.join(', ')
                otherOpt.value = fldValues.join(', ')
                otherOpt.dispatchEvent(new Event('input'))
              }
            }
          }
        } else if (fieldValue) {
          // for text based fields
          const field = this.#select(`[name="${fldName}"]`, row)
          if (field) {
            field.value = fieldValue
          }
        }
      })
    })
  }
}
