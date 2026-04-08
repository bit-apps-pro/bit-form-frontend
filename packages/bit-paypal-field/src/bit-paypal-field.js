export default class BitPayPalField {
  #paypalWrpSelector = ''

  #formSelector = ''

  #config = {
    namespace: 'paypal',
    payType: 'payment',
    currency: 'USD',
    amount: 1,
    shipping: 0,
    tax: 0,
    style: {
      label: 'paypal',
      color: 'gold',
      shape: 'rect',
      layout: 'vertical',
    },
  }

  #entryId = null

  constructor(selector, config) {
    Object.assign(this.#config, config)

    if (typeof selector === 'string') this.#paypalWrpSelector = document.querySelector(selector)
    else this.#paypalWrpSelector = selector
    this.#formSelector = `#form-${this.#getContentId()}`

    this.init()
  }

  init() {
    const { namespace } = this.#config
    const paypal = window[namespace]

    const btnProps = { style: this.#getStyles() }

    if (this.#isStandalone()) {
      btnProps.fundingSource = paypal.FUNDING[this.#config.style.payBtn]
    }

    if (this.#isSubscription()) {
      btnProps.createSubscription = (data, actions) => this.#createSubscriptionHandler(data, actions)
    } else {
      btnProps.createOrder = (data, actions) => this.#createOrderHandler(data, actions)
    }
    btnProps.onClick = (_, actions) => this.#handleOnClick(actions)
    btnProps.onApprove = (data, actions) => this.#onApproveHandler(data, actions)

    if (this.#config.onInit) {
      btnProps.onInit = this.#config.onInit
    }

    if (paypal) paypal.Buttons(btnProps).render(this.#paypalWrpSelector)
  }

  #isSubscription() { return this.#config.payType === 'subscription' }

  #isStandalone() { return this.#config.style.layout === 'standalone' }

  #getContentId() { return this.#config.contentId }

  #createSubscriptionHandler(_, action) {
    if (typeof validateForm !== 'undefined' && !validateForm({ form: this.#getContentId() })) throw new Error('form validation is failed!')
    return action.subscription.create({ plan_id: this.#config.planId })
  }

  async #handleOnClick(actions) {
    const contentId = this.#getContentId()
    try { await isFormValidatedWithoutError(contentId) } catch (_) { return actions.reject() }
    const progressData = await saveFormProgress(contentId)
    const savedFormData = progressData?.[contentId]

    if (!savedFormData?.success) return actions.reject()
    if (savedFormData.data.entry_id) this.#entryId = savedFormData.data.entry_id
    return actions.resolve()
  }

  #onApproveHandler(_, actions) {
    const formParent = document.getElementById(`${this.#getContentId()}`)
    formParent.classList.add('pos-rel', 'form-loading')

    const transactionPromise = this.#isSubscription()
      ? actions.subscription.get()
      : actions.order.capture()

    transactionPromise.then(result => {
      console.log('paypal transaction result=', result)

      const transactionId = this.#getTransactionId(result)

      if (!transactionId) {
        console.error('Transaction ID not found.')
        return
      }

      this.#handleTransactionSuccess(transactionId, result)
    }).catch(error => {
      console.error('Error during PayPal approval process:', error)
      formParent.classList.remove('pos-rel', 'form-loading')
    }).finally(() => {
      formParent.classList.remove('pos-rel', 'form-loading')
    })
  }

  #handleTransactionSuccess(transactionId, result) {
    const props = bf_globals[this.#getContentId()]
    const form = document.getElementById(`form-${this.#getContentId()}`)
    const formID = this.#getContentId()?.split('_')[1]

    if (typeof form !== 'undefined' && form !== null) {
      if (this.#entryId) props.entryId = this.#entryId

      const paymentFld = bfSelect(`input[name="${this.#config.fieldKey}"]`, form)
      if (paymentFld) {
        paymentFld.value = transactionId
      } else {
        setHiddenFld({ name: this.#config.fieldKey, value: transactionId, type: 'text' }, form)
      }

      let submitBtn = bfSelect('button[type="submit"]', form)
      if (!submitBtn) {
        submitBtn = document.createElement('button')
        submitBtn.setAttribute('type', 'submit')
        submitBtn.style.display = 'none'
        form.append(submitBtn)
      }
      submitBtn.click()

      const paymentParams = {
        formID,
        transactionID: transactionId,
        payment_name: 'paypal',
        payment_type: this.#isSubscription() ? 'subscription' : 'order',
        payment_response: result,
        entry_id: this.#entryId,
        fieldKey: this.#config.fieldKey,
      }

      const uri = new URL(props?.ajaxURL)
      uri.searchParams.append('_ajax_nonce', props?.nonce)
      uri.searchParams.append('action', 'bitforms_payment_insert')

      fetch(uri, {
        method: 'POST',
        body: JSON.stringify(paymentParams),
      }).then(() => {
        this.#entryId = null

        // Clear the transaction ID from the form field
        const paymentFldInp = bfSelect(`input[name="${this.#config.fieldKey}"]`, form)
        if (paymentFldInp) {
          paymentFldInp.value = ''
          paymentFldInp.setAttribute('value', '')
        }
      })
    }
  }

  #getTransactionId(result) {
    let transactionId = null

    if (this.#isSubscription() && result.id) {
      transactionId = result.id // Subscription transaction ID
    } else if (result.purchase_units && result.purchase_units[0] && result.purchase_units[0].payments) {
      const { payments } = result.purchase_units[0]
      if (payments.captures && payments.captures[0]) {
        transactionId = payments.captures[0].id // Order transaction ID after capture
      }
    }

    return transactionId
  }

  #select(selector, elm) {
    return document.querySelector(elm)?.querySelector(selector)
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

  #createOrderHandler(_, action) {
    const { currency, amount, shipping, tax } = this.#config
    const amountVal = this.#getDynamicValue(this.#config.amountFld) || amount
    const shippingVal = this.#getDynamicValue(this.#config.shippingVal) || shipping
    const taxVal = this.#getDynamicValue(this.#config.taxVal) || tax

    const orderAmount = this.#Number(amountVal).toFixed(2) * 1
    const shippingAmount = this.#Number(shippingVal).toFixed(2) * 1
    const taxAmount = ((this.#Number(taxVal) * orderAmount) / 100).toFixed(2) * 1
    const totalAmount = (orderAmount + shippingAmount + taxAmount).toFixed(2) * 1
    const formID = this.#getContentId()?.split('_')[1]
    const fieldKey = this.#config?.fieldKey
    const desc = this.#getDynamicValue(this.#config.descFld) || this.#config.description
    const customId = `form-id:${formID};entry-id:${this.#entryId};field-key:${fieldKey}`

    return action.order.create({
      purchase_units: [{
        description: desc,
        custom_id: customId,
        amount:
        {
          currency_code: currency,
          value: totalAmount,
          breakdown:
          {
            item_total: { currency_code: currency, value: orderAmount },
            shipping: { currency_code: currency, value: shippingAmount },
            tax_total: { currency_code: currency, value: taxAmount },
          },
        },
      }],
    })
  }

  #getStyles() {
    const { label, color, shape, layout, height } = this.#config.style

    const style = {
      label: this.#isSubscription() ? 'subscribe' : label,
      color,
      shape,
    }
    if (!this.#isStandalone()) style.layout = layout
    if (height !== undefined) style.height = Number(height)

    return style
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
    this.#paypalWrpSelector.innerHTML = ''
    // Object.keys(window).forEach((key) => {
    //   if (/paypal|zoid|post_robot/.test(key)) {
    //     delete window[key]
    //   }
    // })
  }

  reset() {
    this.destroy()
    this.init()
  }
}

// const payPalField = new PayPalField('#paypal-wrp', {
//   namespace: 'paypal',
//   payType: 'payment', // payment, subscription
//   currency: 'USD',
//   description: '',
//   // amount: 15,
//   amountFld: 'bf-amount',
//   shipping: 0,
//   tax: 0,
//   style: {
//     color: 'gold',
//     shape: 'rect',
//     layout: 'vertical',
//     // payBtn: 'PAYPAL'
//   },
// })
