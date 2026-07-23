import { useAtomValue } from 'jotai'
import { memo, useState } from 'react'
import type { ComponentType } from 'react'
import { useFela } from 'react-fela'
import { $fieldsArr } from '../../../GlobalStates/GlobalStates'
import app from '../../../styles/app.style'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmMsgPreviewRaw from '../../ConfirmMessage/ConfirmMsgPreview'
import TinyMCERaw from '../../Utilities/TinyMCE'
import InlineConditionalLogic from '../CompSettings/Workflows/InlineConditionalLogic'
import type { MsgItem } from '../Types/confirmMessage.types'
import ui from './Message.styles'
import MessageBehaviorSection from './MessageBehaviorSection'
import MessageDisplaySection from './MessageDisplaySection'
import MessageStyleModal from './MessageStyleModal'
import SectionHeader from './SectionHeader'
import useMessageConfig from './useMessageConfig'

// untyped JS components — loosen props until they are migrated to TS
const ConfirmMsgPreview = ConfirmMsgPreviewRaw as ComponentType<any>
const TinyMCE = TinyMCERaw as ComponentType<any>

interface MessageProps {
  id: number
  msgItem: MsgItem
}

function Message({ id, msgItem }: MessageProps) {
  const { css } = useFela()
  const fieldsArr = useAtomValue($fieldsArr)
  const [previewActive, setPreviewActive] = useState(false)
  const [styleModal, setStyleModal] = useState({ show: false })
  const { updateMsg } = useMessageConfig(id)

  const { msgType, position, animation, autoHide, duration, styles } = msgItem?.config || {}
  const TEMP_CONF_ID = `_tmp_${id}_conf_id`

  return (
    <>
      <div className={css(ui.panel)}>
        {/* MESSAGE CONTENT */}
        <section className={css(ui.section)}>
          <SectionHeader
            title={__('Message Content')}
            sub={__('What the user sees after submitting')}
          />
          <TinyMCE
            id={`conf-${id}`}
            formFields={fieldsArr}
            value={msgItem?.msg}
            onChangeHandler={updateMsg}
          />
        </section>

        {/* DISPLAY */}
        <section className={css(ui.section)}>
          <SectionHeader
            title={__('Display')}
            sub={__('How and where the message appears')}
          />
          <MessageDisplaySection
            id={id}
            config={msgItem?.config}
            onEditStyle={() => setStyleModal({ show: true })}
          />
        </section>

        {/* BEHAVIOR */}
        <section className={css(ui.section)}>
          <SectionHeader title={__('Behavior')} />
          <MessageBehaviorSection id={id} config={msgItem?.config} />
        </section>

        {/* SHOW CONDITIONS */}
        {(msgItem.id || msgItem.clRef) && (
          <section className={css(ui.section)}>
            <SectionHeader
              title={__('Configure Conditions')}
              sub={__('Configure when this message will or won\'t show')}
            />
            <InlineConditionalLogic
              action="confirmation"
              targetId={msgItem.id || msgItem.clRef || ''}
              title={`Confirmation Logic - ${msgItem.title || msgItem.id || ''}`}
              effectLabels={{ show: __('Show'), hide: __('Don\'t Show') }}
            />
          </section>
        )}

        {/* FOOTER */}
        <div className={css(ui.footer)}>
          <button
            type="button"
            className={css(app.btn, app.blueGrd, { mt: 0 })}
            onClick={() => setPreviewActive(prev => !prev)}
          >
            {__('Preview')}
          </button>
        </div>
      </div>

      <MessageStyleModal
        id={id}
        msgItem={msgItem}
        show={styleModal.show}
        setModal={setStyleModal}
      />

      <ConfirmMsgPreview
        msgId={msgItem.id || TEMP_CONF_ID}
        active={previewActive}
        setActive={setPreviewActive}
        msgType={msgType || 'snackbar'}
        position={position || 'top-center'}
        animation={animation || 'fade'}
        autoHide={autoHide || false}
        duration={duration || 1}
        message={msgItem?.msg}
        confirmationStyles={styles || ''}
      />
    </>
  )
}

export default memo(Message)
