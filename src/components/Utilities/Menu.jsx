import { useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import tableStyle from '../../styles/table.style'

export default function Menu({ children, title, icn, className }) {
  const [isComponentVisible, setIsComponentVisible] = useState(false)
  const ref = useRef(null)
  const { css } = useFela()

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      // props.onClickOut()
      // isComponentVisible && props.onClickOut()
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  const handleMenu = () => {
    setIsComponentVisible(true)
  }

  return (
    <div className={`btcd-menu ${className || ''}`}>
      <button
        ref={ref}
        onClick={handleMenu}
        className={`${css(tableStyle.tableActionBtn)} btcd-menu-btn`}
        style={{ '--tooltip-txt': '"Column  Visibility"', '--tt-left': '148%' }}
        aria-label="icon-btn"
        type="button"
      >
        {icn}
        {title}
      </button>
      <div />
      <div ref={ref} className={`btcd-menu-li ${isComponentVisible ? 'btcd-menu-a' : ''}`}>
        {children}
      </div>
    </div>
  )
}
