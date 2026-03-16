/* eslint-disable no-nested-ternary */

import { mutate } from 'swr'
import { getAtom, setAtom } from '../GlobalStates/BitStore'
import { $activeBuilderStep } from '../GlobalStates/FormBuilderStates'
import {
  $additionalSettings, $allLayouts,
  $bits,
  $breakpoint, $breakpointSize, $builderHelperStates, $builderHistory, $builderHookStates, $builderRightPanelScroll, $builderSettings, $colorScheme, $confirmations, $customCodes, $deletedFldKey, $draggableModal, $draggingField, $fieldLabels, $fields, $flags, $formAbandonment, $formId, $formInfo, $formPermissions, $frontendTable, $frontendTables, $integrations, $isNewThemeStyleLoaded, $layouts, $mailTemplates, $nestedLayouts, $newFormId, $pdfTemplates, $previewWindow, $reportId,
  $reportSelector,
  $reports,
  $selectedFieldId, $unsplashImgUrl, $unsplashMdl, $updateBtn, $workflows,
} from '../GlobalStates/GlobalStates'
import { $staticStylesState } from '../GlobalStates/StaticStylesState'
import {
  $styles, $stylesLgDark, $stylesLgLight, $stylesMdDark, $stylesMdLight, $stylesSmDark, $stylesSmLight,
} from '../GlobalStates/StylesState'
import { $darkThemeColors, $lightThemeColors } from '../GlobalStates/ThemeColorsState'
import { $themeVarsLgDark, $themeVarsLgLight, $themeVarsMdDark, $themeVarsMdLight, $themeVarsSmDark, $themeVarsSmLight } from '../GlobalStates/ThemeVarsState'
import confirmMsgCssStyles from '../components/ConfirmMessage/confirmMsgCssStyles'
import { updateGoogleFontUrl } from '../components/style-new/styleHelpers'
import { addToBuilderHistory, getLatestState, isValidJsonString, prepareLayout } from './FormBuilderHelper'
import atomicStyleGenarate, { generateNestedLayoutCSSText } from './atomicStyleGenarate'
import bitsFetch from './bitsFetch'
import { JCOF } from './globalHelpers'

/* eslint-disable no-param-reassign */
export const hideWpMenu = () => {
  document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  document.getElementsByClassName('wp-toolbar')[0].style.paddingTop = 0
  document.getElementById('wpadminbar').style.display = 'none'
  document.getElementById('adminmenumain').style.display = 'none'
  document.getElementById('adminmenuback').style.display = 'none'
  document.getElementById('adminmenuwrap').style.display = 'none'
  document.getElementById('wpfooter').style.display = 'none'
  document.getElementById('wpcontent').style.marginLeft = 0
}

export const isObjectEmpty = (obj) => obj
  && Object.getPrototypeOf(obj) === Object.prototype
  && Object.keys(obj).length === 0

export const isObject = obj => Object.getPrototypeOf(obj) === Object.prototype

export const showWpMenu = () => {
  document.getElementsByTagName('body')[0].style.overflow = 'auto'
  document.getElementsByClassName('wp-toolbar')[0].style.paddingTop = '32px'
  document.getElementById('wpadminbar').style.display = 'block'
  document.getElementById('adminmenumain').style.display = 'block'
  document.getElementById('adminmenuback').style.display = 'block'
  document.getElementById('adminmenuwrap').style.display = 'block'
  document.getElementById('wpcontent').style.marginLeft = null
  document.getElementById('wpfooter').style.display = 'block'
}

export const getNewId = flds => {
  let largestNumberFld = 0
  let num = 0
  const fldsArr = Object.keys(flds)
  fldsArr.map(fld => {
    if (fld !== null && fld !== undefined) {
      num = Number(fld.match(/-[0-9]+/g)?.[0]?.match(/[0-9]+/g))
      if (typeof num === 'number' && num > largestNumberFld) {
        largestNumberFld = num
      }
    }
  })
  return largestNumberFld + 1
}

export const assign = (obj, keyPath, value) => {
  const lastKeyIndex = keyPath.length - 1
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i]
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  obj[keyPath[lastKeyIndex]] = value
  return value
}

export const multiAssign = (obj, assignArr) => {
  for (let i = 0; i < assignArr.length; i += 1) {
    if (assignArr[i].delProp) {
      delete obj?.[assignArr[i].cls]?.[assignArr[i].property]
      if (obj[assignArr[i]?.cls]?.constructor === Object && Object.keys(obj?.[assignArr[i]?.cls]).length === 0) {
        delete obj[assignArr[i].cls]
      }
    } else {
      assign(obj, [assignArr[i].cls, assignArr[i].property], assignArr[i].value)
    }
  }
}

