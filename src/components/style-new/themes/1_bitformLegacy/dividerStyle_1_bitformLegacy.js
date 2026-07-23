/* eslint-disable camelcase */
export default function dividerStyle_1_bitformLegacy({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: {
        display: 'flex',
        height: '100%',
        'align-items': 'center',
      },
      [`.${fk}-divider`]: {
        margin: '15px 10px 15px 10px',
        width: '100%',
        'border-bottom': 'solid',
        'border-color': 'var(--bg-50)',
        'border-width': '1px !important',
      },
    }
  }
  return {}
}
