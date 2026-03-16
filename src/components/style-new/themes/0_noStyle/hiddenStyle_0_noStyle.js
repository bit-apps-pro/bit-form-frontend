/* eslint-disable camelcase */
import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

export default function hiddenStyle_0_noStyle({ fk, type, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    const inputWrapperStyle = inputWrapperClasses_0_noStyle(fk)
    return {
      [`.${fk}-fld-wrp`]: inputWrapperStyle[`.${fk}-fld-wrp`],
      [`.${fk}-lbl-wrp`]: inputWrapperStyle[`.${fk}-lbl-wrp`],
      [`.${fk}-lbl`]: inputWrapperStyle[`.${fk}-lbl`],
      [`.${fk}-inp-fld-wrp`]: {
        position: 'relative',
        // //margin: 'var(--fld-m, 0)'
      },
      // field style
      [`.${fk}-fld`]: {
        display: 'inline-block!important',
        direction: 'inherit !important',
        width: '100% !important',
      },

    }
  }
  return {}
}
