import { useFela } from 'react-fela'
import { ReactNode, MouseEventHandler } from 'react'

interface BtnProps {
  children: ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'warning' | 'secondary' | 'success' | 'danger' | 'primary-outline' | 'secondary-outline' | 'success-outline' | 'danger-outline'
  width?: string
  gap?: string
  shadow?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  dataTestId?: string
  rounded?: boolean
  animated?: boolean
  id?: string
  title?: string
}

export default function Btn({
  children,
  className = '',
  size = 'md',
  variant = 'primary',
  width = 'auto',
  gap,
  shadow,
  disabled,
  onClick,
  dataTestId,
  rounded,
  animated,
  id,
  title,
}: BtnProps) {
  const { css } = useFela()
  return (
    <button
      id={id}
      data-testid={dataTestId}
      style={{ width, gap }}
      type="button"
      disabled={disabled}
      className={`${css([
        btnStyle.btn,
        btnStyle[size],
        btnStyle[variant],
        shadow && btnStyle.shadow,
        rounded && btnStyle.rounded,
        disabled && btnStyle.disabled,
        animated && btnStyle.animated,
      ])} ${className}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

const btnStyle: Record<string, any> = {
  btn: {
    fw: 500,
    b: 'none',
    brs: 8,
    bd: 'transparent',
    cur: 'pointer',
    oe: 'none',
    flx: 'center',
    tn: '0.2s all ease',
    ':active': { tm: 'scale(0.97)' },
    ':focus-visible': {
      oe: '3px solid var(--blue)',
      'outline-offset': '2px',
    },
    ':active:focus-visible': {
      'outline-offset': '0',
    },
    '@media (max-width: 992px)': {
      fs: '16px !important',
    },
    '@media (max-width: 768px)': {
      fs: '14px !important',
    },
    '@media (max-width: 576px)': {
      fs: '12px !important',
    },
  },
  xs: {
    p: '5px 10px',
    fs: 10,
  },
  sm: {
    p: '7px 13px',
    fs: 12,
  },
  md: {
    p: '10px 20px',
    fs: 16,
  },
  lg: {
    p: '15px 40px',
    fs: 20,
  },
  default: {
    bd: 'hsl(0, 0%, 93%)',
    cr: 'hsl(0, 0%, 30%)',
    ':hover': { bd: 'hsl(0, 0%, 90%)' },
  },
  primary: {
    bd: 'hsl(211, 100%, 50%)',
    cr: 'hsl(0, 0%, 100%)',
    ':hover': { bd: 'hsl(211, 100%, 40%)' },
    ':active': { bd: 'hsl(211, 100%, 30%)' },
  },
  warning: {
    bd: 'hsl(42, 100%, 50%)',
    cr: 'hsl(0, 0%, 100%)',
    ':hover': { bd: 'hsl(42, 80%, 40%)' },
    ':active': { bd: 'hsl(42, 100%, 60%)' },
  },
  secondary: {
    cr: 'hsl(0, 0%, 100%)',
    bd: 'hsl(208, 7%, 46%)',
    ':hover': { bd: 'hsla(207, 7%, 51%, 0.851)' },
  },
  success: {
    bd: 'hsla(160, 100%, 49%, 100%)',
    cr: 'hsla(215, 63%, 18%, 67%)',
    ':hover': { bd: 'hsla(160, 100%, 49%, 0.644)' },
  },
  danger: {
    bd: 'hsl(0, 100%, 64%)',
    cr: 'hsl(0, 0%, 100%)',
    ':hover': { bd: 'hsl(0, 100%, 54%)' },
    ':active': { bd: 'hsl(0, 100%, 44%)' },
    ':focus-visible': { 'outline-color': 'hsl(0, 100%, 64%)' },
  },
  'primary-outline': {
    cr: 'hsl(211, 100%, 50%)',
    bc: '#fff',
    b: '1px solid hsl(211, 100%, 50%)',
    ':hover': {
      bd: 'hsl(211, 100%, 50%)',
      cr: 'hsl(0, 0%, 100%)',
    },
  },
  'secondary-outline': {
    cr: 'hsl(208, 7%, 46%)',
    bc: '#fff',
    b: '1px solid hsl(208, 7%, 46%)',
    ':hover': {
      cr: 'hsl(0, 0%, 100%)',
      bc: 'hsl(208, 7%, 46%)',
    },
  },
  'success-outline': {
    cr: 'hsla(160, 100%, 49%, 100%)',
    // bc: 'transparent',
    bc: '#fff',
    b: '1px solid hsla(160, 100%, 49%, 100%)',
    ':hover': {
      bd: 'hsla(160, 100%, 49%, 100%)',
      cr: 'hsla(215, 63%, 18%, 67%)',
    },
  },
  'danger-outline': {
    cr: 'hsl(0, 100%, 50%)',
    bc: '#fff',
    b: '1px solid hsl(0, 100%, 50%)',
    ':hover': {
      bd: 'hsl(0, 100%, 50%)',
      cr: 'hsl(0, 0%, 100%)',
    },
    ':focus-visible': { bs: '0 0 0 0.2rem hsla(0, 100%, 50%, 0.548)' },
  },
  disabled: {
    bcr: 'transparent',
    cr: 'hsla(240, 0%, 50%, 100%)!important',
    bd: 'hsla(0, 0%, 76%, 43%)',
    cur: 'not-allowed',
    ':hover': { bd: 'hsla(240, 1%, 50%, 49%)' },
  },
  shadow: { bs: '0 2px 4px -2px hsla(0, 0%, 0%, 40%)' },
  rounded: { brs: 50 },
  animated: { an: 'heartbeat 1.3s infinite' },
}
