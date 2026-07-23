import { useEffect, useRef } from 'react'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import ut from '../../../styles/2.utilities'
import HighlightFocusButton from '../CompSettings/StyleCustomize/ChildComp/HighlightFocusButton'

export interface NavBtnProps {
  route: string
  subRoute?: string
  cssSelector?: string
  label: string | React.ReactNode
  offset?: string | number
  icn?: React.ReactNode
  highlightSelector?: string
  styleOverride?: boolean
  classNames?: string
}

interface RouteParams {
  formType: string
  formID: string
  '*': string
}

export default function NavBtn({
  route,
  subRoute,
  cssSelector,
  label,
  offset = 1,
  icn,
  highlightSelector,
  styleOverride,
  classNames = '',
}: NavBtnProps) {
  const { formType, formID, '*': rightBarUrl } = useParams<RouteParams>()
  const [rightBar, element, fieldKey] = rightBarUrl?.split('/') || []
  const navBtnRef = useRef<HTMLDivElement>(null)

  const dataTestId = `${subRoute ? `${subRoute}-` : ''}${route}-nav`
  const dataTestFocusId = `${subRoute ? `${subRoute}-` : ''}${route}-nav-focus`

  let active = false
  // Only activate if we're in theme-customize route AND there's no fieldKey in URL AND no subRoute AND route matches
  if (rightBar === 'theme-customize' && !fieldKey && !subRoute && element === route) {
    active = true
  }
  // Only activate if we're in field-theme-customize route AND subRoute matches fieldKey AND route matches
  else if (rightBar === 'field-theme-customize' && subRoute && subRoute === fieldKey && element === route) {
    active = true
  }

  // Scroll into view when component becomes active
  useEffect(() => {
    if (active && navBtnRef.current) {
      setTimeout(() => {
        navBtnRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        })
      }, 100)
    }
  }, [active])

  const navigate = useNavigate()

  const styleHandler = () => {
    if (!subRoute) {
      navigate(`/form/builder/${formType}/${formID}/theme-customize/${route}`)
    } else {
      navigate(`/form/builder/${formType}/${formID}/field-theme-customize/${route}/${subRoute}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      styleHandler()
    }
  }

  const { css } = useFela()

  // Calculate padding based on offset
  const paddingLeft = typeof offset === 'number' ? offset * 10 : parseFloat(offset) * 10

  return (
    <div
      ref={navBtnRef}
      className={`${css([s.navBtn, active ? s.navBtnActive : {}])} ${classNames} ${active ? 'active' : ''}`}
      style={{ paddingLeft }}
      onClick={styleHandler}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      data-testid={dataTestId}
    >
      <div className={css(ut.flxc)}>
        {icn && <span className={css(ut.flxc, { mr: 5 })}>{icn}</span>}
        {label}
        {styleOverride && (
          <span
            className={css(s.overrideIndicator)}
            title="Theme styles overridden"
          />
        )}
      </div>

      <div className={css(s.navActionBtn, ut.mr2)} data-action-btn>
        {highlightSelector && (

          <HighlightFocusButton
            highlightSelector={highlightSelector}
            classNames={css(s.highlightBtn)}
            iconSize={15}
            iconStroke={2.5}
          />
        )}
      </div>
    </div>
  )
}

const s = {
  navBtn: {
    w: '100%',
    h: 26,
    fs: 13,
    ta: 'left',
    p: 0,
    pl: 13,
    lh: 2,
    cr: 'inherit',
    flx: 'center-between',
    wb: 'keep-all',
    ws: 'nowrap',
    pn: 'relative',
    us: 1,
    curp: 1,
    ':focus-within': { '& div[data-action-btn]': { dy: 'flex' } },
    ':focus-visible': {
      focusShadow: 1,
      '& div[data-action-btn]': { dy: 'flex' },
    },
    '& .hovertip': { oy: 0 },
    ':hover': {
      '& .hovertip': { oy: 1 },
      bd: '#eeeff7',
      '& div[data-action-btn]': { dy: 'flex' },
    },
  },
  navBtnActive: { bd: '#eeeff7' },
  navActionBtn: {
    h: '100%',
    b: 'none',
    pn: 'absolute',
    bd: 'linear-gradient(90deg, transparent, #eeeff7 45%)',
    rt: 0,
    jc: 'center',
    ai: 'center',
    dy: 'none',
    pl: 15,
  },
  highlightBtn: {
    h: '20px !important',
    w: '20px !important',
  },
  tipBody: {
    lh: '1.1',
    fs: '12.5px',
    fw: 100,
    ff: '"Roboto", sans-serif',
  },
  overrideIndicator: {
    w: '5px',
    h: '5px',
    brs: '50%',
    bc: '#ffd64f',
    ml: '3px',
    px: 2,
  },
}