import { useFela } from 'react-fela'

export default function Input({
  w, value, onChange, type, placeholder, name, disabled, className, onBlur,
}) {
  const { css } = useFela()

  const cls = {
    inp: {
      fs: 14,
      fw: 500,
      w: w || '100%',
      bd: 'var(--b-79-96) !important',
      oe: 'none !important',
      dy: 'block',
      lh: '2 !important',
      px: 8,
      py: 2,
      bs: 'none !important',
      brs: 'var(--bf-bdr-radius-sm) !important',
      tn: 'box-shadow .3s',
      b: '1px solid #e6e6e6 !important',
      '::placeholder': { cr: 'hsl(215deg 16% 67%)', fs: 12, fw: 400 },
      ':focus': { bs: '0 0 0 1px var(--b-50) !important', bcr: 'var(--b-50)!important' },
    },
  }

  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value, e)}
      type={type}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      onBlur={onBlur}
      className={`${css(cls.inp)} ${className}`}
    />
  )
}
