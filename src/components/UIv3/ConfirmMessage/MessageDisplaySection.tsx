import type { ComponentType, ReactNode } from 'react'
import { useFela } from 'react-fela'
import BelowFormIcnRaw from '../../../Icons/BelowFormIcn'
import EditIcnRaw from '../../../Icons/EditIcn'
import ModalIcnRaw from '../../../Icons/ModalIcn'
import SnackbarIcnRaw from '../../../Icons/SnackbarIcn'
import { __ } from '../../../Utils/i18nwrap'
import type { MsgConfig, MsgType } from '../Types/confirmMessage.types'
import ui from './Message.styles'
import { ANIMATIONS, getScreenPositions, humanizeOption } from './messageStaticData'
import useMessageConfig from './useMessageConfig'

// untyped JS components — loosen props until they are migrated to TS
const BelowFormIcn = BelowFormIcnRaw as ComponentType<any>
const EditIcn = EditIcnRaw as ComponentType<any>
const ModalIcn = ModalIcnRaw as ComponentType<any>
const SnackbarIcn = SnackbarIcnRaw as ComponentType<any>

interface PositionCard {
  value: MsgType
  title: string
  sub: string
  icn: ReactNode
}

interface MessageDisplaySectionProps {
  id: number
  config?: MsgConfig
  onEditStyle: () => void
}

const positionCards: PositionCard[] = [
  { value: 'below', title: __('Below form'), sub: __('Inline, always visible'), icn: <BelowFormIcn size={22} /> },
  { value: 'snackbar', title: __('Snackbar'), sub: __('Brief toast pop-up'), icn: <SnackbarIcn size={22} /> },
  { value: 'modal', title: __('Modal'), sub: __('Overlay dialog'), icn: <ModalIcn size={22} /> },
]

export default function MessageDisplaySection({ id, config, onEditStyle }: MessageDisplaySectionProps) {
  const { css } = useFela()
  const { updateConfig } = useMessageConfig(id)
  const { msgType, position, animation } = config || {}

  const showScreenPosition = (msgType === 'snackbar' || ['slide-up', 'slide-down'].includes(animation || ''))
    && msgType !== 'below'

  return (
    <>
      <div className={css(ui.fieldRow)}>
        <span className={css(ui.fieldLabel)}>{__('Position')}</span>
        <div className={css(ui.cardGrid)}>
          {positionCards.map(card => (
            <button
              key={card.value}
              type="button"
              className={`${css(ui.card)} ${msgType === card.value ? css(ui.cardActive) : ''}`}
              onClick={() => updateConfig('msgType', card.value)}
            >
              <span className={css(ui.cardIcn)}>{card.icn}</span>
              <span className={css(ui.cardTitle)}>{card.title}</span>
              <span className={css(ui.cardSub)}>{card.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={css(ui.fieldRow)}>
        <span className={css(ui.fieldLabel)}>{__('Style')}</span>
        <div className={css(ui.fieldControl)}>
          <select
            className={css(ui.selectInput, { flexGrow: 1 })}
            name="style"
            value="custom-style"
            disabled
          >
            <option value="custom-style">{__('Custom Style')}</option>
          </select>
          <button
            type="button"
            className={css(ui.input, { curp: 1 })}
            title={__('Edit styles')}
            onClick={onEditStyle}
          >
            <span><EditIcn size={20} /></span>
          </button>
        </div>
      </div>

      <div className={css(ui.fieldRow)}>
        <span className={css(ui.fieldLabel)}>{__('Animation')}</span>
        <div className={css(ui.fieldControl)}>
          <select
            className={css(ui.selectInput, { flexGrow: 1 })}
            name="animation"
            value={animation}
            onChange={e => updateConfig('animation', e.target.value)}
          >
            <option>--Please Select--</option>
            {ANIMATIONS[msgType as MsgType]?.map(value => (
              <option key={value} value={value}>{humanizeOption(value)}</option>
            ))}
          </select>
        </div>
      </div>

      {showScreenPosition && (
        <div className={css(ui.fieldRow)}>
          <span className={css(ui.fieldLabel)}>{__('Position on Screen')}</span>
          <div className={css(ui.fieldControl)}>
            <select
              className={css(ui.selectInput, { flexGrow: 1 })}
              name="position"
              value={position}
              onChange={e => updateConfig('position', e.target.value)}
            >
              <option value="">--Please Select--</option>
              {getScreenPositions(msgType, animation).map(value => (
                <option key={value} value={value}>{humanizeOption(value)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  )
}
