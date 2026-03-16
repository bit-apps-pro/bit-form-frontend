/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-cycle */
import { useAtomValue } from 'jotai'
import { $bits } from '../../GlobalStates/GlobalStates'
import templateList from './templateList'

export const getTemplateImagePath = (fileName) => {
  const bits = useAtomValue($bits)
  if (!fileName || fileName === '') return `${bits?.templatePath}/form-basic.png`
  return `${bits?.templatePath}/${fileName}`
}

// for first later capitalization
export const ucFirst = (str) => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const templateMenuList = () => {
  const categoryCounts = templateList.reduce((acc, template) => {
    const category = template.category.toLowerCase()

    if (!acc[category]) {
      acc[category] = {
        count: 0,
        new: false,
        newCount: 0,
      }
    }

    acc[category].count++

    if (template.isNew) {
      acc[category].new = true
      acc[category].newCount++
    }

    return acc
  }, {})

  const result = Object.keys(categoryCounts).toSorted().map((category) => ({
    category,
    name: ucFirst(category),
    count: categoryCounts[category].count,
    isNew: categoryCounts[category].new,
    newCount: categoryCounts[category].newCount,
  }))

  return result
}

export const searchTemplateItem = (searchKey) => templateList.filter(({ title, tag }) => title.toLowerCase().includes(searchKey)
  || tag.toLowerCase().includes(searchKey))

export const getTemplateByCategory = () => templateList.reduce((acc, temp) => {
  const category = temp.category.toLowerCase()
  if (!acc[category]) {
    acc[category] = []
  }
  acc[category].push(temp)
  return acc
}, {})

export function replaceFldKey(obj, searchPattern, replacePattern) {
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        replaceFldKey(obj[key], searchPattern, replacePattern)
      }
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(searchPattern, replacePattern)
      }
      if (key.match(searchPattern)) {
        const newKey = key.replace(searchPattern, replacePattern)
        obj[newKey] = obj[key]
        delete obj[key]
      }
    }
  }
}

// temporary block this function

// export function replaceLayoutKeys(obj, searchPattern, replacePattern) {
//   if (typeof obj === 'string') {
//     return obj.replace(searchPattern, replacePattern)
//   }
//   if (Array.isArray(obj)) {
//     return obj.map(item => replaceLayoutKeys(item, searchPattern, replacePattern))
//   }
//   if (typeof obj === 'object' && obj !== null) {
//     const newObj = {}
//     for (const [key, value] of Object.entries(obj)) {
//       const newKey = key.replace(searchPattern, replacePattern)
//       newObj[newKey] = replaceLayoutKeys(value, searchPattern, replacePattern)
//     }
//     return newObj
//   }
//   return obj
// }

export function replaceKeyValue(obj, searchPattern, replacePattern) {
  if (typeof obj === 'string') {
    return obj.replace(searchPattern, replacePattern)
  }
  if (Array.isArray(obj)) {
    return obj.map(item => replaceKeyValue(item, searchPattern, replacePattern))
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj = {}
    for (const [key, value] of Object.entries(obj)) {
      // if will need to replace the key
      const newKey = key.replace(searchPattern, replacePattern)
      newObj[newKey] = replaceKeyValue(value, searchPattern, replacePattern)
    }
    return newObj
  }
  return obj
}

export function replaceLayoutKeyValue(obj, searchPattern, replacePattern) {
  const newObj = replaceKeyValue(obj, searchPattern, replacePattern)

  if (Array.isArray(newObj)) {
    newObj.forEach(item => {
      if (item.layout) {
        const { layout } = item
        const lgLayout = layout.lg
        if (lgLayout) {
          if (typeof layout.md === 'undefined' || layout.md.length === 0) {
            item.layout.md = item.layout.lg
          }
          if (typeof layout.sm === 'undefined' || layout.sm.length === 0) {
            item.layout.sm = item.layout.lg
          }
        }
      }
    })
  }
  if (typeof newObj === 'object') {
    if (newObj) {
      const lgLayout = newObj.lg
      if (lgLayout) {
        if (typeof newObj.md === 'undefined' || newObj.md.length === 0) {
          newObj.md = lgLayout
        }
        if (typeof newObj.sm === 'undefined' || newObj.sm.length === 0) {
          newObj.sm = lgLayout
        }
      }
    }
  }
  return newObj
}

export function replaceConditionFldKeyWithFormId(obj, replacementKey) {
  if (typeof obj === 'string') {
    return obj.includes('fld_key') ? obj.replace(/fld_key/g, replacementKey) : obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceConditionFldKeyWithFormId(item, replacementKey))
  }

  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = replaceConditionFldKeyWithFormId(obj[key], replacementKey)
    }
  }

  return obj
}

