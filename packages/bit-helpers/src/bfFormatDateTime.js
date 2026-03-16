/**
 * Format a date/datestring to a custom format
 * Supports Flatpickr tokens + common alternatives for global compatibility
 *  @param {string} paramsStr - it contains 3 Params (startDateTimeStr, endDateTimeStr, returnUnit) separated by bs_separator
 * param1 {string|Date} dateInput - Date string, Date object, or "today"
 * param2 {string} expectedOutFormat - Format string with tokens
 * @param {object} props - Form Content Object
 * @returns {string} - Formatted date string
 */
export default function bfFormatDateTime(paramsStr, props) {
  try {
    const params = bfSplit(paramsStr, props)
    const dateInput = (params[0] || 'today').trim()
    const expectedOutFormat = (params[1] || 'YYYY-MM-DD HH:mm').trim().replace(/^['"]|['"]$/g, '')

    // Parse input to Date object if needed
    const date = dateInput instanceof Date ? dateInput : bfParseDateTime(dateInput)

    // Validate date
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date input')
      return ''
    }

    // Extract date components
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const dayOfWeek = date.getDay()
    const hours24 = date.getHours()
    const hours12 = hours24 % 12 || 12
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ampm = hours24 >= 12 ? 'PM' : 'AM'

    // Month and day names
    const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday']
    const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Token mapping functions
    const tokenHandlers = {
      // Year tokens
      YYYY: () => String(year), // 2023
      yyyy: () => String(year), // 2023
      Y: () => String(year), // 2023
      YY: () => String(year).slice(-2), // 23
      yy: () => String(year).slice(-2), // 23
      y: () => String(year).slice(-2), // 23

      // Month tokens
      MMMM: () => monthNamesFull[month], // November
      MMM: () => monthNamesShort[month], // Nov
      MM: () => String(month + 1).padStart(2, '0'), // 11
      mm: () => String(month + 1).padStart(2, '0'), // 11
      M: () => monthNamesShort[month], // Nov
      F: () => monthNamesFull[month], // November
      n: () => String(month + 1), // 11
      m: () => String(month + 1), // 11

      // Week Tokens
      wY: () => getWeekOfYear(date), // Week of the year (1-53)
      WY: () => getWeekOfYear(date), // Week of the year with leading(01-53)
      wM: () => getWeekOfMonth(date), // Week of the month (1-5)
      WM: () => getWeekOfMonth(date).padStart(2, '0'), // Week of the month with leading Zero (01-05)

      // Day tokens
      DD: () => String(day).padStart(2, '0'), // 05
      dd: () => String(day).padStart(2, '0'), // 05
      d: () => String(day), // 5
      D: () => dayNamesShort[dayOfWeek], // Wed
      j: () => String(day), // 5
      J: () => String(day) + dayOrdinal(day), // 5th
      l: () => dayNamesFull[dayOfWeek], // Wednesday
      w: () => String(dayOfWeek), // 3 (Sunday=0)

      // Hour tokens
      HH: () => String(hours24).padStart(2, '0'), // 15
      H: () => String(hours24), // 15
      hh: () => String(hours12).padStart(2, '0'), // 03
      h: () => String(hours12), // 3

      // Minute tokens
      II: () => String(minutes).padStart(2, '0'), // 05
      ii: () => String(minutes).padStart(2, '0'), // 05
      i: () => String(minutes).padStart(2, '0'), // 05
      I: () => String(minutes), // 5

      // Second tokens
      SS: () => String(seconds).padStart(2, '0'), // 09
      ss: () => String(seconds).padStart(2, '0'), // 09
      S: () => String(seconds).padStart(2, '0'), // 09
      s: () => String(seconds), // 9

      // AM/PM tokens
      K: () => ampm, // PM
      A: () => ampm, // PM
      a: () => ampm.toLowerCase(), // pm

      // Unix timestamp
      U: () => Math.floor(date.getTime() / 1000), // 1689277200
    }

    // Token regex - matches all supported tokens (longest first)
    const tokenRegex = /YYYY|yyyy|YY|yy|y|MMMM|MMM|MM|mm|F|M|m|n|wY|WY|wM|WM|DD|dd|d|D|j|J|l|w|HH|H|hh|h|II|ii|i|I|SS|ss|S|s|K|A|a|U/g

    // Replace tokens with actual values
    return expectedOutFormat.replace(tokenRegex, (match) => {
      // Handle known tokens
      if (tokenHandlers[match]) {
        return tokenHandlers[match]()
      }

      // Return original token if not recognized
      return match
    })
  } catch (error) {
    console.error('Error in formatDateTime:', error.message)
    return null
  }
}

// Ordinal suffix helper
const dayOrdinal = (day) => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

// Helper function to calculate the week number of the year
const getWeekOfYear = (date) => {
  const startYear = new Date(date.getFullYear(), 0, 1, 12, 0, 0, 0) // Noon to avoid DST
  const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  const days = Math.floor((endDate - startYear) / 86400000)
  return String(Math.floor((days + startYear.getDay()) / 7) + 1)
}

// Helper function to calculate the week number of the month
const getWeekOfMonth = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0) // Noon to avoid DST
  const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  const days = Math.floor((endDate - firstDayOfMonth) / 86400000)
  return String(Math.floor((days + firstDayOfMonth.getDay()) / 7) + 1)
}

