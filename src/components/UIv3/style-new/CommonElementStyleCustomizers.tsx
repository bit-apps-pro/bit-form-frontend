/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useCallback, useMemo, useState } from 'react'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import { $styles } from '../../../GlobalStates/StylesState'
import { $themeColors } from '../../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../../GlobalStates/ThemeVarsState'
import ut from '../../../styles/2.utilities'
import {
  addToBuilderHistory,
  deleteNestedObj,
  generateHistoryData,
  getLatestState,
} from '../../../Utils/FormBuilderHelper'
import { ucFirst } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import AsteriskCustomizer from '../../style-new/AsteriskCustomizer'
import ButtonCustomizer from '../../style-new/ButtonCustomizer'
import CssPropertyList from '../../style-new/CssPropertyList'
import ErrorMessagesCustomizer from '../../style-new/ErrorMessagesCustomizer'
import FieldContainerCustomizer from '../../style-new/FieldContainerCustomizer'
import HelperTextCustomizer from '../../style-new/HelperTextCustomizer'
import IcnCustomizer from '../../style-new/IcnCustomizer'
import InputCustomizer from '../../style-new/InputCustomizer'
import LabelContainerCustomizer from '../../style-new/LabelContainerCustomizer'
import LabelCustomizer from '../../style-new/LabelCustomizer'
import elementCssPropertiesConfig from '../../style-new/NewStyleEditorConfig'
import {
  addableCssPropsByField,
  assignNestedObj,
  extractCssVarName,
  generateDynamicCssVar,
  getExistingCssPropsWithCompounds,
  isColorProperty,
  isDynamicCssVar,
  propagateCssVarToFields,
  removeDynamicCssVarFromFields,
} from '../../style-new/styleHelpers'
import SubTitleCustomizer from '../../style-new/SubTitleCustomizer'
import { getSingleFieldStyle } from '../../style-new/themes/themeProvider'
import TabsView from '../Utilities/TabsView'
import PropertiesList from './PropertiesList'

interface CommonElementStyleCustomizersProps {
  element: string
  componentTitle: string
}

