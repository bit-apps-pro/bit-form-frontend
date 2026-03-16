export default function signatureDefaultStyles(formId) {
  return {
    [`.bc${formId}-signature-pad`]: {
      background: ' !important',
      width: '100% !important',
      height: '150px',
      'background-color': `var(--bc${formId}-fld-bg-clr, white) !important`,
      'border-style': `var(--bc${formId}-fld-bdr) !important`,
      'border-color': `var(--bc${formId}-fld-bdr-clr) !important`,
      'border-radius': `var(--bc${formId}-fld-bdr-rds) !important`,
      'border-width': `var(--bc${formId}-fld-bdr-wdt) !important`,
    },
    [`.bc${formId}-ctrl`]: {
      display: 'flex',
      'justify-content': 'start',
      gap: '10px',
      margin: '10px 0px',
    },

    [`.bc${formId}-clr-btn`]: {
      'font-size': '15px',
      padding: '6px 14px',
      // 'background-color': 'var(--btn-bgc)',
      background: `var(--bc${formId}-btn-bg-clr, #0062ff)`,
      color: `var(--bc${formId}-btn-txt-clr, #fff)`,
      'border-style': 'none',
      'border-radius': '6px',
      cursor: 'pointer',
      'font-weight': '600',
      'font-family': 'inherit',
      'line-height': '1',
      outline: 'none',
      display: 'flex',
      // 'justify-content': txtAlign || 'center',
      'align-items': 'center',
      transition: 'background-color 0.2s, transform 0.2s',
      // ...fulW && { width: '100%' },
    },
    [`.bc${formId}-clr-btn:hover`]: {
      'background-color': `hsl(var(--bc${formId}-btn-bg-h), var(--bc${formId}-btn-bg-s), calc(var(--bc${formId}-btn-bg-l) - 5%)) !important`,
    },
    [`.bc${formId}-clr-btn:active`]: {
      transform: 'scale(0.95)',
    },
    [`.bc${formId}-clr-btn:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-btn-bg-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`.bc${formId}-clr-btn:active:focus-visible`]: {
      'outline-offset': 0,
    },

    [`.bc${formId}-clr-btn-pre-i`]: {
      width: '20px',
      height: '20px',
      margin: '0px 5px 0px 0px',
    },

    [`.bc${formId}-clr-btn-suf-i`]: {
      width: '20px',
      height: '20px',
      margin: '0px 0px 0px 5px',
    },

    [`.bc${formId}-undo-btn-pre-i`]: {
      width: '20px',
      height: '20px',
      margin: '0px 5px 0px 0px',
    },

    [`.bc${formId}-undo-btn-suf-i`]: {
      width: '20px',
      height: '20px',
      margin: '0px 0px 0px 5px',
    },

    [`.bc${formId}-undo-btn`]: {
      'font-size': '15px',
      padding: '6px 14px',
      // 'background-color': 'var(--btn-bgc)',
      background: `var(--bc${formId}-btn-bg-clr, #0062ff)`,
      color: `var(--bc${formId}-btn-txt-clr, #fff)`,
      'border-style': 'none',
      'border-radius': '6px',
      cursor: 'pointer',
      'font-weight': '600',
      'font-family': 'inherit',
      'line-height': '1',
      outline: 'none',
      display: 'flex',
      // 'justify-content': txtAlign || 'center',
      'align-items': 'center',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    [`.bc${formId}-undo-btn:hover`]: {
      'background-color': `hsl(var(--bc${formId}-btn-bg-h), var(--bc${formId}-btn-bg-s), calc(var(--bc${formId}-btn-bg-l) - 5%)) !important`,
    },
    [`.bc${formId}-undo-btn:active`]: {
      transform: 'scale(0.95)',
    },
    [`.bc${formId}-undo-btn:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-btn-bg-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`.bc${formId}-undo-btn:active:focus-visible`]: {
      'outline-offset': 0,
    },
    [`.bc${formId}-undo-btn:disabled`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      opacity: '0.5',
    },

    [`.bc${formId}-redo-btn-pre-i`]: {
      width: '20px',
      height: '20px',
      margin: '0px 5px 0px 0px',
    },

    [`.bc${formId}-redo-btn-suf-i`]: {
      width: '20px',
      height: '20px',
      margin: '0px 0px 0px 5px',
    },

    [`.bc${formId}-redo-btn`]: {
      'font-size': '15px',
      padding: '6px 14px',
      // 'background-color': 'var(--btn-bgc)',
      background: `var(--bc${formId}-btn-bg-clr, #0062ff)`,
      color: `var(--bc${formId}-btn-txt-clr, #fff)`,
      'border-style': 'none',
      'border-radius': '6px',
      cursor: 'pointer',
      'font-weight': '600',
      'font-family': 'inherit',
      'line-height': '1',
      outline: 'none',
      display: 'flex',
      // 'justify-content': txtAlign || 'center',
      'align-items': 'center',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    [`.bc${formId}-redo-btn:hover`]: {
      'background-color': `hsl(var(--bc${formId}-btn-bg-h), var(--bc${formId}-btn-bg-s), calc(var(--bc${formId}-btn-bg-l) - 5%)) !important`,
    },
    [`.bc${formId}-redo-btn:active`]: {
      transform: 'scale(0.95)',
    },
    [`.bc${formId}-redo-btn:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-btn-bg-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`.bc${formId}-redo-btn:active:focus-visible`]: {
      'outline-offset': 0,
    },
    [`.bc${formId}-redo-btn:disabled`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      opacity: '0.5',
    },
    [`.bc${formId}-signature-iframe`]: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      'pointer-events': 'none',
      border: 'none',
    },
  }
}
