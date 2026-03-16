import commonClassStyles from './commonClassStyles'

export default function textDefaultStyles(formId) {
  const commonStyles = commonClassStyles(formId)
  return {
    [`.bc${formId}-fld`]: {
      ...commonStyles[`.bc${formId}-fld`],
    },
    [`textarea.bc${formId}-fld`]: {
      ...commonStyles[`textarea.bc${formId}-fld`],
    },
    [`input.bc${formId}-fld[type="color" i][list]::-webkit-color-swatch`]: { border: 0, 'border-radius': '2px' },
    [`.bc${formId}-fld:focus`]: {
      ...commonStyles[`.bc${formId}-fld:focus`],
    },
    [`.bc${formId}-fld:hover`]: {
      ...commonStyles[`.bc${formId}-fld:hover`],
    },
    [`.bc${formId}-fld:disabled`]: {
      ...commonStyles[`.bc${formId}-fld:disabled`],
    },
    [`.bc${formId}-fld:read-only`]: {
      ...commonStyles[`.bc${formId}-fld:read-only`],
    },
    [`.bc${formId}-fld::placeholder`]: {
      ...commonStyles[`.bc${formId}-fld::placeholder`],
    },
    [`.bc${formId}-pre-i`]: {
      ...commonStyles[`.bc${formId}-pre-i`],
    },
    [`.bc${formId}-suf-i`]: {
      ...commonStyles[`.bc${formId}-suf-i`],
    },
  }
}
