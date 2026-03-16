/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import decisionBoxStyle_1_bitformDefault from '../1_bitformDefault/decisionBoxStyle_1_bitformDefault'

export default function decisionBoxStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      decisionBoxStyle_1_bitformDefault({ fk, direction, breakpoint, colorScheme }),
      {
        [`.${fk}-bx`]: {
          height: '13px',
          width: '13px',
          'border-width': '3px',
          'border-color': 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.3)',
          'border-radius': '4px',
          'flex-shrink': 0,
        },
        [`.${fk}-ci:hover ~ [data-cl] [data-bx]`]: {
          'border-color': 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.4)',
          'background-color': 'var(--bg-5)',
        },
        [`.${fk}-ci:focus ~ [data-cl] [data-bx]`]: {
          'box-shadow': '',
        },
        [`.${fk}-ci:checked ~ [data-cl] [data-bx]`]: {
          background: 'var(--global-accent-color) !important',
          'border-color': 'var(--global-accent-color) !important',
        },
      },
    )
  }
  return {}
}
