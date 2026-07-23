import { useRef, useState } from "react"
import { useFela } from "react-fela"
import { CSSTransition } from 'react-transition-group'
import ChevronDownIcn from "../../../Icons/ChevronDownIcn"
import { IS_PRO } from "../../../Utils/Helpers"
import ProBadge from "../../Utilities/ProBadge"
import SingleToggle from "../../Utilities/SingleToggle"
import accordionVariantStyles from "./Accordion.styles"


type AccordionsPropsType = {
  title: string,
  subtitle?: string,
  children: React.ReactNode,
  cls?: string,
  onExpand?: () => void,
  onCollapse?: () => void,
  toggle?: boolean,
  action?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  checked?: boolean,
  isPro?: boolean,
  proProperty?: string,
  open?: boolean,
  variant?: string
}


function Accordion({
  title, subtitle, children, cls, onExpand, onCollapse, toggle, action, checked, isPro, proProperty, open, variant = 'default',
}: AccordionsPropsType) {
  const [tgl, setTgl] = useState(open)
  const [H, setH] = useState(open ? 'auto' : 0)
  const nodeRef = useRef(null)
  const { css } = useFela()

  const handleTgl = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLElement>) => {
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

  const styles = accordionVariantStyles[variant] || accordionVariantStyles.default

  return (
    <div className={`btcd-accr ${cls} ${css(accordion.main, styles.main)}`}>
      <div
        className={`btcd-accr-btn ${tgl && 'active'} flx flx-between ${css(styles.header)}`}
        onClick={handleTgl}
        onKeyDown={handleTgl}
        role="button"
        tabIndex={0}
      >
        <div className="btcd-accr-title w-10">
          <div className={`title ${css({ flx: 'align-center' }, styles.title)}`}>
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
          <div className={css(styles.content)} ref={nodeRef}>
            {children}
          </div>
        </CSSTransition>
      </div>
    </div>
  )
}

export default Accordion

const accordion = {
  main: {
    brs: 'unset',
    '&:hover': {
      bd: 'rgb(245, 250, 255)',
    },
  },
}
