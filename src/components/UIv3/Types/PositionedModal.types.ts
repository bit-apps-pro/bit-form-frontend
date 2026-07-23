
export interface Position {
  top: number
  left: number
  maxHeight?: number
}

export interface PositionedModalProps {
  show: boolean
  setModal: (show: boolean) => void
  triggerRef?: React.RefObject<HTMLElement>
  children: React.ReactNode
  title?: string | React.ReactNode
  subTitle?: string
  onCloseMdl?: () => void
  showCloseBtn?: boolean
  escKeyEvent?: boolean
  closeOnOutsideClick?: boolean
  className?: string
  style?: React.CSSProperties
  showModalBackdrop?: boolean
  width?: string | number
  maxWidth?: string | number
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'auto'
  referenceWindow?: Window
}