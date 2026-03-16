/* eslint-disable radix */
export default class BitRatingField {
  #labels = null

  #msg = null

  #ratingOptions = []

  #document = null

  #fieldKey = null

  #contentId = null

  #showMsgOnHover = false

  #showMsgOnSelect = false

  #selectedRating = false

  #ratingWrp = null

  #isCheck = {}

  #ratingImg = null

  #ratingLbl = null

  #ratingInput = null

  #ratingMsg = null

  #ratingHover = null

  #ratingScale = null

  #ratingSelected = null

  #selectedRatingInput = null

  #allEventListeners = []

  #defaultValue = null

  #isClickReal = false

  constructor(selector, config) {
    this.#document = config?.document || document
    this.#fieldKey = config?.fieldKey
    this.#isCheck = { status: false, indx: null }

    if (typeof selector === 'string') {
      this.#ratingWrp = this.#document.querySelector(selector)
    } else {
      this.#ratingWrp = selector
    }

    this.#contentId = config?.contentId
    this.#ratingOptions = config?.options || []

    this.#showMsgOnHover = config?.showReviewLblOnHover || false
    this.#showMsgOnSelect = config?.showReviewLblOnSelect || false
    this.#selectedRating = config?.selectedRating || false
    this.#defaultValue = config?.defaultValue || null

    this.init()
  }

  #selectorVariable() {
    this.#ratingImg = `.${this.#fieldKey}-rating-img`
    this.#ratingLbl = `.${this.#fieldKey}-rating-lbl`
    this.#ratingInput = `.${this.#fieldKey}-rating-input`
    this.#ratingMsg = `.${this.#fieldKey}-rating-msg`

