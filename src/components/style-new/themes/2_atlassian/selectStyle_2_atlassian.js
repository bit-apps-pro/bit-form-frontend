/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import selectStyle_1_bitformLegacy from '../1_bitformLegacy/selectStyle_1_bitformLegacy'

export default function selectStyle_2_atlassian({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      selectStyle_1_bitformLegacy({ fk, breakpoint, colorScheme }),
      {
        [`.${fk}-fld`]: {
          transition: 'background 0.2s ease',
        },
        [`.${fk}-fld:hover`]: {
          'border-color': 'none !important',
          background: 'hsla(var(--gfbc-h), var(--gfbc-s), var(--gfbc-l), 0.6)',
        },
        [`.${fk}-fld:hover:not(:focus)`]: {
          background: 'hsla(var(--gfbc-h), var(--gfbc-s), var(--gfbc-l), 0.6) !important',
        },
        [`.${fk}-fld:focus`]: {
          'box-shadow': '',
          'border-color': 'var(--global-accent-color)!important',
          background: 'var(--global-bg-color)!important',
        },
      },
    )
  }
  return {}
}
