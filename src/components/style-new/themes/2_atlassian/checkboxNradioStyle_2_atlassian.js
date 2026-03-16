/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import checkboxNradioStyle_1_bitformDefault from '../1_bitformDefault/checkboxNradioStyle_1_bitformDefault'

/* eslint-disable camelcase */
export default function checkboxNradioStyle_2_atlassian({ fk, type, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      checkboxNradioStyle_1_bitformDefault({ fk, type, direction, breakpoint, colorScheme }),
      {
        [`.${fk}-bx`]: {
          height: '13px',
          width: '13px',
          'border-width': '3px',
          'border-color': 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.3)',
          ...type === 'check' && { 'border-radius': '4px' },
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
