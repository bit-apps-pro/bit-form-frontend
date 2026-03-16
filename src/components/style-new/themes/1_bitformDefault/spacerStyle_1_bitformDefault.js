/* eslint-disable camelcase */
export default function spacerStyle_1_bitformDefault({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: {
        display: 'flex',
        height: '100%',
        'align-items': 'center',
      },
    }
  }
  return {}
}
