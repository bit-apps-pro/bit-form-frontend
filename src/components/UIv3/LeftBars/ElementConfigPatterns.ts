// import { FieldObject } from './ElementConfigTypes'

import { FieldObject } from "../Types/ElementConfiguration.types"

/**
 * Configuration for common field elements
 * This eliminates hundreds of lines of repetitive code
 */

export const TITLE_ELEMENTS = [
  {
    condition: (field: FieldObject) => !!(field.title || field.titlePreIcn || field.titleSufIcn),
    route: 'title',
    label: 'Title',
    preIconKey: 'titlePreIcn' as keyof FieldObject,
    sufIconKey: 'titleSufIcn' as keyof FieldObject,
    preIconRoute: 'title-pre-i',
    sufIconRoute: 'title-suf-i',
  }
]

export const LABEL_ELEMENTS = [
  {
    condition: (field: FieldObject) =>
      !!(field.lbl || field.lblPreIcn || field.lblSufIcn) &&
      !field.typ.match(/^(decision-box|gdpr|razorpay|paypal)$/gi),
    route: 'lbl',
    label: 'Label',
    preIconKey: 'lblPreIcn' as keyof FieldObject,
    sufIconKey: 'lblSufIcn' as keyof FieldObject,
    preIconRoute: 'lbl-pre-i',
    sufIconRoute: 'lbl-suf-i',
  }
]

export const SUBTITLE_ELEMENTS = [
  {
    condition: (field: FieldObject) =>
      !!(field.subtitle || field.subTlePreIcn || field.subTleSufIcn || field.subTitlPreIcn || field.subTitlSufIcn),
    route: 'sub-titl',
    label: 'Subtitle',
    preIconKey: 'subTlePreIcn' as keyof FieldObject,
    sufIconKey: 'subTleSufIcn' as keyof FieldObject,
    preIconRoute: 'sub-titl-pre-i',
    sufIconRoute: 'sub-titl-suf-i',
  }
]

export const HELPER_TEXT_ELEMENTS = [
  {
    condition: (field: FieldObject) => !!(field.helperTxt || field.hlpPreIcn || field.hlpSufIcn),
    route: 'hlp-txt',
    label: 'Helper Text',
    preIconKey: 'hlpPreIcn' as keyof FieldObject,
    sufIconKey: 'hlpSufIcn' as keyof FieldObject,
    preIconRoute: 'hlp-txt-pre-i',
    sufIconRoute: 'hlp-txt-suf-i',
  }
]


export const BUTTON_ELEMENTS = [
  {
    condition: (field: FieldObject) => !!(field.txt || field.btnPreIcn || field.btnSufIcn),
    route: 'btn',
    label: 'Button',
    preIconKey: 'btnPreIcn' as keyof FieldObject,
    sufIconKey: 'btnSufIcn' as keyof FieldObject,
    preIconRoute: 'btn-pre-i',
    sufIconRoute: 'btn-suf-i',
  }
]

export const INPUT_ELEMENTS = [
  {
    condition: (field: FieldObject) => !field.typ.match(/^(title|image|html|divider|button|check|radio|decision-box|gdpr|select|currency|phone-number|country|razorpay|paypal|section|repeater|email-otp|address)$/gi),
    route: 'fld',
    label: 'Input',
    preIconKey: 'prefixIcn' as keyof FieldObject,
    sufIconKey: 'suffixIcn' as keyof FieldObject,
    preIconRoute: 'pre-i',
    sufIconRoute: 'suf-i',
  }
]

/**
 * Repeater field specific elements
 */
export const REPEATER_ELEMENTS = {
  addButton: {
    route: 'rpt-add-btn',
    label: 'Add Button',
    preIconKey: 'addBtnPreIcn' as keyof FieldObject,
    sufIconKey: 'addBtnSufIcn' as keyof FieldObject,
    preIconRoute: 'rpt-add-btn-pre-i',
    sufIconRoute: 'rpt-add-btn-suf-i',
  },
  removeButton: {
    route: 'rpt-rmv-btn',
    label: 'Remove Button',
    preIconKey: 'removeBtnPreIcn' as keyof FieldObject,
    sufIconKey: 'removeBtnSufIcn' as keyof FieldObject,
    preIconRoute: 'rpt-rmv-btn-pre-i',
    sufIconRoute: 'rpt-rmv-btn-suf-i',
  },
  addToEndButton: {
    route: 'add-to-end-btn',
    label: 'Add To End Button',
    preIconKey: 'addToEndBtnPreIcn' as keyof FieldObject,
    sufIconKey: 'addToEndBtnSufIcn' as keyof FieldObject,
    preIconRoute: 'add-to-end-btn-pre-i',
    sufIconRoute: 'add-to-end-btn-suf-i',
  }
}

