/* eslint-disable no-plusplus */
import flatpickr from 'flatpickr'

export default class BitAdvancedDateTimeField {
  #document = null

  #window = null

  #dateTimeInputHidden = null

  #fieldKey = null

  #contentId = null

  #assetsURL = null

  #config = {
    document: {},
    formID: null,
    configSetting: {},
  }

  #advanceConfig = {}

  #advanceDateTimeFldWrp = null

  #advanceDateTimeFld = null

  #bitFlatPickrInstance = null

  #allEventListeners = []

  #redrawOptions = ['minDate', 'maxDate', 'disable', 'enable', 'enableTime', 'noCalendar', 'dateFormat', 'altFormat', 'mode']

  constructor(selector, config) {
    Object.assign(this.#config, config)
    this.#window = config.window ? config.window : window
    this.#document = config.document ? config.document : document
    this.#fieldKey = config.fieldKey
    this.#contentId = config?.contentId
    this.#assetsURL = config?.assetsURL

    this.#config.configSetting = config?.configSetting
    this.#bitFlatPickrInstance = flatpickr
    if (config?.advancedConfig) {
      try {
        this.#advanceConfig = (new Function(`return ${config.advancedConfig}`))()

        delete this.#config.configSetting.advancedConfig
      } catch (e) {
        console.error('Invalid advancedConfig:', e)
        this.#advanceConfig = {}
      }
    }

    // Process date modes using helper function
    if (this.#config.configSetting?.dateFormat) {
      this.#processDateMode('defaultDate', 'defaultDateMode', 'defaultDateDynamic')
      this.#processDateMode('minDate', 'minDateMode', 'minDateDynamic')
      this.#processDateMode('maxDate', 'maxDateMode', 'maxDateDynamic')
    }

    // Initialize the hidden input element
    if (typeof selector === 'string') {
      this.#dateTimeInputHidden = this.#document.querySelector(selector)
      if (!this.#dateTimeInputHidden) {
        console.error(`Element with selector "${selector}" not found`)
      }
    } else {
      this.#dateTimeInputHidden = selector
    }

    if (this.#document.readyState === 'loading') {
      // If the document is still loading, wait for DOMContentLoaded
      this.#addEvent(this.#window, 'DOMContentLoaded', () => {
        this.init()
      })
    } else {
      // If the document is already loaded, initialize immediately
      this.init()
    }
  }

  init() {
    if (!this.#dateTimeInputHidden) {
      console.error('DateTime input element not found')
      return
    }
    if (!this.#bitFlatPickrInstance) this.#bitFlatPickrInstance = flatpickr
    this.#advanceDateTimeFldWrp = this.#document.querySelector(`#${this.#contentId} .${this.#fieldKey}-inp-wrp`)

    if (!this.#advanceDateTimeFldWrp) {
      console.error(`Element with class ${this.#fieldKey}-inp-wrp not found`)
      return
    }

    const config = {
      ...this.#config.configSetting,
      ...this.#advanceConfig,
    }

    if (config?.minDate || config?.maxDate) {
      // this funciton is called to ensure config is set up correctly in main flatpickr instance
      this.#configureHiddenInput()
    }
    this.#bitFlatPickrInstance = this.#bitFlatPickrInstance(this.#dateTimeInputHidden, config)

    this.#advanceDateTimeFld = this.#select(`.${this.#fieldKey}-advanced-datetime.form-control`, this.#advanceDateTimeFldWrp)
    this.#window.observeElm(this.#dateTimeInputHidden, 'value', (oldVal, newVal) => this.#handleInputValueChange(oldVal, newVal))
  }

  #configureHiddenInput() {
    const hiddenInputElement = this.#document.createElement('input')
    hiddenInputElement.type = 'hidden'
    hiddenInputElement.className = 'd-none'
    hiddenInputElement.id = `${this.#fieldKey}-advanced-datetime-hidden`
    this.#advanceDateTimeFldWrp.appendChild(hiddenInputElement)
    flatpickr(hiddenInputElement, {})
  }

  #processDateMode(configKey, modeKey, dynamicKey) {
    if (!this.#config.configSetting?.[modeKey]) return
    const { dateFormat } = this.#config.configSetting

    const mode = this.#config.configSetting[modeKey]

    if (mode === 'none') {
      delete this.#config.configSetting[configKey]
    } else if (mode === 'today') {
      this.#config.configSetting[configKey] = 'today'
    } else if (mode === 'dynamic' && dynamicKey) {
      const dynamicValue = this.#config.configSetting[dynamicKey]
      const parsedDate = this.#bitFlatPickrInstance.parseDate('today', dateFormat)

      if (!parsedDate) {
        console.error(`Invalid date format for dynamic date: ${dateFormat}`)
        return
      }

      const days = parseInt(dynamicValue, 10)
      parsedDate.setDate(parsedDate.getDate()
        + (configKey === 'minDate' ? -days : days))

      this.#config.configSetting[configKey] = this.#bitFlatPickrInstance.formatDate(parsedDate, dateFormat)
      delete this.#config.configSetting[dynamicKey]
    }
    if (dynamicKey) delete this.#config.configSetting[dynamicKey]
    delete this.#config.configSetting[modeKey]
  }

  #handleInputValueChange(oldVal, newVal) {
    if (oldVal === newVal) return
    this.value = newVal
    if (typeof bit_conditionals !== 'undefined') {
      bit_conditionals({ target: this.#dateTimeInputHidden })
    }
  }

  #addEvent(selector, eventType, cb) {
    selector.addEventListener(eventType, cb)
    this.#allEventListeners.push({ selector, eventType, cb })
  }

  #detachAllEvents() {
    this.#allEventListeners.forEach(({ selector, eventType, cb }) => {
      selector.removeEventListener(eventType, cb)
    })
  }

  #select(selector, parent = null) {
    return (parent || this.#advanceDateTimeFldWrp).querySelector(selector)
  }

  set value(value) {
    this.#dateTimeInputHidden.value = value
    this.#bitFlatPickrInstance.setDate(value, true, this.#config.configSetting.dateFormat || 'Y-m-d H:i:S')
  }

  get value() {
    return this.#dateTimeInputHidden.value
  }

  setConfigOption(option, value) {
    if (this.#bitFlatPickrInstance.set) {
      this.#bitFlatPickrInstance.set(option, value)
      if (this.#redrawOptions.includes(option)) {
        this.#bitFlatPickrInstance.redraw()
      }
    } else {
      console.warn('set method not available on flatpickr instance')
    }
  }

  validationCheck(fldData) {
    if (fldData?.valid?.req) {
      if (!this.#bitFlatPickrInstance.selectedDates || this.#bitFlatPickrInstance.selectedDates.length === 0) {
        return 'req'
      }
    }
    if (fldData?.config?.minDate) {
      const minDate = this.parseDate(this.#config.configSetting.minDate)
      if (minDate && this.#bitFlatPickrInstance.selectedDates[0] < minDate) {
        return 'mn'
      }
    }
    if (fldData?.config?.maxDate) {
      const maxDate = this.parseDate(this.#config.configSetting.maxDate)
      if (maxDate && this.#bitFlatPickrInstance.selectedDates[0] > maxDate) {
        return 'mx'
      }
    }
    return ''
  }

  parseDate(value) {
    if (!value) return null
    return this.#bitFlatPickrInstance.parseDate(value, this.#config.configSetting.dateFormat || 'Y-m-d H:i:S')
  }

  destroy() {
    // this.#document = null
    // this.#dateTimeInputHidden = null
    if (this.#bitFlatPickrInstance.destroy) this.#bitFlatPickrInstance.destroy()
    this.#detachAllEvents()
  }

  reset() {
    this.#dateTimeInputHidden.value = ''
    this.#bitFlatPickrInstance.clear()
  }
}
