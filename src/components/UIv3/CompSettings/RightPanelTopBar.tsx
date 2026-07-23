import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { hideAll } from 'tippy.js'
import { $customThemes } from '../../../GlobalStates/CustomThemesState'
import { $fields } from '../../../GlobalStates/GlobalStates'
import { $savedStyles, $savedThemeColors, $savedThemeVars } from '../../../GlobalStates/SavedStylesAndVars'
import { $allStyles, $styles } from '../../../GlobalStates/StylesState'
import { $allThemeColors, $themeColors } from '../../../GlobalStates/ThemeColorsState'
import { $allThemeVars, $themeVars } from '../../../GlobalStates/ThemeVarsState'
import AddIcon from '../../../Icons/AddIcon'
import ChevronLeft from '../../../Icons/ChevronLeft'
import CopyIcn from '../../../Icons/CopyIcn'
import EditIcn from '../../../Icons/EditIcn'
import ImportIcn from '../../../Icons/ImportIcn'
import MoreVerticalIcn from '../../../Icons/MoreVerticalIcn'
import RefreshIcn from '../../../Icons/RefreshIcn'
import StyleResetIcn from '../../../Icons/StyleResetIcn'
import ut from '../../../styles/2.utilities'
import OptionToolBarStyle from '../../../styles/OptionToolbar.style'
import { addToBuilderHistory, generateHistoryData, getLatestState, reCalculateFldHeights } from '../../../Utils/FormBuilderHelper'
import { IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import individual from '../../style-new/themes/individual'
import themeProvider, { getSingleFieldStyle } from '../../style-new/themes/themeProvider'
import Btn from '../../Utilities/Btn'
import CheckBox from '../../Utilities/CheckBox'
import Downmenu from '../../Utilities/Downmenu'
import ProBadge from '../../Utilities/ProBadge'

interface RightPanelTopBarProps {
  currentThemeName?: string
  onCreateNew?: () => void
  onImport?: () => void
  onRename?: () => void
  onReset?: () => void
  onSave?: () => void
  onSaveAsNew?: () => void
}

export default function RightPanelTopBar({
  currentThemeName,
  onCreateNew,
  onImport,
  onRename,
  onReset,
  onSave,
  onSaveAsNew,
}: RightPanelTopBarProps) {
  const { css } = useFela()
  const location = useLocation()
  const navigate = useNavigate()

  // const [showMenu, setShowMenu] = useState(false)
  const { fieldKey, formType, formID, element } = useParams()
  const menuRef = useRef<HTMLDivElement>(null)
  const [styleResetTo, setStyleResetTo] = useState('initial')
  const [styles, setStyles] = useAtom($styles)
  const customThemes = useAtomValue($customThemes)
  const tmpStyles = useAtomValue($savedStyles)

  const fields = useAtomValue($fields)
  const fieldsArray = Object.entries(fields)
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [themeColors, setThemeColors] = useAtom($themeColors)
  const tmpThemeVars = useAtomValue($savedThemeVars)
  const tmpThemeColors = useAtomValue($savedThemeColors)
  const setAllThemeColors = useSetAtom($allThemeColors)
  const setAllThemeVars = useSetAtom($allThemeVars)
  const setAllStyles = useSetAtom($allStyles)

  // Determine current view based on route
  const isThemeGallery = location.pathname.includes('/theme') && !location.pathname.includes('/theme-customize')
  const isThemeCustomize = location.pathname.includes('/theme-customize')
  const isIndividualFieldCustomize = location.pathname.includes('/field-theme-customize')

  // Get customize element from route
  const customizeElement = isThemeCustomize
    ? location.pathname.split('/theme-customize/')[1] || 'quick-tweaks'
    : ''

  // Format element name for display
  const formatElementName = (element: string) => {
    if (isIndividualFieldCustomize) {
      return __("Individual Customize")
    }
    return __("Global Customize")
  }

  const getThemeWiseStyle = (theme, fk, type, dir) => {
    if (theme !== 'individual') {
      return getSingleFieldStyle(theme, fk, type, { breakpoint: 'lg', colorScheme: 'light', direction: dir })
    }
    return individual({ fieldKey: fk, type, direction: dir })
  }

  const resetStyle = (resetTo: string = styleResetTo) => {
    if (resetTo === 'initial') {
      const existingFields = Object.keys(styles.fields)
      const previousFields = Object.keys(tmpStyles.fields)

      setStyles(prv => create(prv, drft => {
        existingFields.forEach((fldKey) => {
          if (previousFields.includes(fldKey)) {
            drft.fields[fldKey] = tmpStyles.fields[fldKey]
          } else {
            drft.fields[fldKey] = getThemeWiseStyle(
              styles.fields[fldKey].theme,
              fldKey,
              fields[fldKey].typ,
              tmpThemeVars['--dir'],
            )
          }
        })

        drft.font = tmpStyles.font
        drft.theme = tmpStyles.theme
        drft.fieldSize = tmpStyles.fieldSize
        drft.form = tmpStyles.form
      }))
      setThemeVars(tmpThemeVars)
      setThemeColors(tmpThemeColors)
      reCalculateFldHeights()
      addToBuilderHistory(
        generateHistoryData(
          element,
          fieldKey,
          'Reset All Styles',
          '',
          {
            styles: getLatestState('styles'),
            themeVars: getLatestState('themeVars'),
            themeColors: getLatestState('themeColors'),
          },
        ),
      )
    } else if (resetTo === 'theme') {
      const { themeColors: newThemeColors, themeVars: newThemeVars, styles: newStyles } = themeProvider(styles.theme, fieldsArray, formID, customThemes)
      if (styles.confirmations && newStyles.lgLightStyles) newStyles.lgLightStyles.confirmations = [...styles.confirmations]
      setAllThemeColors(newThemeColors)
      setAllThemeVars(newThemeVars)
      setAllStyles(newStyles)
      addToBuilderHistory(generateHistoryData('', '', 'Theme', styles.theme, { allThemeColors: newThemeColors, allThemeVars: newThemeVars, allStyles: newStyles }))
      reCalculateFldHeights()
    }
    hideAll()
  }

  const handleMenuAction = (action: () => void | undefined) => {
    if (action) {
      action()
    }
    // setShowMenu(false)
  }

  // Handle reset from menu - reset to theme defaults
  const handleResetFromMenu = () => {
    if (onReset) {
      onReset()
    } else {
      // Default behavior: reset to theme defaults
      setStyleResetTo('theme')
      setTimeout(() => {
        resetStyle('theme')
      }, 0)
    }
  }

  const changeStyleResetTo = e => {
    setStyleResetTo(e.target.value)
  }

  return (
    <div className={css(headerStyles.header)}>
      <div className={css(headerStyles.content)}>
        {isThemeGallery ? (
          // Theme Gallery View
          <h2 className={css(headerStyles.title)}>{__('Select Your Theme')}</h2>
        ) : (
          // Theme Customize View - Breadcrumb Navigation
          <nav className={css(headerStyles.breadcrumb)} aria-label="Breadcrumb">
            <Link
              to={`/form/builder/${formType}/${formID}/themes`}
              className={css(headerStyles.breadcrumbLink)}
            >
              <ChevronLeft size="14" />
              Themes /
            </Link>
            {/* <ChevronRightIcon size="16" className={css(headerStyles.breadcrumbSeparator)} /> */}
            {/* <span className={css(headerStyles.breadcrumbCurrent)} title={currentThemeName}>{`${currentThemeName || styles.theme} /`}</span> */}
            {/* <ChevronRightIcon size="16" className={css(headerStyles.breadcrumbSeparator)} /> */}
            <span className={css(headerStyles.breadcrumbCurrent, { td: 'underline' })} title={formatElementName(customizeElement)}>
              {`${formatElementName(customizeElement)}`}
            </span>
          </nav>
        )}
      </div>
      {formType === 'edit' && (isThemeCustomize || isIndividualFieldCustomize) && (
        <div className={css(ut.flxcb)}>
          <Downmenu>
            <Btn
              dataTestId="style-reset-btn"
              className={css(headerStyles.resetBtn)}
              size="sm" gap={5} variant="tertiary-outline">
              <StyleResetIcn size={12} />
              {__('Reset')}
            </Btn>
            <div>
              <div className={css({ mt: 5, ml: 8 }, ut.fw500)}>Confirm reset style?</div>
              <div className={css(ut.flxClm)}>
                <CheckBox radio name="reset" onChange={changeStyleResetTo} checked={styleResetTo === 'initial'} title={<small className="txt-dp"><b>Restore all saved style</b></small>} value="initial" />
                <CheckBox radio name="reset" onChange={changeStyleResetTo} checked={styleResetTo === 'theme'} title={<small className="txt-dp"><b>Reset Style as theme default</b></small>} value="theme" />
              </div>
              <Btn
                onClick={() => resetStyle()}
                width="100%"
                dataTestId="style-reset-confirm"
                size="sm"
                className={css({ my: 5, mx: 'auto' })}
                variant="tertiary"
              >
                Confirm
              </Btn>
            </div>
          </Downmenu>
        </div>
      )}
      {/* Options Menu */}
      {isThemeGallery && (
        <>
          <span className={css(OptionToolBarStyle.border_right)} />
          <button className={css(headerStyles.iconButton)} onClick={() => handleMenuAction(onCreateNew)}>
            <AddIcon size={20} />
            {__('Create')}
          </button>
          <span className={css(OptionToolBarStyle.border_right)} />
          <button className={css(headerStyles.iconButton)} onClick={() => handleMenuAction(onImport)}>
            <ImportIcn size={20} />
            {__('Import')}
          </button>
          <span className={css(OptionToolBarStyle.border_right)} />
        </>
      )}
      {!isThemeGallery && (
        <div className={css(headerStyles.menuWrapper)} ref={menuRef}>
          <Downmenu>

            <button
              // onClick={() => setShowMenu(!showMenu)}
              className={css(headerStyles.menuButton)}
              aria-label="More options"
            >
              <MoreVerticalIcn size="20" />
            </button>

            <div className={css(headerStyles.dropdownMenu)}>
              {onRename && (
                <button onClick={() => handleMenuAction(onRename)}>
                  <EditIcn size={16} stroke={2} />
                  <span>{__('Rename')}</span>
                </button>
              )}
              <button onClick={handleResetFromMenu}>
                <RefreshIcn size={16} />
                <span>{__('Reset Theme Style')}</span>
              </button>
              {(onSave || onSaveAsNew) && <div className={css(headerStyles.menuDivider)} />}
              {onSave && (
                <button onClick={() => handleMenuAction(onSave)}>
                  <EditIcn size={16} />
                  <span>{__('Update Theme Style')}</span>
                  {!IS_PRO && <ProBadge proProperty='customThemes' />}
                </button>
              )}
              {onSaveAsNew && (
                <button onClick={() => handleMenuAction(onSaveAsNew)}>
                  <CopyIcn size={16} />
                  <span>{__('Save as New Theme')}</span>
                  {!IS_PRO && <ProBadge proProperty='customThemes' />}
                </button>
              )}
            </div>
          </Downmenu>
        </div>
      )}
    </div>
  )
}

const headerStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: 0,
    p: 15,
    bb: '1px solid var(--bf-stroke-clr)',
    h: 'var(--bf-option-toolbar-height)',
    bd: 'var(--bf-bg-offwhite)',
    pn: 'sticky',
    w: '100%',
    zx: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fs: 'var(--bf-font-lg)',
    fw: 'var(--bf-font-semibold)',
    cr: 'var(--bf-text-clr-dark)',
    m: 0,
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    cr: 'var(--bf-text-clr-gray)',
    fs: 'var(--bf-font-base)',
    fw: 'var(--bf-font-medium)',
    ws: 'nowrap',
  },
  breadcrumbLink: {
    cr: 'var(--bf-text-clr-tertiary)',
    bd: 'none',
    b: 'none',
    p: 0,
    curp: 1,
    tn: 'color 0.2s',
    dy: 'inline-flex',
    ai: 'center',
    ':hover': {
      cr: 'var(--bf-tertiary-800)',
      td: 'underline !important',
    },
  },
  breadcrumbSeparator: {
    color: '#9CA3AF',
    flexShrink: 0,
  },
  breadcrumbCurrent: {
    mxw: '150px',
    fw: 'var(--bf-font-semibold)',
    to: 'ellipsis',
    ow: 'hidden',
  },
  resetBtn: {
    p: '7px 10px !important',
    minWidth: 'auto',
    fs: 'var(--bf-font-sm)',
    fw: 'var(--bf-font-medium)',
    ai: 'center',
    b: '1px solid var(--bf-stroke-clr) !important',
  },
  menuWrapper: {
    position: 'relative',
    marginLeft: '5px',
  },
  iconButton: {
    ...OptionToolBarStyle.icn_btn,
    pn: 'relative',
    w: 62,
    fs: 'var(--bf-font-md)',
    gp: 3,
    px: 4,
    cr: 'var(--bf-text-clr-darkgray)',
    '::before': {
      ct: '""',
      zx: -1,
      pn: 'absolute',
      size: 0,
      tp: '50%',
      lt: '50%',
      brs: '50%',
      tm: 'translate(-50%,-50%)',
      tn: '400ms border, opacity 300ms',
      oy: 0,
      b: '0px solid var(--white-0-81-32)',
    },
    ':hover::before': { b: '40px solid var(--white-0-81-32)', oy: 1 },
    ':disabled::before': { dy: 'none' },
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '30px',
    padding: 0,
    border: '1px solid #E5E7EB',
    brs: 'var(--bf-bdr-radius-sm)', // 4
    backgroundColor: '#ffffff',
    color: '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#F9FAFB',
      borderColor: '#D1D5DB',
      color: '#374151',
    },
  },
  dropdownMenu: {
    minWidth: '220px',
    '& button': {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#374151',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
      textAlign: 'left',
      ':hover': {
        backgroundColor: '#F3F4F6',
      },
    },
  },
  menuDivider: {
    height: '1px',
    backgroundColor: '#E5E7EB',
    margin: '4px 0',
  },
}