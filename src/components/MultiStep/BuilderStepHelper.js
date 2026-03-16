/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import multiStepStyle_0_noStyle from '../style-new/themes/0_noStyle/multiStepStyle_0_noStyle'
import multiStepStyle_1_bitformDefault from '../style-new/themes/1_bitformDefault/multiStepStyle_1_bitformDefaullt'
import multiStepeStyle_2_atlassian from '../style-new/themes/2_atlassian/multiStepStyle_2_atlassian'

export const getMultiStepStyle = (formID, theme) => {
  if (theme === 'noStyle') return multiStepStyle_0_noStyle({ formId: formID })
  if (theme === 'bitformDefault') return multiStepStyle_1_bitformDefault({ formId: formID })
  if (theme === 'atlassian') return multiStepeStyle_2_atlassian({ formId: formID })
  return multiStepStyle_1_bitformDefault({ formId: formID })
}

export const multiStepResponsiveStaticStyles = (formID) => ({
  '@media (max-width: 576px)': {
    [`._frm-b${formID}-stp-hdr-lbl`]: {
      'font-size': '12px',
    },
    [`._frm-b${formID}-stp-hdr-sub-titl`]: {
      display: 'none',
    },
    [`._frm-b${formID}-stp-progress-bar`]: {
      'font-size': '.65rem',
      height: '.8rem',
    },
  },
})
