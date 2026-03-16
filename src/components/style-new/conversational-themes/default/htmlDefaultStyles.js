export default function htmlDefaultStyles(formId) {
  return {
    [`.bc${formId}-fld-wrp`]: {
      display: 'var(--fld-wrp-dis, block)',
      'flex-direction': 'var(--fld-wrp-fdir, row)',
      'background-color': 'var(--fld-wrp-bg, transparent)',
      padding: 'var(--fld-wrp-p, 0)',
      margin: 'var(--fld-wrp-m, 0)',
      position: 'relative',
      // 'box-shadow': 'var(--fld-wrp-sh, none)', // unused css
      // 'border-radius': 'var(--fld-wrp-bdr-rad, 0)', // unused css
      // border: 'var(--fld-wrp-bdr, medium none)', // unused css
      // 'border-width': 'var(--fld-wrp-bdr-width, 0)', // unused css
      'align-items': 'start',
    },
  }
}
