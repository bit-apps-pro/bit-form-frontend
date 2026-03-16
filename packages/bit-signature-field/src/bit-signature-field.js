/* eslint-disable no-plusplus */
import SignaturePad from 'signature_pad'

export default class BitSignatureField {
  #canvas = null

  #signatureImgType = null

  #clearButton = null

  #undoButton = null

  #redoButton = null

  #signaturePad = null

  #signatureFldWrp = null

  #options = {}

  #document = null

  #window = null

  #fieldKey = null

  #signatureFld = null

  #contentId = null

  #assetsURL = null

  #isBuilder = null

  #undoedData = []

  constructor(selector, config) {
    this.#document = config.document || document

    this.#window = config.window || window
    if (typeof selector === 'string') {
      this.#signatureFldWrp = this.#document.querySelector(selector)
    } else {
      this.#signatureFldWrp = selector
    }

    this.#options = {
      maxWidth: config.maxWidth || 2.5,
      penColor: config.penColor || 'rgb(0, 0, 0)',
      backgroundColor: config.backgroundColor || 'rgb(255, 255, 255)',
    }

    this.#fieldKey = config.fieldKey

    this.#signatureImgType = config.imgTyp || 'image/png'

    this.#isBuilder = config?.isBuilder || false

    this.#contentId = config?.contentId
    this.#assetsURL = config?.assetsURL

    this.init()
  }

  init() {
    this.#canvas = this.#select(`.${this.#fieldKey}-signature-pad`)
    this.#clearButton = this.#select(`.${this.#fieldKey}-clr-btn`)
    this.#undoButton = this.#select(`.${this.#fieldKey}-undo-btn`)
    this.#redoButton = this.#select(`.${this.#fieldKey}-redo-btn`)
    this.#signatureFld = this.#select(`.${this.#fieldKey}-signature-fld`)
    this.#canvas.style.cursor = `url(${this.#assetsURL}pen.ico), crosshair`

    const signatureIframe = this.#select(`.${this.#fieldKey}-signature-iframe`)
    if (signatureIframe) signatureIframe.contentWindow.addEventListener('resize', () => { this.resizeCanvas() })

    this.#signaturePad = new SignaturePad(this.#canvas, this.#options)

    this.resizeCanvas()
    this.#clearCanvas()
    this.#undoCanvas()
    this.#redoCanvas()

    this.#disableBtn(this.#undoButton)
    this.#disableBtn(this.#redoButton)
    this.#disableBtn(this.#clearButton)

    this.#signaturePad.addEventListener('endStroke', () => {
      this.#undoedData = []
      this.putSignature()
      this.#disableBtn(this.#clearButton, false)
      this.#disableBtn(this.#undoButton, false)
      this.#disableBtn(this.#redoButton)
    })

    // add keyboard shortcut for undo ctrl + z and redo ctrl + y
    // window.addEventListener('keydown', (e) => {
    //   if (this.#isBuilder) return
    //   if (e.ctrlKey && e.key === 'y') {
    //     e.preventDefault()
    //     this.#redoButton.click()
    //   }
    //   if (e.ctrlKey && e.key === 'z') {
    //     e.preventDefault()
    //     this.#undoButton.click()
    //   }
    // })

    // for touch devices, add touch events
    this.#canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
      })
      this.#canvas.dispatchEvent(mouseEvent)
    })
  }

  #select(selector, parent = null) {
    return (parent || this.#signatureFldWrp).querySelector(selector)
  }

  resizeCanvas() {
    const ratio = Math.max(this.#window.devicePixelRatio || 1, 1)

    this.#canvas.width = this.#canvas.offsetWidth * ratio
    this.#canvas.height = this.#canvas.offsetHeight * ratio
    this.#canvas.getContext('2d').scale(ratio, ratio)

    this.#signaturePad.fromData(this.#signaturePad.toData())
  }

  #clearCanvas() {
    if (!this.#clearButton) return
    this.#clearButton.addEventListener('click', () => {
      this.#signaturePad.clear()
      this.#signatureFld.value = ''
      this.#disableBtn(this.#undoButton)
      this.#disableBtn(this.#redoButton)
      this.#disableBtn(this.#clearButton)
    })
  }

  #undoCanvas() {
    if (!this.#undoButton) return
    this.#undoButton.addEventListener('click', () => {
      const data = this.#signaturePad.toData()
      if (data.length) {
        const removed = data.pop() // remove the last dot or line
        this.#undoedData.push(removed)
        this.#signaturePad.fromData(data)
        this.putSignature()
        if (data.length === 0) {
          this.#signatureFld.value = ''
        }
        this.#disableBtn(this.#redoButton, false)
        if (!data.length) this.#disableBtn(this.#undoButton)
      } else {
        this.#disableBtn(this.#undoButton)
      }
    })
  }

  #redoCanvas() {
    if (!this.#redoButton) return
    this.#redoButton.addEventListener('click', () => {
      const data = this.#signaturePad.toData()
      if (this.#undoedData.length) {
        data.push(this.#undoedData.pop()) // add the last dot or line
        this.#signaturePad.fromData(data)
        this.putSignature()
        this.#disableBtn(this.#undoButton, false)
        if (!this.#undoedData.length) this.#disableBtn(this.#redoButton)
      } else {
        this.#disableBtn(this.#redoButton)
      }
    })
  }

  #disableBtn(btn, disable = true) {
    if (!btn) return
    if (disable) {
      btn.setAttribute('disabled', 'disabled')
    } else {
      btn.removeAttribute('disabled')
    }
  }

  putSignature() {
    if (this.#isBuilder) return
    if (this.#signaturePad.isEmpty()) return
    const data = this.#signaturePad.toDataURL(this.#signatureImgType)
    this.#signatureFld.value = data
  }

  destroy() {
    this.#document = null
    this.#canvas = null
  }

  reset() {
    this.#signaturePad.clear()
    this.#signatureFld.value = ''
  }

  /**
 * Programmatically set a signature for testing.
 * @param {string} base64Image - base64 encoded image string
 */
  setSignature(base64Image) {
    if (!this.#signaturePad) return
    // Clear current pad first
    this.#signaturePad.clear()
    // Create an image element to draw on canvas
    const img = new Image()
    img.onload = () => {
      const ctx = this.#canvas.getContext('2d')
      ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
      ctx.drawImage(img, 0, 0, this.#canvas.width, this.#canvas.height)

      // Load PNG into SignaturePad to update internal data
      const pngDataUrl = this.#canvas.toDataURL(this.#signatureImgType)
      this.#signaturePad.fromDataURL(pngDataUrl)
      this.putSignature() // update hidden input field
    }
    img.src = base64Image
    this.#disableBtn(this.#clearButton, false)
  }
}
