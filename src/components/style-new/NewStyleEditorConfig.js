// ============================================
// COMMON PROPERTY OBJECTS (Reusable across multiple configs)
// ============================================

// Border properties - used in almost every component
const borderProps = {
  'border-style': true,
  'border-color': true,
  'border-width': true,
  'border-radius': true,
}

// Background properties - used in many components
const backgroundProps = {
  background: true,
  'background-image': true,
  'background-position': true,
  'background-repeat': true,
  'background-size': true,
}

// Text decoration properties
const textDecorationProps = {
  'text-decoration-line': true,
  'text-decoration-style': true,
  'text-decoration-color': true,
  'text-decoration-thickness': true,
}

// Outline properties
const outlineProps = {
  outline: true,
  'outline-offset': true,
}

// Border image properties (used in divider)
const borderImageProps = {
  'border-image': true,
  'border-image-slice': true,
  'border-image-width': true,
  'border-image-outset': true,
  'border-image-repeat': true,
}

// ============================================
// BASE CSS PROPERTY DEFINITIONS
// ============================================

const labelCssProps = {
  background: backgroundProps,
  border: borderProps,
  color: '',
  'font-size': '',
  'font-weight': '',
  'font-style': '',
  'text-align': '',
  'text-decoration': textDecorationProps,
  'text-shadow': '',
  'box-shadow': '',
  margin: '5px',
  padding: '5px',
  opacity: '100%',
  'line-height': '',
  'word-spacing': '',
  'letter-spacing': '',
  transition: '',
  'white-space': '',
  transform: '',
}

const selectOptionCssProps = {
  'background-color': '',
  color: '',
  'font-size': '',
  'font-weight': '',
  'font-style': '',
  'text-align': '',
}

const iconCssProps = {
  border: borderProps,
  margin: '5px',
  padding: '5px',
  opacity: '100%',
  height: '',
  width: '',
  size: {
    width: '100%',
    height: '100%',
  },
  'box-shadow': '',
  filter: '',
  'backdrop-filter': '',
  transition: '',
  background: backgroundProps,
  'color(filter)': {
    filter: '',
    'icon-color': '',
  },
}

const fieldWrpCssProps = {
  background: backgroundProps,
  'background-color': '',
  border: borderProps,
  margin: '5px',
  padding: '5px',
  opacity: '100%',
  'box-shadow': '0px 5px 15px 2px hsla(0, 0%, 0%, 35%)',
  width: '',
  'max-width': '',
  'min-width': '',
  height: '',
  'min-height': '',
  'max-height': '',
  'text-align': '',
  transform: '',
  transition: '',
}

const buttonCssProps = {
  background: backgroundProps,
  border: borderProps,
  outline: outlineProps,
  margin: '5px',
  padding: '5px',
  opacity: '100%',
  'box-shadow': '0px 5px 15px 2px hsla(0, 0%, 0%, 35%)',
  'font-size': '',
  'font-weight': '',
  width: '',
  height: '',
  color: '',
  transition: '',
  'text-decoration': textDecorationProps,
}

const chackProps = {
  margin: '',
  padding: '',
  background: backgroundProps,
  border: borderProps,
  width: '',
  height: '',
  transition: '',
  shadow: '',
  color: '',
  'min-width': '',
  'min-height': '',
}

const formCommonCssProps = {
  background: backgroundProps,
  'background-color': '',
  color: '',
  padding: '5px',
  margin: '5px',
  border: borderProps,
  outline: outlineProps,
  'box-shadow': '0px 5px 15px 2px hsla(0, 0%, 0%, 35%)',
  transition: '',
}

const selectedOptImg = {
  border: borderProps,
  height: '',
  width: '',
  margin: '',
  padding: '',
  'box-shadow': '',
  'background-color': '',
}

const optionListSuffix = {
  border: borderProps,
  margin: '',
  padding: '',
  width: '',
  height: '',
  'box-shadow': '',
  'background-color': '',
  'font-size': '',
  'font-weight': '',
  'font-style': '',
  color: '',
}

const optionListLabelWrapper = {
  border: borderProps,
  width: '',
  margin: '',
  padding: '',
  'box-shadow': '',
  height: '',
  'background-color': '',
  'font-size': '',
  'font-style': '',
  'font-weight': '',
  transition: '',
}

const inputClearBtn = {
  border: borderProps,
  margin: '',
  padding: '',
  'background-color': '',
  background: backgroundProps,
  width: '',
  height: '',
  filter: '',
  'backdrop-filter': '',
}

const selectedOptClearBtn = {
  border: borderProps,
  margin: '',
  padding: '',
  'background-color': '',
  stroke: '',
  width: '',
  height: '',
  filter: '',
  'backdrop-filter': '',
}

const optionListOption = {
  border: borderProps,
  margin: '',
  padding: '',
  'background-color': '',
  width: '',
  height: '',
  'box-shadow': '',
}

const optionListIcon = {
  border: borderProps,
  margin: '',
  padding: '',
  width: '',
  height: '',
  'box-shadow': '',
  filter: '',
  'backdrop-filter': '',
}

