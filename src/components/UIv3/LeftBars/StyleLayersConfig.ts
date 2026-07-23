// Configuration for the new hierarchical UI design

export interface HierarchicalElement {
  route: string
  label: string
  highlightSelector?: string
  hasTarget?: boolean
  children?: HierarchicalElement[]
}

// Common Elements with hierarchical structure
export const COMMON_ELEMENTS_HIERARCHY: HierarchicalElement[] = [
  {
    route: '_frm-bg',
    label: 'Form Wrapper',
    highlightSelector: '[data-dev-_frm-bg]',
    hasTarget: true
  },
  // {
  //   route: '_frm',
  //   label: 'Form Container',
  //   highlightSelector: '[data-dev-_frm]',
  //   hasTarget: true
  // },
  {
    route: 'fld-wrp',
    label: 'Field Containers',
    highlightSelector: '[data-dev-fld-wrp]',
    hasTarget: true
  },
  {
    route: 'lbl-wrp',
    label: 'Label Containers',
    highlightSelector: '[data-dev-lbl-wrp]',
    hasTarget: true
  },
  {
    route: 'lbl',
    label: 'Labels',
    highlightSelector: '[data-dev-lbl]',
    hasTarget: true,
    children: [
      {
        route: 'lbl-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-lbl-pre-i]',
        hasTarget: true
      },
      {
        route: 'lbl-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-lbl-suf-i]',
        hasTarget: true
      },
      {
        route: 'req-smbl',
        label: 'Asterisk Icon',
        highlightSelector: '[data-dev-req-smbl]',
        hasTarget: true
      }
    ]
  },
  {
    route: 'sub-titl',
    label: 'Subtitles',
    highlightSelector: '[data-dev-sub-titl]',
    hasTarget: true,
    children: [
      {
        route: 'sub-titl-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-sub-titl-pre-i]',
        hasTarget: true
      },
      {
        route: 'sub-titl-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-sub-titl-suf-i]',
        hasTarget: true
      }
    ]
  },
  {
    route: 'fld',
    label: 'Inputs',
    highlightSelector: '[data-dev-fld]',
    hasTarget: true,
    children: [
      {
        route: 'pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-pre-i]',
        hasTarget: true
      },
      {
        route: 'suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-suf-i]',
        hasTarget: true
      },
      {
        route: 'fld::placeholder',
        label: 'Placeholder Text',
        highlightSelector: '[data-dev-fld-placeholder]',
        hasTarget: false
      }
    ]
  },
  {
    route: 'hlp-txt',
    label: 'Helper Texts',
    highlightSelector: '[data-dev-hlp-txt]',
    hasTarget: true,
    children: [
      {
        route: 'hlp-txt-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-hlp-txt-pre-i]',
        hasTarget: true
      },
      {
        route: 'hlp-txt-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-hlp-txt-suf-i]',
        hasTarget: true
      }
    ]
  },
  {
    route: 'err-msg',
    label: 'Error Messages',
    highlightSelector: '[data-dev-err-msg]',
    hasTarget: true,
    children: [
      {
        route: 'err-txt-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-err-txt-pre-i]',
        hasTarget: true
      },
      {
        route: 'err-txt-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-err-txt-suf-i]',
        hasTarget: true
      }
    ]
  },
  {
    route: 'btn',
    label: 'Buttons',
    highlightSelector: '[data-dev-btn]',
    hasTarget: true,
    children: [
      {
        route: 'btn-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-btn-pre-i]',
        hasTarget: true
      },
      {
        route: 'btn-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-btn-suf-i]',
        hasTarget: true
      }
    ]
  }
]

// Multi-step elements hierarchy
export const MULTI_STEP_ELEMENTS_HIERARCHY: HierarchicalElement[] = [
  {
    route: 'multi-step/stp-hdr-wrpr',
    label: 'Step Header Wrapper',
    highlightSelector: '[data-dev-stp-hdr-wrpr]',
    hasTarget: true
  },
  {
    route: 'multi-step/stp-hdr',
    label: 'Step Header',
    highlightSelector: '[data-dev-stp-hdr]',
    hasTarget: true
  },
  {
    route: 'multi-step/stp-icn-cntn',
    label: 'Header Icon',
    highlightSelector: '[data-dev-stp-icn-cntn]',
    hasTarget: true
  },
  {
    route: 'multi-step/stp-hdr-lbl',
    label: 'Header Label',
    highlightSelector: '[data-dev-stp-hdr-lbl]',
    hasTarget: true,
    children: [
      {
        route: 'multi-step/stp-lbl-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-stp-lbl-pre-i]',
        hasTarget: true
      },
      {
        route: 'multi-step/stp-lbl-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-stp-lbl-suf-i]',
        hasTarget: true
      }
    ]
  },
  {
    route: 'multi-step/stp-hdr-sub-titl',
    label: 'Header Subtitle',
    highlightSelector: '[data-dev-stp-hdr-sub-titl]',
    hasTarget: true,
    children: [
      {
        route: 'multi-step/stp-sub-titl-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-stp-sub-titl-pre-i]',
        hasTarget: true
      },
      {
        route: 'multi-step/stp-sub-titl-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-stp-sub-titl-suf-i]',
        hasTarget: true
      }
    ]
  },
  {
    route: 'multi-step/stp-wrpr',
    label: 'Step Wrapper',
    highlightSelector: '[data-dev-stp-wrpr]',
    hasTarget: true
  },
  {
    route: 'multi-step/stp-progress-wrpr',
    label: 'Progress Wrapper',
    highlightSelector: '[data-dev-stp-progress-wrpr]',
    hasTarget: true
  },
  {
    route: 'multi-step/stp-progress-bar',
    label: 'Progress Bar',
    highlightSelector: '[data-dev-stp-progress-bar]',
    hasTarget: true
  },
  {
    route: 'multi-step/stp-cntnt',
    label: 'Step Content',
    highlightSelector: '[data-dev-stp-cntnt]',
    hasTarget: true
  },
  {
    route: 'multi-step/stp-btn-wrpr',
    label: 'Button Wrapper',
    highlightSelector: '[data-dev-stp-btn-wrpr]',
    hasTarget: true
  },
  {
    route: 'multi-step/prev-step-btn',
    label: 'Previous Button',
    highlightSelector: '[data-dev-prev-step-btn]',
    hasTarget: true,
    children: [
      {
        route: 'multi-step/prev-step-btn-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-prev-step-btn-pre-i]',
        hasTarget: true
      },
      {
        route: 'multi-step/prev-step-btn-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-prev-step-btn-suf-i]',
        hasTarget: true
      }
    ]
  },
  {
    route: 'multi-step/next-step-btn',
    label: 'Next Button',
    highlightSelector: '[data-dev-next-step-btn]',
    hasTarget: true,
    children: [
      {
        route: 'multi-step/next-step-btn-pre-i',
        label: 'Prefix Icon',
        highlightSelector: '[data-dev-next-step-btn-pre-i]',
        hasTarget: true
      },
      {
        route: 'multi-step/next-step-btn-suf-i',
        label: 'Suffix Icon',
        highlightSelector: '[data-dev-next-step-btn-suf-i]',
        hasTarget: true
      }
    ]
  }
]