/**
 * Simple container elements (no icons)
 */
export const CONTAINER_ELEMENTS = {
  fieldContainer: {
    condition: (field: FieldObject) => field.typ !== 'paypal',
    route: 'fld-wrp',
    label: 'Field Container',
  },
  titleContainer: {
    condition: (field: FieldObject) =>
      field.typ === 'title' && !!(field.title || field.titlePreIcn || field.titleSufIcn ||
        field.subtitle || field.subTitlPreIcn || field.subTitlSufIcn),
    route: 'titl-wrp',
    label: 'Title Container',
  },
  labelContainer: {
    condition: (field: FieldObject) =>
      !!(field.lbl || field.lblPreIcn || field.lblSufIcn || field.subtitle ||
        field.subTlePreIcn || field.subTleSufIcn) && field.typ !== 'title',
    route: 'lbl-wrp',
    label: 'Label Container',
  },
  inputContainer: {
    condition: (field: FieldObject) =>
      !field.typ.match(/^(title|image|html|divider|button|razorpay|paypal|section|repeater)$/gi),
    route: 'inp-fld-wrp',
    label: 'Input Container',
  },
  fileInputContainer: {
    condition: (field: FieldObject) => field.typ === 'file',
    route: 'file-up-wrpr',
    label: 'File Input Container',
  },


}

export const ERROR_MESSAGE_ELEMENT = {
  condition: (field: FieldObject) =>
    !field.typ.match(/^(button|divider|spacer|title|image|html|razorpay|paypal|recaptcha|section|repeater|turnstile|hcaptcha)$/),
  route: 'err-msg',
  label: 'Error Message',
}

/**
 * Field type specific configurations
 */
export const FIELD_TYPE_CONFIGS: Record<string, any> = {
  title: {
    hasContainer: true,
    elements: ['title', 'subtitle'],
  },
  button: {
    elements: ['button'],
  },
  repeater: {
    elements: ['addButton', 'removeButton', 'addToEndButton'],
  },
  section: {
    elements: ['title', 'subtitle'],
  },
  // Add more field type specific configs as needed
}

export const QUICK_TWEAK_ELEMENT = {
  condition: (field: FieldObject) => !field.typ.match(/^(title|image|html|divider)$/gi),
  route: 'quick-tweaks',
  label: 'Quick Tweaks',
}

export const CHECKBOX_RADIO_ELEMENTS = [
  {
    condition: (field: FieldObject) => !!field.typ.match(/^(check|radio|decision-box|gdpr)/gi),
    route: 'cc',
    label: 'Check Container',
  },
  {
    condition: (field: FieldObject) => !!field.typ.match(/^(check|radio|decision-box|gdpr)/gi),
    route: 'ct',
    label: 'Option Label',
  },
  {
    condition: (field: FieldObject) => !!field.typ.match(/^(check|radio)$/gi),
    route: 'cw',
    label: 'Check Wrapper',
  },
  {
    condition: (field: FieldObject) => !!field.typ.match(/^(check|radio)$/gi),
    route: 'cl',
    label: 'Option Wrapper',
  },
  {
    condition: (field: FieldObject) => !!field.typ.match(/(check|decision-box|radio|gdpr)/gi),
    route: 'bx',
    label: 'Box',
    // Dynamic label handling needs to be done in the component or here if supported. 
    // ElementGroup supports dynamic label? No, it expects string.
    // I will handle dynamic label in ElementConfiguration.tsx or just use a generic name like "Box" or "Check/Radio Box"
    // The old code used: label={fldData.typ === 'radio' ? 'Radio Box' : 'Check Box'}
    // I can use a getter if I change the type definition, but for now let's stick to static or handle in component.
    // Actually, I can use a function for label in ElementGroup if I update the type.
    // But let's just use "Check/Radio Box" for now or split them.
    // Splitting is safer.
  },
  {
    condition: (field: FieldObject) => !!field.typ.match(/(check|radio)/gi),
    route: 'other-inp',
    label: 'Other Option Input',
  }
]

export const IMAGE_SELECT_ELEMENTS = [
  {
    route: 'ic',
    label: 'Field Wrapper',
  },
  {
    route: 'inp-opt',
    label: 'Image Option',
  },
  {
    route: 'img-inp',
    label: 'Input',
  },
  {
    route: 'img-wrp',
    label: 'Image Wrapper',
  },
  {
    route: 'check-box',
    label: 'Check Box',
  },
  {
    route: 'check-img',
    label: 'Check Box Image',
  },
  {
    route: 'img-card-wrp',
    label: 'Image Container',
  },
  {
    route: 'select-img',
    label: 'Image',
  },
  {
    condition: (field: FieldObject) => !field.optLblHide,
    route: 'tc',
    label: 'Image Label Container',
  },
  {
    condition: (field: FieldObject) => !field.optLblHide,
    route: 'img-title',
    label: 'Image Label',
  }
]

