/**
 * Calculates difference between two date/time values
 * @param {string} paramsStr - it contains 3 Params (startDateTimeStr, endDateTimeStr, returnUnit) separated by bs_separator
 * param1  startDateTimeStr - Start date/time (various formats)
 * param2  endDateTimeStr - End date/time (various formats)
 * param3  returnUnit - Unit to return (seconds, minutes, hours, days, weeks, months)
 * @param {object} props - Form Content Object
 * @returns {number} Difference in specified units
 */
export default function bfCalculateDateTimeDifference(paramsStr, props) {
  const params = bfSplit(paramsStr, props)
  const startDateTimeStr = (params[0] || 'today').trim()
  const endDateTimeStr = (params[1] || 'today').trim()
  const returnUnit = (params[2] || 'days').trim().replace(/^['"]|['"]$/g, '')

  // Parse inputs to Date objects
  const startDate = typeof bfParseDateTime !== 'undefined' ? bfParseDateTime(startDateTimeStr) : new Date(startDateTimeStr)
  const endDate = typeof bfParseDateTime !== 'undefined' ? bfParseDateTime(endDateTimeStr) : new Date(endDateTimeStr)

  // For day/week/month calculations, normalize to midnight
  if (['days', 'weeks', 'months', 'years'].includes(returnUnit)) {
    const normalize = date => new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    )

    const normalizedStart = normalize(startDate)
    const normalizedEnd = normalize(endDate)

    const diffMs = normalizedEnd - normalizedStart

    switch (returnUnit) {
      case 'days': return Math.floor(diffMs / (1000 * 60 * 60 * 24))
      case 'weeks': return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
      case 'months': {
        // More accurate month calculation
        const startYear = normalizedStart.getFullYear()
        const startMonth = normalizedStart.getMonth()
        const endYear = normalizedEnd.getFullYear()
        const endMonth = normalizedEnd.getMonth()
        return (endYear - startYear) * 12 + (endMonth - startMonth)
      }
      case 'years': {
        const startYear = normalizedStart.getFullYear()
        const endYear = normalizedEnd.getFullYear()
        return endYear - startYear
      }
      default:
        break
    }
  }

  // Calculate difference in milliseconds
  const diffMs = endDate - startDate

  // Convert to requested unit
  switch (returnUnit.toLowerCase()) {
    case 'seconds':
      return Math.floor(diffMs / 1000)
    case 'minutes':
      return Math.floor(diffMs / (1000 * 60))
    case 'hours':
      return Math.floor(diffMs / (1000 * 60 * 60))
    default:
      return Math.floor(diffMs / (1000 * 60 * 60 * 24))
  }
}
