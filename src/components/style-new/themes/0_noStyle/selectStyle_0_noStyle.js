/* eslint-disable camelcase */

import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

export default function selectStyle_0_noStyle({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses_0_noStyle(fk),

      [`.${fk}-fld`]: {
        display: ' inline-block !important',
        direction: 'inherit',
        width: '100% !important',
      },
      [`.${fk}-fld:focus`]: {},
      [`.${fk}-fld:hover`]: {},
      [`.${fk}-fld.readonly`]: {},
      [`.${fk}-fld:disabled`]: {},
      [`.${fk}-fld::placeholder`]: {},

      [`.${fk}-pre-i`]: {
        width: '15px',
        height: '15px',
        'margin-right': '5px',
      },
      [`.${fk}-suf-i`]: {
        width: '15px',
        height: '15px',
        'margin-left': '5px',
      },
    }
  }
  return {}
}