export const HTML_SELECT_ELEMENTS = [
  {
    route: 'fld',
    label: 'Select',
  },
  {
    route: 'slct-optn',
    label: 'Options',
  },
  {
    route: 'slct-opt-grp',
    label: 'Options Group',
  }
]

export const REPEATER_CONTAINER_ELEMENTS = [
  {
    route: 'rpt-wrp',
    label: 'Repeatative Container',
  },
  {
    route: 'rpt-grid-wrp',
    label: 'Grid Container',
  },
  {
    route: 'pair-btn-wrp',
    label: 'Button Container',
  }
]

export const SIGNATURE_ELEMENTS = [
  {
    route: 'inp-fld-wrp',
    label: 'Field Wrapper',
  },
  {
    route: 'signature-pad',
    label: 'Signature Pad',
  },
  {
    route: 'clr-btn',
    label: 'Clear Button',
    preIconKey: 'clrPreIcn' as keyof FieldObject,
    sufIconKey: 'clrSufIcn' as keyof FieldObject,
    preIconRoute: 'clr-btn-pre-i',
    sufIconRoute: 'clr-btn-suf-i',
  },
  {
    route: 'undo-btn',
    label: 'Undo Button',
    preIconKey: 'undoPreIcn' as keyof FieldObject,
    sufIconKey: 'undoSufIcn' as keyof FieldObject,
    preIconRoute: 'undo-btn-pre-i',
    sufIconRoute: 'undo-btn-suf-i',
  },
  {
    route: 'redo-btn',
    label: 'Redo Button',
    preIconKey: 'redoPreIcn' as keyof FieldObject,
    sufIconKey: 'redoSufIcn' as keyof FieldObject,
    preIconRoute: 'redo-btn-pre-i',
    sufIconRoute: 'redo-btn-suf-i',
  }
]

export const EMAIL_OTP_ELEMENTS = [
  {
    route: 'inp-fld-wrp',
    label: 'Field Wrapper',
  },
  {
    route: 'otp-boxes-wrp',
    label: 'OTP Boxes Wrapper',
  },
  {
    route: 'otp-box',
    label: 'OTP Box Input',
  },
  {
    route: 'otp-actions-wrp',
    label: 'Actions Row',
  },
  {
    route: 'send-otp-btn',
    label: 'Send OTP Button',
  },
  {
    route: 'resend-wrp',
    label: 'Resend Wrapper',
  },
  {
    route: 'wait-txt',
    label: 'Wait Text',
  },
  {
    route: 'verify-btn',
    label: 'Verify Button',
  },
  {
    route: 'otp-success-msg',
    label: 'OTP Success Message',
  },
  {
    route: 'otp-error-msg',
    label: 'OTP Error Message',
  },
]

export const RATING_ELEMENTS = [
  {
    route: 'inp-fld-wrp',
    label: 'Field Wrapper',
  },
  {
    route: 'rating-img',
    label: 'Rating Image',
  },
  {
    route: 'rating-msg',
    label: 'Rating Message',
  }
]

export const ADVANCED_FILE_UPLOAD_ELEMENTS = [
  {
    route: 'filepond--drop-label',
    label: 'Drop Label',
    // offset: '3.1',
  },
  {
    route: 'filepond--label-action',
    label: 'Label Action',
    // offset: '3.1',
  },
  {
    route: 'filepond--panel-root',
    label: 'Panel Root',
    // offset: '3.1',
  },
  {
    route: 'filepond--item-panel',
    label: 'Item Panel',
    // offset: '3.1',
  },
  {
    route: 'filepond--file-action-button',
    label: 'File Action Button',
    // offset: '3.1',
  },
  {
    route: 'filepond--file',
    label: 'File',
    // offset: '3.1',
  }
]

export const CURRENCY_ELEMENTS = [
  {
    route: 'currency-fld-wrp',
    label: 'Currency Field Wrapper',
  },
  {
    route: 'dpd-wrp',
    label: 'Dropdown Wrapper',
  },
  {
    route: 'selected-currency-img',
    label: 'Selected Currency Image',
  },
  {
    route: 'currency-amount-input',
    label: 'Currency Amount Input',
  },
  {
    route: 'input-clear-btn',
    label: 'Input Clear Button',
  },
  {
    route: 'option-wrp',
    label: 'Option Wrapper',
  },
  {
    route: 'option-search-wrp',
    label: 'Option Search Wrapper',
  },
  {
    route: 'opt-search-icn',
    label: 'Option Search Icon',
  },
  {
    route: 'opt-search-input',
    label: 'Option Search Input',
  },
  {
    route: 'search-clear-btn',
    label: 'Search Clear Button',
  },
  {
    route: 'option-list',
    label: 'Option List',
  },
  {
    route: 'option',
    label: 'Currency Option',
  },
  {
    route: 'opt-lbl-wrp',
    label: 'Currency Option Label Wrapper',
  },
  {
    route: 'opt-icn',
    label: 'Currency Option Icon',
  },
  {
    route: 'opt-lbl',
    label: 'Currency Option Label',
  },
  {
    route: 'opt-suffix',
    label: 'Currency Option Trailing',
  }
]

