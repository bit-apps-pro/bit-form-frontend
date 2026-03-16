// create a react component

import { useSetAtom } from 'jotai'
import { useFela } from 'react-fela'
import { $proModal } from '../../../../GlobalStates/GlobalStates'
import { __ } from '../../../../Utils/i18nwrap'
import proHelperData from '../../../../Utils/StaticData/proHelperData'

export default function PremiumSettingsOverlay({ classes, hideText, proProperty }) {
  const setProModal = useSetAtom($proModal)
  const { css } = useFela()
  const showProModal = () => setProModal({ show: true, ...proHelperData[proProperty] })
  return (
    <>
      {!hideText && (
        <div className={css(style.content)}>
          {__('Note: This feature is only available to BitForm Pro users.')}
          <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
            <span className={css(style.textLink)}>
              {__('Upgrade now')}
            </span>
          </a>
          {' '}
          {__('to unlock it. Check out our')}
          {' '}
          <a href="https://bitapps.pro/docs/bit-form/" target="_blank" rel="noreferrer">
            <span className={css(style.textLink)}>
              {__('documentation')}
              {' '}
            </span>
          </a>
          {__('to learn more about BitForm Pro.')}
        </div>
      )}
      <div aria-label="premium-overlay" className={css(style.overlay, hideText && { h: '100%', tp: 0 })} role="button" onClick={showProModal} onKeyUp={showProModal} tabIndex="0" />
    </>
  )
}

const style = {
  content: {
    fs: '12px',
    fw: '400',
    p: '5px 10px',
  },
  overlay: {
    bd: 'hsl(215deg 1% 77% / 22%)',
    brs: 8,
    pn: 'absolute',
    tp: 67,
    lp: 0,
    w: '100%',
    h: 'calc(100% - 67px)',
    zx: 2,
    bpf: 'blur(0.5px)',
  },
  textLink: {
    cr: 'blue',
    td: 'underline',
  },
}
