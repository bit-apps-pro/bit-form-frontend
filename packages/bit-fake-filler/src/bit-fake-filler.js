/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
export default class FakeFormFiller {
  #form = null

  #contentId = null

  #props = null

  #rowIndex = ''

  #rowIndexClass = ''

  #fakeData = null

  constructor(form) {
    this.#form = form
    this.#contentId = this.#form.parentElement.id
    this.#props = window.bf_globals?.[this.#contentId]
    const userPreDefinedData = window.bf_dummy_data || {}

    this.#fakeData = {
      text: ['John Doe', 'Jane Smith', 'Alice Johnson', 'Michael Brown', 'Emily Davis'],
      email: ['test@example.com', 'user@demo.com', 'hello@site.org', 'preview@web.com', 'fake@data.dev', 'sample@mailinator.com', 'noreply@example.org'],
      url: ['https://example.com', 'https://demo.site', 'https://test.io', 'https://preview.app', 'https://myblog.dev', 'https://fakewebsite.net', 'https://placeholder.co'],
      phone: ['+1 201-555-0123', '+8801712345678', '+44 7400 123456', '+91-98765-43210', '+61 412 345 678', '+49 170 1234567', '+81 90 1234 5678'],
      number: [123, 456, 789, 1011, 1213, 1415, 1617],
      textarea: [
        'This is a sample comment.',
        'Testing the form preview fill.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Another fake message here!',
        'How are you today?',
        'Multi-line\ncomment\nexample.',
        'Emoji test 😊👍🚀',
      ],
      password: ['P@ssw0rd!', 'Demo1234', 'Admin!2023', 'Secret_456', 'LetMeIn2024', 'Complex#Pass1', 'Test@2025!'],
      date: ['2023-01-01', '2024-02-15', '2022-12-31', '2025-06-20', '2020-07-07'],
      time: ['08:00', '09:30', '10:15', '12:00', '14:45'],
      color: ['#ff5733', '#33c1ff', '#a1ff33', '#ff33e6', '#3375ff'],
      checkbox: [true, false],
      currency: ['USD 100.00', 'EUR 200.50', 'GBP 300.75', 'JPY 4000.00', 'AUD 500.25'],
      country: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'],
      'datetime-local': ['2024-05-19T08:30', '2025-01-01T12:00', '2023-11-11T17:45', '2024-12-25T00:00', '2025-07-04T14:20'],
      'advanced-datetime': ['2024-05-19T08:30', '2025-01-01T12:00', '2023-11-11T17:45', '2024-12-25T00:00', '2025-07-04T14:20'],
      week: ['2024-W01', '2024-W15', '2023-W52', '2025-W10', '2024-W32'],
      month: ['2024-01', '2023-06', '2025-12', '2024-09', '2023-11'],
      ...userPreDefinedData,
    }
    window.bf_dummy_data = this.#fakeData
  }

  #getRandomValue(typeOrArray) {
    const arrayList = Array.isArray(typeOrArray) ? typeOrArray : this.#fakeData[typeOrArray]
    if (!arrayList) return []
    return arrayList[Math.floor(Math.random() * arrayList.length)]
  }

  fill() {
    const inputs = Array.from(
      this.#form.querySelectorAll('input:not(.d-none):not([type="hidden"]):not([type="search"]), textarea, select'),
    ).filter(el => !el.closest('.fld-hide'))

    const customFieldsHiddenField = this.#form.querySelectorAll('.bf-currency-hidden-input, .bf-country-hidden-input, .bf-phone-hidden-input, .bf-dpd-hidden-input, .bf-signature-hidden-input, .bf-advanced-datetime-hidden-input')
    if (customFieldsHiddenField) {
      inputs.push(...customFieldsHiddenField)
    }
    const radioGroups = {}

    inputs.forEach(input => {
      const { fields } = this.#props
      const { name: fldName } = input
      if (!fldName) return

      // Determine type using centralized override
      const type = this.#getActualFieldType(input)

      const fldKey = this.#getFieldKeyByFldName(this.#generateFieldName(fldName), fields)
      this.#rowIndex = this.#isRepeatedField(fldKey, this.#props) ? getRepeatedIndexes(fldKey, this.#props, input) : ''
      this.#rowIndexClass = (this.#rowIndex && this.#isRepeatedField(fldKey, this.#props)) ? `.rpt-index-${this.#rowIndex}` : ''

      switch (type) {
        case 'text':
        case 'search':
        case 'email':
        case 'url':
        case 'password':
        case 'date':
        case 'time':
        case 'color':
        case 'datetime-local':
        case 'week':
        case 'month':
        case 'textarea':
          this.#fillTextualInput(input, type)
          break
        case 'checkbox':
          this.#fillCheckbox(input, type)
          break
        case 'radio':
          if (!radioGroups[input.name]) {
            radioGroups[input.name] = []
          }
          radioGroups[input.name].push(input)
          break
        case 'select-one':
          this.#fillSelect(input)
          break
        case 'file':
          this.#fillFileUpload(input)
          break
        case 'currency':
        case 'country':
        case 'phone':
        case 'select':
        case 'rating':
        case 'advanced-datetime':
          this.#fillCustomField(fldKey, type, input)
          break
        case 'range':
        case 'number':
          this.#fillNumber(input)
          break
        case 'signature':
          this.#fillSignatureField(fldKey, input)
          break
        default:
          break
      }
    })

    this.#fillRadioGroups(radioGroups)

    this.#rowIndex = ''
    this.#rowIndexClass = ''
  }

  #fillTextualInput(input, type) {
    input.value = this.#getRandomValue(type)
  }

  #fillCheckbox(input, type) {
    input.checked = this.#getRandomValue(type)
    this.#triggerEvent(input, 'input')
  }

  #fillSelect(input) {
    const options = Array.from(input.options).filter((o) => o.value)
    if (options.length) {
      input.value = this.#getRandomValue(options).value
    }
  }

  #fillCustomField(fldKey, type, input) {
    let value = this.#getRandomValue(type)
    if (type === 'select') {
      const items = Array.from(input.parentElement.querySelectorAll('ul.bf-option-list li.option:not(.opt-group-title):not(.disabled-opt)')).map(li => ({
        lbl: li.querySelector('.opt-lbl')?.textContent.trim(),
        val: li.getAttribute('data-value'),
      }))
      value = this.#getRandomValue(items).val
    }
    if (type === 'rating') {
      const allRatingInputs = this.#selectAll(`input[name="${input.name}"]`)
      const ratingValues = Array.from(allRatingInputs).map(tempInput => tempInput.value)
      value = this.#getRandomValue(ratingValues)
    }
    this.#setFieldValue(fldKey, value)
  }

  #fillNumber(input) {
    const min = parseFloat(input.min) || 0
    const max = parseFloat(input.max) || 100
    const step = parseFloat(input.step) || 1
    const stepsCount = Math.floor((max - min) / step)
    input.value = min + step * Math.floor(Math.random() * (stepsCount + 1))
    this.#triggerEvent(input, 'input')
  }

  /**
 * Simulate a file upload on input[type="file"] by creating a dummy file.
 * @param {HTMLInputElement} input
 */
  #fillFileUpload(input) {
    try {
      // Create dummy file content and file object
      const content = new Blob(['Fake file content'], { type: 'text/plain' })
      const file = new File([content], 'dummy.txt', { type: 'text/plain' })

      // Use DataTransfer to set the files property of input
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      input.files = dataTransfer.files

      // Trigger change event to notify listeners
      this.#triggerEvent(input, 'change')
    } catch (err) {
      console.warn('Failed to simulate file upload:', err)
    }
  }

  #fillRadioGroups(radioGroups) {
    Object.entries(radioGroups).forEach(([fldName, radios]) => {
      const fldKey = this.#getFieldKeyByFldName(this.#generateFieldName(fldName), this.#props.fields)
      const randomRadioInput = this.#getRandomValue(radios)
      randomRadioInput.checked = true
      this.#triggerEvent(randomRadioInput, 'input')
      if (randomRadioInput.classList.contains('bf-rating-input')) this.setFieldValue(fldKey, randomRadioInput.value)
    })
  }

  #setFieldValue = (fieldKey, val) => {
    const fldData = this.#props.fields[fieldKey] || {}
    const { fieldName, typ } = fldData

    if (typ === 'rating') {
      const fldKey = this.#getInitPropertyName(fieldKey, this.#props)
      if (this.#props.inits && this.#props.inits[fldKey]) {
        this.#props.inits[fldKey].value = val
      }
      return
    }

    // Change value attribute to execute conditional logic
    const fld = this.#select(`[name^='${fieldName}']`)
    if (fld.value === val) return
    fld.value = val
    fld.setAttribute('value', val)
  }

  #fillSignatureField(fldKey, input) {
    const initFldKey = this.#getInitPropertyName(fldKey, this.#props)
    if (this.#props.inits && this.#props.inits[initFldKey]) {
      const signatureInstance = this.#props.inits[initFldKey]
      if (signatureInstance && typeof signatureInstance.setSignature === 'function') {
        const svgSignature = `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
          <text x="10" y="50" font-family="'Brush Script MT', cursive, 'Segoe Script', 'Lucida Handwriting'"
            font-size="40" font-style="italic" fill="black">
            Bit Form
          </text>
        </svg>
      `
        const base64SVG = `data:image/svg+xml;base64,${btoa(svgSignature)}`
        signatureInstance.setSignature(base64SVG)
      }
    }
  }

  #select = (selector) => this.#form.querySelector(`${this.#rowIndexClass} ${selector}`)

  #selectAll = (selector) => this.#form.querySelectorAll(`${this.#rowIndexClass} ${selector}`)

  #getInitPropertyName = (fldKey, props) => {
    const initFldKey = this.#isRepeatedField(fldKey, props) ? `${fldKey}[${this.#rowIndex}]` : fldKey
    if (props.inits && !props.inits[initFldKey]) return fldKey
    return initFldKey
  }

  #getFieldKeyByFldName = (fldName, fields) => Object.keys(fields).find(key => fields[key].fieldName === fldName)

  #generateFieldName = fldName => fldName.replace(/\[\d*\]/g, '')

  #isRepeatedField = (fieldKey, props) => (typeof checkRepeatedField !== 'undefined' ? checkRepeatedField(fieldKey, props) : false)

  #triggerEvent = (elm, eventType) => {
    if (!elm) return
    const event = new Event(eventType)
    elm.dispatchEvent(event)
  }

  /**
 * Determine the effective input type by checking for custom class names.
 * @param {HTMLInputElement} input
 * @returns {string} - the overridden type or the original input.type
 */
  #getActualFieldType(input) {
    const classTypeMap = {
      'bf-currency-hidden-input': 'currency',
      'bf-country-hidden-input': 'country',
      'bf-phone-hidden-input': 'phone',
      'bf-dpd-hidden-input': 'select',
      'bf-advanced-datetime-hidden-input': 'advanced-datetime',
      'bf-rating-input': 'rating',
      'bf-signature-hidden-input': 'signature',
      // add more custom classes here as needed
    }

    for (const [cls, type] of Object.entries(classTypeMap)) {
      if (input.classList.contains(cls)) {
        return type
      }
    }

    // fallback to original input type or tag name
    return input.type || input.tagName.toLowerCase()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form')
  if (!form) return

  const bfFakeFillerBtn = document.querySelector('.bf-dummy-filler-btn')

  if (bfFakeFillerBtn && bit_fake_filler !== undefined) {
    const fakeFiller = new bit_fake_filler(form)
    bfFakeFillerBtn.addEventListener('click', () => {
      fakeFiller.fill()
    })
  }
})
