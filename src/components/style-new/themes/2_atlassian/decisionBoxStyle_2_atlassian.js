/* eslint-disable camelcase */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import decisionBoxStyle_1_bitformLegacy from '../1_bitformLegacy/decisionBoxStyle_1_bitformLegacy'

export default function decisionBoxStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      decisionBoxStyle_1_bitformLegacy({ fk, direction, breakpoint, colorScheme }),
      {
        [`.${fk}-bx`]: {
          height: '13px',
          width: '13px',
          'border-width': '3px',
          'border-color': 'hsla(var(--fic-h), var(--fic-s), var(--fic-l), 0.3)',
          'border-radius': '4px',
          'flex-shrink': 0,
        },
        [`.${fk}-ci:hover ~ [data-cl] [data-bx]`]: {
          'border-color': 'hsla(var(--fic-h), var(--fic-s), var(--fic-l), 0.4)',
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
