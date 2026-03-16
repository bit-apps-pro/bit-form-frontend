/* eslint-disable object-curly-newline */
import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

/* eslint-disable camelcase */
export default function imageSelectStyle_0_noStyle({ fk, type, direction, breakpoint, colorScheme }) {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      ...inputWrapperClasses_0_noStyle(fk),

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
        // position: 'absolute',
        // 'border-color': 'hsla(0, 0%, 87%, 100%)',
        // 'border-style': 'solid',
        // 'border-width': '1px',
        // 'border-radius': '5px',
        // overflow: 'hidden',
        // 'box-shadow': '0 0 10px rgba(0, 0, 0, 0.2)',
        // cursor: 'pointer',
        // transition: '0.2s',
      },

      [`.${fk}-img-card-wrp`]: {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        // padding: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
      },

      [`.${fk}-select-img`]: {
        width: '100%',
        height: 'auto',
        'object-fit': 'cover',
        // transition: '0.3s',
        'max-width': '100%',
      },

      [`.${fk}-tc`]: {
        padding: '10px',
      },

      [`.${fk}-img-title`]: {
        // 'font-size': '1.5rem',
        // 'font-weight': 500,
        // margin: '0.5rem 0',
        // color: 'var(--global-font-color)',
      },

      [`.${fk}-check-box`]: {
        // background: 'var(--global-accent-color)',

        // 'border-style': 'var(--global-fld-bdr) !important',
        // 'border-color': 'var(--global-fld-bdr-clr) !important',
        // 'border-width': 'var(--g-bdr-width) !important',
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
        // transition: 'transform 0.15s, opacity calc(0.15s * 1.2) linear',
      },

      [`.${fk}-img-inp:hover~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
        // outline: 'none',
        // 'box-shadow': '0 0 0 2px hsla(209, 100%, 50%, 100%)',
        // transition: 'all 0.2s',
        // 'border-color': 'var(--global-accent-color)',
      },

      [`.${fk}-check-img`]: {
        // width: '15px',
        // height: '15px',
        // transition: '0.15s ease',
        filter: 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(343deg) brightness(112%) contrast(101%)',
      },

      [`.${fk}-img-inp:checked~.${fk}-img-wrp .${fk}-check-box`]: {
        opacity: '100%',
      },

      [`.${fk}-img-inp:checked~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
        // 'box-shadow': '0 0 0 2px hsla(209, 100%, 50%, 51%)',
        'border-color': 'hsla(0, 0%, 0%, 100%)',
        'border-style': 'solid',
        'border-width': '1px',
      },

      [`.${fk}-img-inp:focus~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
        // outline: 'none',
        // 'box-shadow': '0 0 0 2px hsla(209, 100%, 50%, 100%)',
        // outline: '2px solid var(--global-accent-color)',
        // 'outline-offset': '2px',
        // transition: 'outline-offset 0.2s ease',
      },

      // [`.${fk}-img-inp:checked:focus~.${fk}-img-wrp .${fk}-img-card-wrp`]: {
      //   // outline: 'none',
      //   // 'box-shadow': '0 5px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px hsla(223, 92%, 85%, 100%)',
      // },

      [`.${fk}-inp-opt`]: {
        position: 'relative',
      },

    }
  }
  return {}
}
