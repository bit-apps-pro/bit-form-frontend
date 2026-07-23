import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function buttonStyle_1_bitformLegacy({
  fk, breakpoint, direction, colorScheme, align, txtAlign, btnTyp, fulW,
}) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    let bgClr = 'var(--btn-bg)'
    let clr = 'var(--btn-c)'
    let bdrClr = 'var(--btn-bdr-clr)'
    let bdrStl = 'var(--btn-bdr)'
    let bdrWdth = 'var(--btn-bdr-width)'

    if (btnTyp === 'reset') {
      bgClr = 'hsla(240, 12%, 94%, 100)'
      clr = 'hsla(208, 46%, 25%, 100)'
    }

    if (btnTyp === 'save-draft') {
      bgClr = 'hsla(0, 0%, 100%, 100)'
      clr = 'var(--btn-bgc)'
      bdrClr = 'var(--btn-bgc)'
      bdrStl = 'solid'
      bdrWdth = '1px'
    }

    return {
      ...inputWrapperClasses(fk),
      [`.${fk}-inp-fld-wrp`]: {
        ...inputWrapperClasses(fk)[`.${fk}-inp-fld-wrp`],
        display: 'flex',
        ...align && { 'justify-content': align },
      },

      [`.${fk}-btn`]: {
        'font-size': 'var(--btn-fs)!important',
        padding: 'var(--btn-p)!important',
        // 'background-color': 'var(--btn-bgc)',
        background: bgClr,
        color: clr,
        'font-weight': 'var(--btn-fw)',
        'border-style': bdrStl,
        'border-color': bdrClr,
        'border-width': bdrWdth,
        'border-radius': 'var(--btn-bdr-rad) !important',
        'box-shadow': 'var(--btn-sh)',
        cursor: 'pointer',
        'font-family': 'inherit',
        'font-style': 'var(--btn-f-style)',
        'line-height': '1',
        margin: 'var(--btn-m)',
        outline: 'none',
        display: 'flex',
        'justify-content': txtAlign || 'center',
        'align-items': 'center',
        transition: 'background-color 0.2s, transform 0.2s',
        ...fulW && { width: '100%' },
      },
      [`.${fk}-btn:hover`]: {
        'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
        ...btnTyp === 'save-draft' && { color: 'var(--btn-c)' },
      },
      [`.${fk}-btn:active`]: {
        transform: 'scale(0.95)',
      },
      [`.${fk}-btn:focus-visible`]: {
        outline: '2px solid var(--global-accent-color)',
        'outline-offset': '2px',
        transition: 'outline-offset 0.2s ease',
      },
      [`.${fk}-btn:active:focus-visible`]: {
        'outline-offset': 0,
      },
      [`.${fk}-btn:disabled`]: {
        cursor: 'not-allowed',
        'pointer-events': 'none',
        opacity: '0.5',
      },
      [`.${fk}-btn-pre-i`]: {
        width: '20px',
        height: '20px',
        ...direction !== 'rtl' && { margin: '0px 5px 0px 0px' },
        ...direction === 'rtl' && { margin: '0px 0px 0px 5px' },
      },
      [`.${fk}-btn-suf-i`]: {
        width: '20px',
        height: '20px',
        ...direction !== 'rtl' && { margin: '0px 0px 0px 5px' },
        ...direction === 'rtl' && { margin: '0px 5px 0px 0px' },
      },
    }
  }
  return {}
}
