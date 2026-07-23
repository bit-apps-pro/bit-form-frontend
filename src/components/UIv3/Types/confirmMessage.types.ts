export interface BoxShadow {
  x: string
  y: string
  blur: string
  spread: string
  color: string
  inset: '' | 'inset'
}

export interface ConfirmationStyles {
  width?: string
  padding?: string
  background?: string
  color?: string
  borderWidth?: string
  borderType?: string
  borderColor?: string
  borderRadius?: string
  boxShadow?: BoxShadow[]
  closeBackground?: string
  closeHover?: string
  closeIconColor?: string
  closeIconHover?: string
}

export type MsgType = 'below' | 'snackbar' | 'modal'

export type AfterSubmitAction = 'hide' | 'reset' | 'keep'

export interface MsgConfig {
  msgType?: MsgType
  position?: string
  animation?: string
  autoHide?: boolean
  duration?: number | string
  status?: 0 | 1
  afterSubmit?: AfterSubmitAction
  styles?: ConfirmationStyles
}

export interface MsgItem {
  id?: number | string
  clRef?: string
  title?: string
  msg?: string
  config?: MsgConfig
}

export type StyleTab = 'background' | 'border' | 'shadow' | 'width' | 'padding'
