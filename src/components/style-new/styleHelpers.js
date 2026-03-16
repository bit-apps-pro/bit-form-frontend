/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
import { combineSelectors, objectToCssText } from 'atomize-css'
import filepondPluginImagePreviewCSS from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css?inline'
import filepondCSS from 'filepond/dist/filepond.min.css?inline'
import flatpickrCSS from 'flatpickr/dist/flatpickr.min.css?inline'
import { hexToCSSFilter } from 'hex-to-css-filter'
import { create } from 'mutative'
import { getAtom, setAtom } from '../../GlobalStates/BitStore'
import { $builderSettings, $fields } from '../../GlobalStates/GlobalStates'
import { $staticStylesState } from '../../GlobalStates/StaticStylesState'
import { $allStyles, $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import {
  $themeVars, $themeVarsLgDark, $themeVarsLgLight, $themeVarsMdDark, $themeVarsMdLight, $themeVarsSmDark, $themeVarsSmLight,
} from '../../GlobalStates/ThemeVarsState'
import { deepCopy, forEach, getIconsGlobalFilterVariable, getIconsParentElement, isObjectEmpty, trimCSS } from '../../Utils/Helpers'
import css2json from '../../Utils/css2json'
import { select } from '../../Utils/globalHelpers'
import editorConfig from './NewStyleEditorConfig'
import { hslToHex } from './colorHelpers'
import advancedFileUp_1_bitformDefault from './themes/1_bitformDefault/advancedFileUp_1_bitformDefault'
import buttonStyle1BitformDefault from './themes/1_bitformDefault/buttonStyle_1_bitformDefault'
import checkboxNradioStyle1BitformDefault from './themes/1_bitformDefault/checkboxNradioStyle_1_bitformDefault'
import countryStyle_1_BitformDefault from './themes/1_bitformDefault/countryStyle_1_bitformDefault'
import currencyStyle_1_BitformDefault from './themes/1_bitformDefault/currencyStyle_1_bitformDefault'
import dividerStyle1BitformDefault from './themes/1_bitformDefault/dividerStyle_1_bitformDefault'
import dropdownStyle_1_BitformDefault from './themes/1_bitformDefault/dropdownStyle_1_bitformDefault'
import fileUploadStyle_1_BitformDefault from './themes/1_bitformDefault/fileUpload_1_bitformDefault'
import hiddenStyle_1_bitformDefault from './themes/1_bitformDefault/hiddenStyle_1_bitformDefault'
import htmlStyle_1_bitformDefault from './themes/1_bitformDefault/htmlStyle_1_bitformDefault'
import imageSelectStyle_1_bitformDefault from './themes/1_bitformDefault/imageSelectStyle_1_bitformDefault'
import imageStyle1BitformDefault from './themes/1_bitformDefault/imageStyle_1_bitformDefault'
import phoneNumberStyle_1_bitformDefault from './themes/1_bitformDefault/phoneNumberStyle_1_bitformDefault'
import ratingStyle_1_bitformDefault from './themes/1_bitformDefault/ratingStyle_1_bitformDefault'
import recaptchaStyle_1_bitformDefault from './themes/1_bitformDefault/recaptchaStyle_1_bitformDefault'
import repeaterStyle_1_bitformDefault from './themes/1_bitformDefault/repeaterStyle_1_bitformDefault'
import sectionStyle_1_bitformDefault from './themes/1_bitformDefault/sectionStyle_1_bitformDefault'
import selectStyle_1_BitformDefault from './themes/1_bitformDefault/selectStyle_1_bitformDefault'
import shortcodeStyle_1_bitformDefault from './themes/1_bitformDefault/shortcodeStyle_1_bitformDefault'
import sliderStyle1BitformDefault from './themes/1_bitformDefault/sliderStyle_1_bitformDefault'
import spacerStyle_1_bitformDefault from './themes/1_bitformDefault/spacerStyle_1_bitformDefault'
import textStyle1BitformDefault from './themes/1_bitformDefault/textStyle_1_bitformDefault'
import titleStyle1BitformDefault from './themes/1_bitformDefault/titleStyle_1_bitformDefault'

export const assignNestedObj = (obj, keyPath, value) => {
  const paths = keyPath?.split('->') || []
  if (paths.length === 1) {
    obj[paths[0]] = value
    return
  }
  const lastKeyIndex = paths.length - 1
  for (let i = 0; i < lastKeyIndex; i += 1) {
    const key = paths[i]
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  obj[paths[lastKeyIndex]] = value
}

// eslint-disable-next-line import/prefer-default-export
export const showDraggableModal = (e, setDraggableModal, props) => {
  const settingsMenu = select('#settings-menu')
  const offset = { top: 55 }
  const x = Math.round((window.innerWidth - settingsMenu.getBoundingClientRect().width) - (props.width || 250))
  const currentTargetTop = e.target.getBoundingClientRect().top
  const y = currentTargetTop > 300 ? 200 : currentTargetTop - offset.top
  setDraggableModal({ show: true, position: { x, y }, ...props })
}

// This Function used for Array To Style String converter (like shadow)
export const objectArrayToStyleStringGenarator = shadows => {
  let shadowString = ''
  shadows.forEach(shadow => {
    shadowString += `${Object.values(shadow).join(' ')},`
  })
  shadowString = shadowString.slice(0, -1)
  return shadowString
}

export const json2CssStr = (className, jsonValue) => {
  if (!jsonValue) return ''
  let cssStr = '{'
  const objArr = Object.entries(jsonValue)
  objArr.forEach(([property, value]) => {
    if (property !== '' && value !== '') {
      cssStr += `${property}:${value};`
    }
  })
  cssStr += '}'
  return className + cssStr
}

export const jsObjtoCssStr = (jsObj) => {
  const keys = Object.keys(jsObj)
  let css = ''
  keys.forEach((cls) => {
    const clsName = Object.entries(jsObj[cls])
    if (clsName.length === 0) return
    let cssStr = '{'
    clsName.forEach(([property, value]) => {
      cssStr += `${property}:${value};`
    })
    cssStr = cssStr.substring(0, cssStr.length - 1)
    cssStr += '}'
    css += cls + cssStr
  })
  return css
}

export const unitConverter = (unit, value, prvUnit) => {
  if (prvUnit === unit) return value
  const valueInNum = Number(value)

  if (prvUnit === 'px' && unit === 'em') return valueInNum * 0.062.toFixed(3)
  if (prvUnit === 'px' && unit === 'rem') return valueInNum * 0.0625.toFixed(3)
  if (prvUnit === 'px' && unit === '%') return valueInNum * 6.25
  if (prvUnit === 'px' && unit === '') return valueInNum
  if (prvUnit === 'px' && unit === 'cm') return valueInNum * 0.026
  if (prvUnit === 'px' && unit === 'mm') return valueInNum * 0.26

  if (prvUnit === 'em' && unit === 'px') return valueInNum * 16
  if (prvUnit === 'em' && unit === '') return valueInNum * 16
  if (prvUnit === 'em' && unit === 'rem') return valueInNum
  if (prvUnit === 'em' && unit === '%') return valueInNum * 100
  if (prvUnit === 'em' && unit === 'cm') return valueInNum * 0.423
  if (prvUnit === 'em' && unit === 'cm') return valueInNum * 4.233

  if (prvUnit === 'rem' && unit === 'em') return valueInNum
  if (prvUnit === 'rem' && unit === 'px') return valueInNum * 16
  if (prvUnit === 'rem' && unit === '') return valueInNum * 16
  if (prvUnit === 'rem' && unit === '%') return valueInNum * 100
  if (prvUnit === 'rem' && unit === 'cm') return valueInNum * 0.423
  if (prvUnit === 'rem' && unit === 'mm') return valueInNum * 4.233

  if (prvUnit === 'cm' && unit === 'rem') return valueInNum * 2.362
  if (prvUnit === 'cm' && unit === 'px') return valueInNum * 37.80

  if (prvUnit === '%' && unit === 'px') return valueInNum * 0.16
  if (prvUnit === '%' && unit === '') return valueInNum * 0.01
  if (prvUnit === '%' && unit === 'rem') return valueInNum * 0.01
  if (prvUnit === '%' && unit === 'em') return valueInNum * 0.01

  if (prvUnit === '' && unit === 'em') return (valueInNum * 0.0625).toFixed(3)
  if (prvUnit === '' && unit === 'rem') return (valueInNum * 0.0625).toFixed(3)
  if (prvUnit === '' && unit === '%') return valueInNum * 100
  if (prvUnit === '' && unit === 'px') return valueInNum

  if (prvUnit === 'deg' && unit === 'rad') return valueInNum * 0.0174533
  if (prvUnit === 'deg' && unit === 'turn') return valueInNum * 0.00277778

  if (prvUnit === 'turn' && unit === 'rad') return valueInNum * 6.28319
  if (prvUnit === 'turn' && unit === 'deg') return valueInNum * 360

  // formula (1)rad / 2π = turn
  if (prvUnit === 'rad' && unit === 'turn') return valueInNum * 0.159155
  // formula (1)rad * 180/π = deg°
  if (prvUnit === 'rad' && unit === 'deg') return valueInNum * 57.2958

  // convert mm to (px, rem, em)
  if (prvUnit === 'mm' && unit === 'px') return Number(value * 3.78)
  if (prvUnit === 'mm' && unit === 'rem') return Number(value * 0.24)
  if (prvUnit === 'mm' && unit === 'em') return Number(value * 0.24)
  return value
}

export const getNumFromStr = (str = '') => {
  if (typeof str === 'number') return str
  const num = str ? str?.match(/[-]?([0-9]*[.])?[0-9]+/gi) : 0
  return num ? num[0] : ''
}
export const getStrFromStr = (str = '') => {
  const newStr = str ? str?.match(/([A-z]|%)+/gi)?.[0] : ''
  return newStr || ''
}

export const searchKey = (e) => {
  if (e.ctrlKey && e.code === 'Slash') {
    document.getElementById('search-icon').focus()
  }
  if (e.code === 'Escape') {
    document.getElementById('search-icon').blur()
  }
}

export function getAbsoluteSize(el) {
  const styles = window.getComputedStyle(el)
  // const marginTop =
  // const marginBottom =

  // const marginLeft = parseFloat(styles.marginLeft)
  // const marginRight = parseFloat(styles.marginRight)

  // const borderTop = parseFloat(styles.borderTop)
  const borderBottom = parseFloat(styles.borderBottom)

  const borderLeft = parseFloat(styles.borderLeft)
  const borderRight = parseFloat(styles.borderRight)

  const paddingLeft = parseFloat(styles.paddingLeft)
  const paddingRight = parseFloat(styles.paddingRight)
  const paddingTop = parseFloat(styles.paddingTop)
  const paddingBottom = parseFloat(styles.paddingBottom)

  const height = parseFloat(styles.height)
  const width = parseFloat(styles.width)

  return {
    height,
    width,
    borderBottom,
    borderTop: parseFloat(styles.borderTop),
    borderLeft,
    borderRight,
    marginBottom: parseFloat(styles.marginBottom),
    marginTop: parseFloat(styles.marginTop),
    marginLeft: parseFloat(styles.marginLeft),
    marginRight: parseFloat(styles.marginRight),
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
  }
}

/**
 * @param {string} selector html query selector
 * @param {string} selectType "element" | "margin" | "padding"
*/
export function highlightElm(selector, selectType = 'element padding margin') {
  const elms = document.getElementById('bit-grid-layout')?.contentWindow.document.querySelectorAll(selector)
  elms?.forEach(elm => {
    const marginDiv = document.createElement('div')
    const paddingDiv = document.createElement('div')
    const elementDiv = document.createElement('div')
    const {
      marginRight,
      marginBottom,
      marginLeft,
      marginTop,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    } = getAbsoluteSize(elm)
    const { top, left, height, width } = elm.getBoundingClientRect()

    marginDiv.style.width = `${width + marginRight + marginLeft}px`
    marginDiv.style.height = `${height + marginTop + marginBottom}px`
    marginDiv.style.top = `${top - marginTop}px`
    marginDiv.style.left = `${left - marginLeft}px`
    marginDiv.classList.add('highlight-margin')
    marginDiv.setAttribute('data-highlight', selector)
    marginDiv.onclick = (e) => {
      if (e.target.hasAttribute('data-highlight')) { e.target.remove(); return }
      if (e.target.parentNode.hasAttribute('data-highlight')) { e.target.parentNode.remove(); return }
      if (e.target.parentNode.parentNode.hasAttribute('data-highlight')) { e.target.parentNode.parentNode.remove() }
    }

    elementDiv.classList.add('highlight-element')
    elementDiv.style.width = `${width}px`
    elementDiv.style.height = `${height}px`
    elementDiv.style.marginRight = `${marginRight}px`
    elementDiv.style.marginLeft = `${marginLeft}px`
    elementDiv.style.marginTop = `${marginTop}px`
    elementDiv.style.marginBottom = `${marginBottom}px`

    paddingDiv.classList.add('highlight-padding')
    paddingDiv.style.width = `${width - paddingLeft - paddingRight}px`
    paddingDiv.style.height = `${height - paddingTop - paddingBottom}px`
    paddingDiv.style.marginRight = `${paddingRight}px`
    paddingDiv.style.marginLeft = `${paddingLeft}px`
    paddingDiv.style.marginTop = `${paddingTop}px`
    paddingDiv.style.marginBottom = `${paddingBottom}px`

    if (selectType.indexOf('element') < 0) {
      elementDiv.style.background = 'transparent'
    }
    if (selectType.indexOf('margin') < 0
      || (width + marginTop + marginBottom) === width
      || (height + marginRight + marginLeft) === height) {
      marginDiv.style.background = 'transparent'
    }
    if (selectType.indexOf('padding') < 0
      || (width - paddingLeft - paddingRight) === width
      || (height - paddingTop - paddingBottom) === height) {
      paddingDiv.style.background = 'transparent'
    }

    marginDiv.appendChild(elementDiv)
    elementDiv.appendChild(paddingDiv)
    document.getElementById('bit-grid-layout')?.contentWindow?.document.body.prepend(marginDiv)
  })
}

export const removeHighlight = (selector = '[data-highlight]') => {
  const elms = document.getElementById('bit-grid-layout')?.contentWindow.document.querySelectorAll(selector)
  elms?.forEach(elm => { elm.remove() })
}

export const splitValueBySpaces = str => str?.split(/(?!\(.*)\s(?![^(]*?\))/g) || []

export const getObjByKey = (objName, obj) => obj[objName]

export const getValueByObjPath = (obj, path) => {
  if (!obj || !path) return null
  const paths = path?.split('->') || []
  if (paths.length === 1) {
    return obj[paths[0]]
  }
  let value = obj
  for (let i = 0; i < paths.length; i += 1) {
    value = value[paths[i]]
    if (value === undefined) return ''
  }

  return value
}

export const setStyleStateObj = (objName, path, value, setStates) => {
  let setStateFunc = null
  if (objName === 'themeVars') {
    setStateFunc = setStates.setThemeVars
  } else if (objName === 'styles') {
    setStateFunc = setStates.setStyles
  } else if (objName === 'themeColors') {
    setStateFunc = setStates.setThemeColors
  }
  setStateFunc?.(preStyle => create(preStyle, drftStyle => {
    assignNestedObj(drftStyle, path, value)
  }))
}

export function arrDiff(arr1, arr2) {
  return arr1
    .filter(x => !arr2.includes(x))
    .concat(arr2.filter(x => !arr1.includes(x)))
}
export const addableCssPropsObj = (fieldType, elementKey = 'fld-wrp') => editorConfig[fieldType][elementKey]?.properties
export const addableCssPropsByField = (fieldType, elementKey = 'fld-wrp') => Object.keys(editorConfig[fieldType][elementKey]?.properties || {})

export const styleClasses = {
  logo: ['logo'],
  title: ['title'],
  titlePreIcn: ['title-pre-i'],
  titleSufIcn: ['title-suf-i'],
  lbl: ['lbl', 'lbl-wrp'],
  lblPreIcn: ['lbl-pre-i'],
  lblSufIcn: ['lbl-suf-i'],
  subTitl: ['sub-titl'],
  subTlePreIcn: ['sub-titl-pre-i'],
  subTleSufIcn: ['sub-titl-suf-i'],
  subTitlPreIcn: ['sub-titl-pre-i'],
  subTitlSufIcn: ['sub-titl-suf-i'],
  fld: ['fld'],
  divider: ['divider'],
  image: ['img'],
  button: ['btn'],
  btnTxt: ['btn-txt'],
  hlpTxt: ['hlp-txt'],
  hlpPreIcn: ['hlp-txt-pre-i'],
  hlpSufIcn: ['hlp-txt-suf-i'],
  prefixIcn: ['pre-i', 'fld:focus ~ .$fk-pre-i'],
  suffixIcn: ['suf-i', 'fld:focus ~ .$fk-suf-i'],
  fileSelectStatus: ['file-select-status'],
  maxSizeLbl: ['max-size-lbl'],
  fileWpr: ['file-wrpr'],
  filePreview: ['file-preview'],
  fileTitl: ['file-title'],
  fileSize: ['file-size'],
  crossBtn: ['cross-btn'],
  errWrp: ['err-wrp'],
  btnPreIcn: ['btn-pre-i'],
  btnSufIcn: ['btn-suf-i'],
  err: ['err-msg'],
  errPreIcn: ['err-txt-pre-i'],
  errSufIcn: ['err-txt-suf-i'],
  reqSmbl: ['req-smbl'],
  showFileList: ['files-list', 'file-wrpr', 'cross-btn', 'cross-btn:hover'],
  showFilePreview: ['file-preview'],
  showFileSize: ['file-size'],
  otherOptions: ['other-inp-wrp', 'other-inp', 'other-inp:focus', 'other-inp:hover'],
  addBtnPreIcn: ['rpt-add-btn-pre-i'],
  addBtnSufIcn: ['rpt-add-btn-suf-i'],
  removeBtnPreIcn: ['rpt-rmv-btn-pre-i'],
  removeBtnSufIcn: ['rpt-rmv-btn-suf-i'],
  addToEndBtnPreIcn: ['add-to-end-btn-pre-i'],
  addToEndBtnSufIcn: ['add-to-end-btn-suf-i'],
  clrPreIcn: ['clr-btn-suf-i'],
  clrSufIcn: ['clr-btn-pre-i'],
  clrBtn: ['clr-btn', 'clr-btn:hover', 'clr-btn:active', 'clr-btn:focus-visible', 'clr-btn:active:focus-visible', 'clr-btn:disabled'],
  undoSufIcn: ['undo-btn-suf-i'],
  undoPreIcn: ['undo-btn-pre-i'],
  undoBtn: ['undo-btn', 'undo-btn:hover', 'undo-btn:active', 'undo-btn:focus-visible', 'undo-btn:active:focus-visible', 'undo-btn:disabled'],
  redoSufIcn: ['redo-btn-suf-i'],
  redoPreIcn: ['redo-btn-pre-i'],
  redoBtn: ['redo-btn', 'redo-btn:hover', 'redo-btn:active', 'redo-btn:focus-visible', 'redo-btn:active:focus-visible', 'redo-btn:disabled'],
  imageSelectOptLbl: ['tc', 'img-title'],
}

export const iconElementLabel = {
  titlePreIcn: 'Title Leading',
  titleSufIcn: 'Title Trailing',
  lblPreIcn: 'Label Leading',
  lblSufIcn: 'Label Trailing',
  subTlePreIcn: 'Subtitle Leading',
  subTleSufIcn: 'Subtitle Trailing',
  subTitlPreIcn: 'subtitle Leading',
  subTitlSufIcn: 'subtitle Trailing',
  hlpPreIcn: 'Helper Text Leading',
  hlpSufIcn: 'Helper Text Trailing',
  prefixIcn: 'Leading',
  suffixIcn: 'Trailing',
  btnPreIcn: 'Button Leading',
  btnSufIcn: 'Button Trailing',
  errPreIcn: 'Error Text Leading',
  errSufIcn: 'Error Text Trailing',
  placeholderImage: 'Placeholder Image',
  logo: 'Logo',
  bg_img: 'Background Image',
}

const deleteStyles = (obj, clsArr, fk) => {
  clsArr && clsArr.forEach(cls => {
    const replaceWithFk = cls.replace(/\$fk/gi, fk)
    delete obj.fields?.[fk]?.classes?.[`.${fk}-${replaceWithFk}`]
  })
}
const checkExistElmntInOvrdThm = (fldStyleObj, element) => fldStyleObj?.overrideGlobalTheme?.find(el => el === element)

const filterUnusedStyles = (styles) => {
  if (isObjectEmpty(styles)) return styles

  const fields = getAtom($fields)
  const fieldsArray = Object.keys(fields)

  return create(styles, draftStyle => {
    fieldsArray.forEach(fldkey => {
      const fld = fields[fldkey]
      if (!fld.lbl) deleteStyles(draftStyle, styleClasses.lbl, fldkey)
      if (!fld.lblPreIcn) deleteStyles(draftStyle, styleClasses.lblPreIcn, fldkey)
      if (!fld.lblSufIcn) deleteStyles(draftStyle, styleClasses.lblSufIcn, fldkey)
      if (!fld.subtitle) deleteStyles(draftStyle, styleClasses.subTitl, fldkey)
      if (!fld.subTlePreIcn && !(fld.typ === 'title')) deleteStyles(draftStyle, styleClasses.subTlePreIcn, fldkey)
      if (!fld.subTleSufIcn && !(fld.typ === 'title')) deleteStyles(draftStyle, styleClasses.subTleSufIcn, fldkey)
      if (!fld.helperTxt) deleteStyles(draftStyle, styleClasses.hlpTxt, fldkey)
      if (!fld.hlpPreIcn) deleteStyles(draftStyle, styleClasses.hlpPreIcn, fldkey)
      if (!fld.hlpSufIcn) deleteStyles(draftStyle, styleClasses.hlpSufIcn, fldkey)
      if (!fld.err) deleteStyles(draftStyle, styleClasses.err, fldkey)
      if (!fld.errPreIcn) deleteStyles(draftStyle, styleClasses.errPreIcn, fldkey)
      if (!fld.errSufIcn) deleteStyles(draftStyle, styleClasses.errSufIcn, fldkey)
      if (!fld?.valid?.reqShow) deleteStyles(draftStyle, styleClasses.reqSmbl, fldkey)

      switch (fld.typ) {
        case 'button':
          if (!fld.btnPreIcn) deleteStyles(draftStyle, styleClasses.btnPreIcn, fldkey)
          if (!fld.btnSufIcn) deleteStyles(draftStyle, styleClasses.btnSufIcn, fldkey)
          break
        case 'text':
        case 'number':
        case 'password':
        case 'username':
        case 'email':
        case 'url':
        case 'date':
        case 'datetime-local':
        case 'time':
        case 'month':
        case 'week':
        case 'color':
        case 'textarea':
          if (!fld.prefixIcn) deleteStyles(draftStyle, styleClasses.prefixIcn, fldkey)
          if (!fld.suffixIcn) deleteStyles(draftStyle, styleClasses.suffixIcn, fldkey)
          break

        case 'title':
          if (!fld.subTitlPreIcn) deleteStyles(draftStyle, styleClasses.subTitlPreIcn, fldkey)
          if (!fld.subTitlSufIcn) deleteStyles(draftStyle, styleClasses.subTitlSufIcn, fldkey)
          if (!fld.titlePreIcn) deleteStyles(draftStyle, styleClasses.titlePreIcn, fldkey)
          if (!fld.titleSufIcn) deleteStyles(draftStyle, styleClasses.titleSufIcn, fldkey)
          break

        case 'file-up':
          if (!fld.config.showFilePreview) deleteStyles(draftStyle, styleClasses.showFilePreview, fldkey)
          if (!fld.config.showFileSize) deleteStyles(draftStyle, styleClasses.showFileSize, fldkey)
          if (!fld.config.showFileList) deleteStyles(draftStyle, styleClasses.showFileList, fldkey)
          break

        case 'radio':
        case 'check':
          if (!fld.addOtherOpt) deleteStyles(draftStyle, styleClasses.otherOptions, fldkey)
          break

        case 'image-select':
          if (fld.optLblHide) deleteStyles(draftStyle, styleClasses.imageSelectOptLbl, fldkey)
          break

        default:
          break
      }
    })
  })
}

export const removeUnuseStylesAndUpdateState = () => {
  const updatedStyles = removeUnusedStyles()
  setAtom($allStyles, updatedStyles)
}

export const removeUnusedStyles = () => {
  const { lgLightStyles,
    lgDarkStyles,
    mdLightStyles,
    mdDarkStyles,
    smLightStyles,
    smDarkStyles } = getAtom($allStyles)

  const lgLightStylesUpdated = filterUnusedStyles(lgLightStyles)
  const lgDarkStylesUpdated = filterUnusedStyles(lgDarkStyles)
  const mdLightStylesUpdated = filterUnusedStyles(mdLightStyles)
  const mdDarkStylesUpdated = filterUnusedStyles(mdDarkStyles)
  const smLightStylesUpdated = filterUnusedStyles(smLightStyles)
  const smDarkStylesUpdated = filterUnusedStyles(smDarkStyles)

  return {
    lgLightStyles: lgLightStylesUpdated,
    lgDarkStyles: lgDarkStylesUpdated,
    mdLightStyles: mdLightStylesUpdated,
    mdDarkStyles: mdDarkStylesUpdated,
    smLightStyles: smLightStylesUpdated,
    smDarkStyles: smDarkStylesUpdated,
  }
}

const ignorePropsForImportant = {
  '.filepond--panel-bottom,.filepond--panel-center': ['transform', '-webkit-transform', 'transform-origin', '-webkit-transform-origin'],
}

const addImportantToClasses = (styleObj, ignoredProps = []) => {
  if (isObjectEmpty(styleObj)) return styleObj
  const styleKeys = Object.keys(styleObj)
  forEach(styleKeys, styleKey => {
    let styleVal = styleObj[styleKey]
    if (typeof styleVal === 'object' && styleVal !== null) {
      const ignoredPropsForSelector = ignorePropsForImportant?.[styleKey] || []
      const { all = [] } = ignorePropsForImportant
      const allIgnoreProps = [...ignoredPropsForSelector, ...all]
      styleObj[styleKey] = addImportantToClasses(styleVal, allIgnoreProps)
      return styleObj
    }
    if (ignoredProps.includes(styleKey)) return
    if (typeof styleVal === 'number') styleVal = styleVal.toString()
    if (!styleVal || styleVal.includes('!important')) return
    styleObj[styleKey] = `${styleVal} !important`
  })

  return styleObj
}

export const generateStylesWithImportantRule = styles => {
  const { addImportantRuleToStyles } = getAtom($builderSettings)
  if (!addImportantRuleToStyles) return styles
  if (isObjectEmpty(styles)) return styles

  return addImportantToClasses(deepCopy(styles))
}
const generateCombinedCSSWithImportantRule = (cssText, { combined = true } = {}) => {
  let cssObj = {}
  if (typeof cssText === 'string') {
    const trimmedCSS = trimCSS(cssText)
    cssObj = css2json(trimmedCSS)
  }
  if (typeof cssText === 'object' && cssText !== null) {
    cssObj = cssText
  }
  if (isObjectEmpty(cssObj)) return ''
  cssObj = generateStylesWithImportantRule(cssObj)
  if (combined) cssObj = combineSelectors(cssObj)
  const newCSSText = objectToCssText(cssObj)

  return newCSSText
}

export const mergeOtherStylesWithAtomicCSS = () => {
  const fields = getAtom($fields)
  const staticStyles = getAtom($staticStylesState)
  let cssText = ''

  if (Object.keys(fields).find((f) => fields[f].typ === 'advanced-file-up')) {
    cssText += generateCombinedCSSWithImportantRule(filepondCSS, { combined: false })
  }

  if (Object.keys(fields).find((f) => fields[f].typ === 'advanced-datetime')) {
    const styleFix = `.flatpickr-current-month .numInputWrapper{
        width: 6ch !important;
    }`
    cssText += generateCombinedCSSWithImportantRule(flatpickrCSS + styleFix, { combined: false })
  }

  if (Object.keys(fields).find((f) => fields[f].typ === 'advanced-file-up' && fields[f]?.config?.allowImagePreview)) {
    cssText += generateCombinedCSSWithImportantRule(filepondPluginImagePreviewCSS, { combined: false })
  }
  cssText += generateCombinedCSSWithImportantRule(staticStyles.staticStyles)

  return cssText
}

const breakpointAndColorScheme = {
  lgLightStyles: { breakpoint: 'lg', colorScheme: 'light' },
  lgDarkStyles: { breakpoint: 'lg', colorScheme: 'dark' },
  mdLightStyles: { breakpoint: 'md', colorScheme: 'light' },
  mdDarkStyles: { breakpoint: 'md', colorScheme: 'dark' },
  smLightStyles: { breakpoint: 'sm', colorScheme: 'light' },
  smDarkStyles: { breakpoint: 'sm', colorScheme: 'dark' },

}

const addStyleInState = ({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle }) => {
  styleClasses[element].forEach(cls => {
    const replaceWithFk = cls.replace(/\$fk/gi, fk)
    const clsNam = `.${fk}-${replaceWithFk}`
    const path = `${brkPntColorSchema}->fields->${fk}->classes->${clsNam}`
    if (!fieldStyle[clsNam]) return
    assignNestedObj(drftAllStyles, path, fieldStyle[clsNam])
  })
}

export const addDefaultStyleClasses = (fk, element) => {
  const allStyles = getAtom($allStyles)
  const allNewStyles = create(allStyles, drftAllStyles => {
    Object.keys(allStyles).forEach(brkPntColorSchema => {
      const fldTyp = allStyles[brkPntColorSchema]?.fields?.[fk]?.fieldType
      if (!fldTyp) return
      switch (fldTyp) {
        case 'text':
        case 'number':
        case 'password':
        case 'username':
        case 'email':
        case 'url':
        case 'date':
        case 'datetime-local':
        case 'time':
        case 'month':
        case 'week':
        case 'color':
        case 'textarea':
          const textStyleBitFormDefault = textStyle1BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: textStyleBitFormDefault })
          break
        case 'range':
          const sliderStyleBitFormDefault = sliderStyle1BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: sliderStyleBitFormDefault })
          break
        case 'title':
          const titleStyleBitFormDefault = titleStyle1BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: titleStyleBitFormDefault })
          break
        case 'divider':
          const dividerStyleBitFormDefault = dividerStyle1BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: dividerStyleBitFormDefault })
          break
        case 'spacer':
          const spacerStyleBitFormDefault = spacerStyle_1_bitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: spacerStyleBitFormDefault })
          break
        case 'image':
          const imageStyleBitFormDefault = imageStyle1BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: imageStyleBitFormDefault })
          break
        case 'button':
          const buttonStyleBitFormDefault = buttonStyle1BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: buttonStyleBitFormDefault })
          break
        case 'check':
        case 'radio':
          const checkBoxStyleBitFormDefault = checkboxNradioStyle1BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: checkBoxStyleBitFormDefault })
          break
        case 'advanced-file-up':
          const advanceFileUpBitFormDefault = advancedFileUp_1_bitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: advanceFileUpBitFormDefault })
          break
        case 'html':
          const htmlBitFormDefault = htmlStyle_1_bitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: htmlBitFormDefault })
          break
        case 'shortcode':
          const shortcodeBitformDefault = shortcodeStyle_1_bitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: shortcodeBitformDefault })
          break
        case 'currency':
          const currencyStyle1BitformDefault = currencyStyle_1_BitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: currencyStyle1BitformDefault })
          break
        case 'country':
          const countryStyle1BitformDefault = countryStyle_1_BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: countryStyle1BitformDefault })
          break
        case 'file-up':
          const fileUploadStyle1BitformDefault = fileUploadStyle_1_BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: fileUploadStyle1BitformDefault })
          // if ([`.${fk}-file-wrpr`] in fileUploadStyle1BitformDefault) {
          //   addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: fileUploadStyle1BitformDefault })
          // }
          // if ([`.${fk}-file-size`] in fileUploadStyle1BitformDefault) {
          //   addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: fileUploadStyle1BitformDefault })
          // }
          // if ([`.${fk}-file-preview`] in fileUploadStyle1BitformDefault) {
          //   addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: fileUploadStyle1BitformDefault })
          // }
          break
        case 'recaptcha':
          const recaptchaStyle1BitformDefault = recaptchaStyle_1_bitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: recaptchaStyle1BitformDefault })
          break
        case 'html-select':
          const selectStyle1BitformDefault = selectStyle_1_BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: selectStyle1BitformDefault })
          break
        case 'select':
          const dropdownStyle1BitformDefault = dropdownStyle_1_BitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: dropdownStyle1BitformDefault })
          break
        case 'hidden':
          const hiddenStyle1BitformDefault = hiddenStyle_1_bitformDefault({ fk, fldTyp, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: hiddenStyle1BitformDefault })
          break
        case 'phone-number':
          const phoneNumberStyleBitformDefault = phoneNumberStyle_1_bitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: phoneNumberStyleBitformDefault })
          break
        case 'section':
          const sectionStyleBitformDefault = sectionStyle_1_bitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: sectionStyleBitformDefault })
          break
        case 'repeater':
          const repeaterStyleBitformDefault = repeaterStyle_1_bitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: repeaterStyleBitformDefault })
          break
        case 'signature':
          const signatureStyleBitformDefault = repeaterStyle_1_bitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: signatureStyleBitformDefault })
          break
        case 'rating':
          const ratingStyleBitformDefault = ratingStyle_1_bitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: ratingStyleBitformDefault })
          break
        case 'image-select':
          const imageSelectStyleBitformDefault = imageSelectStyle_1_bitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: imageSelectStyleBitformDefault })
          break
        case 'advanced-datetime':
          const advancedDataTimeStyleBitformDefault = imageSelectStyle_1_bitformDefault({ fk, ...breakpointAndColorScheme[brkPntColorSchema] })
          addStyleInState({ element, brkPntColorSchema, fk, drftAllStyles, fieldStyle: advancedDataTimeStyleBitformDefault })
          break

        default:
          break
      }
    })
  })
  setAtom($allStyles, allNewStyles)
}

