import { useFela } from 'react-fela'

// Thin presentational card for settings sections: bordered, rounded, white panel with a
// header row (title + optional subtitle on the left, optional `right` slot on the right)
// followed by the children body. No state, no logic.
function SettingCard({
  title, subtitle, right, className = '', children,
}) {
  const { css } = useFela()
  return (
    <section className={`${css(style.card)} ${className}`}>
      {(title || right) && (
        <div className={css(style.head)}>
          <div>
            {title && <div className={css(style.title)}>{title}</div>}
            {subtitle && <div className={css(style.subtitle)}>{subtitle}</div>}
          </div>
          {right && <div className={css(style.right)}>{right}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

export default SettingCard

const style = {
  card: {
    b: '1px solid var(--bf-secondary-100)',
    brs: 'var(--bf-bdr-radius-md, 8px)',
    bd: 'rgb(253 253 253)',
    p: 16,
    mb: 16,
  },
  head: {
    flx: 'center-between',
    mb: 12,
  },
  title: {
    fw: 700,
    fs: 15,
    cr: 'var(--bf-text-clr-dark, #1f2937)',
  },
  subtitle: {
    fs: 12,
    cr: 'var(--bf-text-clr-secondary, #6b7280)',
    mt: 2,
  },
  right: {
    flx: 'align-center',
    gap: 8,
  },
}
