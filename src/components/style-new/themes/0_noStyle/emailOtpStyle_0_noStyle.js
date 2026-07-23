import inputWrapperClasses_0_noStyle from '../common/inputWrapperClasses_0_noStyle'

/* eslint-disable camelcase */
export default function emailOtpStyle_0_noStyle({ fk, breakpoint, colorScheme }) {
  if (breakpoint !== 'lg' || colorScheme !== 'light') return {}
  return {
    ...inputWrapperClasses_0_noStyle(fk),

    [`.${fk}-inp-fld-wrp`]: {
      position: 'relative',
      margin: 'var(--fld-m, 0)',
      display: 'flex',
      'flex-direction': 'column',
      gap: '10px',
    },

    [`.${fk}-otp-boxes-wrp`]: {
      display: 'flex',
      gap: '8px',
      'align-items': 'center',
    },

    [`.${fk}-otp-box`]: {
      'font-family': 'inherit',
      'text-align': 'center',
      width: '44px',
      height: '48px',
    },

    [`.${fk}-otp-actions-wrp`]: {
      display: 'flex',
      'flex-wrap': 'wrap',
      gap: '8px',
      'align-items': 'center',
    },

    [`.${fk}-send-otp-btn`]: {
      'font-family': 'inherit',
      display: 'inline-flex',
      'align-items': 'center',
      cursor: 'pointer',
    },
    [`.${fk}-send-otp-btn:active`]: { transform: 'scale(0.95)' },
    [`.${fk}-send-otp-btn:disabled`]: { cursor: 'not-allowed', opacity: '0.65' },

    [`.${fk}-resend-wrp`]: {
      display: 'flex',
      'align-items': 'center',
      gap: '8px',
    },

    [`.${fk}-verify-btn`]: {
      'font-family': 'inherit',
      display: 'inline-flex',
      'align-items': 'center',
      cursor: 'pointer',
    },
    [`.${fk}-verify-btn:active`]: { transform: 'scale(0.95)' },
    [`.${fk}-verify-btn:disabled`]: { cursor: 'not-allowed', opacity: '0.65' },
  }
}
