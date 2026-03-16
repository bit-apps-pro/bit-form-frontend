/**
 * Adds/subtracts time from a date/time value
 * @param {string} paramsStr - it contains String of params separate by bf_separator
 * 1st param baseDateTimeStr date/time (various formats)
 * 2nd param amount - Amount to add/subtract
 * 3rd param calculateUnit - Unit of time (seconds, minutes, hours, days, weeks, months)
 * 4th param subtract - Whether to subtract instead of add
 * @param {object} props - Form Content Object
 * @returns {string} Result in same format as input
 */
export default function bfAddOrSubtractDateTime(paramsStr, props) {
  const params = bfSplit(paramsStr, props)
  const baseDateTimeStr = params[0] || 'today'
  const amount = Number((params[1] || '1').trim().replace(/^['"]|['"]$/g, ''))
  const calculateUnit = (params[2] || 'days').trim().replace(/^['"]|['"]$/g, '')
  const subtract = params[3] || false
  // Parse input to Date object
  const baseDate = typeof parseDateTime !== 'undefined' ? parseDateTime(baseDateTimeStr) : new Date(baseDateTimeStr)
  const multiplier = subtract ? -1 : 1
  const adjustedDate = new Date(baseDate)

  // Apply time adjustment
  switch (calculateUnit.toLowerCase()) {
    case 'seconds':
      adjustedDate.setSeconds(adjustedDate.getSeconds() + (amount * multiplier))
      break
    case 'minutes':
      adjustedDate.setMinutes(adjustedDate.getMinutes() + (amount * multiplier))
      break
    case 'hours':
      adjustedDate.setHours(adjustedDate.getHours() + (amount * multiplier))
      break
    case 'days':
      adjustedDate.setDate(adjustedDate.getDate() + (amount * multiplier))
      break
    case 'weeks':
      adjustedDate.setDate(adjustedDate.getDate() + (amount * 7 * multiplier))
      break
    case 'months':
      adjustedDate.setMonth(adjustedDate.getMonth() + (amount * multiplier))
      break
    case 'years':
      adjustedDate.setFullYear(adjustedDate.getFullYear() + (amount * multiplier))
      break
    default:
      adjustedDate.setDate(adjustedDate.getDate() + (amount * multiplier))
      break
  }

  // Format back to original format
  return formatToOriginalType(adjustedDate, baseDateTimeStr)
}

/**
 * Formats Date object back to original string format
 * @param {Date} date - Date to format
 * @param {string} original - Original format string
 * @returns {string} Formatted date string
 */
const formatToOriginalType = (date, original) => {
  if (original.toLowerCase() === 'today') {
    return original // Preserve "today" string if that was input
  }

  // Date format: YYYY-MM-DD
  if (original.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Datetime format: YYYY-MM-DDTHH:mm
  if (original.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Time format: HH:mm or HH:mm:ss
  if (original.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return original.includes(':')
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`
  }

  // Week format: YYYY-Www
  if (original.match(/^\d{4}-W\d{2}$/i)) {
    const year = date.getFullYear()
    const week = getWeekNumber(date)
    return `${year}-W${week.toString().padStart(2, '0')}`
  }

  // Month format: YYYY-MM
  if (original.match(/^\d{4}-\d{2}$/)) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${year}-${month}`
  }

  // Fallback to ISO format
  return date.toISOString()
}

/**
 * Gets ISO week number
 * @param {Date} date - Date to convert
 * @returns {number} ISO week number
 */
const getWeekNumber = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
