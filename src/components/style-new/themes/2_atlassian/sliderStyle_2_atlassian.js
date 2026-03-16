/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import sliderStyle_1_bitformDefault from '../1_bitformDefault/sliderStyle_1_bitformDefault'

export default function sliderStyle_2_atlassian({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      sliderStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }),
      {
        [`.${fk}-fld:hover`]: {
          'border-color': 'none !important',
          background: 'hsla(var(--gfbc-h), var(--gfbc-s), var(--gfbc-l), 0.6)',
        },
        [`.${fk}-fld:hover:not(:focus)`]: {
          background: 'hsla(var(--gfbc-h), var(--gfbc-s), var(--gfbc-l), 0.6) !important',
        },
        [`.${fk}-fld:focus`]: {
          'box-shadow': 'none !important',
          background: 'var(--global-bg-color)!important',
          'border-color': 'var(--global-accent-color) !important',
        },
        [`.${fk}-fld`]: {
          transition: 'background 0.2s ease',
        },
      },
    )
  }
  return {}
}
