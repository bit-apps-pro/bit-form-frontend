/* eslint-disable camelcase */
import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

export default function addressStyle_0_noStyle({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'sm' && colorScheme === 'light') {
    return {
      [`.${fk}-child-fld-wrp`]: { 'grid-column': 'span 12' },
    }
  }
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses_0_noStyle(fk),
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
