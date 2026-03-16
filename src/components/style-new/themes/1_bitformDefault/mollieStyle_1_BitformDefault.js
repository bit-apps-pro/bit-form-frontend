import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function mollieStyle_1_BitformDefault({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    const inputWrpStyle = inputWrapperClasses(fk)
    return {
      [`.${fk}-fld-wrp`]: {
        display: 'var(--fld-wrp-dis, block)',
        'flex-direction': 'var(--fld-wrp-fdir, row)',
        'background-color': 'var(--fld-wrp-bg, transparent)',
        padding: 'var(--fld-wrp-p, 0)',
        margin: 'var(--fld-wrp-m, 0)',
        position: 'relative',
        'box-shadow': 'var(--fld-wrp-sh, none)',
        'border-style': 'var(--fld-wrp-bdr, medium)',
        'border-color': 'var(--fld-wrp-bdr-clr, none)',
        'border-radius': 'var(--fld-wrp-bdr-rad, 0)',
        'border-width': 'var(--fld-wrp-bdr-width, 0)',
      },

      [`.${fk}-inp-wrp`]: { position: 'relative', margin: '0px' },

      [`.${fk}-mollie-wrp`]: {
        width: '100%',
        // 'min-width': '150px',
        // 'max-width': '750px',
        display: 'flex',
        'justify-content': 'center',
        // 'align-items': 'center',
      },
      [`.${fk}-mollie-btn`]: {
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
        'justify-content': 'center',
        'align-items': 'center',
        transition: 'background-color 0.2s, transform 0.2s',
        width: '100%',
        gap: '5px',
      },
      [`.${fk}-mollie-btn:hover`]: {
        'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
      },
      [`.${fk}-mollie-btn:active`]: {
        transform: 'scale(0.95)',
      },
      [`.${fk}-mollie-btn:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'outline-offset': '2px',
        transition: 'outline-offset 0.2s ease',
      },
      [`.${fk}-mollie-btn:active:focus-visible`]: {
        'outline-offset': 0,
      },
      [`.${fk}-mollie-btn:disabled`]: {
        background: '#7ca5e7',
        transform: 'none',
      },
      [`.${fk}-mollie-icn`]: {
        height: '18px',
        width: '18px',
      },

      [`.${fk}-err-wrp`]: {
        ...inputWrpStyle[`.${fk}-err-wrp`],
      },
      [`.${fk}-err-msg`]: {
        ...inputWrpStyle[`.${fk}-err-msg`],
      },
      [`.${fk}-err-txt`]: {
        ...inputWrpStyle[`.${fk}-err-txt`],
      },
      [`.${fk}-err-inner`]: {
        ...inputWrpStyle[`.${fk}-err-inner`],
      },
    }
  }
  return {}
}
