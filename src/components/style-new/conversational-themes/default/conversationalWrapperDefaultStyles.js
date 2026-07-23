export default function conversationalWrapperDefaultStyles(formId) {
  return {

    [`._frm-bc${formId}`]: {
      height: '100%',
      // Phase 5: container queries — sizes respond to the form's own width, not the
      // viewport. Critical when the form is shortcoded into narrow widgets on wide
      // viewports. Browsers without container-query support (Safari <16, Firefox <110)
      // fall back to the @media block at the bottom of this stylesheet.
      'container-type': 'inline-size',
      'container-name': 'bf-conv',
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
      position: 'relative',
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

    // Transition Type keyframes (Phase 2). Scoped via .bf-trans-* on the steps container.
    '@keyframes bf-slide-up': {
      '0%': { opacity: 0, transform: 'translate3d(0, 100px, 0)' },
      '100%': { opacity: '1', transform: 'none' },
    },
    '@keyframes bf-slide-down': {
      '0%': { opacity: 0, transform: 'translate3d(0, -100px, 0)' },
      '100%': { opacity: '1', transform: 'none' },
    },
    '@keyframes bf-slide-left': {
      '0%': { opacity: 0, transform: 'translate3d(60px, 0, 0)' },
      '100%': { opacity: '1', transform: 'none' },
    },
    '@keyframes bf-slide-right': {
      '0%': { opacity: 0, transform: 'translate3d(-60px, 0, 0)' },
      '100%': { opacity: '1', transform: 'none' },
    },
    '@keyframes bf-fade': {
      '0%': { opacity: 0 },
      '100%': { opacity: '1' },
    },

    // When a transition-type class is on the steps container, override legacy fade-up/down
    // and animate via the new bf-* keyframes. Old (no class) keeps legacy behaviour.
    '.bf-trans-vertical .bc-step-fade-up,.bf-trans-vertical .bc-step-enter-fwd': {
      animation: 'bf-slide-up 0.5s ease-in-out',
    },
    '.bf-trans-vertical .bc-step-fade-down,.bf-trans-vertical .bc-step-enter-bwd': {
      animation: 'bf-slide-down 0.5s ease-in-out',
    },
    '.bf-trans-horizontal .bc-step-fade-up,.bf-trans-horizontal .bc-step-enter-fwd': {
      animation: 'bf-slide-left 0.5s ease-in-out',
    },
    '.bf-trans-horizontal .bc-step-fade-down,.bf-trans-horizontal .bc-step-enter-bwd': {
      animation: 'bf-slide-right 0.5s ease-in-out',
    },
    '.bf-trans-fade .bc-step-fade-up,.bf-trans-fade .bc-step-fade-down,.bf-trans-fade .bc-step-enter-fwd,.bf-trans-fade .bc-step-enter-bwd': {
      animation: 'bf-fade 0.4s ease-in-out',
    },
    '@media (prefers-reduced-motion: reduce)': {
      '.bf-trans-vertical .bc-step-fade-up,.bf-trans-vertical .bc-step-fade-down,.bf-trans-vertical .bc-step-enter-fwd,.bf-trans-vertical .bc-step-enter-bwd,.bf-trans-horizontal .bc-step-fade-up,.bf-trans-horizontal .bc-step-fade-down,.bf-trans-horizontal .bc-step-enter-fwd,.bf-trans-horizontal .bc-step-enter-bwd,.bf-trans-fade .bc-step-fade-up,.bf-trans-fade .bc-step-fade-down,.bf-trans-fade .bc-step-enter-fwd,.bf-trans-fade .bc-step-enter-bwd': {
        animation: 'bf-fade 0.001s linear',
      },
    },

    // progress style
    [`.bc${formId}-progress-wrpr`]: {
      flex: '1 1 auto',
      'min-width': 0,
    },
    [`.bc${formId}-progress-cntnt`]: {
      gap: '5px',
      display: 'flex',
      'flex-direction': 'column',
      padding: '8px 12px',
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
      left: 0,
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
      background: 'hsla(0,0%,100%,.5)',
      'border-style': 'solid',
      'border-color': 'hsla(0,0%,0%,.08)',
      'border-width': '1px 0px 1px 0px',
      display: 'flex',
      'flex-direction': 'row',
      'justify-content': 'space-between',
      width: '100%',
      padding: '0',
      'pointer-events': 'auto',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      'user-select': 'none',
      'white-space': 'nowrap',
      overflow: 'hidden',
    },
    [`.bc${formId}-nav-btn-cntnt`]: {
      display: 'flex',
      gap: '5px',
    },
    [`.bc${formId}-nav-btn-container`]: {
      display: 'flex',
      padding: '0 8px',
      background: 'transparent',
      gap: '5px',
      'align-items': 'center',
      'flex-shrink': 0,
    },
    [`.bc${formId}-branding-wrpr`]: {
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      gap: '4px',
      width: '100%',
      padding: '6px 0',
      color: 'hsla(0,0%,0%,.45)',
    },
    [`.bc${formId}-prowered-by-lbl`]: {
      'font-size': '.75rem',
      display: 'inline',
    },
    [`.bc${formId}-bit-form-lbl`]: {
      'font-size': '.75rem',
      'font-weight': '600',
      display: 'inline',
      'line-height': 'inherit',
    },

    // navigation button style
    [`.bc${formId}-nav-btn`]: {
      'background-color': 'transparent',
      'border-radius': '50%',
      'border-style': 'solid',
      'border-width': '2px',
      'box-shadow': 'none',
      'border-color': `var(--bc${formId}-a-clr, #0062ff)`,
      cursor: 'pointer',
      display: 'inline-flex',
      width: '30px',
      height: '30px',
      'justify-content': 'center',
      'align-items': 'center',
      color: `var(--bc${formId}-a-clr, #0062ff)`,
    },
    [`.bc${formId}-nav-btn:hover`]: {
      'background-color': `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.1) !important`,
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
    // Horizontal transition: arrow icons point left/right instead of up/down
    [`.bf-trans-horizontal .bc${formId}-nav-btn-up`]: {
      transform: 'rotate(270deg)',
    },
    [`.bf-trans-horizontal .bc${formId}-nav-btn-down`]: {
      transform: 'rotate(90deg)',
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
    // Cover layouts: image stretches to full step height
    [`.compact-left-layout .bc${formId}-step-img-cntnr`]: {
      'align-self': 'stretch',
    },
    [`.compact-right-layout .bc${formId}-step-img-cntnr`]: {
      'align-self': 'stretch',
    },
    [`.compact-left-layout .bc${formId}-step-img`]: {
      height: '100%',
      'object-fit': 'contain',
    },
    [`.compact-right-layout .bc${formId}-step-img`]: {
      height: '100%',
      'object-fit': 'contain',
    },
    // Panel Left / Panel Right: generous field padding + vertical spacing
    [`.padding-left-layout .bc${formId}-step-content`]: {
      padding: '50px 0',
      gap: '0',
    },
    [`.padding-right-layout .bc${formId}-step-content`]: {
      'flex-direction': 'row-reverse',
      padding: '50px 0',
      gap: '0',
    },
    [`.padding-left-layout .bc${formId}-step-img-cntnr`]: {
      'align-self': 'stretch',
    },
    [`.padding-right-layout .bc${formId}-step-img-cntnr`]: {
      'align-self': 'stretch',
    },
    [`.padding-left-layout .bc${formId}-step-img`]: {
      height: '100%',
      'object-fit': 'contain',
    },
    [`.padding-right-layout .bc${formId}-step-img`]: {
      height: '100%',
      'object-fit': 'contain',
    },
    [`.padding-left-layout .bc${formId}-step-fld-wrpr`]: {
      padding: '40px 60px',
    },
    [`.padding-right-layout .bc${formId}-step-fld-wrpr`]: {
      padding: '40px 60px',
    },

    // Floating Card layout: the step-wrapper centers a card-styled step-content
    // over the visible form background (._frm-bg-b{id}).
    [`.centered-card-layout.bc${formId}-step-wrapper`]: {
      'align-items': 'center',
      'justify-content': 'center',
      padding: '40px 20px 80px',
      background: 'transparent',
    },
    [`.centered-card-layout .bc${formId}-step-content`]: {
      width: 'min(680px, 90%)',
      'flex-grow': '0',
      'flex-basis': 'auto',
      'flex-direction': 'column',
      'justify-content': 'flex-start',
      'align-self': 'center',
      // White is the default fallback; overridden by Step Background setting when set.
      'background-color': '#fff',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'border-radius': '12px',
      'box-shadow': '0 4px 32px hsla(0, 0%, 0%, 0.12)',
      padding: '40px 50px',
    },
    [`.centered-card-layout .bc${formId}-step-fld-wrpr`]: {
      width: '100%',
      padding: '5px',
    },

    [`.bc${formId}-step-img-cntnr`]: {
      width: '50%',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    },
    [`.bc${formId}-step-img-wrpr`]: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      overflow: 'hidden',
      'text-align': 'center',
      height: '100%',
      width: '100%',
    },
    [`.bc${formId}-step-img`]: {
      height: '100%',
      width: '100%',
      display: 'block',
      'object-fit': 'contain',
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
      margin: '15px 0',
      position: 'relative',
      'box-shadow': 'none',
      'border-style': 'medium',
      'border-color': 'none',
      'border-radius': '0',
      'border-width': '0',
      width: '100%',
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
      // 'border-width': '1px',
      // 'border-style': 'solid',
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
      background: `var(--bc${formId}-stp-bg-clr, transparent)`,
      // 'border-color': '#bdffd4e8',
    },
    '.bc-form-msg.error': {
      background: '#ffbdbe',
      'border-color': '#ffbdbe',
    },

    // Container queries — primary responsive layer.
    // Applies when the form's own width crosses the breakpoint, not the viewport.
    // Critical when the form is shortcoded into a narrow column on a wide viewport.
    // 600px: typography + field/image sizing (tablet + mobile).
    '@container bf-conv (max-width: 600px)': {
      [`.bc${formId}-fld-wrp`]: { width: '100%' },
      [`.bc${formId}-lbl-wrp`]: { width: '100%' },
      [`.bc${formId}-inp-wrp`]: { width: '100%' },
      [`.bc${formId}-sub-titl`]: { 'font-size': '1rem' },
      [`.bc${formId}-hlp-txt`]: { 'font-size': '1rem' },
      [`.bc${formId}-lbl`]: { 'font-size': '1.5rem' },
      [`.bc${formId}-req-smbl`]: { 'font-size': '1.5rem' },
      [`.bc${formId}-err-msg`]: { 'font-size': '1rem' },
      [`.bc${formId}-err-txt`]: { 'font-size': '1rem' },
      [`.bc${formId}-btn`]: { 'font-size': '16px' },
      [`.bc${formId}-step-hints`]: { 'font-size': '12px' },
      [`.bc${formId}-step-fld-wrpr`]: { width: '100%', padding: '20px 15px' },
      [`.bc${formId}-step-img-cntnr`]: { width: '100%' },
      // Floating Card: compact padding on small containers
      [`.centered-card-layout.bc${formId}-step-wrapper`]: { padding: '20px 10px 70px' },
      [`.centered-card-layout .bc${formId}-step-content`]: { width: '100%', padding: '24px 20px' },
    },
    // 480px: mobile-only — flip to column/column-reverse + equal 50/50 height split.
    // Left layouts keep image on top; right layouts keep image on bottom (column-reverse).
    '@container bf-conv (max-width: 480px)': {
      [`.compact-left-layout .bc${formId}-step-content`]: { 'flex-direction': 'column' },
      [`.compact-right-layout .bc${formId}-step-content`]: { 'flex-direction': 'column-reverse' },
      [`.padding-left-layout .bc${formId}-step-content`]: { 'flex-direction': 'column', padding: '0' },
      [`.padding-right-layout .bc${formId}-step-content`]: { 'flex-direction': 'column-reverse', padding: '0' },
      // Equal 50/50 height split for image and field when stacked
      [`.compact-left-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.compact-right-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.padding-left-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.padding-right-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.compact-left-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none' },
      [`.compact-right-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none' },
      [`.padding-left-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none', padding: '24px 20px' },
      [`.padding-right-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none', padding: '24px 20px' },
    },
    '@container bf-conv (max-width: 380px)': {
      [`.bc${formId}-lbl`]: { 'font-size': '1.25rem' },
      [`.bc${formId}-req-smbl`]: { 'font-size': '1.25rem' },
      [`.bc${formId}-sub-titl`]: { 'font-size': '0.9rem' },
      [`.bc${formId}-hlp-txt`]: { 'font-size': '0.9rem' },
      [`.bc${formId}-btn`]: { 'font-size': '14px' },
      [`.bc${formId}-step-hints`]: { 'font-size': '11px' },
      [`.bc${formId}-step-fld-wrpr`]: { padding: '16px 12px' },
      [`.centered-card-layout .bc${formId}-step-content`]: { padding: '16px 14px' },
    },

    // Fallback for browsers without container-query support (Safari <16, Firefox <110).
    // 767px: typography + field/image sizing (tablet + mobile).
    '@media (max-width: 767px)': {
      [`.bc${formId}-fld-wrp`]: { width: '100%' },
      [`.bc${formId}-lbl-wrp`]: { width: '100%' },
      [`.bc${formId}-inp-wrp`]: { width: '100%' },
      [`.bc${formId}-sub-titl`]: { 'font-size': '1rem' },
      [`.bc${formId}-hlp-txt`]: { 'font-size': '1rem' },
      [`.bc${formId}-lbl`]: { 'font-size': '1.5rem' },
      [`.bc${formId}-req-smbl`]: { 'font-size': '1.5rem' },
      [`.bc${formId}-err-msg`]: { 'font-size': '1rem' },
      [`.bc${formId}-err-txt`]: { 'font-size': '1rem' },
      [`.bc${formId}-btn`]: { 'font-size': '16px' },
      [`.bc${formId}-step-hints`]: { 'font-size': '12px' },
      [`.bc${formId}-step-fld-wrpr`]: { width: '100%', padding: '20px 15px' },
      [`.bc${formId}-step-img-cntnr`]: { width: '100%' },
    },
    // 480px: mobile-only layout flip + equal 50/50 height split.
    '@media (max-width: 480px)': {
      [`.compact-left-layout .bc${formId}-step-content`]: { 'flex-direction': 'column' },
      [`.compact-right-layout .bc${formId}-step-content`]: { 'flex-direction': 'column-reverse' },
      [`.padding-left-layout .bc${formId}-step-content`]: { 'flex-direction': 'column', padding: '0' },
      [`.padding-right-layout .bc${formId}-step-content`]: { 'flex-direction': 'column-reverse', padding: '0' },
      [`.compact-left-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.compact-right-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.padding-left-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.padding-right-layout .bc${formId}-step-img-cntnr`]: { flex: '1 1 50%', 'align-self': 'auto' },
      [`.compact-left-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none' },
      [`.compact-right-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none' },
      [`.padding-left-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none', padding: '24px 20px' },
      [`.padding-right-layout .bc${formId}-step-fld-wrpr`]: { flex: '1 1 50%', 'max-height': 'none', padding: '24px 20px' },
    },

  }
}
