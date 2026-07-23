import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { $customThemes, $defaultTheme } from '../../../GlobalStates/CustomThemesState'
import { $fields, $formId, $forms, $proModal } from '../../../GlobalStates/GlobalStates'
import { $allStyles, $styles } from '../../../GlobalStates/StylesState'
import { $allThemeColors } from '../../../GlobalStates/ThemeColorsState'
import { $allThemeVars } from '../../../GlobalStates/ThemeVarsState'
import { useThemeActions } from '../../../hooks/useThemeActions'
// import UploadIcn from '../../../Icons/UploadIcn'
import { addToBuilderHistory, generateHistoryData, reCalculateFldHeights } from '../../../Utils/FormBuilderHelper'
import bitsFetch from '../../../Utils/bitsFetch'
import { JCOF } from '../../../Utils/globalHelpers'
import Btn from '../../Utilities/Btn'
import SliderModal from '../../Utilities/SliderModal'
import themeProvider from '../../style-new/themes/themeProvider'
import { CustomTheme, Theme } from '../Types/ThemeGallery.types'
import ThemeAPI from '../Utils/ThemeAPI'
// import themes from '../../themes/themeList'
import { IS_PRO } from '../../../Utils/Helpers'
import proHelperData from '../../../Utils/StaticData/proHelperData'
import { __ } from '../../../Utils/i18nwrap'
import ProBadge from '../../Utilities/ProBadge'
import { extractCustomStyles } from '../../style-new/styleHelpers'
import themes from '../../style-new/themes/themeList'
import RightPanelTopBar from '../CompSettings/RightPanelTopBar'
import CreateNewThemeModal from './CreateNewThemeModal'
import ImportThemeModal from './ImportThemeModal'
import ThemeCard from './ThemeCard'
import themeGalleryStyles from './ThemeGallery.styles'
// import themeProvider from './themes/themeProvider'

