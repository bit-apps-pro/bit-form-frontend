/* eslint-disable react/jsx-props-no-spreading */
import Tippy from '@tippyjs/react'
import { roundArrow } from 'tippy.js'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/shift-away-extreme.css'
import 'tippy.js/dist/svg-arrow.css'
import 'tippy.js/dist/tippy.css'
// import 'tippy.js/themes/translucent.css'
// import 'tippy.js/themes/material.css'
import 'tippy.js/themes/light-border.css'

export default function Downmenu({
  children, instance = null, width = 'auto', place = 'bottom', onShow, onHide, arrow = true, trigger = 'click', offset = [0, 10], hideOnClick = true, ...otherProps
}) {
  return (
    <Tippy
      ref={instance}
      inertia
      trigger={trigger}
      placement={place}
      duration={350}
      interactiveBorder={20}
      {...onShow && { onShow }}
      {...onHide && { onHide }}
      theme="light-border"
      animation="shift-away-extreme"
      interactive
      maxWidth={width}
      offset={offset}
      arrow={arrow && roundArrow}
      content={children[1]}
      hideOnClick={hideOnClick}
      {...otherProps}
    >
      <span>{children[0]}</span>
    </Tippy>
  )
}
