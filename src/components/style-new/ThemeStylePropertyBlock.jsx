import { useFela } from 'react-fela'
import ut from '../../styles/2.utilities'

export default function ThemeStylePropertyBlock({ label, className, children }) {
  const { css } = useFela()
  return (
    <div className={`${css(ut.flxcb, ut.mt2)} ${className}`}>
      <span className={css(ut.stylePropertyLabel)}>{label}</span>
      <div>{children}</div>
    </div>
  )
}
