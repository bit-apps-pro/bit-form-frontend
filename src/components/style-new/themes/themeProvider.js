import { getMultiStepStyle, isMultiStepForm } from '../../MultiStep/BuilderStepHelper'
import { replaceObjectKeyWithNewId } from '../styleHelpers'
import { baseThemes, derivedThemes } from './themeRegistry'

export default function themeProvider(themeSlug, fieldsArr, formId, customThemes = {}) {
  // Check derived themes (includes both built-in and custom)
  const allDerivedThemes = { ...derivedThemes, ...customThemes }

  if (allDerivedThemes[themeSlug]) {
    return resolveDerivedTheme(themeSlug, allDerivedThemes[themeSlug], fieldsArr, formId)
  }

  // Base theme
  if (baseThemes[themeSlug]) {
    return resolveBaseTheme(themeSlug, baseThemes[themeSlug], fieldsArr, formId)
  }

  // Fallback to bitformDefault
  return resolveDerivedTheme('bitformDefault', derivedThemes.bitformDefault, fieldsArr, formId)
}

function resolveBaseTheme(themeSlug, themeFunction, fieldsArr, formId) {
  return {
    themeColors: themeFunction({ type: 'themeColors' }),
    themeVars: themeFunction({ type: 'themeVars' }),
    styles: themeFunction({ fieldsArr, formId }),
  }
}

