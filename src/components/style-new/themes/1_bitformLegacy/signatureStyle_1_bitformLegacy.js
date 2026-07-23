import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function signatureStyle_1_bitformLegacy({ fk, type, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),

      [`.${fk}-inp-fld-wrp`]: { position: 'relative', margin: 'var(--fld-m, 0)' },
      // field style

      [`.${fk}-signature-pad`]: {
        background: ' !important',
        width: '100% !important',
        height: '150px',
        'background-color': 'var(--global-fld-bg-color, white) !important',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        'border-width': 'var(--g-bdr-width) !important',
      },
      [`.${fk}-ctrl`]: {
        display: 'flex',
        'justify-content': 'start',
        gap: '10px',
        margin: '10px 0px',
      },

      [`.${fk}-clr-btn`]: {
        'font-size': 'var(--btn-fs)!important',
        padding: 'var(--btn-p)!important',
        // 'background-color': 'var(--btn-bgc)',
        background: 'var(--btn-bg)',
        color: 'var(--btn-c)',
        'font-weight': 'var(--btn-fw)',
        'border-style': 'var(--btn-bdr)',
        'border-color': 'var(--btn-bdr-clr)',
        'border-width': 'var(--btn-bdr-width)',
        'border-radius': 'var(--btn-bdr-rad) !important',
        'box-shadow': 'var(--btn-sh)',
        cursor: 'pointer',
        'font-family': 'inherit',
        'font-style': 'var(--btn-f-style)',
        'line-height': '1',
        margin: 'var(--btn-m)',
        outline: 'none',
        display: 'flex',
        // 'justify-content': txtAlign || 'center',
        'align-items': 'center',
        transition: 'background-color 0.2s, transform 0.2s',
        // ...fulW && { width: '100%' },
      },
      [`.${fk}-clr-btn:hover`]: {
        'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
        color: 'var(--btn-c)',
      },
      [`.${fk}-clr-btn:active`]: {
        transform: 'scale(0.95)',
      },
      [`.${fk}-clr-btn:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'outline-offset': '2px',
        transition: 'outline-offset 0.2s ease',
      },
      [`.${fk}-clr-btn:active:focus-visible`]: {
        'outline-offset': 0,
      },

      [`.${fk}-clr-btn-pre-i`]: {
        width: '20px',
        height: '20px',
        margin: '0px 5px 0px 0px',
      },

      [`.${fk}-clr-btn-suf-i`]: {
        width: '20px',
        height: '20px',
        margin: '0px 0px 0px 5px',
      },

      [`.${fk}-undo-btn-pre-i`]: {
        width: '20px',
        height: '20px',
        margin: '0px 5px 0px 0px',
      },

      [`.${fk}-undo-btn-suf-i`]: {
        width: '20px',
        height: '20px',
        margin: '0px 0px 0px 5px',
      },

      [`.${fk}-undo-btn`]: {
        'font-size': 'var(--btn-fs)!important',
        padding: 'var(--btn-p)!important',
        // 'background-color': 'var(--btn-bgc)',
        background: 'var(--btn-bg)',
        color: 'var(--btn-c)',
        'font-weight': 'var(--btn-fw)',
        'border-style': 'var(--btn-bdr)',
        'border-color': 'var(--btn-bdr-clr)',
        'border-width': 'var(--btn-bdr-width)',
        'border-radius': 'var(--btn-bdr-rad) !important',
        'box-shadow': 'var(--btn-sh)',
        cursor: 'pointer',
        'font-family': 'inherit',
        'font-style': 'var(--btn-f-style)',
        'line-height': '1',
        margin: 'var(--btn-m)',
        outline: 'none',
        display: 'flex',
        // 'justify-content': txtAlign || 'center',
        'align-items': 'center',
        transition: 'background-color 0.2s, transform 0.2s',
        // ...fulW && { width: '100%' },
      },
      [`.${fk}-undo-btn:hover`]: {
        'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
        color: 'var(--btn-c)',
      },
      [`.${fk}-undo-btn:active`]: {
        transform: 'scale(0.95)',
      },
      [`.${fk}-undo-btn:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'outline-offset': '2px',
        transition: 'outline-offset 0.2s ease',
      },
      [`.${fk}-undo-btn:active:focus-visible`]: {
        'outline-offset': 0,
      },
      [`.${fk}-undo-btn:disabled`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        opacity: '0.5',
      },

      [`.${fk}-redo-btn-pre-i`]: {
        width: '20px',
        height: '20px',
        margin: '0px 5px 0px 0px',
      },

      [`.${fk}-redo-btn-suf-i`]: {
        width: '20px',
        height: '20px',
        margin: '0px 0px 0px 5px',
      },

      [`.${fk}-redo-btn`]: {
        'font-size': 'var(--btn-fs)!important',
        padding: 'var(--btn-p)!important',
        // 'background-color': 'var(--btn-bgc)',
        background: 'var(--btn-bg)',
        color: 'var(--btn-c)',
        'font-weight': 'var(--btn-fw)',
        'border-style': 'var(--btn-bdr)',
        'border-color': 'var(--btn-bdr-clr)',
        'border-width': 'var(--btn-bdr-width)',
        'border-radius': 'var(--btn-bdr-rad) !important',
        'box-shadow': 'var(--btn-sh)',
        cursor: 'pointer',
        'font-family': 'inherit',
        'font-style': 'var(--btn-f-style)',
        'line-height': '1',
        margin: 'var(--btn-m)',
        outline: 'none',
        display: 'flex',
        // 'justify-content': txtAlign || 'center',
        'align-items': 'center',
        transition: 'background-color 0.2s, transform 0.2s',
        // ...fulW && { width: '100%' },
      },
      [`.${fk}-redo-btn:hover`]: {
        'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
        color: 'var(--btn-c)',
      },
      [`.${fk}-redo-btn:active`]: {
        transform: 'scale(0.95)',
      },
      [`.${fk}-redo-btn:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'outline-offset': '2px',
        transition: 'outline-offset 0.2s ease',
      },
      [`.${fk}-redo-btn:active:focus-visible`]: {
        'outline-offset': 0,
      },
      [`.${fk}-redo-btn:disabled`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        opacity: '0.5',
      },
      [`.${fk}-signature-iframe`]: {
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
  return {}
}
