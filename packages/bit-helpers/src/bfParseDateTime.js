/**
 * Parses various date/time strings to Date objects
 * @param {string} dateTimeStr - Date/time string to parse
 * @returns {Date} Parsed Date object
 */
export default function bfParseDateTime(dateTimeStr) {
  try {
    let normalizeString = dateTimeStr.trim().toLocaleLowerCase()
    // Remove surrounding quotes if present
    normalizeString = normalizeString.replace(/^['"]|['"]$/g, '')
    if (normalizeString === 'today' || normalizeString === 'now') {
      return new Date()
    }

    // Handle different formats
    if (normalizeString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Date format: YYYY-MM-DD
      return new Date(normalizeString)
    }

    if (normalizeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/)) {
      // Datetime-local format: YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS
      if (!normalizeString.includes(':00:00') && normalizeString.split(':').length === 2) {
        normalizeString += ':00' // Add seconds if missing
      }
      return new Date(normalizeString)
    }

    if (normalizeString.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      // Time format: HH:mm or HH:mm:ss
      const [hours, minutes, seconds] = normalizeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours, 10))
      date.setMinutes(parseInt(minutes, 10))
      date.setSeconds(seconds ? parseInt(seconds, 10) : 0)
      return date
    }

    if (normalizeString.match(/^\d{4}-W\d{2}$/i)) {
      // Week format: YYYY-Www
      const [year, week] = normalizeString.split(/-W/i)
      const date = new Date(year, 0, 1 + (week - 1) * 7)
      return date
    }

    if (normalizeString.match(/^\d{4}-\d{2}$/)) {
      // Month format: YYYY-MM
      return new Date(`${normalizeString}-01`)
    }

    if (typeof bfParseSpecialDateFormat !== 'undefined') {
      return bfParseSpecialDateFormat(normalizeString)
    }

    // Fallback to default Date parsing
    return new Date(normalizeString)
  } catch (error) {
    console.error('Error In DateTime Parse'.error.message)
    return new Date()
  }
}
