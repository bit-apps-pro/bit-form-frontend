export default function decisionBoxDefaultStyle(formId) {
  return {
    [`.bc${formId}-fld-wrp`]: {
      display: 'var(--fld-wrp-dis, block)',
      'flex-direction': 'var(--fld-wrp-fdir, row)',
      'background-color': 'var(--fld-wrp-bg, transparent)',
      padding: 'var(--fld-wrp-p, 0)',
      margin: 'var(--fld-wrp-m, 0)',
      position: 'relative',
      'box-shadow': 'var(--fld-wrp-sh, none)',
      'border-style': 'var(--fld-wrp-bdr, medium)',
      'border-color': 'var(--fld-wrp-bdr-clr, none)',
      'border-radius': 'var(--fld-wrp-bdr-rad, 0)',
      'border-width': 'var(--fld-wrp-bdr-width, 0)',
    },

    [`.bc${formId}-inp-wrp`]: { /* width: 'var(--inp-wrp-width, auto)' */ },

    [`.bc${formId}-razorpay-wrp`]: {
      display: 'flex',
      'justify-content': 'center',
    },

    [`.bc${formId}-razorpay-btn`]: {
      cursor: 'pointer',
      position: 'relative',
      display: 'inline-block',
      ' min-width': '160px',
      height: '45px',
      'border-radius': ' 3px',
      'text-align': 'center',
      'font-style': 'italic',
      overflow: 'hidden',
      'background-color': 'hsla(216, 85%, 18%, 100%) !important',
      border: 'solid hsla(216, 85%, 18%, 100%)',
      'border-width': '1px',
      padding: '0px !important',
      // color: 'hsla(0, 0%, 100%, 100%)',
      'box-shadow': 'hsla(0, 0%, 0%, 0.1) 0px 4px 12px',
    },

    [`.bc${formId}-razorpay-btn::before`]: {
      content: '""',
      position: 'absolute',
      left: '-1em',
      top: 0,
      width: '46px',
      height: '100%',
      'background-color': 'hsla(224, 68%, 37%, 100%)',
      'border-radius': '2px 0 0 2px',
      transform: 'skewX(-15deg)',
    },

    [`.bc${formId}-razorpay-btn svg`]: {
      position: 'absolute',
      left: 0,
      top: '50%',
      margin: '0px 7px',
      transform: 'translateY(-50%)',
      width: '23px',
      height: '25px',
    },

    [`.bc${formId}-razorpay-btn-text`]: {
      padding: '4px 28px 4px 60px',
      margin: '1px 0px',
      color: 'hsla(0, 0%, 100%, 100%)',
      display: 'flex',
      'flex-direction': 'column',
    },

    [`.bc${formId}-razorpay-btn-title`]: {
      display: 'block',
      'min-height': '18px',
      'line-height': '18px',
      'font-size': '16px',
      'font-weight': '800',
      opacity: '0.95',
    },

    [`.bc${formId}-razorpay-btn-sub-title`]: {
      opacity: '0.6',
      'font-size': '8px',
    },
  }
}
