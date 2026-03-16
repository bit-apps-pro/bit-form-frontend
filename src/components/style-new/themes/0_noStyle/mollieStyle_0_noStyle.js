/* eslint-disable camelcase */
import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

export default function mollieStyle_0_noStyle({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: {
        ...inputWrapperClasses_0_noStyle(fk)[`.${fk}-fld-wrp`],
        display: 'flex',
      },

      [`.${fk}-inp-wrp`]: {
        ...inputWrapperClasses_0_noStyle(fk)[`.${fk}-inp-wrp`],
      },

      [`.${fk}-mollie-btn`]: {
        'font-family': 'inherit',
        'justify-content': 'center',
        'align-items': 'center',
        gap: '5px',
      },

      [`.${fk}-mollie-btn:hover`]: {},

      [`.${fk}-mollie-btn:active`]: {},

      [`.${fk}-mollie-btn:focus-visible`]: {},

      [`.${fk}-mollie-btn:active:focus-visible`]: {},

      [`.${fk}-mollie-icn`]: {
        height: '18px',
        width: '18px',
      },
      [`.${fk}-mollie-fld`]: {
        margin: '10px 0px',
      },
    }
  }
  return {}
}
