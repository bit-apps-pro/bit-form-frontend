/* eslint-disable react/jsx-props-no-spreading */
import { memo, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { CSSTransition } from 'react-transition-group'
import ChevronDownIcn from '../../Icons/ChevronDownIcn'
import EditIcn from '../../Icons/EditIcn'
import { IS_PRO } from '../../Utils/Helpers'
import Button from './Button'
import ProBadge from './ProBadge'
import SingleToggle2 from './SingleToggle2'

function Accordions({
  title, customTitle, subtitle, children, titleEditable, onTitleChange, cls, notScroll, header, onExpand, onCollapse, toggle, tag, action, checked, isPro, proProperty, isExpanded,
}) {
  const [tgl, setTgl] = useState(isExpanded || false)
  const [H, setH] = useState(isExpanded ? 'auto' : 0)
  const inp = useRef(null)
  const nodeRef = useRef(null)
  const { css } = useFela()

  const handleTgl = e => {
    if (!e.target.classList.contains('edit')) {
      setTgl(!tgl)
    }
  }

  const focusEdit = (e) => {
    e.stopPropagation()
    inp.current.focus()
  }

  const onAccordionExpand = () => {
    setH('auto')
    if (onExpand) {
      onExpand()
    }
  }

  const onAccordionCollapse = () => {
    setH(nodeRef.current.offsetHeight)
    if (onCollapse) {
      onCollapse()
    }
  }

  return (
    <div className={`btcd-accr sh-sm ${cls}`}>
      <div className={`btcd-accr-btn ${tgl && 'tertiary active'} flx flx-between`} onClick={handleTgl} onKeyDown={handleTgl} role="button" tabIndex={0}>
        <div className="btcd-accr-title w-10">
          <div className={css({ flx: 'align-center' })}>
            {customTitle}
            {title !== undefined && (
              <input
                aria-label="accrodions"
                title={title}
                ref={inp}
                className={titleEditable && 'edit'}
                style={{ color: tgl ? 'white' : 'inherit', width: tgl ? '70%' : 'auto' }}
                type="text"
                onChange={onTitleChange}
                value={title}
                readOnly={titleEditable === undefined}
              />
            )}
            {titleEditable && (
              <button
                type="button"
                className="edit-icn"
                onClick={focusEdit}
                aria-label="focus edit"
                style={{ color: tgl ? 'white' : 'gray' }}
              >
                <EditIcn size={16} />
              </button>
            )}
            {!tgl && header}
            {tag && (
              <span className="btcd-badge btcd-badge-light ml-2">
                {tag}
              </span>
            )}
            {isPro && !IS_PRO && (<ProBadge proProperty={proProperty} />)}
          </div>
          {subtitle !== undefined && <small>{subtitle}</small>}
        </div>
        {toggle && (
          <SingleToggle2 action={action} checked={checked || false} className="flx" />
        )}
        <Button icn>
          <ChevronDownIcn size="20" rotate={!!tgl} />
        </Button>
      </div>

      <div className={`o-h ${tgl && 'delay-overflow'}`} style={{ height: H, transition: 'height 300ms' }}>
        <CSSTransition
          nodeRef={nodeRef}
          in={tgl}
          timeout={300}
          onEntering={() => setH(nodeRef.current.offsetHeight)}
          onEntered={onAccordionExpand}
          onExiting={() => setH(0)}
          onExit={onAccordionCollapse}
          unmountOnExit
        >
          <div className="p-2" ref={nodeRef}>
            {children}
          </div>
        </CSSTransition>
      </div>
    </div>
  )
}

export default memo(Accordions)
