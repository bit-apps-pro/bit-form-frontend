/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import mollieStyle_1_bitformLegacy from '../1_bitformLegacy/mollieStyle_1_bitformLegacy'

/* eslint-disable camelcase */
export default function mollieStyle_2_atlassian({
  fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
}) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      mollieStyle_1_bitformLegacy({
        fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
      }),
      {
        [`.${fk}-mollie-btn`]: {
          transition: '',
        },
        [`.${fk}-mollie-btn:active`]: {
          transform: '',
        },
      },
    )
  }
  return {}
}
