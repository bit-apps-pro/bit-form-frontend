export default class BitPhoneNumberField {
  #placeholderImage = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"

  #countryByIpApiURL = 'www.cloudflare.com/cdn-cgi/trace'

  #countryByGeoApiURL = 'api.geonames.org/countryCodeJSON?username=bitcodezoho1'

  #phoneNumberFieldWrapper = null

  #phoneHiddenInputElm = null

  #clearPhoneInputElm = null

  #dropdownWrapperElm = null

  #optionWrapperElm = null

  #selectedCountryImgElm = null

  #selectedCountryCode = null

  #searchWrpElm = null

  #searchInputElm = null

  #phoneInnerWrp = null

  #phoneInputElm = null

  #clearSearchBtnElm = null

  #optionListElm = null

  #rowHeight = 30

  #options = []

  #callingCodes = {}

  #sharedCodes = {}

  #isBackspace = false

  #contentId = null

  #countrySelectedFromList = false

  #allEventListeners = []

  #config = {
    maxHeight: 370,
    detectCountryByIp: false,
    detectCountryByGeo: false,
    optionFlagImage: true,
    searchCountryPlaceholder: 'Search Country',
    noCountryFoundText: 'No Country Found',
    searchClearable: true,
    inputFormat: '+c #### ### ###',
    valueFormat: '+c #### ### ###',
    defaultCountryKey: '',
    attributes: {},
    classNames: {},
  }

  #assetsURL = ''

  #debounceTimeout = null

  #dropdownSearchTerm = ''

  #document = null

  #window = null

  constructor(selector, config) {
    Object.assign(this.#config, config)
    this.#document = config.document || document
    this.#window = config.window || window
    this.#assetsURL = config.assetsURL || ''
    if (typeof selector === 'string') {
      this.#phoneNumberFieldWrapper = this.#document.querySelector(selector)
    } else {
      this.#phoneNumberFieldWrapper = selector
    }
    if (typeof this.#config.options === 'string') {
      this.#config.options = this.#getOptionsFromGlobalPath(this.#config.options)
    }
    this.#config.options = this.#config.options.filter(p => !p.hide)
    this.#options = [...this.#config.options]
    this.#callingCodes = this.#generateCountryCodesFromOptions()
    this.#sharedCodes = this.#generateSharedCodeCountryListFromOptions()
    this.fieldKey = this.#config.fieldKey
    this.#contentId = this.#config.contentId

    this.init()
  }

  init() {
    this.#phoneInnerWrp = this.#select(`.${this.fieldKey}-phone-inner-wrp`)
    this.#phoneInputElm = this.#select(`.${this.fieldKey}-phone-number-input`)
    this.#phoneHiddenInputElm = this.#select(`.${this.fieldKey}-phone-hidden-input`)
    this.#clearPhoneInputElm = this.#select(`.${this.fieldKey}-input-clear-btn`)
    this.#selectedCountryImgElm = this.#select(`.${this.fieldKey}-selected-country-img`)
    this.#searchWrpElm = this.#select(`.${this.fieldKey}-option-search-wrp`)
    this.#searchInputElm = this.#select(`.${this.fieldKey}-opt-search-input`)
    this.#dropdownWrapperElm = this.#select(`.${this.fieldKey}-dpd-wrp`)
    this.#optionWrapperElm = this.#select(`.${this.fieldKey}-option-wrp`)
    this.#clearSearchBtnElm = this.#select(`.${this.fieldKey}-search-clear-btn`)
    this.#optionListElm = this.#select(`.${this.fieldKey}-option-list`)
    this.setMenu({ open: false })
    this.#addEvent(this.#phoneNumberFieldWrapper, 'keydown', e => { this.#handleKeyboardNavigation(e) })

    this.#addEvent(this.#dropdownWrapperElm, 'click', e => { this.#handleDropdownClick(e) })
    this.#addEvent(this.#dropdownWrapperElm, 'keyup', e => { this.#handleDropdownClick(e) })

    this.#handleDefaultPhoneInputValue()

    // this.#generateOptions()

    if (this.#config.defaultCountryKey) this.setSelectedCountryItem(this.#config.defaultCountryKey)

    this.#addEvent(this.#phoneInputElm, 'blur', e => { this.#handlePhoneInputBlur(e) })
    this.#addEvent(this.#phoneInputElm, 'input', e => { this.#handlePhoneInput(e) })
    this.#addEvent(this.#phoneInputElm, 'keydown', e => { this.#handlePhoneInputKeyDown(e) })
    this.#addEvent(this.#phoneInputElm, 'focusout', e => { this.#handlePhoneValidation(e) })
    if (this.#config.selectedCountryClearable) this.#addEvent(this.#clearPhoneInputElm, 'click', e => { this.#handleClearPhoneInput(e) })
    this.#config.detectCountryByIp && this.#detectCountryCodeFromIpAddress()
    this.#config.detectCountryByGeo && this.#detectCountryCodeFromGeoLocation()

    if (this.#config.searchClearable) {
      this.#setStyleProperty(this.#searchInputElm, 'padding-right', '35px')
      this.#setStyleProperty(this.#clearSearchBtnElm, 'display', 'none')
      this.#addEvent(this.#clearSearchBtnElm, 'click', () => { this.searchOptions('') })
    }
    if (this.#searchInputElm) this.#searchInputElm.value = ''
    this.#addEvent(this.#searchInputElm, 'keyup', e => { this.#handleSearchInput(e) })
    this.#placeholderImage = this.#config.placeholderImage ? this.#config.placeholderImage : this.#placeholderImage

    this.#window.observeElm(this.#phoneHiddenInputElm, 'value', (oldVal, newVal) => { this.#handleHiddenInputValueChange(oldVal, newVal) })
  }

  #getOptionsFromGlobalPath(path) {
    const pathArr = path.split('->')
    let options = this.#window
    pathArr.forEach(p => {
      options = options[p]
    })
    return options
  }

  #select(selector) { return this.#phoneNumberFieldWrapper.querySelector(selector) }

  #addEvent(selector, eventType, cb) {
    if (selector) {
      selector.addEventListener(eventType, cb)
      this.#allEventListeners.push({ selector, eventType, cb })
    }
  }

  #handleDefaultPhoneInputValue() {
    if (!this.#phoneHiddenInputElm.value) return
    this.#handleHiddenInputValueChange('', this.#phoneHiddenInputElm.value)
    if (this.#config.selectedCountryClearable) this.#setStyleProperty(this.#clearPhoneInputElm, 'display', 'grid')
  }

  #detectCountryCodeFromIpAddress() {
    const { protocol } = this.#window.location
    fetch(`${protocol}//${this.#countryByIpApiURL}`)
      .then(resp => resp.text())
      .then(data => {
        const ipinfo = data.trim().split('\n').reduce((obj, pair) => {
          pair = pair.split('=')
          return obj[pair[0]] = pair[1], obj
        }, {})
        this.setSelectedCountryItem(ipinfo.loc)
      })
  }

  #detectCountryCodeFromGeoLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      const { protocol } = this.#window.location
      const subDomain = protocol === 'https:' ? `${protocol}//secure` : `${protocol}//api`
      fetch(`${subDomain}.geonames.org/countryCodeJSON?username=bitcodezoho1&lat=${latitude}&lng=${longitude}`)
        .then(resp => resp.json())
        .then(data => {
          this.setSelectedCountryItem(data.countryCode)
        })
    })
  }

  #handleKeyboardNavigation(e) {
    const activeEl = this.#document.activeElement
    let focussableEl = null
    const isMenuOpen = this.#isMenuOpen()
    if (e.target === this.#phoneInputElm) return

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
          focussableEl = this.#phoneInputElm
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
        this.setSelectedCountryItem(searchedOption.i)
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const selectedCountryIndex = this.#getSelectedCountryIndex()
      const direction = (e.key === 'ArrowDown') ? 'next' : 'previous'
      const optIndex = this.#findNotDisabledOptIndex(selectedCountryIndex, direction)
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

  #handleClearPhoneInput() {
    this.#phoneInputElm.value = ''
    this.setSelectedCountryItem('')
    this.#triggerEvent(this.#phoneInputElm, 'input')
    this.#triggerEvent(this.#phoneHiddenInputElm, 'blur')
  }

  #selectOptElmByIndex(index) {
    return this.#select(`.${this.fieldKey}-option-list .option[data-index="${index}"]`)
  }

  #findNotDisabledOptIndex(activeIndex = -1, direction) {
    if (direction === 'next') {
      const optsLength = this.#config.options.length
      for (let i = activeIndex + 1; i < optsLength; i += 1) {
        const opt = this.#config.options[i]
        if (!opt.disabled) return i
      }
    } else if (direction === 'previous') {
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        const opt = this.#config.options[i]
        if (!opt.disabled) return i
      }
    }
  }

  #handleOutsideClick(event) {
    if (this.#phoneNumberFieldWrapper.contains(event.target)) return
    this.setMenu({ open: false })
  }

  #generateCountryCodesFromOptions() {
    return this.#config.options.reduce((acc, item) => {
      if (!acc[item.code]) {
        let { code } = item
        if (code[0] === '+') code = code.substring(1)
        if (!(code in acc) && item.ptrn) acc[code] = item.i
      }
      return acc
    }, {})
  }

  #generateSharedCodeCountryListFromOptions() {
    const countryCodeOptionList = this.#config.options
    const allCodesObject = {}
    const sharedCodeListObject = {}
    // First, group all countries by their phone codes
    countryCodeOptionList.forEach(option => {
      const phoneCode = option.code // e.g., "+1"

      // If this phone code doesn't exist, create an empty array
      if (!allCodesObject[phoneCode]) {
        allCodesObject[phoneCode] = []
      }

      // Add the country code to the array for this phone code
      allCodesObject[phoneCode].push(option)
    })

    // Filter to keep only phone codes that have multiple countries (shared codes)
    Object.keys(allCodesObject).forEach(phoneCode => {
      if (allCodesObject[phoneCode].length > 1) {
        sharedCodeListObject[phoneCode] = allCodesObject[phoneCode]
      }
    })

    return sharedCodeListObject
  }

  #searchCountryCodeFromValue(value) {
    let inputValue = this.#unformatPhoneNumber(value)
    if (inputValue[0] === '+') inputValue = inputValue.substring(1, 4)
    let currentSearchCode = ''
    for (let i = 3; i > 0; i -= 1) {
      currentSearchCode = inputValue.substring(0, i)
      if (currentSearchCode in this.#callingCodes) {
        return currentSearchCode
      }
    }
    return ''
  }

  #detectCountryCodeByInputValue(value) {
    let searchedCountryCode = this.#searchCountryCodeFromValue(value)
    if (searchedCountryCode && searchedCountryCode[0] !== '+') {
      searchedCountryCode = `+${searchedCountryCode}`
    }
    return searchedCountryCode
  }

  #unformatPhoneNumber(value) {
    return value.replace(/[^\d+]/g, '')
  }

  #getOnlyNumber(value) {
    return value.replace(/[^\d]/g, '')
  }

  #handleHiddenInputValueChange(oldVal, newVal) {
    const searchedCountryCode = this.#detectCountryCodeByInputValue(newVal)
    if (searchedCountryCode && oldVal !== newVal) {
      this.#handlePhoneValue(this.#unformatPhoneNumber(newVal))
    }
    if (typeof bit_conditionals !== 'undefined') {
      bit_conditionals({ target: this.#phoneHiddenInputElm })
    }
  }

  #handlePhoneInputBlur() {
    if (this.value.length > 3) {
      const unformattedVal = this.#unformatPhoneNumber(this.value)
      const countryCode = this.#searchCountryCodeFromValue(unformattedVal)
      this.#phoneInputElm.value = this.#formatPhoneNumber(countryCode, unformattedVal, this.#config.inputFormat)
    }
    this.#triggerEvent(this.#phoneHiddenInputElm, 'blur')
  }

  #handlePhoneInput(e) {
    const { value } = e.target
    if (value && this.#config.selectedCountryClearable) this.#setStyleProperty(this.#clearPhoneInputElm, 'display', 'grid')
    else if (this.#config.selectedCountryClearable) this.#setStyleProperty(this.#clearPhoneInputElm, 'display', 'none')

    this.#handlePhoneValue(value)
  }

  #handlePhoneInputKeyDown(e) {
    if (e.key === 'Backspace' || e.key === 'Delete') this.#isBackspace = true
  }

  #handlePhoneValue(value) {
    let selectedCountryItem = this.#getSelectedCountryItem()
    let code = ''
    if (this.#countrySelectedFromList) {
      code = selectedCountryItem.code
    } else {
      code = this.#detectCountryCodeByInputValue(value)
    }
    const valueCountryKey = this.#getCountryKeyByValue(value, selectedCountryItem)
    if (code !== value && (!this.#countrySelectedFromList || !valueCountryKey) && valueCountryKey !== selectedCountryItem?.i) {
      this.setSelectedCountryItem(valueCountryKey)
      selectedCountryItem = this.#getSelectedCountryItem()
    }

    if (code && selectedCountryItem) {
      let inputFormat = selectedCountryItem.frmt
      const valueFormat = (this.#config.valueFormat || '')

      if (!inputFormat) {
        inputFormat = (this.#config.inputFormat || '')
      }

      const formattedInputValue = this.#formatPhoneNumber(code, value, inputFormat)

      if (valueFormat) {
        const formattedValue = this.#formatPhoneNumber(code, value, valueFormat)
        this.value = formattedValue
      } else {
        this.value = value
      }

      this.#phoneInputElm.value = formattedInputValue
    } else if (this.#checkRegexPatternValidation(this.#getOnlyNumber(value)) === '' && this.value !== value) {
      this.value = value
    }
  }

  #isNumber = (char) => /[0-9]/.test(char)

  #formatPhoneNumber(code, number, format = '') {
    const unformattedNumber = this.#unformatPhoneNumber(number)
    let formattedNumber = ''
    let phoneIndex = 0
    const phoneNumber = unformattedNumber[0] === '+' ? unformattedNumber.substring(1) : unformattedNumber
    for (let i = 0; i < format.length; i += 1) {
      if (phoneIndex >= phoneNumber.length) break
      const frmtChar = format[i]
      if (frmtChar === 'c') {
        const cnCode = code[0] === '+' ? code.substring(1) : code
        formattedNumber += cnCode
        phoneIndex += cnCode.length
        // Appends a special format character after the country code to ensure proper formatting
        formattedNumber += (/[ \-().+/*[\]{}~|\\x]/.test(format[i + 1] || '') && (cnCode.length === phoneNumber.length) && !this.#isBackspace) ? format[i + 1] : ''
      } else if (frmtChar === '#') {
        if (!this.#isNumber(phoneNumber[phoneIndex])) break
        formattedNumber += phoneNumber[phoneIndex]
        phoneIndex += 1
      } else if (phoneNumber[phoneIndex] === frmtChar) {
        formattedNumber += frmtChar
        phoneIndex += 1
      } else {
        formattedNumber += frmtChar
      }
    }

    if (phoneIndex < phoneNumber.length) {
      formattedNumber += phoneNumber.substring(phoneIndex)
    }
    this.#isBackspace = false
    return formattedNumber
  }

  #handlePhoneValidation(e) {
    const value = this.#getOnlyNumber(e.target.value)
    let errorKey = 'required'
    const selectedCountry = this.#getSelectedCountryItem()
    if (selectedCountry) {
      const phoneNumberWithoutCode = value.substring(this.#getOnlyNumber(selectedCountry.code).length)
      if (selectedCountry.ptrn && phoneNumberWithoutCode) {
        const ptrn = selectedCountry.ptrn.replace(/\$_bf_\$/g, '\\')
        const regex = new RegExp(`^(${ptrn})$`)
        errorKey = !regex.test(phoneNumberWithoutCode) ? 'invalid' : ''
      }
      if (!phoneNumberWithoutCode) errorKey = 'required'
      // errorKey = ''
    }

    if (errorKey) {
      errorKey = this.#checkRegexPatternValidation(this.#getOnlyNumber(value), errorKey)
    }
    return errorKey
  }

  #checkRegexPatternValidation(value, errorKey = '') {
    const fieldData = this.#getFieldData()
    if (fieldData.valid.regexr) {
      return typeof regexPatternValidation !== 'undefined' ? regexPatternValidation(value, fieldData) : errorKey
    }
    return errorKey
  }

  #getCountryKeyByValue(value, selectedCountryItem) {
    let searchedCountryCode = this.#searchCountryCodeFromValue(value)
    if (searchedCountryCode && searchedCountryCode[0] !== '+') {
      searchedCountryCode = `+${searchedCountryCode}`
    }
    let searchedCountryKey = this.#callingCodes[searchedCountryCode.substring(1)] || ''
    if (selectedCountryItem && selectedCountryItem.code === searchedCountryCode) {
      searchedCountryKey = selectedCountryItem.i
    }
    if (this.#sharedCodes[searchedCountryCode]) {
      const sharedCountryList = this.#sharedCodes[searchedCountryCode]
      const phoneNumberWithoutCode = this.#unformatPhoneNumber(value).substring(searchedCountryCode.length)
      sharedCountryList.forEach(optionItem => {
        if (optionItem.ptrn && phoneNumberWithoutCode) {
          const ptrn = optionItem.ptrn.replace(/\$_bf_\$/g, '\\').trim()
          const regex = new RegExp(`^(${ptrn})$`)
          if (regex.test(phoneNumberWithoutCode)) {
            searchedCountryKey = optionItem.i
            return searchedCountryKey
          }
        }
      })
    }
    return searchedCountryKey
  }

  isValidated() {
    return this.#handlePhoneValidation({ target: this.#phoneHiddenInputElm })
  }

  #getSelectedCountryIndex() {
    const index = this.#options.findIndex(ot => ot.i === this.#selectedCountryCode)
    return index === -1 ? 0 : index
  }

  #getSelectedCountryItem() {
    return this.#config.options.find(opt => opt.i === this.#selectedCountryCode)
  }

  #getFieldData() {
    return this.#window.bf_globals[this.#contentId]?.fields[this.fieldKey]
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
    elm?.style?.setProperty(property, value, 'important')
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
    if (!this.#optionListElm) return
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
      this.#setClassName(lblimgbox, 'opt-lbl-wrp')
      if ('opt-lbl-wrp' in this.#config.classNames) {
        const optLblwrpCls = this.#config.classNames['opt-lbl-wrp']
        if (optLblwrpCls) this.#setCustomClass(lblimgbox, optLblwrpCls)
      }
      // this.#setAttribute(lblimgbox, 'data-dev-opt-lbl-wrp', this.fieldKey)
      if ('opt-lbl-wrp' in this.#config.attributes) {
        const optLblWrp = this.#config.attributes['opt-lbl-wrp']
        this.#setCustomAttr(lblimgbox, optLblWrp)
      }
      if (this.#config.optionFlagImage) {
        const img = this.#createElm('img')
        this.#setClassName(img, 'opt-icn')
        if ('opt-icn' in this.#config.classNames) {
          const optIcnCls = this.#config.classNames['opt-icn']
          if (optIcnCls) this.#setCustomClass(img, optIcnCls)
        }
        // this.#setAttribute(img, 'data-dev-opt-icn', this.fieldKey)
        if ('opt-icn' in this.#config.attributes) {
          const optIcn = this.#config.attributes['opt-icn']
          this.#setCustomAttr(img, optIcn)
        }
        img.src = `${this.#assetsURL}/${opt.img}`
        img.alt = `${opt.lbl} flag image`
        img.loading = 'lazy'
        this.#setAttribute(img, 'aria-hidden', true)
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
      const suffix = this.#createElm('span')
      this.#setClassName(suffix, 'opt-suffix')
      if ('opt-suffix' in this.#config.classNames) {
        const optSuffixCls = this.#config.classNames['opt-suffix']
        if (optSuffixCls) this.#setCustomClass(suffix, optSuffixCls)
      }
      this.#setTextContent(suffix, opt.code)
      this.#setAttribute(suffix, 'data-dev-opt-suffix', this.fieldKey)
      if ('opt-suffix' in this.#config.attributes) {
        const optSuffix = this.#config.attributes['opt-suffix']
        this.#setCustomAttr(suffix, optSuffix)
      }
      this.#setAttribute(li, 'tabindex', this.#isMenuOpen() ? '0' : '-1')
      this.#setAttribute(li, 'role', 'option')
      this.#setAttribute(li, 'aria-posinset', index + 1)
      this.#setAttribute(li, 'aria-setsize', this.#options.length)

      this.#addEvent(li, 'click', e => {
        this.#countrySelectedFromList = true
        this.setSelectedCountryItem(e.currentTarget.dataset.key)
      })
      this.#addEvent(li, 'keyup', e => {
        if (e.key === 'Enter') {
          this.#countrySelectedFromList = true
          this.setSelectedCountryItem(e.currentTarget.dataset.key)
        }
      })

      if (opt.disabled) {
        this.#setClassName(li, 'disabled-opt')
      }

      li.append(lblimgbox, suffix)

      if (this.#selectedCountryCode === opt.i) {
        this.#setClassName(li, 'selected-opt')
        this.#setAttribute(li, 'aria-selected', true)
      } else {
        this.#setAttribute(li, 'aria-selected', false)
      }

      return li
    })

    this.#optionListElm?.append(...optionElms)

    return true
  }

  #setNewCountryCodeWithInputValue(selectedCode) {
    const value = this.#unformatPhoneNumber(this.#phoneInputElm.value)
    if (value) {
      let inputFormat = this.#getSelectedCountryItem().frmt
      if (!inputFormat) {
        inputFormat = (this.#config.inputFormat || '')
      }
      this.#phoneInputElm.value = this.#formatPhoneNumber(selectedCode, value, inputFormat)
    } else {
      this.#phoneInputElm.value = selectedCode
    }

    if (!value) {
      this.value = selectedCode
    } else {
      const valueFormat = this.#config.valueFormat || ''
      this.value = valueFormat ? this.#formatPhoneNumber(selectedCode, this.#phoneInputElm.value, valueFormat) : this.#phoneInputElm.value
    }
  }

  #clearSelectedCountry() {
    this.#selectedCountryCode = ''
    if (this.#config.selectedFlagImage) {
      this.#selectedCountryImgElm.src = this.#placeholderImage
    }
    this.#countrySelectedFromList = false
    this.setMenu({ open: false })
    this.value = ''
    if (this.#config.selectedCountryClearable) this.#setStyleProperty(this.#clearPhoneInputElm, 'display', 'none')
    // this.#reRenderVirtualOptions()
  }

  setSelectedCountryItem(countryKey) {
    this.value = ''
    this.#selectedCountryCode = countryKey
    if (!this.#selectedCountryCode) {
      this.#clearSelectedCountry()
      return
    }
    const selectedItem = this.#getSelectedCountryItem()
    if (!selectedItem) return
    if (this.#config.selectedFlagImage) {
      this.#selectedCountryImgElm.src = `${this.#assetsURL}/${selectedItem.img}`
    }
    this.#setNewCountryCodeWithInputValue(selectedItem.code)
    this.setMenu({ open: false })
    if (this.#countrySelectedFromList) this.#phoneInputElm.focus()
  }

  #reRenderVirtualOptions() {
    if (!this.#isMenuOpen()) return
    this.#generateOptions()
    const selectedIndex = this.#getSelectedCountryIndex()
    const selectedOpt = this.#select(`.option[data-index="${selectedIndex}"]`)
    if (selectedOpt) selectedOpt.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    return true
    // this.virtualOptionList?.setRowCount(this.#options.length)
    // this.virtualOptionList?.scrollToIndex(this.#getSelectedCountryIndex())
  }

  #setSearchValue(val) {
    if (this.#searchInputElm) this.#searchInputElm.value = val
  }

  #handleSearchInput(e) {
    if (e.key === 'Enter' && this.#options.length) {
      const optKey = this.#select('.option')?.dataset.key
      this.setSelectedCountryItem(optKey)
      this.searchOptions('')
    } else {
      this.searchOptions(e.target.value)
    }
  }

  searchOptions(value) {
    this.#setSearchValue(value)
    let filteredOptions = []

    if (value) {
      filteredOptions = this.#config.options.filter(opt => {
        const searchText = value.toLowerCase()
        const lbl = (opt.lbl || '').toLowerCase()
        const val = (opt.val || '').toLowerCase()
        const code = opt.code || ''
        if (lbl.includes(searchText)) return true
        if (val.includes(searchText)) return true
        if (code.includes(searchText)) return true
      })
      if (!filteredOptions.length) {
        filteredOptions = [{ i: 0, lbl: this.#config.noCountryFoundText }]
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
    return this.#phoneNumberFieldWrapper.classList.contains('menu-open')
  }

  #openDropdownAsPerWindowSpace() {
    const elementRect = this.#phoneInnerWrp.getBoundingClientRect()

    const spaceAbove = elementRect.top
    const spaceBelow = this.#window.innerHeight - elementRect.bottom

    if (spaceBelow < spaceAbove && spaceBelow < this.#config.maxHeight) {
      this.#setStyleProperty(this.#phoneNumberFieldWrapper, 'flex-direction', 'column-reverse')
      this.#setStyleProperty(this.#phoneNumberFieldWrapper, 'bottom', '0%')
    } else {
      this.#setStyleProperty(this.#phoneNumberFieldWrapper, 'flex-direction', 'column')
      this.#setStyleProperty(this.#phoneNumberFieldWrapper, 'bottom', 'auto')
    }
  }

  setMenu({ open }) {
    this.#setStyleProperty(this.#optionWrapperElm, 'max-height', `${open ? this.#config.maxHeight : 0}px`)
    if (open) {
      this.#openDropdownAsPerWindowSpace()
      this.#setClassName(this.#phoneNumberFieldWrapper, 'menu-open')
      this.#addEvent(this.#document, 'click', e => this.#handleOutsideClick(e))
      this.#setAttribute(this.#searchInputElm, 'tabindex', 0)
      this.#setAttribute(this.#clearSearchBtnElm, 'tabindex', 0)
      this.#setAttribute(this.#dropdownWrapperElm, 'aria-expanded', true)
      this.#reRenderVirtualOptions()
    } else {
      this.#phoneNumberFieldWrapper.classList.remove('menu-open')
      this.#document.removeEventListener('click', this.#handleOutsideClick)
      setTimeout(() => { this.searchOptions('') }, 100)
      this.#setAttribute(this.#searchInputElm, 'tabindex', -1)
      this.#setAttribute(this.#clearSearchBtnElm, 'tabindex', -1)
      this.#setAttribute(this.#dropdownWrapperElm, 'aria-expanded', false)
    }
  }

  #handleDropdownClick(e) {
    if (e.code === 'Space') {
      this.#searchInputElm?.focus()
      this.setMenu({ open: true })
    }
    if (e.type === 'click') {
      if (this.#isMenuOpen()) {
        this.setMenu({ open: false })
      } else {
        this.#searchInputElm?.focus()
        this.setMenu({ open: true })
      }
    }
  }

  set value(val) {
    this.#phoneHiddenInputElm.value = val || ''
    this.#setAttribute(this.#phoneHiddenInputElm, 'value', val || '')
  }

  get value() {
    return this.#phoneHiddenInputElm.value
  }

  #detachAllEvents() {
    this.#allEventListeners.forEach(({ selector, eventType, cb }) => {
      selector.removeEventListener(eventType, cb)
    })
  }

  destroy() {
    if (this.#optionListElm) this.#optionListElm.innerHTML = ''
    this.value = ''
    this.#countrySelectedFromList = false
    this.#detachAllEvents()
  }

  reset(value) {
    this.#clearSelectedCountry()
    this.destroy()
    this.value = value
    this.init()
  }
}

// const list = new PhoneNumberField('.phone-fld-wrp', {
//   searchClearable: true,
//   maxHeight: 400,
//   placeholder: 'asdf',
//   selectedFlagImage: true,
//   inputFormat: '+c ## ###',
//   valueFormat: 'c_###_###',
//   // defaultCountryKey: 'BD',
//   options: countryListWithPhoneCode
// })

// placeholderImage
// searchCountryPlaceholder
// noCountryFoundText
// placeholder
// selectedFlagImage
// detectCountryByGeo
// detectCountryByIp
// inputFormat
// valueFormat

// c - country code
// # - number (0 - 9)

// +c #### ### ###
// +880 1826 696 318

// +8801826696318

// valueFormat: #### ### ###
