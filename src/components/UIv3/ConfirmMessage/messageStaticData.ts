import type { BoxShadow, MsgType } from '../Types/confirmMessage.types'

// screen positions available per message type; for `modal` they depend on the selected animation
export const SCREEN_POSITIONS: {
  snackbar: string[]
  modal: Record<string, string[]>
} = {
  snackbar: [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ],
  modal: {
    'slide-up': ['center-center', 'bottom-center'],
    'slide-down': ['top-center', 'center-center'],
  },
}

export const ANIMATIONS: Record<MsgType, string[]> = {
  snackbar: ['fade', 'scale', 'slide-up', 'slide-down', 'slide-left', 'slide-right'],
  modal: ['fade', 'scale', 'slide-up', 'slide-down'],
  below: ['fade', 'scale'],
}

export const UNIT_OPTIONS = ['px', 'em', 'rem']

export const DEFAULT_BOX_SHADOW: BoxShadow = {
  x: '0px',
  y: '27px',
  blur: '30px',
  spread: '',
  color: 'rgb(0 0 0 / 18%)',
  inset: '',
}

// 'slide-up' -> 'Slide Up'
export const humanizeOption = (str: string): string => str
  .replace(/-/g, ' ')
  .replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())

export const getScreenPositions = (msgType?: string, animation?: string): string[] => {
  if (msgType === 'snackbar') return SCREEN_POSITIONS.snackbar
  if (msgType === 'modal') return SCREEN_POSITIONS.modal[animation || ''] || []
  return []
}