export const generateFontUrl = (font, string) => {
  const fontFamily = font.replace(/\s/gi, '+')
  const newParmrs = string !== '' ? `:ital,${string}` : ''
  return `https://fonts.googleapis.com/css2?family=${fontFamily}${newParmrs}&display=swap`
}

export const findExistingFontStyleNWeight = (styles, themeVars) => {
  if (!('fields' in styles)) return [[], []]
  const fontWeightVariant = []
  const fontStyleVariant = []
  const fieldsArr = Object.keys(styles.fields)
  const fieldsLength = fieldsArr.length

  for (let fldIndx = 0; fldIndx < fieldsLength; fldIndx += 1) {
    const fieldClasses = styles.fields[fieldsArr[fldIndx]].classes
    const fieldClassesArr = Object.keys(fieldClasses)
    const fieldClassesLen = fieldClassesArr.length
    for (let clsIndx = 0; clsIndx < fieldClassesLen; clsIndx += 1) {
      const clsProperties = fieldClasses[fieldClassesArr[clsIndx]]
      if (Object.prototype.hasOwnProperty.call(clsProperties, 'font-weight')) {
        let weight = clsProperties['font-weight']
        weight = Number(getValueFromStateVar(themeVars, weight))
        if (weight && !fontWeightVariant.includes(weight)) fontWeightVariant.push(weight)
      }
      if (Object.prototype.hasOwnProperty.call(clsProperties, 'font-style')) {
        let style = clsProperties['font-style']
        style = getValueFromStateVar(themeVars, style)
        if (style && !fontStyleVariant.includes(style)) fontStyleVariant.push(style)
      }
    }
  }
  return [fontWeightVariant, fontStyleVariant]
}

