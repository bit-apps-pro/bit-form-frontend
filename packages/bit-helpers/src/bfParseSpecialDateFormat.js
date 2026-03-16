/**
 * Parses common date/time strings to Date objects
 * @param {string} dateTimeStr - Date/time string to parse
 * @returns {Date} Parsed Date object
 */
export default function bfParseSpecialDateFormat(dateTimeStr) {
  try {
    const str = dateTimeStr.trim()
    const lowerStr = str.toLowerCase()

    // Handle special cases
    if (lowerStr === 'today' || lowerStr === 'now') {
      return new Date()
    }

    // Supported formats with types
    const formats = [
      // ISO 8601 Formats
      { pattern: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/, type: 'iso' },
      { pattern: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/, type: 'iso-short' },

      // YYYY-MM-DD Variants
      { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, type: 'date-time' },
      { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i, type: 'date-time-12h' },
      { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/, type: 'date-time-short' },
      { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2}) (AM|PM)$/i, type: 'date-time-short-12h' },

      // YYYY.MM.DD Variants
      { pattern: /^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, type: 'date-dot-time' },
      { pattern: /^(\d{4})\.(\d{2})\.(\d{2}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i, type: 'date-dot-time-12h' },
      { pattern: /^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/, type: 'date-dot-time-short' },
      { pattern: /^(\d{4})\.(\d{2})\.(\d{2}) (\d{1,2}):(\d{2}) (AM|PM)$/i, type: 'date-dot-time-short-12h' },

      // YYYY/MM/DD Variants
      { pattern: /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, type: 'date-slash-time' },
      { pattern: /^(\d{4})\/(\d{2})\/(\d{2}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i, type: 'date-slash-time-12h' },
      { pattern: /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/, type: 'date-slash-time-short' },
      { pattern: /^(\d{4})\/(\d{2})\/(\d{2}) (\d{1,2}):(\d{2}) (AM|PM)$/i, type: 'date-slash-time-short-12h' },

      // Date-Only Formats
      { pattern: /^(\d{4})-(\d{2})-(\d{2})$/, type: 'date-only' },
      { pattern: /^(\d{4})\.(\d{2})\.(\d{2})$/, type: 'date-dot-only' },
      { pattern: /^(\d{4})\/(\d{2})\/(\d{2})$/, type: 'date-slash-only' },

      // US Formats (MM/DD/YYYY)
      { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i, type: 'us-date-time-12h' },
      { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}) (AM|PM)$/i, type: 'us-date-time-short-12h' },
      { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})$/, type: 'us-date-time-short' },
      { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, type: 'us-date-only' },
      { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, type: 'us-date-short-year' },

      // European Formats (DD.MM.YYYY)
      { pattern: /^(\d{1,2})\.(\d{1,2})\.(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/, type: 'european-date-time' },
      { pattern: /^(\d{1,2})\.(\d{1,2})\.(\d{4}) (\d{1,2}):(\d{2})$/, type: 'european-date-time-short' },
      { pattern: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, type: 'european-date-only' },

      // Time-Only Formats
      { pattern: /^(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i, type: 'time-12h' },
      { pattern: /^(\d{1,2}):(\d{2}) (AM|PM)$/i, type: 'time-short-12h' },
      { pattern: /^(\d{2}):(\d{2}):(\d{2})$/, type: 'time-24h' },
      { pattern: /^(\d{2}):(\d{2})$/, type: 'time-short-24h' },
    ]

    let parsedDate = null

    // Use Array.some() instead of for...of to avoid ESLint warning
    formats.some(({ pattern, type }) => {
      const match = str.match(pattern)
      if (!match) return false // Continue to next pattern

      let year; let month; let day; let hours = 0; let minutes = 0; let
        seconds = 0
      let period = ''

      // Extract components based on format type
      switch (type) {
        // Year-first formats (ISO, YYYY-MM-DD, YYYY.MM.DD, YYYY/MM/DD)
        case 'iso':
        case 'iso-short':
        case 'date-time':
        case 'date-time-12h':
        case 'date-time-short':
        case 'date-time-short-12h':
        case 'date-dot-time':
        case 'date-dot-time-12h':
        case 'date-dot-time-short':
        case 'date-dot-time-short-12h':
        case 'date-slash-time':
        case 'date-slash-time-12h':
        case 'date-slash-time-short':
        case 'date-slash-time-short-12h':
        case 'date-only':
        case 'date-dot-only':
        case 'date-slash-only':
          year = parseInt(match[1], 10)
          month = parseInt(match[2], 10) - 1
          day = parseInt(match[3], 10)

          // Time components
          if (match[4]) hours = parseInt(match[4], 10)
          if (match[5]) minutes = parseInt(match[5], 10)
          if (match[6]) seconds = parseInt(match[6], 10)
          if (match[7]) period = match[7].toUpperCase()
          break

        // US formats (MM/DD/YYYY)
        case 'us-date-time-12h':
        case 'us-date-time-short-12h':
        case 'us-date-time-short':
        case 'us-date-only':
        case 'us-date-short-year':
          month = parseInt(match[1], 10) - 1
          day = parseInt(match[2], 10)
          year = parseInt(match[3], 10)

          // Handle 2-digit years
          if (year < 100) year = 2000 + year

          // Time components
          if (match[4]) hours = parseInt(match[4], 10)
          if (match[5]) minutes = parseInt(match[5], 10)
          if (match[6]) seconds = parseInt(match[6], 10)
          if (match[7]) period = match[7].toUpperCase()
          break

        // European formats (DD.MM.YYYY)
        case 'european-date-time':
        case 'european-date-time-short':
        case 'european-date-only':
          day = parseInt(match[1], 10)
          month = parseInt(match[2], 10) - 1
          year = parseInt(match[3], 10)

          // Time components
          if (match[4]) hours = parseInt(match[4], 10)
          if (match[5]) minutes = parseInt(match[5], 10)
          if (match[6]) seconds = parseInt(match[6], 10)
          break

        // Time-only formats
        case 'time-12h':
        case 'time-short-12h':
        case 'time-24h':
        case 'time-short-24h': {
          const now = new Date()
          year = now.getFullYear()
          month = now.getMonth()
          day = now.getDate()

          hours = parseInt(match[1], 10)
          minutes = parseInt(match[2], 10)
          if (match[3]) seconds = parseInt(match[3], 10)
          if (match[4]) period = match[4].toUpperCase()
          break
        }
        default:
          return false // Continue to next pattern
      }

      // Handle 12-hour time
      if (period === 'PM' && hours < 12) {
        hours += 12
      } else if (period === 'AM' && hours === 12) {
        hours = 0
      }

      parsedDate = new Date(year, month, day, hours, minutes, seconds)
      return true // Stop iterating
    })

    if (parsedDate) {
      return parsedDate
    }

    // Fallback to native Date parsing
    return new Date(str)
  } catch (error) {
    console.error('Error in DateTime Parse:', error.message)
    return new Date()
  }
}
