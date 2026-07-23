import { useFela } from "react-fela"
import FocusIcn from "../../../../../Icons/FocusIcn"
import { __ } from "../../../../../Utils/i18nwrap"
import { highlightElm, removeHighlight, scrollAndHighlight } from "../../../../style-new/styleHelpers"

type HighlightButtonProps = {
  highlightSelector: string
  classNames?: string
  iconSize?: number
  iconStroke?: number
}

const HighlightFocusButton: React.FC<HighlightButtonProps> = ({ highlightSelector, classNames, iconSize = 16, iconStroke = 2.5 }) => {
  const { css } = useFela()
  // Handle click to scroll and highlight
  const handleScrollToElement = () => {
    if (highlightSelector) {
      scrollAndHighlight(highlightSelector)
    }
  }
  return (
    <button
      onMouseEnter={() => highlightElm(highlightSelector)}
      onFocus={() => highlightElm(highlightSelector)}
      onMouseLeave={() => removeHighlight()}
      onBlur={() => removeHighlight()}
      className={`${css(style.iconBtn)} ${classNames}`}
      onClick={handleScrollToElement}
      title={__("Click to Highlight Element in Builder")}
      type="button"
    >
      <FocusIcn size={iconSize} stroke={iconStroke} />
    </button>
  )
}

export default HighlightFocusButton

const style = {
  iconBtn: {
    flx: 'center',
    w: 25,
    h: 25,
    p: 0,
    brs: 'var(--bf-bdr-radius-sm)',
    bd: 'transparent',
    // cr: 'var(--b-50)',
    curp: 1,
    tn: 'all 0.2s ease',
    b: '1px solid transparent',
    ':hover': {
      bd: '#d3d3d3',
      b: '1px solid var(--bf-bdr-clr-light)',
    },
    ':focus-visible': {
      focusShadow: 1,
      b: '1px solid var(--bf-bdr-clr-light)',
    },
  },
}