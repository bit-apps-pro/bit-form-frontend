/* eslint-disable camelcase */
export default function paypalStyle_1_BitformDefault({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: {
        display: 'var(--fld-wrp-dis, block)',
        'flex-direction': 'var(--fld-wrp-fdir, row)',
        'background-color': 'var(--fld-wrp-bg, transparent)',
        padding: 'var(--fld-wrp-p, 0)',
        margin: 'var(--fld-wrp-m, 0)',
        position: 'relative',
        'box-shadow': 'var(--fld-wrp-sh, none)',
        'border-style': 'var(--fld-wrp-bdr, medium)',
        'border-color': 'var(--fld-wrp-bdr-clr, none)',
        'border-radius': 'var(--fld-wrp-bdr-rad, 0)',
        'border-width': 'var(--fld-wrp-bdr-width, 0)',
      },

      [`.${fk}-inp-wrp`]: { position: 'relative', margin: '0px' },

      [`.${fk}-paypal-wrp`]: {
        width: '100%',
        'min-width': '150px',
        'max-width': '750px',
        margin: 'auto',
      },
    }
  }
  return {}
}
