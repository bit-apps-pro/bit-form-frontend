import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import React from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $styles } from '../../../GlobalStates/StylesState'
import { $themeColors } from '../../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../../GlobalStates/ThemeVarsState'
import { addToBuilderHistory, deleteNestedObj, generateHistoryData, getLatestState } from '../../../Utils/FormBuilderHelper'
import { ucFirst } from '../../../Utils/Helpers'
import BackgroundControl from '../../style-new/BackgroundControl'
import BorderControl from '../../style-new/BorderControl'
import IndividualShadowControl from '../../style-new/IndividualShadowControl'
import elementCssPropertiesConfig from '../../style-new/NewStyleEditorConfig'
import OutlineControl from '../../style-new/OutlineControl'
import ResetStyle from '../../style-new/ResetStyle'
import SimpleColorPicker from '../../style-new/SimpleColorPicker'
import SpacingControl from '../../style-new/SpacingControl'
import { assignNestedObj, getValueFromStateVar, isColorProperty } from '../../style-new/styleHelpers'
import StylePropertyBlock from '../../style-new/StylePropertyBlock'
import TransitionControl from '../../style-new/TransitionControl'
import { getPropertyControl, PropertyFactoryContext } from './PropertyControlFactory'
import { useStyleState } from './styleCustomizationHooks'

// Types
export interface PropertiesListProps {
  currentPropertiesArr: string[]
  element: string
  componentTitle: string
  state?: string
  formID: string
  fieldKey?: string
  getPropertyPath?: (cssProperty: string, state?: string) => string
  deletePropertyHandler?: (property: string | string[], state?: string) => void
  clearHandler?: (property: string | string[], state?: string) => void
}

interface ObjectPaths {
  object: string
  paths: Record<string, string>
}

/**
 * Helper to extract CSS variable name from a var() reference
 * @param value - The CSS value that might be a var() reference
 * @returns The variable name (e.g., '--bf-fld-hover-color') or null if not a var() reference
 */
const extractCssVarName = (value: string | undefined): string | null => {
  if (!value) return null
  const match = value.match(/var\(([^)]+)\)/)
  return match ? match[1].trim() : null
}


