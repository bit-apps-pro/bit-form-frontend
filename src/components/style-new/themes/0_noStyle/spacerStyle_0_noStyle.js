/* eslint-disable camelcase */
export default function spacerStyle_0_noStyle({ fk, breakpoint, colorScheme }) {
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
