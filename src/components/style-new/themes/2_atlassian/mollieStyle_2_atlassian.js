/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import mollieStyle_1_BitformDefault from '../1_bitformDefault/mollieStyle_1_BitformDefault'

/* eslint-disable camelcase */
export default function mollieStyle_2_atlassian({
  fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
}) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      mollieStyle_1_BitformDefault({
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
