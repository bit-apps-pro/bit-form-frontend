/* eslint-disable no-useless-escape */
import deepCopy from './deepCopy'
import {
  expressAndCompressColors, expressCssVar, expressMultipleCalcFuncWithExt, isFloat, isQuadValueProp, isValidPropAndValue, normalizeSelector, optimizeQuadValue,
} from './utils'

export default function optimizeAndDefineCssClassProps(selectorObj, cssVarDefinations = {}, configs = {}) {
  const selectorsObj = deepCopy(selectorObj)
  const newSelectorObj = {}
  const { ignoreWithFallbackValues = {}, invalidPropValue = {} } = configs

  const selectors = Object.keys(selectorsObj)
  const selectorsCount = selectors.length
  for (let i = 0; i < selectorsCount; i += 1) {
    const selector = selectors[i]
    if (Object.hasOwnProperty.call(selectorsObj, selector)) {
      const declaration = selectorsObj[selector] || {}
      const newSelectors = normalizeSelector(selector).split(',')
      const props = Object.keys(declaration)
      const propsCount = props.length
      for (let j = 0; j < propsCount; j += 1) {
        const prop = props[j]
        if (Object.hasOwnProperty.call(declaration, prop)) {
          const newProp = prop.trim()
          let value = declaration[prop]

          if (typeof value === 'number') value = value.toString()
          if (isFloat(value)) {
            value = value.toString().replace(/(?:^0|,|\s*,\s*|\s)0*\./g, match => (match[0] !== '0' ? `${match[0]}.` : '.'))
          }
          if (value === undefined || value === null) value = ''
          let newValue = value
            ?.trim()
            .replace(/\s{2,}/g, ' ')
            .replace(/\\n\s*/g, '')
            .replace(/,\s*/g, ',')
            .replace(/(?:^0|,|\s*,\s*|\s)0*\./g, match => (match[0] !== '0' ? `${match[0]}.` : '.'))
            .replace(/\s+\!important/g, '!important')

          if (newValue.startsWith('var')) {
            const { value: val, isFallbackValue } = expressCssVar(newValue, cssVarDefinations)
            if (isFallbackValue
              && newProp in ignoreWithFallbackValues
              && ignoreWithFallbackValues[newProp] === val) {
              continue
            }
          }
          if (newValue.includes('var')) {
            ({ value: newValue } = expressCssVar(newValue, cssVarDefinations))
          }
          if (value.match(/calc/g)) {
            newValue = expressMultipleCalcFuncWithExt(newValue, cssVarDefinations)
          }
          if (newValue.match(/hsla?/g)) {
            newValue = expressAndCompressColors(newValue, cssVarDefinations)
          }
          if (isQuadValueProp(prop)) {
            newValue = optimizeQuadValue(newValue)
          }
          if (!isValidPropAndValue(newProp, newValue, invalidPropValue)) {
            continue
          }
          if (newValue === '' && newProp !== 'content') {
            continue
          }
          newSelectors.forEach(newSelector => {
            if (!newSelectorObj[newSelector]) {
              newSelectorObj[newSelector] = {}
            }
            newSelectorObj[newSelector][newProp] = newValue
          })
        }
      }
    }
  }

  return newSelectorObj
}
