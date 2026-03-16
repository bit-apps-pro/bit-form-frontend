/* eslint-disable no-useless-escape */
import colorMinify from './colorMinify'

export function isFloat(n) {
  return Number(n) === n && n % 1 !== 0
}

function getMatchIndexes(str, toMatch) {
  const re = new RegExp(toMatch, 'g')
  const indexMatches = []
  let match

  while (match !== null) {
    match = re.exec(str)
    if (!match) {
      break
    }
    indexMatches.push(match.index)
  }

  return indexMatches
}

export const matchByBracketPair = (matchTarget, str) => {
  const startBracket = matchTarget.match(/\(|{|\[/g)?.[0]
  let closingBraket = ''
  if (startBracket === '(') closingBraket = ')'
  if (startBracket === '{') closingBraket = '}'
  if (startBracket === '[') closingBraket = ']'

  if (!startBracket || !closingBraket || !str.includes(matchTarget)) {
    console.error('no bracket matched in string', { matchTarget, str })
    return null
  }

  const trimedStr = str.trim()
  const matchTargetWithoutbraket = matchTarget.replace(/\(|{|\[/g, '')

  const startIndexs = getMatchIndexes(trimedStr, matchTargetWithoutbraket)

  const endIndexs = []
  const matchedPairs = []
  for (let i = 0; i < startIndexs.length; i += 1) {
    const maximumEndingIndex = trimedStr.length
    let parenthesesCount = 0

    if (!trimedStr
      .slice(startIndexs[i], maximumEndingIndex)
      .includes(matchTarget)
    ) { continue }

    for (let j = startIndexs[i]; j < maximumEndingIndex; j += 1) {
      const char = trimedStr[j]
      if (char === startBracket) {
        parenthesesCount += 1
      }
      if (char === closingBraket) {
        parenthesesCount -= 1
      }
      if (char === closingBraket && parenthesesCount === 0) {
        endIndexs.push(j + 1)
        break
      }
    }

    matchedPairs.push(trimedStr.slice(startIndexs[i], endIndexs[i]))

    if (startIndexs[i + 1] && startIndexs[i + 1] < endIndexs[i]) {
      startIndexs.splice(i + 1, 1)
      continue
    }
  }

  if (!matchedPairs.length) {
    return null
  }

  return matchedPairs
}

export const expressAndCompressColors = (colorStr, allCssVarDefinations = {}) => {
  const colorStrTrimmed = colorStr?.trim()?.replace(/\s+/g, ' ')

  if (!colorStrTrimmed || !isCssColor(colorStrTrimmed)) {
    console.error('passing invalid hsl color', colorStr)
    return
  }
  let colorString = colorStrTrimmed

  if (colorString.includes('var(')) {
    ({ value: colorString } = expressCssVar(colorStrTrimmed, allCssVarDefinations))
  }

  if (colorString.includes('calc(')) {
    colorString = expressMultipleCalcFuncWithExt(colorString, allCssVarDefinations)
  }

  // validation
  const hslColorFunctions = colorString.includes('hsl(') ? (matchByBracketPair('hsl(', colorString) || []) : []
  const hslaColorFunctions = colorString.includes('hsla(') ? (matchByBracketPair('hsla(', colorString) || []) : []
  const rgbColorFunctions = colorString.includes('rgb(') ? (matchByBracketPair('rgb(', colorString) || []) : []
  const rgbaColorFunctions = colorString.includes('rgba(') ? (matchByBracketPair('rgba(', colorString) || []) : []
  const colorFunctions = [
    ...hslColorFunctions,
    ...hslaColorFunctions,
    ...rgbColorFunctions,
    ...rgbaColorFunctions,
  ]

  colorFunctions.forEach(colorFunc => {
    if (/hsl\(.+?\)/g.test(colorFunc)) {
      const funcParamCount = colorFunc
        .replace(/hsl|\(|\)/g, '')
        .trim()
        .split(',')
        .filter(v => v)
        .length
      if (funcParamCount < 3) {
        colorString = colorString.replace(colorFunc, '')
      }
    }
    if (/hsla\(.+?\)/g.test(colorFunc)) {
      const funcParamCount = colorFunc
        .replace(/hsla|\(|\)/g, '')
        .trim()
        .split(',')
        .filter(v => v)
        .length
      if (funcParamCount < 4) {
        colorString = colorString.replace(colorFunc, '')
      }
    }

    let optimizedColor = colorFunc
    if (!colorFunc.includes('calc')) {
      optimizedColor = colorMinify(colorFunc)
    } else {
      optimizedColor = colorFunc
        .replace(/,\s{0,}/g, ',')
        .replace(/\s{0,}\)/g, ')')
        .replace(/\(\s{0,}/g, '(')
    }

    colorString = colorString.replace(colorFunc, optimizedColor)
  })

  const cleanColorStr = colorString
    .trim()
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*!important/g, '!important')

  return cleanColorStr
}

export const isCssColor = (colorString) => {
  if (/hsla?|rgba?/g.test(colorString)) {
    return true
  } if (/hwb|lab|lch/g.test(colorString)) {
    console.error('color format not supported', colorString)
    return false
  }
  return false
}

export const isSameUnit = (val1, val2) => {
  if (val1 === undefined || val1 === null || val2 === undefined || val2 === null) {
    console.error('unexpected value found while unit check', val1, val2)
    return false
  }
  let tmpV1 = val1
  let tmpV2 = val2
  if (typeof tmpV1 === 'number') { tmpV1 = val1.toString() }
  if (typeof tmpV2 === 'number') { tmpV2 = val2.toString() }
  const val1Unit = tmpV1.trim().replace(/\d*\.*/g, '')
  const val2Unit = tmpV2.trim().replace(/\d*\.*/g, '')
  return val1Unit === val2Unit
}

export const expressCalcFunc = (calcStr, cssVarDefinations = {}) => {
  if (!calcStr) {
    console.error('invalid calc function', calcStr)
    return '0'
  }

  const trimmedCalcStr = calcStr.trim().replace(/\s{2,}/g, ' ')
  const calcExpression = trimmedCalcStr.match(/calc\(.+(?=\))/g)?.[0].replace('calc(', '')
  if (calcExpression.includes('calc')) {
    console.error('nested calc not supported', calcStr)
    return '0'
  }
  const calcExpressionsArr = calcExpression
    .replace(/(\bvar\([^)]+\)|[+\-/*])/g, (match) => {
      if (match.trim() !== '' && !match.includes('var')) {
        return `##${match.trim()}##`
      }
      return match
    })
    .split(/(##[\+\*\/-]##)/g)
    .map(itm => {
      itm.trim()
      if (itm.match(/##[\+\*\/-]##/g)) return itm.replace(/#/g, '')
      return itm
    })

  const variableDefinedArr = calcExpressionsArr.map(exp => {
    if (exp.includes('var')) {
      const { value } = expressCssVar(exp, cssVarDefinations)
      return value.trim()
    }
    return exp.trim()
  })
  if (variableDefinedArr.length > 3) {
    console.warn('calc result may not accurate', calcStr)
  }

  if (variableDefinedArr[0] === '' && variableDefinedArr[2] !== '') {
    return variableDefinedArr[2].trim()
  }
  if (variableDefinedArr[2] === '' && variableDefinedArr[0] !== '') {
    return variableDefinedArr[0].trim()
  }

  if (isSameUnit(variableDefinedArr[0], variableDefinedArr[2])) {
    const unit = variableDefinedArr[0].trim().replace(/\d*\.*/g, '')
    const oparator = variableDefinedArr[1]
    const val1 = Number(variableDefinedArr[0].replace(/[^\.\d\s]/g, ''))
    const val2 = Number(variableDefinedArr[2].replace(/[^\.\d\s]/g, ''))
    // eslint-disable-next-line no-eval
    const resultInNum = calculate(val1, oparator, val2)
    return `${resultInNum}${unit}`
  }

  return `calc(${variableDefinedArr[0]} ${variableDefinedArr[1]} ${variableDefinedArr[2]})`
}

const calculate = (val1, operator, val2) => {
  const num1 = parseFloat(val1)
  const num2 = parseFloat(val2)

  switch (operator) {
    case '+':
      return num1 + num2
    case '-':
      return num1 - num2
    case '*':
      return num1 * num2
    case '/':
      return num2 !== 0 ? num1 / num2 : NaN // Avoid division by zero
    case '%':
      return num1 % num2
    default:
      throw new Error('Invalid operator')
  }
}

export const expressMultipleCalcFuncWithExt = (str, cssVarDefinations = {}) => {
  if (str === undefined || str === null) {
    console.error('invalid calc string given', str)
    return '0'
  }

  let trimmedStr = str
    .trim()
    .replace(/\s{2,}/g, ' ')
    .replace(/calc\s+?\(/g, 'calc(')

  const calcFuntions = matchByBracketPair('calc(', trimmedStr) || []

  calcFuntions.forEach((calcFunc) => {
    trimmedStr = trimmedStr.replace(calcFunc, expressCalcFunc(calcFunc, cssVarDefinations))
  })

  return trimmedStr
}

export const expressCssVar = (cssVarStr, cssVarDefinations = {}) => {
  if (cssVarStr === undefined || cssVarStr === null) {
    console.error('passing invalid css variable', cssVarStr)
    return
  }
  if (!cssVarDefinations) {
    console.error('passing invalid css variables', cssVarDefinations)
    return
  }

  const cssVars = matchByBracketPair('var(', cssVarStr)

  if (!cssVars) {
    console.warn('no var found', cssVarStr)
    return { value: cssVarStr, isFallbackValue: false }
  }

  let tmpCssVarStr = cssVarStr
  let isFallbackValue = false
  let skipVarReplace = false

  cssVars.forEach(varStr => {
    // eslint-disable-next-line prefer-const
    let [varName, fallbackValue] = varStr
      .match(/var\(.+(?=\))/g)[0]
      .replace('var(', '')
      .trim()
      .replace(/\s{2,}/g, ' ')
      .split(',')

    if (varName.startsWith('var')) {
      varName = varName.replace(/var|\(|\)/g, '')
    }

    // --TODO-- handle reserved vars
    // reserveVars : [/^--bfv/, '', ]

    let isTargetVarNameFound = false
    const targetVarName = varName.trim()
    let cssVarValue = cssVarDefinations[targetVarName]
    if (targetVarName.startsWith('--bfv-')) {
      cssVarValue = `var(${targetVarName})`
      isTargetVarNameFound = true
      skipVarReplace = true
    }
    if (cssVarValue !== undefined && cssVarValue !== null) {
      isTargetVarNameFound = true
      if (typeof cssVarValue === 'number') {
        cssVarValue = cssVarValue.toString()
      }

      if (isCssColor(cssVarValue)) {
        cssVarValue = expressAndCompressColors(cssVarValue, cssVarDefinations)
      }
      tmpCssVarStr = tmpCssVarStr.replace(varStr, cssVarValue.trim())
    }

    if (cssVarValue === undefined || cssVarValue === null) {
      const cssVarNames = Object.keys(cssVarDefinations)
      const varNameCount = cssVarNames.length
      for (let i = 0; i < varNameCount; i += 1) {
        const cssVarName = cssVarNames[i]
        if (Object.hasOwnProperty.call(cssVarDefinations, cssVarName)) {
          const trimmedVarName = cssVarName.trim()
          if (targetVarName === trimmedVarName) {
            isTargetVarNameFound = true
            cssVarValue = cssVarDefinations[cssVarName]
            if (typeof cssVarValue === 'number') {
              tmpCssVarStr = tmpCssVarStr.replace(varStr, cssVarValue.toString())
            }
            if (isCssColor(cssVarValue)) {
              const optimizedClr = expressAndCompressColors(cssVarValue, cssVarDefinations)
              tmpCssVarStr = tmpCssVarStr.replace(varStr, optimizedClr)
            }
            if (cssVarValue) {
              tmpCssVarStr = tmpCssVarStr.replace(varStr, cssVarValue.trim().replace(/\s{2,}/g, ' '))
            }
          }
        }
      }
    }

    if (!cssVarValue && fallbackValue) {
      if (tmpCssVarStr.trim() !== '') {
        tmpCssVarStr = tmpCssVarStr.replace(varStr, fallbackValue.trim())
      }
      if (tmpCssVarStr.trim() === '') {
        tmpCssVarStr = fallbackValue.trim()
      }
      isFallbackValue = true
    }

    if (!isTargetVarNameFound) {
      tmpCssVarStr = tmpCssVarStr.replace(varStr, '')
      console.error('missing css variable', cssVarValue, cssVarStr)
    }
  })
  if (tmpCssVarStr === cssVarStr && !skipVarReplace) {
    console.error('missing css variable', cssVarStr)
    return { value: '', isFallbackValue }
  }
  const cleanCssVarStr = tmpCssVarStr.trim().replace(/\s*!important/g, '!important')
  return { value: cleanCssVarStr, isFallbackValue }
}

export const cleanCssSelectorPropValueAndExpressVars = (cssSelectors) => {
  const cssSelectorsObj = deepCopy(cssSelectors)
  const cleanCssObj = {}
  const selectors = Object.keys(cssSelectorsObj)
  const selectorsCount = selectors.length
  for (let i = 0; i < selectorsCount; i += 1) {
    const selector = selectors[i]
    if (Object.hasOwnProperty.call(cssSelectorsObj, selector)) {
      const trimmedSelector = selector.trim()
      cleanCssObj[trimmedSelector] = cssSelectorsObj[selector]
    }
  }
  return cleanCssObj
}

export const isQuadValueProp = (str) => /padding|margin|border-radius|border-width/g.test(str)

export const optimizeQuadValue = (str) => {
  const hasImportant = str.includes('important') ? '!important' : ''
  const trimmedStr = str
    .replace(/!important/g, '')
    .trim()
    .replace(/\s{2,}/g, ' ')

  const strArr = trimmedStr.split(' ').map(val => {
    if (val.match(/\d+/g)?.[0] === '0') {
      return '0'
    }
    return val
  })

  if (strArr.length === 1) {
    return strArr[0] + hasImportant
  }
  if (strArr.length === 2) {
    return `${strArr[0]} ${strArr[1]}${hasImportant} `
  }
  if (strArr.length === 3 && strArr[0] === strArr[2]) {
    return `${strArr[0]} ${strArr[1]}${hasImportant} `
  }
  if (strArr.length === 4 && strArr.every((val, i, arr) => val === arr[0])) {
    return strArr[0] + hasImportant
  }
  if (strArr.length === 4 && strArr[0] === strArr[2] && strArr[1] === strArr[3]) {
    return `${strArr[0]} ${strArr[1]}${hasImportant} `
  }

  return trimmedStr + hasImportant
}

export const normalizeSelector = (selector) => selector
  .trim()
  .replace(/\s{2,}/g, ' ') // replace multiple whiteSpace to one whitespace
  .replace(/\\n\s*/g, '') // replace ",   " to "," and "\n   " to ""
  .replace(/\[(\s+)/g, '[') // replace "[  " to "["
  .replace(/(\s+)\]/g, ']') // replace "  ]" to "]"
  .replace(/\s*(::?|~|\+|=|,)\s*/g, '$1') // trim whitespce for : or :: or ~ or , or + or =

export const isValidPropAndValue = (prop, value, matchObj) => {
  if (matchObj && prop in matchObj && matchObj[prop] === value) {
    return false
  }
  return true
}
