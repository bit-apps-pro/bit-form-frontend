/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import SortIcn from '../../../../../Icons/SortIcn'
import ut from '../../../../../styles/2.utilities'
import { lowerCaseAllAndReplaceSpaceToHipen } from '../../../../style-new/styleHelpers'
import Cooltip from '../../../../Utilities/Cooltip'
import HighlightFocusButton from './HighlightFocusButton'

interface RouteParams {
  formID: string
  formType: string
  '*': string
}

interface LayerAccordionProps {
  className?: string
  route?: string
  title: string
  children?: React.ReactNode
  childrenAccordion?: boolean
  fldData?: any
  open?: boolean
  actionComponent?: React.ReactNode
  offset?: number
  tag?: string
  highlightSelector?: string
  onClick?: () => void
  styleOverride?: boolean
  level?: number
  badge?: string
  hasTarget?: boolean
}

export default function LayerAccordion({
  className = '',
  route,
  title,
  children,
  childrenAccordion = false,
  fldData,
  open = false,
  actionComponent,
  offset = 0,
  tag,
  highlightSelector,
  onClick,
  styleOverride,
  level = 0,
  badge,
  hasTarget = true,
}: LayerAccordionProps) {
  const [tgl, setTgl] = useState(open)
  const [H, setH] = useState<number | string>(open ? 'auto' : 0)
  const nodeRef = useRef<HTMLDivElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

  const { css } = useFela()
  const { '*': rightBarUrl } = useParams<RouteParams>()
  const [rightBar, element, thirdParam] = rightBarUrl?.split('/') || []

  const dataTestId = `${tag ? `${tag}-` : ''}${lowerCaseAllAndReplaceSpaceToHipen(title)}-acc`
  const dataTestFocusId = `${tag ? `${tag}-` : ''}${lowerCaseAllAndReplaceSpaceToHipen(title)}-acc-focus`

  useEffect(() => {
    setTgl(open)
  }, [open])

  let active = false

  // Common Elements (includes regular elements and multi-step elements)
  // Only activate if this LayerAccordion has NO tag (common elements don't have tags)
  if (rightBar === 'theme-customize' && !tag) {
    // Match single-level routes (e.g., 'lbl')
    if (element === route) {
      active = true
    }
    // Match two-level routes (e.g., 'multi-step/stp-hdr-lbl')
    else if (thirdParam && `${element}/${thirdParam}` === route) {
      active = true
    }
  }

  // Individual Field Elements
  // Only activate if in field-theme-customize route AND this LayerAccordion has a tag that matches thirdParam (fieldKey)
  if (rightBar === 'field-theme-customize' && thirdParam && tag && tag === thirdParam) {
    // This is an individual field accordion - activate if route matches
    if (element === route || `${element}/${thirdParam}` === route) {
      active = true
    }
  }

  // Scroll into view when component becomes active
  useEffect(() => {
    if (active && accordionRef.current) {
      setTimeout(() => {
        accordionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        })
      }, 300)
    }
  }, [active])

  const toggleAccordion = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keypress') {
      const keyEvent = e as React.KeyboardEvent
      if (keyEvent.code === 'Space' || keyEvent.code === 'Enter') {
        setTgl(prv => !prv)
        return
      }
    }
    if (e.type === 'keyup') {
      const keyEvent = e as React.KeyboardEvent
      if (keyEvent.code === 'Escape') {
        setTgl(false)
        return
      }
    }
    if (e.type === 'click') {
      setTgl(prv => !prv)
    }
  }

  const cancelBubble = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation()

  const getAbsoluteHeight = (el: HTMLElement) => {
    const styles = window.getComputedStyle(el)
    const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom)
    return Math.ceil(el.offsetHeight + margin)
  }

  const setAccHeight = () => {
    if (nodeRef.current) {
      setH(getAbsoluteHeight(nodeRef.current))
    }
  }

  // Calculate padding based on level or offset
  const paddingLeft = (level || offset) * 16

  return (
    <div
      ref={accordionRef}
      role="button"
      tabIndex={0}
      onKeyUp={toggleAccordion}
      onKeyDown={toggleAccordion}
      className={`${css([cls.accordionLbl, (tgl && children) ? cls.active : {}])} ${className} ${(tgl && children) ? 'toggle' : ''} ${children ? 'has-children' : ''} ${active ? 'active' : ''}`}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <div
        className={`btgl-wrapper ${css([{ w: '100%' }, active ? cls.navBtnActive : {}])}`}
        tabIndex={-1}
        role="button"
        onClick={toggleAccordion}
        onKeyDown={toggleAccordion}
      >
        <div
          className={`title-bar ${css(ut.flxc, cls.titlebar)} ${css(active ? { bd: 'hsl(233deg 36% 95%)' } : {})}`}
          style={{ paddingLeft }}
        >
          {children && (
            <div className='toggle-icn-wrapper'>
              <SortIcn
                className={`toggle-icn ${css(cls.icn)}`}
                size="9"
                style={{ transform: `rotate(${tgl ? 180 : 90}deg)` }}
              />
            </div>
          )}
          <div className={css(cls.flxbwn)}>
            <div className={css(ut.flxc, ut.mr2)}>
              <span className={`title ${css([cls.dflx, !childrenAccordion ? ut.fw500 : {}])}`}>
                {title}
              </span>
              {tag && (
                <span title={`Field key: ${tag}`} className={css(cls.titleTag)}>
                  {tag}
                </span>
              )}
              {badge && (
                <span className={css(cls.badge)}>
                  {badge}
                </span>
              )}
              {styleOverride && (
                <span className={css(cls.overrideIndicator)} title="Theme styles override" />
              )}
              {fldData && (
                <Cooltip width={150} icnSize={15} className={`${css(ut.mr2)} hovertip`}>
                  <div className={css(cls.tipBody)}>
                    {(fldData?.lbl || fldData?.txt || fldData?.adminLbl) && (
                      fldData.lbl || fldData.txt || fldData.adminLbl
                    )}
                  </div>
                </Cooltip>
              )}
              <div className={css(cls.navActionBtn)} data-action-btn-lbl>
                {hasTarget && highlightSelector && (
                  <HighlightFocusButton
                    highlightSelector={highlightSelector}
                    classNames={css(cls.highlightBtn)}
                    iconSize={15}
                    iconStroke={2.5}
                  />
                )}
              </div>
            </div>
            <div onClick={cancelBubble} onKeyDown={cancelBubble} role="button" tabIndex={-1}>
              {actionComponent && actionComponent}
            </div>
          </div>
        </div>
      </div>
      {children && (
        <div style={{ height: H, transition: 'height 300ms', overflow: H === 'auto' ? 'auto' : 'hidden' }}>
          <CSSTransition
            nodeRef={nodeRef}
            in={tgl}
            timeout={300}
            onEntering={setAccHeight}
            onEntered={() => setH('auto')}
            onExit={() => {
              if (nodeRef.current) {
                setH(nodeRef.current.offsetHeight)
              }
            }}
            onExiting={() => setH(0)}
            unmountOnExit
            style={{ overflow: tgl ? 'auto' : 'hidden' }}
          >
            <div
              ref={nodeRef}
              className={`body ${css(cls.body)}`}
              onClick={cancelBubble}
              onKeyDown={cancelBubble}
              style={{ paddingLeft: paddingLeft + 8 }}
            >
              {children}
            </div>
          </CSSTransition>
        </div>
      )}
    </div>
  )
}