export const updateGoogleFontUrl = (allStyles) => {
  const themeVars = getAtom($themeVars)
  const themeVarsLgLight = getAtom($themeVarsLgLight)
  const themeVarsLgDark = getAtom($themeVarsLgDark)
  const themeVarsMdLight = getAtom($themeVarsMdLight)
  const themeVarsMdDark = getAtom($themeVarsMdDark)
  const themeVarsSmLight = getAtom($themeVarsSmLight)
  const themeVarsSmDark = getAtom($themeVarsSmDark)
  let fontWeights = []
  let fontStyleVariant = []
  if (allStyles?.lgLightStyles?.font?.fontType !== 'Google') return allStyles
  const {
    lgLightStyles,
    lgDarkStyles,
    mdLightStyles,
    mdDarkStyles,
    smLightStyles,
    smDarkStyles,
  } = allStyles

  const [lgFontWeightVariant, lgFontStyleVariant] = findExistingFontStyleNWeight(lgLightStyles, themeVarsLgLight)
  const [mdFontWeightVariant, mdFontStyleVariant] = findExistingFontStyleNWeight(mdLightStyles, themeVarsMdLight)
  const [smFontWeightVariant, smFontStyleVariant] = findExistingFontStyleNWeight(smLightStyles, themeVarsSmLight)
  const [lgFontWeightVariantDark, lgFontStyleVariantDark] = findExistingFontStyleNWeight(lgDarkStyles, themeVarsLgDark)
  const [mdFontWeightVariantDark, mdFontStyleVariantDark] = findExistingFontStyleNWeight(mdDarkStyles, themeVarsMdDark)
  const [smFontWeightVariantDark, smFontStyleVariantDark] = findExistingFontStyleNWeight(smDarkStyles, themeVarsSmDark)

  const fontWeightparam = []
  let string = ''
  const globalFont = themeVars['--g-font-family']
  fontWeights = [
    ...lgFontWeightVariant,
    ...mdFontWeightVariant,
    ...smFontWeightVariant,
    ...lgFontWeightVariantDark,
    ...mdFontWeightVariantDark,
    ...smFontWeightVariantDark,
  ]
  fontStyleVariant = [
    ...lgFontStyleVariant,
    ...mdFontStyleVariant,
    ...smFontStyleVariant,
    ...lgFontStyleVariantDark,
    ...mdFontStyleVariantDark,
    ...smFontStyleVariantDark,
  ]
  fontWeights = [...new Set(fontWeights)]
  fontStyleVariant = [...new Set(fontStyleVariant)]
  const fontWeightVLen = fontWeights.length

  if (fontWeightVLen > 0) {
    for (let indx = 0; indx < fontWeightVLen; indx += 1) {
      if (fontStyleVariant.includes('italic')) {
        fontWeightparam.push(`1,${fontWeights[indx]};`)
      }
      fontWeightparam.push(`0,${fontWeights[indx]};`)
    }
    const str = fontWeightparam.sort().toString().replace(/;,/gi, ';')
    string = str.substring(0, str.length - 1)
    string = `wght@${string}`
  }

  const url = generateFontUrl(globalFont, string)
  const newStyles = create(allStyles, drft => {
    drft.lgLightStyles.font.fontURL = url
  })
  return newStyles
}

