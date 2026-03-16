export default class BitHcaptchaField {
  #hcaptchaWrap = null

  #hcaptcha = null

  #hcaptchaWidgetId = null

  #resetIntervalId = null

  #fieldKey = null

  #config = {
    theme: 'light',
    size: 'normal',
    siteKey: '',
  }

  constructor(selector, config) {
    Object.assign(this.#config, config)

    if (typeof selector === 'string') {
      this.#hcaptchaWrap = document.querySelector(selector)
    } else {
      this.#hcaptchaWrap = selector
    }
    this.#fieldKey = this.#config.fieldKey

    this.init()
  }

  init() {
    this.#hcaptcha = this.#select('.h-captcha')
    this.#setAttribute(this.#hcaptcha, 'data-theme', this.#config.theme)
    this.#setAttribute(this.#hcaptcha, 'data-size', this.#config.size)

    this.#renderHcaptchaOnLoad()
  }

  #renderHcaptchaOnLoad() {
    const maxAttempts = 50
    let attempts = 0
    const checkInterval = setInterval(() => {
      attempts += 1
      if (window.hcaptcha) {
        clearInterval(checkInterval)
        this.render()
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        console.warn('hCaptcha script failed to load')
      }
    }, 300)
  }

  render() {
    if (!window.hcaptcha || !this.#hcaptcha) return

    // If widget already exists and is valid, just reset it
    if (
      this.#hcaptchaWidgetId !== null
    ) {
      try {
        window.hcaptcha.reset(this.#hcaptchaWidgetId)
      } catch (e) {
        console.error('Failed to reset widget')
      } finally {
        this.#hcaptchaWidgetId = null
      }
    }

    // Clear any existing content
    this.#hcaptcha.innerHTML = ''

    // Render widget
    try {
      this.#hcaptchaWidgetId = window.hcaptcha.render(this.#hcaptcha, {
        sitekey: this.#config.siteKey,
        theme: this.#config.theme,
        size: this.#config.size,
      })
    } catch (e) {
      console.error('Failed to render hCaptcha:', e)
    }
  }

  #select(selector) { return this.#hcaptchaWrap.querySelector(selector) }

  // eslint-disable-next-line class-methods-use-this
  #setAttribute(elm, attribute, value) {
    if (elm) {
      elm.setAttribute(attribute, value)
    }
  }

  destroy() {
    // Clear reset interval
    if (this.#resetIntervalId) {
      clearInterval(this.#resetIntervalId)
    }

    // Remove widget
    if (window.hcaptcha && this.#hcaptchaWidgetId !== null) {
      try {
        window.hcaptcha.remove(this.#hcaptchaWidgetId)
      } catch (e) {
        // Widget may have already been removed
        console.error('Failed to remove hcaptcha')
      }
    }

    this.#hcaptchaWidgetId = null

    // Clear HTML
    if (this.#hcaptcha) {
      this.#hcaptcha.innerHTML = ''
    }
  }

  reset() {
    this.destroy()
    this.init()
  }
}
