import Tippy from '@tippyjs/react'
import { useFela } from 'react-fela'
import { animateFill } from 'tippy.js'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/dist/backdrop.css'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/material.css'
import QuestionIcn from '../../Icons/QuestionIcn'

export default function Cooltip({ className, children, width = 'auto', icnSize = 20, tip = false, tipLabel = '' }) {
  const { css } = useFela()
  return (
    <Tippy
      animateFill
      plugins={[animateFill]}
      duration={150}
      theme="material"
      animation="shift-away"
      interactive
      maxWidth={width}
      // arrow
      content={<div className={css(c.tipBody)}>{children}</div>}
    >
      <div
        role="button"
        tabIndex="0"
        data-tipbtn
        className={`${css(c.popper_icn)} ${className}`}
      >
        {tip ? (tipLabel || children) : <QuestionIcn size={icnSize} />}
      </div>
    </Tippy>
  )
}

const c = {
  popper_icn: {
    dy: 'inline-grid',
    placeContent: 'center',
    cr: 'var(--dp-blue-bg)',
    oy: 0.3,
    ml: 5,
    ':hover': {
      oy: 1,
      cur: 'help',
    },
  },
  tipBody: { fw: 300, p: 2 },
}
