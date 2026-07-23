/* eslint-disable camelcase */
import inputWrapperClasses from '../common/inputWrapperClasses'

export default function addressStyle_1_bitformLegacy({ fk, breakpoint, colorScheme }) {
  // if (breakpoint === 'sm' && colorScheme === 'light') {
  //   return {
  //     [`.${fk}-child-fld-wrp`]: { 'grid-column': 'span 12' },
  //   }
  // }
  if (breakpoint === 'lg' && colorScheme === 'light') {
    const inputWrapper = inputWrapperClasses(fk)
    return {
      ...inputWrapper,
      [`.${fk}-fld-wrp`]: {
        ...inputWrapper[`.${fk}-fld-wrp`],
        padding: '12px 0px',
      },
      [`.${fk}-lbl-wrp`]: {
        ...inputWrapper[`.${fk}-lbl-wrp`],
        padding: 'var(--lbl-wrp-p, 0px 10px)',
      },
      [`.${fk}-hlp-txt`]: {
        ...inputWrapper[`.${fk}-hlp-txt`],
        padding: 'var(--hlp-txt-p, 0px 10px)',
      },
      [`.${fk}-parent-fld-wrp`]: {
        display: 'grid',
        'grid-template-columns': 'repeat(12, 1fr)',
      },
      [`.${fk}-child-fld-wrp`]: {
        'grid-column': 'span var(--bfv-addr-col, 12)',
      },
    }
  }
  return {}
}
