/* eslint-disable class-methods-use-this */
export default class BitFileUpField {
  #fileUploadWrap = null

  #fieldLabel = null

  #inpBtn = null

  #fileSelectStatus = null

  #fileInputWrpr = null

  #maxSizeLabel = null

  #fileUploadInput = null

  #filesList = null

  #errorWrap = null

  #files = {}

  #allEventListeners = []

  #document = null

  #window = {}

  #contentId = ''

  #attributes = {}

  #classNames = {}

  #fieldKey = ''

  #assetsURL = ''

  #oldFiles = []

  // default config
  #config = {
    id: 'upload',
    name: 'upload',
    required: true,
    multiple: false,
    maxSize: 0,
    sizeUnit: 'KB',
    isItTotalMax: false,
    showMaxSize: false,
    showSelectStatus: true,
    fileSelectStatus: 'No Choosen File',
    allowedFileType: '',
    showFileList: false,
    showFilePreview: false,
    showFileSize: false,
    accept: '.pdf,.exe,.msi',
    duplicateAllow: false,
    capture: '',
    minFile: 0,
    maxFile: 0,
    onchange: () => {
      console.log('Hellow World')
    },
    oninput: () => {

    },
  }

  constructor(selector, config) {
    Object.assign(this.#config, config)

    this.#document = config.document ? config.document : document
    this.#window = config.window ? config.window : window
    this.#attributes = config.attributes || {}
    this.#classNames = config.classNames || {}
    this.#contentId = config.contentId || ''

    if (typeof selector === 'string') {
      this.#fileUploadWrap = this.#document.querySelector(selector)
    } else {
      this.#fileUploadWrap = selector
    }
    this.#fieldKey = this.#config.fieldKey
    this.fieldKey = this.#fieldKey

    this.#assetsURL = config.assetsURL || ''

    this.init()
  }

  init() {
    this.#fieldLabel = this.#select(`.${this.#fieldKey}-label`)
    this.#inpBtn = this.#select(`.${this.#fieldKey}-inp-btn`)
    this.#fileSelectStatus = this.#select(`.${this.#fieldKey}-file-select-status`)
    this.#fileInputWrpr = this.#select(`.${this.#fieldKey}-file-input-wrpr`)
    this.#maxSizeLabel = this.#select(`.${this.#fieldKey}-max-size-lbl`)
    this.#fileUploadInput = this.#select(`.${this.#fieldKey}-file-upload-input`)
    this.#errorWrap = this.#select(`.${this.#fieldKey}-file-input-wrpr .err-wrp`)
    const { multiple,
      allowedFileType,
      accept,
      showSelectStatus,
      fileSelectStatus, oldFiles } = this.#config

    this.#fileUploadInput.multiple = multiple
    /* this.#fileUploadInput.onchange = onchange */
    this.#fileUploadInput.accept = allowedFileType ? `${allowedFileType}, ${accept}` : accept
    if (showSelectStatus && this.#fileSelectStatus) this.#fileSelectStatus.innerHTML = fileSelectStatus
    else this.#fileSelectStatus?.remove()
    this.#files = {}
    this.#removeFilesList()
    if (oldFiles) this.#loadFiles(oldFiles)
    this.#addEvent(this.#fileUploadInput, 'change', e => this.#fileUploadAction(e))
    this.#addEvent(this.#inpBtn, 'click', () => this.#fileUploadInput.click())
  }

  #parseFiles(val) {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch (error) {
        console.error('Invalid JSON string', error)
      }
    }
    if (Array.isArray(val)) {
      return val
    }
    return []
  }

  #loadFiles(val) {
    const files = this.#parseFiles(val)
    this.#oldFiles = files
    if (!this.#filesList) { this.#createFilesList() }
    files.forEach(file => {
      this.#createFileListItem(file)
    })
    const hiddenOldFiles = this.#createElm('input')
    hiddenOldFiles.type = 'hidden'
    hiddenOldFiles.name = this.#getHiddenOldFieldName()
    hiddenOldFiles.value = this.#oldFiles.toString()
    this.#fileInputWrpr.appendChild(hiddenOldFiles)
  }

  #createFileListItem(fileName) {
    const fileWrp = this.#createElm('div')
    const fileId = fileName.replace(/( |\.|\(|\))/g, '')
    fileWrp.id = `file-wrp-${fileId}`
    this.#addClass(fileWrp, 'file-wrpr')
    if ('file-wrpr' in this.#classNames) {
      const fileWrpCls = this.#classNames['file-wrpr']
      if (fileWrpCls) this.#setCustomClass(fileWrp, fileWrpCls)
    }
    if ('file-wrpr' in this.#attributes) {
      const optLblWrp = this.#attributes['file-wrpr']
      this.#setCustomAttr(fileWrp, optLblWrp)
    }

    const fileDetails = this.#createElm('div')
    this.#addClass(fileDetails, 'file-details')

    const fileTitle = this.#createElm('a')
    this.#addClass(fileTitle, 'file-title')
    if ('file-title' in this.#classNames) {
      const fileTitleCls = this.#classNames['file-title']
      if (fileTitleCls) this.#setCustomClass(fileTitle, fileTitleCls)
    }
    if ('file-title' in this.#config.attributes) {
      const fileTitleAttr = this.#config.attributes['file-title']
      this.#setCustomAttr(fileTitle, fileTitleAttr)
    }
    this.#setAttribute(fileTitle, 'target', '_blank')
    this.#setAttribute(fileTitle, 'href', `${this.#config.baseDLURL}&fileID=${fileName}`)
    this.#setTextContent(fileTitle, fileName)

    fileDetails.append(fileTitle)

    fileWrp.append(fileDetails)

    const crossBtn = this.#createElm('button')
    this.#addClass(crossBtn, 'cross-btn')
    if ('cross-btn' in this.#classNames) {
      const crossBtnCls = this.#classNames['cross-btn']
      if (crossBtnCls) this.#setCustomClass(crossBtn, crossBtnCls)
    }
    this.#setAttribute(crossBtn, 'data-file-id', fileId)
    this.#setAttribute(crossBtn, 'data-file-name', fileName)
    this.#setAttribute(crossBtn, 'type', 'button')
    if ('cross-btn' in this.#config.attributes) {
      const crossBtnAttr = this.#config.attributes['cross-btn']
      this.#setCustomAttr(crossBtn, crossBtnAttr)
    }
    this.#setTextContent(crossBtn, '×')
    this.#addEvent(crossBtn, 'click', e => this.#removeOldFiles(e))
    fileWrp.append(crossBtn)
    this.#filesList.appendChild(fileWrp)
  }

  #fileUploadAction(e) {
    const { files } = this.#fileUploadInput

    const {
      sizeUnit,
      allowMaxSize,
      maxSize,
      maxSizeErrMsg,
      isItTotalMax,
      multiple,
      showFileList,
      fileExistMsg,
      showFilePreview,
      showFileSize,
      showSelectStatus,
      fileSelectStatus,
      minFile,
      minFileErrMsg,
      maxFile,
      maxFileErrMsg,
    } = this.#config

    const maxFileSize = this.#maxFileSize(sizeUnit, maxSize)

    let totalFileSize = 0
    const error = []
    this.#removeClass(this.#errorWrap, 'active')

    if (isItTotalMax) {
      Object.values(this.#files).forEach(file => {
        totalFileSize += file.size
      })
    }
    if (!multiple && files.length > 0) {
      this.#files = {}
      if (this.#filesList) this.#setTextContent(this.#filesList, '')
    }

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]
      const fileName = file.name.replace(/( |\.|\(|\))/g, '')
      if (!this.#files[fileName]) {
        if (!allowMaxSize || (!maxSize || (file.size + totalFileSize) <= maxFileSize)) {
          if (!(maxFile > 0) || (Object.keys(this.#files).length < maxFile)) {
            this.#files[fileName] = file
            if (showFileList) {
              if (!this.#filesList) { this.#createFilesList() }

              const fileWrp = this.#createElm('div')
              fileWrp.id = `file-wrp-${fileName}`
              this.#addClass(fileWrp, 'file-wrpr')
              if ('file-wrpr' in this.#classNames) {
                const fileWrpCls = this.#classNames['file-wrpr']
                if (fileWrpCls) this.#setCustomClass(fileWrp, fileWrpCls)
              }
              if ('file-wrpr' in this.#attributes) {
                const optLblWrp = this.#attributes['file-wrpr']
                this.#setCustomAttr(fileWrp, optLblWrp)
              }

              if (showFilePreview) {
                const filePreview = this.#createElm('img')
                filePreview.src = this.#getPreviewUrl(file)
                filePreview.alt = 'Image Uploaded'
                this.#addClass(filePreview, 'file-preview')
                if ('file-preview' in this.#classNames) {
                  const prevCls = this.#classNames['file-preview']
                  if (prevCls) this.#setCustomClass(filePreview, prevCls)
                }
                if ('file-preview' in this.#attributes) {
                  const prevAttr = this.#attributes['file-preview']
                  this.#setCustomAttr(filePreview, prevAttr)
                }

                fileWrp.append(filePreview)
              }

              const fileDetails = this.#createElm('div')
              this.#addClass(fileDetails, 'file-details')

              const fileTitle = this.#createElm('span')
              this.#addClass(fileTitle, 'file-title')
              if ('file-title' in this.#classNames) {
                const fileTitleCls = this.#classNames['file-title']
                if (fileTitleCls) this.#setCustomClass(fileTitle, fileTitleCls)
              }
              if ('file-title' in this.#config.attributes) {
                const fileTitleAttr = this.#config.attributes['file-title']
                this.#setCustomAttr(fileTitle, fileTitleAttr)
              }
              this.#setTextContent(fileTitle, file.name)

              fileDetails.append(fileTitle)

              if (showFileSize) {
                const fileSize = this.#createElm('span')
                this.#addClass(fileSize, 'file-size')
                if ('file-size' in this.#classNames) {
                  const fileSizeCls = this.#classNames['file-size']
                  if (fileSizeCls) this.#setCustomClass(fileSize, fileSizeCls)
                }
                if ('file-size' in this.#config.attributes) {
                  const fileSizeAttr = this.#config.attributes['file-size']
                  this.#setCustomAttr(fileSize, fileSizeAttr)
                }
                this.#setTextContent(fileSize, this.#returnFileSize(file.size))
                fileDetails.append(fileSize)
              }
              fileWrp.append(fileDetails)

              const crossBtn = this.#createElm('button')
              this.#addClass(crossBtn, 'cross-btn')
              if ('cross-btn' in this.#classNames) {
                const crossBtnCls = this.#classNames['cross-btn']
                if (crossBtnCls) this.#setCustomClass(crossBtn, crossBtnCls)
              }
              this.#setAttribute(crossBtn, 'data-file-id', fileName)
              if ('cross-btn' in this.#config.attributes) {
                const crossBtnAttr = this.#config.attributes['cross-btn']
                this.#setCustomAttr(crossBtn, crossBtnAttr)
              }
              this.#setTextContent(crossBtn, '×')
              fileWrp.append(crossBtn)

              this.#filesList.append(fileWrp)
            }
            if (isItTotalMax) totalFileSize += file.size
          } else {
            this.#errorWrap.innerHTML = maxFileErrMsg
            this.#addClass(this.#errorWrap, 'active')
            setTimeout(() => {
              this.#removeClass(this.#errorWrap, 'active')
            }, 3000)
          }
        } else {
          error.push(maxSizeErrMsg)
        }
      } else {
        error.push(fileExistMsg)
      }
    }
    /* this.#window.document.querySelectorAll() */
    this.#selectAll(`.${this.#fieldKey}-file-input-wrpr .cross-btn`).forEach(element => {
      this.#addEvent(element, 'click', ev => this.#removeAction(ev))
    })

    const fileLength = Object.keys(this.#files).length

    this.#filesIntializeToInput()

    if (fileLength && showSelectStatus) {
      this.#fileSelectStatus.innerText = `${fileLength} file${fileLength > 1 ? 's' : ''} selected`
    } else if (showSelectStatus) {
      this.#fileSelectStatus.innerHTML = fileSelectStatus
    }

    if (minFile > 0 && fileLength < minFile) {
      this.#errorWrap.innerHTML = minFileErrMsg
      this.#addClass(this.#errorWrap, 'active')
    }
    if (!this.#filesList && error.length > 0) { this.#createFilesList() }
    error.map((err, errId) => {
      this.#filesList.insertAdjacentHTML('afterbegin', `
      <div id='err-${errId}' class="err-wrp">
          ${err}
      </div>`)
      const errorElemnt = this.#select(`#err-${errId}`)
      this.#addClass(errorElemnt, 'active')

      setTimeout(() => {
        this.#removeClass(errorElemnt, 'active')
      }, 3000)
      setTimeout(() => {
        errorElemnt?.remove()
        if (!Object.keys(this.#files).length) this.#removeFilesList()
      }, 5000)
    })
  }

  #createFilesList() {
    this.#filesList = this.#createElm('div')
    this.#addClass(this.#filesList, 'files-list')
    if ('files-list' in this.#classNames) {
      const fileListCls = this.#classNames['files-list']
      if (fileListCls) this.#setCustomClass(this.#filesList, fileListCls)
    }
    if ('files-list' in this.#attributes) {
      const fileListWrp = this.#attributes['files-list']
      this.#setCustomAttr(this.#filesList, fileListWrp)
    }
    this.#fileInputWrpr.append(this.#filesList)
  }

  #removeFilesList() {
    this.#filesList?.remove()
    this.#filesList = null
  }

  #filesIntializeToInput() {
    const dataTransfer = new DataTransfer()
    Object.values(this.#files)?.forEach(file => {
      dataTransfer.items.add(file)
    })
    this.#fileUploadInput.files = dataTransfer.files
  }

  #removeOldFiles(e) {
    const fileId = e.target.getAttribute('data-file-id')
    const fileName = e.target.getAttribute('data-file-name')
    this.#remove(`#file-wrp-${fileId}`)
    this.#oldFiles = this.#oldFiles.filter(file => file !== fileName)
    this.#select(`input[name="${this.#getHiddenOldFieldName()}"]`).value = this.#oldFiles.toString()
  }

  #removeAction = e => {
    const id = e.target.getAttribute('data-file-id')
    this.#remove(`#file-wrp-${id}`)

    delete this.#files[id]
    const fileLength = Object.keys(this.#files).length
    if (fileLength) {
      this.#fileSelectStatus.innerText = `${fileLength} file${fileLength > 1 ? 's' : ''} selected`
    } else {
      this.#fileSelectStatus.innerHTML = this.#config.fileSelectStatus
      this.#removeFilesList()
    }
    this.#filesIntializeToInput()
  }

  #select(selector) { return this.#fileUploadWrap.querySelector(selector) }

  #selectAll(selector) { return this.#fileUploadWrap.querySelectorAll(selector) }

  #remove(selector) { this.#select(selector)?.remove() }

  #createElm(elm) {
    return this.#document.createElement(elm)
  }

  #getPreviewUrl(file) {
    const extention = file.name.substring(file.name.lastIndexOf('.') + 1)
    switch (extention) {
      case 'xbm':
      case 'tif':
      case 'pjp':
      case 'pjpeg':
      case 'svgz':
      case 'jpg':
      case 'jpeg':
      case 'ico':
      case 'tiff':
      case 'gif':
      case 'svg':
      case 'bmp':
      case 'png':
      case 'jfif':
      case 'webp':
        return URL.createObjectURL(file)
      case '7z':
      case 'arj':
      case 'deb':
      case 'pkg':
      case 'rar':
      case '.rpm':
      case '.gz':
      case 'z':
      case 'zip':
        return `${this.#assetsURL}/zip-compressed.svg`
      case 'key':
      case 'odp':
      case 'pps':
      case 'ppt':
      case 'pptx':
        return `${this.#assetsURL}/presentation.svg`
      case '_RF_':
      case 'doc':
      case 'docx':
      case 'odt':
      case 'pdf':
      case 'rtf':
      case 'tex':
      case 'txt':
      case 'wks':
      case 'wps':
      case 'wpd':
        return `${this.#assetsURL}/document.svg`
      case 'csv':
      case 'dat':
      case 'db':
      case 'dbf':
      case 'log':
      case 'mdb':
      case 'sav':
      case 'sql':
      case 'tar':
      case 'sqlite':
      case 'xml':
        return `${this.#assetsURL}/database.svg`
      case 'opus':
      case 'flac':
      case 'webm':
      case 'weba':
      case 'wav':
      case 'ogg':
      case 'm4a':
      case 'mp3':
      case 'oga':
      case 'mid':
      case 'amr':
      case 'aiff':
      case 'wma':
      case 'au':
      case 'acc':
      case 'wpl':
        return `${this.#assetsURL}/file-audio.svg`
      case 'ogm':
      case 'wmv':
      case 'mpg':
      case 'ogv':
      case 'mov':
      case 'asx':
      case 'mpeg':
      case 'mp4':
      case 'm4v':
      case 'avi':
      case '3gp':
      case 'flv':
      case 'mkv':
      case 'swf':
        return `${this.#assetsURL}/file-audio.svg`
      default:
        return `${this.#assetsURL}/paperclip.svg`
    }
  }

  #addEvent(element, eventType, eventAction) {
    element.addEventListener(eventType, eventAction)
    this.#allEventListeners.push({ element, eventType, eventAction })
  }

  #addClass(element, className) {
    element.classList.add(className)
  }

  #removeClass(element, className) {
    element.classList.remove(className)
  }

  #setTextContent(elm, txt) {
    elm.textContent = txt
  }

  #setAttribute(elm, name, value) {
    elm?.setAttribute?.(name, value)
  }

  #setCustomClass(element, classes) {
    classes.trim().split(/\b\s+\b/g).forEach(cls => this.#addClass(element, cls))
  }

  #setCustomAttr(element, objArr) {
    const optLen = objArr.length
    if (optLen) {
      for (let i = 0; i < optLen; i += 1) {
        this.#setAttribute(element, objArr[i].key, objArr[i].value)
      }
    }
  }

  #returnFileSize(number) {
    if (number < 1024) {
      return `${number}Bytes`
    } if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)}KB`
    } if (number >= 1048576 && number < 1073741824) {
      return `${(number / 1048576).toFixed(1)}MB`
    } if (number >= 1073741824) {
      return `${(number / 1073741824).toFixed(1)}GB`
    }
  }

  #maxFileSize(sizeUnit, maxSize) {
    switch (sizeUnit) {
      case 'Bytes': return maxSize
      case 'KB': return maxSize * 1024
      case 'MB': return maxSize * 1048576
      case 'GB': return maxSize * 1073741824
      default: return 0
    }
  }

  #detachAllEvents() {
    this.#allEventListeners.forEach(({ element, eventType, eventAction }) => {
      element.removeEventListener(eventType, eventAction)
    })
  }

  #getHiddenOldFieldName() {
    if (typeof checkRepeatedField !== 'undefined' && checkRepeatedField(this.#fieldKey, this.#window?.bf_globals?.[this.#contentId])) {
      return `${this.#fieldKey}_old[]`
    }
    return `${this.#fieldKey}_old`
  }

  checkValidate() {
    // Implement validation logic here
    if (this.#oldFiles.length === 0 && Object.keys(this.#files).length === 0) {
      return 'req'
    }
    return ''
  }

  set value(newValue) {
    this.#loadFiles(newValue)
  }

  get value() {
    return this.#files
  }

  destroy() {
    if (this.#filesList) this.#filesList.innerHTML = ''
    this.#detachAllEvents()
  }

  reset() {
    this.destroy()
    this.init()
  }
}
