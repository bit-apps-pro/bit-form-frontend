// import  from './helpers'

export default class BitDropdownField {
  #dropdownFieldWrapper = null

  #dropdownFldContainer = null

  #dropdownHiddenInputElm = null

  #searchInputElm = null

  #optionWrapperElm = null

  #dropdownWrapperElm = null

  #selectedOptWrpElm = null

  #selectedOptImgElm = null

  #selectedOptLblElm = null

  #selectedOptClearBtnElm = null

  #clearSearchBtnElm = null

  #allowCustomOption = false

  #customOption = null

  #optionListElm = null

  #placeholderImage = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"

  #selectedOptValue = ''

  #customOptions = []

  #options = []

  #document = null

  #window = {}

  #isReset = false

  #config = {
    separator: ',',
    selectedOptImage: false,
    dropdownIcn: '',
    selectedOptClearable: true,
    searchClearable: true,
    optionIcon: false,
    defaultValue: '',
    placeholder: 'Select an option',
    searchPlaceholder: 'Search option',
    maxHeight: 370,
    closeOnSelect: false,
    showChip: true,
    options: [],
    attributes: {},
    classNames: {},
    activeList: 0,
    onChange: () => { },
  }

  #debounceTimeout = null

  #dropdownSearchTerm = ''

  #allEventListeners = []

  constructor(selector, config) {
    Object.assign(this.#config, config)

    this.#document = config.document ? config.document : document
    this.#window = config.window ? config.window : window

    if (typeof selector === 'string') {
      this.#dropdownFieldWrapper = this.#document.querySelector(selector)
    } else {
      this.#dropdownFieldWrapper = selector
    }

    this.fieldKey = this.#config.fieldKey

    this.init()
  }

  init() {
    this.#dropdownHiddenInputElm = this.#select(`.${this.fieldKey}-dpd-hidden-input`)
    this.#searchInputElm = this.#select(`.${this.fieldKey}-opt-search-input`)
    this.#optionWrapperElm = this.#select(`.${this.fieldKey}-option-wrp`)
    this.#dropdownWrapperElm = this.#select(`.${this.fieldKey}-dpd-wrp`)
    this.#selectedOptWrpElm = this.#select(`.${this.fieldKey}-selected-opt-wrp`)
    this.#selectedOptImgElm = this.#select(`.${this.fieldKey}-selected-opt-img`)
    this.#selectedOptLblElm = this.#select(`.${this.fieldKey}-selected-opt-lbl`)
    this.#selectedOptClearBtnElm = this.#select(`.${this.fieldKey}-selected-opt-clear-btn`)
    this.#clearSearchBtnElm = this.#config.searchClearable ? this.#select(`.${this.fieldKey}-search-clear-btn`) : {}

    this.#addEvent(this.#dropdownWrapperElm, 'click', e => { this.#handleDropdownClick(e) })
    this.#addEvent(this.#dropdownWrapperElm, 'keyup', e => { this.#handleDropdownClick(e) })
    this.#addEvent(this.#dropdownWrapperElm, 'blur', e => { this.#handleDropdownBlur(e) })

    this.#addEvent(this.#dropdownFieldWrapper, 'keydown', e => { this.#handleKeyboardNavigation(e) })

    this.#initOptionsList()
    this.#config.defaultValue && this.setSelectedOption(this.#config.defaultValue)
    if (!this.#config.defaultValue) this.#setDefaultValue()

    if (this.#config.selectedOptImage) {
      this.#selectedOptImgElm.src = this.#placeholderImage
    }

    if (this.#config.searchClearable) {
      this.#setStyleProperty(this.#clearSearchBtnElm, 'display', 'none')
      this.#addEvent(this.#clearSearchBtnElm, 'click', () => { this.searchOptions('') })
    }

    this.#searchInputElm.placeholder = this.#config.searchPlaceholder
    this.#searchInputElm.value = ''
    this.#addEvent(this.#searchInputElm, 'keyup', e => { this.#handleSearchInput(e) })

    this.#allowCustomOption = this.#config.allowCustomOption
    // if (this.allowCustomOption) {
    // this.#customOption = this.#select(`.${this.fieldKey}-create-opt`)
    // this.#addEvent(this.#customOption, 'click', () => { this.#addCustomOption() })
    // }

    this.#window.observeElm(this.#dropdownHiddenInputElm, 'value', (oldVal, newVal) => { this.#handleInputValueChange(oldVal, newVal, this.#isReset) })
  }

  #initOptionsList() {
    const activeListElm = this.#select(`.${this.fieldKey}-option-list[data-list-index="${this.#config.activeList}"]`)
    this.#optionListElm = this.#select(`.${this.fieldKey}-option-list.active-list`)
    this.#optionListElm.innerHTML = activeListElm.innerHTML
    this.#addOnClickOptionsEvent()
    this.#config.options = this.#generateOptionsObjFromHtml()
    this.#options = [...this.#config.options]
    this.#addEvent(this.#optionListElm, 'scroll', e => e.stopPropagation())
  }

  #select(selector, elm) {
    if (!elm) return this.#dropdownFieldWrapper.querySelector(selector)
    return elm.querySelector(selector)
  }

  #selectAll(selector) { return this.#dropdownFieldWrapper.querySelectorAll(selector) }

  #addEvent(selector, eventType, cb) {
    selector?.addEventListener(eventType, cb)
    this.#allEventListeners.push({ selector, eventType, cb })
  }

  #appendChild(parent, child) {
    parent.appendChild(child)
  }

  #setDefaultValue() {
    if (!this.#dropdownHiddenInputElm.value) return
    this.setSelectedOption(this.#dropdownHiddenInputElm.value)
    this.#reRenderVirtualOptions()
  }

  #triggerEvent(elm, eventType) {
    const event = new Event(eventType)
    elm.dispatchEvent(event)
  }

  #handleInputValueChange(oldVal, newVal) {
    if (oldVal !== newVal) {
      this.setSelectedOption(newVal)
    }
    if (typeof bit_conditionals !== 'undefined') {
      bit_conditionals({ target: this.#dropdownHiddenInputElm })
    }
  }

  #findNotDisabledOptIndex(activeIndex = -1, direction) {
    if (direction === 'next') {
      const optsLength = this.#options.length
      for (let i = activeIndex + 1; i < optsLength; i += 1) {
        const opt = this.#options[i]
        if (opt.type !== 'group' && !opt.disabled && !opt.disableOnMax) return i
      }
    } else if (direction === 'previous') {
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        const opt = this.#options[i]
        if (opt.type !== 'group' && !opt.disabled && !opt.disableOnMax) return i
      }
    }
  }

  #selectOptElmByIndex(index) {
    return this.#select(`${this.#activeOptionList()} .option[data-index="${index}"]`)
  }

  #handleKeyboardNavigation(e) {
    const activeEl = this.#document.activeElement
    let focussableEl = null
    const isMenuOpen = this.#isMenuOpen()

    if (isMenuOpen) {
      const activeIndex = Number(activeEl.dataset.index || -1)
      if (e.key === 'ArrowDown' || (!e.shiftKey && e.key === 'Tab')) {
        e.preventDefault()
        let nextIndex = 0
        let nextElm = null
        if (activeEl === this.#searchInputElm) {
          nextIndex = this.#findNotDisabledOptIndex(-1, 'next')
          if (this.#allowCustomOption && nextIndex === 0 && this.#getStyleDisplay(this.#customOption) !== 'block') nextIndex = 1
          nextElm = this.#selectOptElmByIndex(nextIndex)
        } else if (activeEl.classList.contains('option')) {
          nextIndex = this.#findNotDisabledOptIndex(activeIndex, 'next')
          nextElm = this.#selectOptElmByIndex(nextIndex)
        }
        if (nextElm) {
          focussableEl = nextElm
        }
      } else if (e.key === 'ArrowUp' || (e.shiftKey && e.key === 'Tab')) {
        e.preventDefault()
        if (activeEl === this.#searchInputElm) {
          focussableEl = this.#dropdownWrapperElm
          if (this.#isMenuOpen()) {
            this.setMenu({ open: false })
          }
        } else if (activeEl.classList.contains('option')) {
          let prevIndex = this.#findNotDisabledOptIndex(activeIndex, 'previous')
          if (this.#addCustomOption && prevIndex === 0 && this.#getStyleDisplay(this.#customOption) !== 'block') prevIndex = -1
          const prevElm = this.#selectOptElmByIndex(prevIndex)
          if (prevElm) {
            focussableEl = prevElm
          } else if (!prevElm) {
            focussableEl = this.#searchInputElm
          }
        }
      } else if (e.key === 'Escape') {
        this.setMenu({ open: false })
      }
    } else if (e.key >= 'a' && e.key <= 'z') {
      clearTimeout(this.#debounceTimeout)
      this.#dropdownSearchTerm += e.key
      this.#debounceTimeout = setTimeout(() => {
        this.#dropdownSearchTerm = ''
      }, 300)
      const searchedOption = this.#config.options.find(option => option.type !== 'group' && !option.disabled && option.lbl.toLowerCase().startsWith(this.#dropdownSearchTerm))
      if (searchedOption) {
        this.setSelectedOption(searchedOption.val)
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (this.#config.multipleSelect) return
      e.preventDefault()
      const selectedOptionIndex = this.#getSelectedOptionIndex()
      const direction = (e.key === 'ArrowDown') ? 'next' : 'previous'
      let optIndex = this.#findNotDisabledOptIndex(selectedOptionIndex, direction)
      if (this.#allowCustomOption && optIndex === 0) optIndex = 1
      if (optIndex > -1 && (optIndex < this.#config.options.length)) {
        this.value = this.#config.options[optIndex].val
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const isChipClearBtnFocused = activeEl.classList.contains('chip-clear-btn')
      if (isChipClearBtnFocused) {
        let hasChipWrp = null
        if (e.key === 'ArrowRight') {
          hasChipWrp = activeEl.parentElement.nextElementSibling
        } else if (e.key === 'ArrowLeft') {
          hasChipWrp = activeEl.parentElement.previousElementSibling
        }
        if (hasChipWrp) {
          focussableEl = this.#select('.chip-clear-btn', hasChipWrp)
        }
      }
    }

    if (focussableEl) focussableEl.focus()
  }

  #activeOptionList() {
    return `.${this.fieldKey}-option-list.active-list`
  }

  #generateOptionsObjFromHtml() {
    const allOptionsElms = Array.from(this.#selectAll(`${this.#activeOptionList()} .option`))
    const generateOptObjFromElm = opt => {
      const obj = {}
      const lblElm = opt.querySelector('.opt-lbl')
      const { value } = opt.dataset
      obj.lbl = lblElm.textContent
      if (value) obj.val = value
      else obj.val = obj.lbl
      if (this.#containsClass(opt, 'disabled-opt')) obj.disabled = true
      const imgElm = opt.querySelector('.opt-icn')
      if (this.#config.optionIcon && imgElm?.src) {
        obj.icn = imgElm.src
      }
      const { attributes } = opt
      const len = attributes.length
      obj.attributes = {}
      for (let i = 0; i < len; i += 1) {
        const attrName = attributes[i].nodeName
        obj.attributes[attrName] = opt.getAttribute(attrName)
      }

      return obj
    }

    const arr = []
    const { length } = allOptionsElms
    for (let optIndex = 0; optIndex < length; optIndex += 1) {
      const opt = allOptionsElms[optIndex]
      let obj = {}
      let groupIndex = null
      if (opt.classList.contains('opt-group-title')) {
        obj = generateOptObjFromElm(opt)
        obj.type = 'group'
        arr.push(obj)
        groupIndex = optIndex
        for (let childIndex = optIndex + 1; childIndex < length; childIndex += 1) {
          const child = allOptionsElms[childIndex]
          if (child.classList.contains('opt-group-child')) {
            const childObj = generateOptObjFromElm(child)
            childObj.groupIndex = groupIndex
            optIndex = childIndex
            arr.push(childObj)
          } else {
            optIndex = childIndex - 1
            break
          }
        }
      } else {
        obj = generateOptObjFromElm(opt)
        arr.push(obj)
      }
    }

    return arr
  }

  #clearSelectedOption(e) {
    e?.stopPropagation()
    this.#selectedOptValue = ''
    if (this.#config.selectedOptImage) {
      this.#selectedOptImgElm.src = this.#placeholderImage
      this.#handlePlaceholderImgCls(this.#selectedOptImgElm)
    }
    this.value = ''
    if (this.#config.multipleSelect && this.#config.showChip) this.#generateSelectedOptChips([])
    if (!this.#config.showChip) this.#setTextContent(this.#selectedOptLblElm, this.#config.placeholder)
    if (this.#config.selectedOptClearable) this.#setStyleProperty(this.#selectedOptClearBtnElm, 'display', 'none')
    this.#disableOptOnMaxSelection()
    if (!this.#isReset) this.#triggerEvent(this.#dropdownHiddenInputElm, 'blur')
  }

  #searchOptionObjByVal(val) {
    return [...this.#config.options, ...this.#customOptions].find(opt => opt.val === val)
  }

  #generateSelectedOptChips(valueArr) {
    this.#setTextContent(this.#selectedOptLblElm, '')
    this.#dropdownFldContainer = this.#dropdownFieldWrapper.parentElement
    if (!valueArr.length) {
      this.#dropdownFldContainer.style.removeProperty('min-height')
      if (this.#config.selectedOptImage) this.#setStyleProperty(this.#selectedOptImgElm, 'display', 'block')
      this.#setTextContent(this.#selectedOptLblElm, this.#config.placeholder)
      return
    }
    if (this.#config.selectedOptImage) this.#setStyleProperty(this.#selectedOptImgElm, 'display', 'none')
    valueArr.forEach((val, valIndx) => {
      const chipWrp = this.#createElm('div')
      this.#setClassName(chipWrp, 'chip-wrp')
      const chipWrpCustomClasses = this.#config.customClasses?.['chip-wrp']
      if (chipWrpCustomClasses) this.#setCustomClass(chipWrp, chipWrpCustomClasses)
      const chipWrpCustomAttributes = this.#config.customAttributes?.['chip-wrp']
      if (chipWrpCustomAttributes) this.#setCustomAttr(chipWrp, chipWrpCustomAttributes)
      if ('chip-wrp' in this.#config.attributes) {
        const optChipWrp = this.#config.attributes['chip-wrp']
        this.#setCustomAttr(chipWrp, optChipWrp)
      }

      if (this.#config.selectedOptImage && this.#config.optionIcon) {
        const chipIcn = this.#createElm('img')
        this.#setClassName(chipIcn, 'chip-icn')
        if ('chip-icn' in this.#config.attributes) {
          const optChipIcn = this.#config.attributes['chip-icn']
          this.#setCustomAttr(chipIcn, optChipIcn)
        }
        const optObj = this.#searchOptionObjByVal(val)
        this.#setAttribute(chipIcn, 'src', optObj.icn || this.#placeholderImage)
        this.#handlePlaceholderImgCls(chipIcn, optObj.icn)
        this.#setAttribute(chipIcn, 'alt', optObj.lbl)
        const chipIcnCustomClasses = this.#config.customClasses?.['chip-icn']
        if (chipIcnCustomClasses) this.#setCustomClass(chipIcn, chipIcnCustomClasses)
        const chipIcnCustomAttributes = this.#config.customAttributes?.['chip-icn']
        if (chipIcnCustomAttributes) this.#setCustomAttr(chipIcn, chipIcnCustomAttributes)
        this.#appendChild(chipWrp, chipIcn)
      }

      const chipLbl = this.#createElm('span')
      this.#setClassName(chipLbl, 'chip-lbl')
      if ('chip-lbl' in this.#config.attributes) {
        const optChipLbl = this.#config.attributes['chip-lbl']
        this.#setCustomAttr(chipLbl, optChipLbl)
      }
      const chipLblCustomClasses = this.#config.customClasses?.['chip-lbl']
      if (chipLblCustomClasses) this.#setCustomClass(chipLbl, chipLblCustomClasses)
      const chipLblCustomAttributes = this.#config.customAttributes?.['chip-lbl']
      if (chipLblCustomAttributes) this.#setCustomAttr(chipLbl, chipLblCustomAttributes)

      const optObj = this.#searchOptionObjByVal(val)
      this.#setTextContent(chipLbl, optObj ? optObj.lbl : val)
      this.#appendChild(chipWrp, chipLbl)

      const chipClearBtn = this.#createElm('button')
      this.#setClassName(chipClearBtn, 'chip-clear-btn')
      if ('chip-clear-btn' in this.#config.attributes) {
        const optClrBtn = this.#config.attributes['chip-clear-btn']
        this.#setCustomAttr(chipClearBtn, optClrBtn)
      }
      const chipClearBtnCustomClasses = this.#config.customClasses?.['chip-clear-btn']
      if (chipClearBtnCustomClasses) this.#setCustomClass(chipClearBtn, chipClearBtnCustomClasses)
      const chipClearBtnCustomAttributes = this.#config.customAttributes?.['chip-clear-btn']
      if (chipClearBtnCustomAttributes) this.#setCustomAttr(chipClearBtn, chipClearBtnCustomAttributes)
      chipClearBtn.innerHTML = this.#selectedOptClearBtnElm.innerHTML
      this.#addEvent(chipClearBtn, 'click', e => { this.#clearSelectedChip(e, valIndx) })
      this.#addEvent(chipClearBtn, 'keyup', e => { e.key === 'Backspace' && this.#clearSelectedChip(e, valIndx) })
      this.#appendChild(chipWrp, chipClearBtn)

      this.#appendChild(this.#selectedOptLblElm, chipWrp)
    })
    this.#dropdownFldContainer = this.#dropdownFieldWrapper.parentElement
    this.#setStyleProperty(this.#dropdownFldContainer, 'min-height', `${this.#dropdownFieldWrapper.offsetHeight - this.#optionWrapperElm.offsetHeight}px`)
  }

  #clearSelectedChip(e, chipIndex) {
    e.stopPropagation()
    const valueArr = this.#selectedOptValue.split(this.#config.separator)
    valueArr.splice(chipIndex, 1)
    this.setSelectedOption(valueArr.join(this.#config.separator))
    this.#reRenderVirtualOptions()
  }

  #handlePlaceholderImgCls(elm = null, remove = 0) {
    if (remove) {
      this.#removeClassName(elm, 'placeholder-img')
    } else {
      this.#setClassName(elm, 'placeholder-img')
    }
  }

  #disableOptOnMaxSelection(idDisable = false) {
    if (idDisable) {
      const selectedValues = this.#selectedOptValue.split(this.#config.separator)
      this.#options = this.#options.map(opt => {
        const newOpt = opt
        if (!opt.disabled && !selectedValues.includes(opt.val)) {
          newOpt.disableOnMax = true
        } else {
          newOpt.disableOnMax = false
        }
        return newOpt
      })
    } else {
      this.#options = this.#options.map(opt => {
        const newOpt = opt
        delete newOpt.disableOnMax
        return newOpt
      })
    }
    this.#reRenderVirtualOptions()
  }

  setSelectedOption(values) {
    let selectedItem = null
    let valueArr = values.split(this.#config.separator)
    valueArr = valueArr.filter(val => this.#searchOptionObjByVal(val))
    if (this.#config.multipleSelect) {
      if (valueArr.length === 1) {
        selectedItem = this.#searchOptionObjByVal(valueArr[0])
      } else if (valueArr.length > 1) {
        selectedItem = { lbl: `${valueArr.length} options selected` }
      }
      if (this.#config.disableOnMax && this.#config.mx && valueArr.length >= this.#config.mx) {
        this.#disableOptOnMaxSelection(true)
      } else {
        this.#disableOptOnMaxSelection(false)
      }
    } else {
      selectedItem = this.#searchOptionObjByVal(values)
    }
    this.#selectedOptValue = values
    if (!this.#selectedOptValue) this.#clearSelectedOption()
    if (!selectedItem) return

    this.value = values
    if (this.#config.selectedOptImage) {
      if (this.#config.multipleSelect) {
        if (valueArr.length > 1) {
          this.#selectedOptImgElm.src = this.#placeholderImage
          this.#handlePlaceholderImgCls(this.#selectedOptImgElm)
        } else if (valueArr.length === 1) {
          this.#selectedOptImgElm.src = selectedItem.icn || this.#placeholderImage
          this.#handlePlaceholderImgCls(this.#selectedOptImgElm, selectedItem.icn)
        } else {
          this.#selectedOptImgElm.src = this.#placeholderImage
          this.#handlePlaceholderImgCls(this.#selectedOptImgElm)
        }
      } else {
        this.#selectedOptImgElm.src = selectedItem.icn || this.#placeholderImage
        this.#handlePlaceholderImgCls(this.#selectedOptImgElm, selectedItem.icn)
      }
    }

    if (this.#config.multipleSelect && this.#config.showChip) this.#generateSelectedOptChips(valueArr)
    if (!this.#config.showChip) this.#setTextContent(this.#selectedOptLblElm, selectedItem.lbl)
    if (this.#config.closeOnSelect) this.setMenu({ open: false })
    if (this.#config.selectedOptClearable) {
      this.#setStyleProperty(this.#selectedOptClearBtnElm, 'display', 'grid')
      this.#addEvent(this.#selectedOptClearBtnElm, 'click', e => { this.#clearSelectedOption(e) })
    }
    if (this.#config.onChange) this.#config.onChange(values)
    if (!this.#isReset) this.#triggerEvent(this.#dropdownHiddenInputElm, 'blur')
  }

  #getSelectedOptionIndex() {
    return this.#options.findIndex(ot => ot.val === this.#selectedOptValue)
  }

  #createElm(elm) {
    return this.#document.createElement(elm)
  }

  #setTabIndex(elm, ind) {
    elm.tabIndex = ind
  }

  #setClassName(elm, cn) {
    elm.classList.add(cn)
  }

  #removeClassName(elm, cn) {
    elm.classList.remove(cn)
  }

  #getStyleDisplay(elm) {
    return elm?.style.display || ''
  }

  #containsClass(elm, className) {
    return elm.classList.contains(className)
  }

  #setTextContent(elm, txt) {
    elm.textContent = txt
  }

  #setStyleProperty(elm, property, value) {
    elm.style.setProperty(property, value, 'important')
  }

  #splitStringByDelimiter(str) {
    return (str && str.split(this.#config.separator)) || []
  }

  #generateStringFromArr(arr) {
    return arr.join(this.#config.separator)
  }

  #handleOptionValue(e) {
    e.stopPropagation()
    const optElm = e.currentTarget
    const val = optElm.dataset.value
    if (this.#allowCustomOption && optElm.classList.contains('create-opt')) {
      this.#addCustomOption(val)
    }
    if (this.#config.multipleSelect) {
      const valueArr = this.#splitStringByDelimiter(this.#selectedOptValue)
      const alreadyExists = valueArr.includes(val)
      if (alreadyExists) {
        const valIndx = valueArr.indexOf(val)
        valueArr.splice(valIndx, 1)
        this.#removeClassName(optElm, 'selected-opt')
      } else {
        valueArr.push(val)
        this.#setClassName(optElm, 'selected-opt')
      }

      this.#selectedOptValue = this.#generateStringFromArr(valueArr)
    } else {
      const prevSelected = this.#select('.selected-opt')
      if (prevSelected) this.#removeClassName(prevSelected, 'selected-opt')
      this.#setClassName(optElm, 'selected-opt')
      this.#selectedOptValue = val
    }

    this.setSelectedOption(this.#selectedOptValue)
    setTimeout(() => {
      const selectedOpt = this.#select(`${this.#activeOptionList()} .option[data-value="${val}"]`)
      selectedOpt.focus()
    }, 0)
  }

  #reRenderVirtualOptions() {
    this.#generateOptions()
  }

  #getCurrentActiveOptions() {
    return this.#selectAll(`${this.#activeOptionList()} .option:not(.opt-group-title):not(.create-opt)`)
  }

  #addOnClickOptionsEvent() {
    const allOptionElms = this.#getCurrentActiveOptions()
    const elmLength = allOptionElms.length
    for (let i = 0; i < elmLength; i += 1) {
      const optionElm = allOptionElms[i]
      this.#addEvent(optionElm, 'click', e => { this.#handleOptionValue(e) })
      this.#addEvent(optionElm, 'keyup', e => { e.key === 'Enter' && this.#handleOptionValue(e) })
    }
  }

  #toggleTabIndexOfOptions() {
    const allOptionElms = this.#getCurrentActiveOptions()
    const isMenuOpen = this.#isMenuOpen()
    const elmLength = allOptionElms.length
    for (let i = 0; i < elmLength; i += 1) {
      const optionElm = allOptionElms[i]
      if (isMenuOpen) {
        this.#setTabIndex(optionElm, 0)
      } else {
        this.#setTabIndex(optionElm, -1)
      }
    }
  }

  #setAttribute(elm, name, value) {
    elm?.setAttribute?.(name, value)
  }

  #setCustomClass(element, classes) {
    classes.trim().split(/\b\s+\b/g).forEach(cls => this.#setClassName(element, cls))
  }

  #setCustomAttr(element, objArr) {
    const optLen = objArr.length
    if (optLen) {
      for (let i = 0; i < optLen; i += 1) {
        this.#setAttribute(element, objArr[i].key, objArr[i].value)
      }
    }
  }

  #generateOptions() {
    this.#optionListElm.innerHTML = ''

    const selectedValues = this.#selectedOptValue.split(this.#config.separator)

    const optLength = this.#options.length
    for (let i = 0; i < optLength; i += 1) {
      const opt = this.#options[i]
      const li = this.#createElm('li')

      if (opt.i === 'not-found') {
        this.#setTextContent(li, opt.lbl)
        this.#setClassName(li, 'opt-not-found')
        this.#appendChild(this.#optionListElm, li)
        return
      }
      this.#setClassName(li, 'option')
      const lblimgbox = this.#createElm('span')
      this.#setClassName(lblimgbox, 'opt-lbl-wrp')
      if ('opt-lbl-wrp' in this.#config.classNames) {
        const optLblWrpCls = this.#config.classNames['opt-lbl-wrp']
        if (optLblWrpCls) this.#setCustomClass(lblimgbox, optLblWrpCls)
      }
      // this.#setAttribute(lblimgbox, 'data-dev-opt-lbl-wrp', this.fieldKey)
      if ('opt-lbl-wrp' in this.#config.attributes) {
        const optLblWrp = this.#config.attributes['opt-lbl-wrp']
        this.#setCustomAttr(lblimgbox, optLblWrp)
      }
      if (this.#config.optionIcon) {
        const img = this.#createElm('img')
        this.#setClassName(img, 'opt-icn')
        // this.#setAttribute(img, 'data-dev-opt-icn', this.fieldKey)
        if ('opt-icn' in this.#config.classNames) {
          const optIcnCls = this.#config.classNames['opt-icn']
          if (optIcnCls) this.#setCustomClass(img, optIcnCls)
        }
        if ('opt-icn' in this.#config.attributes) {
          const optIcn = this.#config.attributes['opt-icn']
          this.#setCustomAttr(img, optIcn)
        }
        img.src = opt.icn || this.#placeholderImage

        this.#handlePlaceholderImgCls(img, opt.icn)
        img.alt = opt.lbl
        img.loading = 'lazy'
        lblimgbox.append(img)
      }
      const lbl = this.#createElm('span')
      this.#setClassName(lbl, 'opt-lbl')
      if ('opt-lbl' in this.#config.classNames) {
        const optLblCls = this.#config.classNames['opt-lbl']
        if (optLblCls) this.#setCustomClass(lbl, optLblCls)
      }
      // this.#setAttribute(lbl, 'data-dev-opt-lbl', this.fieldKey)
      if ('opt-lbl' in this.#config.attributes) {
        const optLbl = this.#config.attributes['opt-lbl']
        this.#setCustomAttr(lbl, optLbl)
      }
      this.#setTextContent(lbl, opt.lbl)
      lblimgbox.append(lbl)
      const prefix = this.#createElm('span')
      this.#setClassName(prefix, 'opt-prefix')
      if ('opt-prefix' in this.#config.classNames) {
        const optPrefix = this.#config.classNames['opt-prefix']
        if (optPrefix) this.#setCustomClass(prefix, optPrefix)
      }
      if ('opt-prefix' in this.#config.attributes) {
        const optPrefix = this.#config.attributes['opt-prefix']
        this.#setCustomAttr(lbl, optPrefix)
      }
      this.#setTextContent(prefix, opt.code)

      li.append(lblimgbox, prefix)

      Object.keys(opt.attributes).map(attrName => {
        this.#setAttribute(li, attrName, opt.attributes[attrName])
      })

      if (selectedValues.includes(opt.val)) {
        this.#setClassName(li, 'selected-opt')
        this.#setAttribute(li, 'aria-selected', true)
      } else {
        this.#setAttribute(li, 'aria-selected', false)
      }

      if (opt.type === 'group') {
        this.#setClassName(li, 'opt-group-title')
      } else {
        if ('groupIndex' in opt) this.#setClassName(li, 'opt-group-child')
        this.#setAttribute(li, 'data-index', i)
        this.#setAttribute(li, 'data-value', opt.val)
        this.#setAttribute(li, 'role', 'option')
        this.#setAttribute(li, 'aria-posinset', i + 1)
        this.#setAttribute(li, 'aria-setsize', this.#options.length)
        this.#setTabIndex(li, this.#isMenuOpen() ? '0' : '-1')
        if (opt.disabled) {
          this.#setClassName(li, 'disabled-opt')
        } else if (opt.disableOnMax) {
          this.#setClassName(li, 'disable-on-max')
        } else {
          this.#addEvent(li, 'click', e => { this.#handleOptionValue(e) })
          this.#addEvent(li, 'keyup', e => { e.key === 'Enter' && this.#handleOptionValue(e) })
        }
      }

      this.#appendChild(this.#optionListElm, li)
    }
  }

  #handleSearchInput(e) {
    e.stopPropagation()
    if (e.key === 'Enter' && this.#options.length) {
      const optKey = this.#options?.[0].i
      if (optKey) {
        this.setSelectedOption(optKey)
        this.searchOptions('')
      }
      if (this.#allowCustomOption && this.#getStyleDisplay(this.#customOption) !== 'none') {
        const { value } = e.target
        this.#addCustomOption(value)
        if (this.#config.multipleSelect) {
          const valueArr = this.#splitStringByDelimiter(this.#selectedOptValue)
          valueArr.push(value)
          this.#selectedOptValue = this.#generateStringFromArr(valueArr)
        } else {
          this.#selectedOptValue = value
        }

        this.#reRenderVirtualOptions()
        this.setSelectedOption(this.#selectedOptValue)
      }
    } else {
      this.searchOptions(e.target.value)
    }
  }

  #addCustomOption(val) {
    let value = val.trim()
    if (value.includes) {
      if (value) {
        const customOptLen = this.#customOptions.length
        for (let i = 0; i < customOptLen; i += 1) {
          const opt = this.#customOptions[i]
          const lbl = opt.lbl.toLowerCase()
          if (lbl === value) {
            value = ''
            break
          }
        }
        if (value) {
          const obj = { lbl: value, val: value }
          obj.attributes = {}
          this.#customOptions.push(obj)
          this.#options.push(obj)
          this.searchOptions('')
          // this.#addOnClickOptionsEvent()
        }
      }
    }
  }

  searchOptions(value) {
    this.#setSearchValue(value)
    let filteredOptions = []
    let isExist = false
    if (value) {
      const optLengths = this.#config.options.length
      const alreadyPushedGroups = []
      const searchText = value.toLowerCase()

      for (let i = 0; i < optLengths; i += 1) {
        const opt = this.#config.options[i]
        if ('type' in opt) continue
        const lbl = opt.lbl.toLowerCase()
        if (lbl.includes(searchText)) {
          if ('groupIndex' in opt && !alreadyPushedGroups.includes(opt.groupIndex)) {
            const groupInd = opt.groupIndex
            alreadyPushedGroups.push(groupInd)
            filteredOptions.push(this.#config.options[groupInd])
          }
          filteredOptions.push(opt)
          if (lbl === searchText) isExist = true
        }
      }
      const customOptLen = this.#customOptions.length
      for (let i = 0; i < customOptLen; i += 1) {
        const opt = this.#customOptions[i]
        const lbl = opt.lbl.toLowerCase()
        if (lbl.includes(searchText)) {
          filteredOptions.push(opt)
          if (lbl === searchText) isExist = true
        }
      }

      if (!filteredOptions.length) {
        filteredOptions = [{ i: 'not-found', lbl: 'No Option Found' }]
      }
      this.#options = this.#allowCustomOption ? [this.#config.options[0]] : []
      this.#options.push(...filteredOptions)
      if (this.#config.searchClearable) this.#setStyleProperty(this.#clearSearchBtnElm, 'display', 'grid')
    } else {
      this.#options = this.#config.options
      if (this.#config.searchClearable) this.#setStyleProperty(this.#clearSearchBtnElm, 'display', 'none')
      if (this.#allowCustomOption) {
        this.#customOption = this.#select(`${this.#activeOptionList()} .create-opt`)
        this.#setStyleProperty(this.#customOption, 'display', 'none')
        this.#options = this.#options.concat(this.#customOptions)
      }
    }

    this.#reRenderVirtualOptions()
    this.#customOption = this.#select(`${this.#activeOptionList()} .create-opt`)
    if (isExist && this.#allowCustomOption) this.#setStyleProperty(this.#customOption, 'display', 'none')
    else if (this.#allowCustomOption && value.trim()) {
      this.#setStyleProperty(this.#customOption, 'display', 'block')
      const createOptLbl = this.#customOption.querySelector('.opt-lbl')
      createOptLbl.innerText = `Create: ${value}`
      this.#setAttribute(this.#customOption, 'data-value', value)
      // this.#addEvent(this.#customOption, 'click', () => { this.#addCustomOption() })
    }
  }

  #setSearchValue(val) {
    this.#searchInputElm.value = val
  }

  #handleOutsideClick(e) {
    if (this.#dropdownFieldWrapper.contains(e.target)) return
    this.setMenu({ open: false })
  }

  #isMenuOpen() {
    return this.#containsClass(this.#dropdownFieldWrapper, 'menu-open')
  }

  #openDropdownAsPerWindowSpace() {
    const elementRect = this.#dropdownWrapperElm.getBoundingClientRect()

    const spaceAbove = elementRect.top
    const spaceBelow = this.#window.innerHeight - elementRect.bottom

    if (spaceBelow < spaceAbove && spaceBelow < this.#config.maxHeight) {
      this.#setStyleProperty(this.#dropdownFieldWrapper, 'flex-direction', 'column-reverse')
      this.#setStyleProperty(this.#dropdownFieldWrapper, 'bottom', '0%')
    } else {
      this.#setStyleProperty(this.#dropdownFieldWrapper, 'flex-direction', 'column')
      this.#setStyleProperty(this.#dropdownFieldWrapper, 'bottom', 'auto')
    }
  }

  setMenu({ open }) {
    this.#setStyleProperty(this.#optionWrapperElm, 'max-height', `${open ? this.#config.maxHeight : 0}px`)

    if (open) {
      this.#openDropdownAsPerWindowSpace()
      this.#setClassName(this.#dropdownFieldWrapper, 'menu-open')
      this.#addEvent(this.#document, 'click', e => this.#handleOutsideClick(e))
      this.#setTabIndex(this.#searchInputElm, 0)
      this.#setTabIndex(this.#clearSearchBtnElm, 0)
      this.#dropdownWrapperElm.setAttribute('aria-expanded', 'true')
      this.#setAttribute(this.#optionListElm, 'aria-hidden', false)
      this.#setAttribute(this.#searchInputElm, 'aria-hidden', false)
      this.#reRenderVirtualOptions()
    } else {
      this.#removeClassName(this.#dropdownFieldWrapper, 'menu-open')
      this.#document.removeEventListener('click', this.#handleOutsideClick)
      setTimeout(() => { this.searchOptions('') }, 100)
      this.#setTabIndex(this.#searchInputElm, -1)
      this.#setTabIndex(this.#clearSearchBtnElm, -1)
      this.#dropdownWrapperElm.setAttribute('aria-expanded', 'false')
      this.#setAttribute(this.#optionListElm, 'aria-hidden', true)
      this.#setAttribute(this.#searchInputElm, 'aria-hidden', true)
    }
    this.#toggleTabIndexOfOptions()
  }

  #handleDropdownClick(e) {
    if (e.code === 'Space') {
      this.#searchInputElm.focus()
      this.setMenu({ open: true })
    }
    if (e.type === 'click') {
      if (this.#isMenuOpen()) {
        this.setMenu({ open: false })
      } else {
        this.#searchInputElm.focus()
        this.setMenu({ open: true })
      }
    }
  }

  #handleDropdownBlur(e) {
    if (!e.target.parentElement?.contains(e.relatedTarget)) {
      this.#triggerEvent(this.#dropdownHiddenInputElm, 'blur')
    }
  }

  set activelist(name) {
    const listElm = this.#select(`.${this.fieldKey}-option-list[data-list="${name}"]`)
    if (listElm) {
      const listIndex = listElm.getAttribute('data-list-index')
      this.#config.activeList = listIndex
      this.setSelectedOption('')
      this.#initOptionsList()
    }
  }

  set disabled(status) {
    if (String(status).toLowerCase() === 'true') {
      this.#dropdownFieldWrapper.classList.add('disabled')
      this.#dropdownHiddenInputElm.disabled = true
      this.#setTabIndex(this.#dropdownWrapperElm, -1)
      this.#setTabIndex(this.#selectedOptClearBtnElm, -1)
      this.#setAttribute(this.#dropdownWrapperElm, 'aria-label', 'Dropdown disabled')
      this.setMenu({ open: false })
    } else if (String(status).toLowerCase() === 'false') {
      this.#removeClassName(this.#dropdownFieldWrapper, 'disabled')
      this.#dropdownHiddenInputElm.removeAttribute('disabled')
      this.#setTabIndex(this.#dropdownWrapperElm, 0)
      this.#setTabIndex(this.#selectedOptClearBtnElm, 0)
      this.#setAttribute(this.#dropdownWrapperElm, 'aria-label', this.#config.placeholder)
    }
  }

  get disabled() {
    return this.#dropdownHiddenInputElm.disabled
  }

  set readonly(status) {
    if (String(status).toLowerCase() === 'true') {
      this.#setClassName(this.#dropdownFieldWrapper, 'disabled')
      this.#dropdownHiddenInputElm.readOnly = true
      this.#setTabIndex(this.#dropdownWrapperElm, -1)
      this.#setTabIndex(this.#selectedOptClearBtnElm, -1)
      this.setMenu({ open: false })
    } else if (String(status).toLowerCase() === 'false') {
      this.#removeClassName(this.#dropdownFieldWrapper, 'disabled')
      this.#dropdownHiddenInputElm.removeAttribute('readonly')
      this.#setTabIndex(this.#dropdownWrapperElm, 0)
      this.#setTabIndex(this.#selectedOptClearBtnElm, 0)
    }
  }

  get readonly() {
    return this.#dropdownHiddenInputElm.readOnly
  }

  set value(val) {
    this.#dropdownHiddenInputElm.value = val
    this.#setAttribute(this.#dropdownHiddenInputElm, 'value', val)
  }

  get value() {
    return this.#dropdownHiddenInputElm.value
  }

  #detachAllEvents() {
    this.#allEventListeners.forEach(({ selector, eventType, cb }) => {
      selector.removeEventListener(eventType, cb)
    })
  }

  destroy() {
    this.value = ''
    this.#detachAllEvents()
  }

  reset() {
    this.#isReset = true
    this.#clearSelectedOption()
    this.destroy()
    this.init()
    setTimeout(() => {
      this.#isReset = false
    }, 1)
  }
}

// const list = new DropdownField('.dpd-fld-wrp', {
//   selectedOptImage: false,
//   selectedOptClearable: true,
//   searchClearable: true,
//   optionIcon: true,
//   placeholder: 'Select an option',
//   searchPlaceholder: 'Search option',
//   maxHeight: 400,
//   multipleSelect: true,
//   mn,
//   mx,
//   selectedOptImgSrc: 'test.png',
//   closeOnSelect: false,
//   activeList: 'dp1',
//   dropdownIcn: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
//   onChange: val => { console.log(val) },
// })

// list.activelist = 'dp2'
// list.readonly = true
// list.disabled = true

// list.value = 'Option 1\nOption 2'
// console.log(list.value)

// const listBtn = document.querySelector('#list-btn')
// listBtn.addEventListener('click', e => {
//   e.preventDefault()

//   const activeList = document.querySelector('.option-list.active-list').dataset.list
//   if (activeList === 'dp1') {
//     list.activelist = 'dp2'
//     list.value = 'Option 4'
//   } else if (activeList === 'dp2') {
//     list.activelist = 'dp1'
//     list.value = 'Option 1\nOption 6'
//   }
// })

// setconfig property
