import Inputmask from 'inputmask'

export default class BitInputMask {
  #document

  #config = {}

  #inputSelector

  constructor(selector, config) {
    Object.assign(this.#config, config)
    this.#document = config.document || document

    if (typeof selector === 'string') {
      this.#inputSelector = this.#document.querySelector(selector)
    } else {
      this.#inputSelector = selector
    }

    this.init()
  }

  init() {
    // Initialize the input mask
    if (this.#inputSelector && this.#config.maskFormat) {
      const filteredMask = this.#filterMask(this.#config.maskFormat)
      const [maskFormat, maskConfig] = this.#formatMaskAndConfig(filteredMask)
      Inputmask(maskFormat, maskConfig).mask(this.#inputSelector)
    }
  }

  #formatMaskAndConfig(mask) {
    // Format the mask and configuration as needed
    let maskFormat = mask
    let maskConfig = {
      // Add any additional configuration options here
      ...this.#config?.maskConfig,
    }
    // format maskFormat for date time if contains "datetime:"
    if (maskFormat.includes('datetime:')) {
      // Apply specific formatting for datetime masks
      maskFormat = maskFormat.replace('datetime:', '')
      maskConfig = {
        ...maskConfig,
        inputFormat: maskFormat,
      }
      maskFormat = 'datetime'
    }
    if (maskFormat.includes('alias:')) {
      maskFormat = maskFormat.replace('alias:', '')
      maskConfig = {
        ...maskConfig,
        alias: maskFormat,
      }
    }
    if (maskFormat.includes('regex:')) {
      maskFormat = maskFormat.replace('regex:', '')
      maskConfig = {
        ...maskConfig,
        regex: `\\${maskFormat}`,
      }
    }
    return [maskFormat, maskConfig]
  }

  #filterMask(mask) {
    // Apply any filtering logic to the mask here
    if (typeof generateBackslashPattern !== 'undefined') {
      return generateBackslashPattern(mask)
    }
    return mask
  }
}
