const labelCssProps = {
  background: {
    background: true,
    'background-image': true,
    'background-position': true,
    'background-repeat': true,
    'background-size': true,
  },
  border: {
    'border-style': true,
    'border-color': true,
    'border-width': true,
    'border-radius': true,
  },
  color: '',
  'font-size': '',
  'font-weight': '',
  'font-style': '',
  'text-align': '',
  'text-decoration': {
    'text-decoration-line': true,
    'text-decoration-style': true,
    'text-decoration-color': true,
    'text-decoration-thickness': true,
  },
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
  border: {
    'border-style': true,
    'border-color': true,
    'border-width': true,
    'border-radius': true,
  },
  margin: '5px',
  padding: '5px',
  opacity: '100%',
  height: '',
  width: '',
  size: { width: '100%', height: '100%' },
  'box-shadow': '',
  filter: '',
  'backdrop-filter': '',
  transition: '',
  background: {
    background: true,
    'background-image': true,
    'background-position': true,
    'background-repeat': true,
    'background-size': true,
  },
  'color(filter)': { filter: '', 'icon-color': '' },
}

const fieldWrpCssProps = {
  background: {
    background: true,
    'background-image': true,
    'background-position': true,
    'background-repeat': true,
    'background-size': true,
  },
  'background-color': '',
  border: {
    'border-style': true,
    'border-color': true,
    'border-width': true,
    'border-radius': true,
  },
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
  transform: '',
  transition: '',
}

const textFldCssProps = {
  'fld-wrp': {
    states: ['hover'],
    properties: {
      ...fieldWrpCssProps,
      'text-decoration': {
        'text-decoration-line': true,
        'text-decoration-style': true,
        'text-decoration-color': true,
        'text-decoration-thickness': true,
      },
    },
  },
  fld: {
    states: ['hover', 'focus', 'disabled', 'read-only'],
    properties: {
      ...fieldWrpCssProps,
      'accent-color': '',
    },
  },
  'lbl-wrp': {
    states: ['hover'],
    properties: { ...fieldWrpCssProps },
  },
  lbl: {
    states: ['hover'],
    properties: { ...labelCssProps, 'white-space': '' },
  },
  'lbl-pre-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'lbl-suf-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'req-smbl': {
    states: ['hover'],
    properties: { ...labelCssProps },
  },
  'pre-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'suf-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'sub-titl': {
    states: ['hover'],
    properties: { ...labelCssProps },
  },
  'title-pre-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'title-suf-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'sub-titl-pre-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'sub-titl-suf-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'hlp-txt': {
    states: ['hover'],
    properties: { ...labelCssProps },
  },
  'hlp-txt-pre-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'hlp-txt-suf-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'err-msg': {
    states: ['hover'],
    properties: { ...labelCssProps },
  },
  'err-txt': {
    states: ['hover'],
    properties: { ...labelCssProps },
  },
  'err-txt-pre-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  'err-txt-suf-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
}

const buttonCssProps = {
  background: {
    background: true,
    'background-image': true,
    'background-position': true,
    'background-repeat': true,
    'background-size': true,
  },
  border: {
    'border-style': true,
    'border-color': true,
    'border-width': true,
    'border-radius': true,
  },
  outline: {
    outline: true,
    'outline-offset': true,
  },
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
  'text-decoration': {
    'text-decoration-line': true,
    'text-decoration-style': true,
    'text-decoration-color': true,
    'text-decoration-thickness': true,
  },
}