export const arrayToObject = (arr) => {
  if (!arr) {
    // console.warn('arrayToObject: arr is undefined', arr)
    return {}
  }
  return Object.keys(arr).map(item => ({ label: arr[item], value: String(arr[item]) }))
}

export const isFieldOverrideStyles = (styles, fldKey) => styles?.fields?.[fldKey]?.overrideGlobalTheme?.length > 0

export const isLabelOverrideStyles = (styles, fldKey, lblName) => {
  if (Array.isArray(styles?.fields?.[fldKey]?.overrideGlobalTheme)) {
    return styles?.fields?.[fldKey]?.overrideGlobalTheme?.includes(lblName)
  }
  return false
}

export const isValidURL = (string) => {
  const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g)
  return (res !== null)
}

export const getValueFromStateVar = (stateObj, val) => {
  if (val?.match?.(/(var)/g)?.[0] === 'var') {
    const getVarProperty = val.replace(/\(|var|,.*|\)|(!important|\s)/gi, '')
    return getValueFromStateVar(stateObj, stateObj[getVarProperty] || '')
  }
  return val
}

export const setIconFilterValue = (iconType, fldKey) => {
  const styles = getAtom($styles)
  const themeColors = getAtom($themeColors)
  const elementKey = styleClasses[iconType][0]
  const filterValue = styles?.fields?.[fldKey].classes[`.${fldKey}-${elementKey}`]?.filter
  const themeVal = getValueFromStateVar(themeColors, filterValue)
  if (!themeVal) {
    const parentElement = getIconsParentElement(iconType)
    const parentColor = styles?.fields?.[fldKey].classes[`.${fldKey}-${parentElement}`]?.color
    if (parentColor && parentColor.indexOf('var') >= 0) {
      const parentThemeVal = getValueFromStateVar(themeColors, parentColor)
      if (parentThemeVal) {
        const valArr = parentThemeVal.match(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/gi)
        const hexValue = hslToHex(valArr[0], valArr[1], valArr[2])
        const setFilterValue = hexToCSSFilter(hexValue)
        const newThemeColors = create(themeColors, drft => {
          drft[getIconsGlobalFilterVariable(iconType)] = setFilterValue.filter
        })
        setAtom($themeColors, newThemeColors)
      }
    } else if (parentColor) {
      const valArr = parentColor.match(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/gi)
      const hexValue = hslToHex(valArr[0], valArr[1], valArr[2])
      const setFilterValue = hexToCSSFilter(hexValue)
      const newStyles = create(styles, drftStyles => {
        drftStyles.fields[fldKey].classes[`.${fldKey}-${elementKey}`].filter = setFilterValue.filter
        if (!checkExistElmntInOvrdThm(drftStyles.fields[fldKey], elementKey)) {
          drftStyles.fields[fldKey].overrideGlobalTheme = [...styles.fields[fldKey].overrideGlobalTheme, elementKey]
        }
      })
      setAtom($styles, newStyles)
    } else {
      const setFilterValue = hexToCSSFilter('#000000')
      const newStyles = create(styles, drftStyles => {
        drftStyles.fields[fldKey].classes[`.${fldKey}-${elementKey}`].filter = setFilterValue.filter
        if (!checkExistElmntInOvrdThm(drftStyles.fields[fldKey], elementKey)) {
          drftStyles.fields[fldKey].overrideGlobalTheme = [...styles.fields[fldKey].overrideGlobalTheme, elementKey]
        }
      })
      setAtom($styles, newStyles)
    }
  }
}

