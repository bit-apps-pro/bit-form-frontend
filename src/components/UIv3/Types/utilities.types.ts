
export interface StyleSegmentControlProps {
  defaultActive?: string
  className?: string
  options: Array<{ label: string; icn?: ReactNode; tip?: string }>
  size?: number
  onChange?: (label: string) => void
  show?: string[]
  width?: string | number
  tipPlace?: 'top' | 'bottom' | 'left' | 'right'
  borderRadius?: number
  activeShow?: string[]
  noShadow?: boolean
  defaultItmWidth?: string | number
  wideTab?: boolean
  h?: string | number
  variant?: string
}
