export default class BitMollieField {
  #mollieWrpSelector = ''

  #apiKey = ''

  #contentId = null

  #entryId = null

  #config = {}

  #payIntegID = null

  #fieldKey = null

  #elements = null

  #stripInstance = null

  #amountType = null

  #amountFld = null

  #amount = null

  #currency = null

  #formSelector = null

  #formID = null

  #mollieBtnSpanner = null

  #allEventListeners = []

  #description = null

  #mollieBtn = null

  #method = null

  #redirectUrl = null

  constructor(selector, config) {
    if (typeof selector === 'string') {
      this.#mollieWrpSelector = document.querySelector(selector)
    } else {
      this.#mollieWrpSelector = selector
    }

    Object.assign(this.#config, config)
    this.#apiKey = this.#config.apiKey
    this.#contentId = this.#config.contentId
    this.#payIntegID = this.#config.payIntegID
    this.#fieldKey = this.#config.fieldKey
    this.#amountFld = this.#config?.amountFld
    this.#amount = this.#config?.amount
    this.#amountType = this.#config.amountType
    this.#currency = this.#config.currency
    this.#formSelector = `#form-${this.#contentId}`
    this.#formID = this.#contentId?.split('_')[1]
    this.#description = this.#config.description
    this.#method = this.#config.payment_method
    this.#redirectUrl = this.#config.redirect_url
    this.init()
  }

  init() {
    this.#mollieBtn = this.#querySelector(`.${this.#fieldKey}-mollie-btn`)
    if (this.#mollieBtn) this.#initField()
  }

  #querySelector(selector) {
    const form = document.querySelector(this.#formSelector)
    return form.querySelector(selector)
  }

  #initField() {
    this.#mollieBtnSpanner = this.#querySelector('.mollie-btn-spinner')

    this.#addEvent(this.#mollieBtn, 'click', () => {
      this.#mollieBtn.disabled = true
      this.#mollieBtnSpanner.classList.remove('d-none')
      this.#handleOnClick(this.#contentId)
        .then(response => {
          if (response) {
            this.#mollieCreatePayment()
          }
        })
        .finally(() => {
          this.#mollieBtn.disabled = false
          this.#mollieBtnSpanner.classList.add('d-none')
        })
    })
  }

  #addEvent(element, eventType, cb) {
    if (!element) return
    element.addEventListener(eventType, cb)
    this.#allEventListeners.push({ selector: element, eventType, cb })
  }

  #getDynamicValue(fldKey) {
    if (fldKey) {
      const fldName = window.bf_globals[this.#contentId].fields[fldKey]?.fieldName
      if (!fldName) return console.error(`Field name not found for ${fldKey}`)
      let elm = this.#querySelector(`[name="${fldName}"]`)
      if (elm && elm.type === 'radio') {
        elm = this.#querySelector(`[name="${fldName}"]:checked`)
      }
      if (elm && elm.value) {
        return elm.value
      }
    }
    return ''
  }

  #displayErrorMsg(msg = '') {
    const errWrp = bfSelect(`${this.#formSelector} .${this.#fieldKey}-err-wrp`)
    const errTxt = bfSelect(`.${this.#fieldKey}-err-txt`, errWrp)
    const errMsg = bfSelect(`.${this.#fieldKey}-err-msg`, errWrp)

    if (msg) {
      errMsg.style.removeProperty('display')
      errTxt.innerHTML = msg
      setStyleProperty(errWrp, 'height', `${errTxt.parentElement.scrollHeight}px`)
      setStyleProperty(errWrp, 'grid-template-rows', '1fr')
      setStyleProperty(errWrp, 'opacity', 1)
      const fld = this.#querySelector(`${this.#formSelector} .btcd-fld-itm.${this.#fieldKey}`)
      scrollToElm(fld)
    } else {
      errTxt.innerHTML = ''
      setStyleProperty(errWrp, 'grid-template-rows', '0fr')
      setStyleProperty(errMsg, 'display', 'none')
      setStyleProperty(errWrp, 'height', 0)
      setStyleProperty(errWrp, 'opacity', 0)
    }
  }

  #formatAmountValue(value) {
    const val = value.toString()

    if (/^\d+(\.\d{1,2})?$/.test(val)) {
      return parseFloat(val).toFixed(2)
    }
    return parseFloat(val).toFixed(2)
  }

  #mollieCreatePayment() {
    const dynamicAmount = this.#Number(this.#getDynamicValue(this.#amountFld))

    if (this.#amountType === 'dynamic' && !dynamicAmount) {
      this.#displayErrorMsg('Amount field is required')
      return
    }
    this.#displayErrorMsg()

    const amount = this.#amountType === 'fixed' ? this.#amount : dynamicAmount
    if (amount) {
      const confData = {
        payIntegID: this.#payIntegID,
        amount: this.#formatAmountValue(amount),
        currency: this.#currency,
        metadata: {
          formID: this.#formID,
          entryID: this.#entryId,
          fieldKey: this.#fieldKey,
        },
        method: this.#method,
        description: this.#description,
        redirectUrl: this.#redirectUrl,
      }

      bitsFetchFront(this.#contentId, confData, 'bitforms_mollie_create_payment')
        .then(res => {
          const { success, data } = res

          if (!success) {
            this.#displayErrorMsg(data.detail)
            return
          }
          this.#displayErrorMsg()
          if (data?.id) {
            this.#onApproveHandler(data)
            const redirectInCheckout = data._links.checkout.href
            // this.#mollieBtnSpanner.classList.add('d-none')
            window.location.replace(redirectInCheckout)
          }
        })
    }
  }

  async #handleOnClick(contentId) {
    try {
      await isFormValidatedWithoutError(contentId)
    } catch (_) {
      this.#mollieBtn.disabled = false
      return Promise.reject()
    }
    const progressData = await saveFormProgress(contentId)
    const savedFormData = progressData?.[contentId]
    if (!savedFormData?.success) return Promise.reject()
    if (savedFormData.success) this.#entryId = savedFormData.data.entry_id
    return Promise.resolve(true)
  }

  #onApproveHandler(result) {
    const formParent = document.getElementById(`${this.#contentId}`)
    formParent.classList.add('pos-rel', 'form-loading')
    const form = document.getElementById(`form-${this.#contentId}`)

    if (typeof form !== 'undefined' && form !== null) {
      const props = bf_globals[this.#contentId]
      if (this.#entryId) props.entryId = this.#entryId

      let submitBtn = bfSelect('button[type="submit"]', form)
      if (!submitBtn) {
        submitBtn = document.createElement('button')
        submitBtn.setAttribute('type', 'submit')
        submitBtn.style.display = 'none'
        form.append(submitBtn)
      }
      submitBtn.click()

      formParent.classList.remove('pos-rel', 'form-loading')
      this.#entryId = null
    }
  }

  #detachAllEvents() {
    this.#allEventListeners.forEach(({ selector, eventType, cb }) => {
      selector.removeEventListener(eventType, cb)
    })
  }

  #Number(numberText) {
    const regex = /[\d,.]*\d(?:\.\d+)?/
    const match = numberText?.match(regex)
    if (match) {
      const numericValue = match[0].replace(/,/g, '')
      return parseFloat(numericValue)
    }
    return parseFloat(0)
  }

  destroy() {
    this.#mollieBtn.disabled = false
    this.#detachAllEvents()
  }

  reset() {
    this.destroy()
    this.init()
  }
}
