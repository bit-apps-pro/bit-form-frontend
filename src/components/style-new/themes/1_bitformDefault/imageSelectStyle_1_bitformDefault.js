/* eslint-disable object-curly-newline */
import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
export default function imageSelectStyle_1_bitformDefault({ fk, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses(fk),
      [`.${fk}-inp-fld-wrp`]: { position: 'relative', margin: 'var(--fld-m, 0)' },

      [`.${fk}-ic`]: {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(100px, 1fr))',
        'grid-gap': '1rem',
      },

      [`.${fk}-img-inp`]: {
        opacity: 0,
        position: 'absolute',
      },

      [`.${fk}-img-wrp`]: {

      },

      [`.${fk}-img-card-wrp`]: {
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

      [`.${fk}-select-img`]: {
        width: '100%',
        height: 'auto',
        'object-fit': 'fill',
        // transition: '0.3s all ease',
        'max-width': '100%',
        'border-radius': '6px',
      },

      [`.${fk}-tc`]: {
        padding: '10px',
      },

      [`.${fk}-img-title`]: {
        'font-size': '1em',
        'font-weight': 500,
        margin: '0.5rem 0',
        color: 'var(--global-font-color)',
      },

      [`.${fk}-check-box`]: {
        background: 'var(--global-accent-color)',
        'border-style': 'var(--global-fld-bdr) !important',
        'border-color': 'var(--global-fld-bdr-clr) !important',
        'border-width': 'var(--g-bdr-width) !important',
        position: 'absolute',
        top: '10px',
        left: '10px',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',

        /* tick position top center half element */
        /* top: -15px,
    left: 50%,
    transform: translateX(-50%), */

        /* tick position top right */
        /* right: 10px,
    top: 10px, */

        /* tick position bottom left */
        /* bottom: 10px,
    left: 10px, */

        /* tick position bottom right */
        /* bottom: 10px,
    right: 10px, */

        /* tick position center */
        /* top: 50%,
    left: 50%,
    transform: translate(-50%, -50%), */

        /* tick position top center */
        /* top: 10px,
    left: 50%,
    transform: translateX(-50%), */

        /* tick position bottom center */
        /* bottom: 10px,
    left: 50%,
    transform: translateX(-50%), */
        'z-index': 1,
        width: '30px',
        height: '30px',
        'border-radius': '50%',
        opacity: '0%',
        'box-shadow': '0 2px 5px rgba(0, 0, 0, 0.5)',
        transition: 'opacity calc(0.15s * 1.2) linear',
      },

      [`.${fk}-img-inp:hover~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
        outline: '3px solid hsla(var(--gah, 217), var(--gas, 100%), var(--gal, 50%), 50%)',
        // 'box-shadow': '0 0 0 2px var(--global-accent-color)',
        // transition: 'all 0.2s',
        'border-color': 'var(--global-accent-color)',
      },

      [`.${fk}-img-inp:disabled ~ .${fk}-img-wrp `]: {
        opacity: 0.6,
        'pointer-events': 'none',
        cursor: 'not-allowed',
      },

      [`.${fk}-check-img`]: {
        width: '13px',
        height: '13px',
        // transition: '0.15s ease',
        filter: 'sepia(0%) saturate(7500%) hue-rotate(343deg) brightness(112%) contrast(101%)',
      },

      [`.${fk}-img-inp:checked~.${fk}-img-wrp .${fk}-check-box`]: {
        opacity: '100%',
      },

      [`.${fk}-img-inp:checked~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
        'box-shadow': '0 0 0 3px var(--global-accent-color)',
        'border-color': 'var(--global-accent-color)',
      },

      [`.${fk}-img-inp:focus-visible~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
        // outline: 'none',
        'box-shadow': '0 0 0 2px hsla(var(--gah, 217), var(--gas, 100%), var(--gal, 50%), var(--gaa, 100%))',
        outline: '2px solid var(--global-accent-color)',
        'outline-offset': '2px',
        transition: 'outline-offset 0.2s ease',
      },

      // [`.${fk}-img-inp:checked:focus~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
      //   outline: 'none',
      //   'box-shadow': '0 5px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px hsla(223, 92%, 85%, 100%)',
      // },

      [`.${fk}-inp-opt`]: {
        position: 'relative',
      },

    }
  }
  return {}
}