const optionListLabel = {
  border: borderProps,
  margin: '',
  padding: '',
  width: '',
  height: '',
  'box-shadow': '',
  'background-color': '',
  'font-size': '',
  'font-weight': '',
  'font-style': '',
  color: '',
}

const razorpayBtnProps = {
  border: borderProps,
  'min-width': '',
  height: '',
  'border-radius': '',
  'text-align': '',
  'font-style': '',
  'background-color': '',
  'box-shadow': '',
  width: '',
}

const razorpayBtnTextProps = {
  ...razorpayBtnProps,
  margin: '',
  padding: '',
  'font-size': '',
  'font-weight': '',
  'white-space': '',
  'line-height': '',
  'word-spacing': '',
  'letter-spacing': '',
}

const stripeMollieBtn = {
  states: ['hover', 'focus', 'active'],
  properties: buttonCssProps,
}

const stripeMollieIcon = {
  properties: {
    width: '',
    height: '',
  },
}

const optionSearchInput = {
  border: borderProps,
  width: '',
  margin: '',
  padding: '',
  'box-shadow': '',
  height: '',
  'background-color': '',
  'font-size': '',
  'font-style': '',
  'font-weight': '',
  transition: '',
}

// ============================================
// REUSABLE CONFIGURATION OBJECTS
// ============================================

const selectedOptImgConfig = {
  states: ['hover'],
  properties: { ...selectedOptImg },
}

const selectedOptClearBtnConfig = {
  states: ['hover', 'focus'],
  properties: { ...selectedOptClearBtn },
}

const inputClearBtnConfig = {
  states: ['hover', 'focus'],
  properties: { ...inputClearBtn },
}

const optionListOptionConfig = {
  states: ['hover', 'focus'],
  properties: { ...optionListOption },
}

const optionListLabelWrapperConfig = {
  states: ['hover', 'focus'],
  properties: { ...optionListLabelWrapper },
}

const optionListIconConfig = {
  states: ['hover'],
  properties: { ...optionListIcon },
}

const optionListLabelConfig = {
  states: ['hover', 'focus'],
  properties: { ...optionListLabel },
}

const searchClearBtnConfig = {
  states: ['hover', 'focus'],
  properties: {
    border: borderProps,
    margin: '',
    padding: '',
    background: backgroundProps,
    stroke: '',
    width: '',
    height: '',
    filter: '',
    'backdrop-filter': '',
  },
}

const optionSearchWrpConfig = {
  states: ['hover', 'focus'],
  properties: { ...optionSearchInput },
}

const optSearchIcnConfig = {
  states: ['hover'],
  properties: {
    border: borderProps,
    margin: '',
    padding: '',
    'background-color': '',
    stroke: '',
    filter: '',
    'backdrop-filter': '',
  },
}

const optionListSuffixConfig = {
  states: [],
  properties: { ...optionListSuffix },
}

// NEW: Button icon configuration (reusable for all button prefix/suffix icons)
const buttonIconConfig = {
  states: ['hover'],
  properties: iconCssProps,
}

// NEW: Button icon with more states (for step buttons)
const stepButtonIconConfig = {
  states: ['hover', 'focus', 'active'],
  properties: iconCssProps,
}

// NEW: Step header icon configuration
const stepHeaderIconConfig = {
  states: ['hover', 'active', 'disabled', 'completed'],
  properties: iconCssProps,
}

// NEW: Chip configuration for select field
const chipConfig = {
  states: ['hover'],
  properties: { ...optionListLabel },
}

// NEW: File input wrapper configuration
const fileInputWrapperConfig = {
  states: ['hover'],
  properties: fieldWrpCssProps,
}

// NEW: File input label configuration
const fileInputLabelConfig = {
  states: ['hover'],
  properties: labelCssProps,
}

// NEW: File input button configuration
const fileInputButtonConfig = {
  states: ['hover'],
  properties: buttonCssProps,
}

// NEW: FilePond configuration objects
const filePondRootConfig = {
  states: ['hover'],
  properties: fieldWrpCssProps,
}

const filePondLabelConfig = {
  states: ['hover'],
  properties: labelCssProps,
}

// NEW: Dropdown field wrapper (used by currency, phone, country, select)
const dropdownFieldWrapperConfig = {
  states: ['hover', 'focus', 'active'],
  properties: {
    ...fieldWrpCssProps,
    border: borderProps,
    transition: '',
  },
}

// NEW: Input field configuration with line-height
const inputWithLineHeightConfig = {
  states: ['hover', 'focus'],
  properties: {
    ...optionSearchInput,
    'line-height': '',
  },
}

// ============================================
// REUSABLE CONFIGURATION BUILDERS
// ============================================

