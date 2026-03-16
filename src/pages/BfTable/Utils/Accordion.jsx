import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { CSSTransition } from 'react-transition-group'
import ChevronDownIcn from '../../../Icons/ChevronDownIcn'
import { IS_PRO } from '../../../Utils/Helpers'
import ProBadge from '../../../components/Utilities/ProBadge'
import SingleToggle from '../../../components/Utilities/SingleToggle'

function Accordions({
  title, subtitle, children, cls, onExpand, onCollapse, toggle, action, checked, isPro, proProperty,
}) {
  const [tgl, setTgl] = useState(false)
  const [H, setH] = useState(0)
  const nodeRef = useRef(null)
  const { css } = useFela()

  const handleTgl = e => {
    if (!e.target.classList.contains('edit')) {
      setTgl(!tgl)
    }
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
    <div className={`btcd-accr ${cls} ${css(accordion.main)}`}>
      <div
        className={`btcd-accr-btn ${tgl && 'active'} flx flx-between`}
        onClick={handleTgl}
        onKeyDown={handleTgl}
        role="button"
        tabIndex={0}
      >
        <div className="btcd-accr-title w-10">
          <div className={css({ flx: 'align-center', fw: 700 })}>
            {title}
            {isPro && !IS_PRO && (<ProBadge proProperty={proProperty} />)}
          </div>
          {subtitle !== undefined && <small>{subtitle}</small>}
        </div>
        {toggle && (
          <SingleToggle action={action} checked={checked || false} className="flx" />
        )}
        <ChevronDownIcn size="20" rotate={!!tgl} />
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

export default Accordions

const accordion = {
  main: {
    brs: 'unset',
    mx: 10,
    '&:hover': {
      bd: 'rgb(245, 250, 255)',
    },
  },
}