const chackProps = {
  margin: '',
  padding: '',
  background: {
    background: true,
    'background-image': true,
    'background-position': true,
    'background-repeat': true,
    'background-size': true,
  },
  border: {
    'border-style': true,
    'border-color': true,
    'border-width': true,
    'border-radius': true,
  },
  width: '',
  height: '',
  transition: '',
  shadow: '',
  color: '',
  'min-width': '',
  'min-height': '',
}
const formCommonCssProps = {
  background: {
    background: true,
    'background-image': true,
    'background-position': true,
    'background-repeat': true,
    'background-size': true,
  },
  'background-color': '',
  color: '',
  padding: '5px',
  margin: '5px',
  border: {
    'border-style': true,
    'border-color': true,
    'border-width': true,
    'border-radius': true,
  },
  outline: {
    outline: true,
    'outline-offset': true,
  },
  'box-shadow': '0px 5px 15px 2px hsla(0, 0%, 0%, 35%)',
  transition: '',
}
const editorConfig = {
  // TODO: _frm-bg
  '_frm-bg': {
    states: ['hover'],
    properties: { ...formCommonCssProps },
  },
  // TODO: _frm
  _frm: {
    states: ['hover'],
    properties: { ...formCommonCssProps },
  },
  'stp-hdr-wrpr': {
    states: ['hover'],
    properties: { ...formCommonCssProps },
  },
  'stp-hdr': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: { ...formCommonCssProps },
  },
  'stp-icn-cntn': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: { ...formCommonCssProps },
  },
  'stp-hdr-lbl': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: { ...formCommonCssProps },
  },
  'stp-hdr-sub-titl': {
    states: ['hover', 'active', 'disabled', 'completed'],
    properties: { ...formCommonCssProps },
  },
  'stp-wrpr': {
    states: ['hover'],
    properties: { ...formCommonCssProps },
  },
  'stp-progress-wrpr': {
    states: [],
    properties: { ...formCommonCssProps },
  },
  'stp-progress-bar': {
    states: [],
    properties: { ...formCommonCssProps },
  },
  'stp-cntn': {
    states: ['hover'],
    properties: { ...formCommonCssProps },
  },
  'stp-btn-wrpr': {
    states: ['hover'],
    properties: { ...formCommonCssProps },
  },
  'prev-step-btn': {
    states: ['hover', 'focus', 'active', 'disabled'],
    properties: { ...buttonCssProps },
  },
  'next-step-btn': {
    states: ['hover', 'focus', 'active', 'disabled'],
    properties: { ...buttonCssProps },
  },
  // TODO: quick-tweaks
  'quick-tweaks': {
    properties: {
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
    },
  },
  // for input fields
  fld: {
    properties: {
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
    },
  },
  // TODO: field-containers
  'field-containers': {
    states: ['hover'],
    properties: {
      background: {
        background: true,
        'background-image': true,
        'background-position': true,
        'background-repeat': true,
        'background-size': true,
      },
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
    },
  },
  // TODO: label-containers
  'label-containers': {
    states: ['hover'],
    properties: {
      background: {
        background: true,
        'background-image': true,
        'background-position': true,
        'background-repeat': true,
        'background-size': true,
      },
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
    },
  },
  // TODO: lbl
  lbl: {
    states: ['hover'],
    properties: {
      background: {
        background: true,
        'background-image': true,
        'background-position': true,
        'background-repeat': true,
        'background-size': true,
      },
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
    },
  },
  // TODO: lbl-pre-i
  'lbl-pre-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: lbl-suf-i
  'lbl-suf-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: sub-titl
  'sub-titl': {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  // TODO: sub-titl-pre-i
  'sub-titl-pre-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: sub-titl-suf-i
  'sub-titl-suf-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: hlp-txt
  'hlp-txt': {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  // TODO: hlp-txt-pre-i
  'hlp-txt-pre-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: hlp-txt-suf-i
  'hlp-txt-suf-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: err-msg
  'err-msg': {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  // TODO: err-txt-pre-i
  'err-txt-pre-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: err-txt-suf-i
  'err-txt-suf-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: btn
  btn: {
    states: ['hover'],
    properties: {
      'background-color': '',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      color: '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      padding: '5px',
      margin: '5px',
      'box-shadow': '',
    },
  },
  // TODO: btn-pre-i
  'pre-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: suf-i
  'suf-i': {
    states: ['hover'],
    properties: {
      padding: '5px',
      margin: '5px',
      border: {
        'border-style': true,
        'border-color': true,
        'border-width': true,
        'border-radius': true,
      },
      'box-shadow': '',
      height: '',
      width: '',
    },
  },
  // TODO: btn-suf-i
  'btn-pre-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  // TODO: btn-suf-i
  'btn-suf-i': {
    states: ['hover'],
    properties: { ...iconCssProps },
  },
  defaultProps: {
    margin: '0px',
    padding: '0px',
    border: '',
  },
  texfieldStyle: {
    states: ['hover'],
    properties: {
      background: {
        background: true,
        'background-image': true,
        'background-position': true,
        'background-repeat': true,
        'background-size': true,
      },
      'background-color': '',
      color: '',
      'font-size': '',
      border: { width: true, color: true, radius: true },
      margin: '5px',
      padding: '5px',
      opacity: '100%',
      'text-align': '',
      'text-decoration': {
        'text-decoration-line': true,
        'text-decoration-style': true,
        'text-decoration-color': true,
        'text-decoration-thickness': true,
      },
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
  text: { ...textFldCssProps },
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
  check: {
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
    'other-inp': {
      states: ['hover', 'focus'],
      properties: { ...fieldWrpCssProps },
    },

  },
  'decision-box': {
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

  },
  gdpr: {
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

  },
  radio: {
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
    'other-inp': {
      states: ['hover', 'focus'],
      properties: { ...fieldWrpCssProps },
    },
  },
  hidden: { ...textFldCssProps },
  title: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    logo: {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'titl-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        width: '',
      },
    },
    title: {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'sub-titl': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'title-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'title-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'sub-titl-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'sub-titl-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
  },
  spacer: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
  divider: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    divider: {
      states: ['hover'],
      properties: {
        border: {
          'border-bottom': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        'border-image': {
          'border-image': true,
          'border-image-slice': true,
          'border-image-width': true,
          'border-image-outset': true,
          'border-image-repeat': true,
        },
        margin: '5px',
        opacity: '100%',
        'box-shadow': '',
        transition: '',
      },
    },
  },
  image: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    img: {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
  },
  stripe: {
    'stripe-btn': {
      states: ['hover', 'focus', 'active'],
      properties: { ...buttonCssProps },
    },
    'stripe-icn': {
      // states: ['hover', 'focus', 'active'],
      properties: {
        width: '',
        height: '',
      },
    },
    'stripe-wrp .stripe-pay-btn': {
      states: ['hover', 'focus', 'active'],
      properties: { ...buttonCssProps },
    },
  },
  mollie: {
    'mollie-btn': {
      states: ['hover', 'focus', 'active'],
      properties: { ...buttonCssProps },
    },
    'mollie-icn': {
      properties: {
        width: '',
        height: '',
      },
    },
  },
  button: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    btn: {
      states: ['hover', 'focus'],
      properties: { ...buttonCssProps },
    },
    'btn-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'btn-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'hlp-txt': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'hlp-txt-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'hlp-txt-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
  },
  'advanced-file-up': {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    fld: {
      states: ['hover', 'focus'],
      properties: { ...fieldWrpCssProps },
    },
    'lbl-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    lbl: {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'lbl-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'lbl-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'hlp-txt': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'hlp-txt-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'hlp-txt-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'err-msg': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'err-txt': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'err-txt-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'err-txt-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'inp-wrp .filepond--root': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    'inp-wrp .filepond--drop-label': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'inp-wrp .filepond--label-action': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'inp-wrp .filepond--panel-root': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    'inp-wrp .filepond--item-panel': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    'inp-wrp .filepond--file-action-button': {
      states: ['hover'],
      properties: { ...buttonCssProps },
    },
    'inp-wrp .filepond--drip-blob': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'inp-wrp .filepond--file': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
  },
  'file-up': {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    'lbl-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    lbl: {
      states: ['hover'],
      properties: { ...labelCssProps, 'white-space': '' },
    },
    'lbl-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'lbl-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'sub-titl': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'sub-titl-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'sub-titl-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'inp-btn': {
      states: ['hover', 'focus'],
      properties: { ...buttonCssProps },
    },
    'pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'file-up-wrpr': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    'btn-txt': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'file-select-status': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'max-size-lbl': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'file-input-wrpr .files-list': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    'file-input-wrpr .file-wrpr': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
    'file-input-wrpr .file-preview': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'file-input-wrpr .file-title': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'file-input-wrpr .file-size': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'file-input-wrpr .cross-btn': {
      states: ['hover'],
      properties: { ...buttonCssProps },
    },
    'file-input-wrpr .err-wrp': {
      states: ['hover'],
      properties: { ...buttonCssProps },
    },

    'err-msg': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'err-txt': {
      states: ['hover'],
      properties: { ...labelCssProps },
    },
    'err-txt-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'err-txt-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
  },
  recaptcha: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
  turnstile: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
  hcaptcha: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
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
  html: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
  shortcode: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
  currency: {
    ...textFldCssProps,
    'currency-fld-wrp': {
      states: ['hover', 'focus', 'active'],
      properties: {
        ...fieldWrpCssProps,
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        transition: '',
      },
    },
    'dpd-wrp': {
      states: ['hover', 'focus'],
      properties: { ...fieldWrpCssProps },
    },
    'selected-currency-img': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        height: '',
        width: '',
        margin: '',
        padding: '',
        'box-shadow': '',
        'background-color': '',
      },
    },
    'currency-amount-input': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
        'line-height': '',
      },
    },
    'opt-search-input': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
        'line-height': '',
      },
    },
    'option-search-wrp': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'opt-search-icn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        stroke: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'input-clear-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'search-clear-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        stroke: '',
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list': {
      states: ['hover', 'focus'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'option-list .option': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        width: '',
        height: '',
        'box-shadow': '',
      },
    },
    'option-list .opt-lbl-wrp': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        width: '',
        height: '',
        'box-shadow': '',
      },
    },
    'option-list .opt-icn': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        width: '',
        height: '',
        'box-shadow': '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list .opt-lbl': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'option-list .opt-suffix': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
  },
  'phone-number': {
    ...textFldCssProps,
    'phone-fld-wrp': {
      states: ['hover', 'focus', 'active'],
      properties: {
        ...fieldWrpCssProps,
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        transition: '',
      },
    },
    'dpd-wrp': {
      states: ['hover', 'focus'],
      properties: { ...fieldWrpCssProps },
    },
    'option-search-wrp': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        height: '',
        width: '',
        margin: '',
        padding: '',
        'box-shadow': '',
        'background-color': '',
      },
    },
    'selected-country-img': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        height: '',
        width: '',
        margin: '',
        padding: '',
        'box-shadow': '',
        'background-color': '',
      },
    },
    'phone-number-input': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
        'line-height': '',
      },
    },
    'opt-search-input': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
        'line-height': '',
      },
    },
    'opt-search-icn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        stroke: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'input-clear-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'search-clear-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        stroke: '',
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list': {
      states: ['hover', 'focus'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'option-list .option': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        width: '',
        height: '',
        'box-shadow': '',
      },
    },
    'option-list .opt-lbl-wrp': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'option-list .opt-icn': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        width: '',
        height: '',
        'box-shadow': '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list .opt-lbl': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'option-list .opt-suffix': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
  },
  paypal: {
    'fld-wrp': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
  razorpay: {
    'fld-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': {
          'text-decoration-line': true,
          'text-decoration-style': true,
          'text-decoration-color': true,
          'text-decoration-thickness': true,
        },
      },
    },
    'razorpay-btn': {
      states: ['before'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        'min-width': '',
        height: '',
        'border-radius': '',
        'text-align': '',
        'font-style': '',
        'background-color': '',
        'box-shadow': '',
        width: '',
        transform: 'skew(-15deg, 0)',
      },
    },
    'razorpay-btn-text': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        'min-width': '',
        height: '',
        margin: '',
        padding: '',
        'border-radius': '',
        'text-align': '',
        'font-style': '',
        'background-color': '',
        'box-shadow': '',
        width: '',
      },
    },
    'razorpay-btn-title': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        'min-width': '',
        height: '',
        width: '',
        margin: '',
        padding: '',
        'border-radius': '',
        'text-align': '',
        'font-style': '',
        'font-size': '',
        'font-weight': '',
        'background-color': '',
        'box-shadow': '',
        'white-space': '',
        'line-height': '',
        'word-spacing': '',
        'letter-spacing': '',
      },
    },
    'razorpay-btn-sub-title': {
      states: [],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        'min-width': '',
        height: '',
        width: '',
        margin: '',
        padding: '',
        'border-radius': '',
        'text-align': '',
        'font-style': '',
        'font-size': '',
        'font-weight': '',
        'background-color': '',
        'box-shadow': '',
        'white-space': '',
        'line-height': '',
        'word-spacing': '',
        'letter-spacing': '',
      },
    },
  },
  country: {
    ...textFldCssProps,
    'country-fld-wrp': {
      states: ['hover', 'focus', 'active'],
      properties: {
        ...fieldWrpCssProps,
        transition: '',
      },
    },
    'selected-country-img': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        height: '',
        width: '',
        margin: '',
        padding: '',
        'box-shadow': '',
        'background-color': '',
      },
    },
    'selected-country-lbl': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'option-search-wrp': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'opt-search-input': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'opt-search-icn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        stroke: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'inp-clr-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'search-clear-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        stroke: '',
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list': {
      states: ['hover', 'focus'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'option-list .option': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        width: '',
        height: '',
        'box-shadow': '',
      },
    },
    'option-list .opt-lbl-wrp': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        width: '',
        height: '',
        'box-shadow': '',
      },
    },
    'option-list .opt-icn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        width: '',
        height: '',
        'box-shadow': '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list .opt-lbl': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
  },
  select: {
    ...textFldCssProps,
    'dpd-fld-wrp': {
      states: ['hover', 'focus', 'active'],
      properties: {
        ...fieldWrpCssProps,
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        transition: '',
      },
    },
    'selected-opt-img': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        height: '',
        width: '',
        margin: '',
        padding: '',
        'box-shadow': '',
        'background-color': '',
      },
    },
    'selected-opt-lbl': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'selected-opt-clear-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        stroke: '',
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'option-search-wrp': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'opt-search-input': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'opt-search-icn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        stroke: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'inp-clr-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'search-clear-btn': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        background: {
          background: true,
          'background-image': true,
          'background-position': true,
          'background-repeat': true,
          'background-size': true,
        },
        stroke: '',
        width: '',
        height: '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list': {
      states: ['hover', 'focus'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'option-list .option': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        'background-color': '',
        width: '',
        height: '',
        'box-shadow': '',
      },
    },
    'option-list .opt-lbl-wrp': {
      states: ['hover', 'focus'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'option-list .opt-icn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
        margin: '',
        padding: '',
        width: '',
        height: '',
        'box-shadow': '',
        filter: '',
        'backdrop-filter': '',
      },
    },
    'option-list .opt-lbl': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'selected-opt-lbl .chip-wrp': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'selected-opt-lbl .chip-lbl': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'selected-opt-lbl .chip-icn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
    'selected-opt-lbl .chip-clear-btn': {
      states: ['hover'],
      properties: {
        border: {
          'border-style': true,
          'border-color': true,
          'border-width': true,
          'border-radius': true,
        },
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
      },
    },
  },
  section: {
    ...textFldCssProps,
    'inp-fld-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': {
          'text-decoration-line': true,
          'text-decoration-style': true,
          'text-decoration-color': true,
          'text-decoration-thickness': true,
        },
      },
    },
  },
  repeater: {
    ...textFldCssProps,
    'inp-fld-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'rpt-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'rpt-grid-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'pair-btn-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': {
          'text-decoration-line': true,
          'text-decoration-style': true,
          'text-decoration-color': true,
          'text-decoration-thickness': true,
        },
      },
    },
    'rpt-add-btn': {
      states: ['hover', 'focus'],
      properties: { ...buttonCssProps },
    },
    'rpt-add-btn-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'rpt-add-btn-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'rpt-rmv-btn': {
      states: ['hover', 'focus'],
      properties: { ...buttonCssProps },
    },
    'rpt-rmv-btn-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'rpt-rmv-btn-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'add-to-end-btn': {
      states: ['hover', 'focus'],
      properties: { ...buttonCssProps },
    },
    'add-to-end-btn-pre-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'add-to-end-btn-suf-i': {
      states: ['hover'],
      properties: { ...iconCssProps },
    },
    'add-to-end-btn-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
        'text-decoration': {
          'text-decoration-line': true,
          'text-decoration-style': true,
          'text-decoration-color': true,
          'text-decoration-thickness': true,
        },
      },
    },
  },
  signature: {
    ...textFldCssProps,
    'inp-fld-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'signature-pad': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'clr-btn': {
      states: ['hover'],
      properties: {
        ...buttonCssProps,
      },
    },
    'clr-btn-pre-i': {
      states: ['hover'],
      properties: {
        ...iconCssProps,
      },
    },
    'clr-btn-suf-i': {
      states: ['hover'],
      properties: {
        ...iconCssProps,
      },
    },

    'undo-btn': {
      states: ['hover'],
      properties: {
        ...buttonCssProps,
      },
    },
    'undo-btn-pre-i': {
      states: ['hover'],
      properties: {
        ...iconCssProps,
      },
    },
    'undo-btn-suf-i': {
      states: ['hover'],
      properties: {
        ...iconCssProps,
      },
    },

  },
  rating: {
    ...textFldCssProps,
    'inp-fld-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'rating-wrp': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'rating-img': {
      states: ['hover', 'selected'],
      properties: { ...iconCssProps },
    },

    'rating-input': {
      states: ['hover', 'selected'],
      properties: { ...iconCssProps },
    },
    'rating-msg': {
      states: ['hover'],
      properties: { ...fieldWrpCssProps },
    },
  },
  'image-select': {
    ...textFldCssProps,
    ci: {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },
    },

    'inp-opt': {
      states: ['hover'],
      properties: {
        ...fieldWrpCssProps,
      },

    },
    'img-inp': {
      states: ['hover', 'checked', 'focus'],
      properties: {
        ...fieldWrpCssProps,
        outline: '',
      },
    },
    'img-wrp': {
      states: [],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'check-box': {
      states: [],
      properties: {
        ...fieldWrpCssProps,
      },
    },
    'check-img': {
      states: [],
      properties: {
        ...iconCssProps,
      },
    },
    'select-img': {
      states: [],
      properties: {
        ...fieldWrpCssProps,
        ...iconCssProps,
      },
    },

  },
  'advanced-datetime': { ...textFldCssProps },
}
export default editorConfig
