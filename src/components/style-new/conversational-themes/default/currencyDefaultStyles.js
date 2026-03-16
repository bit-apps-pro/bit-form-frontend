import commonClassStyles from './commonClassStyles'

export default function currencyDefaultStyles(formId) {
  const commonStyles = commonClassStyles(formId)
  return {
    [`.bc${formId}-currency-fld-container`]: {
      position: 'relative',
      height: '40px', // unused css
      width: '100%',
      display: 'inline-block', // unused css
    },
    [`.bc${formId}-currency-fld-wrp`]: {
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
    [`.bc${formId}-currency-fld-wrp.disabled .bc${formId}-currency-inner-wrp`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },
    [`.bc${formId}-currency-fld-wrp.readonly .bc${formId}-currency-inner-wrp`]: {
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },

    [`.bc${formId}-currency-fld-wrp.disabled .bc${formId}-currency-amount-input`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },
    [`.bc${formId}-currency-fld-wrp.readonly .bc${formId}-currency-amount-input`]: {
      'pointer-events': 'none',
      'background-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), calc(var(--bc${formId}-fld-c-l) + 40%), var(--bc${formId}-fld-c-a))`,
      'border-color': `hsla(var(--bc${formId}-fld-bg-h), var(--bc${formId}-fld-bg-s), calc(var(--bc${formId}-fld-bg-l) + 20%), var(--bc${formId}-fld-bg-a))`,
    },
    [`.bc${formId}-currency-fld-wrp:hover:not(.menu-open):not(.disabled)`]: {
      // border: 'solid hsla(0, 0%, 93%, 100%)',
      // 'border-width': '1px',
      'border-color': `var(--bc${formId}-a-clr) !important`,
    },
    [`.bc${formId}-currency-fld-wrp:focus-within:not(.menu-open):not(.disabled)`]: {
      // border: 'solid hsla(205, 95%, 55%, 100%)',
      // 'border-width': '1px',
      // 'box-shadow': '0 0 0 3px hsla(209, 100%, 50%, 26%)',
      'box-shadow': `0 3px 0 0 hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.30) !important`,
      'border-color': `var(--bc${formId}-a-clr) !important`,
    },

    [`.bc${formId}-currency-fld-wrp.menu-open`]: {
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
    [`.bc${formId}-currency-inner-wrp`]: {
      display: 'flex',
      height: '100%',
      position: 'relative',
    },

    [`.bc${formId}-dpd-wrp`]: {
      ...commonStyles[`.bc${formId}-dpd-wrp`],
    },
    [`.bc${formId}-dpd-wrp:hover`]: {
      ...commonStyles[`.bc${formId}-dpd-wrp:hover`],
    },
    [`.bc${formId}-dpd-wrp:focus-visible`]: {
      ...commonStyles[`.bc${formId}-dpd-wrp:focus-visible`],
    },

    [`.bc${formId}-selected-currency-wrp`]: {
      display: 'flex',
      'align-items': 'center',
      height: '100%', // unused css
    },

    [`.bc${formId}-selected-currency-lbl`]: {
      // 'font-size': 'var(--fld-fs) !important',
      // 'font-family': 'var(--g-font-family)',
      // color: 'var(--global-font-color) !important',
    },
    [`.bc${formId}-selected-currency-img`]: {
      height: '17px !important',
      width: '25px',
      'border-radius': '3px !important',
      'box-shadow': '0 0 0 1px var(--bg-15)',
      margin: '0 10px 0 0',
      'background-color': 'var(--bg-10)',
      '-webkit-user-select': 'none',
      'user-select': 'none',
    },
    [`.bc${formId}-input-clear-btn`]: {
      ...commonStyles[`.bc${formId}-input-clear-btn`],
    },

    [`.bc${formId}-input-clear-btn:hover`]: {
      ...commonStyles[`.bc${formId}-input-clear-btn:hover`],
    },

    [`.bc${formId}-input-clear-btn:focus-visible`]: {
      ...commonStyles[`.bc${formId}-input-clear-btn:focus-visible`],
    },

    [`.bc${formId}-dpd-down-btn`]: {
      width: '15px', // unused css
      display: 'grid', // unused css
      'place-content': 'center', // unused css
      transition: 'transform 0.2s',
    },

    [`.bc${formId}-currency-amount-input`]: {
      border: '0 !important',
      'font-family': 'inherit',
      outline: 0,
      height: 'auto',
      width: 'calc(100% - 50px)',
      padding: '8px 26px 8px 8px !important',
      'font-size': `var(--bc${formId}-fld-fs) !important`,
      // 'font-family': 'var(--g-font-family)',
      color: `var(--bc${formId}-fld-clr) !important`,
      'background-color': 'transparent',
    },

    // /* Chrome, Safari, Edge, Opera */
    [`.bc${formId}-currency-amount-input::-webkit-outer-spin-button`]: {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    [`.bc${formId}-currency-amount-input::-webkit-inner-spin-button`]: {
      '-webkit-appearance': 'none',
      margin: 0,
    },

    // /* Firefox */
    [`.bc${formId}-currency-amount-input[type=number]`]: { '-moz-appearance': 'textfield' },

    [`.bc${formId}-currency-amount-input::placeholder`]: {
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), var(--bc${formId}-fld-c-l), 40%) !important`,
    },

    [`.bc${formId}-option-wrp`]: {
      ...commonStyles[`.bc${formId}-option-wrp`],
    },

    [`.bc${formId}-option-inner-wrp`]: {
      ...commonStyles[`.bc${formId}-option-inner-wrp`],
    },

    [`.bc${formId}-option-search-wrp`]: {
      ...commonStyles[`.bc${formId}-option-search-wrp`],
    },

    [`.bc${formId}-icn`]: {
      ...commonStyles[`.bc${formId}-icn`],
    },

    [`.bc${formId}-opt-search-icn`]: {
      ...commonStyles[`.bc${formId}-opt-search-icn`],
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

    [`.bc${formId}-opt-search-input:focus~svg`]: {
      ...commonStyles[`.bc${formId}-opt-search-input:focus~svg`],
    },

    [`.bc${formId}-opt-search-input::-webkit-search-decoration`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-cancel-button`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-results-button`]: { display: 'none' },
    [`.bc${formId}-opt-search-input::-webkit-search-results-decoration`]: { display: 'none' },

    [`.bc${formId}-search-clear-btn`]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'none',
      right: '6px',
      padding: '0px !important',
      margin: '0',
      background: 'var(--bg-40) !important',
      border: 'none',
      'border-radius': '50% !important',
      outline: 0,
      cursor: 'pointer',
      'margin-right': '5px !important',
      'place-content': 'center',
      width: '16px',
      height: '16px',
      color: 'var(--bg-5)',
    },

    [`.bc${formId}-search-clear-btn:hover`]: {
      'background-color': 'var(--bg-60)!important',
    },

    [`.bc${formId}-search-clear-btn:focus-visible`]: {
      'box-shadow': `0 0 0 1.5px var(--bc${formId}-a-clr)`,
      outline: 'none',
    },

    [`.bc${formId}-option-list`]: {
      ...commonStyles[`.bc${formId}-option-list`],
    },

    [`.bc${formId}-option-list::-webkit-scrollbar`]: {
      ...commonStyles[`.bc${formId}-option-list::-webkit-scrollbar`],
    },

    [`.bc${formId}-option-list::-webkit-scrollbar-thumb`]: {
      ...commonStyles[`.bc${formId}-option-list::-webkit-scrollbar-thumb`],
    },

    [`.bc${formId}-option-list .option`]: {
      ...commonStyles[`.bc${formId}-option-list .option`],
    },

    [`.bc${formId}-option-list .option:hover:not(.selected-opt):not(.disabled-opt)`]: {
      ...commonStyles[`.bc${formId}-option-list .option:hover:not(.selected-opt):not(.disabled-opt)`],
    },

    [`.bc${formId}-option-list .option:focus-visible`]: {
      ...commonStyles[`.bc${formId}-option-list .option:focus-visible`],
    },

    [`.bc${formId}-option-list .selected-opt`]: {
      ...commonStyles[`.bc${formId}-option-list .selected-opt`],
    },
    [`.bc${formId}-option-list .selected-opt .opt-suffix`]: {
      ...commonStyles[`.bc${formId}-option-list .selected-opt .opt-suffix`],
    },

    [`.bc${formId}-option-list .selected-opt:focus-visible`]: {
      ...commonStyles[`.bc${formId}-option-list .selected-opt:focus-visible`],
    },

    [`.bc${formId}-option-list .opt-not-found`]: {
      ...commonStyles[`.bc${formId}-option-list .opt-not-found`],
    },
    [`.bc${formId}-option-list .opt-lbl`]: {
      ...commonStyles[`.bc${formId}-option-list .opt-lbl`],
    },

    [`.bc${formId}-option-list .opt-lbl-wrp`]: {
      ...commonStyles[`.bc${formId}-option-list .opt-lbl-wrp`],
    },

    [`.bc${formId}-option-list .opt-icn`]: {
      ...commonStyles[`.bc${formId}-option-list .opt-icn`],
    },

    [`.bc${formId}-option-list .opt-suffix`]: {
      ...commonStyles[`.bc${formId}-option-list .opt-suffix`],
    },

    [`.bc${formId}-option-list .disabled-opt`]: {
      ...commonStyles[`.bc${formId}-option-list .disabled-opt`],
    },

    [`.bc${formId}-currency-fld-wrp.menu-open .bc${formId}-dpd-down-btn`]: {
      transform: 'rotate(180deg)',
    },
  }
}