export const forEach = (array, iteratee) => {
  let index = -1
  const { length } = array
  // eslint-disable-next-line no-plusplus
  while (++index < length) {
    iteratee(array[index], index)
  }
  return array
}

export const deepCopy = (target, map = new WeakMap()) => {
  if (typeof target !== 'object' || target === null) {
    return target
  }
  const isArray = Array.isArray(target)
  const cloneTarget = isArray ? [] : {}

  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  if (isArray) {
    forEach(target, (value, index) => {
      cloneTarget[index] = deepCopy(value, map)
    })
  } else {
    forEach(Object.keys(target), key => {
      cloneTarget[key] = deepCopy(target[key], map)
    })
  }
  return cloneTarget
}

export const omitByObj = (mainObj, omitObj) => {
  const newObj = {}
  const mainObjKeys = Object.keys(mainObj)

  forEach(mainObjKeys, mainKey => {
    const currentMainObj = mainObj[mainKey]
    if (!(mainKey in omitObj)) {
      newObj[mainKey] = deepCopy(currentMainObj)
      return
    }
    const omittableObj = omitObj[mainKey]
    if (typeof omittableObj === 'object' && omittableObj !== null) {
      newObj[mainKey] = omitByObj(currentMainObj, omittableObj)
    }
  })

  return newObj
}

export const replaceFormId = (data, oldFormId, newFormId) => {
  const oldFormIdRegex = new RegExp(oldFormId, 'g')
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => replaceFormId(item, oldFormId, newFormId))
    }
    const newObj = {}
    forEach(Object.keys(data), key => {
      const newKey = key.replace(oldFormIdRegex, newFormId)
      newObj[newKey] = replaceFormId(data[key], oldFormId, newFormId)
    })
    return newObj
  }
  if (typeof data === 'string') {
    return data.replace(oldFormIdRegex, newFormId)
  }
  return data
}

export const sortArrOfObj = (data, sortLabel) => data.sort((a, b) => {
  if (a?.[sortLabel]?.toLowerCase() < b?.[sortLabel]?.toLowerCase()) return -1
  if (a?.[sortLabel]?.toLowerCase() > b?.[sortLabel]?.toLowerCase()) return 1
  return 0
})

export const dateTimeFormatter = (dateStr, format) => {
  const newDate = new Date(dateStr)

  if (newDate.toString() === 'Invalid Date') {
    return 'Invalid Date'
  }

  const allFormatObj = {}

  // Day
  allFormatObj.d = newDate.toLocaleDateString('en-US', { day: '2-digit' })
  allFormatObj.j = newDate.toLocaleDateString('en-US', { day: 'numeric' })
  let S = Number(allFormatObj.j)
  if (S % 10 === 1 && S !== 11) {
    S = 'st'
  } else if (S % 10 === 2 && S !== 12) {
    S = 'nd'
  } else if (S % 10 === 3 && S !== 13) {
    S = 'rd'
  } else {
    S = 'th'
  }
  allFormatObj.S = S
  // Weekday
  allFormatObj.l = newDate.toLocaleDateString('en-US', { weekday: 'long' })
  allFormatObj.D = newDate.toLocaleDateString('en-US', { weekday: 'short' })
  // Month
  allFormatObj.m = newDate.toLocaleDateString('en-US', { month: '2-digit' })
  allFormatObj.n = newDate.toLocaleDateString('en-US', { month: 'numeric' })
  allFormatObj.F = newDate.toLocaleDateString('en-US', { month: 'long' })
  allFormatObj.M = newDate.toLocaleDateString('en-US', { month: 'short' })
  // Year
  allFormatObj.Y = newDate.toLocaleDateString('en-US', { year: 'numeric' })
  allFormatObj.y = newDate.toLocaleDateString('en-US', { year: '2-digit' })
  // Time
  allFormatObj.a = newDate.toLocaleTimeString('en-US', { hour12: true }).split(/\s+/)[1].toLowerCase()
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.A = newDate.toLocaleTimeString('en-US', { hour12: true }).split(/\s+/)[1]
  // Hour
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.g = newDate.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric' }).split(/\s+/)[0]
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.h = newDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit' }).split(/\s+/)[0]
  allFormatObj.G = newDate.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric' })
  allFormatObj.H = newDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit' })
  // Minute
  allFormatObj.i = newDate.toLocaleTimeString('en-US', { minute: '2-digit' })
  // Second
  allFormatObj.s = newDate.toLocaleTimeString('en-US', { second: '2-digit' })
  // Additional
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.T = newDate.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(/\s+/)[2]
  allFormatObj.c = newDate.toISOString()
  allFormatObj.r = newDate.toUTCString()
  allFormatObj.U = newDate.valueOf()
  let formattedDate = ''

  const allFormatkeys = Object.keys(allFormatObj)

  for (let v = 0; v < format?.length; v += 1) {
    if (format[v] === '\\') {
      v += 1
      formattedDate += format[v]
    } else {
      const formatKey = allFormatkeys.find(key => key === format[v])
      formattedDate += formatKey ? format[v].replace(formatKey, allFormatObj[formatKey]) : format[v]
    }
  }

  return formattedDate
}

const cipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0))
  const byteHex = n => (`0${Number(n).toString(16)}`).substr(-2)
  // eslint-disable-next-line no-bitwise
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code)

  return text => text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('')
}

const decipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0))
  // eslint-disable-next-line no-bitwise
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => (a ^ b), code)
  return encoded => encoded
    .match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('')
}

export const bitCipher = cipher('btcd')
export const bitDecipher = decipher('btcd')

export function spreadIn4Value(value) {
  if (!value) return undefined
  const valArr = value.split(' ')
  if (valArr.length === 4) return value
  if (valArr.length === 1) return Array(4).fill(valArr[0]).join(' ')
  if (valArr.length === 2) return [valArr[0], valArr[1], valArr[0], valArr[1]].join(' ')
  if (valArr.length === 3) return [valArr[0], valArr[1], valArr[2], valArr[1]].join(' ')
  return value
}

export const checkValidEmail = email => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}
export const makeFieldsArrByLabel = (fields, labels = [], fldsToFilter = []) => {
  const fieldsArr = sortFieldsByLayout(fields)

  const fldArrByLabel = fieldsArr?.filter(fld => !fldsToFilter.includes(fld.typ)).map(fld => {
    const fldByLabel = labels.find(lbl => lbl.key === fld?.fldKey)
    return {
      ...fld,
      key: fld?.fldKey,
      type: fld.typ,
      name: fldByLabel?.adminLbl
        || fldByLabel?.name
        || fld.adminLbl
        || fld.lbl
        || fld.txt // for submit button
        || fld?.fldKey,
    }
  })

  // return sortArrOfObj(fldArrByLabel, 'name')
  return fldArrByLabel
}

export const sortFieldsByLayout = (fields) => {
  const allLayouts = getAtom($allLayouts)
  const nestedLayouts = getAtom($nestedLayouts)

  const fieldsArr = []
  const addedKeys = new Set()
  const processLayout = (layout) => {
    layout?.lg?.forEach(layObj => {
      if (fields[layObj.i]) {
        fieldsArr.push({ ...fields[layObj.i], fldKey: layObj.i })
        addedKeys.add(layObj.i)
      }
      if (nestedLayouts[layObj.i]) {
        nestedLayouts[layObj.i]?.lg?.forEach(nestedLayObj => {
          if (fields[nestedLayObj.i]) {
            fieldsArr.push({ ...fields[nestedLayObj.i], fldKey: nestedLayObj.i })
            addedKeys.add(nestedLayObj.i)
          }
        })
      }
    })
  }

  if (Array.isArray(allLayouts)) {
    allLayouts.forEach(layout => processLayout(layout?.layout))
  } else {
    processLayout(allLayouts)
  }

  // Push remaining fields that were not added
  Object.keys(fields).forEach(key => {
    if (!addedKeys.has(key)) {
      fieldsArr.push({ ...fields[key], fldKey: key })
    }
  })
  return fieldsArr
}

export const getFileExts = filename => filename.split('.').pop()

