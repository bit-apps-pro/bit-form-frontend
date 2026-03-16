/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import ChevronDownIcn from '../../Icons/ChevronDownIcn'
import app from '../../styles/app.style'
import { IS_PRO } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import PremiumSettingsOverlay from '../CompSettings/StyleCustomize/ChildComp/PremiumSettingsOverlay'
import Cooltip from './Cooltip'
import ProBadge from './ProBadge'
import RenderHtml from './RenderHtml'

export default function ShowMoreLess({
  className,
  id,
  titleCls,
  title,
  children,
  open = false,
  onOpen = () => { },
  tip,
  tipProps,
  isPro,
  proProperty,
  minVisibleHeigh,
  icnStrok = 2,
  onClick,
  proTip,
  showText,
  hideText,
}) {
  const [tgl, setTgl] = useState(open || false)
  const [H, setH] = useState(open ? 'auto' : minVisibleHeigh)
  const nodeRef = useRef(null)
  const { css } = useFela()
  const toggleAccordion = (e) => {
    // e.preventDefault()

    if (e.type === 'keypress') {
      if (e.code === 'Space' || e.code === 'Enter') {
        setTgl(prv => !prv)
        !tgl && onOpen()
        return
      }
    }
    if (e.type === 'keyup') {
      if (e.code === 'Escape') {
        setTgl(false)
        return
      }
    }
    if (e.type === 'click') {
      setTgl(prv => !prv)
      !tgl && onOpen()
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tgl) setH(getAbsoluteHeight(nodeRef.current))
    else setH(minVisibleHeigh)
  }, [tgl])

  const cancelBubble = (e) => e.stopPropagation()

  const getAbsoluteHeight = (el) => {
    const element = el
    const { overflow } = element.style
    element.style.overflow = 'auto'
    let { height, marginBlock } = window.getComputedStyle(element)
    height = parseFloat(height)
    marginBlock = parseFloat(marginBlock)
    element.style.overflow = overflow
    return Math.round(height + marginBlock)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyUp={toggleAccordion}
      onKeyDown={toggleAccordion}
      className={`${className} ${tgl && 'active'}`}
      onClick={onClick}
    >
      <div
        className="btgl w-10"
        tabIndex="-1"
        role="button"
        onClick={toggleAccordion}
        onKeyDown={toggleAccordion}
        data-testid={`${id}-smpl-acrdn`}
      >
        {title && (
          <span className={`title ${css(style.dflx)} ${titleCls}`}>
            {title}
            {isPro && !IS_PRO && (
              <ProBadge width="18" proProperty={proProperty}>
                <div className="txt-body">
                  <RenderHtml html={proTip} />
                </div>
              </ProBadge>
            )}
            {tip && (
              <Cooltip {...{ ...tipProps, className: 'hover-tip' }}>
                <div className="txt-body">
                  <RenderHtml html={tip} />
                </div>
              </Cooltip>
            )}

          </span>
        )}

      </div>

      <div style={{ height: H, transition: 'height 300ms', overflow: H === 'auto' ? 'auto' : 'hidden' }} className={css(!tgl && minVisibleHeigh ? style.contentWrpr : {})}>
        <div
          role="button"
          tabIndex={0}
          ref={nodeRef}
          className="body pos-rel"
          onClick={cancelBubble}
          onKeyDown={cancelBubble}
        >
          {isPro && !IS_PRO && <PremiumSettingsOverlay proProperty={proProperty} />}
          {children}
        </div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={toggleAccordion}
        onKeyUp={toggleAccordion}
        onKeyDown={toggleAccordion}
        className={css(style.showLess)}
      >
        <button className={`${css(app.btn, style.seeMoreBtn)} btcd-btn-o-gray btcd-btn-sm`}>
          {!tgl && (__(showText || 'Show More'))}
          {tgl && (__(hideText || 'Show Less'))}
          <ChevronDownIcn className="toggle-icn" size="20" stroke={icnStrok} rotate={!!tgl} />
        </button>
      </div>
    </div>
  )
}

const style = {
  dflx: {
    flx: 'align-center',
    fw: 600,
    '& .hover-tip': { oy: 0 },
  },
  showLess: {
    flx: 'center',
    curp: 'pointer',
    mb: 10,
  },
  contentWrpr: {
    position: 'relative',
    '&:after': {
      content: "''",
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50px',
      background: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
    },
  },
  seeMoreBtn: {
    m: '0px !important',
  },
}
