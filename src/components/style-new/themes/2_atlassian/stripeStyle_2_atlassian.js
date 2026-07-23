/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import stripeStyle_1_bitformLegacy from '../1_bitformLegacy/stripeStyle_1_bitformLegacy'

/* eslint-disable camelcase */
export default function stripeStyle_2_atlassian({
  fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
}) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      stripeStyle_1_bitformLegacy({
        fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
      }),
      {
        [`.${fk}-stripe-btn`]: {
          transition: '',
        },
        [`.${fk}-stripe-btn:active`]: {
          transform: '',
        },
      },
    )
  }
  return {}
}
