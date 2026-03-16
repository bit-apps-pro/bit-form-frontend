export default function sectionDefaultStyles(formId) {
  return {
    [`.bc${formId}-inner-grid-fld-wrp`]: {
      display: 'grid',
      'border-style': 'dotted',
      'border-color': `var(--bc${formId}-a-clr)`,
      'border-radius': '4px',
      'border-width': '1px',
      padding: '3px',
    },
  }
}
