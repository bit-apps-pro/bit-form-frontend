import { paddingGenerator } from '../../styleHelpers'
import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function textStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }) {
  let inpPadding = 'var(--fld-p)!important'
  if (fldPrefix) inpPadding = paddingGenerator(inpPadding, 'left', true)
  if (fldSuffix) inpPadding = paddingGenerator(inpPadding, 'right', true)
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),

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
        padding: inpPadding,
        margin: 'var(--fld-m)!important',
        'line-height': '1.4 !important',
        height: type === 'textarea' ? '' : '40px',
        ...type === 'textarea' && { resize: 'vertical' },
      },
      ...type === 'color' && { 'input[type="color" i][list]::-webkit-color-swatch': { border: 0, 'border-radius': '2px' } },
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
        'border-color': 'var(--pre-i-bdr-clr)',
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
        'border-color': 'var(--suf-i-bdr-clr)',
        'border-width': 'var(--suf-i-bdr-width)',
        'border-radius': 'var(--suf-i-bdr-rad)',
      },

      [`.${fk}-fld:focus ~ .${fk}-pre-i`]: { filter: 'var(--fld-focs-i-fltr)' },
      [`.${fk}-fld:focus ~ .${fk}-suf-i`]: { filter: 'var(--fld-focs-i-fltr)' },
    }
  }
  return {}
}
