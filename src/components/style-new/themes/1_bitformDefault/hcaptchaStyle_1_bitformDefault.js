/* eslint-disable camelcase */
export default function hcaptchaStyle_1_bitformDefault({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: {
        display: 'var(--fld-wrp-dis, block)',
        'flex-direction': 'var(--fld-wrp-fdir, row)',
        'justify-content': 'left',
        'background-color': 'var(--fld-wrp-bg, transparent)',
        width: '100%',
        padding: 'var(--fld-wrp-p, 0)',
        margin: 'var(--fld-wrp-m, 0)',
        position: 'relative',
        'box-shadow': 'var(--fld-wrp-sh, none)',
        'border-style': 'var(--fld-wrp-bdr, medium)',
        'border-color': 'var(--fld-wrp-bdr-clr, none)',
        'border-width': 'var(--fld-wrp-bdr-width, 0)',
        'border-radius': 'var(--fld-wrp-bdr-rad, 0)',
      },
    }
  }
  return {}
}