// Standard text field configuration used by most input types
const textFldCssProps = {
  'fld-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      'text-decoration': textDecorationProps,
    },
  },
  fld: {
    states: ['hover', 'focus', 'disabled', 'read-only'],
    properties: {
      ...fieldWrpCssProps,
      'accent-color': '',
    },
  },
  'fld::placeholder': {
    states: [],
    properties: labelCssProps,
  },
  'lbl-wrp': {
    states: ['hover'],
    properties: fieldWrpCssProps,
  },
  lbl: {
    states: ['hover'],
    properties: {
      ...labelCssProps,
      'white-space': '',
    },
  },
  'lbl-pre-i': buttonIconConfig,
  'lbl-suf-i': buttonIconConfig,
  'req-smbl': {
    states: ['hover'],
    properties: labelCssProps,
  },
  'pre-i': buttonIconConfig,
  'suf-i': buttonIconConfig,
  'sub-titl': {
    states: ['hover'],
    properties: labelCssProps,
  },
  'title-pre-i': buttonIconConfig,
  'title-suf-i': buttonIconConfig,
  'sub-titl-pre-i': buttonIconConfig,
  'sub-titl-suf-i': buttonIconConfig,
  'hlp-txt': {
    states: ['hover'],
    properties: labelCssProps,
  },
  'hlp-txt-pre-i': buttonIconConfig,
  'hlp-txt-suf-i': buttonIconConfig,
  'err-msg': {
    states: ['hover'],
    properties: labelCssProps,
  },
  'err-txt': {
    states: ['hover'],
    properties: labelCssProps,
  },
  'err-txt-pre-i': buttonIconConfig,
  'err-txt-suf-i': buttonIconConfig,
}

// Configuration for checkbox, radio, decision-box, and gdpr fields
const checkableFieldConfig = {
  ...textFldCssProps,
  cw: {
    states: ['hover'],
    properties: { ...chackProps },
  },
  cc: {
    states: ['hover'],
    properties: { ...chackProps },
  },
  cl: {
    states: ['hover'],
    properties: {
      ...chackProps,
      'font-size': '',
      'font-weight': '',
      'font-style': '',
    },
  },
  bx: {
    states: ['hover', 'focus', 'checked'],
    properties: { ...chackProps },
  },
  ct: {
    states: ['hover', 'focus'],
    properties: {
      ...chackProps,
      'font-size': '',
      'font-weight': '',
      'font-style': '',
      'line-height': '',
      'word-spacing': '',
      'letter-spacing': '',
    },
  },
}

// Configuration for dropdown-style fields (currency, phone-number, country, select)
const dropdownBaseConfig = {
  'dpd-wrp': {
    states: ['hover', 'focus'],
    properties: fieldWrpCssProps,
  },
  'option-search-wrp': { ...optionSearchWrpConfig },
  'opt-search-input': { ...inputWithLineHeightConfig },
  'opt-search-icn': { ...optSearchIcnConfig },
  'input-clear-btn': { ...inputClearBtnConfig },
  'option-wrp': {
    states: ['hover'],
    properties: fieldWrpCssProps,
  },
  'search-clear-btn': { ...searchClearBtnConfig },
  'option-list': {
    states: ['hover', 'focus'],
    properties: fieldWrpCssProps,
  },
  'option-list .option': { ...optionListOptionConfig },
  'option-list .opt-lbl-wrp': { ...optionListLabelWrapperConfig },
  'option-list .opt-icn': { ...optionListIconConfig },
  'option-list .opt-lbl': { ...optionListLabelConfig },
}

// ============================================
// MAIN EDITOR CONFIGURATION
// ============================================