function resolveDerivedTheme(themeSlug, config, fieldsArr, formId) {
  const { basedOn, themeVars = {}, themeColors = {}, styles: customStyles = {}, fieldOverrides = {}, multiStepStyle } = config

  // Get base theme styles
  const baseTheme = themeProvider(basedOn, fieldsArr, formId, {})

  // Apply field overrides if present (for built-in derived themes only)
  let processedBaseStyles = baseTheme.styles
  if (Object.keys(fieldOverrides).length > 0) {
    processedBaseStyles = applyFieldOverrides(
      baseTheme.styles,
      fieldOverrides,
      fieldsArr,
      themeSlug,
    )
  }

  // Get multiStepStyle if provided and form is multi-step
  const getMultiStepStyleForBreakpoint = (breakpoint, colorScheme) => {
    if (typeof multiStepStyle === 'function') {
      return multiStepStyle(formId, breakpoint, 'ltr', colorScheme)
    }
    if (isMultiStepForm()) {
      return getMultiStepStyle({ formID: formId, themeSlug: basedOn, breakpoint, direction: 'ltr', colorScheme })
    }
    return {}
  }

  // Merge themeVars (deep merge for each breakpoint/color scheme)
  const mergedVars = {
    lgLightThemeVars: { ...baseTheme.themeVars.lgLightThemeVars, ...themeVars.lgLightThemeVars },
    lgDarkThemeVars: { ...baseTheme.themeVars.lgDarkThemeVars, ...themeVars.lgDarkThemeVars },
    mdLightThemeVars: { ...baseTheme.themeVars.mdLightThemeVars, ...themeVars.mdLightThemeVars },
    mdDarkThemeVars: { ...baseTheme.themeVars.mdDarkThemeVars, ...themeVars.mdDarkThemeVars },
    smLightThemeVars: { ...baseTheme.themeVars.smLightThemeVars, ...themeVars.smLightThemeVars },
    smDarkThemeVars: { ...baseTheme.themeVars.smDarkThemeVars, ...themeVars.smDarkThemeVars },
  }

  // Merge themeColors
  const mergedColors = {
    lightThemeColors: { ...baseTheme.themeColors.lightThemeColors, ...themeColors.lightThemeColors },
    darkThemeColors: { ...baseTheme.themeColors.darkThemeColors, ...themeColors.darkThemeColors },
  }

  // Get multi-step styles for each breakpoint/colorScheme combination
  const lgLightMultiStepStyle = getMultiStepStyleForBreakpoint('lg', 'light')
  const lgDarkMultiStepStyle = getMultiStepStyleForBreakpoint('lg', 'dark')
  const mdLightMultiStepStyle = getMultiStepStyleForBreakpoint('md', 'light')
  const mdDarkMultiStepStyle = getMultiStepStyleForBreakpoint('md', 'dark')
  const smLightMultiStepStyle = getMultiStepStyleForBreakpoint('sm', 'light')
  const smDarkMultiStepStyle = getMultiStepStyleForBreakpoint('sm', 'dark')

  // Helper function to merge form styles with multiStepStyle
  const mergeFormWithMultiStep = (baseForm, customForm, multiStepStyle) => {
    const formToUse = customForm || baseForm || {}
    // Merge multiStepStyle into form if it exists and is not empty
    if (multiStepStyle && Object.keys(multiStepStyle).length > 0) {
      return { ...formToUse, ...multiStepStyle }
    }
    return formToUse
  }

  // Merge styles (for custom themes that provide form/font overrides)
  const mergedStyles = {
    lgLightStyles: {
      theme: themeSlug, // Set to derived theme slug
      fieldsSize: customStyles.lgLightStyles?.fieldsSize || processedBaseStyles.lgLightStyles?.fieldsSize || 'medium',
      font: customStyles.lgLightStyles?.font || processedBaseStyles.lgLightStyles?.font || {},
      form: mergeFormWithMultiStep(
        processedBaseStyles.lgLightStyles?.form,
        customStyles.lgLightStyles?.form ? replaceObjectKeyWithNewId(customStyles.lgLightStyles.form, formId) : null,
        lgLightMultiStepStyle,
      ),
      fields: processedBaseStyles.lgLightStyles?.fields || {},
      confirmations: processedBaseStyles.lgLightStyles?.confirmations || [],
    },
    lgDarkStyles: {
      theme: themeSlug,
      fieldsSize: customStyles.lgDarkStyles?.fieldsSize || processedBaseStyles.lgDarkStyles?.fieldsSize || 'medium',
      font: customStyles.lgDarkStyles?.font || processedBaseStyles.lgDarkStyles?.font || {},
      form: mergeFormWithMultiStep(
        processedBaseStyles.lgDarkStyles?.form,
        customStyles.lgDarkStyles?.form ? replaceObjectKeyWithNewId(customStyles.lgDarkStyles.form, formId) : null,
        lgDarkMultiStepStyle,
      ),
      fields: processedBaseStyles.lgDarkStyles?.fields || {},
      confirmations: processedBaseStyles.lgDarkStyles?.confirmations || [],
    },
    mdLightStyles: {
      theme: themeSlug,
      fieldsSize: customStyles.mdLightStyles?.fieldsSize || processedBaseStyles.mdLightStyles?.fieldsSize || 'medium',
      font: customStyles.mdLightStyles?.font || processedBaseStyles.mdLightStyles?.font || {},
      form: mergeFormWithMultiStep(
        processedBaseStyles.mdLightStyles?.form,
        customStyles.mdLightStyles?.form ? replaceObjectKeyWithNewId(customStyles.mdLightStyles.form, formId) : null,
        mdLightMultiStepStyle,
      ),
      fields: processedBaseStyles.mdLightStyles?.fields || {},
      confirmations: processedBaseStyles.mdLightStyles?.confirmations || [],
    },
    mdDarkStyles: {
      theme: themeSlug,
      fieldsSize: customStyles.mdDarkStyles?.fieldsSize || processedBaseStyles.mdDarkStyles?.fieldsSize || 'medium',
      font: customStyles.mdDarkStyles?.font || processedBaseStyles.mdDarkStyles?.font || {},
      form: mergeFormWithMultiStep(
        processedBaseStyles.mdDarkStyles?.form,
        customStyles.mdDarkStyles?.form ? replaceObjectKeyWithNewId(customStyles.mdDarkStyles.form, formId) : null,
        mdDarkMultiStepStyle,
      ),
      fields: processedBaseStyles.mdDarkStyles?.fields || {},
      confirmations: processedBaseStyles.mdDarkStyles?.confirmations || [],
    },
    smLightStyles: {
      theme: themeSlug,
      fieldsSize: customStyles.smLightStyles?.fieldsSize || processedBaseStyles.smLightStyles?.fieldsSize || 'medium',
      font: customStyles.smLightStyles?.font || processedBaseStyles.smLightStyles?.font || {},
      form: mergeFormWithMultiStep(
        processedBaseStyles.smLightStyles?.form,
        customStyles.smLightStyles?.form ? replaceObjectKeyWithNewId(customStyles.smLightStyles.form, formId) : null,
        smLightMultiStepStyle,
      ),
      fields: processedBaseStyles.smLightStyles?.fields || {},
      confirmations: processedBaseStyles.smLightStyles?.confirmations || [],
    },
    smDarkStyles: {
      theme: themeSlug,
      fieldsSize: customStyles.smDarkStyles?.fieldsSize || processedBaseStyles.smDarkStyles?.fieldsSize || 'medium',
      font: customStyles.smDarkStyles?.font || processedBaseStyles.smDarkStyles?.font || {},
      form: mergeFormWithMultiStep(
        processedBaseStyles.smDarkStyles?.form,
        customStyles.smDarkStyles?.form ? replaceObjectKeyWithNewId(customStyles.smDarkStyles.form, formId) : null,
        smDarkMultiStepStyle,
      ),
      fields: processedBaseStyles.smDarkStyles?.fields || {},
      confirmations: processedBaseStyles.smDarkStyles?.confirmations || [],
    },
  }

  return {
    themeColors: mergedColors,
    themeVars: mergedVars,
    styles: mergedStyles,
  }
}

