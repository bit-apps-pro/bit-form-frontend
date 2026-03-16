/* eslint-disable camelcase */
export default function shortcodeStyle_0_noStyle({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: {
        display: 'var(--fld-wrp-dis)',
        'flex-direction': 'var(--fld-wrp-fdir)',
        'background-color': 'var(--fld-wrp-bg)',
        padding: 'var(--fld-wrp-p)',
        margin: 'var(--fld-wrp-m)',
        position: 'relative',
        // 'box-shadow': 'var(--fld-wrp-sh, none)', // unused css
        // 'border-radius': 'var(--fld-wrp-bdr-rad, 0)', // unused css
        // border: 'var(--fld-wrp-bdr, medium none)', // unused css
        // 'border-width': 'var(--fld-wrp-bdr-width, 0)', // unused css
        'align-items': 'start',
      },
    }
  }
  return {}
}
