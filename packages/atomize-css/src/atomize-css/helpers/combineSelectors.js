import { findSelectorBySamePropValue } from '../atomize-css'
import deepCopy from './deepCopy'

export default function combineSelectors(cssClassesObj) {
  const cssRulesObj = deepCopy(cssClassesObj)
  const combinedCssRulesObj = {}
  const selectors = Object.keys(cssRulesObj)
  const selectorsCount = selectors.length
  for (let i = 0; i < selectorsCount; i += 1) {
    const selector = selectors[i]
    if (!Object.prototype.hasOwnProperty.call(cssRulesObj, selector)) continue
    const definations = cssRulesObj[selector]
    const props = Object.keys(definations)
    const propsCount = props.length
    for (let j = 0; j < propsCount; j += 1) {
      const prop = props[j]
      if (!Object.prototype.hasOwnProperty.call(definations, prop)) continue
      const value = definations[prop]
      const sameProValSelectors = findSelectorBySamePropValue({
        targetProp: prop,
        targetValue: value,
        findOne: false,
        withSameSpeficity: false,
        selectorsObj: cssRulesObj,
      })

      if (sameProValSelectors.length > 1) {
        // ignore selectors for combine
        const ignoreSelectors = /(-webkit-)|(-moz-)|(-ms-)/
        const ignoreConcatSelectors = sameProValSelectors.filter((sel) => ignoreSelectors.test(sel))
        const validConcatSelectors = sameProValSelectors.filter((sel) => !ignoreSelectors.test(sel))
        ignoreConcatSelectors.forEach((selectr) => {
          if (!combinedCssRulesObj[selectr]) {
            combinedCssRulesObj[selectr] = { [prop]: value }
          } else {
            combinedCssRulesObj[selectr][prop] = value
          }
        })

        if (!combinedCssRulesObj[validConcatSelectors.join(',')]) {
          combinedCssRulesObj[validConcatSelectors.join(',')] = { [prop]: value }
        } else {
          combinedCssRulesObj[validConcatSelectors.join(',')][prop] = value
        }

        sameProValSelectors.forEach((selectr) => {
          delete cssRulesObj[selectr][prop]
        })
      } else {
        if (!combinedCssRulesObj[sameProValSelectors[0]]) {
          combinedCssRulesObj[sameProValSelectors[0]] = { [prop]: value }
        } else {
          combinedCssRulesObj[sameProValSelectors[0]][prop] = value
        }
        delete cssRulesObj[sameProValSelectors[0]][prop]
      }
    }
  }
  return combinedCssRulesObj
}
