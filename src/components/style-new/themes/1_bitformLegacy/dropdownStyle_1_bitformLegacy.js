/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
import inputWrapperClasses from '../common/inputWrapperClasses'

export default function dropdownStyle_1_bitformLegacy({ fk, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),

      [`.${fk}-dpd-fld-container`]: {
        position: 'relative',
        height: '40px',
        width: '100%',
        display: 'inline-block',
      },

      [`.${fk}-dpd-fld-wrp`]: {
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
        transition: 'box-shadow 200ms',
      },

      [`.${fk}-dpd-fld-wrp:hover:not(.menu-open):not(.disabled)`]: {
        'border-color': 'var(--global-accent-color)!important',
      },

      [`.${fk}-dpd-fld-wrp:focus-within:not(.menu-open):not(.disabled)`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        'border-color': 'var(--global-accent-color)!important',
      },

      [`.${fk}-dpd-fld-wrp.disabled .${fk}-dpd-wrp`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--fic-h), var(--fic-s), calc(var(--fic-l) + 40%), var(--fic-a))',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },
      [`.${fk}-dpd-fld-wrp.readonly .${fk}-dpd-wrp`]: {
        'pointer-events': 'none',
        'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), calc(var(--gfbg-l) + 20%), var(--gfbg-a))',
        color: 'hsla(var(--fic-h), var(--fic-s), calc(var(--fic-l) + 40%), var(--fic-a))',
        'border-color': 'hsla(var(--gfbc-h), var(--gfbc-s), calc(var(--gfbc-l) + 20%), var(--gfbc-a))',
      },

      [`.${fk}-dpd-wrp`]: {
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
      [`.${fk}-dpd-fld-wrp.menu-open`]: {
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

      [`.${fk}-selected-opt-wrp`]: {
        height: '100%',
        display: 'flex',
        'align-items': 'center',
        gap: '10px',
      },

      [`.${fk}-selected-opt-lbl.multi-chip`]: {
        display: 'flex',
        'flex-wrap': 'wrap',
        gap: '5px',
      },

      [`.${fk}-selected-opt-lbl .chip-wrp`]: {
        display: 'flex',
        'align-items': 'center',
        'background-color': 'var(--bg-10)',
        padding: '5px 8px',
        'border-radius': 'var(--g-bdr-rad)',
        gap: '5px',
      },

      [`.${fk}-selected-opt-lbl .chip-icn`]: {
        width: '13px',
        height: '13px',
      },

      [`.${fk}-selected-opt-lbl .chip-lbl`]: {
        'font-size': 'var(--fld-fs) !important',
        'font-weight': 'var(--fld-f-w) !important',
        'font-style': 'var(--fld-f-style) !important',
        color: 'var(--fld-inp-c)',
      },

      [`.${fk}-selected-opt-lbl .chip-clear-btn`]: {
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
        color: 'var(--fld-inp-c) !important',
        padding: '0px',
      },

      [`.${fk}-selected-opt-lbl .chip-clear-btn:hover`]: {
        'background-color': 'var(--bg-15) !important',
      },

      [`.${fk}-selected-opt-lbl .chip-clear-btn:focus-visible`]: {
        outline: '1.5px solid var(--global-accent-color)',
      },

      [`.${fk}-selected-opt-lbl`]: {
        // 'font-size': 'var(--fld-fs)',
        // 'font-family': 'var(--g-font-family)',
        // color: 'var(--global-font-color)',
      },

      [`.${fk}-selected-opt-img`]: {
        height: '17px',
        width: '25px',
        'border-radius': '3px',
        // margin: '0 10px 0 0',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      },

      [`.${fk}-dpd-fld-wrp .placeholder-img`]: {
        'background-color': 'var(--bg-15)',
        outline: '1px solid var(--bg-10)',
      },

      [`.${fk}-selected-opt-clear-btn`]: {
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
        color: 'var(--fld-inp-c) !important',
      },

      [`.${fk}-selected-opt-clear-btn:hover`]: {
        'background-color': 'var(--bg-15) !important',
      },

      [`.${fk}-selected-opt-clear-btn:focus-visible`]: {
        outline: '1.5px solid var(--global-accent-color)',
      },

      [`.${fk}-dpd-btn-wrp`]: {
        display: 'flex',
        'align-items': 'center',
      },

      [`.${fk}-option-wrp`]: {
        'max-height': '0px',
        'min-height': 'auto',
        margin: 'auto',
        width: '100%',
        overflow: 'hidden',
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
        height: '100%',
        'overflow-y': 'auto',

        /* firefox */
        'scrollbar-width': 'thin !important',
        'scrollbar-color': 'var(--bg-15) transparent !important',
      },

      [`.${fk}-option-list::-webkit-scrollbar`]: {
        width: '8px',
      },

      /* .option-list::-webkit-scrollbar-track`]: {
        background: #'fafafa',
      }, */

      [`.${fk}-option-list::-webkit-scrollbar-thumb`]: {
        'background-color': 'var(--bg-15)',
        'border-radius': 'var(--g-bdr-rad)',
      },

      [`.${fk}-option-list:not(.active-list)`]: {
        display: 'none !important',
      },

      [`.${fk}-option-search-wrp`]: {
        position: 'relative',
        // padding: '0 5px',
        margin: '5px 5px 0 5px',
      },

      [`.${fk}-icn`]: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
      },

      [`.${fk}-opt-search-icn`]: {
        ...direction !== 'rtl' && { left: '11px' },
        ...direction === 'rtl' && { right: '11px' },
      },

      [`.${fk}-opt-search-input`]: {
        width: '100%',
        padding: '0px 35px',
        outline: 'none',
        'box-shadow': 'none',
        border: 'none !important',
        /* border-top: 1px solid #'ddd', */
        /* border-bottom: 1px solid #'ddd', */
        height: '35px',
        'border-radius': 'calc(var(--g-bdr-rad) - 1px) !important',
        'background-color': 'var(--bg-5)',
        'font-size': 'var(--fld-fs)',
        'font-family': 'inherit',
        color: 'var(--global-font-color) !important',
      },
      [`.${fk}-opt-search-input::placeholder`]: {
        color: 'hsla(var(--fic-h), var(--fic-s), var(--fic-l), 0.5)',
      },
      [`.${fk}-opt-search-input:focus`]: {
        'background-color': 'var(--bg-0)',
        'box-shadow': '0 0 0 2px var(--global-accent-color) inset',
      },
      [`.${fk}-opt-search-input:focus~svg`]: { color: 'var(--global-accent-color)' },

      [`.${fk}-opt-search-input::-webkit-search-decoration`]: { display: 'none' },
      [`.${fk}-opt-search-input::-webkit-search-cancel-button`]: { display: 'none' },
      [`.${fk}-opt-search-input::-webkit-search-results-button`]: { display: 'none' },
      [`.${fk}-opt-search-input::-webkit-search-results-decoration`]: { display: 'none' },

      [`.${fk}-search-clear-btn`]: {
        display: 'none',
        ...direction !== 'rtl' && { right: '8px' },
        ...direction === 'rtl' && { left: '8px' },
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

      [`.${fk}-search-clear-btn:hover`]: {
        background: 'var(--bg-50) !important',
      },

      [`.${fk}-search-clear-btn:focus-visible`]: {
        'box-shadow': '0 0 0 2px var(--global-accent-color)',
        outline: 'none',
      },

      [`.${fk}-custom-opt-btn`]: {
        display: 'none',
        right: '30px',
        padding: '5px',
        margin: '0',
        background: 'transparent',
        border: '0.5px solid hsla(var(--gfbg-h), var(--gfbg-s), 70%, var(--gfbg-a)) ',
        outline: '0',
        cursor: 'pointer',
        'place-content': 'center',
        height: '25px',
        'border-radius': '5px',
        color: 'var(--global-font-color)',
      },

      // [`.${fk}-create-opt`]: { display: 'none !important' },

      [`.${fk}-option-list .option`]: {
        margin: '2px 5px !important',
        transition: 'background 0.2s',
        'border-radius': 'calc(var(--g-bdr-rad) - 2px)',
        'font-size': 'calc(var(--fld-fs) - 2px)',
        cursor: 'pointer',
        'text-align': 'left',
        padding: '8px 7px',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
      },

      [`.${fk}-option-list .option:hover:not(.selected-opt):not(.opt-group-title)`]: {
        'background-color': 'var(--bg-10)',
      },

      [`.${fk}-option-list .option:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'background-color': 'var(--bg-10)',
      },

      // [`.${fk}-option-list .option:focus-within:not(.selected-opt):not(.disabled-opt)`]: {
      //   'background-color': 'hsla(var(--gfbg-h), var(--gfbg-s), 90%, var(--gfbg-l))',
      // },

      [`.${fk}-option-list .selected-opt:focus-visible`]: {
        'background-color': 'var(--global-accent-color)',
      },

      [`.${fk}-option-list .opt-group-title`]: {
        'font-size': 'calc(var(--fld-fs) - 2px)',
        cursor: 'default',
        opacity: '.7',
        'font-weight': 600,
      },

      [`.${fk}-option-list .opt-group-child`]: {
        'padding-left': '15px !important',
      },

      [`.${fk}-option-list .selected-opt`]: {
        'font-weight': 500,
        'background-color': 'var(--global-accent-color)',
        color: '#fff',
      },

      [`.${fk}-option-list .opt-not-found`]: {
        'text-align': 'center',
        'list-style': 'none',
        margin: '5px',
      },

      [`.${fk}-option-list .opt-lbl-wrp`]: {
        display: 'flex',
        'align-items': 'center',
        gap: '5px',
      },
      [`.${fk}-option-list .opt-lbl`]: {},

      [`.${fk}-option-list .opt-icn`]: {
        'margin-right': '5px',
        height: '17px',
        width: '25px',
        'border-radius': '3px',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      },

      [`.${fk}-dpd-down-btn`]: {
        width: '15px',
        display: 'grid',
        'place-content': 'center',
        transition: 'transform 0.2s',
      },

      [`.${fk}-dpd-fld-wrp.menu-open .${fk}-dpd-down-btn`]: { transform: 'rotate(180deg)' },

      // [`.${fk}-dpd-fld-wrp.disabled .${fk}-selected-opt-lbl`]: { color: 'hsla(0, 0%, 94%, 30%) !important' },

      // [`.${fk}-dpd-fld-wrp.disabled .${fk}-selected-opt-clear-btn`]: { cursor: 'not-allowed' },

      [`.${fk}-option-list .disabled-opt`]: {
        'pointer-events': 'none',
        cursor: 'not-allowed',
        color: 'var(--bg-10) !important',
        opacity: '0.5',
      },

      [`.${fk}-option-list .disable-on-max`]: {
        'pointer-events': 'none',
        cursor: 'not-allowed',
        color: 'var(--bg-10) !important',
        opacity: '0.8',
      },
    }
  }
  return {}
}
