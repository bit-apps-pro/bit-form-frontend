import { useState } from 'react'
import type { ComponentType } from 'react'
import { useFela } from 'react-fela'
import { __ } from '../../../Utils/i18nwrap'
import RenderHtmlRaw from '../../Utilities/RenderHtml'
import SliderModalRaw from '../../Utilities/SliderModal'
import type { MsgItem, StyleTab } from '../Types/confirmMessage.types'
import ui, { buildPreviewStyles } from './Message.styles'
import {
  BackgroundPanel,
  BorderPanel,
  PaddingPanel,
  ShadowPanel,
  WidthPanel,
} from './MessageStylePanels'
import useMessageConfig from './useMessageConfig'

// untyped JS components — loosen props until they are migrated to TS
const RenderHtml = RenderHtmlRaw as ComponentType<any>
const SliderModal = SliderModalRaw as ComponentType<any>

interface MessageStyleModalProps {
  id: number
  msgItem: MsgItem
  show: boolean
  setModal: (modal: { show: boolean }) => void
}

const STYLE_TABS: Array<{ key: StyleTab; label: string }> = [
  { key: 'background', label: __('Background') },
  { key: 'border', label: __('Border') },
  { key: 'shadow', label: __('Shadow') },
  { key: 'width', label: __('Width') },
  { key: 'padding', label: __('Padding') },
]

export default function MessageStyleModal({ id, msgItem, show, setModal }: MessageStyleModalProps) {
  const { css } = useFela()
  const [activeTab, setActiveTab] = useState<StyleTab>('background')
  const { updateStyle, updateShadow, addShadow, deleteShadow } = useMessageConfig(id)

  const { msgType, styles } = msgItem?.config || {}
  const previewStyles = buildPreviewStyles(styles, msgType)

  return (
    <SliderModal
      title={__('Confirmation Style')}
      show={show}
      setModal={setModal}
      className={css({ h: '500px !important', w: '550px !important' })}
    >
      <div className={`layout-wrapper confirmation-style ${css({ w: '100%' })}`}>
        <div className={`style-preview ${css({ h: '250px', p: '40px 20px', ow: 'auto', bd: '#E8E8E8' })}`}>
          <div className={css(previewStyles.msgContainer)}>
            <div className={css(previewStyles.msgBackground)}>
              <div className={css(previewStyles.msgContent)}>
                <button className={css(previewStyles.close)} type="button">
                  <svg className={css(previewStyles.closeIcon)} viewBox="0 0 30 30">
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      x1="4"
                      y1="3.88"
                      x2="26"
                      y2="26.12"
                    />
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      x1="26"
                      y1="3.88"
                      x2="4"
                      y2="26.12"
                    />
                  </svg>
                </button>
                <div><RenderHtml html={msgItem?.msg} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className={css({ h: '210px', bd: 'white', bt: '1px solid #abaaaa' })}>
          <div className={css({ p: '10px 20px' })}>
            {STYLE_TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                name={tab.key}
                className={`${css(ui.styleButton)} ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={`properties-container ${css({ pn: 'relative' })}`}>
            {activeTab === 'background' && (
              <BackgroundPanel styles={styles} onStyleChange={updateStyle} />
            )}
            {activeTab === 'border' && (
              <BorderPanel styles={styles} onStyleChange={updateStyle} />
            )}
            {activeTab === 'shadow' && (
              <ShadowPanel
                shadows={styles?.boxShadow}
                onShadowChange={updateShadow}
                onShadowAdd={addShadow}
                onShadowDelete={deleteShadow}
              />
            )}
            {activeTab === 'width' && (
              <WidthPanel styles={styles} onStyleChange={updateStyle} />
            )}
            {activeTab === 'padding' && (
              <PaddingPanel
                padding={styles?.padding}
                onPaddingChange={value => updateStyle('padding', value)}
              />
            )}
          </div>
        </div>
      </div>
    </SliderModal>
  )
}
