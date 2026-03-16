const checkLogicalOperator = (operator, value1, value2) => {
  switch (operator) {
    case 'and':
      return value1 && value2
    case 'or':
      return value1 || value2
    default:
      return false
  }
}

const dateTypes = ['date', 'advanced-datetime', 'datetime-local', 'time', 'month', 'week']

const compareValueLogic = (targetFldKey, logics, fields, targetFieldValue, logicsVal, props, rowIndex) => {
  let logicResult
  if (dateTypes.includes(fields[logics.field]?.type) && typeof bfDateFieldsLogicCheck !== 'undefined') {
    logicResult = bfDateFieldsLogicCheck(logics, fields, targetFieldValue, logicsVal, props, rowIndex)
  }
  if (logicResult !== undefined) {
    return logicResult
  }
  switch (logics.logic) {
    case 'change':
    case 'on_click':
      if (targetFldKey === logics.field) {
        return true
      }
      return false
    case 'equal':
      return checkEqualLogic(logics, fields, targetFieldValue, logicsVal)
    case 'not_equal':
      return checkNotEqualLogic(logics, fields, targetFieldValue, logicsVal)
    case 'null':
      return !targetFieldValue && targetFieldValue.length === 0
    case 'not_null':
      return targetFieldValue && targetFieldValue.length > 0
    case 'contain':
      return checkContainLogic(logics, fields, targetFieldValue, logicsVal, props)
    case 'contain_all':
      return checkContainAllLogic(logics, fields, targetFieldValue, logicsVal)
    case 'not_contain':
      return checkNotContainLogic(logics, fields, targetFieldValue, logicsVal)
    case 'greater':
      return checkGreaterLogic(logics, fields, targetFieldValue, logicsVal)
    case 'less':
      return checkLessLogic(logics, fields, targetFieldValue, logicsVal)
    case 'greater_or_equal':
      return checkGreaterOrEqualLogic(logics, fields, targetFieldValue, logicsVal)
    case 'less_or_equal':
      return checkLessOrEqualLogic(logics, fields, targetFieldValue, logicsVal)
    case 'start_with':
      return checkStartWithLogic(logics, fields, targetFieldValue, logicsVal)
    case 'end_with':
      return checkEndWithLogic(logics, fields, targetFieldValue, logicsVal)
    case 'between':
      return checkBetweenLogic(logics, fields, targetFieldValue, logicsVal)
    default:
      return false
  }
}

const checkEqualLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!fields[logics.field].value) {
    return false
  }
  if ((fields[logics.field].multiple !== undefined && fields[logics.field].multiple)
    || targetFieldValue === 'check' || Array.isArray(targetFieldValue)
  ) {
    const fieldValue = Array.isArray(targetFieldValue)
      ? targetFieldValue
      : JSON.parse(targetFieldValue)
    const valueToCheck = bfSplit(logicsVal)
    let checker = 0
    fieldValue.forEach(fValue => {
      if (fieldValue.length > 0 && valueToCheck.indexOf(fValue) !== -1) {
        checker += 1
      }
    })
    return checker === valueToCheck.length && valueToCheck.length === fieldValue.length
  }
  return targetFieldValue === logicsVal
}

const checkNotEqualLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  if ((fields[logics.field].multiple !== undefined && fields[logics.field].multiple)
    || targetFieldValue === 'check' || Array.isArray(targetFieldValue)
  ) {
    const fieldValue = Array.isArray(targetFieldValue)
      ? targetFieldValue
      : JSON.parse(targetFieldValue)
    const valueToCheck = bfSplit(logicsVal)
    if (fieldValue.length !== valueToCheck.length) {
      return true
    }
    let checker = 0
    valueToCheck.forEach(chkValue => {
      if (fieldValue.length > 0 && fieldValue.indexOf(chkValue) === -1) {
        checker += 1
      }
    })
    return valueToCheck.length === checker
  }
  return targetFieldValue !== logicsVal
}

const checkContainLogic = (logics, fields, targetFieldValue, logicsVal, props) => {
  if (!targetFieldValue) {
    return false
  }
  const valueToCheck = bfSplit(logicsVal, props)
  let checker = 0
  if ((fields[logics.field].multiple !== undefined && fields[logics.field].multiple)
    || targetFieldValue === 'check' || Array.isArray(targetFieldValue)
  ) {
    const fieldValue = Array.isArray(targetFieldValue)
      ? targetFieldValue
      : JSON.parse(targetFieldValue)
    valueToCheck.forEach(singleToken => {
      if (fieldValue.length > 0 && fieldValue.indexOf(singleToken) !== -1) {
        checker += 1
      }
    })
    if (checker > 0) {
      return true
    }
    return false
  }
  valueToCheck.forEach(singleToken => {
    if (targetFieldValue.length > 0 && targetFieldValue.indexOf(singleToken) !== -1) {
      checker += 1
    }
  })
  return checker > 0
}

const checkContainAllLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  const valueToCheck = bfSplit(logicsVal)
  let checker = 0
  if ((fields[logics.field].multiple !== undefined && fields[logics.field].multiple)
    || targetFieldValue === 'check' || Array.isArray(targetFieldValue)
  ) {
    const fieldValue = Array.isArray(targetFieldValue)
      ? targetFieldValue
      : JSON.parse(targetFieldValue)
    valueToCheck.forEach(singleToken => {
      if (fieldValue.length > 0 && fieldValue.indexOf(singleToken) !== -1) {
        checker += 1
      }
    })
    if (checker >= valueToCheck.length) {
      return true
    }
    return false
  }
  return false
}

const checkNotContainLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  const valueToCheck = bfSplit(logicsVal)
  let checker = 0
  if ((fields[logics.field].multiple !== undefined && fields[logics.field].multiple)
    || targetFieldValue === 'check' || Array.isArray(targetFieldValue)
  ) {
    const fieldValue = Array.isArray(targetFieldValue)
      ? targetFieldValue
      : JSON.parse(targetFieldValue)
    valueToCheck.forEach(ckValue => {
      if (fieldValue.length > 0 && fieldValue.indexOf(ckValue) === -1) {
        checker += 1
      }
    })
    return checker === valueToCheck.length
  }
  valueToCheck.forEach(singleToken => {
    if (targetFieldValue.length > 0 && targetFieldValue.indexOf(singleToken) === -1) {
      checker += 1
    }
  })
  return checker === valueToCheck.length
}

const checkGreaterLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  if (fields[logics.field].type === 'number') {
    return targetFieldValue !== '' && Number(targetFieldValue) > Number(logicsVal)
  }
  return targetFieldValue !== '' && targetFieldValue > logicsVal
}

const checkLessLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  if (fields[logics.field].type === 'number') {
    return targetFieldValue !== '' && Number(targetFieldValue) < Number(logicsVal)
  }
  return targetFieldValue !== '' && targetFieldValue < logicsVal
}

const checkGreaterOrEqualLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  const fldType = fields[logics.field].type
  if (fldType === 'number') {
    return targetFieldValue !== '' && Number(targetFieldValue) >= Number(logicsVal)
  }
  return targetFieldValue !== '' && targetFieldValue >= logicsVal
}

const checkLessOrEqualLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  if (fields[logics.field].type === 'number') {
    return targetFieldValue !== '' && Number(targetFieldValue) <= Number(logicsVal)
  }
  return targetFieldValue !== '' && targetFieldValue <= logicsVal
}

const checkStartWithLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  return targetFieldValue !== '' && targetFieldValue.indexOf(logicsVal) === 0
}

const checkEndWithLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  return logicsVal === targetFieldValue.substr(targetFieldValue.length - logicsVal.length, targetFieldValue.length)
}

const checkBetweenLogic = (logics, fields, targetFieldValue, logicsVal) => {
  if (!targetFieldValue) {
    return false
  }
  let logicValues = logicsVal
  if (typeof logicsVal === 'string') logicValues = JSON.parse(logicsVal)

  let targetVal = targetFieldValue
  let minVal = logicValues.min
  let maxVal = logicValues.max
  if (fields[logics.field].type === 'number') {
    targetVal = Number(targetFieldValue)
    minVal = Number(logicValues.min)
    maxVal = Number(logicValues.max)
  }

  return targetVal >= minVal && targetVal <= maxVal
}

const checkIsFunction = (data) => data.match(/\(([^)]*)\)/g)

