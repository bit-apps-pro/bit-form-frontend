/* eslint-disable react/jsx-props-no-spreading */
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { CSSTransition } from 'react-transition-group'
import { $proModal } from '../../../../GlobalStates/GlobalStates'
import ChevronDownIcn from '../../../../Icons/ChevronDownIcn'
import ut from '../../../../styles/2.utilities'
import SimpleAccordionStyle from '../../../../styles/SimpleAccordion.style'
import { IS_PRO } from '../../../../Utils/Helpers'
import proHelperData from '../../../../Utils/StaticData/proHelperData'
import Cooltip from '../../../Utilities/Cooltip'
import ProBadge from '../../../Utilities/ProBadge'
import RenderHtml from '../../../Utilities/RenderHtml'
import SingleToggle from '../../../Utilities/SingleToggle'
import PremiumSettingsOverlay from './PremiumSettingsOverlay'

export default function SimpleAccordion({
  className,
  id,
  titleCls,
  title,
  toggleName,
  children,
  open = false,
  onOpen = () => { },
  switching,
  tip,
  tipProps,
  toggleAction,
  toggleChecked,
  isPro,
  proProperty,
  allowToggle,
  disable,
  actionComponent,
  icnStrok = 2,
  onClick,
  proTip,
}) {
  const setProModal = useSetAtom($proModal)
  const [tgl, setTgl] = useState((!disable && open) || false)
  const [H, setH] = useState(open ? 'auto' : 0)
  const nodeRef = useRef(null)

  const { css } = useFela()
  const toggleAccordion = (e) => {
    // e.preventDefault()
    if (disable) return

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
  useEffect(() => { if (disable !== undefined) setTgl(!disable) }, [disable])
  const allowToggleAction = !isPro || IS_PRO || allowToggle
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

  const setAccHeight = () => setH(getAbsoluteHeight(nodeRef.current))
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
        <div className={css(SimpleAccordionStyle.flxbwn)}>
          <span className={`title ${css(SimpleAccordionStyle.dflx)} ${titleCls}`}>
            {title}
            {/* {isPro && !bits.isPro && <span className={`${css(ut.proBadge)} ${css(ut.ml2)}`}>{__('Pro')}</span>} */}
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
          <div className={css(SimpleAccordionStyle.flxbwn)}>
            <div onClick={cancelBubble} onKeyDown={cancelBubble} role="button" tabIndex="-1">
              {switching && (
                <SingleToggle
                  id={id}
                  className={css(ut.mr2)}
                  name={toggleName || title}
                  {...allowToggleAction && { action: toggleAction }}
                  {...!allowToggleAction && { action: () => setProModal({ show: true, ...proHelperData[proProperty] }) }}
                  isChecked={toggleChecked || ''}
                />
              )}
              {actionComponent && actionComponent}
            </div>
            <ChevronDownIcn className="toggle-icn" size="20" stroke={icnStrok} rotate={!!tgl} />
          </div>
        </div>
      </div>

      <div style={{ height: H, transition: 'height 300ms', overflow: H === 'auto' ? 'auto' : 'hidden' }}>
        <CSSTransition
          nodeRef={nodeRef}
          in={tgl}
          timeout={300}
          onEntering={setAccHeight}
          onEntered={() => setH('auto')}
          onExit={() => setH(nodeRef.current.offsetHeight)}
          onExiting={() => setH(0)}
          unmountOnExit
        >
          <div
            role="button"
            tabIndex={0}
            ref={nodeRef}
            className={`body ${(isPro && !IS_PRO) ? 'pos-rel' : ''}`}
            onClick={cancelBubble}
            onKeyDown={cancelBubble}
          >
            {isPro && !IS_PRO && <PremiumSettingsOverlay proProperty={proProperty} />}
            {children}
          </div>
        </CSSTransition>
      </div>
    </div>
  )
}