export const isStyleExist = (styles, fieldKey, classKeys) => {
  if (styles.fields[fieldKey].classes[`.${fieldKey}-${classKeys[0]}`]) return true
  return false
}

/**
 * @function paddingGenerator
 * @description This function generate padding for add or remove padding by icon position
 * @param {String} padding : {Padding String};
 * @param {String} pos {Add Icon left or right position in input field};
 * @param {true|false} add {When padding add param value true or remove param value false }
 * @return Padding String
 */
export const paddingGenerator = (padding, pos, add) => {
  let checkImportant = false
  let values
  if (padding === '') values = '10px'
  if (padding.match(/(!important)/gi)) {
    values = (padding.replace(/(!important)/gi, '')).trim().split(' ')
    checkImportant = true
  } else {
    values = (padding.replace(/(!important)/gi, '')).trim().split(' ')
  }
  const valuesLan = values.length
  const val = add ? '35px' : values[0]
  switch (valuesLan) {
    case 1:
      if (pos === 'left') {
        values = [values[0], values[0], values[0], val]
      } else {
        values = [values[0], val, values[0], values[0]]
      }
      break
    case 2:
      if (pos === 'left') {
        values = [values[0], values[1], values[0], val]
      } else {
        values = [values[0], val, values[0], values[1]]
      }
      break
    case 3:
      if (pos === 'left') {
        values = [values[0], values[1], values[2], val]
      } else {
        values = [values[0], val, values[2], values[1]]
      }
      break
    case 4:
      if (pos === 'left') {
        values = [values[0], values[1], values[2], val]
      } else {
        values = [values[0], val, values[2], values[3]]
      }
      break
    default:
      break
  }

  if (checkImportant) values[4] = '!important'

  return values.join(' ')
}

