import { useSetAtom } from 'jotai'
import { useFela } from 'react-fela'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/dist/backdrop.css'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/material.css'
import { $proModal } from '../../GlobalStates/GlobalStates'
import CrownIcn from '../../Icons/CrownIcn'
import proHelperData from '../../Utils/StaticData/proHelperData'

export default function ProBadge({
  className, children, width = 'auto', icnSize = 12, tip = false, proProperty, text = 'PRO', isNewBadge = false,
}) {
  const { css } = useFela()
  const setProModal = useSetAtom($proModal)
  const handleOnClick = (e) => {
    if (isNewBadge) return
    e.stopPropagation()
    setProModal({ show: true, ...proHelperData[proProperty] })
  }
  return (
    // <Tippy
    //   animateFill
    //   plugins={[animateFill]}
    //   duration={150}
    //   theme="material"
    //   animation="shift-away"
    //   interactive
    //   maxWidth={width}
    //   content={<div className={css(c.tipBody)}>{children}</div>}
    // >
    <div
      role="button"
      tabIndex="0"
      data-tipbtn
      className={`${css(c.popper_icn)} ${className}`}
      onClick={handleOnClick}
      onKeyDown={handleOnClick}
    >
      {/* {tip ? children : <ProBadgeIcn size={icnSize} />} */}

      <span className={`${css(c.proBadge)} pro-badge`}>
        {!isNewBadge && <CrownIcn size={icnSize} stroke={1} />}
        {text}
      </span>
    </div>
    // </Tippy>
  )
}

const c = {
  proBadge: {
    // bd: '#999999',
    flx: 'center',
    cr: 'var(--bf-text-clr-secondary)',
    gp: 3,
    b: '.5px solid var(--bf-stroke-clr)',
    fs: 10,
    fw: 'var(--bf-font-medium)',
    brs: 'var(--bf-bdr-radius-sm)',
    p: '2px 4px',
    ml: 5,
    ':hover': {
      cur: 'pointer',
      cr: 'var(--bf-text-clr-tertiary)',
      fw: 'var(--bf-font-semibold)',
    },
  },
  popper_icn: {
    dy: 'inline-grid !important',
    placeContent: 'center',
    cr: 'var(--dp-blue-bg)',
    oy: 1,
    ml: 5,
    ':hover': {
      // oy: 1,
      cur: 'help',
    },
    cur: 'pointer !important',
  },
  tipBody: { fw: 300, p: 2 },
}
