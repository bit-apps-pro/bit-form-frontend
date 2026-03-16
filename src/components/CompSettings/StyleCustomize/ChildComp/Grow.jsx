import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

export default function Grow({ children, open, overflw = 'auto', classNames = '' }) {
  const [H, setH] = useState(open ? 'auto' : 0)
  const [tgl, setTgl] = useState(open || false)
  const nodeRef = useRef(null)

  useEffect(() => {
    setTgl(open)
  }, [open])

  const getAbsoluteHeight = (el) => {
    const styles = window.getComputedStyle(el)
    const margin = parseFloat(styles.marginTop)
      + parseFloat(styles.marginBottom)
    return Math.ceil(el.offsetHeight + margin)
  }

  const setAccHeight = () => setH(getAbsoluteHeight(nodeRef.current))

  return (
    <div style={{ height: H, transition: 'height 300ms', overflow: H === 'auto' ? overflw : 'hidden' }}>
      <CSSTransition
        nodeRef={nodeRef}
        in={tgl}
        timeout={300}
        onEntering={setAccHeight}
        onEntered={() => setH('auto')}
        onExit={() => setH(nodeRef.current.offsetHeight)}
        onExiting={() => setH(0)}
        unmountOnExit
        style={{ overflow: tgl ? overflw : 'hidden' }}
      >
        <div ref={nodeRef} className={`body ${classNames}`}>
          {children}
        </div>
      </CSSTransition>
    </div>
  )
}
