import { useAtomValue } from 'jotai'
import { forwardRef, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { $bits, $formId, $updateBtn } from '../GlobalStates/GlobalStates'
import LaptopIcn from '../Icons/LaptopIcn'
import MobileIcon from '../Icons/MobileIcon'
import TabletIcon from '../Icons/TabletIcon'
import ut from '../styles/2.utilities'
import OptionToolBarStyle from '../styles/OptionToolbar.style'
import CoolCopy from './Utilities/CoolCopy'
import StyleSegmentControl from './Utilities/StyleSegmentControl'

const ConversationalPreview = forwardRef(({ conversationalSettings, standaloneSettings }, ref) => {
  const updateBtn = useAtomValue($updateBtn)
  const [breakpointView, setBreakpointView] = useState('lg')
  const bits = useAtomValue($bits)
  const formId = useAtomValue($formId)
  const [maxWidth, setMaxWidth] = useState('auto')
  const { css } = useFela()
  const [iframeRef, setIframeRef] = useState(null)

  const handleIframeReload = () => {
    if (iframeRef) {
      iframeRef.src = iframeRef.src
    }
  }

  useEffect(() => {
    if (!updateBtn.unsaved) {
      handleIframeReload()
    }
  }, [updateBtn.unsaved])

  const conversationalUrl = `${bits.siteURL}/${(standaloneSettings.active && standaloneSettings.customUrl) || `?bit-conversational-form=${formId}`}`
  const handleConversationalBreakpointView = (val) => {
    setBreakpointView(val)
    if (val === 'sm') setMaxWidth('400px')
    if (val === 'md') setMaxWidth('600px')
    if (val === 'lg') setMaxWidth('auto')
  }
  return (
    <div className={css(style.previewWrpr)} ref={ref}>
      <div className={css(style.browserMenubar)}>
        <div className={css(style.searchBar)}>
          <CoolCopy cls={css(style.searchBarInput)} value={conversationalUrl} />
        </div>
        <StyleSegmentControl
          width={130}
          wideTab
          show={['icn']}
          tipPlace="bottom"
          defaultActive={breakpointView}
          onChange={handleConversationalBreakpointView}
          className={css(ut.mr2)}
          options={[
            {
              icn: <span className={css(OptionToolBarStyle.respIcnWrp)}><MobileIcon size={23} /></span>,
              label: 'sm',
              tip: 'Small Screen View',
            },
            {
              icn: <span className={css(OptionToolBarStyle.respIcnWrp)}><TabletIcon size={22} /></span>,
              label: 'md',
              tip: 'Medium Screen View',
            },
            {
              icn: <span className={css(OptionToolBarStyle.respIcnWrp)}><LaptopIcn size={29} stroke={1.6} /></span>,
              label: 'lg',
              tip: 'Large Screen View',
            },
          ]}
        />
        <div className={css(style.shortcodeWrapper)}>
          <span className={css(style.shortCodeText)}>Short Code:</span>
          <CoolCopy cls={css(style.downmenuinput)} value={`[bitform id='${formId}' type='conversational']`} />
        </div>
      </div>
      <div className={css({ ta: 'center', w: '100%', h: 'calc(100% - 40px)' })}>
        <div className={css({ mxw: maxWidth, h: '100%' })}>
          <iframe
            ref={refElm => { setIframeRef(refElm) }}
            title="conversational-preview"
            src={conversationalUrl}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
    </div>
  )
})

export default ConversationalPreview

const style = {
  browserMenubar: {
    dy: 'flex',
    p: '0px 10px',
    ai: 'center',
    jc: 'space-between',
    bc: 'var(--white-0-80)',
    'border-bottom': '0.5px solid var(--white-0-89)',
    btlr: 8,
    btrr: 8,
    h: '40px',
  },
  shortcodeWrapper: {
    dy: 'inline-flex',
    ai: 'center',
  },
  settingContent: {
    dy: 'flex',
    jc: 'space-between',
    mb: 5,
  },
  settings: {
    w: '45%',
    mw: '400px',
  },
  previewWrpr: {
    w: '100%',
    mx: 10,
    h: '80vh',
    b: '1px solid #ccc',
    brs: 10,
    pn: 'sticky',
    tp: 0,
  },
  downmenuinput: {
    w: '260px !important',
    fs: 12,
    brs: '4px !important',
  },
  shortCodeText: {
    fs: 12,
    fw: 600,
    mr: 2,
  },
  searchBar: {
    w: '30%',
  },
  searchBarInput: {
    w: '100% !important',
    fs: 12,
    brs: '4px !important',
  },
}
