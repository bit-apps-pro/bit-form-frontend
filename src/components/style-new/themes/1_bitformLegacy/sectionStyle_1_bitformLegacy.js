import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function sectionStyle_1_bitformLegacy({ fk, type, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),
      [`.${fk}-inp-fld-wrp`]: {
        display: 'grid',
        'border-style': 'dotted',
        'border-color': 'var(--global-fld-bdr-clr)',
        'border-radius': '4px',
        'border-width': '1px',
        padding: '3px',
      },
    }
  }
  return {}
}
