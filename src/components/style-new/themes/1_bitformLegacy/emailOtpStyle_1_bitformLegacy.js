import inputWrapperClasses from '../common/inputWrapperClasses'

/* eslint-disable camelcase */
const buttonStyle = {
  'font-size': 'var(--btn-fs) !important',
  padding: 'var(--btn-p) !important',
  background: 'var(--btn-bg)',
  color: 'var(--btn-c)',
  'font-weight': 'var(--btn-fw)',
  'border-style': 'var(--btn-bdr)',
  'border-color': 'var(--btn-bdr-clr)',
  'border-width': 'var(--btn-bdr-width)',
  'border-radius': 'var(--btn-bdr-rad) !important',
  'box-shadow': 'var(--btn-sh)',
  cursor: 'pointer',
  'font-family': 'inherit',
  'font-style': 'var(--btn-f-style)',
  'line-height': '1',
  margin: '0',
  outline: 'none',
  display: 'inline-flex',
  'align-items': 'center',
  'justify-content': 'center',
  'white-space': 'nowrap',
  'flex-shrink': '0',
  transition: 'background-color 0.2s, transform 0.2s',
}

const buttonHoverStyle = {
  'background-color': 'hsl(var(--gah), var(--gas), calc(var(--gal) - 5%)) !important',
  color: 'var(--btn-c)',
}

const buttonActiveStyle = { transform: 'scale(0.95)' }

const buttonFocusStyle = {
  outline: '2px solid var(--global-accent-color)',
  'outline-offset': '2px',
  transition: 'outline-offset 0.2s ease',
}

const buttonDisabledStyle = {
  cursor: 'not-allowed',
  opacity: '0.65',
  'pointer-events': 'none',
}

export default function emailOtpStyle_1_bitformLegacy({ fk, breakpoint, colorScheme }) {
  if (breakpoint !== 'lg' || colorScheme !== 'light') return {}
  return {
    ...inputWrapperClasses(fk),

    [`.${fk}-inp-fld-wrp`]: {
      position: 'relative',
      margin: 'var(--fld-m, 0)',
      display: 'flex',
      'flex-direction': 'column',
      gap: '10px',
    },

    // ── OTP individual input boxes wrapper ──────────────────────────────────
    [`.${fk}-otp-boxes-wrp`]: {
      display: 'flex',
      gap: '8px',
      'align-items': 'center',
    },

    [`.${fk}-otp-box`]: {
      'font-size': 'var(--fld-fs, 18px)',
      'font-weight': '600',
      'text-align': 'center',
      width: '44px',
      height: '48px',
      padding: '4px',
      background: 'var(--global-fld-bg-color, white)',
      color: 'var(--global-fld-c, inherit)',
      'border-style': 'var(--global-fld-bdr, solid)',
      'border-color': 'var(--global-fld-bdr-clr)',
      'border-radius': 'var(--g-bdr-rad)',
      'border-width': 'var(--g-bdr-width)',
      outline: 'none',
      'font-family': 'inherit',
      transition: 'border-color 0.2s',
      'box-sizing': 'border-box',
    },
    [`.${fk}-otp-box:focus`]: {
      'border-color': 'var(--global-accent-color)',
      outline: '2px solid var(--global-accent-color)',
      'outline-offset': '0',
    },
    [`.${fk}-otp-box:disabled`]: {
      background: 'var(--global-fld-disabled-bg, #f3f4f6)',
      cursor: 'not-allowed',
    },

    // ── Actions row: Send OTP | Resend area | Verify OTP ───────────────────
    [`.${fk}-otp-actions-wrp`]: {
      display: 'flex',
      'flex-wrap': 'wrap',
      gap: '8px',
      'align-items': 'center',
    },

    // Send OTP button — auto width
    [`.${fk}-send-otp-btn`]: buttonStyle,
    [`.${fk}-send-otp-btn:hover`]: buttonHoverStyle,
    [`.${fk}-send-otp-btn:active`]: buttonActiveStyle,
    [`.${fk}-send-otp-btn:focus-visible`]: buttonFocusStyle,
    [`.${fk}-send-otp-btn:disabled`]: buttonDisabledStyle,

    // Resend wrapper — inline flex
    [`.${fk}-resend-wrp`]: {
      display: 'flex',
      'align-items': 'center',
      gap: '8px',
      'font-size': 'var(--fld-fs, 14px)',
    },

    [`.${fk}-wait-txt`]: {
      color: 'var(--global-fld-c, inherit)',
      'font-size': 'inherit',
    },

    [`.${fk}-countdown`]: {
      'font-weight': '600',
      color: 'var(--global-accent-color)',
    },

    // Verify button — auto width, pushed to the end
    [`.${fk}-verify-btn`]: buttonStyle,
    [`.${fk}-verify-btn:hover`]: buttonHoverStyle,
    [`.${fk}-verify-btn:active`]: buttonActiveStyle,
    [`.${fk}-verify-btn:focus-visible`]: buttonFocusStyle,
    [`.${fk}-verify-btn:disabled`]: buttonDisabledStyle,

    // Success message
    [`.${fk}-otp-success-msg`]: {
      color: '#15803d',
      'font-size': 'var(--fld-fs, 14px)',
      'font-weight': '500',
      padding: '6px 10px',
      'background-color': '#dcfce7',
      'border-radius': 'var(--g-bdr-rad)',
      border: '1px solid #86efac',
    },

    // Error / locked message
    [`.${fk}-otp-error-msg`]: {
      color: '#b91c1c',
      'font-size': 'var(--fld-fs, 14px)',
      'font-weight': '500',
      padding: '6px 10px',
      'background-color': '#fee2e2',
      'border-radius': 'var(--g-bdr-rad)',
      border: '1px solid #fca5a5',
    },
  }
}
