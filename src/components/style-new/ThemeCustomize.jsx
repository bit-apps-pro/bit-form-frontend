import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { $customThemes } from '../../GlobalStates/CustomThemesState'
import { $builderRightPanelScroll, $fields, $flags, $proModal } from '../../GlobalStates/GlobalStates'
import { $allStyles, $styles } from '../../GlobalStates/StylesState'
import { $allThemeColors } from '../../GlobalStates/ThemeColorsState'
import { $allThemeVars } from '../../GlobalStates/ThemeVarsState'
import { useThemeActions } from '../../hooks/useThemeActions'
import { IS_PRO } from '../../Utils/Helpers'
import proHelperData from '../../Utils/StaticData/proHelperData'
import RightPanelTopBar from '../UIv3/CompSettings/RightPanelTopBar'
import StyleSectionHeader from '../UIv3/CompSettings/StyleCustomize/StyleSectionHeader'
import CommonElementStyleCustomizers from '../UIv3/style-new/CommonElementStyleCustomizers'
import ThemeAPI from '../UIv3/Utils/ThemeAPI'
import FormContainerCustomizer from './FormContainerCustomizer'
import ThemeQuickTweaksCustomizer from './ThemeQuickTweaksCustomizer'

export default function ThemeCustomize() {
  const { css } = useFela()
  const { formType, formID, element } = useParams()
  const setFlags = useSetAtom($flags)
  const scrollTo = useAtomValue($builderRightPanelScroll)

  const currentStyles = useAtomValue($styles)
  const allStyles = useAtomValue($allStyles)
  const allThemeColors = useAtomValue($allThemeColors)
  const allThemeVars = useAtomValue($allThemeVars)
  const fields = useAtomValue($fields)
  const setProModal = useSetAtom($proModal)
  const [customThemes, setCustomThemes] = useAtom($customThemes)

  // Use theme actions hook for shared theme management logic
  const { updateTheme, saveAsNewTheme } = useThemeActions()

  const activeThemeSlug = currentStyles.theme

  useEffect(() => {
    setFlags(oldFlgs => ({ ...oldFlgs, styleMode: true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check if current theme is custom
  const currentTheme = customThemes[activeThemeSlug]
  const isCustomTheme = !!currentTheme
  const currentThemeName = currentTheme?.name || activeThemeSlug

  // Helper function to reload custom themes from API and update global state
  const reloadCustomThemes = async () => {
    try {
      const result = await ThemeAPI.getCustomThemes()
      const themes = result.themes || {}
      setCustomThemes(themes)
    } catch (error) {
      console.error('Failed to reload custom themes:', error)
      toast.error('Failed to reload custom themes')
    }
  }

  // Helper function to generate unique theme ID
  const generateThemeId = () => `custom_${Date.now()}`

  // Handler for Rename theme (only for custom themes)
  const handleRename = () => {
    if (!isCustomTheme) {
      toast.error('Only custom themes can be renamed')
      return
    }

    const newName = window.prompt('Enter new theme name:', currentTheme.name)
    if (!newName || newName === currentTheme.name) return

    ThemeAPI.renameTheme(activeThemeSlug, newName)
      .then(() => {
        toast.success('Theme renamed successfully!')
        reloadCustomThemes()
      })
      .catch((error) => {
        console.error('Failed to rename theme:', error)
        toast.error('Failed to rename theme')
      })
  }

  // Handler for Reset Theme Style - reset to theme defaults
  // const handleReset = () => {
  //   // This will be handled by RightPanelTopBar's handleResetFromMenu
  //   // which sets styleResetTo to 'theme' and calls resetStyle
  // }

  // Handlers using the shared hook
  const handleSaveToTheme = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    updateTheme(activeThemeSlug, reloadCustomThemes)
  }
  const handleSaveAsNew = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    saveAsNewTheme(activeThemeSlug, reloadCustomThemes)
  }

  const genarateTitle = () => {
    const title = {
      'quick-tweaks': 'Theme Quick Tweaks',
      '_frm-bg': 'Form Wrapper',
      _frm: 'Form Container',
      'fld-wrp': 'Field Container(s)',
      'lbl-wrp': 'Label & Subtitle Container(s)',
      lbl: 'Label(s)',
      'lbl-pre-i': 'Label Prefix Icon(s)',
      'lbl-suf-i': 'Label Suffix Icon(s)',
      'sub-titl': 'Subtitle(s)',
      'sub-titl-pre-i': 'Subtitle Prefix Icon(s)',
      'sub-titl-suf-i': 'Subtitle Suffix Icon(s)',
      fld: 'Input(s)',
      'pre-i': 'Input Prefix Icon(s)',
      'suf-i': 'Input Suffix Icons',
      'hlp-txt': 'Helper Text(s)',
      'hlp-txt-pre-i': 'Helper Text Prefix Icon(s)',
      'hlp-txt-suf-i': 'Helper Text Suffix Icon(s)',
      'err-msg': 'Error Message(s)',
      'err-txt-pre-i': 'Error Text Prefix Icon(s)',
      'err-txt-suf-i': 'Error Text Suffix Icon(s)',
      btn: 'Button(s)',
      'btn-pre-i': 'Button Prefix Icon(s)',
      'btn-suf-i': 'Button Suffix Icon(s)',
      'req-smbl': 'Asterisk Symbol',
    }
    return title[element] || 'Theme Customization'
  }

  return (
    <div className={css(cls.sectionWrapper)}>
      <RightPanelTopBar
        currentThemeName={currentThemeName}
        onRename={isCustomTheme ? handleRename : undefined}
        // onReset={handleReset}
        onSave={isCustomTheme ? handleSaveToTheme : undefined}
        onSaveAsNew={handleSaveAsNew}
      />
      <div className={css(cls.contentWrapper)}>
        <StyleSectionHeader
          title={genarateTitle()}
          isCommon
          highlightSelector={`[data-dev-${element?.replace('quick-tweaks', '_frm-bg')}]`}
          scrollTo={scrollTo}
        />
        <div className={css(cls.wrp)}>
          {element === 'quick-tweaks' && <ThemeQuickTweaksCustomizer />}
          {element === 'multi-step' && <FormContainerCustomizer element={element} />}
          {/* {element.match(/(_frm-bg|_frm|fld-wrp|lbl-wrp|lbl|sub-titl|fld|hlp-txt|err-msg|btn|pre-i|suf-i|req-smbl|)/gi)?.[0] && <CommonElementStyleCustomizers element={element} />} */}
          {['quick-tweaks', 'multi-step'].includes(element) ? null : <CommonElementStyleCustomizers element={element} />}
        </div>
      </div>

    </div>
  )
}

const cls = {
  title: { mt: 5, mb: 2, fs: 18 },
  breadcumbLink: { fs: 11, flxi: 'center', mr: 3, ':focus': { bs: 'none' } },
  l1: { cr: 'var(--white-0-61)', ':hover': { textDecoration: 'underline !important' } },
  l2: { cr: 'var(--white-0-21)' },
  wrp: {
    p: '10px 15px 20px',
    fs: 12,
  },
  sectionWrapper: {
    bd: 'var(--white-100)',
  },

  contentWrapper: {
  },
  subTitle: { mt: 10, mb: 5, fs: 15, cr: 'var(--white-0-31)' },
  // subTitle2: { fs: 14, fw: 500, mt: 10 },
  divider: { bb: '1px solid var(--white-0-83)', mx: 3, my: 10 },
  thmBtn: {
    flxi: 'center',
    cg: 4,
    h: 30,
    ws: 'nowrap',
    fs: 12,
    fw: 500,
    b: 'none',
    bd: 'transparent',
    curp: 1,
    py: 8,
    px: 15,
    brs: 20,
    pn: 'relative',
    ':hover:not([data-active="true"])': { bd: 'var(--b-79-96)' },
  },
  clrActive: {
    bd: 'var(--b-50)',
    cr: 'var(--white-100)',
  },
}
