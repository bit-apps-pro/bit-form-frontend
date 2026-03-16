export default class BitConversationalForm {
  #contentId = null

  #formId = 0

  #welcomePage = null

  #conversationalSettings = {}

  #navigationSettings = {}

  #conversationalContainer = null

  #stepsWrapperList = []

  #stepFieldsList = []

  #okBtns = []

  #checkAndRadioFields = []

  #inputFields = []

  #navBtnUp = null

  #navBtnDown = null

  #currentStep = 0

  #nextStep = 1

  #allEventListeners = []

  #totalSteps = 0

  #form = null

  #activeFieldStep = 0

  constructor(selector, config) {
    if (typeof selector === 'string') this.#conversationalContainer = document.querySelector(selector)
    else this.#conversationalContainer = selector

    if (!this.#conversationalContainer) return
    this.#formId = config.formId
    this.#setConfigsToVars(config)
    this.#form = this.#select(`#form-${this.#contentId}`)
    this.init()

    this.#addEventListeners()

    this.#setActiveStep(this.#currentStep)
    this.#setSubmitButtonToLastStep()
  }

  init() {
    this.#stepsWrapperList = this.#selectAll(`.bc${this.#formId}-step-wrapper`, this.#conversationalContainer)
    this.#stepFieldsList = this.#selectAll(`.bc${this.#formId}-step-wrapper .bc${this.#formId}-fld`, this.#conversationalContainer)
    this.#okBtns = this.#selectAll(`.bc${this.#formId}-step-wrapper .bc${this.#formId}-btn`, this.#conversationalContainer)
    this.#navBtnUp = this.#select(`.bc${this.#formId}-nav-btn-up`)
    this.#navBtnDown = this.#select(`.bc${this.#formId}-nav-btn-down`)
    this.#inputFields = this.#selectAll(`.bc${this.#formId}-step-wrapper input:not([type="checkbox"]):not([type="radio"]), .bc${this.#formId}-step-wrapper textarea`, this.#conversationalContainer)
    this.#checkAndRadioFields = this.#selectAll(`.bc${this.#formId}-step-wrapper input[type="checkbox"],.bc${this.#formId}-step-wrapper input[type="radio"]`, this.#conversationalContainer)
    this.#totalSteps = this.#welcomePage?.enable ? this.#stepsWrapperList.length - 1 : this.#stepsWrapperList.length
  }

  #setActiveStep(step) {
    this.#stepsWrapperList[this.#currentStep].classList.remove('bc-step-fade-up', 'bc-step-fade-down')
    this.#stepsWrapperList[this.#currentStep].classList.add('bc-step-deactive')
    const stepWrapper = this.#stepsWrapperList[step]
    stepWrapper?.classList.remove('bc-step-deactive')
    if (step >= this.#currentStep) stepWrapper?.classList.add('bc-step-fade-up')
    else stepWrapper?.classList.add('bc-step-fade-down')
    const focusElm = this.#select(`.bc${this.#formId}-focus-elm`, stepWrapper)
    if (focusElm) focusElm.focus()
    this.#currentStep = step
    this.#progressCalculation()
    this.#handleNavigationBtns()
  }

  #isCurrentStepValidate() {
    if (this.#currentStep === 0 && this.#welcomePage?.enable) return true
    if (this.#currentStep === this.#totalSteps) {
      return true
    }
    const currentStepWrapper = this.#stepsWrapperList[this.#currentStep]
    const inputField = this.#select('input, textarea', currentStepWrapper)
    if (inputField && typeof validateForm !== 'undefined' && validateForm({ input: inputField })) {
      return true
    }
    return false
  }

  #handleNavigationBtns() {
    if (this.#currentStep === 0) {
      this.#setAttribute(this.#navBtnUp, 'disabled')
    } else {
      this.#removeAttribute(this.#navBtnUp, 'disabled')
    }
    if (this.#currentStep === this.#totalSteps) {
      this.#setAttribute(this.#navBtnDown, 'disabled')
    } else {
      this.#removeAttribute(this.#navBtnDown, 'disabled')
    }
  }

  #setConfigsToVars(config) {
    if (config) {
      const {
        contentId,
        navigationSettings,
      } = config
      this.#contentId = contentId
      this.#navigationSettings = navigationSettings
      this.#welcomePage = config?.stepListObject?.welcomePage
    }
  }

  #progressCalculation() {
    const progressLblElm = this.#select(`.bc${this.#formId}-progress-lbl`)
    const progressFill = this.#select(`.bc${this.#formId}-progress-fill`)
    let progressLbl = this.#navigationSettings.progressLabel
    const currentStep = Math.max(0, (this.#welcomePage?.enable ? this.#currentStep - 1 : this.#currentStep))
    // round percentage
    const progressPercent = Math.ceil((currentStep / this.#totalSteps) * 100)
    if (progressLblElm) {
      progressLbl = progressLbl.replace('${bc-step}', currentStep)
      progressLbl = progressLbl.replace('${bc-total-steps}', this.#totalSteps)
      progressLbl = progressLbl.replace('${bc-percent}', progressPercent)
      progressLblElm.innerHTML = progressLbl
    }
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`
    }
  }

  #addEventListeners() {
    // add click event to skip buttons
    this.#okBtns.forEach((okBtn, index) => {
      if (index !== this.#totalSteps) {
        this.#addEvent('click', okBtn, (e) => {
          e.preventDefault()
          this.#nextStep = this.#currentStep + 1
          this.#setActiveStep(this.#nextStep)
        })
      }

      // detect tab key press on skip button
      this.#addEvent('keydown', okBtn, (e) => {
        if (!e.shiftKey && e.keyCode === 9) {
          e.preventDefault()
          this.#nextStep = this.#currentStep + 1
          this.#setActiveStep(this.#nextStep)
        }
      })
    })

    // nav button actions
    if (this.#navBtnUp) {
      this.#addEvent('click', this.#navBtnUp, (e) => {
        e.preventDefault()
        this.#setActiveStep(this.#currentStep - 1)
      })
    }

    if (this.#navBtnDown) {
      this.#addEvent('click', this.#navBtnDown, (e) => {
        e.preventDefault()
        this.#setActiveStep(this.#currentStep + 1)
      })
    }

    // detect shift + tab key press on input fields
    this.#inputFields.forEach((inputField) => {
      this.#addEvent('keydown', inputField, (e) => {
        if (e.shiftKey && e.keyCode === 9) {
          e.preventDefault()
          this.#setActiveStep(this.#currentStep - 1)
        }

        // enter key press
        if (e.keyCode === 13) {
          e.preventDefault()
          if (typeof validateForm !== 'undefined' && validateForm({ input: e.target })) {
            if (this.#currentStep < this.#totalSteps) {
              this.#nextStep = this.#currentStep + 1
              this.#setActiveStep(this.#nextStep)
            }
          }
        }
      })

      // input action on input fields
      this.#addEvent('input', inputField, (e) => {
        if (typeof validateForm !== 'undefined') {
          const stepWrapper = this.#closestSelect(`.bc${this.#formId}-step-wrapper`, e.target)
          const stepBtnWrp = this.#select(`.bc${this.#formId}-step-btn-wrpr`, stepWrapper)
          if (validateForm({ input: e.target }, { otherOptions: { validateOnInput: true } })) {
            this.#removeClass('bc-grid-hide', stepBtnWrp)
          } else if (!stepBtnWrp.classList.contains('bc-grid-hide')) {
            this.#addClass('bc-grid-hide', stepBtnWrp)
          }
        }
      })
    })

    // check and radio fields
    this.#checkAndRadioFields.forEach((checkAndRadioField) => {
      this.#addEvent('change', checkAndRadioField, (e) => {
        if (typeof validateForm !== 'undefined') {
          const stepWrapper = this.#closestSelect(`.bc${this.#formId}-step-wrapper`, e.target)
          const stepBtnWrp = this.#select(`.bc${this.#formId}-step-btn-wrpr`, stepWrapper)
          if (validateForm({ input: e.target })) {
            this.#removeClass('bc-grid-hide', stepBtnWrp)
          } else if (!stepBtnWrp.classList.contains('bc-grid-hide')) {
            this.#addClass('bc-grid-hide', stepBtnWrp)
          }
        }
      })
    })

    this.#addEvent('keydown', this.#form, (e) => {
      // check is keycode is letter
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const optionNo = e.keyCode - 65
        const currentStepWrapper = this.#stepsWrapperList[this.#currentStep]
        const checkInputList = this.#selectAll(`.bc${this.#formId}-ci`, currentStepWrapper)
        if (checkInputList.length > 0) {
          const checkInput = checkInputList[optionNo]
          if (checkInput) {
            this.#setAttribute(checkInput, 'checked', true)
            checkInput.focus()
          }
        }
      }
    })
  }

  #findStepIndexByFieldKey(fieldKey) {
    let stepIndex = -1
    this.#stepsWrapperList.forEach((stepWrapper, index) => {
      if (stepWrapper.classList.contains(fieldKey)) {
        stepIndex = index
      }
    })
    return stepIndex
  }

  #setSubmitButtonToLastStep() {
    const lastStepWrapper = this.#stepsWrapperList[this.#stepsWrapperList.length - 1]
    const stepBtn = this.#select(`.bc${this.#formId}-btn-ok`, lastStepWrapper)
    if (stepBtn) {
      stepBtn.textContent = 'Submit'
      const span = document.createElement('span')
      span.classList.add('bf-spinner', 'd-none')
      stepBtn.appendChild(span)
      this.#setAttribute(stepBtn, 'type', 'submit')
    }
  }

  get activeFieldStep() {
    return this.#activeFieldStep
  }

  set activeFieldStep(fieldKey) {
    this.#activeFieldStep = fieldKey

    const stepIndex = this.#findStepIndexByFieldKey(`bc${this.#formId}-${fieldKey}`)
    if (stepIndex !== -1) {
      this.#setActiveStep(stepIndex)
    }
  }

  #closestSelect(selector, element) {
    return element.closest(selector)
  }

  #select(selector, context = document) {
    return context.querySelector(selector)
  }

  #selectAll(selector, context = document) {
    return context.querySelectorAll(selector)
  }

  #setAttribute(elm, name, value = '') {
    elm?.setAttribute?.(name, value)
  }

  #removeAttribute(elm, name) {
    elm?.removeAttribute?.(name)
  }

  #addClass(className, element) {
    element.classList.add(className)
  }

  #removeClass(className, element) {
    element.classList.remove(className)
  }

  #toggleClass(className, element) {
    element.classList.toggle(className)
  }

  #addEvent(event, element, callback) {
    element.addEventListener(event, callback)
    this.#allEventListeners.push({ element, event, callback })
  }
}
