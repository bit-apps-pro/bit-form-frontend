export default function decisionBoxDefaultStyle(formId) {
  return {
    [`.bc${formId}-cks`]: {
      position: 'absolute',
      width: 0,
      height: 0,
      'pointer-events': 'none',
      'user-select': 'none',
    },
    // checkbox container
    [`.bc${formId}-cc`]: {
      display: 'flex',
      'flex-wrap': 'wrap',
    },
    // checkbox wrapper
    [`.bc${formId}-cw`]: {
      // margin: '0px 10px 0px 0px' // unused css
    },
    // checkbox label
    [`.bc${formId}-cl`]: {
      cursor: 'pointer',
      display: 'flex',
      'align-items': 'center',
      color: `var(--bc${formId}-fld-clr)`,
      padding: '3px',
    },
    [`.bc${formId}-ct`]: { 'line-height': 'initial' },
    // checkbox input
    [`.bc${formId}-ci`]: {
      position: 'absolute',
      opacity: '0 !important',
    },
    [`.bc${formId}-ci:checked ~ [data-cl] [data-bx]`]: {
      background: 'var(--global-accent-color)',
      'border-color': 'var(--global-accent-color)',
    },
    [`.bc${formId}-ci:focus ~ [data-cl] [data-bx]`]: { 'box-shadow': '0 0 0 3px hsla(var(--gah), var(--gas), var(--gal), 0.3)' },
    [`.bc${formId}-ci:focus-visible ~ [data-cl] [data-bx]`]: { 'box-shadow': '0 0 0 2px var(--global-fld-bg-color),0 0 0 4px var(--global-accent-color)' },
    [`.bc${formId}-ci:active ~ [data-cl] [data-bx]`]: { transform: 'scale(0.9)' },
    [`.bc${formId}-ci:disabled ~ [data-cl]`]: {
      opacity: 0.6,
      'pointer-events': 'none',
      cursor: 'not-allowed',
    },
    [`.bc${formId}-ci:hover ~ [data-cl] [data-bx]`]: {
      'border-color': 'var(--global-accent-color)',
    },
    [`.bc${formId}-bx`]: {
      position: 'relative',
      height: '18px',
      width: '18px',
      'border-color': 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.7)',
      'border-style': 'solid',
      'border-width': '2px',
      display: 'inline-flex',
      margin: '0 0 0 10px',
      transition: 'all 0.2s',
      'justify-content': 'center',
      'align-items': 'center',
      'border-radius': '5px',
    },
    [`.bc${formId}-svgwrp`]: {
      height: '12px',
      width: '10px',
      filter: 'drop-shadow(0px 1px 1px hsl(var(--gah), var(--gas), 13%))',
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
  }
}
