/* eslint-disable object-curly-newline */
import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function checkboxNradioStyle_4_individual({ fk, type, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),

      // checkbox symbol
      [`.${fk}-cks`]: {
        position: 'absolute',
        width: 0,
        height: 0,
        'pointer-events': 'none',
        'user-select': 'none',
      },
      // checkbox container
      [`.${fk}-cc`]: {
        // display: 'flex',
        // 'flex-wrap': 'wrap',
        // 'margin-top': '8px',
        display: 'grid',
        'grid-template-columns': '1',
        width: '100%',
        'grid-row-gap': '10px',
        'column-gap': '10px',
      },
      // checkbox wrapper
      [`.${fk}-cw`]: {
        // margin: '0px 10px 0px 0px', // unused css
        // padding: '6px',
        // background: 'aliceblue',
        // 'border-color': 'var(--ck-bdr-c)important',
        // border: 'solid!important',
        // 'border-width': 'var(--g-bdr-width)!important',
        // 'border-radius': 'var(--g-bdr-rad)!important',
      },
      // checkbox label
      [`.${fk}-cl`]: {
        cursor: 'pointer',
        display: 'flex',
        'align-items': 'center',
        // color: 'var(--global-font-color)',
        color: 'red',
        // background: 'var(--global-bg-color)',
        padding: '5px',
        // 'border-color': 'var(--ck-bdr-c)important',
        // border: 'solid!important',
        // 'border-width': 'var(--g-bdr-width)!important',
        // 'border-radius': 'var(--g-bdr-rad)!important',
      },
      [`.${fk}-ct`]: {
        // unused css
        // 'font-size': 'var(--fld-fs) !important',
        // 'font-family': 'var(--g-font-family)',
        // 'line-height': 'initial',
        // color: 'var(--global-font-color) !important',
      },
      // checkbox input
      [`.${fk}-ci`]: {
        position: 'absolute',
        opacity: '0!important',
      },
      [`.${fk}-ci:checked ~ .${fk}-cl .${fk}-bx`]: {
        background: 'var(--global-accent-color)',
        'border-color': 'var(--global-accent-color)',
      },
      [`.${fk}-ci:checked ~ .${fk}-other-inp-wrp`]: { display: 'block !important' },
      [`.${fk}-ci:focus ~ .${fk}-cl .${fk}-bx`]: { 'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.3)' },
      [`.${fk}-ci:focus-visible ~ .${fk}-cl .${fk}-bx`]: { 'box-shadow': '0 0 0 2px var(--global-fld-bg-color),0 0 0 4px var(--global-accent-color)' },
      [`.${fk}-ci:active ~ .${fk}-cl .${fk}-bx`]: { transform: 'scale(0.9)' },
      [`.${fk}-ci:disabled ~ .${fk}-cl`]: {
        opacity: 0.6,
        'pointer-events': 'none',
        cursor: 'not-allowed',
      },
      [`.${fk}-bx`]: {
        position: 'relative',
        height: '18px',
        width: '18px',
        border: 'solid hsl(0, 0%, 50%, 100)',
        'border-width': '2px',
        display: 'inline-flex',
        ...direction === 'rtl' && { 'margin-left': '10px' },
        ...direction !== 'rtl' && { 'margin-right': '10px' },
        transition: 'all 0.2s',
        'justify-content': 'center',
        'align-items': 'center',
        'flex-shrink': 0,
      },
      [`.${fk}-other-inp-wrp`]: { display: 'none' },
      [`.${fk}-other-inp`]: {
        display: 'inline-block !important',
        direction: 'inherit !important',
        // 'max-width': '100% !important',
        'font-family': 'var(--g-font-family)',
        margin: '0px 0px 0px 33px',
        width: 'calc(100% - 33px) !important',
        outline: 'none !important',
        'background-color': 'var(--global-fld-bg-color) !important',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-radius': 'var(--g-bdr-rad) !important',
        'border-width': 'var(--g-bdr-width) !important',
        'font-size': 'var(--fld-fs) !important',
        'font-weight': 'var(--fld-f-w) !important',
        'font-style': 'var(--fld-f-style) !important',
        color: 'var(--fld-inp-c) !important',
        padding: '10px 8px 10px 8px!important',
        'line-height': '1.4 !important',
        // height: type === 'textarea' ? 'calc(100% - 30px)' : '40px',
        height: '40px',
      },
      [`.${fk}-other-inp:focus`]: {
        'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.30) !important',
        'border-color': 'var(--global-accent-color) !important',
      },
      [`.${fk}-other-inp:hover`]: { 'border-color': 'var(--global-accent-color) !important' },

      ...type === 'check' && {
        [`.${fk}-ck`]: { 'border-radius': '5px' },
        [`.${fk}-svgwrp`]: {
          height: '12px',
          width: '10px',
          filter: 'drop-shadow(0px 1px 1px hsl(var(--gah), var(--gas), 13%))',
        },
        [`.${fk}-ck-icn`]: { 'stroke-dashoffset': '16px' },
        [`.${fk}-ck-svgline`]: {
          stroke: 'white',
          fill: 'none',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2px',
          'stroke-dasharray': '16px',
        },
        [`.${fk}-ci:checked ~ .${fk}-cl .${fk}-ck-icn`]: { 'stroke-dashoffset': 0 },
      },

      ...type === 'radio' && {
        [`.${fk}-bx::before`]: {
          content: '""',
          position: 'absolute',
          left: '50%',
          height: 0,
          width: 0,
        },
        [`.${fk}-rdo`]: { 'border-radius': '50%' },
        [`.${fk}-rdo::before`]: {
          'border-radius': '50%',
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.59, 1.82)',
          top: '50%',
          background: 'white',
          'box-shadow': '0 1px 3px 0px grey',
          transform: 'translate(-50%, -50%)',
        },
        [`.${fk}-ci:checked ~ .${fk}-cl .${fk}-rdo::before`]: {
          width: '50%',
          height: '50%',
        },
      },

    }
  }
}
