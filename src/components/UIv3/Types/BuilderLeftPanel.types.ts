// Type definitions
export interface StyleDispatchAction {
  type: string
  payload?: any
}

export interface BuilderLeftPanelProps {
  style: Record<string, any>
  styleDispatch: (action: StyleDispatchAction) => void
  addNewData: (newData: Record<string, any>) => void
  isCollapsed: boolean
  onToggle: () => void
}

export interface ScrollEvent {
  target: {
    scrollTop: number
  }
}