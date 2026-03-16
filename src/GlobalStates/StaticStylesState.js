/* eslint-disable import/prefer-default-export */
import { atomWithReset } from 'jotai/utils'

export const $staticStylesState = atomWithReset({
  styleMergeWithAtomicClasses: {
    lgLightStyles: { form: {} },
    mdLightStyles: { form: {} },
    smLightStyles: { form: {} },
  },
  staticStyles: {
    '.bit-form .d-none': { display: 'none !important' },
    '.bit-form .v-hide': { visibility: 'hidden !important' },
    '.bf-form-msg': {
      background: '#ffe8c3',
      'border-radius': '6px',
      margin: '6px 0px',
      padding: '5px 14px',
      color: '#776f63',
      height: '0',
      opacity: '0',
      overflow: 'hidden',
      transition: 'all 0.5s ease-out',
    },
    '.bf-form-msg.success': {
      background: '#c5f7dd',
    },
    '.bf-form-msg.error': {
      background: '#ffd0cb',
    },
    '.bf-form-msg.warning': {
      background: '#ffe8c3',
    },
    '.bf-form-msg.active': {
      height: 'auto',
      opacity: '1',
      transition: 'all 1s ease-out',
    },
    '.btcd-fld-itm': {
      transition: 'all 0.2s ease',
    },
    '.fld-hide': {
      'min-height': '0px !important',
      height: '0px !important',
      overflow: 'hidden !important',
    },
    '@keyframes bf-rotation': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
    '.bf-spinner': {
      'margin-left': '5px',
      width: '15px',
      height: '15px',
      'border-radius': '50%',
      // display: 'inline-block',
      'border-top': '2px solid',
      'border-right': '2px solid transparent',
      animation: 'bf-rotation 1s linear infinite',
    },
  },
})
