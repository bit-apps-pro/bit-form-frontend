import bitsFetchFront from './bitsFetchFront'

export default class BitTableView {
  #config = {}

  #document = null

  #window = null

  #selector = null

  #table = null

  #tableBody = null

  #paginationBtns = null

  #tableWrp = null

  #allEventListeners = []

  #currentPage = 0

  #totalPages = 10

  #totalRecords = null

  #pageSizeSelector = null

  #pageSize = 10

  #start = 1

  #end = null

  #formId = null

  #tableId = null

  #tableConfig = {}

  #columnsMap = []

  #actionsBtn = {}

  #entries = null

  #searchInputSelector = null

  #currentPageSelector = null

  #totalPagesSelector = null

  #userInfo = {}

  #accessControl = {}
  // select * from wp_bitforms_form_entries limit 5 offset 10

  #formFields = []

  #uploadUrl = null

  #resourcePath = null

  constructor(selector, config) {
    Object.assign(this.#config, config)
    this.#document = config?.document || document
    this.#window = config?.window || window
    this.#formId = config.formId
    this.#tableId = config.viewId
    this.#tableConfig = config.tableConfig
    this.#columnsMap = config.tableConfig.columnsMap
    this.#actionsBtn = config.tableConfig.actionsBtn
    this.#totalRecords = config.totalRecords
    this.#accessControl = config.accessControl
    this.#formFields = config?.formFields

    if (typeof selector === 'string') {
      this.#tableWrp = this.#document.querySelector(selector)
    } else {
      this.#tableWrp = selector
    }

    this.#entries = this.#window.bf_view_globals.entries
    this.#userInfo = this.#window.bf_view_globals.userInfo
    this.#uploadUrl = this.#window.bf_view_globals.uploadUrl
    this.init()
  }

  init() {
    this.#selectors()
    this.#handlePaginationButtons()
    this.#parPageHandler()
    this.#handleSearchInput()
    this.#totalPages = Math.ceil(this.#totalRecords / this.#pageSize)
    this.#totalPagesSelector.innerHTML = this.#totalPages
    this.#enableOrDisablePaginationBtns()
  }

  #enableOrDisablePaginationBtns() {
    this.#paginationBtns[0].disabled = this.#currentPage === 0
    this.#paginationBtns[1].disabled = this.#currentPage === 0
    this.#paginationBtns[2].disabled = this.#currentPage === this.#totalPages - 1
    this.#paginationBtns[3].disabled = this.#currentPage === this.#totalPages - 1
  }

  // all selectors
  #selectors() {
    this.#paginationBtns = this.#tableWrp.querySelectorAll(`.bf${this.#formId}-${this.#tableId}-pgn-btn`)
    this.#pageSizeSelector = this.#select(`.bf${this.#formId}-${this.#tableId}-tbl-pgn-slt`)
    this.#tableBody = this.#select(`.bf${this.#formId}-${this.#tableId}-tbody`)
    this.#searchInputSelector = this.#select(`.bf${this.#formId}-${this.#tableId}-serc-bx`)

