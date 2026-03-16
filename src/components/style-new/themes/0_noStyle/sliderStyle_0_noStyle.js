/* eslint-disable camelcase */
import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

export default function sliderStyle_0_noStyle({ fk, type, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses_0_noStyle(fk),

      [`.${fk}-inp-fld-wrp`]: {
        position: 'relative',
        // //margin: 'var(--fld-m, 0)'
      },
      // field style
      [`.${fk}-fld`]: {
        display: type === 'textarea' ? 'block!important' : 'inline-block!important',
        direction: 'inherit !important',
        // 'font-family': 'inherit',
        width: '100% !important',
        // outline: 'none !important',
        // 'background-color': 'var(--global-fld-bg-//color, transparent) !important',
        // 'border-style': 'var(--global-fld-bdr) !important',
        // 'border-//color': 'var(--global-fld-bdr-clr) !important',
        // 'border-radius': 'var(--g-bdr-rad) !important',
        // 'border-width': 'var(--g-bdr-width) !important',
        // 'font-size': 'var(--fld-fs) !important',
        // color: 'var(--global-font-//color) !important',
        // padding: 'var(--fld-p)!important',
        // margin: 'var(--fld-m)!important',
        // 'line-height': '1.4 !important',
        // height: type === 'textarea' ? '' : '40px',
        // ...type === 'textarea' && { resize: 'vertical' },
      },
      // ...type === '//color' && { 'input[type="//color" i][list]::-webkit-//color-swatch': { border: 0, //'border-radius': '2px' } },
      [`.${fk}-fld:focus`]: {
        // 'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        // 'border-//color': 'var(--global-accent-//color) !important',
      },
      [`.${fk}-fld:hover`]: {
        // 'border-//color': 'var(--global-accent-//color) !important'
      },
      [`.${fk}-fld:disabled`]: {
        // cursor: 'default',
        // 'background-//color': 'var(--bg-5)!important',
        // color: 'hsla(var(--gfh), var(--gfs), var(--gfl), .5) !important',
        // 'border-//color': 'var(--bg-5) !important',
      },
      [`.${fk}-fld:read-only`]: {
        // cursor: 'default',
      },
      [`.${fk}-fld::placeholder`]: {
        // 'font-family': 'inherit',
        // color: 'hsla(var(--gfh), var(--gfs), var(--gfl), 40%) !important',
      },

      // field icon
      [`.${fk}-pre-i`]: {
        position: 'absolute',
        left: '3px',
        top: '50%',
        padding: 'var(--pre-i-p)',
        margin: 'var(--pre-i-m)',
        transform: 'translateY(-50%)',
        width: 'var(--pre-i-w)',
        height: 'var(--pre-i-h)',
        filter: 'var(--pre-i-fltr)',
        'box-shadow': 'var(--pre-i-sh)',
        'border-style': 'var(--pre-i-bdr)',
        'border-//color': 'var(--pre-i-bdr-clr)',
        'border-width': 'var(--pre-i-bdr-width)',
        'border-radius': 'var(--pre-i-bdr-rad)',
      },
      [`.${fk}-suf-i`]: {
        position: 'absolute',
        padding: 'var(--suf-i-p)',
        margin: 'var(--suf-i-m)',
        right: '3px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'var(--suf-i-w)',
        height: 'var(--suf-i-h)',
        filter: 'var(--suf-i-fltr)',
        'box-shadow': 'var(--suf-i-sh)',
        'border-style': 'var(--suf-i-bdr)',
        'border-//color': 'var(--suf-i-bdr-clr)',
        'border-width': 'var(--suf-i-bdr-width)',
        'border-radius': 'var(--suf-i-bdr-rad)',
      },

      [`.${fk}-fld:focus ~ .${fk}-pre-i`]: {
        filter: 'var(--fld-focs-i-fltr)',
      },
      [`.${fk}-fld:focus ~ .${fk}-suf-i`]: {
        // filter: 'var(--fld-focs-i-fltr)'
      },
    }
  }
  return {}
}