const PropertiesList: React.FC<PropertiesListProps> = ({
  currentPropertiesArr,
  element,
  componentTitle,
  state = '',
  formID,
  getPropertyPath,
  deletePropertyHandler,
  clearHandler,
}) => {
  const { css } = useFela()
  const { fieldKey, formType } = useParams()
  const [styles, setStyles] = useAtom($styles)
  const themeColors = useAtomValue($themeColors) as Record<string, string>
  const themeVars = useAtomValue($themeVars) as Record<string, string>
  // const elemn = `.${element}-b${formID}`
  const elemn = element.startsWith('_frm') ? `.${element}-b${formID}` : `.b${formID}-${element}`
  // console.log('elemn in PropertiesList:', elemn)
  const stateSelector = state ? `:${state.toLowerCase()}` : ''
  const currentStylesObj = styles.form?.[`${elemn}${stateSelector}`]
  const { fontweightVariants, fontStyleVariants } = useStyleState(fieldKey || '')
  console.log('currentStylesObj', currentStylesObj)

  /**
   * Get the state object name and property path for a CSS property
   * If the property value is a CSS variable reference, returns info to update the variable
   * @param prop - The CSS property name
   * @returns Object with stateObjName, propertyPath, and whether it's a variable
   */
  const getPropertyTarget = (prop: string): {
    stateObjName: string
    propertyPath: string
    isVariable: boolean
    resolvedValue: string
    stylesPropertyPath?: string  // Path to styles property for !important on CSS variables
  } => {
    const styleValue = currentStylesObj?.[prop]
    const varName = extractCssVarName(styleValue)

    if (varName) {
      // Value is a CSS variable reference - update the variable
      const isColor = isColorProperty(prop)
      const resolvedValue = isColor
        ? (themeColors[varName] || '')
        : (themeVars[varName] || '')

      return {
        stateObjName: isColor ? 'themeColors' : 'themeVars',
        propertyPath: varName,
        isVariable: true,
        resolvedValue,
        stylesPropertyPath: handleGetPropertyPath(prop, state),  // Path for !important
      }
    }

    // Not a variable reference - update styles directly
    return {
      stateObjName: 'styles',
      propertyPath: handleGetPropertyPath(prop, state),
      isVariable: false,
      resolvedValue: styleValue || '',
    }
  }

  /**
   * Build object paths for a given property
   */
  const buildObjectPaths = (prop: string): ObjectPaths => {
    const objPaths: ObjectPaths = {
      object: 'styles',
      paths: {},
    }

    const configProperty = elementCssPropertiesConfig[element]?.properties?.[prop]
    let propertyKeys = [prop]

    if (typeof configProperty === 'object') {
      propertyKeys = Object.keys(configProperty)
      propertyKeys.forEach(propName => {
        objPaths.paths[propName] = handleGetPropertyPath(propName, state)
      })
    } else {
      objPaths.paths[prop] = handleGetPropertyPath(prop, state)
    }

    return objPaths
  }

  /**
   * Get the state suffix for titles
   */
  const getStateSuffix = (): string => {
    return state ? ` (${ucFirst(state)})` : ''
  }

  /**
   * Get the property path for a CSS property
   */
  const handleGetPropertyPath = (cssProperty: string, state = ''): string => {
    if (getPropertyPath) {
      return getPropertyPath(cssProperty, state)
    }

    const stateSelector = state ? `:${state.toLowerCase()}` : ''
    return `form->${elemn}${stateSelector}->${cssProperty}`
  }

  /**
   * Delete a CSS property
   */
  const handleDeleteProperty = (property: string | string[], state = '') => {
    if (deletePropertyHandler) {
      deletePropertyHandler(property, state)
      return
    }

    setStyles((prvStyles) =>
      create(prvStyles, (drft) => {
        if (Array.isArray(property)) {
          property.forEach((prop) => deleteNestedObj(drft, handleGetPropertyPath(prop, state)))
        } else {
          deleteNestedObj(drft, handleGetPropertyPath(property, state))
        }
      })
    )

    const propertyName = Array.isArray(property) ? property[0] : property
    addToBuilderHistory(
      generateHistoryData(
        element,
        fieldKey,
        `Delete ${propertyName}${state ? ` (${state})` : ''}`,
        '',
        { styles: getLatestState('styles') }
      )
    )
  }

  /**
   * Clear a CSS property
   */
  const handleClear = (property: string | string[], state = '') => {
    if (clearHandler) {
      clearHandler(property, state)
      return
    }
    setStyles((prvStyles) =>
      create(prvStyles, (drft) => {
        if (Array.isArray(property)) {
          property.forEach((prop) => assignNestedObj(drft, handleGetPropertyPath(prop, state), ''))
        } else {
          assignNestedObj(drft, handleGetPropertyPath(property, state), '')
        }
      })
    )

    addToBuilderHistory(
      generateHistoryData(element, fieldKey, `Clear ${property}${state ? ` (${state})` : ''}`, '', {
        styles: getLatestState('styles'),
      })
    )
  }

  /**
   * Create a PropertyFactoryContext for centralized controls
   * This allows using getPropertyControl from PropertyControlFactory
   */
  const createPropertyContext = (prop: string): PropertyFactoryContext => {
    const propTarget = getPropertyTarget(prop)
    const objPaths = buildObjectPaths(prop)

    return {
      fldTitle: componentTitle,
      fldKey: fieldKey || '',
      existCssPropsObj: currentStylesObj || {},
      objectPaths: objPaths,
      themeColors,
      themeVars,
      styles,
      state,
      // CSS variable support
      stateObjName: propTarget.stateObjName as 'styles' | 'themeColors' | 'themeVars',
      resolvedValue: propTarget.resolvedValue,
      // Handlers
      delPropertyHandler: (property: string, st?: string) => handleDeleteProperty(property, st || state),
      delMultiPropertyHandler: (paths: string[], st?: string) => handleDeleteProperty(paths, st || state),
      clearHandler: (property: string, st?: string) => handleClear(property, st || state),
      // Placeholder handlers for props not used in theme customization
      spacingHandler: () => { },
      fontPropertyUpdateHandler: () => { },
      preDefinedValueHandler: () => { },
      setAlign: () => { },
      fldZIndexHandler: () => { },
      getStyleValueAndUnit: () => [0, 'px'],
      txtAlignValue: '',
      fldZIndex: 0,
      fontweightVariants: fontweightVariants,
      fontStyleVariants: fontStyleVariants,
    }
  }

  // Properties that can use the centralized PropertyControlFactory
  const centralizedProperties = ['background-color', 'accent-color']

  /**
   * Get the CSS property control component
   * Automatically detects CSS variable references and updates the variable instead of styles
   * Uses centralized getPropertyControl for compatible properties
   */
  const getCssPropertyControl = (prop: string): React.ReactElement | null => {
    const objPaths = buildObjectPaths(prop)
    const stateSuffix = '' // getStateSuffix()
    const stateId = state ? `-${state}` : ''

    // Get property target info (handles CSS variable detection)
    const propTarget = getPropertyTarget(prop)

    // Try centralized factory for compatible properties
    if (centralizedProperties.includes(prop)) {
      const context = createPropertyContext(prop)
      const control = getPropertyControl(prop, context)
      if (control) return control
    }

    const bgPropArr = [
      'background-image',
      'background-position',
      'background-repeat',
      'background-size',
      'backdrop-filter',
    ]

    switch (prop) {
      case 'background':
        return (
          <BackgroundControl
            title="Background"
            subtitle={`${componentTitle} Background${stateSuffix}`}
            value={getValueFromStateVar(
              themeColors,
              currentStylesObj?.['background-image'] || currentStylesObj?.background
            )}
            modalId={`${element}-cnr-bd${stateId}`}
            stateObjName={propTarget.stateObjName}
            objectPaths={objPaths}
            propertyPath={propTarget.isVariable ? propTarget.propertyPath : objPaths.paths.background}
            deleteable
            delPropertyHandler={() => handleDeleteProperty([...bgPropArr, 'background'], state)}
            clearHandler={() => handleClear(bgPropArr, state)}
            allowImportant
          />
        )

      case 'color':
        return (
          <SimpleColorPicker
            title="Text Color"
            subtitle={`${componentTitle} Color${stateSuffix}`}
            value={propTarget.isVariable ? propTarget.resolvedValue : getValueFromStateVar(themeColors, currentStylesObj?.color)}
            modalId={`${element}-cnr-clr${stateId}`}
            stateObjName={propTarget.stateObjName}
            propertyPath={propTarget.propertyPath}
            stylesPropertyPath={propTarget.stylesPropertyPath}
            deleteable
            delPropertyHandler={() => handleDeleteProperty('color', state)}
            clearHandler={() => handleClear('color', state)}
            allowImportant
            canSetVariable
          />
        )

      case 'padding':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => handleDeleteProperty('padding', state)}
            title={`Padding${stateSuffix}`}
          >
            <SpacingControl
              mainTitle="Padding"
              allowImportant
              action={{ type: 'spacing-control' }}
              subtitle={`${componentTitle} Padding${stateSuffix}`}
              objectPaths={objPaths}
              id={`${element}-paddn-ctrl${stateId}`}
            />
          </StylePropertyBlock>
        )

      case 'margin':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => handleDeleteProperty('margin', state)}
            title={`Margin${stateSuffix}`}
          >
            <SpacingControl
              mainTitle="Margin"
              allowImportant
              action={{ type: 'spacing-control' }}
              subtitle={`${componentTitle} Margin${stateSuffix}`}
              objectPaths={objPaths}
              id={`${element}-mrg-ctrl${stateId}`}
            />
          </StylePropertyBlock>
        )

      case 'box-shadow': {
        const shadowTarget = getPropertyTarget('box-shadow')
        return (
          <IndividualShadowControl
            title={`Box-shadow${stateSuffix}`}
            subtitle={`${componentTitle} Box Shadow${stateSuffix}`}
            value={shadowTarget.isVariable ? shadowTarget.resolvedValue : currentStylesObj?.['box-shadow']}
            modalId={`${element}-cnr-box-shd${stateId}`}
            stateObjName={shadowTarget.stateObjName}
            propertyPath={shadowTarget.propertyPath}
            deleteable
            delPropertyHandler={() => handleDeleteProperty('box-shadow', state)}
            clearHandler={() => handleClear('box-shadow', state)}
            allowImportant
          />
        )
      }

      case 'border':
        return (
          <StylePropertyBlock
            delPropertyHandler={() =>
              handleDeleteProperty(
                ['border', 'border-style', 'border-color', 'border-width', 'border-radius'],
                state
              )
            }
            title={`Border${stateSuffix}`}
          >
            <span className={css({ display: 'flex', alignItems: 'center' })}>
              <ResetStyle
                propertyPath={[String(Object.values(objPaths.paths))]}
                stateObjName="styles"
              />
              <BorderControl
                subtitle={`${componentTitle} Border${stateSuffix}`}
                objectPaths={objPaths}
                id={`${element}-bdr-ctrl${stateId}`}
              />
            </span>
          </StylePropertyBlock>
        )

      case 'outline':
        return (
          <StylePropertyBlock
            delPropertyHandler={() => handleDeleteProperty('outline', state)}
            title={`Outline${stateSuffix}`}
          >
            <ResetStyle
              propertyPath={[String(Object.values(objPaths.paths))]}
              stateObjName="styles"
              id={`fld-wrp-outline${stateId}`}
            />
            <OutlineControl
              allowImportant
              subtitle={`${componentTitle} Outline${stateSuffix}`}
              objectPaths={objPaths}
              id={`fld-wrp-cont-outline${stateId}`}
            />
          </StylePropertyBlock>
        )

      case 'transition': {
        const transitionTarget = getPropertyTarget('transition')
        return (
          <TransitionControl
            title={`Transition${stateSuffix}`}
            subtitle={`${componentTitle} Transition${stateSuffix}`}
            value={transitionTarget.isVariable ? transitionTarget.resolvedValue : currentStylesObj?.transition}
            modalId={`${element}-cnr-trnsn${stateId}`}
            stateObjName={transitionTarget.stateObjName}
            propertyPath={transitionTarget.propertyPath}
            deleteable
            delPropertyHandler={() => handleDeleteProperty('transition', state)}
            clearHandler={() => handleClear('transition', state)}
            allowImportant
          />
        )
      }

      default:
        // Try centralized factory for any other properties
        const context = createPropertyContext(prop)
        return getPropertyControl(prop, context)
    }
  }

  return (
    <div className={css({ mx: 10 })}>
      {currentPropertiesArr.map((prop, indx) => {
        const control = getCssPropertyControl(prop)

        if (!control) return null

        return (
          <div key={`css-property-${state || 'normal'}-${indx + 3 * 2}`}>
            {control}
          </div>
        )
      })}
    </div>
  )
}

export default PropertiesList