export default function CommonElementStyleCustomizers({ element, componentTitle }: CommonElementStyleCustomizersProps) {
  const { css } = useFela()
  const { fieldKey, formID, formType } = useParams()
  const navigate = useNavigate()
  const [styles, setStyles] = useAtom($styles)
  const themeColors = useAtomValue($themeColors)
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const setThemeColors = useSetAtom($themeColors)
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState('')

  const elementSelectorCls = element.startsWith('_frm') ? `.${element}-b${formID}` : `.b${formID}-${element}`
  const currentStateSelector = state ? `${elementSelectorCls}:${state.toLowerCase()}` : elementSelectorCls
  const formWrpStylesObj = styles.form?.[currentStateSelector] || {}
  const formWrpStylesPropertiesArr = Object.keys(formWrpStylesObj)
  const normalStateStaticProperties = getNormalStateStaticProperties(element)

  // Get existing CSS properties with compound properties added
  const existCssProps = useMemo(() =>
    getExistingCssPropsWithCompounds(formWrpStylesObj, '', element),
    [formWrpStylesObj, element]
  )

  // Get available CSS properties that haven't been added yet
  const availableCssPropsForState = addableCssPropsByField('', element)?.filter(
    x => !existCssProps.includes(x)
  )

  // Get available states from config
  const availableStates = useMemo(
    () => elementCssPropertiesConfig[element]?.states || [],
    [element]
  )

  /**
   * Get the property path for a CSS property
   */
  const getPropertyPath = (cssProperty: string, state = ''): string => {
    const stateSelector = state ? `:${state.toLowerCase()}` : ''
    return `form->${elementSelectorCls}${stateSelector}->${cssProperty}`
  }

  /**
   * Helper function to get default field style for a specific field
   * Uses getSingleFieldStyle to get the theme's default styling
   */
  const getDefaultFieldStyle = (fldKey: string, fieldType: string) => {
    const theme = styles?.theme || 'bitformDefault'
    return getSingleFieldStyle(theme, fldKey, fieldType, {
      breakpoint: 'lg',
      colorScheme: 'light',
      direction: 'ltr',
    })
  }

  /**
   * Delete a CSS property
   * If the property has a dynamic CSS variable, removes it from themeColors/themeVars
   * and restores default theme values for all non-overridden field elements
   */
  const delPropertyHandler = (property: string | string[], state = '') => {
    const properties = Array.isArray(property) ? property : [property]

    // First, check each property for dynamic CSS variables and handle them
    properties.forEach((prop) => {
      const stateSelector = state ? `:${state.toLowerCase()}` : ''
      const formSelector = `${elementSelectorCls}${stateSelector}`
      const currentValue = styles.form?.[formSelector]?.[prop]

      // Check if the value is a dynamic CSS variable
      const varName = extractCssVarName(currentValue)
      if (varName && isDynamicCssVar(varName)) {
        // Remove the variable from themeColors or themeVars
        const isColor = isColorProperty(prop)
        if (isColor) {
          setThemeColors((prvThemeColors: Record<string, string>) =>
            create(prvThemeColors, (drft: Record<string, string>) => {
              delete drft[varName]
            })
          )
        } else {
          setThemeVars((prvThemeVars: Record<string, string>) =>
            create(prvThemeVars, (drft: Record<string, string>) => {
              delete drft[varName]
            })
          )
        }
      }
    })

    // Now update styles - remove from form class and restore defaults in field elements
    setStyles((prvStyles: any) =>
      create(prvStyles, (drft: any) => {
        properties.forEach((prop) => {
          // Delete from form common class
          deleteNestedObj(drft, getPropertyPath(prop, state))

          // Restore default theme values for all non-overridden field elements
          removeDynamicCssVarFromFields(drft, element, state, prop, getDefaultFieldStyle)
        })
      })
    )

    const propertyName = properties[0]
    addToBuilderHistory(
      generateHistoryData(
        element,
        fieldKey,
        `Delete ${propertyName}${state ? ` (${state})` : ''}`,
        '',
        {
          styles: getLatestState('styles'),
          themeVars: getLatestState('themeVars'),
          themeColors: getLatestState('themeColors'),
        }
      )
    )
  }

  /**
   * Add a new CSS property with dynamic CSS variable generation and propagation
   * This creates a CSS variable in themeColors/themeVars and propagates it to all
   * non-overridden field elements for consistency between theme and individual styles.
   */
  const setNewCssProp = (prop: string, state = '') => {
    // Get the config for this property
    const configProperty = elementCssPropertiesConfig[element]?.properties?.[prop]
    const isCompoundProperty = typeof configProperty === 'object'

    // Handle compound properties (like 'border' with sub-properties)
    if (isCompoundProperty) {
      const subProperties = Object.keys(configProperty)
      subProperties.forEach((subProp) => {
        addCssPropertyWithVariable(subProp, state)
      })
    } else {
      addCssPropertyWithVariable(prop, state)
    }

    addToBuilderHistory(
      generateHistoryData(element, fieldKey, prop, '', {
        styles: getLatestState('styles'),
        themeVars: getLatestState('themeVars'),
        themeColors: getLatestState('themeColors'),
      })
    )
  }

  /**
   * Add a single CSS property with dynamic CSS variable
   */
  const addCssPropertyWithVariable = (prop: string, state = '') => {
    // Step 1: Generate dynamic CSS variable name
    const cssVarName = generateDynamicCssVar(element, state, prop)

    // Step 2: Determine if this is a color property
    const isColor = isColorProperty(prop)

    // Step 3: Add the variable to the appropriate state (themeColors or themeVars)
    // with empty default value
    if (isColor) {
      setThemeColors((prvThemeColors: Record<string, string>) =>
        create(prvThemeColors, (drft: Record<string, string>) => {
          drft[cssVarName] = ''
        })
      )
    } else {
      setThemeVars((prvThemeVars: Record<string, string>) =>
        create(prvThemeVars, (drft: Record<string, string>) => {
          drft[cssVarName] = ''
        })
      )
    }

    // Step 4: Add the variable reference to form common class
    const varReference = `var(${cssVarName})`
    setStyles((prvStyles: any) =>
      create(prvStyles, (drft: any) => {
        // Add variable reference to form common class
        assignNestedObj(drft, getPropertyPath(prop, state), varReference)

        // Step 5: Propagate the variable reference to all non-overridden field elements
        propagateCssVarToFields(drft, element, state, prop, cssVarName)
      })
    )
  }

  /**
   * Clear a CSS property (set to empty string)
   */
  const clearHandler = (property: string | string[], state = '') => {
    setStyles((prvStyle) =>
      create(prvStyle, (drft) => {
        if (Array.isArray(property)) {
          property.forEach((prop) => assignNestedObj(drft, getPropertyPath(prop, state), ''))
        } else {
          assignNestedObj(drft, getPropertyPath(property, state), '')
        }
      })
    )

    const propertyName = Array.isArray(property) ? property[0] : property
    addToBuilderHistory(
      generateHistoryData(
        element,
        fieldKey,
        `${propertyName} Clear${state ? ` (${state})` : ''}`,
        '',
        { styles: getLatestState('styles') }
      )
    )
  }

  const getNormalStateStaticContent = useCallback(() => {
    return (<>
      {element === 'fld-wrp' && <FieldContainerCustomizer />}
      {element === 'lbl-wrp' && <LabelContainerCustomizer />}
      {element === 'lbl' && <LabelCustomizer />}
      {element === 'sub-titl' && <SubTitleCustomizer />}
      {element === 'fld' && <InputCustomizer />}
      {element === 'hlp-txt' && <HelperTextCustomizer />}
      {element === 'err-msg' && <ErrorMessagesCustomizer />}
      {element === 'btn' && <ButtonCustomizer />}
      {element.match(/(pre-i|suf-i)/gi)?.[0] && <IcnCustomizer elementKey={element} />}
      {element === 'req-smbl' && <AsteriskCustomizer />}

    </>)
  }, [element])

  /**
   * Render content for a specific state
   */
  const renderStateContent = (state = '') => {
    const stateSelector = state ? `:${state.toLowerCase()}` : ''
    const currentStylesObj = styles.form?.[`${elementSelectorCls}${stateSelector}`]
    const currentPropertiesArr = getExistingCssPropsWithCompounds(currentStylesObj || {}, '', element)

    return (
      <>
        {!state && getNormalStateStaticContent()}
        <PropertiesList
          currentPropertiesArr={currentPropertiesArr}
          element={element}
          componentTitle={componentTitle}
          state={state}
          formID={formID!}
          fieldKey={fieldKey}
          getPropertyPath={getPropertyPath}
          deletePropertyHandler={delPropertyHandler}
          clearHandler={clearHandler}
        />
      </>
    )
  }

  /**
   * Generate tabs for different states
   */
  const tabs = useMemo(
    () => [
      { id: 'normal', label: __('Normal'), content: renderStateContent() },
      ...availableStates.map((otherState) => ({
        id: otherState.toLowerCase(),
        label: __(ucFirst(otherState)),
        content: renderStateContent(otherState),
      })),
    ],
    [availableStates, styles.form, elementSelectorCls, themeVars, themeColors] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={css(ut.ml2, { pn: 'relative' })}>
      {/* Loading indicator */}
      {/* {formWrpStylesPropertiesArr.length === 0 && isLoading && (
        <LoaderSm size={50} clr="#006aff" className="ml-2" />
      )} */}

      {/* Tabs for different states */}
      <TabsView
        tabs={tabs}
        defaultTab="normal"
        onChange={(tabId) => setState(tabId === 'normal' ? '' : tabId)}
        // variant="clean-bottom-line"
        variant='tertiary-segment'
        classNames={css({ '& .tab-content': { ow: 'visible' } })}
      />

      {/* Add new CSS properties */}
      {availableCssPropsForState.length > 0 && (
        <CssPropertyList
          id={`${element}-prop${state ? `-${state}` : ''}`}
          properties={availableCssPropsForState}
          setProperty={(prop) => setNewCssProp(prop, state)}
        />
      )}
    </div>
  )
}

const getNormalStateStaticProperties = (element: string): string[] => {
  switch (element) {
    case 'fld-wrp':
      return ['background', 'border', 'margin', 'padding', 'box-shadow']
    case 'lbl-wrp':
      return ['background-color', 'border', 'margin', 'padding', 'box-shadow']
    case 'lbl':
      return ['background-color', 'border', 'font-size', 'font-style', 'font-weight', 'color', 'margin', 'padding', 'box-shadow']
    case 'sub-titl':
      return ['font-size', 'font-weight', 'color', 'margin', 'padding']
    case 'fld':
      return ['font-size', 'font-weight', 'color', 'background-color', 'border', 'border-radius', 'padding', 'margin']
    case 'hlp-txt':
      return ['font-size', 'color', 'margin', 'padding']
    case 'err-msg':
      return ['font-size', 'color', 'margin', 'padding']
    case 'btn':
      return ['font-size', 'font-weight', 'color', 'background', 'border', 'border-radius', 'padding', 'margin', 'box-shadow']
    default:
      if (element.match(/(pre-i|suf-i)/gi)) {
        return ['border', 'color', 'color(filter)', 'margin', 'padding', 'box-shadow', 'height', 'width', 'filter']
      }
      return []
  }
}
