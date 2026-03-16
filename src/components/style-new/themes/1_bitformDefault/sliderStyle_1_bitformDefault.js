import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function sliderStyle_1_bitformDefault({ fk, direction, breakpoint, colorScheme, fldPrefix, fldSuffix }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),
      [`.${fk}-inp-fld-wrp`]: { margin: 'var(--fld-m, 0)' },
      // field style
      [`.${fk}-fld`]: {
        display: 'inline-block!important',
        direction: 'inherit !important',
        'font-family': 'inherit',
        width: '100% !important',
        outline: 'none !important',
        'background-color': 'var(--global-fld-bg-color) !important',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        'border-width': 'var(--g-bdr-width) !important',
        color: 'var(--fld-inp-c) !important',
        margin: '0px 0px 1.2rem 0px !important',
        'line-height': '1.4 !important',
        'accent-color': 'var(--global-accent-color) !important',
        position: 'relative',
        '-webkit-appearance': 'none',
        height: '12px',
        opacity: '0.8',
        transition: 'opacity .2s',
        '--bfv-lower-track-clr': 'var(--global-accent-color)',
        '--bfv-upper-track-clr': '#ffffff',
        '--bfv-fill-lower-track': '50%',
        '--bfv-thumb-clr': 'var(--global-accent-color)',
        '--bfv-track-dir': direction === 'rtl' ? 'to left' : 'to right',
      },
      [`.${fk}-fld::before`]: {
        content: 'attr(min)',
        display: 'block',
        position: 'absolute',
        bottom: '-3ch',
        'pointer-events': 'none',
      },

      [`.${fk}-fld::after`]: {
        content: 'attr(max)',
        display: 'block',
        position: 'absolute',
        bottom: '-3ch',
        right: '0',
        'pointer-events': 'none',
      },

      [`.${fk}-slider-val`]: {
        color: 'var(--fld-inp-c) !important',
        'font-size': 'var(--hlp-txt-fs)',
        // display: 'flex',
        'align-items': 'center',
        width: '100%',
        'font-weight': 'var(--hlp-txt-font-w)',
        'font-style': 'var(--hlp-txt-font-style)',
      },

      [`.${fk}-slider-val::after`]: {
        content: "' ' var(--bfv-fld-val)",
        display: 'inline-block',
        // position: 'absolute',
        // bottom: '-2ch',
        // right: '0',
        // 'pointer-events': 'none',
      },

      [`.${fk}-fld::-webkit-slider-thumb`]: {
        '-webkit-appearance': 'none',
        appearance: 'none',
        'background-color': 'var(--bfv-thumb-clr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': '50%',
        cursor: 'pointer',
        width: '20px',
        height: '20px',
        'margin-top': '-5px',
      },
      [`.${fk}-fld:focus::-webkit-slider-thumb`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
      },
      [`.${fk}-fld::-webkit-slider-thumb:active`]: {
        cursor: 'grab',
      },
      [`.${fk}-fld::-moz-range-thumb`]: {
        'background-color': 'var(--bfv-thumb-clr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': '50%',
        cursor: 'pointer',
        width: '20px',
        height: '20px',
      },
      [`.${fk}-fld:focus::-moz-range-thumb`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
      },
      [`.${fk}-fld::-moz-range-thumb:active`]: {
        cursor: 'grab',
      },
      [`.${fk}-fld::-ms-thumb`]: {
        'background-color': 'var(--bfv-thumb-clr) !important',
        cursor: 'pointer',
        width: '20px',
        height: '20px',
      },
      [`.${fk}-fld::-ms-thumb:active`]: {
        cursor: 'grab',
      },
      [`.${fk}-fld::-webkit-slider-runnable-track`]: {
        background: 'linear-gradient(var(--bfv-track-dir,to left), var(--bfv-lower-track-clr), var(--bfv-lower-track-clr) var(--bfv-fill-lower-track), var(--bfv-upper-track-clr) var(--bfv-fill-lower-track), var(--bfv-upper-track-clr) 100%)',
        'border-radius': 'var(--g-bdr-rad) !important',
        height: '10px',
      },
      [`.${fk}-fld::-moz-range-track`]: {
        'background-color': 'var(--bfv-upper-track-clr)',
        'border-radius': 'var(--g-bdr-rad) !important',
        height: '10px',
      },
      [`.${fk}-fld::-ms-track`]: {
        'background-color': 'var(--bfv-upper-track-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        height: '10px',
      },
      [`.${fk}-fld::-moz-range-progress`]: {
        'background-color': 'var(--bfv-lower-track-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        height: '10px',
      },
      [`.${fk}-fld::-ms-fill-lower`]: {
        'background-color': 'var(--bfv-lower-track-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        height: '10px',
      },
      [`.${fk}-fld:focus`]: {
        // 'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        // 'border-color': 'var(--global-accent-color) !important',
      },
      [`.${fk}-fld:hover`]: {
        'border-color': 'var(--global-accent-color) !important',
        opacity: '1',
        cursor: 'pointer',
      },
      [`.${fk}-fld:disabled`]: {
        cursor: 'default',
        'background-color': 'var(--bg-5)!important',
        color: 'hsla(var(--gfh), var(--gfs), var(--gfl), .5) !important',
        'border-color': 'var(--bg-5) !important',
      },

      [`.${fk}-fld:focus ~ .${fk}-pre-i`]: { filter: 'var(--fld-focs-i-fltr)' },
      [`.${fk}-fld:focus ~ .${fk}-suf-i`]: { filter: 'var(--fld-focs-i-fltr)' },
    }
  }
  return {}
}
