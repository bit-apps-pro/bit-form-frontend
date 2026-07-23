import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function repeaterStyle_1_bitformLegacy({ fk, type, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),
      [`.${fk}-inp-fld-wrp`]: {
        // display: 'grid',
        'border-style': 'dotted',
        'border-color': 'var(--global-fld-bdr-clr)',
        'border-radius': '4px',
        'border-width': '1px',
        padding: '3px',
      },
      [`.${fk}-rpt-fld-wrp`]: {
        display: 'flex',
        'flex-direction': 'column',
      },
      [`.${fk}-rpt-wrp`]: {
        display: 'flex',
        'flex-direction': 'row',
        transition: 'all .2s ease',
      },
      [`.${fk}-rpt-wrp:nth-child(n+2)`]: {
        'border-top': 'solid',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-width': '1px !important',
        'border-radius': '0px',
      },
      [`.${fk}-rpt-grid-wrp`]: {
        width: '100%',
      },
      [`.${fk}-pair-btn-wrp`]: {
        display: 'flex',
        'flex-direction': 'row',
        'place-items': 'center',
        padding: '5px',
        'align-self': 'center',
        gap: '5px',
      },
      [`.${fk}-rpt-add-btn`]: {
        'font-size': 'var(--btn-fs)!important',
        padding: '6px',
        // background: 'var(--btn-bg)',
        color: 'var(--global-font-color) !important',
        'font-weight': 'var(--btn-fw)',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': '20px',
        'border-width': 'var(--g-bdr-width) !important',
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
      [`.${fk}-rpt-add-btn:hover`]: {
        'background-color': 'hsl(0, 0%, 86%, 1) !important',
      },
      [`.${fk}-rpt-add-btn:disabled`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        opacity: '0.5',
      },
      [`.${fk}-rpt-add-btn:focus`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        'border-color': 'var(--global-accent-color) !important',
      },
      [`.${fk}-rpt-add-btn-pre-i`]: {
        width: '18px',
      },
      [`.${fk}-rpt-add-btn-suf-i`]: {
        width: '18px',
      },
      [`.${fk}-rpt-rmv-btn`]: {
        'font-size': 'var(--btn-fs)!important',
        padding: '6px',
        // background: 'var(--btn-bg)',
        color: 'var(--global-font-color) !important',
        'font-weight': 'var(--btn-fw)',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': '20px',
        'border-width': 'var(--g-bdr-width) !important',
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
      [`.${fk}-rpt-rmv-btn:hover`]: {
        'background-color': 'hsl(0, 0%, 86%, 1) !important',
      },
      [`.${fk}-rpt-rmv-btn:disabled`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        opacity: '0.5',
      },
      [`.${fk}-rpt-rmv-btn:focus`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        'border-color': 'var(--global-accent-color) !important',
      },
      [`.${fk}-rpt-rmv-btn-pre-i`]: {
        width: '18px',
      },
      [`.${fk}-rpt-rmv-btn-suf-i`]: {
        width: '18px',
      },
      [`.${fk}-add-to-end-btn-wrp`]: {
        display: 'flex',
        'flex-direction': 'row',
        'align-self': 'start',
        padding: '2px 10px',
      },
      [`.${fk}-add-to-end-btn`]: {
        'font-size': 'var(--btn-fs)!important',
        padding: '8px 10px',
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
        'justify-content': 'center',
        'align-items': 'center',
        transition: 'background-color 0.2s, transform 0.2s',
      },
      [`.${fk}-add-to-end-btn:hover`]: {
        'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
      },
      [`.${fk}-add-to-end-btn:active`]: {
        transform: 'scale(0.95)',
      },
      [`.${fk}-add-to-end-btn:disabled`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        opacity: '0.5',
      },
      [`.${fk}-add-to-end-btn:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'outline-offset': '2px',
        transition: 'outline-offset 0.2s ease',
      },
      [`.${fk}-add-to-end-btn:active:focus-visible`]: {
        'outline-offset': 0,
      },
      [`.${fk}-add-to-end-btn-pre-i`]: {
        width: '18px',
        filter: 'invert(1)',
      },
      [`.${fk}-add-to-end-btn-suf-i`]: {
        width: '18px',
        filter: 'invert(1)',
      },
    }
  }
  return {}
}
