export default function conversationalWrapperDefaultStyles(formId) {
  return {

    [`._frm-bc${formId}`]: {
      height: '100%',
    },
    [`._frm-b${formId}`]: {
      display: 'grid',
      'grid-template-columns': 'repeat(60,minmax(1px,1fr))',
    },
    [`.bc${formId}-min-height`]: {
      'min-height': 'auto !important',
    },
    [`.bc${formId}-steps-container`]: {
      height: '100%',
      padding: '0px 0px 50px 0px',
    },
    [`.bit-conversational-form .bc${formId}-steps-container`]: {
      padding: '0px',
    },
    [`.bc${formId}-step-wrapper `]: {
      height: '100%',
      display: 'flex',
      background: `var(--bc${formId}-stp-bg-clr, transparent)`,
    },
    '@keyframes fade-down': {
      '0%': {
        opacity: 0,
        transform: 'translate3d(0,-100px,0)',
      },
      '100%': {
        opacity: '1',
        transform: 'none',
      },
    },

    '@keyframes fade-up': {
      '0%': {
        opacity: 0,
        transform: 'translate3d(0, 100px,0)',
      },
      '100%': {
        opacity: '1',
        transform: 'none',
      },
    },

    // progress style
    [`.bc${formId}-progress-cntnt`]: {
      gap: '5px',
      display: 'flex',
      'flex-direction': 'column',
      padding: '5px 15px',
      'min-width': '200px',
    },
    [`.bc${formId}-progress-lbl-wrpr`]: {
      'line-height': '1rem',
    },
    [`.bc${formId}-progress-lbl`]: {
      'font-size': '.8rem',
      color: `var(--bc${formId}-lbl-clr, #000)`,
    },
    [`.bc${formId}-progress-bar`]: {
      'background-color': `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), calc(var(--bc${formId}-a-l) - 5%), 0.3)`,
      'border-radius': '4px',
      width: '100%',
      height: '10px',
      margin: '0',
      padding: '0',
      overflow: 'auto',
    },
    [`.bc${formId}-progress-fill`]: {
      'background-color': `var(--bc${formId}-a-clr, #0062ff)`,
      height: '100%',
      transition: 'width 0.3s ease-in-out',
    },

    // navigation style
    [`.bc${formId}-nav-wrpr`]: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      'font-weight': '300',
    },
    [`.bit-conversational-form .bc${formId}-nav-wrpr`]: {
      position: 'fixed',
      width: '100%',
    },
    [`.bc${formId}-nav-wrpr-cntnt`]: {
      'align-content': 'center',
      'align-items': 'center',
      background: 'hsla(0,0%,100%,.3)',
      'border-radius': '8px',
      'box-shadow': '0 3px 12px 0 rgba(0,0,0,.1)',
      display: 'flex',
      'flex-direction': 'row',
      float: 'right',
      'justify-content': 'flex-start',
      'margin-bottom': '5px',
      'margin-right': '5px',
      padding: '0',
      'pointer-events': 'auto',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      'user-select': 'none',
      'white-space': 'nowrap',
      overflow: 'auto',
    },
    [`.bc${formId}-nav-btn-cntnt`]: {
      display: 'flex',
      gap: '5px',
    },
    [`.bc${formId}-nav-btn-container`]: {
      display: 'flex',
      padding: '5px 10px',
      background: `var(--bc${formId}-a-clr, #0062ff)`,
      gap: '5px',
      'align-items': 'center',
    },
    [`.bc${formId}-branding-wrpr`]: {
      display: 'flex',
      gap: '5px',
      color: '#fff',
    },
    [`.bc${formId}-prowered-by-lbl`]: {
      'font-size': '.6rem',
      display: 'block',
    },
    [`.bc${formId}-bit-form-lbl`]: {
      'font-size': '1rem',
      display: 'block',
      'line-height': '1rem',
    },

    // navigation button style
    [`.bc${formId}-nav-btn`]: {
      'background-color': 'transparent',
      'border-radius': '50%',
      'border-style': 'solid',
      'border-width': '2px',
      'box-shadow': 'none',
      'border-color': '#fff',
      cursor: 'pointer',
      display: 'inline-flex',
      width: '30px',
      height: '30px',
      'justify-content': 'center',
      'align-items': 'center',
      color: 'white',
    },
    [`.bc${formId}-nav-btn:hover`]: {
      'background-color': `hsl(var(--bc${formId}-a-h), var(--bc${formId}-a-s), calc(var(--bc${formId}-a-l) - 5%)) !important`,
    },
    [`.bc${formId}-nav-btn:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-a-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`.bc${formId}-nav-btn:active:focus-visible`]: {
      'outline-offset': 0,
    },
    [`.bc${formId}-nav-btn:disabled`]: {
      opacity: '0.5',
      cursor: 'default',
    },
    [`.bc${formId}-nav-btn-down`]: {
      transform: 'rotate(180deg)',
    },

    // step style
    '.bc-step-fade-up': {
      animation: 'fade-up 0.5s ease-in-out',
    },
    '.bc-step-fade-down': {
      animation: 'fade-down 0.5s ease-in-out',
    },
    [`.bc${formId}-step-fld-wrpr`]: {
      'max-height': 'calc(100vh - 120px)',
      width: '50%',
      padding: '20px 30px',
      'overflow-x': 'hidden',
    },
    '.bc-grid-hide': {
      'grid-template-rows': '0fr !important',
    },
    '.bc-step-deactive': {
      display: 'initial',
      left: '-99999px',
      position: 'absolute',
      top: '-99999px',
    },
    [`.bc${formId}-step-content`]: {
      width: '100%',
      'align-items': 'center',
      display: 'flex',
      'flex-basis': '50%',
      'flex-direction': 'row',
      'flex-grow': 1,
      'justify-content': 'space-between',
    },
    [`.normal-layout .bc${formId}-step-content`]: {
      'justify-content': 'center',
    },
    [`.compact-right-layout .bc${formId}-step-content`]: {
      'flex-direction': 'row-reverse',
    },
    [`.padding-right-layout .bc${formId}-step-content`]: {
      'flex-direction': 'row-reverse',
    },
    [`.bc${formId}-step-img-cntnr`]: {
      width: '50%',
    },
    [`.bc${formId}-step-img-wrpr`]: {
      display: 'block',
      overflow: 'hidden',
      'text-align': 'center',
    },
    [`.bc${formId}-step-img`]: {
      height: '100%',
      width: '100%',
      display: 'block',
    },

    [`.bit-conversational-form .compact-left-layout .bc${formId}-step-img`]: {
      height: '100vh',
    },
    [`.bit-conversational-form .compact-right-layout .bc${formId}-step-img`]: {
      height: '100vh',
    },
    [`.bc${formId}-welcome-title`]: {
      color: `var(--bc${formId}-lbl-clr, #000)`,
      'font-size': '1.3rem',
      'font-weight': '700',
      'line-height': '1.2',
      'text-align': 'center',
    },
    [`.bc${formId}-welcome-description`]: {
      color: `var(--bc${formId}-lbl-clr, #000)`,
      'font-size': '1.5rem',
      'font-weight': '400',
      'line-height': '1.2',
      'text-align': 'center',
    },
    [`.bc${formId}-fld-container`]: {
      'max-height': 'calc(100vh - 100px)',
      'overflow-x': 'hidden',
      width: '50%',
    },
    [`.bc${formId}-fld-wrp`]: {
      display: 'block',
      'flex-direction': 'row',
      // 'background-color': 'transparent',
      background: 'transparent',
      padding: '0',
      margin: '0',
      position: 'relative',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-radius': '0',
      'border-width': '0',
      width: 'width',
    },
    [`.bc${formId}-lbl-wrp`]: {
      width: 'auto',
      'align-self': 'auto',
      margin: '0px 0px 5px 0px',
      padding: '0',
      'background-color': 'none',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-radius': '0',
      'border-width': '0',
    },
    [`.bc${formId}-lbl`]: {
      'background-color': 'none',
      color: `var(--bc${formId}-lbl-clr, #000)`,
      'font-size': `var(--bc${formId}-lbl-fs, 2rem)`,
      display: 'flex',
      'align-items': 'center',
      // 'text-align': 'initial',
      'justify-content': 'initial',
      margin: '0',
      padding: '0',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-radius': '0',
      'border-width': '0',
      width: '100%',
      'font-weight': `var(--bc${formId}-lbl-fw, 400)`,
      'font-style': 'style',
      position: 'unset',
    },
    [`.bc${formId}-req-smbl`]: {
      color: `var(--bc${formId}-lbl-clr, #000)`,
      'font-size': `var(--bc${formId}-lbl-fs, 2rem)`,
      margin: '0',
      padding: '0',
      'font-weight': `var(--bc${formId}-lbl-fw, 500)`,
      'line-height': '12px',
    },
    [`.bc${formId}-sub-titl`]: {
      'background-color': 'none',
      color: `var(--bc${formId}-sub-titl-clr, #000)`,
      'font-size': `var(--bc${formId}-sub-titl-fs, 1rem)`,
      display: 'flex',
      'align-items': 'center',
      // 'text-align': 'initial',
      'justify-content': 'initial',
      padding: '3px 0',
      margin: '2px 0px 0px 0px',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-radius': '0',
      'border-width': '0',
      width: '100%',
      'font-weight': `var(--bc${formId}-sub-titl-fw, 400)`,
      'font-style': 'style',
    },
    [`.bc${formId}-hlp-txt`]: {
      'background-color': 'none',
      color: `var(--bc${formId}-hlp-txt-clr, #000)`,
      'font-size': `var(--bc${formId}-hlp-txt-fs, 1rem)`,
      display: 'flex',
      'align-items': 'center',
      // 'text-align': 'init',
      'justify-content': 'initial',
      padding: '3px 0',
      margin: '2px 0px 0px 0px',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-radius': '0',
      'border-width': '0',
      width: '100%',
      'font-weight': `var(--bc${formId}-hlp-txt-fw, 400)`,
      'font-style': 'style',
    },

    [`.bc${formId}-inp-wrp`]: { width: '100%' },

    [`.bc${formId}-lbl-pre-i`]: {
      width: '25px',
      height: '25px',
      margin: '0px 0px 0px 3px',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-lbl-suf-i`]: {
      width: '25px',
      height: '25px',
      margin: 'm',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-sub-titl-pre-i`]: {
      width: '25px',
      height: '25px',
      margin: '0px 0px 0px 3px',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-sub-titl-suf-i`]: {
      width: '25px',
      height: '25px',
      margin: 'm',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-hlp-txt-pre-i`]: {
      width: '25px',
      height: '25px',
      margin: '0px 0px 0px 3px',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-hlp-txt-suf-i`]: {
      width: '25px',
      height: '25px',
      margin: 'm',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-err-wrp`]: {
      transition: 'all .3s',
      display: 'grid',
      'grid-template-rows': '0fr',
    },
    [`.bc${formId}-err-inner`]: {
      overflow: 'hidden',
    },
    [`.bc${formId}-err-msg`]: {
      background: 'none',
      color: `var(--bc${formId}-err-msg-clr)`,
      'font-size': `var(--bc${formId}-err-msg-fs)`,
      'font-weight': `var(--bc${formId}-err-msg-fw)`,
      display: 'flex',
      'align-items': 'center',
      margin: '10px 0px 0px',
    },
    [`.bc${formId}-err-txt`]: {
      display: 'block',
    },
    [`.bc${formId}-err-txt-pre-i`]: {
      width: '25px',
      height: '25px',
      margin: '0px 0px 0px 3px',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-err-txt-suf-i`]: {
      width: '25px',
      height: '25px',
      margin: 'm',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-width': '0',
      'border-radius': '0',
    },
    [`.bc${formId}-inp-fld-wrp`]: { position: 'relative' },

    // button style
    [`.bc${formId}-step-btn-wrpr`]: {
      display: 'grid',
      'grid-template-rows': '1fr',
      transition: 'all .3s',
    },
    [`.bc-grid-hide .bc${formId}-step-btn-inner-wrpr`]: {
      overflow: 'hidden',
    },
    [`.bc${formId}-step-btn-cntnt`]: {
      'margin-top': '8px',
      display: 'flex',
      'flex-direction': 'row',
      'align-items': 'center',
    },

    [`.bc${formId}-welcome-content .bc${formId}-step-btn-cntnt`]: {
      'justify-content': 'center',
    },

    [`.bc${formId}-btn`]: {
      'font-size': '18px',
      padding: '8px 14px',
      background: `var(--bc${formId}-btn-bg-clr, #0062ff)`,
      color: `var(--bc${formId}-btn-txt-clr, #fff)`,
      'font-weight': '700',
      'border-style': 'none',
      'border-width': '0',
      'border-radius': '6px',
      cursor: 'pointer',
      'font-family': 'inherit',
      'line-height': '1',
      outline: 'none',
      display: 'flex',
      gap: '5px',
      'justify-content': 'center',
      'align-items': 'center',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    [`.bc${formId}-btn:hover`]: {
      background: `hsl(var(--bc${formId}-btn-bg-h), var(--bc${formId}-btn-bg-s), calc(var(--bc${formId}-btn-bg-l) - 5%)) !important`,
    },
    [`.bc${formId}-btn:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-btn-bg-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`.bc${formId}-btn:disabled`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      opacity: '0.5',
    },
    [`.bc${formId}-btn img`]: {
      width: '20px',
      height: '20px',
      filter: `var(--bc${formId}-btn-icn-fltr, invert(1))`,
    },
    [`.bc${formId}-step-hints`]: {
      'font-size': '14px',
      padding: '5px 10px',
      background: 'transparent',
      color: `hsla(var(--bc${formId}-btn-bg-h), var(--bc${formId}-btn-bg-s), calc(var(--bc${formId}-btn-bg-l) - 5%), 0.5)`,
    },
    [`.bc${formId}-step-hints:hover`]: {
      color: `hsla(var(--bc${formId}-btn-bg-h), var(--bc${formId}-btn-bg-s), calc(var(--bc${formId}-btn-bg-l) - 5%), 1)`,
    },

    '.bit-conversational-form .bf-form-msg': {
      position: 'absolute',
      left: '3px',
      bottom: '3px',
    },

    '.bc-form-msg-wrp': {
      height: '100%',
    },
    '.bc-form-msg': {
      padding: '5px 35px 5px 20px',
      'border-width': '1px',
      'border-style': 'solid',

      'border-radius': 'var(--g-bdr-rad)',
      width: '100%',
      height: '100%',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      margin: 'auto',
      position: 'relative',
      'word-break': 'break-all',
      'box-shadow': '0px 0px 0px 0px rgb(0 0 0 / 6%)',
    },
    '.bc-form-msg.success': {
      background: '#bdffd4e8',
      'border-color': '#bdffd4e8',
    },
    '.bc-form-msg.error': {
      background: '#ffbdbe',
      'border-color': '#ffbdbe',
    },

    // container query for less than 768px
    '@media (max-width: 767px)': {
      [`.bc${formId}-fld-wrp`]: {
        width: '100%',
      },
      [`.bc${formId}-lbl-wrp`]: {
        width: '100%',
      },
      [`.bc${formId}-inp-wrp`]: {
        width: '100%',
      },
      [`.bc${formId}-sub-titl`]: {
        'font-size': '1rem',
      },
      [`.bc${formId}-hlp-txt`]: {
        'font-size': '1rem',
      },
      [`.bc${formId}-lbl`]: {
        'font-size': '1.5rem',
      },
      [`.bc${formId}-req-smbl`]: {
        'font-size': '1.5rem',
      },
      [`.bc${formId}-err-msg`]: {
        'font-size': '1rem',
      },
      [`.bc${formId}-err-txt`]: {
        'font-size': '1rem',
      },
      [`.bc${formId}-btn`]: {
        'font-size': '16px',
      },
      [`.bc${formId}-step-hints`]: {
        'font-size': '12px',
      },
    },

  }
}
