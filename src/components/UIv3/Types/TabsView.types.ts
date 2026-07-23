import { ReactNode } from 'react'

export interface Tab {
  id: string
  label: string | ReactNode
  content: ReactNode
  visible?: boolean
}

export interface TabsViewProps {
  tabs: Tab[]
  defaultTab?: string
  variant?: 'default' | 'primary' | 'tertiary' | 'primary-outline' | 'primary-fullwidth' | 'tertiary-clean-fullwidth' | 'primary-clean-fullwidth' | 'clean-bottom-line' | 'rounded-bottom-tertiary' | 'tertiary-segment' | 'light-segment'
  onChange?: (tabId: string) => void
  classNames?: string
  fixedHeader?: boolean
  fixedHeaderTop?: number | string
  showHeaderShadow?: boolean
}