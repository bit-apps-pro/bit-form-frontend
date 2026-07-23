/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
import inputWrapperClasses from '../common/inputWrapperClasses'

export default function currencyStyle_1_bitformLegacy({ fk, breakpoint, colorScheme, direction }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),

      [`.${fk}-currency-fld-container`]: {
        position: 'relative',
        height: '40px', // unused css
        width: '100%',
        display: 'inline-block', // unused css
      },
      [`.${fk}-currency-fld-wrp`]: {
        position: 'absolute',
        width: '100%',
        'background-color': 'var(--global-fld-bg-color)',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        'border-width': 'var(--g-bdr-width) !important',
        'font-size': 'var(--fld-fs) !important',
        // 'font-family': 'var(--g-font-family)',
        color: 'var(--fld-inp-c) !important',
        overflow: 'hidden',
        display: 'flex',
        'flex-direction': 'column',
        transition: 'box-shadow .2s',
      },
      [`.${fk}-currency-fld-wrp.disabled .${fk}-currency-inner-wrp`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--fic-h), var(--fic-s), calc(var(--fic-l) + 40%), var(--fic-a))',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },
      [`.${fk}-currency-fld-wrp.readonly .${fk}-currency-inner-wrp`]: {
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--fic-h), var(--fic-s), calc(var(--fic-l) + 40%), var(--fic-a))',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },

      [`.${fk}-currency-fld-wrp.disabled .${fk}-currency-amount-input`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--fic-h), var(--fic-s), calc(var(--fic-l) + 40%), var(--fic-a)) !important',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },
      [`.${fk}-currency-fld-wrp.readonly .${fk}-currency-amount-input`]: {
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--fic-h), var(--fic-s), calc(var(--fic-l) + 40%), var(--fic-a)) !important',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },
      [`.${fk}-currency-fld-wrp:hover:not(.menu-open):not(.disabled)`]: {
        // border: 'solid hsla(0, 0%, 93%, 100%)',
        // 'border-width': '1px',
        'border-color': 'var(--global-accent-color) !important',
      },
      [`.${fk}-currency-fld-wrp:focus-within:not(.menu-open):not(.disabled)`]: {
        // border: 'solid hsla(205, 95%, 55%, 100%)',
        // 'border-width': '1px',
        // 'box-shadow': '0 0 0 3px hsla(209, 100%, 50%, 26%)',
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        'border-color': 'var(--global-accent-color) !important',
      },

      [`.${fk}-currency-fld-wrp.menu-open`]: {
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
      [`.${fk}-currency-inner-wrp`]: {
        display: 'flex',
        height: '100%',
        position: 'relative',
      },

      [`.${fk}-dpd-wrp`]: {
        'background-color': 'transparent',
        overflow: 'hidden', // unused css
        'font-weight': '500', // unused css
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        cursor: 'pointer',
        height: '32px',
        margin: '3px',
        padding: '10px',
        position: 'relative', // unused css
        'font-size': '12px',
        outline: 'none', // unused css
        'border-radius': 'calc(var(--g-bdr-rad) - 3px)',
      },
      [`.${fk}-dpd-wrp:hover`]: {
        'background-color': 'var(--bg-5)',
      },
      [`.${fk}-dpd-wrp:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
      },

      [`.${fk}-selected-currency-wrp`]: {
        display: 'flex',
        'align-items': 'center',
        height: '100%', // unused css
      },

      [`.${fk}-selected-currency-lbl`]: {
        // 'font-size': 'var(--fld-fs) !important',
        // 'font-family': 'var(--g-font-family)',
        // color: 'var(--fld-inp-c) !important',
      },
      [`.${fk}-selected-currency-img`]: {
        height: '17px !important',
        width: '25px',
        'border-radius': '3px !important',
        'box-shadow': '0 0 0 1px var(--bg-15)',
        ...direction !== 'rtl' && { margin: '0 10px 0 0' },
        ...direction === 'rtl' && { margin: '0 0 0 10px' },
        'background-color': 'var(--bg-10)',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      },
      [`.${fk}-input-clear-btn`]: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'none',
        ...direction !== 'rtl' && { right: '6px' },
        ...direction === 'rtl' && { left: '6px' },
        padding: '0px !important',
        margin: '0px 5px 0px 0px',
        background: 'var(--bg-40) !important',
        border: 'none',
        'border-radius': '50% !important',
        outline: 0,
        cursor: 'pointer',
        'place-content': 'center',
        width: '16px',
        height: '15px',
        color: 'var(--bg-5) !important',
      },

      [`.${fk}-input-clear-btn:hover`]: {
        'background-color': 'var(--bg-60) !important',
      },

      [`.${fk}-input-clear-btn:focus-visible`]: {
        'box-shadow': '0 0 0 1.5px var(--global-accent-color)',
        outline: 'none',
      },

      [`.${fk}-dpd-down-btn`]: {
        width: '15px', // unused css
        display: 'grid', // unused css
        'place-content': 'center', // unused css
        transition: 'transform 0.2s',
      },

      [`.${fk}-currency-amount-input`]: {
        border: '0 !important',
        'font-family': 'inherit',
        outline: 0,
        height: 'auto',
        width: 'calc(100% - 50px)',
        ...direction !== 'rtl' && { padding: '8px 26px 8px 8px !important' },
        ...direction === 'rtl' && { padding: '8px 8px 8px 26px !important' },
        'font-size': 'var(--fld-fs) !important',
        'font-weight': 'var(--fld-f-w) !important',
        'font-style': 'var(--fld-f-style) !important',
        // 'font-family': 'var(--g-font-family)',
        color: 'var(--fld-inp-c) !important',
        'background-color': 'transparent',
        'line-height': '1.4 !important',
      },

      // /* Chrome, Safari, Edge, Opera */
      [`.${fk}-currency-amount-input::-webkit-outer-spin-button`]: {
        '-webkit-appearance': 'none',
        margin: 0,
      },
      [`.${fk}-currency-amount-input::-webkit-inner-spin-button`]: {
        '-webkit-appearance': 'none',
        margin: 0,
      },

      // /* Firefox */
      [`.${fk}-currency-amount-input[type=number]`]: { '-moz-appearance': 'textfield' },

      [`.${fk}-currency-amount-input::placeholder`]: {
        color: 'hsla(var(--fic-h), var(--fic-s), var(--fic-l), 40%) !important',
      },

      [`.${fk}-option-wrp`]: {
        'max-height': '0px',
        'min-height': 'auto', // unused css
        margin: 'auto', // unused css
        width: '100%', // unused css
        overflow: 'hidden', // unused css
        display: 'flex',
        'flex-direction': 'column',
      },

      [`.${fk}-option-inner-wrp`]: {
        overflow: 'hidden',
        display: 'flex',
        'flex-direction': 'column',
        position: 'relative',
      },

      [`.${fk}-option-search-wrp`]: {
        position: 'relative',
        // 'margin-bottom': '5px',
        // padding: '5px',
        margin: '5px 5px 0 5px',
      },

      [`.${fk}-icn`]: {
        position: 'absolute',
        stroke: 'hsla(0, 1%, 68%, 100%)',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--fld-inp-c) !important',
      },

      [`.${fk}-opt-search-icn`]: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--bg-25) !important',
        ...direction !== 'rtl' && { left: '13px' },
        ...direction === 'rtl' && { right: '13px' },
      },

      [`.${fk}-opt-search-input`]: {
        width: '100%',
        padding: '5px',
        ...direction !== 'rtl' && { padding: '0 5px 0 41px !important' },
        ...direction === 'rtl' && { padding: '0 41px 0 5px !important' },
        outline: 'none',
        'box-shadow': 'none',
        border: 'none !important',
        height: '35px',
        'border-radius': 'calc(var(--g-bdr-rad) - 1px)!important',
        'font-size': '1rem',
        'background-color': 'var(--bg-5)',
        'font-family': 'inherit',
        // 'font-family': 'var(--g-font-family)',
        color: 'var(--fld-inp-c) !important',
      },
      [`.${fk}-opt-search-input::placeholder`]: {
        color: 'hsla(var(--fic-h), var(--fic-s), var(--fic-l), 0.5)',
      },
      [`.${fk}-opt-search-input:focus`]: {
        'background-color': 'var(--bg-0)',
        'box-shadow': '0 0 0 2px var(--global-accent-color) inset',
      },

      [`.${fk}-opt-search-input:focus~svg`]: { color: 'var(--global-accent-color)!important' },

      [`.${fk}-opt-search-input::-webkit-search-decoration`]: { display: 'none' },
      [`.${fk}-opt-search-input::-webkit-search-cancel-button`]: { display: 'none' },
      [`.${fk}-opt-search-input::-webkit-search-results-button`]: { display: 'none' },
      [`.${fk}-opt-search-input::-webkit-search-results-decoration`]: { display: 'none' },

      [`.${fk}-search-clear-btn`]: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'none',
        ...direction !== 'rtl' && { right: '6px' },
        ...direction === 'rtl' && { left: '6px' },
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

      [`.${fk}-search-clear-btn:hover`]: {
        'background-color': 'var(--bg-60)!important',
      },

      [`.${fk}-search-clear-btn:focus-visible`]: {
        'box-shadow': '0 0 0 1.5px var(--global-accent-color)',
        outline: 'none',
      },

      [`.${fk}-option-list`]: {
        padding: 0,
        margin: '0px !important',
        height: '100%', // unused css
        'overflow-y': 'auto',

        /* firefox */
        'scrollbar-width': 'thin !important',
        'scrollbar-color': 'var(--bg-15) transparent !important',
      },

      [`.${fk}-option-list::-webkit-scrollbar`]: {
        width: '8px',
      },

      [`.${fk}-option-list::-webkit-scrollbar-thumb`]: {
        'background-color': 'var(--bg-15)',
        'border-radius': 'var(--g-bdr-rad)',
      },

      [`.${fk}-option-list .option`]: {
        margin: '2px 5px !important', // unused css
        transition: 'background 0.2s',
        'border-radius': 'calc(var(--g-bdr-rad) - 2px)',
        'font-size': 'calc(var(--fld-fs) - 2px)',
        cursor: 'pointer',
        'text-align': 'left', // unused css
        padding: '8px 7px',
        display: 'flex',
        'align-items': 'center',
        gap: '5px',
      },

      [`.${fk}-option-list .option:hover:not(.selected-opt):not(.disabled-opt)`]: {
        'background-color': 'var(--bg-10)',
      },

      [`.${fk}-option-list .option:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'background-color': 'var(--bg-10)',
      },

      // [`.${fk}-option-list .option:focus-within:not(.selected-opt):not(.disabled-opt)`]: {
      //   'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), 90%, var(--gfbg-l))',
      // },

      [`.${fk}-option-list .selected-opt`]: {
        'font-weight': 500,
        color: '#fff',
        'background-color': 'var(--global-accent-color)',
      },
      [`.${fk}-option-list .selected-opt .opt-suffix`]: {
        background: 'hsla(var(--gah), var(--gas), calc(var(--gal) - 10%), 1)',
      },

      [`.${fk}-option-list .selected-opt:focus-visible`]: {
        'background-color': 'var(--global-accent-color)',
      },

      [`.${fk}-option-list .opt-not-found`]: {
        'text-align': 'center',
        'list-style': 'none',
        margin: '5px',
        'font-size': 'calc(var(--fld-fs) - 2px)',
      },
      [`.${fk}-option-list .opt-lbl`]: {},

      [`.${fk}-option-list .opt-lbl-wrp`]: {
        display: 'flex',
        'align-items': 'center',
      },

      [`.${fk}-option-list .opt-icn`]: {
        ...direction !== 'rtl' && { margin: '0 10px 0 0' },
        ...direction === 'rtl' && { margin: '0 0 0 10px' },
        height: '17px',
        width: '25px',
        'border-radius': '3px',
        'box-shadow': '0 0 0 1px var(--bg-10)',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      },

      [`.${fk}-option-list .opt-suffix`]: {
        'font-size': 'calc(var(--fld-fs) - 3px)',
        background: 'var(--bg-10)',
        'border-radius': '5px',
        padding: '3px',
      },

      [`.${fk}-currency-fld-wrp.menu-open .${fk}-dpd-down-btn`]: {
        transform: 'rotate(180deg)',
      },

      [`.${fk}-option-list .disabled-opt`]: {
        'pointer-events': 'none',
        cursor: 'not-allowed',
        color: 'var(--bg-10) !important',
        opacity: '0.5',
      },
    }
  }
  return {}
}
