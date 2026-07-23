import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import multiStepStyle_1_bitformLegacy from '../1_bitformLegacy/multiStepStyle_1_bitformLegacy'

// eslint-disable-next-line camelcase
export default function multiStepStyle_0_noStyle({ formId, breakpoint = 'lg', direction, colorScheme = 'light' }) {
  // if (breakpoint === 'lg' && colorScheme === 'light') {
  return {
    ...mergeNestedObj(
      multiStepStyle_1_bitformLegacy({ formId, breakpoint, direction, colorScheme }),
      {},
    ),
    [`._frm-b${formId}-next-step-btn`]: {
      'font-family': 'inherit',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    },
    [`._frm-b${formId}-next-step-btn:hover`]: {},
    [`._frm-b${formId}-next-step-btn:active`]: {},
    [`._frm-b${formId}-next-step-btn:focus-visible`]: {},
    [`._frm-b${formId}-next-step-btn:active:focus-visible`]: {},
    [`._frm-b${formId}-next-step-btn:disabled`]: {},

    [`._frm-b${formId}-prev-step-btn`]: {
      'font-family': 'inherit',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    },
    [`._frm-b${formId}-prev-step-btn:hover`]: {},
    [`._frm-b${formId}-prev-step-btn:active`]: {},
    [`._frm-b${formId}-prev-step-btn:focus-visible`]: {},
    [`._frm-b${formId}-prev-step-btn:active:focus-visible`]: {},
    [`._frm-b${formId}-prev-step-btn:disabled`]: {},
  }
}
