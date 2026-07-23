import { useFela } from 'react-fela'
import optionmenu from '../../styles/optionMenu.style'
import useComponentVisible from '../CompSettings/StyleCustomize/ChildComp/useComponentVisible'

export default function OptionMenu({ title, children, w = 200, h = 250 }) {
  const { ref, isComponentVisible: isActive, setIsComponentVisible } = useComponentVisible(false)
  const optionHandler = () => setIsComponentVisible(!isActive)
  const { css } = useFela()

  return (
    <div ref={ref} className={css(optionmenu.dropdownWrp)}>
      <div className={`${css([optionmenu.dropDown, isActive && optionmenu.dropDownShow])} ${isActive && 'drop-down-show'}`} style={{ ...isActive && { width: w, height: h } }}>
        <button onClick={optionHandler} type="button" className={`${css(optionmenu.menuBtn)} menu-btn ${isActive && css(optionmenu.btnActive)}`} aria-label="Toggle option menu">
          <div aria-hidden="true" className={`hamburger ${css(optionmenu.hamburger)} ${isActive && 'open'}`}>
            <svg width="20" height="20" viewBox="0 0 100 100" stroke="current-color">
              <path className={`${css(optionmenu.line)} line line1`} d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
              <path className={`${css(optionmenu.line)} line line2`} d="M 20,50 H 80" />
              <path className={`${css(optionmenu.line)} line line3`} d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
            </svg>
          </div>
        </button>
        <div className={`${css(optionmenu.dropDownTitle)} drop-down-title`}>{title}</div>
        <ul className={`${css(optionmenu.itemsWrp)} items-wrp`} aria-hidden={!isActive}>
          {children}
        </ul>
      </div>
    </div>
  )
}
