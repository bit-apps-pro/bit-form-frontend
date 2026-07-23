/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import textStyle_1_bitformLegacy from '../1_bitformLegacy/textStyle_1_bitformLegacy'

export default function textStyle_3_bitformDefault(params) {
  const { fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix } = params
  const baseStyles = textStyle_1_bitformLegacy({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix })
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      baseStyles,
      {
        [`.${fk}-fld`]: {
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        },
        [`.${fk}-fld:focus`]: {
          'box-shadow': '0 0 0 2px hsla(var(--gah), var(--gas), var(--gal), 0.15)',
        },
      },
    )
  }
  return baseStyles
}
