import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import multiStepStyle_1_bitformLegacy from '../1_bitformLegacy/multiStepStyle_1_bitformLegacy'

// eslint-disable-next-line camelcase
export default function multiStepeStyle_2_atlassian({ formId, breakpoint = 'lg', direction, colorScheme = 'light' }) {
  // if (breakpoint === 'lg' && colorScheme === 'light') {
  const baseStyles = multiStepStyle_1_bitformLegacy({ formId, breakpoint, direction, colorScheme })
  return mergeNestedObj(
    baseStyles,
    {
      [`._frm-b${formId}-stp-hdr-wrpr`]: {
        'background-color': 'var(--global-fld-bg-color)',
        'border-bottom': '3px solid var(--global-fld-bdr-clr) !important',
      },
      [`._frm-b${formId}-stp-hdr-lbl`]: {
        'font-size': '0.8rem',
      },
      [`._frm-b${formId}-stp-hdr-sub-titl`]: {
        'font-size': '0.7rem',
      },
      [`._frm-b${formId}-stp-progress-bar`]: {
        background: 'hsla(var(--gfbc-h), var(--gfbc-s), var(--gfbc-l), 0.6) !important',
        'border-radius': 'var(--g-bdr-rad)',
      },
      [`._frm-b${formId}-stp-hdr.active ._frm-b${formId}-stp-icn-cntn`]: {
        'box-shadow': 'none',
        'border-width': '3px !important',
      },
      [`._frm-b${formId}-stp-hdr.completed ._frm-b${formId}-stp-icn-cntn`]: {
        'background-color': 'hsla(var(--gah), var(--gas), var(--gal), 0.10) !important',
      },
    },
  )
}
