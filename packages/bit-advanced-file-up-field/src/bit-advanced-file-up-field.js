/* eslint-disable class-methods-use-this */
export default class BitAdvanceFileUpload {
  #fieldUploadWrapper = null

  #filePondRef = null

  #document = null

  #window = null

  #configSetting = {}

  #fieldKey = null

  #formID = null

  #ajaxURL = null

  #nonce = null

  #uploadFileToServer = null

  #oldFileList = null

  #oldFiles = []

  #contentId = null

  #config = {
    document: {},
    formID: null,
    configSetting: {},
    ajaxURL: null,
    nonce: null,
    uploadFileToServer: null,
  }

  constructor(selector, config) {
    Object.assign(this.#config, config)
    this.#fieldKey = config.fieldKey
    this.#window = config.window ? config.window : window
    this.#document = config.document ? config.document : document
    this.#contentId = config.contentId
    if (typeof selector === 'string') {
      this.#fieldUploadWrapper = this.#document.querySelector(selector)
    } else {
      this.#fieldUploadWrapper = selector
    }
    this.#formID = this.#config.formID
    this.#configSetting = this.#config.configSetting
    this.#ajaxURL = this.#config.ajaxURL
    this.#nonce = this.#window?.bf_globals?.[this.#contentId]?.nonce || this.#config?.nonce
    this.#uploadFileToServer = this.#config.uploadFileToServer
    this.uploaded_files = []
    this.on_select_upload = false

    this.init()
  }

  init() {
    this.files = []
    const plugins = []
    if (this.#configSetting.allowFileSizeValidation) {
      plugins.push(this.#window.bit_filepond_plugin_file_validate_size)
    }
    if (this.#configSetting.allowFileTypeValidation) {
      plugins.push(this.#window.bit_filepond_plugin_file_validate_type)
    }
    if (this.#configSetting.allowImageCrop) {
      plugins.push(this.#window.bit_filepond_plugin_image_crop)
    }
    if (this.#configSetting.allowImagePreview) {
      plugins.push(this.#window.bit_filepond_plugin_image_preview)
    }
    if (this.#configSetting.allowImageResize) {
      plugins.push(this.#window.bit_filepond_plugin_image_resize)
    }
    if (this.#configSetting.allowImageTransform) {
      plugins.push(this.#window.bit_filepond_plugin_image_transform)
    }
    if (this.#configSetting.allowImageValidateSize) {
      plugins.push(this.#window.bit_filepond_plugin_image_validate_size)
    }
    if (this.#configSetting.allowPreview) {
      plugins.push(this.#window.bit_filepond_plugin_media_preview)
    }

    const { create, registerPlugin } = this.#window.bit_filepond

    registerPlugin(...plugins)

    this.#filePondRef = create(this.#configSetting)
    this.#fieldUploadWrapper.appendChild(this.#filePondRef.element)
    setTimeout(() => {
      if (this.#fieldUploadWrapper) {
        this.#fieldUploadWrapper.parentNode.parentNode.querySelector(`.${this.#fieldKey}-lbl`).setAttribute('for', this.#select('input[name="filepond"]')?.id)
      }
    }, 1000)
    if (this.#config.onFileUpdate) {
      this.#filePondRef.on('updatefiles', this.#config.onFileUpdate)
    }

    if (this.#uploadFileToServer) {
      const uri = new URL(this.#ajaxURL)
      this.on_select_upload = this.#configSetting.instantUpload
      uri.searchParams.append('_ajax_nonce', this.#nonce)

      let serverResponse = null

      this.#filePondRef.setOptions({
        server: {
          process: (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort,
          ) => {
            const formData = new FormData()

            if (uri.searchParams.has('action')) {
              uri.searchParams.delete('action')
            }
            uri.searchParams.append('action', 'bitforms_file_upload')

            formData.append(this.#fieldKey, file, file.name)
            formData.append('fieldKey', this.#fieldKey)
            formData.append('formID', this.#formID)
            const request = new XMLHttpRequest()
            request.open('POST', uri.href)
            request.upload.onprogress = (e) => {
              progress(e.lengthComputable, e.loaded, e.total)
            }
            request.onload = () => {
              serverResponse = JSON.parse(request.responseText)
              if (request.status >= 200 && request.status < 300) {
                this.uploaded_files.push(serverResponse?.data?.file_name)
                load(serverResponse?.data?.file_name)
              } else {
                error()
              }
            }

            request.send(formData)
            // Should expose an abort method so the request can be cancelled
            return {
              abort: () => {
                request.abort()
                abort()
              },
            }
          },
          revert: (uniqueFileId, load, error) => {
            const existFileId = this.uploaded_files.find(
              (file) => file === uniqueFileId,
            )

            if (existFileId) {
              const fileIndex = this.uploaded_files.indexOf(uniqueFileId)
              this.uploaded_files.splice(fileIndex, 1)
              if (uri.searchParams.has('action')) {
                uri.searchParams.delete('action')
              }
              uri.searchParams.append('action', 'bitforms_file_delete')
              uri.searchParams.append('file_name', uniqueFileId)
              uri.searchParams.append('formID', this.#formID)

              const xhr = new XMLHttpRequest()
              xhr.open('DELETE', uri.href)
              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  load()
                } else {
                  error()
                }
              }
              xhr.send()
              return {
                abort: () => {
                  xhr.abort()
                },
              }
            }
          },
        },
        labelFileProcessingError: () => serverResponse?.data,
      })

      this.#filePondRef.on('updatefiles', () => {
        this.files = []
        this.files = this.#filePondRef.getFiles()
      })
    }

    if (this.#config.oldFiles) this.#loadFiles(this.#config.oldFiles)
    // this.#filePondRef.destroy(this.#filePondRef.element)
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
    this.#oldFileList = this.#createElm('div')
    this.#addClass(this.#oldFileList, 'old-file-list')

    files.forEach(file => {
      this.#createFileListItem(file)
    })
    const hiddenOldFiles = this.#createElm('input')
    hiddenOldFiles.type = 'hidden'
    hiddenOldFiles.name = `${this.#fieldKey}_old`
    hiddenOldFiles.value = this.#oldFiles.toString()
    this.#fieldUploadWrapper.appendChild(this.#oldFileList)
    this.#fieldUploadWrapper.appendChild(hiddenOldFiles)
  }

  #createFileListItem(fileName) {
    const fileWrp = this.#createElm('div')
    const fileId = fileName.replace(/( |\.|\(|\))/g, '')
    fileWrp.id = `file-wrp-${fileId}`
    this.#addClass(fileWrp, 'file-wrpr')

    const fileDetails = this.#createElm('div')
    this.#addClass(fileDetails, 'file-details')

    const fileTitle = this.#createElm('a')
    this.#addClass(fileTitle, 'file-title')

    this.#setAttribute(fileTitle, 'target', '_blank')
    this.#setAttribute(fileTitle, 'href', `${this.#config.baseDLURL}&fileID=${fileName}`)
    this.#setTextContent(fileTitle, fileName)

    fileDetails.append(fileTitle)

    fileWrp.append(fileDetails)

    const crossBtn = this.#createElm('button')
    this.#addClass(crossBtn, 'cross-btn')

    this.#setAttribute(crossBtn, 'data-file-id', fileId)
    this.#setAttribute(crossBtn, 'data-file-name', fileName)
    this.#setAttribute(crossBtn, 'type', 'button')

    this.#setTextContent(crossBtn, '×')
    this.#addEvent(crossBtn, 'click', e => this.#removeOldFiles(e))
    fileWrp.append(crossBtn)
    this.#oldFileList.appendChild(fileWrp)
  }

  #removeOldFiles(e) {
    const fileId = e.target.getAttribute('data-file-id')
    const fileName = e.target.getAttribute('data-file-name')
    this.#remove(`#file-wrp-${fileId}`)
    this.#oldFiles = this.#oldFiles.filter(file => file !== fileName)
    this.#select(`input[name="${this.#fieldKey}_old"]`).value = this.#oldFiles.toString()
  }

  #remove(selector) { this.#select(selector)?.remove() }

  #createElm(elm) {
    return this.#document.createElement(elm)
  }

  #addEvent(element, eventType, eventAction) {
    element.addEventListener(eventType, eventAction)
    // this.#allEventListeners.push({ element, eventType, eventAction })
  }

  #addClass(element, className) {
    element.classList.add(className)
  }

  #setTextContent(elm, txt) {
    elm.textContent = txt
  }

  #setAttribute(elm, name, value) {
    elm?.setAttribute?.(name, value)
  }

  #select(selector) { return this.#fieldUploadWrapper.querySelector(selector) || console.error('selector not found', selector) }

  checkValidate() {
    // Implement validation logic here
    if (this.#oldFiles.length === 0 && this.files?.length === 0) {
      return 'req'
    }
    return ''
  }

  set value(newValue) {
    this.#loadFiles(newValue)
  }

  get value() {
    return this.#filePondRef.getFiles()
  }

  reset() {
    this.#filePondRef.destroy(this.#filePondRef.element)
    this.#fieldUploadWrapper.innerHTML = ''
    this.init()
  }
}
