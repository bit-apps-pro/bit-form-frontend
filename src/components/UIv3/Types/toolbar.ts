import { ReactNode } from 'react'

export interface ToolItem {
  name: string
  keywords: string
  icn: ReactNode
  pos: { h: number; w: number; i: string; minW?: number; x?: number }
  new?: boolean
  pro?: string
  elm: any
  tip?: string
  category?: 'basic' | 'advanced' | 'payment' | 'others'
}

export interface ToolCategory {
  id: 'basic' | 'advanced' | 'payment' | 'others'
  title: string
  tools: ToolItem[]
}

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