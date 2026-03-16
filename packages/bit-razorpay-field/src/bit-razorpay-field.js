export default class BitRazorpayField {
  #razorpayWrapper = null

  #formSelector = ''

  #config = {
    clientId: '',
    options: {
      currency: 'INR',
      amount: 1,
      amountType: 'fixed',
      theme: {},
      modal: {},
      prefill: {},
      notes: {},
    },
  }

  #allEventListeners = []

  #entryId = null

  #document = null

  #window = null

  #formID = null

  constructor(selector, config) {
    Object.assign(this.#config, config)
    this.#document = config.document || document
    this.#window = config.window || window
    this.#formSelector = `#form-${this.#getContentId()}`
    if (typeof selector === 'string') {
      this.#razorpayWrapper = this.#document.querySelector(selector)
    } else {
      this.#razorpayWrapper = selector
    }

    this.#formID = this.#config?.formID
    this.init()
  }

  init() {
    this.#addEvent(this.#select(`.${this.#config.fieldKey}-razorpay-btn`), 'click', () => { this.#displayRazorpay() })
  }

  #select(selector, elm) {
    if (elm) return this.#document.querySelector(elm).querySelector(selector)
    return this.#razorpayWrapper.querySelector(selector)
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

  #getDynamicValue(fldKey) {
    if (fldKey) {
      const fldName = window.bf_globals[this.#getContentId()].fields[fldKey].fieldName
      let elm = this.#select(`[name="${fldName}"]`, this.#formSelector)
      if (elm && elm.type === 'radio') {
        elm = this.#select(`[name="${fldName}"]:checked`, this.#formSelector)
      }
      if (elm && elm.value) {
        return elm.value
      }
    }
    return ''
  }

  #onPaymentSuccess = (response) => {
    const formParent = document.getElementById(`${this.#getContentId()}`)
    formParent.classList.add('pos-rel', 'form-loading')
    const form = document.getElementById(`form-${this.#getContentId()}`)
    const formID = this.#getContentId()?.split('_')[1]
    if (typeof form !== 'undefined' && form !== null) {
      const props = bf_globals[this.#getContentId()]
      if (this.#entryId) props.entryId = this.#entryId
      let paymentFld = bfSelect(`input[name="${this.#config.fieldKey}"]`, form)
      if (paymentFld) {
        paymentFld.value = response.razorpay_payment_id
      } else {
        setHiddenFld({ name: this.#config.fieldKey, value: response.razorpay_payment_id, type: 'text' }, form)
      }
      let submitBtn = bfSelect('button[type="submit"]', form)
      if (!submitBtn) {
        submitBtn = document.createElement('button')
        this.#setAttribute(submitBtn, 'type', 'submit')
        submitBtn.style.display = 'none'
        form.append(submitBtn)
      }
      submitBtn.click()

      const paymentParams = {
        formID,
        fieldKey: this.#config.fieldKey,
        transactionID: response.razorpay_payment_id,
        payment_type: this.#config.payType === 'subscription' ? 'subscription' : 'order',
        entry_id: this.#entryId,
      }

      const uri = new URL(props?.ajaxURL)
      uri.searchParams.append('_ajax_nonce', props?.nonce)
      uri.searchParams.append('action', 'bitforms_save_razorpay_details')
      const submitResp = fetch(
        uri,
        {
          method: 'POST',
          body: JSON.stringify(paymentParams),
        },
      )
      submitResp.then(() => {
        formParent.classList.remove('pos-rel', 'form-loading')
        this.#entryId = null
        paymentFld = bfSelect(`input[name="${this.#config.fieldKey}"]`, form)
        if (paymentFld) {
          this.#setAttribute(paymentFld, 'value', '')
          paymentFld.value = ''
        }
      })
    }
  }

  async #generateNewOrderId(orderData) {
    const props = bf_globals[this.#getContentId()]
    const formParent = document.getElementById(`${this.#getContentId()}`)
    formParent.classList.add('pos-rel', 'form-loading')
    const uri = new URL(props?.ajaxURL)
    uri.searchParams.append('_ajax_nonce', props?.nonce)
    uri.searchParams.append('action', 'bitforms_create_razorpay_order')
    const newOrderData = await fetch(uri, {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
    const orderResp = await newOrderData.json()
    formParent.classList.remove('pos-rel', 'form-loading')
    if (orderResp.data?.error || !orderResp.success) {
      return ''
    }
    return orderResp.data.id
  }

  async #displayRazorpay() {
    const {
      currency, amount, amountType, amountFld, name, description, theme, prefill, modal, notes,
    } = this.#config.options
    const { confirm_close } = modal
    const { contentId } = this.#config
    let modifiedNotes = notes
    if (typeof replaceFieldAndSmartValues !== 'undefined' && modifiedNotes) {
      modifiedNotes = JSON.parse(replaceFieldAndSmartValues(JSON.stringify(modifiedNotes), contentId))
    }

    const totalAmount = this.#Number(amountType === 'dynamic' ? this.#getDynamicValue(amountFld) : amount) * 100

    try { await isFormValidatedWithoutError(contentId) } catch (_) { return false }
    const progressData = await saveFormProgress(contentId)
    const savedFormData = progressData?.[contentId]
    if (!savedFormData?.success) return
    if (savedFormData.data.entry_id) this.#entryId = savedFormData.data.entry_id

    let orderId = ''
    modifiedNotes = {
      ...modifiedNotes,
      formID: this.#formID,
      entryID: this.#entryId,
      fieldKey: this.#config.fieldKey,
    }

    if (typeof bf_modify_razorpay_notes !== 'undefined') modifiedNotes = bf_modify_razorpay_notes(modifiedNotes)

    if (this.#config.includeOrderId) {
      if (!this.#config.newOrderId && this.#config.orderIdFld !== '') {
        orderId = this.#getDynamicValue(this.#config.orderIdFld)
      } else {
        const orderData = {
          payIntegID: this.#config.payIntegID,
          currency,
          amount: totalAmount,
          notes: modifiedNotes,
        }
        orderId = await this.#generateNewOrderId(orderData)
      }
    }

    const options = {
      key: this.#config.clientId,
      currency,
      amount: totalAmount,
      name,
      description,
      theme,
      order_id: orderId,
      prefill: {
        name: this.#getDynamicValue(prefill.prefillNameFld),
        email: this.#getDynamicValue(prefill.prefillEmailFld),
        contact: this.#getDynamicValue(prefill.prefillContactFld),
      },
      notes: modifiedNotes,
      modal: {
        backdropclose: false,
        escape: false,
        confirm_close,
      },
      handler: async response => this.#onPaymentSuccess(response),
    }
    const paymentObject = new this.#window.Razorpay(options)
    paymentObject.open()
  }

  #getContentId() {
    return this.#config.contentId
  }

  #setAttribute(elm, name, value) {
    elm?.setAttribute?.(name, value)
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
    this.#detachAllEvents()
  }

  reset() {
    this.destroy()
    this.init()
  }
}