export const csvToJson = (string, delimiter = ',') => {
  const regex = new RegExp(`\\s*(")?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs')
  const match = str => [...str.matchAll(regex)].map(matc => matc[2])
    .filter((_, i, a) => i < a.length - 1)

  const lines = string.split('\n')
  const heads = match(lines.splice(0, 1)[0])

  return lines.map(line => match(line).reduce((acc, cur, i) => ({
    ...acc,
    [heads[i] || `extra_${i}`]: ((cur.length > 0) ? (Number(cur) || cur) : '').trim(),
  }), {}))
}

export const isType = (type, val) => !!(val?.constructor && val.constructor.name.toLowerCase() === type.toLowerCase())

export const firstCharCap = str => str.charAt(0).toUpperCase() + str.slice(1)

export const getFormsFromPhpVariable = (status) => {
  let allForms = []
  if (typeof bits !== 'undefined'
    //  eslint-disable-next-line no-undef
    && bits.allForms !== null) {
    if (status) {
      allForms = bits.allForms.filter(form => form.status === status)
    } else {
      allForms = bits.allForms
    }
    //  eslint-disable-next-line no-undef
    allForms = allForms.map(form => (
      {
        formID: form.id,
        status: form.status !== '0',
        formName: form.form_name,
        shortcode: `bitform id='${form.id}'`,
        entries: form.entries,
        views: form.views,
        created_at: form.created_at,
      }))
  }
  return allForms
}
export const getNewFormId = (allForms) => {
  let max = 0
  allForms.map(frm => {
    const fid = Number(frm.formID)
    if (fid > max) {
      max = fid
    }
  })
  return max + 1
}

export const getNewTableId = (bits, tableId) => {
  console.log({ tableId })
  let newTableId
  if (tableId === 0) {
    newTableId = parseInt(bits.tablesLastId) + 1
  } else {
    newTableId = tableId + 1
  }
  console.log({ newTableId })
  return newTableId
}

export const sortByField = (array, fieldKey, typ) => array.sort((a, b) => {
  const x = a[fieldKey]
  const y = b[fieldKey]
  if (typ === 'ASC') {
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
  return ((y < x) ? -1 : ((y > x) ? 1 : 0))
})

export const getIconsGlobalFilterVariable = (iconType) => {
  let variableName = ''
  switch (iconType) {
    case 'lblPreIcn':
      variableName = '--lbl-pre-i-fltr'
      break
    case 'lblSufIcn':
      variableName = '--lbl-suf-i-fltr'
      break
    case 'subTlePreIcn':
      variableName = '--sub-titl-pre-i-fltr'
      break
    case 'subTleSufIcn':
      variableName = '--sub-titl-suf-i-fltr'
      break
    case 'prefixIcn':
      variableName = '--pre-i-fltr'
      break
    case 'suffixIcn':
      variableName = '--suf-i-fltr'
      break
    case 'hlpPreIcn':
      variableName = '--hlp-txt-pre-i-fltr'
      break
    case 'hlpSufIcn':
      variableName = '--hlp-txt-suf-i-fltr'
      break
    case 'btnPreIcn':
      variableName = '--lbl-pre-i-fltr'
      break
    case 'btnSufIcn':
      variableName = '--lbl-pre-i-fltr'
      break
    case 'errPreIcn':
      variableName = '--err-txt-pre-i-fltr'
      break
    case 'errSufIcn':
      variableName = '--err-txt-suf-i-fltr'
      break
    case 'titlePreIcn':
      variableName = '--lbl-pre-i-fltr'
      break
    case 'titleSufIcn':
      variableName = '--lbl-pre-i-fltr'
      break
    default:
      variableName = ''
  }
  return variableName
}

export const getIconsParentElement = (iconType) => {
  let parentElement = ''
  switch (iconType) {
    case 'lblPreIcn':
    case 'lblSufIcn':
      parentElement = 'lbl'
      break
    case 'subTlePreIcn':
    case 'subTleSufIcn':
      parentElement = 'sub-titl'
      break
    case 'hlpPreIcn':
    case 'hlpSufIcn':
      parentElement = 'hlp-txt'
      break
    case 'btnPreIcn':
    case 'btnSufIcn':
      parentElement = 'btn'
      break
    case 'errPreIcn':
    case 'errSufIcn':
      parentElement = 'err-msg'
      break
    case 'titlePreIcn':
    case 'titleSufIcn':
      parentElement = 'title'
      break
    case 'subTitlPreIcn':
    case 'subTitlSufIcn':
      parentElement = 'sub-titl'
      break
    default:
      parentElement = 'fld'
  }
  return parentElement
}

/**
 * First letter uppercase
 * @function ucFirst
 * @param {String} str
 * @returns String
 */
export const ucFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1)
const divide = (dividend, divisor) => {
  let returnValue = ''
  let remainder = 0
  let currentDividend = 0
  let currentQuotient

  dividend.split('').forEach((digit, index) => {
    // use classical digit by digit division
    if (currentDividend !== 0) {
      currentDividend *= 10
    }
    currentDividend += Number(digit)

    if (currentDividend >= divisor) {
      currentQuotient = Math.floor(currentDividend / divisor)
      currentDividend -= currentQuotient * divisor
      returnValue += currentQuotient.toString()
    } else if (returnValue.length > 0) {
      returnValue += '0'
    }

    if (index === dividend.length - 1) {
      remainder = currentDividend
    }
  })

  return {
    quotient: returnValue.length === 0 ? '0' : returnValue,
    remainder,
  }
}

/**
 * It converts an IP address from a number to a string
 * @returns A string of the IP address.
 */
export const number2Ipv4 = ipNumber => {
  let ipAddr = ipNumber % 256
  for (let i = 3; i > 0; i -= 1) {
    ipNumber = Math.floor(ipNumber / 256)
    ipAddr = `${ipNumber % 256}.${ipAddr}`
  }
  return ipAddr
}

export const number2Ipv6 = ipNumber => {
  const base = 16
  const blocks = []
  const blockSize = 2 ** 16

  while (blocks.length < 8) {
    const divisionResult = divide(ipNumber, blockSize)

    blocks.unshift(divisionResult.remainder.toString(base))

    ipNumber = divisionResult.quotient
  }

  return blocks.join(':')
}

export const formatIpNumbers = ipNumber => {
  const ipNumStr = ipNumber.toString()
  if (ipNumber.length <= 11) return number2Ipv4(ipNumStr)
  return number2Ipv6(ipNumStr)
}

export const compareBetweenVersions = (ver1, ver2) => {
  //   0: ver1 & ver2 are equal
  //   1: ver1 is greater than ver2
  //  -1: ver2 is greater than ver1
  try {
    const num1 = typeof ver1 === 'number' ? ver1.toString() : ver1
    const num2 = typeof ver2 === 'number' ? ver2.toString() : ver2

    return num1.localeCompare(num2, undefined, { numeric: true, sensitivity: 'base' })
  } catch (_) {
    return -1
  }
}

export const isFirefox = () => navigator.userAgent.includes('Firefox')

export const getStatesToReset = () => [
  $additionalSettings,
  $breakpoint,
  $breakpointSize,
  $builderHistory,
  $builderHelperStates,
  $builderHookStates,
  $builderRightPanelScroll,
  $builderSettings,
  $confirmations,
  $formPermissions,
  $colorScheme,
  $customCodes,
  $draggingField,
  $deletedFldKey,
  $draggableModal,
  $previewWindow,
  $formId,
  $formInfo,
  $fieldLabels,
  $fields,
  $flags,
  $integrations,
  $isNewThemeStyleLoaded,
  $allLayouts,
  $nestedLayouts,
  $mailTemplates,
  $pdfTemplates,
  $reports,
  $reportId,
  $selectedFieldId,
  $updateBtn,
  $unsplashMdl,
  $unsplashImgUrl,
  $workflows,
  $formAbandonment,
  $activeBuilderStep,

  $lightThemeColors,
  $darkThemeColors,

  $stylesLgLight,
  $stylesLgDark,
  $stylesMdLight,
  $stylesMdDark,
  $stylesSmLight,
  $stylesSmDark,

  $themeVarsLgLight,
  $themeVarsLgDark,
  $themeVarsMdLight,
  $themeVarsMdDark,
  $themeVarsSmLight,
  $themeVarsSmDark,

  $styles,

  $frontendTables,
  $frontendTable,
]

export const trimCSS = (cssStr = '') => cssStr.replace(/\/\*[^*]*\*+([^/][^*]*\*+)*\//g, '').replace(/\n/gm, '')

export const debouncer = (name, func, wait = 300) => {
  if (debouncer[name]) {
    clearTimeout(debouncer[name])
  }

  debouncer[name] = setTimeout(() => {
    func()
    delete debouncer[name]
  }, wait)

  return debouncer[name]
}

export const setFormReponseDataToStates = (responseData) => {
  const defaultReport = responseData?.reports?.find(report => report.isDefault.toString() === '1')
  const formsSessionDataFound = false
  if (!formsSessionDataFound) {
    setAtom($layouts, responseData.form_content.layout)
    setAtom($nestedLayouts, responseData.form_content.nestedLayout)
    setAtom($fields, responseData.form_content.fields)
    setAtom($formInfo, oldInfo => ({ ...oldInfo, ...responseData.form_content.formInfo, formName: responseData.form_content.form_name }))
    addToBuilderHistory({
      state: {
        $allLayouts: getLatestState('allLayouts'),
        nestedLayouts: responseData.form_content.nestedLayout,
        fields: responseData.form_content.fields,
        formInfo: { ...responseData.form_content.formInfo, ormName: responseData.form_content.form_name },
      },
    }, false, 0)
  }
  setAtom($workflows, responseData.workFlows)
  setAtom($additionalSettings, responseData.additional)
  setAtom($integrations, responseData.formSettings.integrations)
  setAtom($confirmations, responseData.formSettings.confirmation)
  setAtom($formPermissions, responseData.formSettings.formPermissions)
  setAtom($mailTemplates, responseData.formSettings.mailTem)
  if (!formsSessionDataFound && responseData.builderSettings) setAtom($builderSettings, responseData.builderSettings)
  setAtom($reportId, {
    id: responseData?.form_content?.report_id || defaultReport?.id,
    isDefault: responseData?.form_content?.report_id === null,
  })
  setAtom($fieldLabels, responseData.Labels)
  setAtom($reports, responseData.reports || [])
  setAtom($customCodes, responseData.customCode)
}

export const getConfirmationStyle = (formData) => {
  const confirmations = []
  formData?.formSettings?.confirmation?.type?.successMsg?.forEach((msgObj) => {
    if (msgObj.id && msgObj.config) {
      const { config } = msgObj
      confirmations.push({
        confMsgId: msgObj.id,
        style: confirmMsgCssStyles(formData.id, msgObj.id, config.msgType, config.position, config.animation, config.styles),
      })
    }
  })

  return confirmations
}

export const setStyleRelatedStates = ({ themeVars, themeColors, styles }) => {
  setAtom($themeVarsLgLight, themeVars.lgLightThemeVars)
  setAtom($themeVarsLgDark, themeVars.lgDarkThemeVars)
  setAtom($themeVarsMdLight, themeVars.mdLightThemeVars)
  setAtom($themeVarsMdDark, themeVars.mdDarkThemeVars)
  setAtom($themeVarsSmLight, themeVars.smLightThemeVars)
  setAtom($themeVarsSmDark, themeVars.smDarkThemeVars)

  setAtom($lightThemeColors, themeColors.lightThemeColors)
  setAtom($darkThemeColors, themeColors.darkThemeColors)

  setAtom($stylesLgLight, styles.lgLightStyles)
  setAtom($stylesLgDark, styles.lgDarkStyles)
  setAtom($stylesMdLight, styles.mdLightStyles)
  setAtom($stylesMdDark, styles.mdDarkStyles)
  setAtom($stylesSmLight, styles.smLightStyles)
  setAtom($stylesSmDark, styles.smDarkStyles)
}

export const generateAndSaveAtomicCss = currentFormId => {
  const styles = getAtom($styles)
  const allLayouts = getAtom($allLayouts)
  const builderHelperStates = getAtom($builderHelperStates)
  const isStyleNotLoaded = isObjectEmpty(styles) || styles === undefined
  let sortedLayout = []
  if (Array.isArray(allLayouts)) {
    sortedLayout = allLayouts.reduce((acc, lay) => {
      const sorted = prepareLayout(lay.layout, builderHelperStates.respectLGLayoutOrder)
      const newLayout = { ...lay, layout: sorted }
      acc.push(newLayout)
      return acc
    }, [])
  } else {
    sortedLayout = prepareLayout(allLayouts, builderHelperStates.respectLGLayoutOrder)
  }
  if (isStyleNotLoaded) {
    const { sortedNestedLayouts } = generateNestedLayoutCSSText()
    return { layouts: sortedLayout, nestedLayouts: sortedNestedLayouts }
  }

  const generatedAtomicStyles = atomicStyleGenarate({ sortedLayout })

  generatedAtomicStyles.layouts = sortedLayout

  if (!currentFormId) return generatedAtomicStyles

  const { atomicCssText, atomicClassMap, lgLightStyles } = generatedAtomicStyles
  const { atomicCssText: atomicCssWithFormIdText, atomicClassMap: atomicClassMapWithFormId } = atomicStyleGenarate({ sortedLayout, atomicClassSuffix: currentFormId })

  if (lgLightStyles?.font?.fontURL) {
    atomicClassMap.font = lgLightStyles.font.fontURL
    atomicClassMapWithFormId.font = lgLightStyles.font.fontURL
  }
  const atomicData = {
    form_id: currentFormId,
    atomicCssText,
    atomicCssWithFormIdText,
    atomicClassMap,
    atomicClassMapWithFormId,
  }

  bitsFetch(atomicData, 'bitforms_save_css')
    .catch(err => console.error('save css error=', err))

  return generatedAtomicStyles
}

export const generateUpdateFormData = (savedFormId) => {
  const newFormId = getAtom($newFormId)
  const currentReport = getAtom($reportSelector)
  const fields = getAtom($fields)
  const formInfo = getAtom($formInfo)
  const reportId = getAtom($reportId)
  const additionalSettings = getAtom($additionalSettings)
  const workFlows = getAtom($workflows)
  const styles = getAtom($styles)
  const staticStylesState = getAtom($staticStylesState)
  const breakpointSize = getAtom($breakpointSize)
  const customCodes = getAtom($customCodes)
  const confirmations = getAtom($confirmations)
  const formPermissions = getAtom($formPermissions)
  const mailTemplates = getAtom($mailTemplates)
  const allIntegrations = getAtom($integrations)
  const builderSettings = getAtom($builderSettings)
  const deletedFldKey = getAtom($deletedFldKey)
  const { formName } = formInfo
  const {
    layouts,
    nestedLayouts,
    lightThemeColors,
    darkThemeColors,
    lgLightThemeVars,
    lgDarkThemeVars,
    mdLightThemeVars,
    mdDarkThemeVars,
    smLightThemeVars,
    smDarkThemeVars,
    lgLightStyles,
    lgDarkStyles,
    mdLightStyles,
    mdDarkStyles,
    smLightStyles,
    smDarkStyles,
  } = generateAndSaveAtomicCss(savedFormId)

  const allThemeColors = {
    lightThemeColors,
    darkThemeColors,
  }
  const allThemeVars = {
    lgLightThemeVars,
    lgDarkThemeVars,
    mdLightThemeVars,
    mdDarkThemeVars,
    smLightThemeVars,
    smDarkThemeVars,
  }
  let allStyles = {
    lgLightStyles,
    lgDarkStyles,
    mdLightStyles,
    mdDarkStyles,
    smLightStyles,
    smDarkStyles,
  }

  allStyles = updateGoogleFontUrl(allStyles)

  let formStyle = sessionStorage.getItem('btcd-fs')
  formStyle = formStyle && (bitDecipher(formStyle))

  const isStyleNotLoaded = isObjectEmpty(styles) || styles === undefined

  const formData = {
    ...(savedFormId && { id: savedFormId }),
    ...(!savedFormId && { form_id: newFormId }),
    ...(savedFormId && { currentReport }),
    layout: layouts,
    nestedLayouts,
    formInfo,
    fields,
    // saveStyle && style obj
    form_name: formName,
    report_id: reportId.id,
    additional: additionalSettings,
    workFlows,
    formStyle,
    // style: isStyleNotLoaded ? undefined : allStyles,
    // themeColors: isStyleNotLoaded ? undefined : allThemeColors,
    // themeVars: isStyleNotLoaded ? undefined : allThemeVars,
    // atomicClassMap: isStyleNotLoaded ? undefined : atomicClassMap,
    ...(!isStyleNotLoaded && { style: JCOF.stringify(allStyles) }),
    ...(!isStyleNotLoaded && { staticStyles: JCOF.stringify(staticStylesState) }),
    ...(!isStyleNotLoaded && { themeColors: JCOF.stringify(allThemeColors) }),
    ...(!isStyleNotLoaded && { themeVars: JCOF.stringify(allThemeVars) }),
    breakpointSize,
    customCodes,
    layoutChanged: sessionStorage.getItem('btcd-lc'),
    rowHeight: sessionStorage.getItem('btcd-rh'),
    formSettings: {
      formName,
      confirmation: confirmations,
      formPermissions,
      mailTem: mailTemplates,
      integrations: allIntegrations,
    },
    builderSettings,
  }
  if (savedFormId && deletedFldKey.length !== 0) {
    formData.deletedFldKey = deletedFldKey
  }

  return formData
}

export const IS_PRO = (() => {
  let bits = {}
  try {
    bits = getAtom($bits)
  } catch (_) {
    bits = window?.bits
  }
  return !!bits?.isPro
})()

export const clearAllSWRCache = () => mutate(() => true, undefined)

export const isVarEmpty = data => {
  // check if null or undefined or empty string
  if (data === null || data === undefined || data === '') return true
  // check if array or object and empty
  if (Array.isArray(data) && data.length === 0) return true
  if (isObjectEmpty(data)) return true
  return false
}

export const generateReportData = (allResp, fields, filterOptions) => {
  const { reportedFields, checkedStatus, fromDate, toDate } = filterOptions
  const submissionStatsData = []

  const fieldData = reportedFields.reduce((acc, fieldKey) => {
    const title = fields[fieldKey].adminLbl || fields[fieldKey].lbl
    const dataList = []
    return {
      ...acc,
      [fieldKey]: {
        title,
        dataList,
      },
    }
  }, {})

  allResp.forEach((respObj) => {
    const tempDate = new Date(respObj.__created_at)
    const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}-${tempDate.getDate()}`
    const isIndexExist = submissionStatsData.findIndex((obj) => obj.date === date)
    if (isIndexExist !== -1) {
      submissionStatsData[isIndexExist].value += 1
    } else {
      submissionStatsData.push({
        date,
        value: 1,
      })
    }
    if (checkedStatus.includes(respObj.__entry_status)) {
      reportedFields.forEach((fieldKey) => {
        const optionsObj = (fields[fieldKey].opt || []).reduce(
          (acc, opt) => {
            const { val, lbl } = opt
            return {
              ...acc,
              [val || lbl]: lbl,
            }
          },
          {},
        )

        let entryData = respObj[fieldKey]
        entryData = isValidJsonString(entryData) ? JSON.parse(entryData) : entryData
        if (entryData) {
          if (Array.isArray(entryData)) {
            entryData.forEach((data) => {
              const optionLabelData = optionsObj[data] || data
              if (optionLabelData) {
                existCheckOrPush(fieldData, fieldKey, optionLabelData)
              }
            })
          } else {
            const optionLabelData = optionsObj[entryData] || entryData
            existCheckOrPush(fieldData, fieldKey, optionLabelData)
          }
        }
      })
    }
  })

  return { fieldData, submissionStatsData }
}

