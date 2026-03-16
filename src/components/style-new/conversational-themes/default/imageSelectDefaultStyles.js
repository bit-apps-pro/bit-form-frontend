export default function imageSelectDefaultStyles(formId) {
  return {
    [`.bc${formId}-inp-fld-wrp`]: { position: 'relative', margin: '0px' },

    [`.bc${formId}-ic`]: {
      display: 'grid',
      'grid-template-columns': 'repeat(auto-fit, minmax(100px, 1fr))',
      'grid-gap': '1rem',
    },

    [`.bc${formId}-img-inp`]: {
      opacity: 0,
      position: 'absolute',
    },

    [`.bc${formId}-img-wrp`]: {

    },

    [`.bc${formId}-img-card-wrp`]: {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center',
      padding: '5px',
      'border-color': 'hsla(0, 0%, 87%, 100%)',
      'border-style': 'solid',
      'border-width': '1px',
      'border-radius': '11px',
      overflow: 'hidden',
      'box-shadow': '0 2px 6px -2px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer',
      transition: 'border 0.3s',
      background: 'inherit',
    },

    [`.bc${formId}-select-img`]: {
      width: '100%',
      height: '100px',
      'object-fit': 'fill',
      // transition: '0.3s all ease',
      'max-width': '100%',
      'border-radius': '6px',
    },

    [`.bc${formId}-tc`]: {
      padding: '10px',
    },

    [`.bc${formId}-img-title`]: {
      'font-size': '1em',
      'font-weight': 500,
      margin: '0.5rem 0',
      color: `var(--bc${formId}-fld-clr)`,
    },

    [`.bc${formId}-check-box`]: {
      background: `var(--bc${formId}-a-clr)`,
      'border-style': 'var(--global-fld-bdr) !important',
      'border-color': 'var(--global-fld-bdr-clr) !important',
      'border-width': 'var(--g-bdr-width) !important',
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'z-index': 1,
      width: '30px',
      height: '30px',
      'border-radius': '50%',
      opacity: '0%',
      'box-shadow': '0 2px 5px rgba(0, 0, 0, 0.5)',
      transition: 'opacity calc(0.15s * 1.2) linear',
    },

    [`.bc${formId}-img-inp:hover~.bc${formId}-img-wrp .bc${formId}-img-card-wrp`]: {
      outline: '3px solid hsla(223, 92%, 85%, 100%)',
      'border-color': `var(--bc${formId}-a-clr)`,
    },

    [`.bc${formId}-img-inp:disabled ~ .bc${formId}-img-wrp `]: {
      opacity: 0.6,
      'pointer-events': 'none',
      cursor: 'not-allowed',
    },

    [`.bc${formId}-check-img`]: {
      width: '13px',
      height: '13px',
      // transition: '0.15s ease',
      filter: 'sepia(0%) saturate(7500%) hue-rotate(343deg) brightness(112%) contrast(101%)',
    },

    [`.bc${formId}-img-inp:checked~.bc${formId}-img-wrp .bc${formId}-check-box`]: {
      opacity: '100%',
    },

    [`.bc${formId}-img-inp:checked~.bc${formId}-img-wrp .bc${formId}-img-card-wrp`]: {
      'box-shadow': `0 0 0 3px var(--bc${formId}-a-clr)`,
      'border-color': `var(--bc${formId}-a-clr)`,
    },

    [`.bc${formId}-img-inp:focus-visible~.bc${formId}-img-wrp .bc${formId}-img-card-wrp`]: {
      // outline: 'none',
      'box-shadow': '0 0 0 2px hsla(209, 100%, 50%, 100%)',
      outline: `2px solid var(--bc${formId}-a-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },

    [`.bc${formId}-inp-opt`]: {
      position: 'relative',
    },

  }
}