const cls = {
  flxbwn: { flx: 'between' },
  titlebar: {
    ws: 'nowrap',
    fw: 500,
    ow: 'hidden',
    py: 8,
    px: 8,
    ':hover': { bd: '#eeeff7' },
    '& .hovertip': { oy: 0 },
  },
  dflx: {
    flx: 'align-center',
    fw: 400,
    fs: 13,
    lh: 2,
    curp: 1,
    '& .hover-tip': { oy: 0 },
  },
  icn: {
    cr: '#c6c6c6',
    mr: 4,
    ml: 4,
    mt: -1,
    tn: 'transform 250ms',
  },
  body: {
    fs: 12,
    py: 4,
  },
  titleTag: {
    p: '1px 5px',
    bd: '#EDF2F7',
    brs: 'var(--bf-bdr-radius-sm)',
    cr: 'gray',
    fs: 11,
    fw: 400,
    b: '1px solid #d8dde2',
    ml: '7px',
    curp: 1,
  },
  badge: {
    fs: 10,
    fw: 500,
    cr: 'var(--b-50)',
    bg: 'var(--b-14-100-93)',
    px: 6,
    py: 2,
    br: 4,
    tt: 'uppercase',
    ml: 6,
  },
  tipBody: {
    lh: '1.1',
    fs: '12.5px',
    fw: 100,
    ff: '"Roboto", sans-serif',
  },
  accordionLbl: {
    mb: 2,
    ':focus-within': { '& div[data-action-btn-lbl]': { dy: 'flex' } },
    ':focus-visible': {
      focusShadow: 1,
      '& div[data-action-btn-lbl]': { dy: 'flex' },
    },
    ':hover': {
      bd: '#f8f8f8',
      '& div[data-action-btn-lbl]': { dy: 'flex' },
    },
  },
  highlightBtn: {
    h: '20px !important',
    w: '20px !important',
  },
  navActionBtn: {
    b: 'none',
    pn: 'absolute',
    rt: 15,
    jc: 'center',
    ai: 'center',
    dy: 'none',
    pl: 15,
  },
  overrideIndicator: {
    w: '5px',
    h: '5px',
    brs: '50%',
    bc: '#ffd64f',
    ml: 5,
    // px: 2,
  },
  active: {
    bd: 'var(--bf-bg-offwhite)',
  },
  navBtnActive: {
    bd: '#eeeff7',
    bs: '0 0 0 1px var(--bf-tertiary-300)',
    '& .title': {
      fw: 'var(--bf-font-medium)',
    },
  },
}