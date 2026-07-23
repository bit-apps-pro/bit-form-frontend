import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
// import { $fields } from '../../../../GlobalStates/GlobalStates'
import { $fields } from '../../../GlobalStates/GlobalStates'
import { $styles } from '../../../GlobalStates/StylesState'
import { $themeColors } from '../../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../../GlobalStates/ThemeVarsState'
import {
  addToBuilderHistory,
  deleteNestedObj,
  generateHistoryData,
  getLatestState,
} from '../../../Utils/FormBuilderHelper'
import {
  staticFontStyleVariants,
  staticFontweightVariants
} from '../../../Utils/StaticData/fontvariant'
import {
  arrayToObject,
  assignNestedObj,
  getNumFromStr,
  getStrFromStr,
  getValueByObjPath,
  getValueFromStateVar,
  unitConverter,
} from '../../style-new/styleHelpers'

/**
 * Hook for managing style state and getting necessary data
 */
export const useStyleState = (fldKey: string) => {
  const [styles, setStyles] = useAtom($styles)
  const themeVars = useAtomValue($themeVars)
  const themeColors = useAtomValue($themeColors)
  const fields = useAtomValue($fields)

  const fieldObj = fields[fldKey]
  const fldStyleObj = styles?.fields?.[fldKey]

  const fontweightVariants =
    styles.font?.fontWeightVariants.length !== 0
      ? arrayToObject(styles.font?.fontWeightVariants)
      : staticFontweightVariants

  const fontStyleVariants =
    styles.font?.fontStyle.length !== 0
      ? arrayToObject(styles.font?.fontStyle)
      : staticFontStyleVariants

  return {
    styles,
    setStyles,
    themeVars,
    themeColors,
    fields,
    fieldObj,
    fldStyleObj,
    fontweightVariants,
    fontStyleVariants,
  }
}

/**
 * Hook for generating property paths
 */
export const usePropertyPath = (fldKey: string, elementKey: string) => {
  const getPropertyPath = (cssProperty: string, state = '', selector = '') => {
    return `fields->${fldKey}->classes->.${fldKey}-${elementKey}${state}${selector}->${cssProperty}`
  }

  const existImportant = (path: string, styles: any) => {
    return getValueByObjPath(styles, path).match(/(!important)/gi)?.[0]
  }

  return { getPropertyPath, existImportant }
}

/**
 * Hook for handling style updates
 */
export const useStyleHandlers = (
  fldKey: string,
  elementKey: string,
  styles: any,
  setStyles: any,
  themeVars: any
) => {
  const { getPropertyPath, existImportant } = usePropertyPath(fldKey, elementKey)

  const updateHandler = (
    value: number,
    unit: string,
    styleUnit: string,
    property: string,
    state = ''
  ) => {
    if (styleUnit?.match(/(undefined)/gi)?.[0]) {
      styleUnit = styleUnit?.replace(/(undefined)/gi, '')
    }

    const convertvalue = unitConverter(unit, value, styleUnit)
    const propertyPath = getPropertyPath(property, state)

    setStyles((prvStyle: any) =>
      create(prvStyle, (drft: any) => {
        const preValue = getValueByObjPath(drft, propertyPath)
        const isAlreadyImportant = preValue?.match(/(!important)/gi)?.[0]
        let v = `${convertvalue}${unit}`
        if (isAlreadyImportant) v = `${v} !important`
        assignNestedObj(drft, propertyPath, v)
      })
    )
  }

  const spacingHandler = (
    { value, unit }: { value: number; unit: string },
    prop: string,
    prvUnit: string,
    state = ''
  ) => {
    const convertvalue = unitConverter(unit, value, prvUnit)
    let v = `${convertvalue}${unit}`
    const checkExistImportant = existImportant(getPropertyPath(prop, state), styles)
    if (checkExistImportant) v += ' !important'

    setStyles((prvStyle: any) =>
      create(prvStyle, (drftStyle: any) => {
        assignNestedObj(drftStyle, getPropertyPath(prop, state), v)
      })
    )

    addToBuilderHistory(
      generateHistoryData(elementKey, fldKey, prop, v, {
        styles: getLatestState('styles'),
      })
    )
  }

  const preDefinedValueHandler = (value: string, property: string, state = '') => {
    setStyles((prvStyle: any) =>
      create(prvStyle, (drftStyle: any) => {
        const checkExistImportant = existImportant(getPropertyPath(property, state), styles)
        if (checkExistImportant) value += ' !important'
        assignNestedObj(drftStyle, getPropertyPath(property, state), value)
      })
    )

    addToBuilderHistory(
      generateHistoryData(elementKey, fldKey, property, value, {
        styles: getLatestState('styles'),
      })
    )
  }

  const fontPropertyUpdateHandler = (property: string, val: string, state = '') => {
    setStyles((prvStyle: any) =>
      create(prvStyle, (drft: any) => {
        let v = val
        const checkExistImportant = existImportant(getPropertyPath(property, state), styles)
        if (checkExistImportant) v += ' !important'
        assignNestedObj(drft, getPropertyPath(property, state), v)
      })
    )

    addToBuilderHistory(
      generateHistoryData(elementKey, fldKey, property, val, {
        styles: getLatestState('styles'),
      })
    )
  }

  const setAlign = (alignValue: string) => {
    setStyles((prvStyle: any) =>
      create(prvStyle, (drft: any) => {
        drft.fields[fldKey].classes[`.${fldKey}-${elementKey}`]['text-align'] = alignValue
      })
    )
  }

  const delPropertyHandler = (property: string, state = '') => {
    setStyles((prvStyle: any) =>
      create(prvStyle, (drft: any) => {
        deleteNestedObj(drft, getPropertyPath(property, state))
      })
    )

    addToBuilderHistory(
      generateHistoryData(elementKey, fldKey, `${property} Deleted`, '', {
        styles: getLatestState('styles'),
      })
    )
  }

  const delMultiPropertyHandler = (propertyPaths: string[], state = '') => {
    setStyles((prvStyle: any) =>
      create(prvStyle, (drft: any) => {
        propertyPaths.forEach((propertyPath) => {
          deleteNestedObj(drft, propertyPath)
        })
      })
    )

    addToBuilderHistory(
      generateHistoryData(elementKey, fldKey, `${propertyPaths[0]} Deleted`, '', {
        styles: getLatestState('styles'),
      })
    )
  }

  const clearHandler = (property: string, state = '') => {
    setStyles((prvStyle: any) =>
      create(prvStyle, (drft: any) => {
        assignNestedObj(drft, getPropertyPath(property, state), '')
      })
    )

    addToBuilderHistory(
      generateHistoryData(elementKey, fldKey, `${property} Clear`, '', {
        styles: getLatestState('styles'),
      })
    )
  }

  const getStyleValueAndUnit = (prop: string, classes: any, elementKey: string): [number, string] => {
    const getVlu = classes[`.${fldKey}-${elementKey}`]?.[prop]
    const themeVal = getValueFromStateVar(themeVars, getVlu?.replace('!important', ''))
    const value = getNumFromStr(themeVal) || 0
    const unit = getStrFromStr(themeVal)
    return [value, unit]
  }

  return {
    updateHandler,
    spacingHandler,
    preDefinedValueHandler,
    fontPropertyUpdateHandler,
    setAlign,
    delPropertyHandler,
    delMultiPropertyHandler,
    clearHandler,
    getStyleValueAndUnit,
  }
}

