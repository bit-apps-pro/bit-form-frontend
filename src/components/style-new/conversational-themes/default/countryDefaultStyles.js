import commonClassStyles from './commonClassStyles'

export default function countryDefaultStyles(formId) {
  const commonStyles = commonClassStyles(formId)

  return {
    [`.bc${formId}-country-fld-container`]: {
      position: 'relative',
      height: '40px',
      width: '100%',
      display: 'inline-block',
    },

    [`.bc${formId}-country-fld-wrp`]: {
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
      transition: 'box-shadow .2s',
    },

    [`.bc${formId}-country-fld-wrp.disabled .bc${formId}-dpd-wrp`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },
    [`.bc${formId}-country-fld-wrp.readonly .bc${formId}-dpd-wrp`]: {
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },

    [`.bc${formId}-country-fld-wrp:hover:not(.menu-open):not(.disabled)`]: { 'border-color': `var(--bc${formId}-a-clr) !important` },

    [`.bc${formId}-country-fld-wrp:focus-within:not(.menu-open):not(.disabled)`]: {
      'box-shadow': `0 3px 0 0 hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.30) !important`,
      'border-color': `var(--bc${formId}-a-clr) !important`,
    },

    [`.bc${formId}-country-fld-wrp.menu-open`]: {
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

    [`.bc${formId}-country-fld-wrp:focus-within`]: {
      /* box-shadow: 0 0 0 2px white, 0 0 0 4px blue, */
    },

    [`.bc${formId}-dpd-wrp:focus-visible`]: {
      /* box-shadow: 0 0 0 2px rgb(0, 132, 255) inset, */
    },

    [`.bc${formId}-dpd-wrp`]: {
      'background-color': 'transparent',
      overflow: 'hidden', // unused css
      'font-weight': '500', // unused css
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      cursor: 'pointer',
      height: '38px',
      padding: '10px',
      'box-sizing': 'border-box', // unused css
      // 'font-size': '12px',
      position: 'relative', // unused css
      outline: 'none', // unused css
      /* border      : 1px solid red, */
    },

    [`.bc${formId}-selected-country-lbl`]: {
      // 'font-size': 'var(--bc${formId}-fld-fs) !important',
      // 'font-family': 'var(--g-font-family)',
      // color: 'var(--bc${formId}-fld-clr) !important',
    },

    [`.bc${formId}-selected-country-wrp`]: {
      height: '100%', // unused css
      display: 'flex',
      'align-items': 'center',
    },

    [`.bc${formId}-selected-country-img`]: {
      height: '17px !important',
      width: '25px',
      'border-radius': '3px !important',
      outline: '1px solid var(--bg-10)',
      'background-color': 'var(--bg-10)',
      margin: '0 10px 0 0',
      '-webkit-user-select': 'none',
      'user-select': 'none',
    },

    [`.bc${formId}-inp-clr-btn`]: {
      display: 'none',
      right: '6px', // unused css
      padding: '0px !important', // unused css
      margin: '0', // unused css
      background: 'transparent !important',
      border: '0',
      outline: '0', // unused css
      cursor: 'pointer',
      'margin-right': '5px',
      'place-content': 'center',
      width: '16px',
      height: '16px', // unused css
      'border-radius': '50% !important',
      color: `var(--bc${formId}-fld-clr) !important`,
    },

    [`.bc${formId}-inp-clr-btn:hover`]: {
      'background-color': 'var(--bg-15) !important',
    },

    [`.bc${formId}-dpd-btn-wrp`]: {
      display: 'flex',
      'align-items': 'center', // unused css
    },

    [`.bc${formId}-option-list .opt-lbl`]: {},

    [`.bc${formId}-option-wrp`]: {
      'max-height': '0px',
      'min-height': 'auto', // unused css
      margin: 'auto', // unused css
      width: '100%', // unused css
      overflow: 'hidden', // unused css
      display: 'flex',
      'flex-direction': 'column',
    },

    [`.bc${formId}-option-inner-wrp`]: {
      overflow: 'hidden',
      display: 'flex',
      'flex-direction': 'column',
    },

    [`.bc${formId}-option-list`]: {
      padding: '0',
      margin: '0 0 2px 0 !important',
      height: '100%', // unused css
      'overflow-y': 'auto',

      /* firefox */
      'scrollbar-width': 'thin !important',
      'scrollbar-color': 'var(--bg-15) transparent !important',
    },

    [`.bc${formId}-option-list::-webkit-scrollbar`]: { width: '8px' },

    /* .option-list::-webkit-scrollbar-track {
      background: #fafafa,
    }, */

    [`.bc${formId}-option-list::-webkit-scrollbar-thumb`]: {
      'background-color': 'var(--bg-15)',
      'border-radius': `var(--bc${formId}-fld-bdr-rds)`,
    },

    [`.bc${formId}-option-search-wrp`]: {
      position: 'relative',
      margin: '5px 5px 0 5px',
    },

    [`.bc${formId}-icn`]: {
      ...commonStyles[`.bc${formId}-icn`],
    },

    [`.bc${formId}-opt-search-icn`]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--bg-25) !important',
      left: '13px',
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
    [`.bc${formId}-opt-search-input:focus~svg`]: { color: `var(--bc${formId}-a-clr) !important` },
    [`.bc${formId}-opt-search-input::-webkit-search-decoration`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-cancel-button`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-results-button`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-results-decoration`]: { display: 'none' },

    // [`.bc${formId}-opt-search-input:focus`]: {
    /* border-radius   : 20px,
  background-color: red, */
    // },

    [`.bc${formId}-search-clear-btn`]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'none',
      right: '6px',
      padding: '0px !important',
      margin: '0px',
      background: 'var(--bg-25) !important',
      border: '',
      'border-width': '0px',
      'border-radius': '50% !important',
      outline: 0,
      cursor: 'pointer',
      'margin-right': '5px !important',
      'place-content': 'center',
      width: '16px',
      height: '16px',
      color: 'var(--bg-0)',
    },

    [`.bc${formId}-search-clear-btn:hover`]: {
      background: 'var(--bg-50) !important',
    },

    [`.bc${formId}-search-clear-btn:focus-visible`]: {
      'box-shadow': `0 0 0 2px var(--bc${formId}-a-clr)`,
      outline: 'none',
    },

    [`.bc${formId}-option-list .option`]: {
      margin: '2px 5px !important',
      transition: 'background 0.2s',
      'border-radius': `calc(var(--bc${formId}-fld-bdr-rds) - 2px)`,
      'font-size': `calc(var(--bc${formId}-fld-fs) - 8px)`,
      cursor: 'pointer',
      'text-align': 'left', // unused css
      border: 'none', // unused css
      padding: '8px 7px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
    },

    [`.bc${formId}-option-list .option:hover:not(.selected-opt)`]: {
      'background-color': 'var(--bg-10)',
    },

    [`.bc${formId}-option-list .option:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-a-clr)`,
      'background-color': 'var(--bg-10)',
    },

    // [`.bc${formId}-option-list .option:focus-within:not(.selected-opt):not(.disabled-opt)`]: {
    //   'background-color': 'hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), 90%, var(--bc${formId}-fld-bg-l))',
    // },

    [`.bc${formId}-option-list .selected-opt`]: {
      'font-weight': 500,
      color: '#fff',
      'background-color': `var(--bc${formId}-a-clr)`,
    },

    [`.bc${formId}-option-list .selected-opt:focus-visible`]: {
      'background-color': `var(--bc${formId}-a-clr)`,
    },

    [`.bc${formId}-option-list .opt-not-found`]: {
      'text-align': 'center',
      'list-style': 'none',
      margin: '5px',
    },

    [`.bc${formId}-search-clear-btn:focus-visible`]: {
      'box-shadow': '0 0 0 1.5px hsla(240, 100%, 50%, 100%) inset',
      outline: 'none',
    },

    [`.bc${formId}-inp-clr-btn:focus-visible`]: {
      'box-shadow': '0 0 0 1.5px hsla(240, 100%, 50%, 100%) inset',
      outline: 'none',
    },

    [`.bc${formId}-option-list .opt-lbl-wrp`]: {
      display: 'flex',
      'align-items': 'center',
    },

    [`.bc${formId}-option-list .opt-icn`]: {
      margin: '0 10px 0 0',
      height: '17px',
      width: '25px',
      'border-radius': '3px',
      'box-shadow': '0 0 0 1px var(--bg-5)',
      '-webkit-user-select': 'none',
      'user-select': 'none',
    },

    [`.bc${formId}-dpd-down-btn`]: {
      width: '15px', // unused css
      display: 'grid',
      'place-content': 'center',
      transition: 'transform 0.2s',
    },

    [`.bc${formId}-country-fld-wrp.menu-open .bc${formId}-dpd-down-btn`]: { transform: 'rotate(180deg)' },

    // [`.bc${formId}-country-fld-wrp.disabled .bc${formId}-selected-country-lbl`]: { color: 'hsla(0, 0%, 33%, 100%) !important' },

    // [`.bc${formId}-country-fld-wrp.disabled .bc${formId}-selected-country-clear-btn`]: { cursor: 'not-allowed' },

    [`.bc${formId}-option-list .disabled-opt`]: {
      'pointer-events': 'none',
      cursor: 'not-allowed',
      color: 'var(--bg-10) !important',
      opacity: '0.5',
    },
  }
}