// Field-specific element hierarchy for Individual Elements
export interface FieldElementHierarchy {
  route: string
  label: string
  level: number
  isCollapsible?: boolean
  children?: FieldElementHierarchy[]
}

export const getFieldElementsHierarchy = (fldType: string): FieldElementHierarchy[] => {
  const baseElements: FieldElementHierarchy[] = [
    {
      route: 'lbl',
      label: 'Labels',
      level: 2,
      isCollapsible: true,
      children: [
        { route: 'lbl-wrp', label: 'Label Container', level: 3 },
        { route: 'lbl', label: 'Label', level: 3 }
      ]
    },
    {
      route: 'lbl-wrp',
      label: 'Label Containers',
      level: 2,
      isCollapsible: true,
      children: [
        { route: 'lbl-wrp', label: 'Container', level: 3 }
      ]
    },
    {
      route: 'sub-titl',
      label: 'Subtitles',
      level: 2,
      isCollapsible: true,
      children: [
        { route: 'sub-titl', label: 'Subtitle', level: 3 }
      ]
    },
    {
      route: 'fld',
      label: 'Input',
      level: 2
    }
  ]

  // Add error message for most field types
  if (!fldType.match(/^(button|divider|spacer|title|image|html|razorpay|paypal|recaptcha|section|repeater|turnstile|hcaptcha)$/)) {
    baseElements.push({
      route: 'err-msg',
      label: 'Error Message',
      level: 2
    })
  }

  return baseElements
}

// Badge generation helper
export const generateFieldBadge = (index: number): string => {
  return `bl-${index + 2}`
}

// Configuration for dropdown-like fields (select, currency, phone, country)
export const DROPDOWN_FIELD_CONFIG = {
  select: {
    wrapperLabel: 'Dropdown Field Wrapper',
    wrapperKey: 'dpd-fld-wrp',
    selectedImageLabel: 'Selected Option Image',
    selectedImageKey: 'selected-opt-img',
    selectedLabelText: 'Selected Option Label',
    selectedLabelKey: 'selected-opt-lbl',
    optionLabel: 'Option',
    optionIconLabel: 'Option Icon',
    optionLabelText: 'Option Label',
    hasChips: true
  },
  currency: {
    wrapperLabel: 'Currency Field Wrapper',
    wrapperKey: 'currency-fld-wrp',
    selectedImageLabel: 'Selected Currency Image',
    selectedImageKey: 'selected-currency-img',
    inputLabel: 'Currency Amount Input',
    inputKey: 'currency-amount-input',
    optionLabel: 'Currency Option',
    optionIconLabel: 'Currency Option Icon',
    optionLabelText: 'Currency Option Label',
    hasSuffix: true
  },
  'phone-number': {
    wrapperLabel: 'Phone Field Wrapper',
    wrapperKey: 'phone-fld-wrp',
    selectedImageLabel: 'Selected Country Image',
    selectedImageKey: 'selected-phone-img',
    inputLabel: 'Phone Number Input',
    inputKey: 'phone-number-input',
    optionLabel: 'Phone Number Option',
    optionIconLabel: 'Phone Option Icon',
    optionLabelText: 'Phone Option Label',
    hasSuffix: true
  },
  country: {
    wrapperLabel: 'Country Field Wrapper',
    wrapperKey: 'country-fld-wrp',
    selectedImageLabel: 'Selected Country Image',
    selectedImageKey: 'selected-country-img',
    selectedLabelText: 'Selected Country Label',
    selectedLabelKey: 'selected-country-lbl',
    optionLabel: 'Country Option',
    optionIconLabel: 'Country Option Icon',
    optionLabelText: 'Country Option Label'
  }
}