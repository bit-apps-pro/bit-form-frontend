import commonClassStyles from './commonClassStyles'

export default function selectDefaultStyles(formId) {
  const commonStyles = commonClassStyles(formId)
  return {
    [`.bc${formId}-fld`]: {
      ...commonStyles[`.bc${formId}-fld`],
    },
    [`.bc${formId}-fld:focus`]: {
      ...commonStyles[`.bc${formId}-fld:focus`],
    },
    [`.bc${formId}-fld:hover`]: {
      ...commonStyles[`.bc${formId}-fld:hover`],
    },
    [`.bc${formId}-fld.readonly`]: {
      cursor: 'not-allowed',
      'pointer-events': 'none',
      color: 'hsla(0, 0%, 33%, 100%)',
      'background-color': 'hsla(0, 0%, 94%, 30%) !important',
    },
    [`.bc${formId}-fld:disabled`]: {
      ...commonStyles[`.bc${formId}-fld:disabled`],
      cursor: 'not-allowed',
      'pointer-events': 'none',
      'background-color': 'hsla(0, 0%, 94%, 30%) !important',
    },
    [`.bc${formId}-fld::placeholder`]: {
      ...commonStyles[`.bc${formId}-fld::placeholder`],
    },

  }
}
