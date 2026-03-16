import { diff } from 'deep-object-diff'
import merge from 'deepmerge-alt'
import { parse, stringify } from 'jcof'
import toast from 'react-hot-toast'
import { getAtom } from '../GlobalStates/BitStore'
import { $fields } from '../GlobalStates/GlobalStates'
import { deepCopy, isObject, isObjectEmpty } from './Helpers'
import { __ } from './i18nwrap'
import { pdfFontList } from './StaticData/pdfConfigurationData'

export function observeElement(element, property, callback, delay = 0) {
  const elementPrototype = Object.getPrototypeOf(element)
  if (Object.prototype.hasOwnProperty.call(elementPrototype, property)) {
    const descriptor = Object.getOwnPropertyDescriptor(
      elementPrototype,
      property,
    )
    Object.defineProperty(element, property, {
      configurable: true,
      get(...args) {
        return descriptor.get.apply(this, args)
      },
      set(...args) {
        const oldValue = this[property]
        descriptor.set.apply(this, args)
        const newValue = this[property]
        if (typeof callback === 'function') {
          setTimeout(callback.bind(this, oldValue, newValue), delay)
        }
        // eslint-disable-next-line no-setter-return
        return newValue
      },
    })
  }
}

export const loadScript = ({ src, integrity, id, scriptInGrid = false, attr = {}, callback = null }) => new Promise((resolve) => {
  const script = document.createElement('script')
  script.src = src
  if (integrity) {
    script.integrity = integrity
    script.crossOrigin = 'anonymous'
  }
  script.id = id
  if (attr) {
    Object.entries(attr).forEach(([key, val]) => {
      script.setAttribute(key, val)
    })
  }
  script.onload = () => {
    resolve(true)
    if (callback) callback()
  }
  script.onerror = () => {
    resolve(false)
  }

  removeScript(id, scriptInGrid)

  let bodyElm = document.body

  if (scriptInGrid) {
    bodyElm = document.getElementById('bit-grid-layout')?.contentWindow?.document.body
  }

  bodyElm.appendChild(script)
})

export const removeScript = (id, scriptInGrid = false) => {
  let bodyElm = document.body

  if (scriptInGrid) {
    bodyElm = document.getElementById('bit-grid-layout')?.contentWindow?.document.body
  }

  const alreadyExistScriptElm = bodyElm ? bodyElm.querySelector(`#${id}`) : null

  if (alreadyExistScriptElm) {
    bodyElm.removeChild(alreadyExistScriptElm)
  }
}

export const select = (selector) => document.querySelector(selector)
export const selectInGrid = (selector) => document.getElementById('bit-grid-layout')?.contentDocument.querySelector(selector)
export const selectAllInGrid = (selector) => document.getElementById('bit-grid-layout')?.contentWindow?.document.querySelectorAll(selector)

export function escapeHTMLEntity(string) {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  const reUnescapedHtml = /[&<>"']/g
  const reHasUnescapedHtml = RegExp(reUnescapedHtml.source)

  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
    : (string || '')
}

export function unescapeHTMLEntity(string) {
  const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }

  const reEscapedHtml = /&(?:amp|lt|gt|quot|#(0+)?39);/g
  const reHasEscapedHtml = RegExp(reEscapedHtml.source)

  return (string && reHasEscapedHtml.test(string))
    ? string.replace(reEscapedHtml, (entity) => (htmlUnescapes[entity] || "'"))
    : (string || '')
}

export const getCustomClsName = (fk, element) => {
  const fields = getAtom($fields)
  return fields[fk]?.customClasses?.[element] ?? ''
}

export const getCustomAttributes = (fk, element) => {
  const fields = getAtom($fields)
  const attr = fields[fk]?.customAttributes?.[element]
  if (!attr) return
  const obj = {}
  if (attr) {
    const attrLen = attr.length
    let i = 0
    while (i < attrLen) {
      if (attr[i].key && attr[i].value) {
        obj[attr[i].key] = attr[i].value
      }
      i += 1
    }
  }
  return obj
}

export const getDataDevAttrArr = (fk, element) => {
  const fields = getAtom($fields)
  const attr = fields[fk]?.customAttributes?.[element]
  const dataDevObj = [{ key: `data-dev-${element}`, value: fk }]
  if (!([element] in fields[fk].customAttributes)) return dataDevObj
  if (attr) {
    dataDevObj.push(...attr)
  }
  return dataDevObj
}
/*
  find diff between 2 arr by given targeted arr
  used native for loop for perf
*/
export function targetArrDiff(arr1, arr2) {
  const diffArr = []
  const arr2len = arr2.length
  for (let i = 0; i < arr2len; i += 1) {
    if (arr1.indexOf(arr2[i]) === -1) {
      diffArr.push(arr2[i])
    }
  }
  return diffArr
}

/*
  find difference between obejct of depth 1 level
*/
export function getOneLvlObjDiff(currentObj, targetObj) {
  const diffObj = {}
  const currentObjKeys = Object.keys(currentObj)
  const targetObjKeys = Object.keys(targetObj)
  const currentObjKeysLength = currentObjKeys.length

  for (let i = 0; i < currentObjKeysLength; i += 1) {
    const currObjKey = currentObjKeys[i]
    if (Object.prototype.hasOwnProperty.call(targetObj, currObjKey)) {
      if (currentObj[currObjKey] !== targetObj[currObjKey]) {
        diffObj[currObjKey] = targetObj[currObjKey]
      }
    }
  }

  const diffKeys = targetArrDiff(currentObjKeys, targetObjKeys)
  for (let i = 0; i < diffKeys.length; i += 1) {
    diffObj[diffKeys[i]] = targetObj[diffKeys[i]]
  }
  return diffObj
}

/*
  merge multiple nested object
*/
export function mergeNestedObj(...args) {
  let opts = {}
  const lastArg = args[args.length - 1]
  if (typeof lastArg === 'object' && 'arrays' in lastArg && lastArg.arrays === 'concat') {
    opts = lastArg
    args.pop()
  }
  if (
    args.length === 2
    && typeof args[0] === 'object'
    && typeof args[1] === 'object'
  ) {
    return merge(args[0], args[1], opts)
  }
  let mergedObj = {}
  for (let i = 0; i < args.length - 1; i += 1) {
    if (typeof args[i] === 'object') {
      mergedObj = merge(mergedObj, merge(args[i], args[i + 1], opts), opts)
    }
  }
  return mergedObj
}

/*
  remove all keys of value undefined from object
*/
export function cleanObj(object) {
  const clonedObj = deepCopy(object)

  const cleanse = (obj) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const type = typeof value
      if (type === 'object') {
        cleanse(value)
        // remove if now "empty" object
        if (!Object.keys(value).length) {
          delete obj[key] // eslint-disable-line no-param-reassign
        }
      } else if (type === 'undefined' || type === 'null') {
        delete obj[key] // eslint-disable-line no-param-reassign
      }
    })
    return obj
  }

  return cleanse(clonedObj)
}