// Preset format constants for common international formats
// const DATE_FORMAT_PRESETS = {
//   // ISO formats
//   ISO_DATE: 'Y-m-d', // 2024-01-15
//   ISO_DATETIME: 'Y-m-d H:i:S', // 2024-01-15 14:30:00
//   ISO_DATETIME_SHORT: 'Y-m-d H:i', // 2024-01-15 14:30

//   // US formats
//   US_DATE: 'n/j/Y', // 1/15/2024
//   US_DATE_LONG: 'F j, Y', // January 15, 2024
//   US_DATETIME: 'n/j/Y h:i K', // 1/15/2024 2:30 PM

//   // European formats
//   EU_DATE: 'j/n/Y', // 15/1/2024
//   EU_DATE_DOTS: 'j.n.Y', // 15.1.2024
//   EU_DATETIME: 'j/n/Y H:i', // 15/1/2024 14:30

//   // UK formats
//   UK_DATE: 'j-n-Y', // 15-1-2024
//   UK_DATE_LONG: 'j F Y', // 15 January 2024

//   // Asian formats
//   ASIAN_DATE: 'Y/m/d', // 2024/01/15
//   ASIAN_DATETIME: 'Y/m/d H:i', // 2024/01/15 14:30

//   // Custom readable formats
//   READABLE_DATE: 'l, F j, Y', // Monday, January 15, 2024
//   READABLE_DATETIME: 'l, F j, Y h:i K', // Monday, January 15, 2024 2:30 PM
//   SHORT_DATE: 'M j, Y', // Jan 15, 2024
//   TIME_12: 'h:i K', // 2:30 PM
//   TIME_24: 'H:i', // 14:30
//   TIME_FULL: 'H:i:S', // 14:30:45
// }

// Example usage:
// console.log('=== calculateDateTimeDifference Examples ===')
// console.log(calculateDateTimeDifference('2024-01-01', '2024-01-15', 'days')) // 14
// console.log(calculateDateTimeDifference('2024-01-01T10:00:00', '2024-01-01T14:30:00', 'hours')) // 4
// console.log(calculateDateTimeDifference('10:00:00', '14:30:00', 'minutes')) // 270
// console.log(calculateDateTimeDifference('today', '2024-12-31', 'days'))

// console.log('\n=== addSubtractDateTime Examples ===')
// console.log(addSubtractDateTime('2024-01-01', 15, 'days')) // "2024-01-16"
// console.log(addSubtractDateTime('2024-01-01T10:00:00', 2, 'hours')) // "2024-01-01T12:00:00"
// console.log(addSubtractDateTime('10:00', 30, 'minutes')) // "10:30"
// console.log(addSubtractDateTime('2024-01', 3, 'months')) // "2024-04"
// console.log(addSubtractDateTime('2024-01-15', 1, 'weeks', true)) // "2024-01-08" (subtract)

// console.log('\n=== formatDateTime Examples ===')
// console.log(formatDateTime('2024-01-15T14:30:45', 'YYYY/MM/DD h:i K')) // "2024/01/15 2:30 PM"
// console.log(formatDateTime('2024-01-15', 'dd, MMM YYYY')) // "15, Jan 2024"
// console.log(formatDateTime('today', 'l, F j, Y')) // "Monday, January 15, 2024" (example)
// console.log(formatDateTime('2024-01-15T14:30:45', DATE_FORMAT_PRESETS.READABLE_DATETIME)) // Using preset

// console.log('\n=== International Format Examples ===')
// console.log('US:', formatDateTime('2024-01-15T14:30:45', DATE_FORMAT_PRESETS.US_DATETIME))
// console.log('EU:', formatDateTime('2024-01-15T14:30:45', DATE_FORMAT_PRESETS.EU_DATETIME))
// console.log('UK:', formatDateTime('2024-01-15T14:30:45', DATE_FORMAT_PRESETS.UK_DATE_LONG))
// console.log('Asian:', formatDateTime('2024-01-15T14:30:45', DATE_FORMAT_PRESETS.ASIAN_DATETIME))