export function compareVersions(installedVersion, requiredVersion) {
  if (!installedVersion || !requiredVersion) return false
  const installedParts = installedVersion.split('.').map(Number)
  const requiredParts = requiredVersion.split('.').map(Number)
  const maxLen = Math.max(installedParts.length, requiredParts.length)

  for (let i = 0; i < maxLen; i++) {
    const installed = parseInt(installedParts[i] || '0', 10)
    const required = parseInt(requiredParts[i] || '0', 10)

    if (installed > required) {
      return true // Installed version is higher
    } if (installed < required) {
      return false // Installed version is lower
    }
  }
  return true // Versions are equal
}

/**
 * This function is currently not used, but it was designed to replace form IDs in styles.
 * Replaces all occurrences of `fld_key-{id}` or `b{oldFormId}-{id}` in the keys and string values
 * of a nested object with `b{newFormId}-{id}`.
 */

// export function replaceFormIdInStyles(styleObject, newFormId) {
//   let oldFormId = null

//   const formIdRegex = /b(\d+)-\d+/

//   const detectFormId = (obj) => {
//     if (typeof obj === 'string') {
//       const match = obj.match(formIdRegex)
//       if (match) return match[1]
//     } else if (typeof obj === 'object' && obj !== null) {
//       for (const key in obj) {
//         const match = key.match(formIdRegex)
//         if (match) return match[1]
//         const fromValue = detectFormId(obj[key])
//         if (fromValue) return fromValue
//       }
//     }
//     return null
//   }

//   oldFormId = detectFormId(styleObject)
//   if (!oldFormId) throw new Error('Old form ID not found!')

//   const replaceIds = (input) => {
//     if (typeof input === 'string') {
//       return input.replace(new RegExp(`b${oldFormId}-(\\d+)`, 'g'), `b${newFormId}-$1`)
//     } if (Array.isArray(input)) {
//       return input.map(replaceIds)
//     } if (typeof input === 'object' && input !== null) {
//       const replaced = {}
//       for (const key in input) {
//         const newKey = key.replace(new RegExp(`b${oldFormId}-(\\d+)`, 'g'), `b${newFormId}-$1`)
//         replaced[newKey] = replaceIds(input[key])
//       }
//       return replaced
//     }
//     return input
//   }

//   return replaceIds(styleObject)
// }

/**
 * Recursively traverses a nested object and replaces keys or string values that match
 * the pattern `fld_key-{id}` or `b{oldFormId}-{id}` with `b{newFormId}-{id}`.
 *
 * ### Key Transformations:
 * - `fld_key-1` → `b{newFormId}-1`
 * - `b99-10` → `b{newFormId}-10`
 * - Strings like `.fld_key-1-btn` or `.b99-10-opt` → `.b{newFormId}-1-btn` or `.b{newFormId}-10-opt`
 *
 * @param {Object|Array|string} obj - The input object, array, or string to transform.
 * @param {number|string} newFormId - The new form ID to replace `fld_key` or existing `b{oldFormId}` with.
 * @returns {Object|Array|string} A deep-cloned version of the input with all matching keys and string values updated.
 *
 * @example
 * const updated = replaceFormIdInStyles(originalObject, 12);
 * console.log(updated.fields["b12-1"]); // Previously was "fld_key-1"
 *
 * @note
 * This function preserves structure and only updates matching keys and strings,
 * making it ideal for theming or configuration transformation.
 */
export function replaceFormIdInStyles(obj, newFormId) {
  const fldKeyRegex = /^fld_key-(\d+)$/
  const bRegex = /^b\d+-(\d+)$/
  const insideStringRegex = /(fld_key|b\d+)-(\d+)/g

  function recursiveReplace(input) {
    if (typeof input === 'string') {
      return input.replace(insideStringRegex, (_, prefix, id) => `b${newFormId}-${id}`)
    }

    if (Array.isArray(input)) {
      return input.map(recursiveReplace)
    }

    if (input && typeof input === 'object') {
      const newObj = {}
      for (const key in input) {
        let newKey = key

        if (fldKeyRegex.test(key)) {
          const id = key.match(fldKeyRegex)[1]
          newKey = `b${newFormId}-${id}`
        } else if (bRegex.test(key)) {
          const id = key.match(bRegex)[1]
          newKey = `b${newFormId}-${id}`
        } else {
          newKey = key.replace(insideStringRegex, (_, prefix, id) => `b${newFormId}-${id}`)
        }

        newObj[newKey] = recursiveReplace(input[key])
      }
      return newObj
    }

    return input
  }

  return recursiveReplace(obj)
}

/**
 * Replace old form ID digits in keys/values (e.g., b12-1, _frm-bg-b12) with a new form ID.
 *
 * @param {Object} obj - The original object to be updated
 * @param {number|string} newFormId - The new form ID to replace existing digits with
 * @returns {Object} - Updated object with form ID digits replaced
 */
export function replaceFormIdDigits(obj, newFormId) {
  const regex = /(?<=\b(?:b|_frm-bg-b|_frm-b))\d+(?=\b)/g

  const jsonString = JSON.stringify(obj)

  const replaced = jsonString.replace(regex, String(newFormId))

  return JSON.parse(replaced)
}