const getFunctionValue = (functionName, params, fieldValues, props, fldType) => {
  switch (functionName) {
    case '_bf_length':
      return params.length
    case '_bf_count':
      if (fldType.match(/check|radio|select/)) { return bfSplit(params.trim(), props).length }
      return params.split(/\b\W+\b/g).length
    case '_bf_calc':
      return evalMathExpression(params)
    case '_bf_math': {
      const calcParams = bfSplit(params, props)
      const fieldKey = calcParams[0].substring(2, calcParams[0].length - 1)
      if (isRepeatedField(fieldKey, props)) {
        const repeateFieldKey = checkRepeatedField(fieldKey, props)
        const indexes = getRepeatedIndexes(repeateFieldKey, props)
        let result = 0
        if (typeof calcParams[1] === 'undefined' || calcParams[1] === 'sum') {
          indexes.forEach(index => {
            result += Number(fieldValues[`${fieldKey}[${index}]`].value)
          })
        } else if (calcParams[1] === 'avg') {
          indexes.forEach(index => {
            result += Number(fieldValues[`${fieldKey}[${index}]`].value)
          })
          result /= indexes.length
        } else if (calcParams[1] === 'min') {
          indexes.forEach(index => {
            if (result === 0 || Number(fieldValues[`${fieldKey}[${index}]`].value) < result) {
              result = Number(fieldValues[`${fieldKey}[${index}]`].value)
            }
          })
        } else if (calcParams[1] === 'max') {
          indexes.forEach(index => {
            if (Number(fieldValues[`${fieldKey}[${index}]`].value) > result) {
              result = Number(fieldValues[`${fieldKey}[${index}]`].value)
            }
          })
        } else if (calcParams[1] === 'count') {
          result = indexes.length
        } else if (calcParams[1] === 'mul') {
          result = 1
          indexes.forEach(index => {
            result *= Number(fieldValues[`${fieldKey}[${index}]`].value)
          })
        }
        return result
      }
      return fieldValues[fieldKey].value || ''
    }
    case '_bf_format_datetime': {
      if (typeof bfFormatDateTime !== 'undefined') return bfFormatDateTime(params, props)
      return params
    }
    case '_bf_datetime_difference': {
      if (typeof bfCalculateDateTimeDifference !== 'undefined') return bfCalculateDateTimeDifference(params, props)
      return params
    }
    case '_bf_add_subtract_datetime': {
      if (typeof bfAddOrSubtractDateTime !== 'undefined') return bfAddOrSubtractDateTime(params, props)
      return params
    }
    case '_bf_concat': {
      const concatParams = bfSplit(params, props)
      const fieldKey = concatParams[0].substring(2, concatParams[0].length - 1)
      const separator = concatParams[1] || ', '
      if (isRepeatedField(fieldKey, props)) {
        const repeateFieldKey = checkRepeatedField(fieldKey, props)
        const indexes = getRepeatedIndexes(repeateFieldKey, props)
        let result = ''
        indexes.forEach(index => {
          if (index > 1) {
            result += separator
          }
          result += fieldValues[`${fieldKey}[${index}]`].value
        })
        return result
      }
      return fieldValues[fieldKey].value || ''
    }
    case '_bf_number': {
      const regex = /[\d,.]*\d(?:\.\d+)?/
      const match = params.match(regex)
      if (match) {
        const numericValue = match[0].replace(/,/g, '')
        return parseFloat(numericValue)
      }
      return 0
    }
    default: return params
  }
}

export const checkLogic = (targetFldKey, logics, fieldValues, props, rowIndex) => {
  if (Array.isArray(logics)) {
    let conditionStatus = false
    for (let lgcIndx = 0; lgcIndx < logics.length; lgcIndx += 1) {
      const lgc = logics[lgcIndx]
      if (typeof lgc !== 'string') {
        const isCondition = checkLogic(targetFldKey, lgc, fieldValues, props, rowIndex)
        if (lgcIndx === 0) {
          conditionStatus = isCondition
        }
        if (lgcIndx - 1 >= 0 && typeof logics[lgcIndx - 1] === 'string') {
          const operator = logics[lgcIndx - 1].toLowerCase()
          conditionStatus = checkLogicalOperator(operator, conditionStatus, isCondition)
        }
      }
    }
    return conditionStatus
  }

  const logicsVal = replaceWithField(logics.val, fieldValues, props, rowIndex)
  const smartFields = Object.entries(props.smartTags)?.reduce((acc, [key, value]) => ({ ...acc, [`\${${key}${typeof value === 'string' ? '' : '()'}}`]: { value: typeof value === 'string' ? value : (value?.[logics?.smartKey] || ''), type: 'text', multiple: false } }), {})
  const flds = { ...fieldValues, ...smartFields }
  const fldsPropKey = isRepeatedField(logics.field, props) ? `${logics.field}[${rowIndex}]` : logics.field
  const tempLogics = { ...logics, field: fldsPropKey }
  if (flds[fldsPropKey] !== undefined) {
    const targetFieldValue = flds[fldsPropKey].value
    return compareValueLogic(targetFldKey, tempLogics, flds, targetFieldValue, logicsVal, props, rowIndex)
  }

  if (checkIsFunction(logics.field)) {
    const functionName = logics.field.substring(2, logics.field.length - 1).replace(/\([A-Za-z\s0-9+-\\*]*\)/g, '')
    const targetFieldValue = getFunctionValue(functionName, flds[logics.smartKey].value, flds, props, flds[logics.smartKey].type)
    if (isNaN(targetFieldValue)) flds[logics.field] = { type: 'text' }
    else flds[logics.field] = { type: 'number' }
    return compareValueLogic(targetFldKey, logics, flds, targetFieldValue, logicsVal, props, rowIndex)
  }

  if (typeof isRepeaterField !== 'undefined' && isRepeaterField(logics.field, props)) {
    return compareValueLogic(targetFldKey, tempLogics, flds, '', logicsVal, props, rowIndex)
  }
  return false
}

