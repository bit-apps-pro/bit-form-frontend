const dateTypes = ['date', 'advanced-datetime', 'datetime-local', 'time', 'month', 'week']
let rowIndex = ''
const parseIsoWeekToDate = (year, week) => {
  const jan4 = new Date(year, 0, 4) // Jan 4 is always in ISO week 1
  const day = jan4.getDay() || 7 // getDay: Sun=0, Mon=1, ..., Sat=6 → treat Sunday as 7
  const mondayOfWeek1 = new Date(jan4)
  mondayOfWeek1.setDate(jan4.getDate() - day + 1) // back to Monday of week 1
  mondayOfWeek1.setDate(mondayOfWeek1.getDate() + (week - 1) * 7)
  return mondayOfWeek1
}
const parseDateValue = (value, fieldType, fieldKey, props) => {
  if (!value) return null
  const normalizedValue = value.trim().replace(/^['"]|['"]$/g, '')

  try {
    switch (fieldType) {
      case 'date':
      case 'datetime-local':
        return new Date(normalizedValue).getTime()
      case 'advanced-datetime': {
        const fldKey = getInitPropertyKeyName(fieldKey, props)
        if (props?.inits?.[fldKey]?.parseDate) {
          props.inits[fldKey].parseDate(normalizedValue).getTime()
        }
        return new Date(normalizedValue).getTime()
      }

      case 'time': {
        // Convert to seconds since midnight for comparison
        const [h, m, s] = normalizedValue.split(':')
        return (+h) * 3600 + (+m) * 60 + (+(s || 0))
      }

      case 'week': {
        // Convert to Date object (first day of week)
        const [year, week] = normalizedValue.split('-W')
        return parseIsoWeekToDate(+year, +week).getTime()
      }
      case 'month': {
        const [monthYear, month] = normalizedValue.split('-')
        return (+monthYear) * 12 + (+month) - 1
      }

      default:
        return normalizedValue
    }
  } catch (e) {
    console.error('Date normalization error:', e)
    return value
  }
}

const checkEqualLogic = (logics, fields, parsedTargetFieldValue, parsedLogicsValue) => parsedTargetFieldValue === parsedLogicsValue

const checkNotEqualLogic = (logics, fields, parsedTargetFieldValue, parsedLogicsValue) => parsedTargetFieldValue !== parsedLogicsValue

const checkGreaterLogic = (logics, fields, parsedTargetFieldValue, parsedLogicsValue) => parsedTargetFieldValue > parsedLogicsValue

const checkLessLogic = (logics, fields, parsedTargetFieldValue, parsedLogicsValue) => parsedTargetFieldValue < parsedLogicsValue

const checkGreaterOrEqualLogic = (logics, fields, parsedTargetFieldValue, parsedLogicsValue) => parsedTargetFieldValue >= parsedLogicsValue

const checkLessOrEqualLogic = (logics, fields, parsedTargetFieldValue, parsedLogicsValue) => parsedTargetFieldValue <= parsedLogicsValue

const checkBetweenLogic = (logics, fields, parsedTargetFieldValue, logicsVal) => {
  const fieldType = fields[logics.field]?.type

  let logicValues = logicsVal
  if (typeof logicsVal === 'string') logicValues = JSON.parse(logicsVal)

  const minVal = parseDateValue(logicValues.min, fieldType)
  const maxVal = parseDateValue(logicValues.max, fieldType)

  return parsedTargetFieldValue >= minVal && parsedTargetFieldValue <= maxVal
}

const checkContainLogic = (logics, fields, targetFieldValue, logicsVal, props) => {
  if (!targetFieldValue) {
    return false
  }
  const valueToCheck = bfSplit(logicsVal, props)
  let checker = 0

  valueToCheck.forEach(singleToken => {
    if (targetFieldValue.length > 0 && targetFieldValue.indexOf(singleToken) !== -1) {
      checker += 1
    }
  })
  return checker > 0
}

export default function bfDateFieldsLogicCheck(logics, fields, targetFieldValue, logicsVal, props, rowIndx) {
  rowIndex = rowIndx || ''
  const fieldType = fields[logics.field]?.type
  if (!dateTypes.includes(fieldType)) return undefined

  const parsedTargetValue = parseDateValue(targetFieldValue, fieldType, props, logics.field)
  const parsedLogicValue = parseDateValue(logicsVal, fieldType, props, logics.field)

  if (parsedTargetValue === null) {
    return false
  }
  switch (logics.logic) {
    case 'change':
      return true
    case 'null':
      return !targetFieldValue && targetFieldValue.length === 0
    case 'not_null':
      return targetFieldValue && targetFieldValue.length > 0
    default:
      break
  }
  if (parsedLogicValue === null || !logicsVal) {
    return false
  }
  switch (logics.logic) {
    case 'equal':
      return checkEqualLogic(logics, fields, parsedTargetValue, parsedLogicValue)
    case 'not_equal':
      return checkNotEqualLogic(logics, fields, parsedTargetValue, parsedLogicValue)
    case 'contain':
      return checkContainLogic(logics, fields, parsedTargetValue, logicsVal, props)
    case 'greater':
      return checkGreaterLogic(logics, fields, parsedTargetValue, parsedLogicValue)
    case 'less':
      return checkLessLogic(logics, fields, parsedTargetValue, parsedLogicValue)
    case 'greater_or_equal':
      return checkGreaterOrEqualLogic(logics, fields, parsedTargetValue, parsedLogicValue)
    case 'less_or_equal':
      return checkLessOrEqualLogic(logics, fields, parsedTargetValue, parsedLogicValue)
    case 'between':
      return checkBetweenLogic(logics, fields, parsedTargetValue, logicsVal)
    default:
      return undefined
  }
}

const isRepeatedField = (fieldKey, props) => (typeof checkRepeatedField !== 'undefined' ? checkRepeatedField(fieldKey, props) : false)

const getInitPropertyKeyName = (fldKey, props) => {
  const initFldKey = isRepeatedField(fldKey, props) ? `${fldKey}[${rowIndex}]` : fldKey
  if (props.inits && !props.inits[initFldKey]) return fldKey
  return initFldKey
}
