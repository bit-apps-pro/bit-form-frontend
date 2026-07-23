/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import buttonStyle_1_bitformLegacy from '../1_bitformLegacy/buttonStyle_1_bitformLegacy'

/* eslint-disable camelcase */
export default function buttonStyle_2_atlassian({
  fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
}) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      buttonStyle_1_bitformLegacy({
        fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
      }),
      {
        [`.${fk}-btn`]: {
          transition: '',
        },
        [`.${fk}-btn:active`]: {
          transform: '',
        },
      },
    )
  }
  return {}
}