const mutateString = (dataString, fieldValues, props, rowIndex) => {
  let mutatedString = dataString
  // select calculation functions
  const specialFuncMatch = dataString.match(/\${_(?:bf_math|bf_concat)\([^)]+\)}/g) || []
  specialFuncMatch.map(funContent => {
    const funcParams = funContent.substring(funContent.indexOf('(') + 1, funContent.length - 2)
    const funcName = funContent.substring(2, funContent.indexOf('('))
    const funcValue = getFunctionValue(funcName, funcParams, fieldValues, props)
    mutatedString = mutatedString.replace(funContent, funcValue)
  })

  // select all fields/functions which are in ${} format and not under ${} format
  const matchedFields = mutatedString.match(/\${\w[^${}]*}/g) || []

  matchedFields.map(field => {
    let fieldName = field
    if (!fieldValues[fieldName]) {
      fieldName = field.substring(2, field.length - 1)
    }
    fieldName = isRepeatedField(fieldName, props) ? `${fieldName}[${rowIndex}]` : fieldName
    let val2Rplc = ''
    if (fieldValues[fieldName]) {
      val2Rplc = fieldValues[fieldName].value
      if (Array.isArray(fieldValues[fieldName].value) && !isNaN(fieldValues[fieldName].value[0])) {
        val2Rplc = 0
        fieldValues[fieldName].value.map(sV => {
          val2Rplc += Number(sV)
        })
      }
    } else if (checkIsFunction(fieldName)) {
      const funcName = fieldName.replace(/\(([^)]*)\)/g, '')
      const params = fieldName.substring(fieldName.indexOf('(') + 1, fieldName.length - 1)
      val2Rplc = getFunctionValue(funcName, params, fieldValues, props, '')
    }
    mutatedString = mutatedString.replace(field, val2Rplc)
  })
  return mutatedString
}
export const replaceWithField = (stringToReplace, fieldValues, props, rowIndex) => {
  if (!stringToReplace) {
    return stringToReplace
  }
  let mutatedString
  if (typeof stringToReplace === 'object') {
    mutatedString = JSON.stringify(stringToReplace)
  } else {
    mutatedString = JSON.parse(JSON.stringify(stringToReplace))
  }
  if (typeof mutatedString !== 'string') {
    return stringToReplace
  }
  // const matchedFields = mutatedString.match(/\${\w[^${}]*}/g)
  // if (matchedFields) {
  //   matchedFields.map(field => {
  //     let fieldName = field
  //     if (!fieldValues[fieldName]) {
  //       fieldName = field.substring(2, field.length - 1)
  //     }
  //     if (fieldValues[fieldName]) {
  //       let val2Rplc = fieldValues[fieldName].value
  //       if (Array.isArray(fieldValues[fieldName].value) && !Number.isNaN(fieldValues[fieldName].value[0])) {
  //         val2Rplc = 0
  //         fieldValues[fieldName].value.map(sV => {
  //           val2Rplc += Number(sV)
  //         })
  //       }
  //       mutatedString = mutatedString.replace(field, val2Rplc)
  //     }
  //   })
  // }
  while (mutatedString.match(/\${\w[^${}]*}/g)) {
    mutatedString = mutateString(mutatedString, fieldValues, props, rowIndex)
  }

  return evalMathExpression(mutatedString)
}

export const evalMathExpression = (stringToReplace) => {
  if (!stringToReplace) {
    return stringToReplace
  }
  let mutatedString = stringToReplace
  const isMathEpr = stringToReplace.match(/[\\+\-\\*\\/\\%]/g)
  if (isMathEpr && isMathEpr.length > 0) {
    const mathEpr = stringToReplace.match(/\w+/g)
    if (!mathEpr) {
      return stringToReplace
    }
    const isInvalid = mathEpr.filter(v => Number.isNaN(v))
    if (isInvalid && isInvalid.length > 0) {
      return mutatedString
    }
    mutatedString = mutatedString.replace(/\{|\[/g, '(')
    mutatedString = mutatedString.replace(/\}|\]/g, ')')
    try {
      // eslint-disable-next-line no-new-func
      mutatedString = Function(`"use strict"; return (${mutatedString})`)()
    } catch (error) {
      return stringToReplace
    }
  }
  return mutatedString
}

export const isRepeatedField = (fieldKey, props) => (typeof checkRepeatedField !== 'undefined' ? checkRepeatedField(fieldKey, props) : false)