export const PHONE_NUMBER_ELEMENTS = [
  {
    route: 'phone-fld-wrp',
    label: 'Phone Field Wrapper',
  },
  {
    route: 'dpd-wrp',
    label: 'Dropdown Wrapper',
  },
  {
    route: 'selected-country-img',
    label: 'Selected Country Image',
  },
  {
    route: 'phone-number-input',
    label: 'Phone Number Input',
  },
  {
    route: 'input-clear-btn',
    label: 'Input Clear Button',
  },
  {
    route: 'option-wrp',
    label: 'Option Wrapper',
  },
  {
    route: 'option-search-wrp',
    label: 'Option Search Wrapper',
  },
  {
    route: 'opt-search-icn',
    label: 'Option Search Icon',
  },
  {
    route: 'opt-search-input',
    label: 'Option Search Input',
  },
  {
    route: 'search-clear-btn',
    label: 'Search Clear Button',
  },
  {
    route: 'option-list',
    label: 'Option List',
  },
  {
    route: 'option',
    label: 'Phone Number Option',
  },
  {
    route: 'opt-lbl-wrp',
    label: 'Option Label Wrapper',
  },
  {
    route: 'opt-icn',
    label: 'Phone Option Icon',
  },
  {
    route: 'opt-lbl',
    label: 'Phone Option Label',
  },
  {
    route: 'opt-suffix',
    label: 'Phone Option Suffix',
  }
]

export const COUNTRY_ELEMENTS = [
  {
    route: 'country-fld-wrp',
    label: 'Country Field Wrapper',
  },
  {
    route: 'selected-country-img',
    label: 'Selected Country Image',
  },
  {
    route: 'selected-country-lbl',
    label: 'Selected Country Label',
  },
  {
    route: 'inp-clr-btn',
    label: 'Input Clear Button',
  },
  {
    route: 'option-wrp',
    label: 'Option Wrapper',
  },
  {
    route: 'option-search-wrp',
    label: 'Option Search Wrapper',
  },
  {
    route: 'opt-search-icn',
    label: 'Option Search Icon',
  },
  {
    route: 'opt-search-input',
    label: 'Option Search Input',
  },
  {
    route: 'search-clear-btn',
    label: 'Search Clear Button',
  },
  {
    route: 'option-list',
    label: 'Option List',
  },
  {
    route: 'option',
    label: 'Country Option',
  },
  {
    route: 'opt-lbl-wrp',
    label: 'Option Label Wrapper',
  },
  {
    route: 'opt-icn',
    label: 'Country Option Icon',
  },
  {
    route: 'opt-lbl',
    label: 'Country Option Label',
  }
]

export const SELECT_ELEMENTS = [
  {
    route: 'dpd-fld-wrp',
    label: 'Dropdown Field Wrapper',
  },
  {
    route: 'dpd-wrp',
    label: 'Dropdown Wrapper',
  },
  {
    route: 'selected-opt-img',
    label: 'Selected Option Image',
  },
  {
    route: 'selected-opt-lbl',
    label: 'Selected Option Label',
  },
  {
    route: 'selected-opt-clear-btn',
    label: 'Input Clear Button',
  },
  {
    route: 'option-wrp',
    label: 'Option Wrapper',
  },
  {
    route: 'option-search-wrp',
    label: 'Option Search Wrapper',
  },
  {
    route: 'opt-search-input',
    label: 'Option Search Input',
  },
  {
    route: 'opt-search-icn',
    label: 'Option Search Icon',
  },
  {
    route: 'search-clear-btn',
    label: 'Search Clear Button',
  },
  {
    route: 'option-list',
    label: 'Option List',
  },
  {
    route: 'option',
    label: 'Option',
  },
  {
    route: 'opt-lbl-wrp',
    label: 'Option Label Wrapper',
  },
  {
    route: 'opt-icn',
    label: 'Option Icon',
  },
  {
    route: 'opt-lbl',
    label: 'Option Label',
  },
  {
    route: 'chip-wrp',
    label: 'Chip Wrapper',
  },
  {
    route: 'chip-icn',
    label: 'Chip Icon',
  },
  {
    route: 'chip-lbl',
    label: 'Chip Label',
  },
  {
    route: 'chip-clear-btn',
    label: 'Chip Clear Button',
  }
]