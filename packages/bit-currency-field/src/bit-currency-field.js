export default class BitCurrencyField {
  #placeholderImage = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"

  #currencyNumberFieldWrapper = null

  #currencyHiddenInputElm = null

  #clearCurrencyInputElm = null

  #dropdownWrapperElm = null

  #optionWrapperElm = null

  #selectedCurrencyImgElm = null

  #selectedCurrencyCode = null

  #searchWrpElm = null

  #searchInputElm = null

  #currencyInnerWrp = null

  #currencyInputElm = null

  #clearSearchBtnElm = null

  #optionListElm = null

  #rowHeight = 30

  #currencySelectedFromList = false

  #options = []

  #document

  #window = {}

  #assetsURL = ''

  #config = {
    maxHeight: 370,
    searchCurrencyPlaceholder: 'Search Currency',
    noCurrencyFoundText: 'No Currency Found',
    selectedCurrencyClearable: true,
    searchClearable: true,
    selectedFlagImage: false,
    defaultCurrencyKey: '',
    defaultValue: '',
    optionFlagImage: true,
    inputFormatOptions: {
      formatter: 'browser',
      showCurrencySymbol: true,
      decimalSeparator: '.',
    },
    valueFormatOptions: {
      formatter: 'browser',
      showCurrencySymbol: true,
      decimalSeparator: '.',
    },
    attributes: {},
    classNames: {},
    assetsURL: '',
  }

  #debounceTimeout = null

  #dropdownSearchTerm = ''

  #allEventListeners = []

  constructor(selector, config) {
    Object.assign(this.#config, config)

    this.#window = config.window ? config.window : window
    this.#document = config.document ? config.document : document
    if (typeof selector === 'string') {
      this.#currencyNumberFieldWrapper = this.#document.querySelector(selector)
    } else {
      this.#currencyNumberFieldWrapper = selector
    }
    if (typeof this.#config.options === 'string') {
      this.#config.options = this.#getOptionsFromGlobalPath(this.#config.options)
    }
    this.#config.options = this.#config.options.filter(c => !c.hide)
    this.#options = [...this.#config.options]
    this.fieldKey = this.#config.fieldKey
    this.#assetsURL = config.assetsURL
    this.init()
  }

  init() {
    this.#currencyInnerWrp = this.#select(`.${this.fieldKey}-currency-inner-wrp`)
    this.#currencyInputElm = this.#select(`.${this.fieldKey}-currency-amount-input`)
    this.#currencyHiddenInputElm = this.#select(`.${this.fieldKey}-currency-hidden-input`)
    this.#clearCurrencyInputElm = this.#select(`.${this.fieldKey}-input-clear-btn`)
    this.#selectedCurrencyImgElm = this.#select(`.${this.fieldKey}-selected-currency-img`)
    this.#searchWrpElm = this.#select(`.${this.fieldKey}-option-search-wrp`)
    this.#searchInputElm = this.#select(`.${this.fieldKey}-opt-search-input`)
    this.#dropdownWrapperElm = this.#select(`.${this.fieldKey}-dpd-wrp`)
    this.#optionWrapperElm = this.#select(`.${this.fieldKey}-option-wrp`)
    this.#clearSearchBtnElm = this.#select(`.${this.fieldKey}-search-clear-btn`)
    this.#optionListElm = this.#select(`.${this.fieldKey}-option-list`)
    this.setMenu({ open: false })
    this.#addEvent(this.#currencyNumberFieldWrapper, 'keydown', e => { this.#handleKeyboardNavigation(e) })

    this.#addEvent(this.#dropdownWrapperElm, 'click', e => { this.#handleDropdownClick(e) })
    this.#addEvent(this.#dropdownWrapperElm, 'keyup', e => { this.#handleDropdownClick(e) })

    this.#addEvent(this.#currencyInputElm, 'focus', () => { this.#handleCurrencyInputFocus() })
    this.#addEvent(this.#currencyInputElm, 'blur', () => { this.#handleCurrencyInputBlur() })
    this.#addEvent(this.#currencyInputElm, 'input', e => { this.#handleCurrencyInput(e) })
    if (this.#config.selectedCurrencyClearable) this.#addEvent(this.#clearCurrencyInputElm, 'click', e => { this.#handleClearCurrencyInput(e) })

    this.#window.observeElm(this.#currencyHiddenInputElm, 'value', (oldVal, newVal) => { this.#handleHiddenInputValueChange(oldVal, newVal) })
    if (this.#config.defaultValue) this.#handleDefaultCurrencyInputValue()
    if (!this.#config.defaultValue && this.#config.defaultCurrencyKey) this.setSelectedCurrencyItem(this.#config.defaultCurrencyKey)

    this.#addEvent(this.#optionListElm, 'scroll', e => { e.stopPagination() })
    // this.#generateOptions()

    if (this.#config.searchClearable) {
      this.#setStyleProperty(this.#searchInputElm, 'padding-right', '35px')
      this.#setStyleProperty(this.#clearSearchBtnElm, 'display', 'none')
      this.#addEvent(this.#clearSearchBtnElm, 'click', () => { this.searchOptions('') })
    }
    this.#searchInputElm.value = ''
    this.#addEvent(this.#searchInputElm, 'keyup', e => { this.#handleSearchInput(e) })
  }

  #getOptionsFromGlobalPath(path) {
    const pathArr = path.split('->')
    let options = this.#window
    pathArr.forEach(p => {
      options = options[p]
    })
    return options
  }

  #handleCurrencyInputFocus() {
    this.#setAttribute(this.#currencyInputElm, 'type', 'number')
    this.#currencyInputElm.value = this.#currencyInputElm.dataset.numValue || ''
  }

  #roundNumbers(value, precision = 0) {
    const multiplier = 10 ** (precision || 0)
    return Math.round(value * multiplier) / multiplier
  }

  #handleCurrencyInputBlur() {
    this.#setAttribute(this.#currencyInputElm, 'type', 'text')
    const numValue = Number(this.#currencyInputElm.dataset.numValue)

    if (this.#currencyInputElm.dataset.numValue === '' || Number.isNaN(numValue)) {
      this.#currencyInputElm.value = ''
      this.#currencyHiddenInputElm.value = ''
      this.#setAttribute(this.#currencyHiddenInputElm, 'value', '')
      this.#triggerEvent(this.#currencyHiddenInputElm, 'blur')
      return
    }

    const { inputFormatOptions, valueFormatOptions } = this.#config

    const formattedValue = this.#handleCurrencyFormat(numValue, inputFormatOptions)

    this.#currencyInputElm.value = formattedValue

    this.value = this.#handleCurrencyFormat(numValue, valueFormatOptions)
    this.#triggerEvent(this.#currencyHiddenInputElm, 'blur')
  }

  #handleCurrencyFormat(numValue, formatOptions) {
    const selected = this.#getSelectedCurrencyItem()
    const { defaultCurrencyKey } = this.#config
    const { formatter, roundToClosestInteger, showCurrencySymbol, currencyPosition, symbolPosition } = formatOptions
    const currency = selected?.i || defaultCurrencyKey
    if (!currency) return numValue

    if (roundToClosestInteger) {
      numValue = this.#roundNumbers(numValue)
    }

    let formattedValue = ''

    if (formatter === 'browser') {
      formattedValue = this.#browserFormatter(numValue, currency, formatOptions)
    } else if (formatter === 'custom' || !formatter) {
      formattedValue = this.#customFormatter(numValue, formatOptions)
    } else if (formatter === 'none') {
      formattedValue = numValue
    }

    if (symbolPosition === 'left-number') {
      formattedValue = `${selected?.symbol || ''}${formattedValue}`
    } else if (symbolPosition === 'right-number') {
      formattedValue = `${formattedValue}${selected?.symbol || ''}`
    }

    if (showCurrencySymbol) {
      if (currencyPosition === 'left') {
        formattedValue = `${showCurrencySymbol ? `${currency} ` : ''}${formattedValue}`
      } else if (currencyPosition === 'right') {
        formattedValue = `${formattedValue}${showCurrencySymbol ? ` ${currency}` : ''}`
      }
    }

    if (symbolPosition === 'left-currency') {
      formattedValue = `${selected?.symbol || ''}${formattedValue}`
    } else if (symbolPosition === 'right-currency') {
      formattedValue = `${formattedValue}${selected?.symbol || ''}`
    }

    return formattedValue
  }

  #browserFormatter(value, currency, formatOptions) {
    const { showCurrencySymbol, roundToClosestInteger } = formatOptions
    const numberFormatConstruct = new Intl.NumberFormat(navigator.language, { style: 'currency', currency })
    const output = numberFormatConstruct.formatToParts(value).map(p => {
      if (!showCurrencySymbol && p.type === 'currency') return ''

      if (roundToClosestInteger) {
        if (p.type === 'decimal' || p.type === 'fraction') {
          return ''
        }
      }

      return p.value
    }).join('')

    return output
  }

  #customFormatter(value, formatOptions) {
    const { decimalSeparator, roundToClosestFractionDigits, minimumFractionDigits = 0, maximumFractionDigits = 0, numberFormat = '' } = formatOptions
    const [numberPattern] = numberFormat.split(decimalSeparator)

    const [numberVal, decimalVal = ''] = value.toString().split('.') // type number field will only separate by decimal separator '.'

    const numberFormatted = this.#formatNumberBasedOnPattern(numberVal, numberPattern)
    let decimalFormatted = decimalVal
    const decimalLength = decimalFormatted.length

    if (decimalLength > 0) {
      const max = maximumFractionDigits > 0
      const min = minimumFractionDigits > 0
      if (roundToClosestFractionDigits && decimalFormatted) {
        let precision
        if (max && decimalLength > maximumFractionDigits) {
          precision = maximumFractionDigits
        } else if (min && decimalLength < minimumFractionDigits) {
          precision = minimumFractionDigits
        } else {
          precision = decimalLength
        }
        decimalFormatted = this.#roundNumbers(Number(`0.${decimalFormatted}`), precision).toString().replace('0.', '')
      }
      if (max && decimalFormatted) {
        decimalFormatted = decimalFormatted.slice(0, maximumFractionDigits)
      }
    }

    if (decimalFormatted.length < minimumFractionDigits) {
      decimalFormatted = decimalFormatted.padEnd(minimumFractionDigits, '0')
    }

    let output = ''
    if (decimalFormatted) {
      output = `${numberFormatted}${decimalSeparator}${decimalFormatted}`
    } else {
      output = numberFormatted
    }

    return output
  }

  #formatNumberBasedOnPattern(value = '', pattern = '') {
    let formatted = ''
    let numberIndx = value.length - 1
    for (let i = pattern.length - 1; i >= 0; i--) {
      const ptrn = pattern[i]
      const num = value[numberIndx]
      if (!num) break
      if (ptrn === '#') {
        formatted = num + formatted
        numberIndx--
      } else {
        formatted = ptrn + formatted
      }
    }

    if (numberIndx >= 0) {
      formatted = value.substring(0, numberIndx + 1) + formatted
    }

    return formatted
  }

  #unformatCurrencyValue(value = '') {
    const { decimalSeparator } = this.#config.valueFormatOptions
    const regexp = new RegExp(`[^0-9${decimalSeparator}]`, 'g')
    return value.replace(regexp, '')
  }

  #select(selector) { return this.#currencyNumberFieldWrapper.querySelector(selector) }

  #addEvent(selector, eventType, cb) {
    selector.addEventListener(eventType, cb)
    this.#allEventListeners.push({ selector, eventType, cb })
  }

  #handleDefaultCurrencyInputValue() {
    // regex to get only numbers and decimal separator from the value
    this.#currencyInputElm.dataset.numValue = this.#unformatCurrencyValue(this.#config.defaultValue)
    this.#handleHiddenInputValueChange('', this.#config.defaultValue)
    if (this.#config.selectedCurrencyClearable) this.#setStyleProperty(this.#clearCurrencyInputElm, 'display', 'grid')
  }

  #handleKeyboardNavigation(e) {
    const activeEl = this.#document.activeElement
    let focussableEl = null
    const isMenuOpen = this.#isMenuOpen()
    if (e.target === this.#currencyInputElm) return

    if (isMenuOpen) {
      const activeIndex = Number(activeEl.dataset.index || -1)
      if (e.key === 'ArrowDown' || (!e.shiftKey && e.key === 'Tab')) {
        e.preventDefault()
        if (activeEl === this.#searchInputElm) {
          focussableEl = this.#select('.option:not(.disabled-opt)')
        } else if (activeEl.classList.contains('option')) {
          const nextIndex = this.#findNotDisabledOptIndex(activeIndex, 'next')
          const nextElm = this.#selectOptElmByIndex(nextIndex)
          if (nextElm) {
            focussableEl = nextElm
          } else if ((nextIndex + 1) < this.#options.length) {
            this.virtualOptionList?.scrollToIndex(nextIndex)
            setTimeout(() => {
              const nextElm2 = this.#selectOptElmByIndex(nextIndex)
              if (nextElm2) nextElm2.focus()
            }, 50)
          }
        }
      } else if (e.key === 'ArrowUp' || (e.shiftKey && e.key === 'Tab')) {
        e.preventDefault()
        if (activeEl === this.#searchInputElm) {
          focussableEl = this.#currencyInputElm
          if (this.#isMenuOpen()) {
            this.setMenu({ open: false })
          }
        } else if (activeEl.classList.contains('option')) {
          const prevIndex = this.#findNotDisabledOptIndex(activeIndex, 'previous')
          const prevElm = this.#selectOptElmByIndex(prevIndex)
          if (prevElm) {
            focussableEl = prevElm
          } else if (prevIndex > 0) {
            this.virtualOptionList?.scrollToIndex(prevIndex)
            setTimeout(() => {
              const prevElm2 = this.#selectOptElmByIndex(prevIndex)
              if (prevElm2) prevElm2.focus()
            }, 50)
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
      const searchedOption = this.#config.options.find(option => !option.disabled && option.lbl.toLowerCase().startsWith(this.#dropdownSearchTerm))
      if (searchedOption) {
        this.setSelectedCurrencyItem(searchedOption.i)
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const selectedCurrencyIndex = this.#getSelectedCurrencyIndex()
      const direction = (e.key === 'ArrowDown') ? 'next' : 'previous'
      const optIndex = this.#findNotDisabledOptIndex(selectedCurrencyIndex, direction)
      if (optIndex > -1 && (optIndex < this.#config.options.length)) {
        this.value = this.#config.options[optIndex].val
      }
    }

    if (focussableEl) focussableEl.focus()
  }

  #triggerEvent(elm, eventType) {
    const event = new Event(eventType)
    elm.dispatchEvent(event)
  }

  #handleClearCurrencyInput() {
    this.#currencyInputElm.value = ''
    this.#setAttribute(this.#currencyHiddenInputElm, 'value', '')
    this.#setAttribute(this.#currencyInputElm, 'data-num-value', '')
    this.setSelectedCurrencyItem(this.#config.defaultCurrencyKey)
    this.#triggerEvent(this.#currencyInputElm, 'input')
    this.value = ''
    this.#triggerEvent(this.#currencyHiddenInputElm, 'blur')
  }

  #selectOptElmByIndex(index) {
    return this.#select(`.${this.fieldKey}-option-list .option[data-index="${index}"]`)
  }

  #findNotDisabledOptIndex(activeIndex = -1, direction) {
    if (direction === 'next') {
      const optsLength = this.#config.options.length
      for (let i = activeIndex + 1; i < optsLength; i++) {
        const opt = this.#config.options[i]
        if (!opt.disabled) return i
      }
    } else if (direction === 'previous') {
      for (let i = activeIndex - 1; i >= 0; i--) {
        const opt = this.#config.options[i]
        if (!opt.disabled) return i
      }
    }
  }

  #handleOutsideClick(event) {
    if (this.#currencyNumberFieldWrapper.contains(event.target)) return
    this.setMenu({ open: false })
  }

  #detectCurrencyCodeByInputValue(value) {
    return value?.match(/[a-zA-Z]+/)?.[0] || ''
  }

  #handleHiddenInputValueChange(oldVal, newVal) {
    const searchedCurrencyCode = this.#detectCurrencyCodeByInputValue(newVal)
    const validCurrencyCode = this.#config.options.find(item => item.i === searchedCurrencyCode)
    if (((searchedCurrencyCode && validCurrencyCode) || (!searchedCurrencyCode && this.#config.defaultCurrencyKey)) && oldVal !== newVal) {
      const defaultValueCurrencyCode = this.#detectCurrencyCodeByInputValue(this.#config.defaultValue)
      this.setSelectedCurrencyItem(searchedCurrencyCode || defaultValueCurrencyCode || this.#config.defaultCurrencyKey)
      const { decimalSeparator } = this.#config.valueFormatOptions
      const [numberPart, decimalPart] = newVal.split(decimalSeparator)
      const unformattedNumber = this.#unformatCurrencyValue(numberPart)
      const unformattedDecimal = this.#unformatCurrencyValue(decimalPart)
      const newUnformattedValue = (unformattedDecimal) ? `${unformattedNumber}.${unformattedDecimal}` : unformattedNumber
      this.#setAttribute(this.#currencyInputElm, 'data-num-value', newUnformattedValue)
      this.#handleCurrencyInputBlur()
    }
    if (typeof bit_conditionals !== 'undefined') {
      bit_conditionals({ target: this.#currencyHiddenInputElm })
    }
  }

  #handleCurrencyInput(e) {
    const numValue = Number(e.target.value)
    this.#setAttribute(this.#currencyInputElm, 'data-num-value', numValue || '')
    if (this.#config.selectedCurrencyClearable) {
      if (numValue) {
        this.#setStyleProperty(this.#clearCurrencyInputElm, 'display', 'grid')
      } else {
        this.#setStyleProperty(this.#clearCurrencyInputElm, 'display', 'none')
      }
    }
  }

  #getSelectedCurrencyIndex() {
    const index = this.#options.findIndex(ot => ot.i === this.#selectedCurrencyCode)
    return index === -1 ? 0 : index
  }

  #getSelectedCurrencyItem() {
    return this.#config.options.find(opt => opt.i === this.#selectedCurrencyCode)
  }

  #createElm(elm) {
    return this.#document.createElement(elm)
  }

  #setClassName(elm, cn) {
    elm.classList.add(cn)
  }

  #setTextContent(elm, txt) {
    elm.textContent = txt
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

  #setStyleProperty(elm, property, value) {
    elm.style.setProperty(property, value, 'important')
  }

  #setRowHeightOnMount() {
    const opt = this.#select('.option')
    if (!opt) return
    const stl = this.#window.getComputedStyle(opt)
    const margin = parseFloat(stl.marginTop) + parseFloat(stl.marginBottom)
    const optHeight = (opt.offsetHeight + margin) || 0
    if (optHeight !== this.#rowHeight) {
      this.#rowHeight = optHeight
      this.#optionListElm.innerHTML = ''
      this.#generateOptions()
    }
  }

  #generateOptions() {
    this.#optionListElm.innerHTML = ''
    const optionElms = this.#options.map((opt, index) => {
      const li = this.#createElm('li')
      this.#setAttribute(li, 'data-key', opt.i)
      this.#setAttribute(li, 'data-index', index)
      // this.#setAttribute(li, 'data-dev-option', this.fieldKey)
      if ('option' in this.#config.attributes) {
        const optAttr = this.#config.attributes.option
        this.#setCustomAttr(li, optAttr)
      }
      if (!opt.i) {
        this.#setTextContent(li, opt.lbl)
        this.#setClassName(li, 'opt-not-found')
        return li
      }
      this.#setClassName(li, 'option')
      if ('option' in this.#config.classNames) {
        const optCls = this.#config.classNames.option
        if (optCls) this.#setCustomClass(li, optCls)
      }
      const lblimgbox = this.#createElm('span')
      // this.#setAttribute(lblimgbox, 'data-dev-opt-lbl-wrp', this.fieldKey)
      if ('opt-lbl-wrp' in this.#config.attributes) {
        const optLblWrp = this.#config.attributes['opt-lbl-wrp']
        this.#setCustomAttr(lblimgbox, optLblWrp)
      }
      this.#setClassName(lblimgbox, 'opt-lbl-wrp')
      if ('opt-lbl-wrp' in this.#config.classNames) {
        const optLblWrpCls = this.#config.classNames['opt-lbl-wrp']
        if (optLblWrpCls) this.#setCustomClass(lblimgbox, optLblWrpCls)
      }
      if (this.#config.optionFlagImage) {
        const img = this.#createElm('img')
        // this.#setAttribute(img, 'data-dev-opt-icn', this.fieldKey)
        if ('opt-icn' in this.#config.attributes) {
          const optIcn = this.#config.attributes['opt-icn']
          this.#setCustomAttr(img, optIcn)
        }
        this.#setClassName(img, 'opt-icn')
        if ('opt-icn' in this.#config.classNames) {
          const optIcnCls = this.#config.classNames['opt-icn']
          if (optIcnCls) this.#setCustomClass(img, optIcnCls)
        }
        img.src = `${this.#assetsURL}${opt.img}`
        img.alt = `${opt.lbl} flag image`
        img.loading = 'lazy'
        this.#setAttribute(img, 'aria-hidden', true)
        lblimgbox.append(img)
      }
      const lbl = this.#createElm('span')
      // this.#setAttribute(lbl, 'data-dev-opt-lbl', this.fieldKey)
      if ('opt-lbl' in this.#config.attributes) {
        const optLbl = this.#config.attributes['opt-lbl']
        this.#setCustomAttr(lbl, optLbl)
      }
      this.#setClassName(lbl, 'opt-lbl')
      if ('opt-lbl' in this.#config.classNames) {
        const optLblCls = this.#config.classNames['opt-lbl']
        if (optLblCls) this.#setCustomClass(lbl, optLblCls)
      }
      this.#setTextContent(lbl, opt.lbl)
      lblimgbox.append(lbl)
      const suffix = this.#createElm('span')
      // this.#setAttribute(suffix, 'data-dev-opt-suffix', this.fieldKey)
      if ('opt-suffix' in this.#config.attributes) {
        const optsufix = this.#config.attributes['opt-suffix']
        this.#setCustomAttr(suffix, optsufix)
      }
      this.#setClassName(suffix, 'opt-suffix')
      if ('opt-suffix' in this.#config.classNames) {
        const optsuffixCls = this.#config.classNames['opt-suffix']
        if (optsuffixCls) this.#setCustomClass(suffix, optsuffixCls)
      }
      this.#setTextContent(suffix, opt.i)
      this.#setAttribute(li, 'tabindex', this.#isMenuOpen() ? '0' : '-1')
      this.#setAttribute(li, 'role', 'option')
      this.#setAttribute(li, 'aria-posinset', index + 1)
      this.#setAttribute(li, 'aria-setsize', this.#options.length)

      this.#addEvent(li, 'click', e => {
        this.#currencySelectedFromList = true
        this.setSelectedCurrencyItem(e.currentTarget.dataset.key)
      })
      this.#addEvent(li, 'keyup', e => {
        if (e.key === 'Enter') {
          this.#currencySelectedFromList = true
          this.setSelectedCurrencyItem(e.currentTarget.dataset.key)
        }
      })

      if (opt.disabled) {
        this.#setClassName(li, 'disabled-opt')
      }

      li.append(lblimgbox, suffix)

      if (this.#selectedCurrencyCode === opt.i) {
        this.#setClassName(li, 'selected-opt')
        this.#setAttribute(li, 'aria-selected', true)
      } else {
        this.#setAttribute(li, 'aria-selected', false)
      }
      return li
    })

    this.#optionListElm.append(...optionElms)
  }

  #clearSelectedCurrency() {
    const defaultValueCurrencyCode = this.#detectCurrencyCodeByInputValue(this.#config.defaultValue)
    this.#selectedCurrencyCode = defaultValueCurrencyCode || this.#config.defaultCurrencyKey || ''
    if (this.#config.selectedFlagImage) {
      this.#selectedCurrencyImgElm.src = this.#placeholderImage
    }
    this.setMenu({ open: false })
    this.#setAttribute(this.#currencyInputElm, 'data-num-value', '')
    if (this.#config.selectedCurrencyClearable) this.#setStyleProperty(this.#clearCurrencyInputElm, 'display', 'none')
    this.#setAttribute(this.#currencyHiddenInputElm, 'value', this.#config.defaultValue)
    // this.#reRenderVirtualOptions()
  }

  setSelectedCurrencyItem(currencyKey) {
    this.#selectedCurrencyCode = currencyKey
    if (!this.#selectedCurrencyCode) {
      this.#clearSelectedCurrency()
      return
    }
    const selectedItem = this.#getSelectedCurrencyItem()
    if (!selectedItem) return
    if (this.#config.selectedFlagImage) this.#selectedCurrencyImgElm.src = `${this.#assetsURL}${selectedItem.img}`
    this.setMenu({ open: false })
    this.#handleCurrencyInputBlur()
    if (this.#currencySelectedFromList) {
      !this.value && this.#currencyInputElm.focus()
      this.#currencySelectedFromList = false
    }
  }

  #reRenderVirtualOptions() {
    if (!this.#isMenuOpen()) return
    this.#generateOptions()
    const selectedIndex = this.#getSelectedCurrencyIndex()
    const selectedOpt = this.#select(`.option[data-index="${selectedIndex}"]`)
    if (selectedOpt) selectedOpt.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  #setSearchValue(val) {
    this.#searchInputElm.value = val
  }

  #handleSearchInput(e) {
    if (e.key === 'Enter' && this.#options.length) {
      const optKey = this.#select('.option')?.dataset.key
      this.setSelectedCurrencyItem(optKey)
      this.searchOptions('')
    } else {
      this.searchOptions(e.target.value)
    }
  }

  #handleCurrencyValidation(e) {
    if (e.target.value === '') return 'required'
    const numValue = Number(e.target.value?.match(/[0-9.]+/)?.[0])
    const { minValue, maxValue } = this.#config
    if (minValue !== '' && numValue < minValue) return 'minValue'
    if (maxValue !== '' && numValue > maxValue) return 'maxValue'
    return ''
  }

  isValidated() {
    return this.#handleCurrencyValidation({ target: this.#currencyInputElm })
  }

  searchOptions(value) {
    this.#setSearchValue(value)
    let filteredOptions = []

    if (value) {
      filteredOptions = this.#config.options.filter(opt => {
        const searchText = value.toLowerCase()
        const lbl = (opt.lbl || '').toLowerCase()
        const val = (opt.val || '').toLowerCase()
        const code = (opt.i || '').toLowerCase()
        if (lbl.includes(searchText)) return true
        if (val.includes(searchText)) return true
        if (code.includes(searchText)) return true
      })
      if (!filteredOptions.length) {
        filteredOptions = [{ i: 0, lbl: this.#config.noCurrencyFoundText }]
      }
      this.#options = filteredOptions
      if (this.#config.searchClearable) this.#setStyleProperty(this.#clearSearchBtnElm, 'display', 'grid')
    } else {
      this.#options = this.#config.options
      if (this.#config.searchClearable) this.#setStyleProperty(this.#clearSearchBtnElm, 'display', 'none')
    }

    this.#reRenderVirtualOptions()
  }

  #isMenuOpen() {
    return this.#currencyNumberFieldWrapper.classList.contains('menu-open')
  }

  #openDropdownAsPerWindowSpace() {
    const elementRect = this.#currencyInnerWrp.getBoundingClientRect()

    const spaceAbove = elementRect.top
    const spaceBelow = this.#window.innerHeight - elementRect.bottom

    if (spaceBelow < spaceAbove && spaceBelow < this.#config.maxHeight) {
      this.#setStyleProperty(this.#currencyNumberFieldWrapper, 'flex-direction', 'column-reverse')
      this.#setStyleProperty(this.#currencyNumberFieldWrapper, 'bottom', '0%')
    } else {
      this.#setStyleProperty(this.#currencyNumberFieldWrapper, 'flex-direction', 'column')
      this.#setStyleProperty(this.#currencyNumberFieldWrapper, 'bottom', 'auto')
    }
  }

  setMenu({ open }) {
    this.#setStyleProperty(this.#optionWrapperElm, 'max-height', `${open ? this.#config.maxHeight : 0}px`)
    if (open) {
      this.#openDropdownAsPerWindowSpace()
      this.#setClassName(this.#currencyNumberFieldWrapper, 'menu-open')
      this.#addEvent(this.#document, 'click', e => this.#handleOutsideClick(e))
      this.#setAttribute(this.#searchInputElm, 'tabindex', 0)
      this.#setAttribute(this.#clearSearchBtnElm, 'tabindex', 0)
      this.#setAttribute(this.#dropdownWrapperElm, 'aria-expanded', true)
      this.#reRenderVirtualOptions()
    } else {
      this.#currencyNumberFieldWrapper.classList.remove('menu-open')
      this.#document.removeEventListener('click', this.#handleOutsideClick)
      setTimeout(() => { this.searchOptions('') }, 100)
      this.#setAttribute(this.#searchInputElm, 'tabindex', -1)
      this.#setAttribute(this.#clearSearchBtnElm, 'tabindex', -1)
      this.#setAttribute(this.#dropdownWrapperElm, 'aria-expanded', false)
    }
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

  set value(val) {
    this.#currencyHiddenInputElm.value = val || ''
    this.#setAttribute(this.#currencyHiddenInputElm, 'value', val || '')
  }

  get value() {
    return this.#currencyHiddenInputElm.value
  }

  #detachAllEvents() {
    this.#allEventListeners.forEach(({ selector, eventType, cb }) => {
      selector.removeEventListener(eventType, cb)
    })
  }

  destroy() {
    this.#optionListElm.innerHTML = ''
    this.value = this.#config.defaultValue
    this.#detachAllEvents()
  }

  reset() {
    this.#clearSelectedCurrency()
    this.destroy()
    this.init()
  }
}