// export function getObjectDiff(originalObj, updatedObj, { ignoreUndefined = true } = {}) {
//   const diffObj = diff(originalObj, updatedObj)
//   // remove undefined keys form nested object
//   if (ignoreUndefined) {
//     return cleanObj(diffObj)
//   }
//   return diffObj
// }

export function getObjectDiff(...args) {
  if (args.length === 2) {
    return cleanObj(diff(args[0], args[1]))
  }
  let diffObj = {}
  for (let i = 0; i < args.length - 1; i += 1) {
    if (typeof args[i] === 'object') {
      diffObj = cleanObj(diff(diffObj, cleanObj(diff(args[i], args[i + 1]))))
    }
  }
  return diffObj
}

export const JCOF = {
  stringify,
  parse,
}

const toastCopyResp = prom => prom.then(() => toast.success(__('Copied on clipboard.')))
  .catch(() => toast.error(__('Failed to Copy, Try Again.')))

export const copyToClipboard = ({ value, ref: copyInput }) => {
  if (!copyInput?.current) return
  copyInput.current.focus()
  copyInput.current.select()
  if (navigator.clipboard && window.isSecureContext) {
    const val = value || document.getSelection()
    const resp = navigator.clipboard.writeText(val)
    return toastCopyResp(resp)
  }
  const resp = new Promise((res, rej) => {
    if (document.execCommand('copy')) res()
    else rej()
  })
  return toastCopyResp(resp)
}

export const removeEmptyObjectValues = (stylesObj = {}) => {
  const newStyles = {}
  Object.keys(stylesObj).forEach(st => {
    if (isObjectEmpty(stylesObj[st])) return
    if (isObject(stylesObj[st])) {
      newStyles[st] = removeEmptyObjectValues(stylesObj[st])
    } else if (stylesObj[st]) {
      newStyles[st] = stylesObj[st]
    }
  })
  return newStyles
}

export const addDomainName = (objData) => {
  const jsonString = JSON.stringify(objData)
  const currentDomain = window.location.origin
  // eslint-disable-next-line no-template-curly-in-string
  const replaceAllDomain = jsonString.replace(/\$\{bf_main_domain\}\//g, `${currentDomain}/`)
  return JSON.parse(replaceAllDomain)
}

export const removeDomainName = (objData) => {
  const jsonString = JSON.stringify(objData)
  const currentDomain = window.location.origin
  const domainRegex = new RegExp(`${currentDomain}`, 'g')
  // eslint-disable-next-line no-template-curly-in-string
  const parseString = jsonString.replace(domainRegex, '${bf_main_domain}')
  return JSON.parse(parseString)
}

export const getPdfFontObj = (searchName) => {
  for (const fonts of Object.values(pdfFontList)) {
    const foundFont = fonts.find(
      (font) => font.name.toLowerCase() === searchName.toLowerCase(),
    )
    if (foundFont) {
      return foundFont
    }
  }
  return {}
}

export function sanitizeHTML(rawHTML) {
  const inlineEvents = [
    'onerror', 'onload', 'onclick', 'onmouseover',
    'onfocus', 'onmouseenter', 'onmouseleave',
    'onkeydown', 'onkeyup',
  ]

  // Build a regex for the inline event attributes
  const inlineEventsRegex = new RegExp(
    `\\s+(${inlineEvents.join('|')})\\s*=\\s*(['"])[\\s\\S]*?\\2`,
    'gi',
  )

  return rawHTML
    // Remove <script>...</script> blocks
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')

    // Remove javascript: from src, href, xlink:href
    .replace(/\b(?:src|href|xlink:href)\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, '')

    // Remove srcdoc attributes (used in iframes for injecting HTML)
    .replace(/\s+srcdoc\s*=\s*(['"])[\s\S]*?\1/gi, '')

    // Remove data URI that could inject HTML
    .replace(/\b(?:src|href)\s*=\s*(['"])\s*data:text\/html[^'"]*\1/gi, '')

    // Remove selected inline event handlers
    .replace(inlineEventsRegex, '')
}
