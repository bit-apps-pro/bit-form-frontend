import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function hiddenStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme }) {
  const inputWrapperStyleClasses = inputWrapperClasses(fk)
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: inputWrapperStyleClasses[`.${fk}-fld-wrp`],
      [`.${fk}-lbl-wrp`]: inputWrapperStyleClasses[`.${fk}-lbl-wrp`],
      [`.${fk}-lbl`]: inputWrapperStyleClasses[`.${fk}-lbl`],

      [`.${fk}-inp-fld-wrp`]: { position: 'relative', margin: '0px' },
      // field style
      [`.${fk}-fld`]: {
        display: type === 'textarea' ? 'block!important' : 'inline-block!important',
        direction: 'inherit !important',
        'font-family': 'inherit',
        width: '100% !important',
        outline: 'none !important',
        'background-color': 'var(--global-fld-bg-color) !important',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        'border-width': 'var(--g-bdr-width) !important',
        'font-size': 'var(--fld-fs) !important',
        'font-weight': 'var(--fld-f-w) !important',
        'font-style': 'var(--fld-f-style) !important',
        color: 'var(--fld-inp-c) !important',
        padding: 'var(--fld-p)!important',
        margin: 'var(--fld-m)!important',
        'line-height': '1.4 !important',
        height: type === 'textarea' ? '' : '40px',
        ...type === 'textarea' && { resize: 'vertical' },
      },
      [`.${fk}-fld:focus`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        'border-color': 'var(--global-accent-color) !important',
      },
      [`.${fk}-fld:hover`]: { 'border-color': 'var(--global-accent-color) !important' },
      [`.${fk}-fld:disabled`]: {
        cursor: 'default',
        'background-color': 'var(--bg-5)!important',
        color: 'hsla(var(--gfh), var(--gfs), var(--gfl), .5) !important',
        'border-color': 'var(--bg-5) !important',
      },
      [`.${fk}-fld:read-only`]: {
        cursor: 'default',
      },
      [`.${fk}-fld::placeholder`]: {
        'font-family': 'inherit',
        color: 'hsla(var(--gfh), var(--gfs), var(--gfl), 40%) !important',
      },
    }
  }
  return {}
}