    // for add and remove class name so not using dot
    this.#ratingHover = `${this.#fieldKey}-rating-hover`
    this.#ratingScale = `${this.#fieldKey}-rating-scale`
    this.#ratingSelected = `${this.#fieldKey}-rating-selected`
  }

  #checkDefaultRatingSelected() {
    this.#ratingOptions.forEach((item, index) => {
      if (this.#defaultValue === item.val || item?.check) {
        this.#isCheck = { status: true, indx: index }
        if (this.#showMsgOnSelect) {
          this.#addMessage(index)
        } else {
          this.#removeMessage()
        }
      }
    })
  }

  #addEvent(selector, eventType, cb) {
    selector.addEventListener(eventType, cb)
    this.#allEventListeners.push({ selector, eventType, cb })
  }

  #handleKeyboardNavigation() {
    let activeIndex = -1
    const selectIndex = this.#ratingOptions.findIndex((item) => item.check)
    if (selectIndex !== -1) {
      activeIndex = selectIndex
    }

    this.#addEvent(this.#ratingWrp, 'keydown', (e) => {
      if (e.key === 'ArrowRight') {
        if (this.#ratingOptions.length === activeIndex) return
        activeIndex += 1
        const childrenElement = e.target.children[activeIndex]
        const val = parseInt(childrenElement.dataset.indx)
        if (this.#isCheck.indx !== val) this.#onClick(val)
        this.#addNavigateHoverStyle(val)
        if (this.#ratingOptions.length === activeIndex + 1) return false
      } else if (e.key === 'ArrowLeft') {
        if (activeIndex === 0) return
        if (activeIndex - 1 < 0) return
        activeIndex -= 1
        this.#onClick(activeIndex)
        this.#addNavigateHoverStyle(activeIndex)
      }
    })
    this.#addEvent(this.#ratingWrp, 'focusout', () => {
      this.#removeNavigateHoverStyle()
    })
  }

  // for add class keyboard event
  #addNavigateHoverStyle(index) {
    this.#removeNavigateHoverStyle()
    // add scale this index
    const star = this.#labels[index].querySelector(this.#ratingImg)
    this.#addClass(star, this.#ratingScale)
  }

  #removeNavigateHoverStyle() {
    for (let i = 0; i < this.#ratingOptions.length; i += 1) {
      const stats = this.#labels[i].querySelector(this.#ratingImg)
      this.#removeClass(stats, this.#ratingScale)
    }
  }

  init() {
    this.#selectorVariable()

    this.#labels = this.#ratingWrp.querySelectorAll(this.#ratingLbl)
    this.#msg = this.#select(this.#ratingMsg)

    this.#checkDefaultRatingSelected()

    this.#handleKeyboardNavigation()

    this.#labels.forEach((item, index) => {
      if (this.#isCheck.status && index <= this.#isCheck.indx) {
        const imageElement = item.querySelector(this.#ratingImg)
        this.#addClass(imageElement, this.#ratingSelected)
        if (this.#ratingOptions[index].check) {
          const selectedInput = item.querySelector(this.#ratingInput)
          selectedInput.checked = true
        }
      }

      this.#addEvent(item, 'mouseover', () => {
        const indx = parseInt(item.dataset.indx)
        this.#hoverAction(indx)
      })

      this.#addEvent(item, 'mouseout', () => {
        const { indx } = item.dataset
        this.#onEnd(indx)
      })

      this.#addEvent(item, 'click', (e) => {
        const { indx } = item.dataset
        e.preventDefault()
        this.#isClickReal = true
        this.#onClick(indx)
      })

      this.#addEvent(item, 'touchstart', (e) => {
        e.preventDefault()
        const { indx } = item.dataset
        this.#isClickReal = true
        this.#onClick(indx)
      })

      this.#addEvent(item, 'touchend', () => {
        const { indx } = item.dataset
        this.#onEnd(indx)
      })
    })
  }

  #select(selector) { return this.#ratingWrp.querySelector(selector) }

  #hoverAction(indx) {
    if (this.#showMsgOnHover) {
      this.#addMessage(indx)
    }

    // for styling
    if (this.#isCheck.indx) {
      if (this.#labels?.[this.#isCheck.indx]) {
        const len = this.#labels.length - 1
        this.#labels.forEach((itm) => {
          const ele = itm.querySelector(this.#ratingImg)
          this.#removeClass(ele, this.#ratingSelected)
        })

        for (let i = 0; i <= this.#isCheck.indx; i += 1) {
          const stats = this.#labels[i].querySelector(this.#ratingImg)
          this.#removeClass(stats, this.#ratingSelected)
        }

        if (this.#isCheck.indx === len) {
          for (let i = 0; i <= this.#isCheck.indx; i += 1) {
            const stats = this.#labels[i].querySelector(this.#ratingImg)
            this.#removeClass(stats, this.#ratingSelected)
          }
        }
      }
    }

    for (let i = 0; i <= indx; i += 1) {
      if (i <= indx && this.#labels?.[i]) {
        const stats = this.#labels[i].querySelector(this.#ratingImg)
        this.#addClass(stats, this.#ratingHover)
        if (i === indx) {
          this.#addClass(stats, this.#ratingScale)
        }
      }
    }
  }

  #onEnd(indx) {
    if (this.#showMsgOnHover) {
      if (this.#isCheck.status && this.#isCheck.indx === indx) {
        this.#addMessage(indx)
      } else if (this.#isCheck.status) {
        this.#addMessage(this.#isCheck.indx)
      } else if (this.#msg) {
        this.#removeMessage()
      }
    }

    // for styling
    for (let i = 0; i <= indx; i += 1) {
      if (this.#labels?.[i]) {
        const stats = this.#labels[i].querySelector(this.#ratingImg)
        this.#removeClass(stats, this.#ratingHover)
        this.#removeClass(stats, this.#ratingScale)
      }
    }

    if (this.#isCheck.status) {
      if (this.#labels?.[this.#isCheck.indx]) {
        for (let i = 0; i <= this.#isCheck.indx; i += 1) {
          const stats = this.#labels[i].querySelector(this.#ratingImg)
          this.#addClass(stats, this.#ratingSelected)
        }
      }
    }

    if (this.#showMsgOnSelect) {
      this.#addMessage(this.#isCheck.indx)
    } else {
      this.#removeMessage()
    }
  }

  #onClick(indx) {
    if (this.#labels?.[this.#isCheck.indx]) {
      const rmvSltCls = this.#labels[this.#isCheck.indx].querySelector(this.#ratingImg)
      this.#removeClass(rmvSltCls, this.#ratingSelected)
    }

    // if (this.#showMsgOnSelect) {
    //   this.#addMessage(indx)
    // } else {
    //   // this.#removeMessage()
    // }

    const input = this.#labels?.[indx].querySelector(this.#ratingInput)

    if (this.#selectedRatingInput && this.#isClickReal) {
      if (input?.checked) {
        input.checked = false
        this.#isCheck = { status: false, indx: null }
      } else {
        input.checked = true
        this.#isCheck = { status: true, indx }
      }
    } else {
      input.checked = true
      this.#isCheck = { status: true, indx }
      this.#selectedRatingInput = input
    }

    input.dispatchEvent(new Event('input'))

    // remove hover color when click star
    this.#labels?.forEach((itm) => {
      const rmvHorCls = itm.querySelector(this.#ratingImg)
      this.#removeClass(rmvHorCls, this.#ratingHover)
    })

    this.#labels?.forEach((itm, lblIndx) => {
      const isStar = itm.querySelector(this.#ratingImg)
      if (lblIndx <= indx && this.#isCheck.status) {
        this.#addClass(isStar, this.#ratingSelected)
      } else {
        this.#removeClass(isStar, this.#ratingSelected)
      }
    })

    if (this.#showMsgOnSelect && this.#isCheck.status) {
      this.#addMessage(indx)
    } else {
      this.#removeMessage()
    }
    this.#isClickReal = false
  }

  #findRating(indx) {
    return this.#ratingOptions[indx]
  }

  #addMessage(indx) {
    const findRating = this.#findRating(indx)
    if (this.#msg && findRating) {
      this.#msg.innerText = findRating.lbl
    }
  }

  #removeMessage() {
    this.#msg && (this.#msg.innerHTML = '')
  }

  #addClass(el, className) {
    el.classList.add(className)
  }

  #removeClass(el, className) {
    el.classList.remove(className)
  }

  set value(val) {
    // find index of rating
    const findRating = this.#ratingOptions.findIndex((itm) => itm.val === val)
    if (findRating !== -1) {
      this.#onClick(findRating)
    }
  }

  get value() {
    const selectedItem = this.#ratingOptions[this.#isCheck.indx]
    return selectedItem.val || selectedItem.lbl
  }

  #removeAllSelectedRating() {
    this.#labels.forEach((item) => {
      const ele = item.querySelector(this.#ratingImg)
      this.#removeClass(ele, this.#ratingSelected)
    })
  }

  #dispatchAllEvent() {
    this.#allEventListeners.forEach(({ selector, eventType, cb }) => {
      selector.removeEventListener(eventType, cb)
    })
  }

  destroy() {
    this.#removeAllSelectedRating()
    this.#dispatchAllEvent()
    this.#labels = null
    this.#msg = null
  }

  reset() {
    this.#removeAllSelectedRating()
    this.#dispatchAllEvent()
    this.#isCheck = { status: false, indx: null }
    // this.#selectedRatingInput.checked = false
    this.#selectedRatingInput = null
    this.init()
  }
}
