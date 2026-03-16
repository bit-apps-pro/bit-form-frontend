/* eslint-disable camelcase */
export default function hcaptchaStyle_0_noStyle({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      [`.${fk}-fld-wrp`]: {
        display: 'var(--fld-wrp-dis)',
        'flex-direction': 'var(--fld-wrp-fdir)',
        'justify-content': 'left',
        'background-color': 'var(--fld-wrp-bg)',
        width: '100%',
        padding: 'var(--fld-wrp-p)',
        margin: 'var(--fld-wrp-m)',
        position: 'relative',
        'box-shadow': 'var(--fld-wrp-sh)',
        'border-style': 'var(--fld-wrp-bdr)',
        'border-color': 'var(--fld-wrp-bdr-clr)',
        'border-width': 'var(--fld-wrp-bdr-width)',
        'border-radius': 'var(--fld-wrp-bdr-rad)',
      },
    }
  }
  return {}
}