    this.#currentPageSelector = this.#select(`.bf${this.#formId}-${this.#tableId}-curr-page`)
    this.#totalPagesSelector = this.#select(`.bf${this.#formId}-${this.#tableId}-total-page`)
  }

  clear() {
    this.#tableWrp.innerHTML = ''
    this.#detachAllEvents()
  }

  #detachAllEvents() {
    this.#allEventListeners.forEach(({ selector, eventType, cb }) => {
      selector.removeEventListener(eventType, cb)
    })
  }

  #addEvent(selector, eventType, cb) {
    selector.addEventListener(eventType, cb)
    this.#allEventListeners.push({ selector, eventType, cb })
  }

  #select(selector) { return this.#tableWrp.querySelector(selector) }

  // handle par page
  #parPageHandler() {
    this.#addEvent(this.#pageSizeSelector, 'change', (e) => {
      e.preventDefault()
      const pageSizeSelector = e.target.value
      this.#pageSize = parseInt(pageSizeSelector, 10)
      this.#totalPages = Math.ceil(this.#totalRecords / this.#pageSize)
      this.#totalPagesSelector.innerHTML = this.#totalPages
      this.#enableOrDisablePaginationBtns()
      this.#currentPageSelector.innerHTML = 1
      this.#renderTableWithPaginatData()
    })
  }

  // handle pagination buttons events
  #handlePaginationButtons() {
    this.#paginationBtns.forEach((btn) => {
      this.#addEvent(btn, 'click', (e) => {
        e.preventDefault()
        const btnData = e.target.dataset.page
        // http://bitpress.local/table-form/?bf_entry_id=${_bf_entry_id}

        switch (btnData) {
          case 'start':
            this.#currentPage = 0
            break

          case 'end':
            this.#currentPage = this.#totalPages - 1
            break

          case 'previous':
            if (this.#currentPage >= 1) this.#currentPage -= 1
            break

          case 'next':
            if (this.#currentPage < this.#totalPages) this.#currentPage += 1
            break

          default:
            console.log('value not found')
            break
        }

        this.#enableOrDisablePaginationBtns()

        this.#currentPageSelector.innerHTML = this.#currentPage + 1
        this.#renderTableWithPaginatData()
      })
    })
  }

  // debounce function
  debounce(func, wait, immediate) {
    let timeout
    return function () {
      const context = this
      const args = arguments
      const later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }

  // handle search input
  #handleSearchInput() {
    this.#addEvent(
      this.#searchInputSelector,
      'keyup',
      this.debounce((e) => {
        let entries
        if (e.target.value) {
          entries = this.#searchInObjects(e.target.value)
        } else {
          entries = this.#entries
        }
        this.#renderTable(entries)
      }, 500),
    )
  }

  #searchInObjects(searchValue) {
    const value = searchValue.toLowerCase()

    // Regular expression for matching keys
    // const keyRegex = /\$\{b\d+-\d+\}( \$\{b\d+-\d+\})?/
    // keyRegex.test(key)

    // Result array
    const result = {}

    // Iterate over each object
    Object.keys(this.#entries).forEach(entry => {
      const obj = this.#entries[entry]
      for (const key in obj) {
        const isMatch = obj[key].toLowerCase().includes(value)
        if (isMatch) {
          result[entry] = obj
        }
      }
    })

    return result
  }

  #actionHandlerShowOrNotForAll() {
    const { entryEditAccess, entryViewAccess } = this.#accessControl
    // const { roles } = this.#userInfo
    // if (accessFor === 'all' && all.entryEdit.includes(roles[0])) {
    //   return true
    // }
    return true
  }

  #actionHandlerShowOrNotForUserIds() {
    const { entryEditAccess, entryViewAccess } = this.#accessControl
    // const { id } = this.#userInfo
    // if (accessFor === 'user' && user.ids.includes(id)) {
    //   return true
    // }
    return true
  }

  #actionBtnMarkup(entryId) {
    const td = this.#createElm('td')
    const div = this.#createElm('div')
    const editBtn = this.#actionsBtn.editButton
    const viewBtn = this.#actionsBtn.viewButton

    const { entryEditAccess, entryViewAccess } = this.#accessControl
    const { roles } = this.#userInfo

    this.#addClassName(div, `bf${this.#formId}-${this.#tableId}-tbl-action-btns`)
    if (editBtn.show
      && entryEditAccess?.allowEntriesEdit
    ) {
      const a = this.#createElm('a')
      a.innerHTML = editBtn.btnTxt
      this.#addClassName(a, `bf${this.#formId}-${this.#tableId}-tbl-edit-btn`)
      a.href = `${editBtn.slug}?bf_entry_id=${entryId}`
      this.#appendChildElm(div, a)
    }
    if (viewBtn.show) {
      const a = this.#createElm('a')
      a.innerHTML = viewBtn.btnTxt
      this.#addClassName(a, `bf${this.#formId}-${this.#tableId}-tbl-view-btn`)
      a.href = `${viewBtn.slug}?bf_entry_id=${entryId}`
      this.#appendChildElm(div, a)
    }
    this.#appendChildElm(td, div)
    return td
  }

  // rander table
  #renderTableWithPaginatData() {
    let offset = 0
    if (this.#currentPage !== 0) {
      offset = this.#currentPage * this.#pageSize
    }

    const data = {
      formId: this.#formId,
      tableId: this.#tableId,
      offset,
      pageSize: this.#pageSize,
    }
    bitsFetchFront(data, 'bitforms_get_entries')
      .then(response => {
        const { data: entries } = response
        const objKeysSorted = Object.keys(entries).sort((a, b) => b - a)
        const sortedEntries = {}
        objKeysSorted.forEach((key) => {
          sortedEntries[key] = entries[key]
        })
        this.#entries = sortedEntries
        this.#renderTable(this.#entries)
      })
  }

  #getFileType($extension) {
    switch ($extension.toLowerCase()) {
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
        return 'image'

      case '7z':
      case 'arj':
      case 'deb':
      case 'pkg':
      case 'rar':
      case 'rpm':
      case 'gz':
      case 'z':
      case 'zip':
        return 'compressed'

      case 'key':
      case 'odp':
      case 'pps':
      case 'ppt':
      case 'pptx':
        return 'presentation'

      case '_rf_':
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
        return 'document'

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
        return 'data'

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
        return 'audio'

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
        return 'video'
      default:
        return 'other'
    }
  }

  /**
 *
 * @param string src
 * @param string alt
 * @param int entryId
 * @param string|int w
 * @param string|int h
 * @returns {HTMLImageElement}
 */
  #imgMarkup(src, alt, w, h) {
    const resourcePath = this.#resourcePath || this.#uploadUrl
    const imgSrc = `${resourcePath}${src}`
    const img = this.#createElm('img')
    img.src = src ? imgSrc : ''
    img.alt = alt || ''
    img.style.display = 'block'
    if (w !== undefined) {
      img.style.width = w
    } else {
      img.width = 250
    }
    if (h !== undefined) {
      img.style.height = h
    }
    return img
  }

  /**
 *
 * @param string fileName
 * @param int entryId
 * @param string|int w
 * @param string|int h
 * @returns {HTMLImageElement}
 */
  #anchorMarkup(fileName, w, h) {
    const resourcePath = this.#resourcePath || this.#uploadUrl
    const fileSrc = `${resourcePath}${fileName}`
    const anchor = this.#createElm('a')
    anchor.href = fileSrc
    anchor.setAttribute('target', '_blank')
    anchor.setAttribute('rel', 'noopener noreferrer')
    anchor.textContent = fileName
    anchor.style.color = 'blue'
    anchor.style.display = 'block'

    if (w !== undefined) {
      anchor.style.width = w
    }
    if (h !== undefined) {
      anchor.style.height = h
    }

    return anchor
  }

  #unorderedAnchorListMarkup(list) {
    const ul = this.#createElm('ul')
    ul.style.listStyleType = 'none'
    ul.style.padding = 0
    ul.style.margin = 0

    list.forEach(el => {
      const li = this.#createElm('li')
      const a = this.#anchorMarkup(el)
      this.#appendChildElm(li, a)
      this.#appendChildElm(ul, li)
    })

    return ul
  }

  #repeaterMarkup(value, entries, entry) {
    const table = this.#createElm('table')
    table.style.width = '100%'

    if (this.#isValidJSON(value)) {
      const newValue = JSON.parse(value)
      const headerTr = this.#createElm('tr')

      // repeater table column header
      Object.keys(newValue[0]).forEach((key) => {
        const field = this.#formFields[key]
        const header = field?.lbl || field?.fieldName || field?.typ || key

        const th = this.#createElm('th')
        th.style.textAlign = 'left'
        th.textContent = header
        this.#appendChildElm(headerTr, th)
      })
      this.#appendChildElm(table, headerTr)

      newValue.forEach((repeaterValue) => {
        const tr = this.#createElm('tr')
        let td
        // repeater value here is an object
        Object.keys(repeaterValue).forEach((key) => {
          td = this.#createElm('td')
          td.style.whiteSpace = 'nowrap'
          if (this.#isFileFldType(key)) {
            const fileMarkup = this.#fileMarkup(repeaterValue[key], entries, entry)
            this.#appendChildElm(td, fileMarkup)
          } else if (Array.isArray(repeaterValue[key])) {
            // might get past the file field type check if the field inside repeater gets deleted.

            repeaterValue[key].forEach((val, idx, arr) => {
              if (this.#isFileTypeValue(val)) {
                if (this.#isImgFileType(val)) {
                  const imgMarkup = this.#imgMarkup(val, val)
                  this.#appendChildElm(td, imgMarkup)
                } else {
                  const anchorMarkup = this.#anchorMarkup(val, '100%')
                  this.#appendChildElm(td, anchorMarkup)
                }
              } else {
                const span = this.#createElm('span')
                span.textContent = idx === arr.length - 1 ? val : `${val}, `
                this.#appendChildElm(td, span)
              }
            })
          } else {
            const span = this.#createElm('span')
            span.textContent = repeaterValue[key]
            this.#appendChildElm(td, span)
          }
          this.#appendChildElm(tr, td)
        })
        this.#appendChildElm(table, tr)
      })
      return table
    }
    return table
  }

  #fileMarkup(files, entries, entry) {
    this.#resourcePath = entries[entry]?.resourcePath
    const parseSrc = this.#isValidJSON(files) ? JSON.parse(files) : files

    if (Array.isArray(parseSrc)) {
      // const div = this.#createElm('div')
      // const frag = this.#document.createDocumentFragment()
      // parseSrc.forEach((file) => {
      //   let fileMarkup
      //   if (this.#isImgFileType(file)) {
      //     fileMarkup = this.#imgMarkup(file, file)
      //   } else {
      //     fileMarkup = this.#anchorMarkup(file, entry, '100%')
      //   }

      //   this.#appendChildElm(frag, fileMarkup)
      // })
      // return frag
      return this.#unorderedAnchorListMarkup(parseSrc)
    }
    let img

    if (!this.#isFileTypeValue(files)) {
      img = files
      return img
    }
    if (files === 'signature-failed.png') {
      img = this.#imgMarkup('', '')
    } else {
      img = this.#imgMarkup(files, files)
    }

    return img
  }

  /**
 *
 * @param string fileName
 * @returns string
 */
  #getFileExtension(fileName) {
    const lastIndexOfDot = fileName.lastIndexOf('.')
    const extension = fileName.substring(lastIndexOfDot + 1)
    return extension
  }

  #isFileTypeValue(fileName) {
    const extension = this.#getFileExtension(fileName)
    return this.#getFileType(extension) !== 'other'
  }

  /**
 *
 * @param string fileName
 * @returns boolean
 */
  #isImgFileType(fileName) {
    const extension = this.#getFileExtension(fileName)
    return this.#getFileType(extension) === 'image'
  }

  /**
 *
 * @param int fk
 * @param string checkType
 *
 * @return string fieldKey
 */
  #isFileFldType(fk) {
    const imgType = ['advanced-file-up', 'signature', 'file-up']
    if (fk in this.#formFields) {
      return imgType.includes(this.#formFields[fk].typ)
    }
    return false
  }

  #isRepeaterFldType(fk) {
    if (fk in this.#formFields) {
      return this.#formFields[fk].typ === 'repeater'
    }
    return false
  }

  #createResourceUrl(resourcePath, filename) {
    resourcePath = resourcePath.replace(/\/+$/, '')
    filename = filename.replace(/^\/+/, '')

    return `${resourcePath}/${filename}`
  }

  #restructureRepeaterData(entryData) {
    const result = { ...entryData }
    // loop thru all entries
    Object.keys(result).forEach(entryId => {
      // loop thru single entry
      Object.entries(result[entryId]).forEach(([key, value]) => {
        const newValue = this.#isValidJSON(value) ? JSON.parse(value) : value
        const cleanedKey = key.replace(/\${([a-zA-Z0-9]+-\d+)}/g, '$1')

        if (this.#isRepeaterFldType(cleanedKey)) {
          // newValue is a repeater entry array. each rptr might hold multiple array of entries
          newValue.forEach(rptrEntry => {
            // loop thru individual rptr entry object
            Object.entries(rptrEntry).forEach(([k, val]) => {
              const { resourcePath } = result[entryId]
              // key is the rptr input fld key, value is the input value

              if (this.#isFileFldType(k)) {
                if (Array.isArray(val)) {
                  const htmlTagged = val.map(v => {
                    const fullUrl = this.#createResourceUrl(resourcePath, v)

                    if (this.#isFileTypeValue(v)) {
                      if (this.#isImgFileType(v)) {
                        return `<img src=${fullUrl} alt=${v} width='250'/>`
                      }
                      return `<a href=${fullUrl} rel='noopener noreferrer' target='_blank' style='color:blue'>${v}</a>`
                    }
                    return v
                  })
                  const newV = `[${htmlTagged.join(', ')}]`
                  result[entryId][`\${${k}}`] = result[entryId][`\${${k}}`] ? (`${result[entryId][`\${${k}}`]}, ${newV}`) : newV
                } else if (this.#isFileTypeValue(val)) {
                  const fullUrl = this.#createResourceUrl(resourcePath, val)

                  if (this.#isImgFileType(val) && val !== 'signature-failed.png') {
                    const imgTag = `<img src=${fullUrl} alt=${val} width='250'/>`
                    result[entryId][`\${${k}}`] = result[entryId][`\${${k}}`] ? `${result[entryId][`\${${k}}`]}, ${imgTag}` : imgTag
                  } else {
                    const aTag = `<a href=${fullUrl} rel='noopener noreferrer' target='_blank' style='color:blue'>${val}</a>`
                    result[entryId][`\${${k}}`] = result[entryId][`\${${k}}`] ? `${result[entryId][`\${${k}}`]}, ${aTag}` : aTag
                  }
                } else {
                  result[entryId][`\${${k}}`] = result[entryId][`\${${k}}`] ? `${result[entryId][`\${${k}}`]}, ${val}` : val
                }
              } else {
                result[entryId][`\${${k}}`] = result[entryId][`\${${k}}`] ? `${result[entryId][`\${${k}}`]}, ${val}` : val
              }
            })
          })
        }
      })
    })

    return result
  }

  #renderTable(entries) {
    this.#tableBody.innerHTML = ''
    const { head } = this.#tableConfig.actionsBtn
    this.#restructureRepeaterData(entries)

    Object.keys(entries).forEach((entry) => {
      const tr = this.#createElm('tr')
      this.#columnsMap.forEach((column) => {
        const td = this.#createElm('td')
        const fk = column.fk.replace(/\${([a-zA-Z0-9]+-\d+)}/g, '$1')
        const value = entries[entry][column.fk]

        if (this.#isFileFldType(fk)) {
          const fileMarkup = this.#fileMarkup(value, entries, entry)
          if (fileMarkup instanceof Node) {
            this.#appendChildElm(td, fileMarkup)
          } else {
            td.innerHTML += fileMarkup
          }
        } else if (this.#isRepeaterFldType(fk)) {
          const repeaterMarkup = this.#repeaterMarkup(value, entries, entry)

          this.#appendChildElm(td, repeaterMarkup)
        } else if (this.#isValidJSON(value)) {
          const parsedValue = JSON.parse(value)
          if (Array.isArray(parsedValue)) {
            td.textContent = parsedValue.join(', ')
          }
        } else {
          td.textContent = value
        }
        this.#appendChildElm(tr, td)
      })

      if (head?.show && (this.#actionHandlerShowOrNotForAll() || this.#actionHandlerShowOrNotForUserIds())) {
        const actionsBtnMarkup = this.#actionBtnMarkup(entry)
        this.#appendChildElm(tr, actionsBtnMarkup)
      }
      this.#appendChildElm(this.#tableBody, tr)
    })
  }

  #isValidJSON(dataString) {
    try {
      JSON.parse(dataString)
    } catch (e) {
      return false
    }
    return true
  }

  #createElm(elm) {
    return this.#document.createElement(elm)
  }

  #createTextNode(text) {
    return this.#document.createTextNode(text)
  }

  #addClassName(elm, cn) {
    elm.classList.add(cn)
  }

  #appendChildElm(parent, child) {
    parent.appendChild(child)
  }
}
