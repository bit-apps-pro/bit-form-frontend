export default class BitRecaptchaField {
  #recaptchaWrap = null

  #recaptcha = null

  #config = {
    theme: 'light',
    size: 'normal',
  }

  constructor(selector, config) {
    Object.assign(this.#config, config)

    if (typeof selector === 'string') {
      this.#recaptchaWrap = document.querySelector(selector)
    } else {
      this.#recaptchaWrap = selector
    }
    this.fieldKey = this.#config.fieldKey

    this.init()
  }

  init() {
    this.#recaptcha = this.#select('.g-recaptcha')
    this.#setAttribute(this.#recaptcha, 'data-theme', this.#config.theme)
    this.#setAttribute(this.#recaptcha, 'data-size', this.#config.size)
  }

  #select(selector) { return this.#recaptchaWrap.querySelector(selector) }

  // eslint-disable-next-line class-methods-use-this
  #setAttribute(elm, attribute, value) {
    elm.setAttribute(attribute, value)
  }

  destroy() {
    this.#recaptcha.innerHTML = ''
  }
}
