import { useFela } from "react-fela"
import ut from "../../../../styles/2.utilities"
import { IS_PRO } from "../../../../Utils/Helpers"
import PremiumSettingsOverlay from "../../../CompSettings/StyleCustomize/ChildComp/PremiumSettingsOverlay"
import CoolCopy from "../../../Utilities/CoolCopy"
import ProBadge from "../../../Utilities/ProBadge"
import HighlightFocusButton from "./ChildComp/HighlightFocusButton"


interface StyleSectionHeaderProps {
  title: string
  isCommon?: boolean
  subtitle?: string
  fieldKey?: string
  highlightSelector?: string
  onCopy?: () => void
  showProBadge?: boolean
  proProperty?: string
  classNames?: string
  scrollTo?: boolean
}

export default function StyleSectionHeader({
  title,
  isCommon = false,
  subtitle,
  fieldKey,
  highlightSelector,
  onCopy,
  showProBadge = false,
  proProperty = 'individualStyle',
  scrollTo = false,
  classNames = '',
}: StyleSectionHeaderProps) {
  const { css } = useFela()

  const dataTestFocusId = `${fieldKey ? `${fieldKey}-` : ''}header-focus`

  return (
    <div className={`${css([cls.headerWrapper, scrollTo ? cls.shadow : {}])} ${classNames}`}>
      <div className={css([ut.pb1, cls.headerContent])}>
        {/* Main Title Row */}
        <div className={css(cls.topRow)}>
          <div className={css(cls.titleWrapper)}>

            <h4 title={title} className={`${css(cls.title)} title`}>
              {title}
            </h4>
            {/* Subtitle Row - Only for Individual */}
            {subtitle && (
              <h5 className={`${css(cls.subtitle)} subtitle`}>{subtitle}</h5>
            )}
          </div>





          {/* Action Buttons */}
          <div className={css(cls.actionButtons)}>
            {showProBadge && !IS_PRO && (
              <ProBadge proProperty={proProperty} />
            )}
            {/* Focus/Highlight Button */}
            {highlightSelector && (
              <HighlightFocusButton highlightSelector={highlightSelector} />

            )}
            {/* Common Badge */}
            {isCommon && (
              <span className={css(cls.commonBadge)}>Global</span>
            )}

            {/* Field Key Copy Badge for Individual */}
            {fieldKey && (
              <CoolCopy value={fieldKey} />
            )}


          </div>
        </div>


      </div>

      {/* Premium Overlay - Only for Individual Non-Pro */}
      {!isCommon && !IS_PRO && showProBadge && (
        <div className="pos-rel">
          <PremiumSettingsOverlay proProperty={proProperty} />
        </div>
      )}

      {/* Divider */}
      {/* <div className={css(cls.divider)} /> */}
    </div>
  )
}

const cls = {
  headerWrapper: {
    pn: 'sticky',
    tp: 'calc(var(--bf-option-toolbar-height))',
    bd: 'var(--bf-bg-white)',
    zx: 5,
    bb: '1px solid var(--bf-stroke-clr)',
    p: '10px 15px',
  },
  headerContent: {
    pt: 5,
    dy: 'flex',
    fd: 'column',
    gp: 'var(--bf-space-4)',
  },
  highlight: {
    bs: '0 0 8px var(--bf-primary-200)',
  },
  topRow: {
    dy: 'flex',
    fd: 'row',
    ai: 'center',
    gp: 12,
    // flxp: 'wrap',
  },
  titleWrapper: {
    dy: 'flex',
    fd: 'column',
    // ai: 'center',
    gp: 2,
    mxw: '230px'
  },
  title: {
    ff: 'var(--bf-font-family-base)',
    w: '100%',
    fs: 'var(--bf-font-lg)',
    fw: 600,
    m: 0,
    ow: 'hidden',
    to: 'ellipsis',
    ws: 'nowrap',
    '&:has(+ .subtitle)': {
      fs: 'var(--bf-font-semibase)',
    },
    // cr: 'var(--b-79-96)',
    // lh: 1.3,
  },
  commonBadge: {
    dy: 'inline-flex',
    ai: 'center',
    jc: 'center',
    px: 12,
    py: 6,
    b: '1px solid var(--bf-secondary-200)',
    bd: 'var(--bf-bg-offwhite)',
    cr: 'var(--bf-text-secondary)',
    brs: 'var(--bf-bdr-radius-sm)',
    fs: 13,
    fw: 500,
    lh: 1,
  },
  fieldKeyBadge: {
    dy: 'inline-flex',
    ai: 'center',
    jc: 'center',
    px: 8,
    py: 4,
    bd: 'var(--white-0-95)',
    cr: 'var(--b-50)',
    brs: 6,
    fs: 12,
    fw: 500,
    b: '1px solid var(--white-0-83)',
    ff: 'Monaco, Consolas, monospace',
  },
  actionButtons: {
    dy: 'flex',
    ai: 'center',
    gp: 4,
    ml: 'auto',
  },
  iconBtn: {
    dy: 'flex',
    ai: 'center',
    jc: 'center',
    w: 25,
    h: 25,
    p: 0,
    brs: 'var(--bf-bdr-radius-sm)',
    br: 'none',
    bd: 'transparent',
    cur: 'pointer',
    tn: 'all 0.2s ease',
    b: '1px solid transparent',
    ':hover': {
      bd: '#d3d3d3',
      // cr: 'var(--b-79-96)',
      b: '1px solid var(--white-0-83)',
    },
    ':focus-visible': {
      focusShadow: 1,
      b: '1px solid var(--b-14-100-70)',
    },
  },

  subtitle: {
    fs: 'var(--bf-font-md)',
    fw: 400,
    m: 0,
    pl: 0,
  },
  shadow: {
    bs: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }
}