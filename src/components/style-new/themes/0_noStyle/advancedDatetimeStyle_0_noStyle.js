/* eslint-disable camelcase */
import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

export default function advancedDatetimeStyle_0_noStyle({ fk, type, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses_0_noStyle(fk),

      [`.${fk}-inp-fld-wrp`]: {
        position: 'relative',
      },
      // field style
      [`.${fk}-fld`]: {
        display: type === 'textarea' ? 'block!important' : 'inline-block!important',
        direction: 'inherit !important',
        // 'font-family': 'inherit',
        width: '100% !important',
      },
      [`.${fk}-fld:focus`]: {
      },
      [`.${fk}-fld:hover`]: {
        // 'border-//color': 'var(--global-accent-//color) !important'
      },
      [`.${fk}-fld:disabled`]: {

      },
      [`.${fk}-fld:read-only`]: {

      },
      [`.${fk}-fld::placeholder`]: {

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
