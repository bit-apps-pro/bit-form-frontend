import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import CloseIcn from '../../../Icons/CloseIcn'
import { searchKey } from '../../style-new/styleHelpers'
import { Position, PositionedModalProps } from '../Types/PositionedModal.types'


export default function PositionedModal({
  show,
  setModal,
  triggerRef,
  children,
  title,
  subTitle,
  onCloseMdl = null,
  showCloseBtn,
  escKeyEvent = true,
  closeOnOutsideClick = true,
  className = '',
  style = {},
  width = 400,
  showModalBackdrop = false,
  maxWidth = '90vw',
  placement = 'auto',
  referenceWindow = window,
}: PositionedModalProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
  // Calculate position relative to trigger element
  const calculatePosition = (): Position => {
    if (!triggerRef) {
      // Fallback to center if no trigger
      return {
        top: referenceWindow.innerHeight / 2 - 200,
        left: referenceWindow.innerWidth / 2 - 200,
        maxHeight: referenceWindow.innerHeight * 0.5
      }
    }

    const triggerRect = triggerRef?.getBoundingClientRect()
    const modalWidth = typeof width === 'number' ? width : 400
    const modalHeight = 408 // Estimated modal height
    const spacing = 8 // Gap between trigger and modal

    let top = triggerRect.bottom + spacing
    let left = triggerRect.left

    // Auto placement logic
    if (placement === 'auto') {
      // Check if modal fits below trigger
      const spaceBelow = referenceWindow.innerHeight - triggerRect.bottom - spacing
      const spaceAbove = triggerRect.top - spacing
      const spaceRight = referenceWindow.innerWidth - triggerRect.left - triggerRect.width
      const spaceLeft = triggerRect.right

      if (spaceBelow >= modalHeight || spaceBelow >= spaceAbove) {
        // Place below
        top = triggerRect.bottom + spacing
      } else {
        // Place above
        top = triggerRect.top - modalHeight - spacing
      }

      // // Adjust horizontal position
      // if (spaceRight < modalWidth) {
      //   // Align to right edge if not enough space
      //   left = triggerRect.right - modalWidth
      // }
      // set left to center align of trigger
      left = triggerRect.left + (triggerRect.width / 2) - (modalWidth / 2)
    } else {
      // Handle explicit placement
      switch (placement) {
        case 'bottom':
          top = triggerRect.bottom + spacing
          break
        case 'top':
          top = triggerRect.top - modalHeight - spacing
          break
        case 'right':
          top = triggerRect.top
          left = triggerRect.right + spacing
          break
        case 'left':
          top = triggerRect.top
          left = triggerRect.left - modalWidth - spacing
          break
      }
    }

    // Boundary constraints
    const maxHeight = Math.min(
      referenceWindow.innerHeight - Math.max(top, spacing) - spacing,
      referenceWindow.innerHeight * 0.8
    )

    // Keep within viewport bounds
    left = Math.max(spacing, Math.min(left, referenceWindow.innerWidth - modalWidth - spacing))
    top = Math.max(spacing, Math.min(top, referenceWindow.innerHeight - 100))

    return { top, left, maxHeight }
  }

  useEffect(() => {
    if (show) {
      const pos = calculatePosition()
      setPosition(pos)
      referenceWindow.removeEventListener('keydown', searchKey)
    } else {
      referenceWindow.addEventListener('keydown', searchKey)
    }
  }, [show, triggerRef])

  // Handle window resize
  useEffect(() => {
    if (!show) return

    const handleResize = () => {
      const pos = calculatePosition()
      setPosition(pos)
    }

    referenceWindow.addEventListener('resize', handleResize)
    return () => referenceWindow.removeEventListener('resize', handleResize)
  }, [show, triggerRef])



  const handleClose = () => {
    if (onCloseMdl) {
      onCloseMdl()
    } else {
      setModal(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape' && escKeyEvent) {
      handleClose()
    }
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (!closeOnOutsideClick) return

    const target = e.target as HTMLElement

    // Don't close if clicking inside modal content
    if (target.closest('.positioned-modal-content')) {
      return
    }

    // Don't close if clicking on add field button
    if (target.closest('.blk-wrp-add-btn')) {
      return
    }

    // Close on any other click
    e.stopPropagation()
    handleClose()
  }

  // Add useEffect to attach event listener to document
  useEffect(() => {
    if (!show || !closeOnOutsideClick) return

    const handleClick = (e: MouseEvent) => {
      handleClickOutside(e)
    }

    // Use capture phase to catch clicks before they bubble
    document.addEventListener('mousedown', handleClick, true)
    referenceWindow.document.addEventListener('mousedown', handleClick, true)

    return () => {
      document.removeEventListener('mousedown', handleClick, true)
      referenceWindow.document.removeEventListener('mousedown', handleClick, true)
    }
  }, [show, closeOnOutsideClick])

  useEffect(() => {
    if (show) {
      referenceWindow.addEventListener('keydown', handleKeyDown)
      return () => referenceWindow.removeEventListener('keydown', handleKeyDown)
    }
  }, [show, escKeyEvent])

  const cancelBubble = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation()

  return (
    <CSSTransition
      in={show}
      timeout={210}
      classNames="positioned-modal-transition"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={`positioned-modal-backdrop ${showModalBackdrop ? "modal-backdrop" : ""}`}
        // onClick={handleClickOutside}
        role="dialog"
        aria-modal="true"
        aria-labelledby={typeof title === 'string' ? 'modal-title' : undefined}
      >
        <div
          className={`positioned-modal-content ${className}`}
          onClick={cancelBubble}
          onKeyDown={cancelBubble}
          style={{
            ...style,
            top: position.top,
            left: position.left,
            width,
            maxWidth,
            maxHeight: position.maxHeight
          }}
        >
          {/* Close Button */}
          {showCloseBtn && (
            <button
              onClick={handleClose}
              className="positioned-modal-close"
              aria-label="Close modal"
              type="button"
            >
              <CloseIcn size={16} stroke={3} />
            </button>
          )}

          {/* Header */}
          {title && (
            <div className="positioned-modal-header">
              {typeof title === 'string' ? (
                <h2 id="modal-title" className="positioned-modal-title">
                  {title}
                </h2>
              ) : (
                title
              )}
              {subTitle && (
                <p className="positioned-modal-subtitle">{subTitle}</p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="positioned-modal-body">
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}