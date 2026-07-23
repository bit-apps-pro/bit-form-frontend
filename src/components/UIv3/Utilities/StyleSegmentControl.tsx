import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { __ } from '../../../Utils/i18nwrap'
import { lowerCaseAllAndReplaceSpaceToHipen } from '../../style-new/styleHelpers'
import Tip from '../../Utilities/Tip'
import segmentVariantStyles from './StyleSegmentControl.styles'

interface SegmentOption {
  label: string
  icn?: ReactNode
  tip?: string
}

interface StyleSegmentControlProps {
  defaultActive?: string
  className?: string
  options: SegmentOption[]
  size?: number
  onChange?: (label: string) => void
  show?: string[]
  width?: string | number
  tipPlace?: 'top' | 'bottom' | 'left' | 'right'
  borderRadius?: number
  activeShow?: string[]
  noShadow?: boolean
  defaultItmWidth?: string | number
  wideTab?: boolean
  h?: string | number
  variant?: 'default' | 'clean' | 'primary' | 'warning' | 'secondary' | 'tertiary' | 'clean-tertiary' | 'success' | 'danger' | 'primary-outline' | 'secondary-outline' | 'tertiary-outline' | 'clean-tertiary-bottom-outline' | 'success-outline' | 'danger-outline'
}



export default function StyleSegmentControl({
  defaultActive,
  className = '',
  options,
  size = 100,
  onChange,
  show,
  width,
  tipPlace = 'top',
  borderRadius = 'var(--bf-bdr-radius-sm)',
  activeShow,
  noShadow,
  defaultItmWidth,
  wideTab,
  h,
  variant = 'default',
}: StyleSegmentControlProps) {
  const { css } = useFela()
  const baseSize = Number(size)
  const floor = (number: number): number => (Math.floor(baseSize / number))

  const currentVariant = segmentVariantStyles[variant] || segmentVariantStyles.default

  const style: Record<string, any> = {
    wrapper: {
      ta: 'center',
      ...width && { w: width },
    },
    tabs: {
      fs: 13,
      flx: 'center',
      py: 1.5,
      px: 3,
      ls: 'none',
      brs: borderRadius,
      pn: 'relative',
      '& .active': currentVariant.active,
      '& button': {
        bd: 'none',
        oe: 'none',
        b: 'none',
      },
      ...currentVariant.tabs,
    },
    selector: {
      w: 0,
      h: '80%',
      dy: 'inline-block',
      pn: 'absolute',
      lt: 5,
      tp: '50%',
      tm: 'translatey(-50%)',
      zx: 1,
      brs: borderRadius - 2,
      tdn: '0.3s',
      ttf: 'cubic-bezier(0.42, 0.44, 0.57, 1.35)',
      willChange: 'transform',
      ...currentVariant.selector,
    },
    tab_link: {
      curp: 1,
      td: 'none',
      fw: 500,
      pn: 'relative',
      p: 0,
      zx: 1,
      mnh: 24,
      w: wideTab ? '100%' : 24,
      h: wideTab ? 30 : 24,
      brs: borderRadius,
      flx: 'center',
      tdy: '0.3s',
      tdn: '0.6s',
      'transition-property': 'color',
      ...currentVariant.tabLink,
      ':focus-visible': { oe: '2px solid var(--b-50)' },
      '& .icn': {
        mr: show?.includes('label') ? floor(20) : 0,
        lh: '75%',
        flx: 'center',
      },
    },
  }

  const selectorRef = useRef<HTMLDivElement>(null)
  const selectorTransition = useRef<{ transition?: string }>({})
  const tabsRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>(defaultActive || options[0]?.label || '')

  useEffect(() => {
    if (active !== defaultActive && defaultActive) {
      setActive(defaultActive)
    }
  }, [defaultActive])

  useLayoutEffect(() => {
    const toActiveElement = tabsRef?.current?.querySelector(`[data-label="${active}"]`) as HTMLElement
    if (toActiveElement) {
      const { width: toActiveElmWidth } = toActiveElement.getBoundingClientRect() || { width: 0 }
      if (!selectorRef.current) return

      if (selectorRef.current.style.width === '') {
        selectorTransition.current.transition = selectorRef.current.style.transition
        selectorRef.current.style.transition = 'all 0s'
      } else {
        selectorRef.current.style.transition = selectorTransition.current.transition || ''
      }

      selectorRef.current.style.width = `${toActiveElmWidth}px`
      selectorRef.current.style.transform = `translate(${toActiveElement.offsetLeft - 5}px, -50%)`
    }
    else {
      if (selectorRef.current) {
        selectorRef.current.style.width = `0px`
        selectorRef.current.style.transform = `translate(0px, -50%)`
      }
    }
  })

  const eventHandler = (e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>, i: number): void => {
    e.preventDefault()

    if (e.type === 'keydown') {
      const keyEvent = e as React.KeyboardEvent<HTMLButtonElement>
      if (keyEvent.code !== 'Space' && keyEvent.code !== 'Enter') return
    }

    const elm = e.currentTarget

    if (e.type !== 'keydown' && e.type !== 'click') return

    const currentActiveElm = tabsRef.current?.querySelector('.tabs button.active')
    if (elm !== currentActiveElm) {
      currentActiveElm?.classList.remove('active')
      setActive(options[i].label)
    }

    if (onChange) onChange(options[i].label)
  }

  const checkToShow = (item: SegmentOption, key: keyof Pick<SegmentOption, 'icn' | 'label'>): boolean => {
    if (item[key]) {
      if (activeShow && active === item.label && activeShow.includes(key)) return true
      if (show && show.includes(key)) return true
      if (!show && !activeShow) return true
    }
    return false
  }

  return (
    <div className={`${css(style.wrapper)} ${className}`}>
      <div ref={tabsRef} className={`${css(style.tabs)} tabs`} style={{ height: h }}>
        <div
          ref={selectorRef}
          className={`selector ${css(style.selector)}`}
          style={{ width: defaultItmWidth }}
        />
        {/* <TipGroup> */}
        {options?.map((item, i) => {
          const btn = (
            <button
              key={`segment-option-${i * 10}`}
              type="button"
              className={`${css(style.tab_link)} ${active === item.label ? ' active' : ''}`}
              onClick={(e) => eventHandler(e, i)}
              onKeyDown={(e) => eventHandler(e, i)}
              data-label={item.label}
              data-testid={`${lowerCaseAllAndReplaceSpaceToHipen(item.label)}-tab`}
            >
              {checkToShow(item, 'icn') && (
                <span className={`icn ${css(style.icn)} ${active === item.label ? css(style.segment_img) : ''}`}>
                  {item.icn}
                </span>
              )}
              {checkToShow(item, 'label') && __(item.label)}
            </button>
          )

          if (item.tip) {
            return (
              <Tip
                key={`segment-option-${i * 100}`}
                className={`${css({ w: '100%', dy: 'inline-block' })} segment-tip`}
                msg={item.tip}
                place={tipPlace}
                whiteSpaceNowrap
                theme="light-border"
                delay={300}
              >
                {btn}
              </Tip>
            )
          }
          return btn
        })}
        {/* </TipGroup> */}
      </div>
    </div >
  )
}