export const sortArrOfObjByMultipleProps = (props = []) => {
  const l = props.length

  return (a, b) => {
    for (let i = 0; i < l; i += 1) {
      const o = props[i]
      if (a[o] > b[o]) return 1
      if (a[o] < b[o]) return -1
    }
    return 0
  }
}

export const lowerCaseAllAndReplaceSpaceToHipen = (str) => str?.toLowerCase().replace(/ /g, '-')

export const styleToGradientObj = (styleStr) => {
  // get linera or radial type from style string
  const type = styleStr?.match(/^(linear|radial)/g)?.[0]

  // get numbers/values from style string
  // eslint-disable-next-line no-useless-escape
  const values = styleStr?.match(/-?[\d\.]+/g) || []

  const len = values.length
  let degree = 0
  let points = [{
    left: 0,
    red: 0,
    green: 0,
    blue: 0,
    alpha: 1,
  },
  {
    left: 100,
    red: 255,
    green: 0,
    blue: 0,
    alpha: 1,
  }]

  if (!type) {
    return {
      degree,
      type: 'liner',
      points,
    }
  }
  points = []

  if (type === 'linear') {
    [degree] = len > 5 ? values : [0]
    for (let i = 1; i < len; i += 5) {
      points.push({
        red: values[i],
        green: values[i + 1],
        blue: values[i + 2],
        alpha: values[i + 3],
        left: values[i + 4],
      })
    }
  } else if (type === 'radial') {
    for (let i = 0; i < len; i += 5) {
      points.push({
        red: values[i],
        green: values[i + 1],
        blue: values[i + 2],
        alpha: values[i + 3],
        left: values[i + 4],
      })
    }
  }

  const gardient = {
    degree,
    type,
    points,
  }
  return gardient
}

