import { useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import CloseIcn from '../../Icons/CloseIcn'
import { searchKey } from '../style-new/styleHelpers'

export default function Modal({
  show, setModal, sm, lg, style, className, title, warning, hdrActn: headerAction, children, subTitle, autoHeight, closeOnOutsideClick, onCloseMdl = null, width, showCloseBtn = true,
  escKeyEvent = true,
}) {
  const nodeRef = useRef(null)
  const handleClickOutside = e => {
    if (closeOnOutsideClick === false) return
    if (e.target.classList.contains('btcd-modal-wrp')) {
      e.stopPropagation()
      if (onCloseMdl) {
        onCloseMdl()
      } else {
        setModal(false)
      }
    }
  }

  const handleCloseBtnClick = () => {
    if (onCloseMdl) {
      onCloseMdl()
    } else {
      setModal(false)
    }
  }
  const cancelBubble = (e) => e.stopPropagation()

  if (show) {
    window.removeEventListener('keydown', searchKey)
  } else {
    window.addEventListener('keydown', searchKey)
  }

  const hideModal = (e) => {
    if (e.code === 'Escape' && escKeyEvent) {
      handleCloseBtnClick()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', hideModal)
    return () => {
      window.removeEventListener('keydown', hideModal)
    }
  }, [])

  return (
    <CSSTransition
      in={show}
      timeout={210}
      classNames="btc-mdl-trn"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        aria-label="modal-backdrop"
        data-testid="mdl-wrp"
        role="button"
        tabIndex={0}
        onKeyDown={handleClickOutside}
        onMouseDown={handleClickOutside}
        className="btcd-modal-wrp"
      >
        <div
          tabIndex="-1"
          onClick={cancelBubble}
          onKeyDown={cancelBubble}
          role="button"
          className={`btcd-modal ${sm ? 'btcd-m-sm' : ''} ${lg ? 'btcd-m-lg' : ''} ${className} ${autoHeight ? 'auto-height' : ''}`}
          style={style}
        >
          <div data-testid="mdl-cntnt" className="btcd-modal-content" style={{ width }}>
            {headerAction}
            {typeof showCloseBtn !== 'undefined' && showCloseBtn && (
              <button
                data-testid="mdl-cls-btn"
                onClick={handleCloseBtnClick}
                className="icn-btn btcd-mdl-close"
                aria-label="modal-close"
                type="button"
              >
                <CloseIcn size={16} stroke={3} />
              </button>
            )}
            {typeof title === 'string' && <h2 className="btcd-mdl-title flx" style={{ color: warning ? 'red' : '' }}>{title}</h2>}
            {typeof title === 'object' && title}
            <small className="btcd-mdl-subtitle">{subTitle}</small>
            {!sm && <div className="btcd-mdl-div" />}
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}
