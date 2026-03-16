import commonClassStyles from './commonClassStyles'

export default function countryDefaultStyles(formId) {
  const commonStyles = commonClassStyles(formId)

  return {
    [`.bc${formId}-dpd-fld-container`]: {
      position: 'relative',
      height: '40px',
      width: '100%',
      display: 'inline-block',
    },

    [`.bc${formId}-dpd-slct-fld-wrp`]: {
      position: 'absolute',
      width: '100%',
      'background-color': `var(--bc${formId}-fld-bg-clr)`,
      'border-style': `var(--bc${formId}-fld-bdr) !important`,
      'border-color': `var(--bc${formId}-fld-bdr-clr) !important`,
      'border-radius': `var(--bc${formId}-fld-bdr-rds) !important`,
      'border-width': `var(--bc${formId}-fld-bdr-wdt) !important`,
      'font-size': `var(--bc${formId}-fld-fs) !important`,
      // 'font-family': 'var(--g-font-family)',
      color: `var(--bc${formId}-fld-clr) !important`,
      overflow: 'hidden',
      display: 'flex',
      'flex-direction': 'column',
      transition: 'box-shadow 200ms',
    },

    [`.bc${formId}-dpd-slct-fld-wrp:hover:not(.menu-open):not(.disabled)`]: {
      'border-color': `var(--bc${formId}-a-clr) !important`,
    },

    [`.bc${formId}-dpd-slct-fld-wrp:focus-within:not(.menu-open):not(.disabled)`]: {
      'box-shadow': `0 3px 0 0 hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.30) !important`,
      'border-color': `var(--bc${formId}-a-clr) !important`,
    },

    [`.bc${formId}-dpd-slct-fld-wrp.disabled .bc${formId}-dpd-slct-wrp`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },
    [`.bc${formId}-dpd-slct-fld-wrp.readonly .bc${formId}-dpd-slct-wrp`]: {
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },

    [`.bc${formId}-dpd-slct-wrp`]: {
      'background-color': 'transparent',
      overflow: 'hidden',
      'font-weight': '500',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      cursor: 'pointer',
      padding: '4px 10px',
      'box-sizing': 'border-box',
      'min-height': '38px',
      // 'font-size': '12px',
      position: 'relative',
      outline: 'none',
      /* border      : 1px solid 'red', */
    },
    [`.bc${formId}-dpd-slct-fld-wrp.menu-open`]: {
      'background-color': 'var(--bg-0)',
      'z-index': '999',
      'box-shadow':
        `0px 1.2px 2.2px hsla(0, 0%, 0%, 3.2%),
      0px 2.9px 5.3px hsla(0, 0%, 0%, 4.5%),
      0px 5.4px 10px hsla(0, 0%, 0%, 5.4%),
      0px 9.6px 17.9px hsla(0, 0%, 0%, 6.2%),
      0px 18px 33.4px hsla(0, 0%, 0%, 7.3%),
      0px 43px 80px hsla(0, 0%, 0%, 10%)`,
      'border-color': 'var(--bg-10)!important',
    },

    [`.bc${formId}-selected-opt-wrp`]: {
      height: '100%',
      display: 'flex',
      'align-items': 'center',
      gap: '10px',
    },

    [`.bc${formId}-selected-opt-lbl.multi-chip`]: {
      display: 'flex',
      'flex-wrap': 'wrap',
      gap: '5px',
    },

    [`.bc${formId}-selected-opt-lbl .chip-wrp`]: {
      display: 'flex',
      'align-items': 'center',
      'background-color': 'var(--bg-10)',
      padding: '5px 8px',
      'border-radius': `var(--bc${formId}-fld-bdr-rds)`,
      gap: '5px',
    },

    [`.bc${formId}-selected-opt-lbl .chip-icn`]: {
      width: '13px',
      height: '13px',
    },

    [`.bc${formId}-selected-opt-lbl .chip-lbl`]: {
      'font-size': '13px',
      color: `var(--bc${formId}-fld-clr)`,
    },

    [`.bc${formId}-selected-opt-lbl .chip-clear-btn`]: {
      border: 'none',
      outline: 'none',
      'box-shadow': 'none',
      'border-radius': '50%',
      cursor: 'pointer',
      display: 'grid',
      'place-content': 'center',
      height: '17px',
      width: '17px',
      'background-color': 'var(--bg-20) !important',
      color: `var(--bc${formId}-fld-clr) !important`,
      padding: '0px',
    },

    [`.bc${formId}-selected-opt-lbl .chip-clear-btn:hover`]: {
      'background-color': 'var(--bg-15) !important',
    },

    [`.bc${formId}-selected-opt-lbl .chip-clear-btn:focus-visible`]: {
      outline: `1.5px solid var(--bf${formId}-a-clr)`,
    },

    [`.bc${formId}-selected-opt-lbl`]: {
      // 'font-size': 'var(--fld-fs)',
      // 'font-family': 'var(--g-font-family)',
      // color: 'var(--global-font-color)',
    },

    [`.bc${formId}-selected-opt-img`]: {
      height: '17px',
      width: '25px',
      'border-radius': '3px',
      // margin: '0 10px 0 0',
      '-webkit-user-select': 'none',
      'user-select': 'none',
    },

    [`.bc${formId}-dpd-slct-fld-wrp .placeholder-img`]: {
      'background-color': 'var(--bg-15)',
      outline: '1px solid var(--bg-10)',
    },

    [`.bc${formId}-selected-opt-clear-btn`]: {
      display: 'none',
      right: '6px',
      padding: '0px !important',
      margin: '0',
      background: 'transparent !important',
      border: '0',
      outline: '0',
      cursor: 'pointer',
      'margin-right': '5px',
      'place-content': 'center',
      width: '16px',
      height: '16px',
      'border-radius': '50% !important',
      color: `var(--bc${formId}-fld-clr) !important`,
    },

    [`.bc${formId}-selected-opt-clear-btn:hover`]: {
      'background-color': 'var(--bg-15) !important',
    },

    [`.bc${formId}-selected-opt-clear-btn:focus-visible`]: {
      outline: `1.5px solid var(--bf${formId}-a-clr)`,
    },

    [`.bc${formId}-dpd-btn-wrp`]: {
      display: 'flex',
      'align-items': 'center',
    },

    [`.bc${formId}-option-wrp`]: {
      'max-height': '0px',
      'min-height': 'auto',
      margin: 'auto',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      'flex-direction': 'column',
    },

    [`.bc${formId}-option-inner-wrp`]: {
      overflow: 'hidden',
      display: 'flex',
      'flex-direction': 'column',
    },

    [`.bc${formId}-dpd-option-list`]: {
      padding: '0',
      margin: '0 0 2px 0 !important',
      height: '100%',
      'overflow-y': 'auto',

      /* firefox */
      'scrollbar-width': 'thin !important',
      'scrollbar-color': 'var(--bg-15) transparent !important',
    },

    [`.bc${formId}-dpd-option-list::-webkit-scrollbar`]: {
      width: '8px',
    },

    /* .option-list::-webkit-scrollbar-track`]: {
      background: #'fafafa',
    }, */

    [`.bc${formId}-dpd-option-list::-webkit-scrollbar-thumb`]: {
      'background-color': 'var(--bg-15)',
      'border-radius': `var(--bc${formId}-fld-bdr-rds)`,
    },

    [`.bc${formId}-dpd-option-list:not(.active-list)`]: {
      display: 'none !important',
    },

    [`.bc${formId}-option-search-wrp`]: {
      position: 'relative',
      // padding: '0 5px',
      margin: '5px 5px 0 5px',
    },

    [`.bc${formId}-icn`]: {
      ...commonStyles[`.bc${formId}-icn`],
    },

    [`.bc${formId}-opt-search-icn`]: {
      left: '11px',
    },

    [`.bc${formId}-opt-search-input`]: {
      ...commonStyles[`.bc${formId}-opt-search-input`],
    },
    [`.bc${formId}-opt-search-input::placeholder`]: {
      ...commonStyles[`.bc${formId}-opt-search-input::placeholder`],
    },
    [`.bc${formId}-opt-search-input:focus`]: {
      ...commonStyles[`.bc${formId}-opt-search-input:focus`],
    },
    [`.bc${formId}-opt-search-input:focus~svg`]: { color: `var(--bc${formId}-fld-clr)` },

    [`.bc${formId}-opt-search-input::-webkit-search-decoration`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-cancel-button`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-results-button`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-results-decoration`]: { display: 'none' },

    [`.bc${formId}-search-clear-btn`]: {
      display: 'none',
      right: '8px',
      padding: '0px !important',
      margin: '0',
      background: 'var(--bg-25) !important',
      border: '0',
      outline: '0',
      cursor: 'pointer',
      'place-content': 'center',
      width: '16px',
      height: '16px',
      'border-radius': '50% !important',
      color: 'var(--bg-0)',
    },

    [`.bc${formId}-search-clear-btn:hover`]: {
      background: 'var(--bg-50) !important',
    },

    [`.bc${formId}-search-clear-btn:focus-visible`]: {
      'box-shadow': `0 0 0 2px var(--bc${formId}-a-clr)`,
      outline: 'none',
    },

    [`.bc${formId}-custom-opt-btn`]: {
      display: 'none',
      right: '30px',
      padding: '5px',
      margin: '0',
      background: 'transparent',
      border: `0.5px solid hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), 70%, var(--bc${formId}-fld-bg-a)) `,
      outline: '0',
      cursor: 'pointer',
      'place-content': 'center',
      height: '25px',
      'border-radius': '5px',
      color: `var(--bc${formId}-fld-clr)`,
    },

    // [`.bc${formId}-create-opt`]: { display: 'none !important' },

    [`.bc${formId}-dpd-option-list .option`]: {
      margin: '2px 5px !important',
      transition: 'background 0.2s',
      'border-radius': `calc(var(--bc${formId}-fld-bdr-rds) - 2px)`,
      'font-size': `calc(var(--bc${formId}-fld-fs) - 8px)`,
      cursor: 'pointer',
      'text-align': 'left',
      padding: '8px 7px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
    },

    [`.bc${formId}-dpd-option-list .option:hover:not(.selected-opt):not(.opt-group-title)`]: {
      'background-color': 'var(--bg-10)',
    },

    [`.bc${formId}-dpd-option-list .option:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-a-clr)`,
      'background-color': 'var(--bg-10)',
    },

    // [`.bc${formId}-option-list .option:focus-within:not(.selected-opt):not(.disabled-opt)`]: {
    //   'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), 90%, var(--gfbg-l))',
    // },

    [`.bc${formId}-dpd-option-list .selected-opt:focus-visible`]: {
      'background-color': `var(--bc${formId}-a-clr)`,
    },

    [`.bc${formId}-dpd-option-list .opt-group-title`]: {
      'font-size': `calc(var(--bc${formId}-fld-fs) - 2px)`,
      cursor: 'default',
      opacity: '.7',
      'font-weight': 600,
    },

    [`.bc${formId}-dpd-option-list .opt-group-child`]: {
      'padding-left': '15px !important',
    },

    [`.bc${formId}-dpd-option-list .selected-opt`]: {
      'font-weight': 500,
      'background-color': `var(--bc${formId}-a-clr)`,
    },

    [`.bc${formId}-dpd-option-list .opt-not-found`]: {
      'text-align': 'center',
      'list-style': 'none',
      margin: '5px',
    },

    [`.bc${formId}-dpd-option-list .opt-lbl-wrp`]: {
      display: 'flex',
      'align-items': 'center',
      gap: '5px',
    },
    [`.bc${formId}-dpd-option-list .opt-lbl`]: {},

    [`.bc${formId}-dpd-option-list .opt-icn`]: {
      'margin-right': '5px',
      height: '17px',
      width: '25px',
      'border-radius': '3px',
      '-webkit-user-select': 'none',
      'user-select': 'none',
    },

    [`.bc${formId}-dpd-down-btn`]: {
      width: '15px',
      display: 'grid',
      'place-content': 'center',
      transition: 'transform 0.2s',
    },

    [`.bc${formId}-dpd-slct-fld-wrp.menu-open .bc${formId}-dpd-down-btn`]: { transform: 'rotate(180deg)' },

    // [`.bc${formId}-dpd-slct-fld-wrp.disabled .bc${formId}-selected-opt-lbl`]: { color: 'hsla(0, 0%, 94%, 30%) !important' },

    // [`.bc${formId}-dpd-slct-fld-wrp.disabled .bc${formId}-selected-opt-clear-btn`]: { cursor: 'not-allowed' },

    [`.bc${formId}-dpd-option-list .disabled-opt`]: {
      'pointer-events': 'none',
      cursor: 'not-allowed',
      color: 'var(--bg-10) !important',
      opacity: '0.5',
    },

    [`.bc${formId}-dpd-option-list .disable-on-max`]: {
      'pointer-events': 'none',
      cursor: 'not-allowed',
      color: 'var(--bg-10) !important',
      opacity: '0.8',
    },
  }
}
