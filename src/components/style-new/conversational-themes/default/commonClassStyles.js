export default function commonClassStyles(formId) {
  return {
    [`.bc${formId}-fld`]: {
      display: 'inline-block!important',
      direction: 'inherit !important',
      'font-family': 'inherit',
      width: '100% !important',
      outline: 'none !important',
      'border-style': `var(--bc${formId}-fld-bdr) !important`,
      'border-color': `var(--bc${formId}-fld-bdr-clr) !important`,
      'border-radius': `var(--bc${formId}-fld-bdr-rds) !important`,
      'border-width': `var(--bc${formId}-fld-bdr-wdt) !important`,
      'font-size': `var(--bc${formId}-fld-fs) !important`,
      color: `var(--bc${formId}-fld-clr) !important`,
      padding: `var(--bc${formId}-fld-p)`,
      'line-height': '1.4 !important',
      height: '40px',
    },
    [`textarea.bc${formId}-fld`]: {
      display: 'block!important',
      height: 'auto',
      resize: 'vertical',
    },
    'input[type="color" i][list]::-webkit-color-swatch': { border: 0, 'border-radius': '2px' },
    [`.bc${formId}-fld:focus`]: {
      'box-shadow': `0 3px 0 0 hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.30) !important`,
      'border-color': `var(--bc${formId}-a-clr) !important`,
    },
    [`.bc${formId}-fld:hover`]: { 'border-color': `--bc${formId}-a-clr !important` },
    [`.bc${formId}-fld:disabled`]: {
      cursor: 'default',
      'background-color': 'var(--bg-5)!important',
      color: `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.30) !important`,
      'border-color': `var(--bc${formId}-a-clr) !important`,
    },
    [`.bc${formId}-fld:read-only`]: {
      cursor: 'default',
    },
    [`.bc${formId}-fld::placeholder`]: {
      'font-family': 'inherit',
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), var(--bc${formId}-fld-c-l), 0.30) !important`,
    },

    // field icon
    [`.bc${formId}-pre-i`]: {
      position: 'absolute',
      left: '3px',
      top: '50%',

      margin: '0px 0px 0px 3px',
      transform: 'translateY(-50%)',
      width: '25px',
      height: '25px',
      'border-style': 'bdr',
      'border-color': 'clr',
      'border-width': 'width',
      'border-radius': '8px',
    },
    [`.bc${formId}-suf-i`]: {
      position: 'absolute',
      margin: 'm',
      right: '3px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '25px',
      height: '25px',
      'border-style': 'bdr',
      'border-color': 'clr',
      'border-width': 'width',
      'border-radius': '8px',
    },
    [`.bc${formId}-dpd-wrp`]: {
      'background-color': 'transparent',
      overflow: 'hidden', // unused css
      'font-weight': '500', // unused css
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      cursor: 'pointer',
      height: '37px',
      margin: '3px',
      padding: '10px',
      position: 'relative', // unused css
      'font-size': '12px',
      outline: 'none', // unused css
      'border-radius': `calc(var(--bc${formId}-fld-bdr-rds) - 3px)`,
    },
    [`.bc${formId}-dpd-wrp:hover`]: {
      'background-color': 'var(--bg-5)',
    },
    [`.bc${formId}-dpd-wrp:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-a-clr)`,
    },
    [`.bc${formId}-input-clear-btn`]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'none',
      right: '6px',
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

    [`.bc${formId}-input-clear-btn:hover`]: {
      'background-color': 'var(--bg-60) !important',
    },

    [`.bc${formId}-input-clear-btn:focus-visible`]: {
      'box-shadow': `0 0 0 1.5px var(--bc${formId}-a-clr)`,
      outline: 'none',
    },

    [`.bc${formId}-option-list`]: {
      padding: 0,
      margin: '0px !important',
      height: '100%', // unused css
      'overflow-y': 'auto',

      /* firefox */
      'scrollbar-width': 'thin !important',
      'scrollbar-color': 'var(--bg-15) transparent !important',
    },

    [`.bc${formId}-option-list::-webkit-scrollbar`]: {
      width: '8px',
    },

    [`.bc${formId}-option-list::-webkit-scrollbar-thumb`]: {
      'background-color': 'var(--bg-15)',
      'border-radius': `var(--bc${formId}-fld-bdr-rds)`,
    },

    [`.bc${formId}-option-list .option`]: {
      margin: '2px 5px !important', // unused css
      transition: 'background 0.2s',
      'border-radius': `calc(var(--bc${formId}-fld-bdr-rds) - 2px)`,
      'font-size': `calc(var(--bc${formId}-fld-fs) - 8px)`,
      cursor: 'pointer',
      'text-align': 'left', // unused css
      padding: '8px 7px',
      display: 'flex',
      'align-items': 'center',
      gap: '5px',
    },

    [`.bc${formId}-option-list .option:hover:not(.selected-opt):not(.disabled-opt)`]: {
      'background-color': 'var(--bg-10)',
    },

    [`.bc${formId}-option-list .option:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-a-clr)`,
      'background-color': 'var(--bg-10)',
    },

    [`.bc${formId}-option-list .selected-opt`]: {
      'font-weight': 500,
      color: '#fff',
      'background-color': `var(--bc${formId}-a-clr)`,
    },
    [`.bc${formId}-option-list .selected-opt .opt-suffix`]: {
      background: `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), calc(var(--bc${formId}-a-l) - 10%), 1)`,
    },

    [`.bc${formId}-option-list .selected-opt:focus-visible`]: {
      'background-color': `var(--bc${formId}-a-clr)`,
    },

    [`.bc${formId}-option-list .opt-not-found`]: {
      'text-align': 'center',
      'list-style': 'none',
      margin: '5px',
      'font-size': 'calc(var(--fld-fs) - 2px)',
    },
    [`.bc${formId}-option-list .opt-lbl`]: {},

    [`.bc${formId}-option-list .opt-lbl-wrp`]: {
      display: 'flex',
      'align-items': 'center',
    },

    [`.bc${formId}-option-list .opt-icn`]: {
      margin: '0 10px 0 0',
      height: '17px',
      width: '25px',
      'border-radius': '3px',
      'box-shadow': '0 0 0 1px var(--bg-10)',
      '-webkit-user-select': 'none',
      'user-select': 'none',
    },

    [`.bc${formId}-option-list .opt-suffix`]: {
      'font-size': `calc(var(--bc${formId}-fld-fs) - 12px)`,
      background: 'var(--bg-10)',
      'border-radius': '3px',
      padding: '3px',
    },

    [`.bc${formId}-option-list .disabled-opt`]: {
      'pointer-events': 'none',
      cursor: 'not-allowed',
      color: 'var(--bg-10) !important',
      opacity: '0.5',
    },

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
      position: 'relative',
    },

    [`.bc${formId}-option-search-wrp`]: {
      position: 'relative',
      margin: '5px 5px 0 5px',
    },

    [`.bc${formId}-icn`]: {
      position: 'absolute',
      stroke: 'hsla(0, 1%, 68%, 100%)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: `var(--bc${formId}-fld-clr) !important`,
    },

    [`.bc${formId}-opt-search-icn`]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--bg-25) !important',
      left: '13px',
    },

    [`.bc${formId}-opt-search-input`]: {
      width: '100%',
      outline: 'none',
      'box-shadow': 'none',
      border: 'none !important',
      height: '35px',
      'border-radius': `calc(var(--bc${formId}-fld-bdr-rds) - 1px)!important`,
      'font-size': '1rem',
      'background-color': 'var(--bg-5)',
      'font-family': 'inherit',
      // 'font-family': 'var(--g-font-family)',
      color: `var(--bc${formId}-fld-clr) !important`,
      padding: '0 5px 0 41px !important',
    },
    [`.bc${formId}-opt-search-input::placeholder`]: {
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), var(--bc${formId}-fld-c-l), 0.5)`,
    },
    [`.bc${formId}-opt-search-input:focus`]: {
      'background-color': 'var(--bg-0)',
      'box-shadow': `0 0 0 2px var(--bc${formId}-a-clr) inset`,
    },

    [`.bc${formId}-opt-search-input:focus~svg`]: { color: `var(--bc${formId}-fld-clr) !important` },
  }
}
