import { useFela } from 'react-fela'

export default function ColorPreview({ w = 30, h = 30, bg, className }) {
  const { css } = useFela()
  return (
    <div className={`${css(s.wrp)} ${className}`} style={{ height: h, width: w }}>
      <div className={css(s.preview)} style={{ background: bg?.replace('!important', '') }} />
    </div>
  )
}
const s = {
  wrp: {
    dy: 'inline-block',
    ow: 'hidden',
    brs: 'var(--bf-bdr-radius-sm)',
    bs: '0 0 0 1px #dadada',
    bc: '#fff',
    bi: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2N89erVfwY0ICYmxoguxjgUFKI7GsTH5m4M3w1ChQC1/Ca8i2n1WgAAAABJRU5ErkJggg==)',
  },
  preview: { se: '100%', 'background-size': 'cover !important' },
}