function existCheckOrPush(fieldData, fieldKey, data) {
  const isExist = fieldData[fieldKey].dataList.find((obj) => obj.label === data)
  if (isExist) {
    isExist.value += 1
  } else {
    fieldData[fieldKey].dataList.push({
      label: data,
      value: 1,
    })
  }
}
// get All Dates Label of last One month
export const getAllDateLabel = (fromDate, toDate) => {
  const dateLabel = []
  const date1 = new Date(fromDate)
  const date2 = new Date(toDate)
  const diffTime = Math.abs(date2 - date1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  for (let i = 0; i <= diffDays; i++) {
    const date = new Date(fromDate)
    date.setDate(date.getDate() + i)
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    dateLabel.push(dateStr)
  }
  return dateLabel
}

// get lastNthDate
export const getLastNthDate = (n) => {
  const date = new Date()
  date.setDate(date.getDate() - n)
  // const dateStr = date.toISOString().split('T')[0]
  return date
}

export function objectToCssText(obj) {
  let cssText = ''
  const selectors = Object.keys(obj)
  const selectorsCount = selectors.length
  if (!selectorsCount) return ''

  for (let i = 0; i < selectorsCount; i += 1) {
    const selector = selectors[i]
    if (!Object.prototype.hasOwnProperty.call(obj, selector)) continue
    cssText += selector
    cssText += '{'
    const definations = obj[selector]
    cssText += generatePropertyRules(definations)
    cssText += '}'
  }

  cssText = cssText
    .replace(/::after/gm, ':after')
    .replace(/::before/gm, ':before')
    .replace(/(?:\s+|:|,)0+\./gm, match => (match[0] !== '0' ? `${match[0]}.` : '.'))
    .replace(/\s*border\s*:\s*medium\s*none/gm, 'border:none')

  return cssText
}

const generatePropertyRules = (definations) => {
  let cssText = ''
  let len = Object.entries(definations).length
  const props = Object.keys(definations)
  const propsCount = props.length
  for (let j = 0; j < propsCount; j += 1) {
    const prop = props[j]
    if (!Object.prototype.hasOwnProperty.call(definations, prop)) continue
    const value = definations[prop]
    const valueIsObject = typeof value === 'object' && value !== null
    cssText += prop
    if (!valueIsObject) cssText += ':'
    if (valueIsObject) {
      cssText += `{${generatePropertyRules(value)}}`
    } else cssText += value
    // eslint-disable-next-line no-plusplus
    if (--len !== 0 && !valueIsObject) {
      cssText += ';'
    }
  }

  return cssText
}
