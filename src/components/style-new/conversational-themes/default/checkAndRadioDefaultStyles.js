import commonClassStyles from './commonClassStyles'

export default function checkAndRadioDefaultStyles(formId, type) {
  const commonStyles = commonClassStyles(formId)
  return {
    [`.bc${formId}-cks`]: {
      position: 'absolute',
      width: 0,
      height: 0,
      'pointer-events': 'none',
      'user-select': 'none',
    },
    [`.bc${formId}-cc`]: {

      display: 'grid',
      'grid-template-columns': '1fr',
      width: '100%',
      'grid-row-gap': '5px',
      'column-gap': '10px',
    },
    // checkbox wrapper
    [`.bc${formId}-cw`]: {
      position: 'relative',
    },
    // checkbox label
    [`.bc${formId}-cl`]: {
      cursor: 'pointer',
      display: 'flex',
      'align-items': 'center',
      color: `var(--bc${formId}-fld-clr)`,
      padding: '10px',
      'border-style': 'solid',
      'border-color': `var(--bc${formId}-fld-bdr-clr) !important`,
      'border-radius': '5px !important',
      'border-width': '1px !important',
    },
    [`.bc${formId}-cl:hover`]: {
      'background-color': `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.15) !important`,
    },
    [`.bc${formId}-ct`]: {
      'font-size': 'var(--fld-fs)',
    },
    [`.bc${formId}-ci`]: {
      position: 'absolute',
      opacity: '0!important',
    },
    [`.bc${formId}-ci:checked ~ [data-cl] [data-bx]`]: {
      background: `var(--bc${formId}-a-clr) !important`,
      'border-color': `var(--bc${formId}-a-clr)`,
      color: 'white',
    },
    [`.bc${formId}-ci:checked ~ label`]: {
      'border-width': '1.5px',
      'background-color': `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.5)`,
    },
    [`.bc${formId}-ci:hover ~ [data-cl] [data-bx]`]: {
      'border-color': `var(--bc${formId}-a-clr)`,
    },
    [`.bc${formId}-ci:checked ~ [data-oinp-wrp]`]: { display: 'block !important' },
    [`.bc${formId}-ci:focus ~ [data-cl] [data-bx]`]: {
      'box-shadow': `0 0 0 3px hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-accent-l), 0.3)`,
    },
    [`.bc${formId}-ci:focus ~ label`]: {
      'background-color': `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.3) !important`,
      'box-shadow': `0 0 0 3px hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-accent-l), 0.3)`,
    },
    [`.bc${formId}-ci:focus-visible ~ [data-cl] [data-bx]`]: {
      outline: `2px solid var(--bc${formId}-a-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`.bc${formId}-ci:active:focus-visible ~ [data-cl] [data-bx]`]: {
      'outline-offset': 0,
    },
    [`.bc${formId}-ci:active ~ [data-cl] [data-bx]`]: { transform: 'scale(0.9)' },
    [`.bc${formId}-ci:disabled ~ [data-cl]`]: {
      opacity: 0.6,
      'pointer-events': 'none',
      cursor: 'not-allowed',
    },
    [`.bc${formId}-opt-key-lbl`]: {
      width: '0',
      visibility: 'hidden',
      background: '#fff',
      border: '1px solid',
      'border-right': 'none',
      display: 'none',
      height: '22px',
      'line-height': '20px',
      padding: '0 5px',
      position: 'absolute',
      right: '100%',
      'vertical-align': 'middle',
    },
    [`.bc${formId}-cl:hover .bc${formId}-opt-key-lbl, .bc${formId}-ci:focus-visible .bc${formId}-opt-key-lbl`]: {
      width: 'auto',
      visibility: 'visible',
    },
    [`.bc${formId}-opt-key`]: {

    },
    [`.bc${formId}-bx`]: {
      position: 'relative',
      height: '25px',
      width: '25px',
      'border-style': 'solid',
      color: `var(--bc${formId}-fld-clr)`,
      'border-color': `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-s), var(--bc${formId}-fld-c-l), 0.7)`,
      'border-width': '1px',
      'border-radius': '4px',
      display: 'inline-flex',
      margin: '0 10px 0 0',
      transition: 'all 0.2s',
      'justify-content': 'center',
      'align-items': 'center',
    },
    [`.bc${formId}-other-inp-wrp`]: { display: 'none' },
    [`.bc${formId}-other-inp`]: {
      ...commonStyles[`.bc${formId}-fld`],
    },
    [`.bc${formId}-other-inp:focus`]: {
      ...commonStyles[`.bc${formId}-fld:focus`],
    },
    [`.bc${formId}-other-inp:hover`]: {
      ...commonStyles[`.bc${formId}-fld:hover`],
    },

    ...type === 'check' && {
      // [`.bc${formId}-ck`]: { 'border-radius': '5px' },
      [`.bc${formId}-svgwrp`]: {
        height: '12px',
        width: '10px',
        filter: 'drop-shadow(0px 1px 1px hsl(var(--gah), var(--gas), 45%))',
      },
      [`.bc${formId}-ck-icn`]: { 'stroke-dashoffset': '16px' },
      [`.bc${formId}-ck-svgline`]: {
        stroke: 'white',
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2px',
        'stroke-dasharray': '16px',
      },
      [`.bc${formId}-ci:checked ~ [data-cl] [data-ck-icn]`]: { 'stroke-dashoffset': 0 },
    },

    // [`.bc${formId}-bx::before`]: {
    //   content: '""',
    //   position: 'absolute',
    //   left: '50%',
    //   height: 0,
    //   width: 0,
    //   // for radio button (new style)
    //   // 'border-radius': '50%',
    //   transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.59, 1.82)',
    //   top: '50%',
    //   background: 'white',
    //   // 'box-shadow': '0 1px 3px 0px grey',
    //   transform: 'translate(-50%, -50%)',
    // },
    // [`.bc${formId}-ci:checked ~ [data-cl] [data-bx]::before`]: {
    //   width: '50%',
    //   height: '50%',
    //   background: `var(--bc${formId}-a-clr)`,
    //   color: `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), cal(var(--bc${formId}-a-l) +50), 1)`,
    // },
  }
}