export const getActualElementKey = (elmKey, fldType = '') => {
  const obj = {
    'filepond--root': 'inp-wrp .filepond--root',
    'filepond--drop-label': 'inp-wrp .filepond--drop-label',
    'filepond--label-action': 'inp-wrp .filepond--label-action',
    'filepond--panel-root': 'inp-wrp .filepond--panel-root',
    'filepond--item-panel': 'inp-wrp .filepond--item-panel',
    'filepond--file-action-button': 'inp-wrp .filepond--file-action-button',
    'filepond--drip-blob': 'inp-wrp .filepond--drip-blob',
    'filepond--file': 'inp-wrp .filepond--file',
    option: 'option-list .option',
    'opt-lbl-wrp': 'option-list .opt-lbl-wrp',
    'opt-icn': 'option-list .opt-icn',
    'opt-lbl': 'option-list .opt-lbl',
    'opt-suffix': 'option-list .opt-suffix',
    'opt-prefix': 'option-list .opt-prefix',
    'files-list': 'file-input-wrpr .files-list',
    'file-wrpr': 'file-input-wrpr .file-wrpr',
    'file-preview': 'file-input-wrpr .file-preview',
    'file-details': 'file-input-wrpr .file-details',
    'file-title': 'file-input-wrpr .file-title',
    'file-size': 'file-input-wrpr .file-size',
    'cross-btn': 'file-input-wrpr .cross-btn',
    'err-wrp': 'file-input-wrpr .err-wrp',
    'chip-wrp': 'selected-opt-lbl .chip-wrp',
    'chip-lbl': 'selected-opt-lbl .chip-lbl',
    'chip-icn': 'selected-opt-lbl .chip-icn',
    'chip-clear-btn': 'selected-opt-lbl .chip-clear-btn',
    'stripe-pay-btn': 'stripe-wrp .stripe-pay-btn',
    'signature-pad': 'signature-pad',
    'rating-input': 'rating-img',
    // select: { [elmKey]: elmKey },
  }
  return obj[fldType]?.[elmKey] || obj[elmKey] || elmKey
}

export const truncatedString = (str = '', len = 100) => (str.length > len ? (`${str.substring(0, len)}...`) : str)
