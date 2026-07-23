/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import signatureStyle_1_bitformLegacy from '../1_bitformLegacy/signatureStyle_1_bitformLegacy'

/* eslint-disable camelcase */
export default function signatureStyle_2_atlassian({
  fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
}) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      signatureStyle_1_bitformLegacy({
        fk, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
      }),
      {
        [`.${fk}-clr-btn`]: {
          transition: '',
        },
        [`.${fk}-clr-btn:active`]: {
          transform: '',
        },
        [`.${fk}-undo-btn`]: {
          transition: '',
        },
        [`.${fk}-undo-btn:active`]: {
          transform: '',
        },
        [`.${fk}-redo-btn`]: {
          transition: '',
        },
        [`.${fk}-redo-btn:active`]: {
          transform: '',
        },
      },
    )
  }
  return {}
}
