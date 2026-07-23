import type { ComponentType } from 'react'
import { useFela } from 'react-fela'
import { __ } from '../../../Utils/i18nwrap'
import SingleToggleRaw from '../../Utilities/SingleToggle'
import type { AfterSubmitAction, MsgConfig } from '../Types/confirmMessage.types'
import ui from './Message.styles'
import useMessageConfig from './useMessageConfig'

// untyped JS component — loosen props until it is migrated to TS
const SingleToggle = SingleToggleRaw as ComponentType<any>

interface MessageBehaviorSectionProps {
  id: number
  config?: MsgConfig
}

export default function MessageBehaviorSection({ id, config }: MessageBehaviorSectionProps) {
  const { css } = useFela()
  const { updateConfig, toggleAutoHide } = useMessageConfig(id)
  const { autoHide, duration, afterSubmit } = config || {}

  const handleDuration = (value: string) => {
    updateConfig('duration', Number(value) > 0 ? value : 1)
  }

  return (
    <>
      <div className={css(ui.fieldRow)}>
        <span className={css(ui.fieldLabel)}>{__('Auto-hide')}</span>
        <div className={css(ui.fieldControl)}>
          <SingleToggle
            name={`auto-hide-check-${id}`}
            action={toggleAutoHide}
            isChecked={!!autoHide}
            className="flx"
          />
          {autoHide && (
            <>
              <span className={css(ui.inlineHint)}>{__('Hide after')}</span>
              <input
                placeholder="Duration"
                className={css(ui.input, { w: 70 })}
                type="number"
                value={duration}
                onChange={e => handleDuration(e.target.value)}
                aria-label={__('Confirmation auto hide after duration')}
              />
              <span className={css(ui.inlineHint)}>{__('seconds')}</span>
            </>
          )}
        </div>
      </div>

      <div className={css(ui.fieldRow)}>
        <span className={css(ui.fieldLabel)}>{__('After submit')}</span>
        <select
          className={css(ui.selectInput, { flexGrow: 1 })}
          value={afterSubmit || 'reset'}
          onChange={e => updateConfig('afterSubmit', e.target.value as AfterSubmitAction)}
          aria-label={__('Form behaviour after submission')}
        >
          <option value="hide">{__('Hide Form')}</option>
          <option value="reset">{__('Reset Form')}</option>
          <option value="keep">{__('Keep Form Values')}</option>
        </select>
      </div>
    </>
  )
}