function applyFieldOverrides(baseStyles, overrides, fieldsArr, themeSlug) {
  // Deep clone base styles to avoid mutation
  const newStyles = JSON.parse(JSON.stringify(baseStyles))

  fieldsArr.forEach(([fieldKey, fieldData]) => {
    const fieldType = fieldData.typ

    // Check if this built-in theme has an override for this field type
    if (overrides[fieldType]) {
      const overrideStyleFunction = overrides[fieldType]

      // Get parameters from field data
      const params = {
        fk: fieldKey,
        type: fieldType,
        breakpoint: 'lg',
        colorScheme: 'light',
        fldPrefix: !!fieldData.prefixIcn,
        fldSuffix: !!fieldData.suffixIcn,
        direction: 'ltr', // default, can be enhanced
      }

      // Get override styles for this field
      const overriddenClasses = overrideStyleFunction(params)

      // Update field styles with overridden version for lgLightStyles
      if (newStyles.lgLightStyles?.fields?.[fieldKey] && overriddenClasses) {
        newStyles.lgLightStyles.fields[fieldKey] = {
          ...newStyles.lgLightStyles.fields[fieldKey],
          classes: overriddenClasses,
          theme: themeSlug,
        }
      }
    }
  })

  return newStyles
}

/**
 * Get a single field's style for a specific theme
 * This is a helper function for components that need field-specific styling
 * without generating styles for all fields in a form.
 *
 * @param {string} themeSlug - The theme to use ('bitformLegacy', 'bitformDefault', 'atlassian', 'noStyle', etc.)
 * @param {string} fieldKey - The field key (e.g., 'b123-1')
 * @param {string} fieldType - The field type (e.g., 'text', 'button', 'select')
 * @param {Object} options - Additional options
 * @param {string} options.breakpoint - Breakpoint ('lg', 'md', 'sm')
 * @param {string} options.colorScheme - Color scheme ('light', 'dark')
 * @param {string} options.direction - Text direction ('ltr', 'rtl')
 * @param {boolean} options.fldPrefix - Whether field has prefix icon
 * @param {boolean} options.fldSuffix - Whether field has suffix icon
 * @param {Object} options.buttonOptions - Button-specific options { btnTyp, align, fulW, txtAlign }
 * @param {Object} customThemes - Custom theme configurations { [slug]: {...} }
 * @returns {Object} Field style object with classes, theme, and fieldType
 */
export function getSingleFieldStyle(
  themeSlug,
  fieldKey,
  fieldType,
  options = {},
  customThemes = {},
) {
  const {
    breakpoint = 'lg',
    colorScheme = 'light',
    direction = 'ltr',
    fldPrefix = false,
    fldSuffix = false,
    buttonOptions = {},
  } = options

  // Check if it's a derived theme (built-in or custom)
  const allDerivedThemes = { ...derivedThemes, ...customThemes }
  const isDerivedTheme = !!allDerivedThemes[themeSlug]
  const isBaseTheme = !!baseThemes[themeSlug]

  // If it's a base theme, call the theme function directly
  if (isBaseTheme) {
    const themeFunction = baseThemes[themeSlug]
    return themeFunction({
      type: fieldType,
      fieldKey,
      breakpoint,
      colorScheme,
      direction,
      textOptions: { fldPrefix, fldSuffix },
      buttonOptions,
    })
  }

  // If it's a derived theme, we need to:
  // 1. Get the base theme's field style
  // 2. Apply field overrides if they exist
  if (isDerivedTheme) {
    const derivedConfig = allDerivedThemes[themeSlug]
    const { basedOn, fieldOverrides = {} } = derivedConfig

    // Get base theme field style
    const baseFieldStyle = getSingleFieldStyle(
      basedOn,
      fieldKey,
      fieldType,
      options,
      customThemes,
    )

    // Check if this field type has an override
    if (fieldOverrides[fieldType]) {
      const overrideStyleFunction = fieldOverrides[fieldType]

      // Get override styles for this field
      const overrideParams = {
        fk: fieldKey,
        type: fieldType,
        breakpoint,
        colorScheme,
        fldPrefix,
        fldSuffix,
        direction,
        ...buttonOptions,
      }

      const overriddenClasses = overrideStyleFunction(overrideParams)

      // Merge override classes with base style
      if (overriddenClasses && Object.keys(overriddenClasses).length > 0) {
        return {
          ...baseFieldStyle,
          classes: overriddenClasses,
          theme: themeSlug, // Set theme to the derived theme slug
        }
      }
    }

    // No override exists, return base style with derived theme slug
    return {
      ...baseFieldStyle,
      theme: themeSlug,
    }
  }

  // Fallback to bitformLegacy if theme not found
  if (baseThemes.bitformLegacy) {
    const fallbackStyle = baseThemes.bitformLegacy({
      type: fieldType,
      fieldKey,
      breakpoint,
      colorScheme,
      direction,
      textOptions: { fldPrefix, fldSuffix },
      buttonOptions,
    })
    return {
      ...fallbackStyle,
      theme: themeSlug, // Keep original theme slug even in fallback
    }
  }

  // Ultimate fallback - return empty style object
  return {
    theme: themeSlug,
    fieldType,
    classes: {},
  }
}