const elementCssPropertiesConfig = {
  // Form background and wrapper
  '_frm-bg': {
    states: ['hover'],
    properties: formCommonCssProps,
  },
  _frm: {
    states: ['hover'],
    properties: formCommonCssProps,
  },

  // Step header components
  'stp-hdr-wrpr': {
    states: ['hover'],
    properties: formCommonCssProps,
  },
  'stp-hdr': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: formCommonCssProps,
  },
  'stp-icn-cntn': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: formCommonCssProps,
  },
  'stp-hdr-lbl': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: formCommonCssProps,
  },
  'stp-lbl-pre-i': { ...stepHeaderIconConfig },
  'stp-lbl-suf-i': { ...stepHeaderIconConfig },
  'stp-hdr-sub-titl': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: formCommonCssProps,
  },
  'stp-sub-titl-pre-i': { ...stepHeaderIconConfig },
  'stp-sub-titl-suf-i': { ...stepHeaderIconConfig },

  // Step wrapper and progress
  'stp-wrpr': {
    states: ['hover'],
    properties: formCommonCssProps,
  },
  'stp-progress-wrpr': {
    states: [],
    properties: formCommonCssProps,
  },
  'stp-progress-bar': {
    states: [],
    properties: formCommonCssProps,
  },
  'stp-cntnt': {
    states: ['hover'],
    properties: formCommonCssProps,
  },

  // Step navigation buttons
  'stp-btn-wrpr': {
    states: ['hover'],
    properties: formCommonCssProps,
  },
  'prev-step-btn': {
    states: ['hover', 'focus', 'active', 'disabled'],
    properties: buttonCssProps,
  },
  'prev-step-btn-pre-i': { ...stepButtonIconConfig },
  'prev-step-btn-suf-i': { ...stepButtonIconConfig },
  'next-step-btn': {
    states: ['hover', 'focus', 'active', 'disabled'],
    properties: buttonCssProps,
  },
  'next-step-btn-pre-i': { ...stepButtonIconConfig },
  'next-step-btn-suf-i': { ...stepButtonIconConfig },

  // Quick tweaks
  'quick-tweaks': {
    properties: {
      border: borderProps,
    },
  },

  // Generic field elements (used across multiple field types)
  fld: {
    states: ['hover', 'focus', 'disabled', 'read-only'],
    properties: {
      ...fieldWrpCssProps,
      'accent-color': '',
    },
  },
  'fld::placeholder': {
    states: [],
    properties: labelCssProps,
  },
  'fld-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      background: backgroundProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
    },
  },
  'lbl-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      background: backgroundProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
    },
  },
  lbl: {
    states: ['hover'],
    properties: {
      ...labelCssProps,
      background: backgroundProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
    },
  },
  'lbl-pre-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'lbl-suf-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'sub-titl': {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: borderProps,
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  'sub-titl-pre-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'sub-titl-suf-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'hlp-txt': {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: borderProps,
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  'hlp-txt-pre-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'hlp-txt-suf-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'err-msg': {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: borderProps,
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  'err-txt-pre-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'err-txt-suf-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  btn: {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: borderProps,
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  'pre-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'suf-i': {
    states: ['hover'],
    properties: {
      ...iconCssProps,
      padding: '5px',
      margin: '5px',
      border: borderProps,
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  'btn-pre-i': buttonIconConfig,
  'btn-suf-i': buttonIconConfig,

  // Default properties
  // ============================================
  // MISSING PROPERTIES ADDED
  // ============================================

  // From textFldCssProps
  'req-smbl': {
    states: ['hover'],
    properties: labelCssProps,
  },
  'title-pre-i': buttonIconConfig,
  'title-suf-i': buttonIconConfig,
  'err-txt': {
    states: ['hover'],
    properties: labelCssProps,
  },

  // From checkableFieldConfig
  cw: {
    states: ['hover'],
    properties: { ...chackProps },
  },
  cc: {
    states: ['hover'],
    properties: { ...chackProps },
  },
  cl: {
    states: ['hover'],
    properties: {
      ...chackProps,
      'font-size': '',
      'font-weight': '',
      'font-style': '',
    },
  },
  bx: {
    states: ['hover', 'focus', 'checked'],
    properties: { ...chackProps },
  },
  ct: {
    states: ['hover', 'focus'],
    properties: {
      ...chackProps,
      'font-size': '',
      'font-weight': '',
      'font-style': '',
      'line-height': '',
      'word-spacing': '',
      'letter-spacing': '',
    },
  },
  'other-inp': {
    states: ['hover', 'focus'],
    properties: fieldWrpCssProps,
  },

  // From dropdownBaseConfig
  'dpd-wrp': {
    states: ['hover', 'focus'],
    properties: fieldWrpCssProps,
  },
  'option-search-wrp': { ...optionSearchWrpConfig },
  'opt-search-input': { ...inputWithLineHeightConfig },
  'opt-search-icn': { ...optSearchIcnConfig },
  'input-clear-btn': { ...inputClearBtnConfig },
  'option-wrp': {
    states: ['hover'],
    properties: fieldWrpCssProps,
  },
  'search-clear-btn': { ...searchClearBtnConfig },
  'option-list': {
    states: ['hover', 'focus'],
    properties: fieldWrpCssProps,
  },
  'option-list .option': { ...optionListOptionConfig },
  'option-list .opt-lbl-wrp': { ...optionListLabelWrapperConfig },
  'option-list .opt-icn': { ...optionListIconConfig },
  'option-list .opt-lbl': { ...optionListLabelConfig },

  // From title field
  logo: buttonIconConfig,
  'titl-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      width: '',
    },
  },
  title: {
    states: ['hover'],
    properties: labelCssProps,
  },

  // From divider field
  divider: {
    states: ['hover'],
    properties: {
      border: {
        'border-bottom': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'border-image': borderImageProps,
      margin: '5px',
      opacity: '100%',
      'box-shadow': '',
      transition: '',
    },
  },

  // From image field
  img: buttonIconConfig,

  // From html-select
  'slct-optn': {
    states: ['hover', 'focus'],
    properties: { ...selectOptionCssProps },
  },
  'slct-opt-grp': {
    states: ['hover', 'focus'],
    properties: { ...selectOptionCssProps },
  },

  // From section
  'inp-fld-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      'text-decoration': textDecorationProps,
    },
  },

  // From repeater
  'rpt-wrp': fileInputWrapperConfig,
  'rpt-grid-wrp': fileInputWrapperConfig,
  'pair-btn-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      'text-decoration': textDecorationProps,
    },
  },
  'rpt-add-btn': {
    states: ['hover', 'focus'],
    properties: buttonCssProps,
  },
  'rpt-add-btn-pre-i': buttonIconConfig,
  'rpt-add-btn-suf-i': buttonIconConfig,
  'rpt-rmv-btn': {
    states: ['hover', 'focus'],
    properties: buttonCssProps,
  },
  'rpt-rmv-btn-pre-i': buttonIconConfig,
  'rpt-rmv-btn-suf-i': buttonIconConfig,
  'add-to-end-btn': {
    states: ['hover', 'focus'],
    properties: buttonCssProps,
  },
  'add-to-end-btn-pre-i': buttonIconConfig,
  'add-to-end-btn-suf-i': buttonIconConfig,
  'add-to-end-btn-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      'text-decoration': textDecorationProps,
    },
  },

  // From signature
  'signature-pad': fileInputWrapperConfig,
  'clr-btn': {
    states: ['hover'],
    properties: buttonCssProps,
  },
  'clr-btn-pre-i': buttonIconConfig,
  'clr-btn-suf-i': buttonIconConfig,
  'undo-btn': {
    states: ['hover'],
    properties: buttonCssProps,
  },
  'undo-btn-pre-i': buttonIconConfig,
  'undo-btn-suf-i': buttonIconConfig,

  // From rating
  'rating-wrp': fileInputWrapperConfig,
  'rating-img': {
    states: ['hover', 'selected'],
    properties: iconCssProps,
  },
  'rating-input': {
    states: ['hover', 'selected'],
    properties: iconCssProps,
  },
  'rating-msg': fileInputWrapperConfig,

  // From image-select
  ci: fileInputWrapperConfig,
  'inp-opt': fileInputWrapperConfig,
  'img-inp': {
    states: ['hover', 'checked', 'focus'],
    properties: {
      ...fieldWrpCssProps,
      outline: '',
    },
  },
  'img-wrp': {
    states: [],
    properties: fieldWrpCssProps,
  },
  'check-box': {
    states: [],
    properties: fieldWrpCssProps,
  },
  'check-img': {
    states: [],
    properties: iconCssProps,
  },
  'select-img': {
    states: [],
    properties: {
      ...fieldWrpCssProps,
      ...iconCssProps,
    },
  },

  // From advanced-file-up
  'inp-wrp .filepond--root': { ...filePondRootConfig },
  'inp-wrp .filepond--drop-label': { ...filePondLabelConfig },
  'inp-wrp .filepond--label-action': { ...filePondLabelConfig },
  'inp-wrp .filepond--panel-root': { ...filePondRootConfig },
  'inp-wrp .filepond--item-panel': { ...filePondRootConfig },
  'inp-wrp .filepond--file-action-button': { ...fileInputButtonConfig },
  'inp-wrp .filepond--drip-blob': { ...filePondLabelConfig },
  'inp-wrp .filepond--file': { ...filePondLabelConfig },

  // From file-up
  'inp-btn': {
    states: ['hover', 'focus'],
    properties: buttonCssProps,
  },
  'file-up-wrpr': fileInputWrapperConfig,
  'btn-txt': { ...fileInputLabelConfig },
  'file-select-status': { ...fileInputLabelConfig },
  'max-size-lbl': { ...fileInputLabelConfig },
  'file-input-wrpr .files-list': { ...fileInputWrapperConfig },
  'file-input-wrpr .file-wrpr': { ...fileInputWrapperConfig },
  'file-input-wrpr .file-preview': buttonIconConfig,
  'file-input-wrpr .file-title': { ...fileInputLabelConfig },
  'file-input-wrpr .file-size': { ...fileInputLabelConfig },
  'file-input-wrpr .cross-btn': { ...fileInputButtonConfig },
  'file-input-wrpr .err-wrp': { ...fileInputButtonConfig },

  // From stripe
  'stripe-btn': { ...stripeMollieBtn },
  'stripe-icn': { ...stripeMollieIcon },
  'stripe-wrp .stripe-pay-btn': { ...stripeMollieBtn },

  // From mollie
  'mollie-btn': { ...stripeMollieBtn },
  'mollie-icn': { ...stripeMollieIcon },

  // From razorpay
  'razorpay-btn': {
    states: ['before'],
    properties: {
      ...razorpayBtnProps,
      transform: 'skew(-15deg, 0)',
    },
  },
  'razorpay-btn-text': {
    states: [],
    properties: { ...razorpayBtnTextProps },
  },
  'razorpay-btn-title': {
    states: [],
    properties: { ...razorpayBtnTextProps },
  },
  'razorpay-btn-sub-title': {
    states: [],
    properties: { ...razorpayBtnTextProps },
  },

  // From currency
  'currency-fld-wrp': { ...dropdownFieldWrapperConfig },
  'selected-currency-img': { ...selectedOptImgConfig },
  'currency-amount-input': { ...inputWithLineHeightConfig },
  'option-list .opt-suffix': { ...optionListSuffixConfig },

  // From phone-number
  'phone-fld-wrp': { ...dropdownFieldWrapperConfig },
  'selected-country-img': { ...selectedOptImgConfig },
  'phone-number-input': { ...inputWithLineHeightConfig },

  // From country
  'country-fld-wrp': {
    states: ['hover', 'focus', 'active'],
    properties: {
      ...fieldWrpCssProps,
      transition: '',
    },
  },
  'selected-country-lbl': { ...optionListLabelWrapperConfig },
  'inp-clr-btn': { ...inputClearBtnConfig },

  // From select
  'dpd-fld-wrp': { ...dropdownFieldWrapperConfig },
  'selected-opt-img': { ...selectedOptImgConfig },
  'selected-opt-lbl': { ...optionListLabelConfig },
  'selected-opt-clear-btn': { ...selectedOptClearBtnConfig },
  'selected-opt-lbl .chip-wrp': { ...chipConfig },
  'selected-opt-lbl .chip-lbl': { ...chipConfig },
  'selected-opt-lbl .chip-icn': { ...chipConfig },
  'selected-opt-lbl .chip-clear-btn': { ...chipConfig },

  defaultProps: {
    margin: '0px',
    padding: '0px',
    border: '',
  },

  // Text field style
  texfieldStyle: {
    states: ['hover'],
    properties: {
      background: backgroundProps,
      'background-color': '',
      color: '',
      'font-size': '',
      border: {
        width: true,
        color: true,
        radius: true,
      },
      margin: '5px',
      padding: '5px',
      opacity: '100%',
      'text-align': '',
      'text-decoration': textDecorationProps,
      'text-shadow': '',
      'box-shadow': '',
      'border-radius': '',
      transition: '',
      filter: '',
      'backdrop-filter': '',
      'font-weight': '',
      'font-style': '',
      'line-height': '',
      'word-spacing': '',
      'letter-spacing': '',
      'z-index': '',
      height: '',
      width: '',
      transform: '',
      'white-space': '',
      'word-wrap': '',
    },
  },

  // ============================================
  // STANDARD TEXT INPUT FIELDS
  // All these fields share the same configuration
  // ============================================
  text: { ...textFldCssProps },
  name: { ...textFldCssProps },
  address: { ...textFldCssProps },
  date: { ...textFldCssProps },
  time: { ...textFldCssProps },
  'datetime-local': { ...textFldCssProps },
  week: { ...textFldCssProps },
  month: { ...textFldCssProps },
  color: { ...textFldCssProps },
  url: { ...textFldCssProps },
  number: { ...textFldCssProps },
  username: { ...textFldCssProps },
  password: { ...textFldCssProps },
  textarea: { ...textFldCssProps },
  email: { ...textFldCssProps },
  range: { ...textFldCssProps },
  hidden: { ...textFldCssProps },
  'advanced-datetime': { ...textFldCssProps },

  // ============================================
  // CHECKABLE FIELDS (Checkbox, Radio, etc.)
  // All these fields share the same configuration
  // ============================================
  check: {
    ...checkableFieldConfig,
    'other-inp': {
      states: ['hover', 'focus'],
      properties: fieldWrpCssProps,
    },
  },
  radio: {
    ...checkableFieldConfig,
    'other-inp': {
      states: ['hover', 'focus'],
      properties: fieldWrpCssProps,
    },
  },
  'decision-box': { ...checkableFieldConfig },
  gdpr: { ...checkableFieldConfig },

  // ============================================
  // SPECIAL FIELD TYPES
  // ============================================

  // Title field
  title: {
    'fld-wrp': fileInputWrapperConfig,
    logo: buttonIconConfig,
    'titl-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        width: '',
      },
    },
    title: {
      states: ['hover'],
      properties: labelCssProps,
    },
    'sub-titl': {
      states: ['hover'],
      properties: labelCssProps,
    },
    'title-pre-i': buttonIconConfig,
    'title-suf-i': buttonIconConfig,
    'sub-titl-pre-i': buttonIconConfig,
    'sub-titl-suf-i': buttonIconConfig,
  },

  // Spacer field
  spacer: {
    'fld-wrp': fileInputWrapperConfig,
  },

  // Divider field
  divider: {
    'fld-wrp': fileInputWrapperConfig,
    divider: {
      states: ['hover'],
      properties: {
        border: {
          'border-bottom': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        'border-image': borderImageProps,
        margin: '5px',
        opacity: '100%',
        'box-shadow': '',
        transition: '',
      },
    },
  },

  // Image field
  image: {
    'fld-wrp': fileInputWrapperConfig,
    img: buttonIconConfig,
  },

  // HTML Select
  'html-select': {
    ...textFldCssProps,
    'slct-optn': {
      states: ['hover', 'focus'],
      properties: { ...selectOptionCssProps },
    },
    'slct-opt-grp': {
      states: ['hover', 'focus'],
      properties: { ...selectOptionCssProps },
    },
  },

  // HTML field
  html: {
    'fld-wrp': fileInputWrapperConfig,
  },

  // Shortcode field
  shortcode: {
    'fld-wrp': fileInputWrapperConfig,
  },

  // Button field
  button: {
    'fld-wrp': fileInputWrapperConfig,
    btn: {
      states: ['hover', 'focus'],
      properties: buttonCssProps,
    },
    'btn-pre-i': buttonIconConfig,
    'btn-suf-i': buttonIconConfig,
    'hlp-txt': {
      states: ['hover'],
      properties: labelCssProps,
    },
    'hlp-txt-pre-i': buttonIconConfig,
    'hlp-txt-suf-i': buttonIconConfig,
  },

  // Section field
  section: {
    ...textFldCssProps,
    'inp-fld-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': textDecorationProps,
      },
    },
  },

  // Repeater field
  repeater: {
    ...textFldCssProps,
    'inp-fld-wrp': fileInputWrapperConfig,
    'rpt-wrp': fileInputWrapperConfig,
    'rpt-grid-wrp': fileInputWrapperConfig,
    'pair-btn-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': textDecorationProps,
      },
    },
    'rpt-add-btn': {
      states: ['hover', 'focus'],
      properties: buttonCssProps,
    },
    'rpt-add-btn-pre-i': buttonIconConfig,
    'rpt-add-btn-suf-i': buttonIconConfig,
    'rpt-rmv-btn': {
      states: ['hover', 'focus'],
      properties: buttonCssProps,
    },
    'rpt-rmv-btn-pre-i': buttonIconConfig,
    'rpt-rmv-btn-suf-i': buttonIconConfig,
    'add-to-end-btn': {
      states: ['hover', 'focus'],
      properties: buttonCssProps,
    },
    'add-to-end-btn-pre-i': buttonIconConfig,
    'add-to-end-btn-suf-i': buttonIconConfig,
    'add-to-end-btn-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': textDecorationProps,
      },
    },
  },

  // Signature field
  signature: {
    ...textFldCssProps,
    'inp-fld-wrp': fileInputWrapperConfig,
    'signature-pad': fileInputWrapperConfig,
    'clr-btn': {
      states: ['hover'],
      properties: buttonCssProps,
    },
    'clr-btn-pre-i': buttonIconConfig,
    'clr-btn-suf-i': buttonIconConfig,
    'undo-btn': {
      states: ['hover'],
      properties: buttonCssProps,
    },
    'undo-btn-pre-i': buttonIconConfig,
    'undo-btn-suf-i': buttonIconConfig,
  },

  // Email OTP field
  'email-otp': {
    ...textFldCssProps,
    'inp-fld-wrp': fileInputWrapperConfig,
    'otp-boxes-wrp': fileInputWrapperConfig,
    'otp-box': {
      states: ['hover', 'focus', 'disabled'],
      properties: fieldWrpCssProps,
    },
    'otp-actions-wrp': fileInputWrapperConfig,
    'send-otp-btn': {
      states: ['hover', 'focus', 'disabled'],
      properties: buttonCssProps,
    },
    'resend-wrp': fileInputWrapperConfig,
    'wait-txt': fileInputWrapperConfig,
    'verify-btn': {
      states: ['hover', 'focus', 'disabled'],
      properties: buttonCssProps,
    },
    'otp-success-msg': fileInputWrapperConfig,
    'otp-error-msg': fileInputWrapperConfig,
  },

  // Rating field
  rating: {
    ...textFldCssProps,
    'inp-fld-wrp': fileInputWrapperConfig,
    'rating-wrp': fileInputWrapperConfig,
    'rating-img': {
      states: ['hover', 'selected'],
      properties: iconCssProps,
    },
    'rating-input': {
      states: ['hover', 'selected'],
      properties: iconCssProps,
    },
    'rating-msg': fileInputWrapperConfig,
  },

  // Image Select field
  'image-select': {
    ...textFldCssProps,
    ci: fileInputWrapperConfig,
    'inp-opt': fileInputWrapperConfig,
    'img-inp': {
      states: ['hover', 'checked', 'focus'],
      properties: {
        ...fieldWrpCssProps,
        outline: '',
      },
    },
    'img-wrp': {
      states: [],
      properties: fieldWrpCssProps,
    },
    'check-box': {
      states: [],
      properties: fieldWrpCssProps,
    },
    'check-img': {
      states: [],
      properties: iconCssProps,
    },
    'select-img': {
      states: [],
      properties: {
        ...fieldWrpCssProps,
        ...iconCssProps,
      },
    },
  },

  // ============================================
  // FILE UPLOAD FIELDS
  // ============================================

  // Advanced File Upload
  'advanced-file-up': {
    'fld-wrp': fileInputWrapperConfig,
    fld: {
      states: ['hover', 'focus'],
      properties: fieldWrpCssProps,
    },
    'lbl-wrp': fileInputWrapperConfig,
    lbl: { ...fileInputLabelConfig },
    'lbl-pre-i': buttonIconConfig,
    'lbl-suf-i': buttonIconConfig,
    'hlp-txt': { ...fileInputLabelConfig },
    'hlp-txt-pre-i': buttonIconConfig,
    'hlp-txt-suf-i': buttonIconConfig,
    'err-msg': { ...fileInputLabelConfig },
    'err-txt': { ...fileInputLabelConfig },
    'err-txt-pre-i': buttonIconConfig,
    'err-txt-suf-i': buttonIconConfig,
    'inp-wrp .filepond--root': { ...filePondRootConfig },
    'inp-wrp .filepond--drop-label': { ...filePondLabelConfig },
    'inp-wrp .filepond--label-action': { ...filePondLabelConfig },
    'inp-wrp .filepond--panel-root': { ...filePondRootConfig },
    'inp-wrp .filepond--item-panel': { ...filePondRootConfig },
    'inp-wrp .filepond--file-action-button': { ...fileInputButtonConfig },
    'inp-wrp .filepond--drip-blob': { ...filePondLabelConfig },
    'inp-wrp .filepond--file': { ...filePondLabelConfig },
  },

  // Standard File Upload
  'file-up': {
    'fld-wrp': fileInputWrapperConfig,
    'lbl-wrp': fileInputWrapperConfig,
    lbl: {
      states: ['hover'],
      properties: {
        ...labelCssProps,
        'white-space': '',
      },
    },
    'lbl-pre-i': buttonIconConfig,
    'lbl-suf-i': buttonIconConfig,
    'sub-titl': { ...fileInputLabelConfig },
    'sub-titl-pre-i': buttonIconConfig,
    'sub-titl-suf-i': buttonIconConfig,
    'inp-btn': {
      states: ['hover', 'focus'],
      properties: buttonCssProps,
    },
    'pre-i': buttonIconConfig,
    'file-up-wrpr': fileInputWrapperConfig,
    'btn-txt': { ...fileInputLabelConfig },
    'suf-i': buttonIconConfig,
    'file-select-status': { ...fileInputLabelConfig },
    'max-size-lbl': { ...fileInputLabelConfig },
    'file-input-wrpr .files-list': { ...fileInputWrapperConfig },
    'file-input-wrpr .file-wrpr': { ...fileInputWrapperConfig },
    'file-input-wrpr .file-preview': buttonIconConfig,
    'file-input-wrpr .file-title': { ...fileInputLabelConfig },
    'file-input-wrpr .file-size': { ...fileInputLabelConfig },
    'file-input-wrpr .cross-btn': { ...fileInputButtonConfig },
    'file-input-wrpr .err-wrp': { ...fileInputButtonConfig },
    'err-msg': { ...fileInputLabelConfig },
    'err-txt': { ...fileInputLabelConfig },
    'err-txt-pre-i': buttonIconConfig,
    'err-txt-suf-i': buttonIconConfig,
  },

  // ============================================
  // CAPTCHA FIELDS
  // ============================================
  recaptcha: {
    'fld-wrp': fileInputWrapperConfig,
  },
  turnstile: {
    'fld-wrp': fileInputWrapperConfig,
  },
  hcaptcha: {
    'fld-wrp': fileInputWrapperConfig,
  },

  // ============================================
  // PAYMENT FIELDS
  // ============================================

  // Stripe
  stripe: {
    'stripe-btn': { ...stripeMollieBtn },
    'stripe-icn': { ...stripeMollieIcon },
    'stripe-wrp .stripe-pay-btn': { ...stripeMollieBtn },
  },

  // Mollie
  mollie: {
    'mollie-btn': { ...stripeMollieBtn },
    'mollie-icn': { ...stripeMollieIcon },
  },

  // PayPal
  paypal: {
    'fld-wrp': fileInputWrapperConfig,
  },

  // Razorpay
  razorpay: {
    'fld-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': textDecorationProps,
      },
    },
    'razorpay-btn': {
      states: ['before'],
      properties: {
        ...razorpayBtnProps,
        transform: 'skew(-15deg, 0)',
      },
    },
    'razorpay-btn-text': {
      states: [],
      properties: { ...razorpayBtnTextProps },
    },
    'razorpay-btn-title': {
      states: [],
      properties: { ...razorpayBtnTextProps },
    },
    'razorpay-btn-sub-title': {
      states: [],
      properties: { ...razorpayBtnTextProps },
    },
  },

  // ============================================
  // DROPDOWN FIELDS (Currency, Phone, Country, Select)
  // These fields share similar dropdown structures
  // ============================================

  // Currency field
  currency: {
    ...textFldCssProps,
    'currency-fld-wrp': { ...dropdownFieldWrapperConfig },
    ...dropdownBaseConfig,
    'selected-currency-img': { ...selectedOptImgConfig },
    'currency-amount-input': { ...inputWithLineHeightConfig },
    'option-list .opt-suffix': { ...optionListSuffixConfig },
  },

  // Phone Number field
  'phone-number': {
    ...textFldCssProps,
    'phone-fld-wrp': { ...dropdownFieldWrapperConfig },
    ...dropdownBaseConfig,
    'selected-country-img': { ...selectedOptImgConfig },
    'phone-number-input': { ...inputWithLineHeightConfig },
    'option-list .opt-lbl-wrp': { ...optionListLabelWrapperConfig },
    'option-list .opt-suffix': { ...optionListSuffixConfig },
  },

  // Country field
  country: {
    ...textFldCssProps,
    'country-fld-wrp': {
      states: ['hover', 'focus', 'active'],
      properties: {
        ...fieldWrpCssProps,
        transition: '',
      },
    },
    ...dropdownBaseConfig,
    'selected-country-img': { ...selectedOptImgConfig },
    'selected-country-lbl': { ...optionListLabelWrapperConfig },
    'inp-clr-btn': { ...inputClearBtnConfig },
  },

  // Select field
  select: {
    ...textFldCssProps,
    'dpd-fld-wrp': { ...dropdownFieldWrapperConfig },
    ...dropdownBaseConfig,
    'selected-opt-img': { ...selectedOptImgConfig },
    'selected-opt-lbl': { ...optionListLabelConfig },
    'selected-opt-clear-btn': { ...selectedOptClearBtnConfig },
    'inp-clr-btn': { ...inputClearBtnConfig },
    'selected-opt-lbl .chip-wrp': { ...chipConfig },
    'selected-opt-lbl .chip-lbl': { ...chipConfig },
    'selected-opt-lbl .chip-icn': { ...chipConfig },
    'selected-opt-lbl .chip-clear-btn': { ...chipConfig },
  },
}

export default elementCssPropertiesConfig
