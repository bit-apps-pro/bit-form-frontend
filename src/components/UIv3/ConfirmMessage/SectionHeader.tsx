import { useFela } from 'react-fela'
import ui from './Message.styles'

interface SectionHeaderProps {
  title: string
  sub?: string
}

export default function SectionHeader({ title, sub }: SectionHeaderProps) {
  const { css } = useFela()
  return (
    <div className={css(ui.sectionHead)}>
      <span className={css(ui.sectionTitle)}>{title}</span>
      {sub && <span className={css(ui.sectionSub)}>{sub}</span>}
    </div>
  )
}
