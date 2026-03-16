/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */

import inputWrapperClasses from '../common/inputWrapperClasses'

export default function countryStyle_1_BitformDefault({ fk, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),

      [`.${fk}-country-fld-container`]: {
        position: 'relative',
        height: '40px',
        width: '100%',
        display: 'inline-block',
      },

      [`.${fk}-country-fld-wrp`]: {
        position: 'absolute',
        width: '100%',
        'background-color': 'var(--global-fld-bg-color)',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        'border-width': 'var(--g-bdr-width) !important',
        'font-size': 'var(--fld-fs) !important',
        'font-weight': 'var(--fld-f-w) !important',
        'font-style': 'var(--fld-f-style) !important',
        // 'font-family': 'var(--g-font-family)',
        color: 'var(--fld-inp-c) !important',
        overflow: 'hidden',
        display: 'flex',
        'flex-direction': 'column',
        transition: 'box-shadow .2s',
      },

      [`.${fk}-country-fld-wrp.disabled .${fk}-dpd-wrp`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--gfh), var(--gfs), calc(var(--gfl) + 40%), var(--gfa))',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },
      [`.${fk}-country-fld-wrp.readonly .${fk}-dpd-wrp`]: {
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--gfh), var(--gfs), calc(var(--gfl) + 40%), var(--gfa))',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },

      [`.${fk}-country-fld-wrp:hover:not(.menu-open):not(.disabled)`]: { 'border-color': 'var(--global-accent-color) !important' },

      [`.${fk}-country-fld-wrp:focus-within:not(.menu-open):not(.disabled)`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        'border-color': 'var(--global-accent-color) !important',
      },

      [`.${fk}-country-fld-wrp.menu-open`]: {
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

      [`.${fk}-country-fld-wrp:focus-within`]: {
        /* box-shadow: 0 0 0 2px white, 0 0 0 4px blue, */
      },

      [`.${fk}-dpd-wrp:focus-visible`]: {
        /* box-shadow: 0 0 0 2px rgb(0, 132, 255) inset, */
      },

      [`.${fk}-dpd-wrp`]: {
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

      [`.${fk}-selected-country-lbl`]: {
        // 'font-size': 'var(--fld-fs) !important',
        // 'font-family': 'var(--g-font-family)',
        // color: 'var(--global-font-color) !important',
      },

      [`.${fk}-selected-country-wrp`]: {
        height: '100%', // unused css
        display: 'flex',
        'align-items': 'center',
      },

      [`.${fk}-selected-country-img`]: {
        height: '17px !important',
        width: '25px',
        'border-radius': '3px !important',
        outline: '1px solid var(--bg-10)',
        'background-color': 'var(--bg-10)',
        margin: '0 10px 0 0',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      },

      [`.${fk}-inp-clr-btn`]: {
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
        color: 'var(--fld-inp-c) !important',
      },

      [`.${fk}-inp-clr-btn:hover`]: {
        'background-color': 'var(--bg-15) !important',
      },

      [`.${fk}-dpd-btn-wrp`]: {
        display: 'flex',
        'align-items': 'center', // unused css
      },

      [`.${fk}-option-list .opt-lbl`]: {},

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
      },

      [`.${fk}-option-list`]: {
        padding: '0',
        margin: '0 0 2px 0 !important',
        height: '100%', // unused css
        'overflow-y': 'auto',

        /* firefox */
        'scrollbar-width': 'thin !important',
        'scrollbar-color': 'var(--bg-15) transparent !important',
      },

      [`.${fk}-option-list::-webkit-scrollbar`]: { width: '8px' },

      /* .option-list::-webkit-scrollbar-track {
        background: #fafafa,
      }, */

      [`.${fk}-option-list::-webkit-scrollbar-thumb`]: {
        'background-color': 'var(--bg-15)',
        'border-radius': 'var(--g-bdr-rad)',
      },

      [`.${fk}-option-search-wrp`]: {
        position: 'relative',
        margin: '5px 5px 0 5px',
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
        ...direction !== 'rtl' && { padding: '0 5px 0 41px !important' },
        ...direction === 'rtl' && { padding: '0 41px 0 5px !important' },
        outline: 'none',
        'box-shadow': 'none',
        'font-family': 'inherit',
        /* border-radius: 8px, */
        border: 'none !important',
        /* border-top: 1px solid #ddd, */
        /* border-bottom: 1px solid #ddd, */
        'background-color': 'var(--bg-5)',
        height: '35px',
        'border-radius': 'calc(var(--g-bdr-rad) - 1px) !important',
        'font-size': '1rem',
        // 'font-family': 'var(--g-font-family)',
        color: 'var(--global-font-color) !important',
      },

      [`.${fk}-opt-search-input::placeholder`]: {
        color: 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.5)',
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

      // [`.${fk}-opt-search-input:focus`]: {
      /* border-radius   : 20px,
      background-color: red, */
      // },

      [`.${fk}-search-clear-btn`]: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'none',
        ...direction !== 'rtl' && { right: '6px' },
        ...direction === 'rtl' && { left: '6px' },
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

      [`.${fk}-search-clear-btn:hover`]: {
        background: 'var(--bg-50) !important',
      },

      [`.${fk}-search-clear-btn:focus-visible`]: {
        'box-shadow': '0 0 0 2px var(--global-accent-color)',
        outline: 'none',
      },

      [`.${fk}-option-list .option`]: {
        margin: '2px 5px !important',
        transition: 'background 0.2s',
        'border-radius': 'calc(var(--g-bdr-rad) - 2px)',
        'font-size': 'calc(var(--fld-fs) - 2px)',
        cursor: 'pointer',
        'text-align': 'left', // unused css
        border: 'none', // unused css
        padding: '8px 7px',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
      },

      [`.${fk}-option-list .option:hover:not(.selected-opt)`]: {
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

      [`.${fk}-option-list .selected-opt:focus-visible`]: {
        'background-color': 'var(--global-accent-color)',
      },

      [`.${fk}-option-list .opt-not-found`]: {
        'text-align': 'center',
        'list-style': 'none',
        margin: '5px',
      },

      [`.${fk}-search-clear-btn:focus-visible`]: {
        'box-shadow': '0 0 0 1.5px hsla(240, 100%, 50%, 100%) inset',
        outline: 'none',
      },

      [`.${fk}-inp-clr-btn:focus-visible`]: {
        'box-shadow': '0 0 0 1.5px hsla(240, 100%, 50%, 100%) inset',
        outline: 'none',
      },

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
        'box-shadow': '0 0 0 1px var(--bg-5)',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      },

      [`.${fk}-dpd-down-btn`]: {
        width: '15px', // unused css
        display: 'grid',
        'place-content': 'center',
        transition: 'transform 0.2s',
      },

      [`.${fk}-country-fld-wrp.menu-open .${fk}-dpd-down-btn`]: { transform: 'rotate(180deg)' },

      // [`.${fk}-country-fld-wrp.disabled .${fk}-selected-country-lbl`]: { color: 'hsla(0, 0%, 33%, 100%) !important' },

      // [`.${fk}-country-fld-wrp.disabled .${fk}-selected-country-clear-btn`]: { cursor: 'not-allowed' },

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
