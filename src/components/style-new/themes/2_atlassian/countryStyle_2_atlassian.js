/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */

import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import countryStyle_1_bitformLegacy from '../1_bitformLegacy/countryStyle_1_bitformLegacy'

export default function countryStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return mergeNestedObj(
      countryStyle_1_bitformLegacy({ fk, direction, breakpoint, colorScheme }),
      {
        [`.${fk}-option-list .option`]: {
          'border-radius': '',
          'border-width': '0 0 0 3px',
          'border-style': 'solid',
          'border-color': 'transparent',
          margin: '0 !important',
          transition: '',
          border: '',
        },
        [`.${fk}-option-list .option:hover:not(.selected-opt)`]: {
          'border-color': 'var(--global-accent-color)',
        },
        [`.${fk}-option-list .selected-opt`]: {
          'background-color': 'hsla(var(--gah), var(--gas), var(--gal), 0.2)',
          'border-color': 'var(--global-accent-color)',
          color: 'var(--global-accent-color)',
        },
        [`.${fk}-opt-search-icn`]: {
          padding: '2px',
          height: '22px',
          width: '30px',
          'border-left': '1px solid var(--bg-20)',
          ...direction === 'rtl' && { left: '5px' },
          ...direction !== 'rtl' && { right: '5px', left: 'auto' },
        },
        [`.${fk}-country-fld-wrp:focus-within:not(.menu-open):not(.disabled)`]: {
          'box-shadow': '',
        },
        [`.${fk}-country-fld-wrp`]: {
          'background-color': '',
          'border-style': '',
          'border-color': '',
          'border-radius': '',
          'border-width': '',
          overflow: '',
        },
        [`.${fk}-country-fld-wrp.menu-open`]: {
          'background-color': '',
          'box-shadow': '',
          'border-color': '',
        },
        [`.${fk}-dpd-wrp`]: {
          'background-color': 'var(--global-fld-bg-color)',
          'border-style': 'var(--global-fld-bdr) !important',
          'border-color': 'var(--global-fld-bdr-clr) !important',
          'border-radius': 'var(--g-bdr-rad) !important',
          'border-width': 'var(--g-bdr-width) !important',
          'min-height': '40px',
        },
        [`.${fk}-country-fld-wrp.menu-open .${fk}-dpd-wrp`]: {
          'border-color': 'var(--global-accent-color)!important',
          'background-color': 'var(--global-bg-color)',
        },
        [`.${fk}-country-fld-wrp:focus-within:not(.menu-open):not(.disabled) .${fk}-dpd-wrp`]: {
          'border-color': 'var(--global-accent-color)!important',
        },
        [`.${fk}-country-fld-wrp.menu-open .${fk}-option-wrp`]: {
          margin: '5px 0',
          'box-shadow': '0px 8px 12px hsla(var(--gah), var(--gas), 10%, .15), 0px 0px 1px #091e424f, 0 4px 11px var(--bg-5)',
        },
        [`.${fk}-option-wrp`]: {
          background: 'var(--global-bg-color)',
          'border-radius': 'var(--g-bdr-rad)',
          'border-style': '',
          'border-color': '',
          'border-width': '',
          transition: '', // empty because, remove transition property in this theme
        },
        [`.${fk}-option-search-wrp`]: {
          margin: '5px',
        },
        [`.${fk}-opt-search-input`]: {
          'border-radius': 'var(--g-bdr-rad) !important',
          ...direction !== 'rtl' && { padding: '0px 58px 0 10px !important' },
          ...direction === 'rtl' && { padding: '0px 10px 0 58px !important' },
        },
        [`.${fk}-search-clear-btn`]: {
          display: 'none',
          ...direction !== 'rtl' && { right: '40px' },
          ...direction === 'rtl' && { left: '40px' },
          background: 'hsla(var(--gah), var(--gas), 20%, 100%) !important',
        },
        [`.${fk}-search-clear-btn:hover`]: {
          background: 'hsla(var(--gah), var(--gas), 30%, 100%) !important',
        },
      },
    )
  }
  return {}
}