export default function ThemeGallery() {
  const { css } = useFela()

  const setAllThemeColors = useSetAtom($allThemeColors)
  const setAllThemeVars = useSetAtom($allThemeVars)
  const setAllStyles = useSetAtom($allStyles)
  const setProModal = useSetAtom($proModal)

  // Use theme actions hook for shared theme management logic
  const { resetTheme, updateTheme, saveAsNewTheme } = useThemeActions()

  const [customThemes, setCustomThemes] = useAtom($customThemes) as [Record<string, CustomTheme>, React.Dispatch<React.SetStateAction<Record<string, CustomTheme>>>]
  const [defaultTheme, setDefaultTheme] = useAtom($defaultTheme) as [string, React.Dispatch<React.SetStateAction<string>>]
  const forms = useAtomValue($forms)
  const currentStyles = useAtomValue($styles)
  const allStyles = useAtomValue($allStyles)
  const allThemeColors = useAtomValue($allThemeColors)
  const allThemeVars = useAtomValue($allThemeVars)
  const formId = useAtomValue($formId)
  const fields = useAtomValue($fields)
  const fieldsArray = Object.entries(fields)

  const [previewModal, setPreviewModal] = useState({ show: false, activeIndex: 0 })
  const [createModal, setCreateModal] = useState(false)
  const [importModal, setImportModal] = useState(false)

  // Convert built-in themes to Theme type
  const appThemes: Theme[] = themes.map(theme => ({
    ...theme,
    id: theme.slug,
    type: 'builtin' as const,
  }))

  // Combine all themes for preview
  const allThemes: Theme[] = [
    ...appThemes,
    ...Object.values(customThemes).map((theme: CustomTheme) => ({
      ...theme,
      img: theme.thumbnail || themes[0].img,
    })),
  ]

  const activeThemeSlug = currentStyles.theme
  const activeTheme = allThemes.find(theme => theme.slug === activeThemeSlug || theme.id === activeThemeSlug)

  // Helper function to reload custom themes from API and update global state
  const reloadCustomThemes = async () => {
    try {
      const result = await ThemeAPI.getCustomThemes()
      const themes = result.themes || {}
      const defaultThemeSlug = result.default_theme || 'bitformDefault'
      setCustomThemes(themes)
      setDefaultTheme(defaultThemeSlug)
    } catch (error) {
      console.error('Failed to reload custom themes:', error)
      toast.error('Failed to reload custom themes')
    }
  }

  const existingFormsListExceptCurrent = useMemo(() => {
    return forms.filter((form: any) => form.formID !== formId).map((form: any) => ({ id: form.formID, name: form.formName }))
  }, [forms, formId])


  // Helper function to generate unique theme ID
  const generateThemeId = () => `custom_${Date.now()}`

  // Helper function to get themeVars and themeColors based on theme state
  const getThemeVarsAndColors = (themeSlug: string, isActive: boolean) => {
    if (isActive) {
      return {
        themeColors: allThemeColors,
        themeVars: allThemeVars,
      }
    }
    const themeDataFromProvider = themeProvider(themeSlug, fieldsArray, formId)
    return {
      themeColors: themeDataFromProvider.themeColors,
      themeVars: themeDataFromProvider.themeVars,
    }
  }

  // Helper function to create theme data structure
  const createThemeData = (
    name: string,
    basedOn: string,
    themeColors: any,
    themeVars: any,
    styles: any,
    font?: any
  ) => {
    const uniqueId = generateThemeId()
    return {
      id: uniqueId,
      slug: uniqueId,
      name,
      type: 'custom' as const,
      basedOn,
      thumbnail: '',
      is_default: false,
      font: font || styles?.lgLightStyles?.font || {},
      themeColors,
      themeVars,
      styles,
    }
  }

  const handleThemeApply = (themeSlug: string) => {
    if (!IS_PRO && customThemes[themeSlug]) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    const { themeColors, themeVars, styles } = themeProvider(
      themeSlug,
      fieldsArray,
      formId,
      customThemes
    )

    if (currentStyles.confirmations && styles.lgLightStyles) {
      styles.lgLightStyles.confirmations = [...currentStyles.confirmations]
    }
    setAllThemeColors(themeColors)
    setAllThemeVars(themeVars)
    setAllStyles(styles)
    addToBuilderHistory(
      generateHistoryData('', '', 'Theme', themeSlug, {
        allThemeColors: themeColors,
        allThemeVars: themeVars,
        allStyles: styles,
      })
    )
    reCalculateFldHeights()
    toast.success('Theme applied successfully!')
  }

  const handleCreateTheme = async (themeName: string, baseThemeSlug: string) => {
    try {
      // Check if the base theme is currently active
      const isBaseThemeActive = activeThemeSlug === baseThemeSlug

      // Get themeVars and themeColors
      const { themeColors, themeVars } = getThemeVarsAndColors(baseThemeSlug, isBaseThemeActive)

      // Extract only form, font, and fieldsSize from current styles
      const customStyles = extractCustomStyles(allStyles)

      // Create theme data
      const themeData = createThemeData(
        themeName,
        baseThemeSlug,
        themeColors,
        themeVars,
        customStyles,
        (allStyles.lgLightStyles as any)?.font
      )

      await ThemeAPI.saveTheme(themeData)
      toast.success('Custom theme created successfully!')
      reloadCustomThemes()
      setCreateModal(false)
    } catch (error) {
      console.error('Failed to create theme:', error)
      toast.error('Failed to create custom theme')
    }
  }

  const handleDuplicateTheme = async (theme: Theme) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    try {
      // Check if the theme is currently active/applied
      const isThemeActive = activeThemeSlug === theme.slug || activeThemeSlug === theme.id

      let themeColors, themeVars, customStyles, basedOn: string

      if (theme.type === 'custom' && customThemes[theme.id]) {
        // For custom themes, use the saved theme data but extract only form, font, fieldsSize
        const sourceTheme = customThemes[theme.id]
        customStyles = extractCustomStyles(sourceTheme.styles || {})
        basedOn = sourceTheme.basedOn || 'bitformDefault'

        // If theme is active, use current active themeVars and themeColors, otherwise use saved values
        // if (isThemeActive) {
        //   themeColors = allThemeColors
        //   themeVars = allThemeVars
        // } else {
        themeColors = sourceTheme.themeColors
        themeVars = sourceTheme.themeVars
        // }
      } else {
        // For built-in themes, get current form's styles (form, font, fieldsSize)
        customStyles = extractCustomStyles(allStyles)
        basedOn = theme.slug || 'bitformDefault'

        // Get themeVars and themeColors
        // const themeData = getThemeVarsAndColors(theme.slug || 'bitformDefault', isThemeActive)
        const themeData = getThemeVarsAndColors(theme.slug || 'bitformDefault')
        themeColors = themeData.themeColors
        themeVars = themeData.themeVars
      }

      // Create theme data
      const themeData = createThemeData(
        `${theme.name} (Duplicate)`,
        basedOn,
        themeColors,
        themeVars,
        customStyles
      )

      await ThemeAPI.saveTheme(themeData)
      toast.success('Theme duplicated successfully!')
      reloadCustomThemes()
    } catch (error) {
      console.error('Failed to duplicate theme:', error)
      toast.error('Failed to duplicate theme')
    }
  }

  const handleDeleteTheme = async (themeId: string) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    if (!window.confirm('Are you sure you want to delete this theme?')) return

    try {
      await ThemeAPI.deleteTheme(themeId)
      toast.success('Theme deleted successfully!')
      reloadCustomThemes()
    } catch (error: any) {
      console.error('Failed to delete theme:', error)
      toast.error(error.message || 'Failed to delete theme')
    }
  }

  const handleExportTheme = async (themeId: string) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    try {
      await ThemeAPI.exportTheme(themeId)
      toast.success('Theme exported successfully!')
    } catch (error) {
      console.error('Failed to export theme:', error)
      toast.error('Failed to export theme')
    }
  }

  const handleSetDefault = async (themeSlug: string) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    try {
      await ThemeAPI.setDefaultTheme(themeSlug)
      toast.success('Default theme set successfully!')
      reloadCustomThemes()
    } catch (error) {
      console.error('Failed to set default theme:', error)
      toast.error('Failed to set default theme')
    }
  }

  const handleRenameTheme = async (themeId: string) => {
     if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    const theme = customThemes[themeId]
    if (!theme) return

    const newName = window.prompt('Enter new theme name:', theme.name)
    if (!newName || newName === theme.name) return

    try {
      await ThemeAPI.renameTheme(themeId, newName)
      toast.success('Theme renamed successfully!')
      reloadCustomThemes()
    } catch (error) {
      console.error('Failed to rename theme:', error)
      toast.error('Failed to rename theme')
    }
  }

  // Handlers using the shared hook
  const handleResetTheme = () => resetTheme(activeThemeSlug)
  const handleUpdateTheme = () => updateTheme(activeThemeSlug, reloadCustomThemes)
  const handleSaveAsNewTheme = () =>{
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customThemes })
      return
    }
    saveAsNewTheme(activeThemeSlug, reloadCustomThemes)
  } 

  const handleImportFile = async (file: File) => {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const jsonData = e.target?.result as string
          await ThemeAPI.importTheme(jsonData)
          toast.success('Theme imported successfully!')
          reloadCustomThemes()
          setImportModal(false)
        } catch (error) {
          console.error('Failed to import theme:', error)
          toast.error('Failed to import theme')
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Failed to read file:', error)
      toast.error('Failed to read file')
    }
  }

  const handleImportFromForm = async (formId: string) => {
    try {
      // Fetch form data
      const response = await bitsFetch({ id: formId }, 'bitforms_get_a_form')

      if (!response?.success) {
        throw new Error(response?.data || 'Failed to fetch form data')
      }

      const formData = response.data

      // Validate required data
      if (!formData) {
        throw new Error('Form data is missing')
      }

      // Parse JSON strings for theme data
      let parsedStyles, parsedThemeVars, parsedThemeColors

      try {
        parsedStyles = formData.style ? JCOF.parse(formData.style) : null
        parsedThemeVars = formData.themeVars ? JCOF.parse(formData.themeVars) : null
        parsedThemeColors = formData.themeColors ? JCOF.parse(formData.themeColors) : null
      } catch (parseError) {
        console.error('Failed to parse theme data:', parseError)
        throw new Error('Invalid theme data format')
      }

      // Check if theme data exists
      if (!parsedStyles || !parsedThemeVars || !parsedThemeColors) {
        throw new Error('Form does not have theme data to import')
      }

      // Get the basedOn theme from parsedStyles.theme or default to bitformDefault
      const basedOnTheme = parsedStyles?.theme || 'bitformDefault'

      // Get form name for theme name
      const formName = formData.form_name || formData.form_content?.formInfo?.formName || 'Imported Form'
      const themeName = `${formName} Theme`

      // Extract only form, font, and fieldsSize from styles
      const customStyles = extractCustomStyles(parsedStyles)

      // Create theme data structure
      const themeData = createThemeData(
        themeName,
        basedOnTheme,
        parsedThemeColors,
        parsedThemeVars,
        customStyles,
        parsedStyles.lgLightStyles?.font
      )

      // Save the theme
      await ThemeAPI.saveTheme(themeData)
      toast.success('Theme imported successfully from form!')
      reloadCustomThemes()
      setImportModal(false)
    } catch (error) {
      console.error('Failed to import from form:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to import theme from form'
      toast.error(errorMessage)
    }
  }

  const openPreviewModal = (index: number) => {
    setPreviewModal({
      show: true,
      activeIndex: index,
    })
  }

  const onModalThemeApply = () => {
    const theme = allThemes[previewModal.activeIndex]
    if (theme) {
      handleThemeApply(theme.slug || theme.id)
      setPreviewModal({ ...previewModal, show: false })
    }
  }

  return (
    <div className={css(themeGalleryStyles.sectionWrapper)}>
      {/* Preview Slider Modal */}
      <RightPanelTopBar
        onCreateNew={() => setCreateModal(true)}
        onImport={() => setImportModal(true)}
      />
      <SliderModal
        {...{
          title: (
            <div className={css(themeGalleryStyles.modalHeader)}>
              <h4 className={css(themeGalleryStyles.modalTitle)}>
                {allThemes[previewModal.activeIndex]?.name}
              </h4>
              <Btn
                size="sm"
                onClick={onModalThemeApply}
                disabled={
                  activeTheme?.slug === allThemes[previewModal.activeIndex]?.slug ||
                  activeTheme?.id === allThemes[previewModal.activeIndex]?.id
                }
              >
                Apply Theme
              </Btn>
            </div>
          ),
        } as any}
        show={previewModal.show}
        defaultActiveSlideIndex={previewModal.activeIndex}
        setModal={setPreviewModal}
        onChange={(index: number) => setPreviewModal(prev => ({ ...prev, activeIndex: index }))}
      >
        {allThemes.map((theme) => (
          <div key={theme.slug || theme.id} className={css(themeGalleryStyles.previewSlide)}>
            <img
              className={css(themeGalleryStyles.previewImg)}
              src={theme.img}
              alt={theme.name}
            />
          </div>
        ))}
      </SliderModal>

      {/* Create New Theme Modal */}
      <CreateNewThemeModal
        show={createModal}
        appThemes={appThemes}
        onClose={() => setCreateModal(false)}
        onCreate={handleCreateTheme}
      />

      {/* Import Theme Modal */}
      <ImportThemeModal
        show={importModal}
        onClose={() => setImportModal(false)}
        onImportFile={handleImportFile}
        onImportFromForm={handleImportFromForm}
        existingForms={existingFormsListExceptCurrent}
      />

      <div className={css(themeGalleryStyles.contentWrapper)}>
        {/* Applied Styles Section - Always Visible */}
        <div className={css(themeGalleryStyles.appliedStylesSection)}>
          <h3 className={css(themeGalleryStyles.appliedStylesSectionTitle)}>
            {__('Applied Styles')}
            <span className={css(themeGalleryStyles.appliedStylesBadge)}>Current</span>
          </h3>
          <div className={css(themeGalleryStyles.appliedStylesGrid)}>
            <ThemeCard
              theme={{
                id: 'applied-styles',
                slug: activeThemeSlug,
                name: activeTheme?.name || 'Current Styles',
                type: activeTheme?.type || 'builtin',
                themeColors: allThemeColors,
                themeVars: allThemeVars,
                styles: allStyles,
                img: activeTheme?.img || themes[0].img,
              }}
              isActive={false}
              isApplied={true}
              isPreview={false}
              isAppliedStylesCard={true}
              isCustomTheme={!!customThemes[activeThemeSlug]}
              onResetTheme={handleResetTheme}
              onUpdateTheme={handleUpdateTheme}
              onSaveAsNew={handleSaveAsNewTheme}
            />
          </div>

          {/* Info Note */}
          <div className={css(themeGalleryStyles.infoNote)}>
            <span className={css(themeGalleryStyles.infoIcon)}>💡</span>
            <p className={css(themeGalleryStyles.infoText)}>
              {__('Your customizations apply only to this form\'s styling. To preserve changes, create or update a custom theme from the Options menu.')}
            </p>
          </div>
        </div>

        {/* App Themes Section */}
        <div className={css(themeGalleryStyles.section)}>
          <h3 className={css(themeGalleryStyles.sectionTitle)}>{__('App Themes')}</h3>
          <div className={css(themeGalleryStyles.grid)}>
            {appThemes.map((theme, index) => (
              <ThemeCard
                key={theme.slug}
                theme={{ ...themeProvider(theme.slug, fieldsArray, formId), ...theme }}
                isActive={theme.is_default || defaultTheme === theme.slug}
                isPreview={true}
                isApplied={activeThemeSlug === theme.slug}
                onApply={() => handleThemeApply(theme.slug)}
                onPreview={() => openPreviewModal(index)}
                onDuplicate={() => handleDuplicateTheme(theme)}
                onSetDefault={() => handleSetDefault(theme.slug)}
              />
            ))}
          </div>
        </div>
        <div className={css(themeGalleryStyles.section)}>
          {/* Custom Themes Section */}
          {Object.keys(customThemes).length > 0 && (
            <div className={css(themeGalleryStyles.section)}>
              <h3 className={css(themeGalleryStyles.sectionTitle)}>{__('Custom Themes')} {!IS_PRO && <ProBadge proProperty='customThemes' />}</h3>
              <div className={css(themeGalleryStyles.grid)}>
                {Object.values(customThemes).map((theme, index) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isActive={theme.is_default || false}
                    isApplied={activeThemeSlug === theme.slug}
                    onApply={() => handleThemeApply(theme.id)}
                    onPreview={() => openPreviewModal(appThemes.length + index)}
                    onDuplicate={() => handleDuplicateTheme(theme)}
                    onDelete={() => handleDeleteTheme(theme.id)}
                    onExport={() => handleExportTheme(theme.id)}
                    onSetDefault={() => handleSetDefault(theme.id)}
                    onRename={() => handleRenameTheme(theme.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  )
}