/**
 * Hook for getting pseudo class paths
 */
export const usePseudoPath = (fldKey: string) => {
  const getPseudoPath = (elementKey: string, state = ''): string => {
    state = state.toLowerCase()

    switch (elementKey) {
      case 'dpd-fld-wrp':
      case 'currency-fld-wrp':
      case 'phone-fld-wrp':
      case 'country-fld-wrp':
        if (state === 'hover') return ':hover:not(.menu-open):not(.disabled)'
        if (state === 'focus') return ':focus-within:not(.menu-open):not(.disabled)'
        if (state === 'active') return '.menu-open'
        break

      case 'dpd-wrp':
      case 'search-clear-btn':
        if (state === 'focus') return ':focus-visible'
        break

      case 'option':
        if (state === 'hover') return ':hover:not(.selected-opt)'
        if (state === 'focus') return ':focus-visible'
        break

      case 'input-clear-btn':
        if (state === 'hover') return ':hover'
        if (state === 'focus') return ':focus-visible'
        break

      case 'razorpay-btn':
        if (state === 'before') return '::before'
        break

      case 'stripe-btn':
      case 'stripe-wrp .stripe-pay-btn':
      case 'mollie-btn':
        if (state === 'active') return ':active'
        if (state === 'hover') return ':hover'
        if (state === 'focus') return ':focus-visible'
        break

      case 'rating-img':
        if (state === 'hover') return `.${fldKey}-rating-hover`
        if (state === 'selected') return `.${fldKey}-rating-selected`
        break

      case 'image-select':
        if (state === 'hover') return `:hover~.${fldKey}-img-wrp .${fldKey}-img-card-wrp`
        if (state === 'checked') return `:checked~.${fldKey}-img-wrp .${fldKey}-img-card-wrp`
        if (state === 'focus') return `:focus~.${fldKey}-img-wrp .${fldKey}-img-card-wrp`
        break

      default:
        if (state) return `:${state}`
    }

    return state
  }

  return { getPseudoPath }
}

/**
 * Hook for extracting CSS property values
 */
export const useCssPropertyValues = (
  existCssPropsObj: Record<string, any>,
  themeVars: any
) => {
  const extractValueAndUnit = (propertyKey: string): [number, string] => {
    const value = getNumFromStr(
      getValueFromStateVar(themeVars, existCssPropsObj?.[propertyKey])
    )
    const unit = getStrFromStr(
      getValueFromStateVar(themeVars, existCssPropsObj?.[propertyKey])
    )
    return [value, unit]
  }

  return { extractValueAndUnit }
}