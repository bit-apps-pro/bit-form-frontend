/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { __ } from '../../Utils/i18nwrap'

function SegmentControl({
  defaultActive,
  options,
  size = 100,
  component = 'a',
  onChange,
  variant = 'white',
  show,
  activeShow,
  square,
  classNames = '',
}) {
  const { css } = useFela()
  const baseSize = Number(size) // 100
  const floor = (number) => (Math.floor(baseSize / number))
  const clr = {}

  if (variant === 'white') {
    clr.tabBg = 'var(--white-0-95)'
    clr.selectorBg = 'var(--white-100)'
    clr.active = 'var(--b-50) !important'
  }
  if (variant === 'tertiary') {
    clr.tabBg = 'var(--white-100)'
    clr.selectorBg = 'var(--bf-tertiary)'
    clr.active = 'var(--bf-white-100) !important'
    clr.tabClr = 'var(--bf-text-clr-gray)'
  }
  if (variant === 'blue') {
    // clr.selectorBg = 'linear-gradient(0deg, #0043d9, var(--b-50))'
    clr.selectorBg = 'var(--b-50)'
    clr.tabBg = '#454A65'
    clr.tabClr = 'var(--b-44-87)'
    clr.active = 'var(--white-100) !important'
  }
  if (variant === 'lightgray') {
    clr.selectorBg = 'var(--white-100)'
    clr.tabBg = 'var(--white-0-95)'
    clr.tabClr = 'var(--b-44-87)'
    clr.active = 'var(--b-50) !important'
  }
  const style = {
    wrapper: {
      ta: 'center',
      // mx: 'auto',
    },
    tabs: {
      fs: floor(6.67), // 15
      py: floor(33.34), // 3
      px: floor(20), // 5
      bd: clr.tabBg, // '#f1f1f1',
      ls: 'none',
      dy: 'inline-block',
      brs: 'var(--bf-bdr-radius-sm)', // 14,
      pn: 'relative',
      '& .active': { cr: clr.active },
      '& button': {
        bd: 'none',
        oe: 'none',
        b: 'none',
      },
    },
    selector: {
      w: 0,
      h: '80%',
      dy: 'inline-block',
      pn: 'absolute',
      lt: floor(20), // 5
      tp: '50%',
      tm: 'translatey(-50%)',
      zx: 1,
      // brs: floor(9.09), // 11,
      brs: 'var(--bf-bdr-radius-sm)', // 11,
      tdn: '0.3s',
      ttf: 'cubic-bezier(0.42, 0.44, 0.57, 1.35)',
      bd: clr.selectorBg, // '#fff',
      willChange: 'transform',
      bs: variant === 'blue' && '0 2px 7px -2px rgb(0 11 49 / 79%)',
    },
    tab_link: {
      curp: 1,
      td: 'none',
      fw: 500,
      flxi: 'align-center',
      pn: 'relative',
      py: square ? 0 : floor(10), // 10,
      px: square ? 0 : floor(5), // 20,
      textShadow: variant === 'blue' && '0 1px 1px #6e6e6e70',
      zx: 1,
      ...square && {
        aspectRatio: '1/1',
        w: 30,
        h: 30,
        flxi: 'center',
      },
      tdy: variant === 'tertiary' ? '0s' : '0.3s',
      tdn: '0.6s',
      cr: clr.tabClr,
      'transition-property': 'color',
      ':hover:not(.active)': {
        cr: variant === 'tertiary' ? 'var(--bf-text-clr-tertiary)' : 'var(--white-0-100-90)', // '#333',
        fw: variant === 'tertiary' ? 600 : 500,
        tdy: '0s',
        tdn: '300ms',
      },
      ':focus-visible': { oe: '2px solid var(--b-50)' },
      '& .icn': {
        mr: show?.includes('label') ? floor(20) : 0,
        lh: '75%',
        // se: floor(9),
        dy: 'block',
      },
      // '& .icn img, .icn svg': {
      //   oy: 0,
      //   tm: 'scale(0)',
      //   // mt: floor(20), // 5
      // },
    },
    // segment_img: {
    //   '& > img, & > svg': {
    //     oy: '1 !important',
    //     tm: 'scale(1) !important',
    //     tdy: '.3s',
    //     tdn: '300ms',
    //   },
    // },
  }
  const selectorRef = useRef(null)
  const selectorTransition = useRef(null)
  const tabsRef = useRef(null)
  const [active, setactive] = useState(defaultActive || options[0].label)
  const As = component

  useEffect(() => {
    if (active !== defaultActive) setactive(defaultActive)
  }, [defaultActive])

  useLayoutEffect(() => {
    const toActiveElement = tabsRef?.current?.querySelector(`[data-label="${active}"]`)
    if (toActiveElement) {
      const { width: toActiveElmWidth } = toActiveElement.getBoundingClientRect() || { width: 0 }
      if (!selectorRef.current) return
      if (selectorRef.current.style.width === '') {
        selectorTransition.transition = selectorRef.current.style.transition
        selectorRef.current.style.transition = 'all 0s'
      } else {
        selectorRef.current.style.transition = selectorTransition.transition
      }
      selectorRef.current.style.width = `${toActiveElmWidth}px`
      selectorRef.current.style.transform = `translate(${toActiveElement.offsetLeft - 5}px, -50%)`
    }
  })

  const eventHandler = (e, i) => {
    e.preventDefault()
    if (e.type === 'keypress' && e.code !== 'Space') return
    if (e.type === 'keypress' && e.code !== 'Enter') return

    const elm = e.currentTarget

    if (!e.type === 'keypress' || !e.type === 'click') return

    const currentActiveElm = tabsRef?.current?.querySelector(`.tabs ${component}.active`)
    if (elm === currentActiveElm) return

    currentActiveElm?.classList.remove('active')
    setactive(options[i].label)
    onChange(options[i].label)
  }

  const checkToShow = (item, key) => {
    if (item[key]) {
      if (activeShow && active === item.label && activeShow.includes(key)) return true
      if (show && show.includes(key)) return true
      if (!show && !activeShow) return true
    }
    return false
  }

  return (
    <div className={`${css(style.wrapper)} ${classNames}`}>
      <div ref={tabsRef} className={`${css(style.tabs)} tabs`}>
        <div ref={selectorRef} className={`selector ${css(style.selector)}`} />
        {options?.map((item, i) => (
          <As
            key={`segment-option-${i * 10}`}
            className={`${css(style.tab_link)} tab-link ${active === item.label ? ' active' : ''}`}
            onClick={e => eventHandler(e, i)}
            onKeyDown={e => eventHandler(e, i)}
            data-label={item.label}
            data-testid={`${item.label}-tab`}
            {...(component === 'button' && { type: 'button' })}
            {...(component === 'a' && { href: `#${item.label}` })}
            href={`#${item.label}`}
            type="button"
          >
            {checkToShow(item, 'icn') && (
              <span className={`icn ${active === item.label ? css(style.segment_img) : ''}`}>{item.icn}</span>
            )}
            {checkToShow(item, 'label') && __(item.label)}
          </As>
        ))}
      </div>
    </div>
  )
}

export default SegmentControl
