import { getAtom } from '../../../../GlobalStates/BitStore'
import { $formInfo } from '../../../../GlobalStates/GlobalStates'

// eslint-disable-next-line camelcase
export default function multiStepStyle_1_bitformDefault({ formId, breakpoint = 'lg', direction, colorScheme = 'light' }) {
  const formInfo = getAtom($formInfo)
  const { multiStepSettings } = formInfo
  const { themeStyle } = multiStepSettings || {}

  const bgClr = 'var(--btn-bg)'
  const clr = 'var(--btn-c)'
  const bdrClr = 'var(--btn-bdr-clr)'
  const bdrStl = 'var(--btn-bdr)'
  const bdrWdth = 'var(--btn-bdr-width)'
  return {
    [`._frm-b${formId}-stp-cntnr`]: {
      'grid-column': '1 / -1',
    },
    [`._frm-b${formId}-stp-hdr-wrpr`]: {
      display: 'flex',
      'justify-content': 'space-around',
      'align-items': 'center',
      'flex-wrap': 'wrap',
    },
    [`._frm-b${formId}-stp-wrpr`]: {
      'border-radius': '4px',
      padding: '3px',
    },
    [`._frm-b${formId}-stp-hdr`]: {
      'border-style': 'none',
      'border-radius': '0px',
      flex: '1 1',
      padding: '10px',
      margin: '0',
      'text-align': 'center',
      color: '#999',
      position: 'relative',
      'line- height': '1.5',
    },
    [`._frm-b${formId}-stp-hdr:not(:first-child)::after`]: {
      content: '""',
      width: '100%',
      height: '2px',
      background: 'white',
      position: 'absolute',
      left: '-50%',
      top: '25px',
      'z-index': '-1',
    },
    [`._frm-b${formId}-stp-hdr.active`]: {
      color: 'var(--fld-lbl-c, inherit)',
      'font-weight': '700',
    },
    [`._frm-b${formId}-stp-hdr.completed`]: {
      color: 'var(--fld-lbl-c, inherit)',
    },
    [`._frm-b${formId}-stp-hdr-cntnt`]: {
      display: 'flex',
      'flex-direction': 'column',
    },
    [`._frm-b${formId}-stp-hdr-titl-wrpr`]: {
      display: 'flex',
      'flex-direction': 'column',
      margin: '5px 0px 0px',
    },
    [`._frm-b${formId}-stp-hdr-icn-wrp`]: {
      display: 'flex',
      'align-self': 'center',
      'align-items': 'center',
    },
    [`._frm-b${formId}-stp-icn-cntn`]: {
      width: '30px',
      height: '30px',
      display: 'flex',
      padding: '5px',
      'justify-content': 'center',
      'align-items': 'center',
      'text-align': 'center',
      'line-height': '24px',
      'font-size': '14px',
      'font-weight': 'bold',
      'background-color': 'var(--bg-5)',
      cursor: 'pointer',
      'border-radius': '50%',
      'border-style': 'var(--global-fld-bdr) !important',
      'border-color': 'var(--global-fld-bdr-clr) !important',
      'border-width': 'var(--g-bdr-width) !important',
    },
    [`._frm-b${formId}-stp-hdr.active ._frm-b${formId}-stp-icn-cntn`]: {
      'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
      'border-color': 'var(--global-accent-color) !important',
      'background-color': 'hsla(var(--gah), var(--gas), var(--gal), 0.10) !important',
    },
    [`._frm-b${formId}-stp-hdr.completed ._frm-b${formId}-stp-icn-cntn`]: {
      'border-color': 'var(--global-accent-color) !important',
      'background-color': 'hsla(var(--gah), var(--gas), var(--gal), 0.10) !important',
    },
    [`._frm-b${formId}-stp-hdr.disabled ._frm-b${formId}-stp-icn-cntn`]: {
      'background-color': 'var(--bg-5)',
      cursor: 'default',
    },
    [`._frm-b${formId}-stp-icn`]: {
      width: '20px',
      height: '20px',
    },
    [`._frm-b${formId}-stp-hdr-lbl`]: {
      display: 'flex',
      'align-self': 'center',
      'align-items': 'center',
      'font-size': '1rem',
      cursor: 'pointer',
    },
    [`._frm-b${formId}-stp-hdr.disabled ._frm-b${formId}-stp-hdr-lbl`]: {
      cursor: 'default',
    },
    [`._frm-b${formId}-stp-lbl-pre-i`]: {
      width: 'var(--lbl-pre-i-w)',
      height: 'var(--lbl-pre-i-h)',
      margin: 'var(--lbl-pre-i-m)',
      padding: 'var(--lbl-pre-i-p)',
      'box-shadow': 'var(--lbl-pre-i-sh, none)',
      'border-style': 'var(--lbl-pre-i-bdr, medium)',
      'border-color': 'var(--lbl-pre-i-bdr-clr, none)',
      'border-width': 'var(--lbl-pre-i-bdr-width, 0)',
      'border-radius': 'var(--lbl-pre-i-bdr-rad, 0)',
      filter: 'var(--lbl-pre-i-fltr)',
    },
    [`._frm-b${formId}-stp-lbl-suf-i`]: {
      width: 'var(--lbl-suf-i-w)',
      height: 'var(--lbl-suf-i-h)',
      margin: 'var(--lbl-suf-i-m)',
      padding: 'var(--lbl-suf-i-p)',
      'box-shadow': 'var(--lbl-suf-i-sh, none)',
      'border-style': 'var(--lbl-suf-i-bdr, medium)',
      'border-color': 'var(--lbl-suf-i-bdr-clr, none)',
      'border-width': 'var(--lbl-suf-i-bdr-width, 0)',
      'border-radius': 'var(--lbl-suf-i-bdr-rad, 0)',
      filter: 'var(--lbl-suf-i-fltr)',
    },

    [`._frm-b${formId}-stp-hdr-sub-titl`]: {
      display: 'flex',
      'align-self': 'center',
      'align-items': 'center',
      'font-size': '12px',
    },
    [`._frm-b${formId}-stp-sub-titl-pre-i`]: {
      width: 'var(--sub-titl-pre-i-w)',
      height: 'var(--sub-titl-pre-i-h)',
      margin: 'var(--sub-titl-pre-i-m)',
      padding: 'var(--sub-titl-pre-i-p)',
      'box-shadow': 'var(--sub-titl-pre-i-sh, none)',
      'border-style': 'var(--sub-titl-pre-i-bdr, medium)',
      'border-color': 'var(--sub-titl-pre-i-bdr-clr, none)',
      'border-width': 'var(--sub-titl-pre-i-bdr-width, 0)',
      'border-radius': 'var(--sub-titl-pre-i-bdr-rad, 0)',
      filter: 'var(--sub-titl-pre-i-fltr)',
    },
    [`._frm-b${formId}-stp-sub-titl-suf-i`]: {
      width: 'var(--sub-titl-suf-i-w)',
      height: 'var(--sub-titl-suf-i-h)',
      margin: 'var(--sub-titl-suf-i-m)',
      padding: 'var(--sub-titl-suf-i-p)',
      'box-shadow': 'var(--sub-titl-suf-i-sh, none)',
      'border-style': 'var(--sub-titl-suf-i-bdr, medium)',
      'border-color': 'var(--sub-titl-suf-i-bdr-clr, none)',
      'border-width': 'var(--sub-titl-suf-i-bdr-width, 0)',
      'border-radius': 'var(--sub-titl-suf-i-bdr-rad, 0)',
      filter: 'var(--sub-titl-suf-i-fltr)',
    },
    [`._frm-b${formId}-stp-hdr.active ._frm-b${formId}-stp-hdr-icn`]: {
      background: '#007bff',
      'border-color': '#007bff',
      color: '#FFF',
    },
    [`._frm-b${formId}-stp-progress-wrpr`]: {
      padding: 'var(--fld-wrp-p, 0)',
    },
    [`._frm-b${formId}-stp-progress-bar`]: {
      display: 'flex',
      height: '1.2rem',
      overflow: 'hidden',
      'font-size': '.75rem',
      'background-color': 'var(--bg-5)',
      'border-radius': '.4rem',
    },
    [`._frm-b${formId}-progress-fill`]: {
      display: 'flex',
      color: '#fff',
      'flex-direction': 'column',
      'justify-content': 'center',
      'text-align': 'center',
      'white-space': 'nowrap',
      'background-color': 'var(--global-accent-color)',
      transition: 'width .6s ease',
    },
    [`._frm-b${formId}-stp-cntnt-wrpr`]: {
      display: 'flex',
      'flex-direction': 'row',
    },
    [`._frm-b${formId}-stp-cntnt`]: {
      width: '100%',
      opacity: '100%',
      display: 'flex',
      'flex-direction': multiStepSettings?.btnSettings?.position || 'column',
      'align-self': 'flex-start',
      transition: 'width .4s ease, opacity 0.3s ease, height 0.3s ease',
    },
    [`._frm-b${formId}-stp-cntnt.deactive`]: {
      width: '0px',
      height: '0px',
      opacity: '0%',
      overflow: 'hidden',
    },
    [`._frm-b${formId}-stp-cntnt .btcd-fld-itm:not(.fld-hide)`]: {
      height: 'fit-content',
    },
    [`._frm-b${formId}-stp-btn-wrpr`]: {
      padding: 'var(--fld-wrp-p, 0)',
    },
    [`._frm-b${formId}-stp-btn-cntnt`]: {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'flex-direction': 'row',
    },
    [`._frm-b${formId}-next-step-btn`]: {
      'font-size': 'var(--btn-fs)!important',
      padding: 'var(--btn-p)!important',
      // 'background-color': 'var(--btn-bgc)',
      background: bgClr,
      color: clr,
      'font-weight': 'var(--btn-fw)',
      'border-style': bdrStl,
      'border-color': bdrClr,
      'border-width': bdrWdth,
      'border-radius': 'var(--btn-bdr-rad) !important',
      'box-shadow': 'var(--btn-sh)',
      cursor: 'pointer',
      'font-family': 'inherit',
      'font-style': 'var(--btn-f-style)',
      'line-height': '1',
      margin: 'var(--btn-m)',
      outline: 'none',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    [`._frm-b${formId}-next-step-btn:hover`]: {
      'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
    },
    [`._frm-b${formId}-next-step-btn:active`]: {
      transform: 'scale(0.95)',
    },
    [`._frm-b${formId}-next-step-btn:focus-visible`]: {
      outline: '2px solid var(--global-accent-color)',
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`._frm-b${formId}-next-step-btn:active:focus-visible`]: {
      'outline-offset': '0',
    },
    [`._frm-b${formId}-next-step-btn:disabled`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      opacity: '0.5',
    },
    [`._frm-b${formId}-next-step-btn-pre-i`]: {
      width: '20px',
      height: '20px',
      ...direction !== 'rtl' && { margin: '0px 5px 0px 0px' },
      ...direction === 'rtl' && { margin: '0px 0px 0px 5px' },
    },
    [`._frm-b${formId}-next-step-btn-suf-i`]: {
      width: '20px',
      height: '20px',
      ...direction !== 'rtl' && { margin: '0px 0px 0px 5px' },
      ...direction === 'rtl' && { margin: '0px 5px 0px 0px' },
    },

    // Previous Button
    [`._frm-b${formId}-prev-step-btn`]: {
      'font-size': 'var(--btn-fs)!important',
      padding: 'var(--btn-p)!important',
      // 'background-color': 'var(--btn-bgc)',
      background: bgClr,
      color: clr,
      'font-weight': 'var(--btn-fw)',
      'border-style': bdrStl,
      'border-color': bdrClr,
      'border-width': bdrWdth,
      'border-radius': 'var(--btn-bdr-rad) !important',
      'box-shadow': 'var(--btn-sh)',
      cursor: 'pointer',
      'font-family': 'inherit',
      'font-style': 'var(--btn-f-style)',
      'line-height': '1',
      margin: 'var(--btn-m)',
      outline: 'none',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    [`._frm-b${formId}-prev-step-btn:hover`]: {
      'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
    },
    [`._frm-b${formId}-prev-step-btn:active`]: {
      transform: 'scale(0.95)',
    },
    [`._frm-b${formId}-prev-step-btn:focus-visible`]: {
      outline: '2px solid var(--global-accent-color)',
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`._frm-b${formId}-prev-step-btn:active:focus-visible`]: {
      'outline-offset': '0',
    },
    [`._frm-b${formId}-prev-step-btn:disabled`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      opacity: '0.5',
    },
    [`._frm-b${formId}-prev-step-btn-pre-i`]: {
      width: '20px',
      height: '20px',
      ...direction !== 'rtl' && { margin: '0px 5px 0px 0px' },
      ...direction === 'rtl' && { margin: '0px 0px 0px 5px' },
    },
    [`._frm-b${formId}-prev-step-btn-suf-i`]: {
      width: '20px',
      height: '20px',
      ...direction !== 'rtl' && { margin: '0px 0px 0px 5px' },
      ...direction === 'rtl' && { margin: '0px 5px 0px 0px' },
    },
  }
}
