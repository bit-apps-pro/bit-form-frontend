/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import checkboxNradioStyle_1_bitformLegacy from '../1_bitformLegacy/checkboxNradioStyle_1_bitformLegacy'

/* eslint-disable camelcase */
export default function checkboxNradioStyle_2_atlassian({ fk, type, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      checkboxNradioStyle_1_bitformLegacy({ fk, type, direction, breakpoint, colorScheme }),
      {
        [`.${fk}-bx`]: {
          height: '13px',
          width: '13px',
          'border-width': '3px',
          'border-color': 'hsla(var(--fic-h), var(--fic-s), var(--fic-l), 0.3)',
          ...type === 'check' && { 'border-radius': '4px' },
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