// const list = new CurrencyField('.currency-fld-wrp', {
//   searchClearable: true,
//   maxHeight: 400,
//   placeholder: 'asdf',
//   selectedFlagImage: false,
//   minValue: 0, // all
//   maxValue: 0, // all
//   inputFormatOptions: {
//     formatter: 'browser', // browser, custom, none
//     showCurrencySymbol: true, // all
//     roundToClosestInteger: false, // all
//     roundToClosestFractionDigits: true, // custom [based on minimum & maximum fraction digits]
//     minimumFractionDigits: 0,// custom
//     maximumFractionDigits: 2,// custom [0 means unlimited]
//     numberFormat: '###,###,###', // custom
//     decimalSeparator: '.', // custom
//     currencyPosition: 'right', // custom & none
//     symbolPosition: 'left-number', // custom & none
//   },
//   valueFormatOptions: {
//     formatter: 'browser', // browser, custom, none
//     showCurrencySymbol: true, // all
//     roundToClosestInteger: false, // all
//     roundToClosestFractionDigits: false, // custom [based on minimum & maximum fraction digits]
//     minimumFractionDigits: 0,// custom
//     maximumFractionDigits: 2,// custom [0 means unlimited]
//     numberFormat: '###.###.###', // custom
//     decimalSeparator: ',', // custom
//     currencyPosition: 'right', // custom & none
//     symbolPosition: 'left-number', // left-currency, right-currency, left-number, right-number
//   },
//   defaultCurrencyKey: 'INR',
//   options: currencyList
//   defaultValue: '',
// })
