/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
import parse from 'html-react-parser'
import { create } from 'mutative'
import { $globalMessages, $hCaptcha, $payments, $reCaptchaV2, $turnstile } from '../GlobalStates/AppSettingsStates'
import { getAtom, setAtom } from '../GlobalStates/BitStore'
import { $activeBuilderStep } from '../GlobalStates/FormBuilderStates'
import {
  $additionalSettings,
  $alertModal,
  $allLayouts,
  $bits,
  $breakpoint, $builderHistory,
  $builderHookStates,
  $colorScheme, $fields, $formId, $formInfo, $layouts, $nestedLayouts, $proModal, $selectedFieldId, $updateBtn,
} from '../GlobalStates/GlobalStates'
import { $styles } from '../GlobalStates/StylesState'
import { $themeColors } from '../GlobalStates/ThemeColorsState'
import { $themeVars } from '../GlobalStates/ThemeVarsState'
import conversationalStyles from '../components/style-new/conversational-themes/conversationalStyles'
import { addDefaultStyleClasses, sortArrOfObjByMultipleProps } from '../components/style-new/styleHelpers'
import { IS_PRO, deepCopy } from './Helpers'
import { filterFieldTypesForRepeater, filterFieldTypesForSectionField } from './StaticData/allStaticArrays'
import proHelperData from './StaticData/proHelperData'
import { JCOF, mergeNestedObj, selectInGrid } from './globalHelpers'
import { compactResponsiveLayouts } from './gridLayoutHelper'
import { __ } from './i18nwrap'

export const cols = { lg: 60, md: 60, sm: 60 }

export const builderBreakpoints = { lg: 700, md: 420, sm: 300 }

/**
 * sort a layout array by x and y axis
 * @param {array} layoutArr layout array [{x:0,y:1,...}, {x:0,y:2,...}, ]
 * @returns {Array} sorted layout
 */
export const sortLayoutByXY = (layoutArr) => layoutArr.sort((first, second) => {
  const n = first.y - second.y
  if (n !== 0) return n
  return first.x - second.x
})

/**
 * check specific space are blank in a col
 * @param {number} maxCol maximum size of the column
 * @param {number} spaceNeed targeted space need to blank
 * @param {array} sortedBlockedPos blocked positions in array of number
 * @returns {number} give a start position of blank or -1 for no space
 */
export function getEmptyXPos(maxCol, spaceNeed, sortedBlockedPos) {
  if (sortedBlockedPos.length === 0) return 0
  const sortedBlockedPosArrLen = sortedBlockedPos.length
  for (let i = 1; i < sortedBlockedPosArrLen; i += 2) {
    if (
      sortedBlockedPos[i + 1]
      && sortedBlockedPos[i + 1] - sortedBlockedPos[i] > spaceNeed - 1
    ) {
      return sortedBlockedPos[i]
    }
  }

  if (maxCol - sortedBlockedPos[sortedBlockedPosArrLen - 1] > spaceNeed - 1) {
    return sortedBlockedPos[sortedBlockedPosArrLen - 1]
  }

  if (sortedBlockedPos[0] !== 0 && sortedBlockedPos[0] > spaceNeed - 1) {
    return 0
  }
  return -1
}

/**
 *
 * @param {number} key any sizekey of given object
 * @param {number} fieldMinW minimum required space for a field in
 * @param {Object} obj specify an object with number keys
 * @param {number} maxCol max column size
 * @returns {Boolean} check whether any of keys calue blocked x axis after given key
 */
export function isRestYhasBlockX(key, fieldMinW, obj, maxCol) {
  const objArr = Object.entries(obj)
  for (let i = 0; i < objArr.length; i += 1) {
    const [oKey] = objArr[i]
    if (Number(oKey) === Number(key)) {
      for (let j = i; j < objArr.length; j += 1) {
        const [, oVal] = objArr[j]
        if (getEmptyXPos(maxCol, fieldMinW, oVal) === -1) {
          return true
        }
      }
    }
  }
  return false
}
/**
 *
 * @param {Object} obj object with number keys
 * @param {number} key object key
 * @returns
 */
export function delAllPrevKeys(obj, key) {
  const targetKey = Number(key)
  const keysArr = Object.entries(obj)
  const keysArrLen = keysArr.length
  for (let i = 0; i < keysArrLen; i += 1) {
    const okey = Number(keysArr[i])
    if (okey === targetKey) return obj
    delete obj[okey]
  }
  return obj
}

/**
 * convert layout by specific column
 * @param lay
 * @param {number} tc  targeted column to be convert
 * @param {number} fieldMinW minimum space ned in a row for field
 * @returns {Array} converted array of object
 */
export function convertLayout(lay, tc, fieldMinW = 1) {
  const newLayout = []
  const layout = deepCopy(lay)
  const layoutYAxisCount = {} // key-> y , value-> used col arr

  function setOrUpdateXY(y, xFilledArr) {
    if (y in layoutYAxisCount) {
      layoutYAxisCount[y] = layoutYAxisCount[y]
        .concat(xFilledArr)
        .sort((a, b) => a - b)
    } else {
      layoutYAxisCount[y] = xFilledArr
    }
  }

  function setYaxisCount(fromY, toY, xFill) {
    const from = Number(fromY)
    const to = Number(toY)
    let filledPos = xFill

    for (let y = from; y <= to; y += 1) {
      if (y === to) {
        filledPos = []
      }
      setOrUpdateXY(y, filledPos)
    }
  }

  // insert first item
  const [firstLayoutItem] = layout
  if (!firstLayoutItem) return []
  // if item w is grater than tc then make it to max tc
  if (firstLayoutItem?.w > tc) {
    firstLayoutItem.w = tc
  }
  newLayout.push({ ...firstLayoutItem, x: 0, y: 0 })
  setYaxisCount(0, firstLayoutItem.h, [0, firstLayoutItem.w])

  let layoutItemIndex = 1
  while (layoutItemIndex <= layout.length) {
    if (!layout[layoutItemIndex]) break
    const layoutItem = layout[layoutItemIndex]

    // if item w is grater than tc then make it to max tc
    if (layoutItem.w > tc) {
      layoutItem.w = tc
    }

    const lastItem = newLayout[newLayout.length - 1]
    if (getEmptyXPos(tc, layoutItem.w, layoutYAxisCount[lastItem.y]) > -1) {
      newLayout.push({
        ...layoutItem,
        x: lastItem.x + lastItem.w,
        y: lastItem.y,
      })

      setYaxisCount(
        lastItem.y,
        lastItem.y + layoutItem.h,
        [
          lastItem.x + lastItem.w,
          layoutItem.w + lastItem.x + lastItem.w,
        ],
      )
      layoutItemIndex += 1
      continue
    }

    const layoutYAxisCountArr = Object.entries(layoutYAxisCount)
    const layoutYAxisCountArrLen = layoutYAxisCountArr.length

    for (let i = 0; i < layoutYAxisCountArrLen; i += 1) {
      const [key, value] = layoutYAxisCountArr[i]
      const blankXPos = getEmptyXPos(tc, layoutItem.w, value)

      if (blankXPos > -1) {
        newLayout.push({
          ...layoutItem,
          x: blankXPos,
          y: Number(key),
        })

        if (blankXPos === 0) {
          delAllPrevKeys(layoutYAxisCount, Number(key))
        }

        setYaxisCount(key, Number(key) + layoutItem.h, [
          blankXPos,
          blankXPos + layoutItem.w,
        ])

        layoutItemIndex += 1
        break
      } else if (
        getEmptyXPos(tc, fieldMinW, value) === -1
        || isRestYhasBlockX(key, fieldMinW, value, tc)
      ) {
        delete layoutYAxisCount[Number(key)]
      }
    }
  }
  return newLayout
}
export const propertyValueSumX = (propertyValue = '') => {
  let arr = propertyValue?.replace(/px|em|rem|!important/g, '').split(' ')
  if (arr.length === 1) { arr = Array(4).fill(arr[0]) }
  if (arr.length === 2) { arr = [arr[0], arr[1], arr[0], arr[1]] }
  if (arr.length === 3) { arr = [arr[0], arr[1], arr[2], arr[1]] }
  arr = [arr[1], arr[3]]
  const sum = arr?.reduce((pv, cv) => Number(pv) + Number(cv), 0)
  return sum || 0
}

const FIELDS_EXTRA_ATTR = {
  paypal: { pro: true, onlyOne: true, setDefaultPayConfig: true },
  razorpay: { pro: true, onlyOne: true, setDefaultPayConfig: true },
  stripe: { pro: true, onlyOne: true, setDefaultPayConfig: true },
  mollie: { pro: true, onlyOne: true, setDefaultPayConfig: true },
  shortcode: { pro: true },
  'advanced-file-up': { pro: true },
  'advanced-datetime': { pro: true },
  recaptcha: { onlyOne: true },
  turnstile: { onlyOne: true },
  hcaptcha: { onlyOne: true },
  submit: { onlyOne: true },
  reset: { onlyOne: true },
  signature: { pro: true },
}

const FIELD_FILTER = {
  section: filterFieldTypesForSectionField,
  repeater: filterFieldTypesForRepeater,
}

export const checkFieldsExtraAttr = (field, parentField) => {
  const paymentsIntegs = getAtom($payments)
  const reCaptchaV2 = getAtom($reCaptchaV2)
  const turnstile = getAtom($turnstile)
  const hCaptcha = getAtom($hCaptcha)
  // eslint-disable-next-line no-undef
  const allFields = getAtom($fields)
  const additionalSettings = getAtom($additionalSettings)
  const bits = getAtom($bits)
  const bitformBaseUrl = `${bits.siteURL}${bits.baseURL}`

  if (field.lbl === 'Select Country' && !IS_PRO) {
    return {
      validType: 'pro', msg: __('Country Field available in Pro version of Bit Form.'),
    }
  }
  if (field.typ === 'recaptcha' && additionalSettings?.enabled?.recaptchav3) {
    return { validType: 'onlyOne', msg: __('You can use either ReCaptcha-V2 or ReCaptcha-V3 in a form. to use ReCaptcha-V2 disable the ReCaptcha-V3 from the Form Settings.') }
  }

  if (field.typ === 'recaptcha' && (!reCaptchaV2?.secretKey || !reCaptchaV2?.siteKey)) {
    return { validType: 'keyEmpty', msg: parse(__(`<p style="font-size: 16px">To use reCaptchav2, you must set Site Key and Secret Key from <a href="${bitformBaseUrl}/app-settings/recaptcha/reCaptchaV2" target="_blank"><strong>App Settings</strong></a>. After completing the setup, please refresh this page to use the reCaptchav2.  <br /> <br /><strong style="color:red;">Remember:</strong> Please save your form before going to <a href="${bitformBaseUrl}/app-settings/recaptcha/reCaptchaV2" target="_blank"><strong>App Settings</strong></a></p>`)) }
  }

  if (field.typ === 'turnstile' && (!turnstile?.secretKey || !turnstile?.siteKey)) {
    return { validType: 'keyEmpty', msg: parse(__(`<p style="font-size: 16px">To use Turnstile, you must set Site Key and Secret Key from <a href="${bitformBaseUrl}/app-settings/recaptcha/turnstile" target="_blank"><strong>App Settings</strong></a>. After completing the setup, please refresh this page to use the Turnstile.  <br /> <br /><strong style="color:red;">Remember:</strong> Please save your form before going to <a href="${bitformBaseUrl}/app-settings/recaptcha/turnstile" target="_blank"><strong>App Settings</strong></a></p>`)) }
  }

  if (field.typ === 'hcaptcha' && (!hCaptcha?.secretKey || !hCaptcha?.siteKey)) {
    return { validType: 'keyEmpty', msg: parse(__(`<p style="font-size: 16px">To use hCaptcha, you must set Site Key and Secret Key from <a href="${bitformBaseUrl}/app-settings/recaptcha/hcaptcha" target="_blank"><strong>App Settings</strong></a>. After completing the setup, please refresh this page to use the reCaptchav2.  <br /> <br /><strong style="color:red;">Remember:</strong> Please save your form before going to <a href="${bitformBaseUrl}/app-settings/recaptcha/hcaptcha" target="_blank"><strong>App Settings</strong></a></p>`)) }
  }

  // eslint-disable-next-line no-undef
  if (FIELDS_EXTRA_ATTR[field.typ]?.pro && !IS_PRO) {
    return { validType: 'pro', msg: __(`${field.typ} field is available in Pro Version!`) }
  }

  if (FIELDS_EXTRA_ATTR[field.typ]?.onlyOne && Object.values(allFields).find(fld => fld.typ === field.typ)) {
    return { validType: 'onlyOne', msg: __(`You cannot add more than one ${field.typ} field in the same form.`) }
  }

  if (field.typ === 'button' && FIELDS_EXTRA_ATTR[field.btnTyp]?.onlyOne && Object.values(allFields).find(fld => fld.typ === field.typ)) {
    return { validType: 'onlyOne', msg: __(`You cannot add more than one ${field.btnTyp} button in the same form.`) }
  }

  if (field.typ === 'button' && field.btnTyp === 'save-draft' && !IS_PRO) {
    return { validType: 'pro', msg: __('Save Draft Button available in Pro version of Bit Form.') }
  }

  if (parentField !== 'root' && FIELD_FILTER[parentField]?.includes(field.typ)) {
    return { validType: 'onlyOne', msg: __(`You cannot add ${field.typ} field in the ${parentField}.`) }
  }

  if (FIELDS_EXTRA_ATTR[field.typ]?.setDefaultPayConfig) {
    const payConf = paymentsIntegs.filter(pay => pay.type.toLowerCase() === field.typ)
    if (payConf.length === 1) {
      return { validType: 'setDefaultPayConfig', payData: payConf[0] }
    }
  }

  const paymentTypes = ['paypal', 'stripe', 'razorpay', 'mollie']

  if (paymentsIntegs && paymentTypes.includes(field.typ)) {
    const payConf = paymentsIntegs.filter(pay => pay.type.toLowerCase() === field.typ)
    if (!payConf.length) {
      const fieldType = field.typ
      const typ = {
        stripe: 'Stripe',
        paypal: 'PayPal',
        razorpay: 'Razorpay',
        mollie: 'Mollie',
      }
      return { validType: 'notConfigured', msg: parse(__(`<p style="font-size: 16px">To use ${typ[fieldType]}, you must configure ${typ[fieldType]} from <a href="${bitformBaseUrl}/app-settings/payments/${typ[fieldType]}" target="_blank"><strong>App Settings</strong></a>. After completing the setup, please refresh this page to use the ${typ[fieldType]}. <br /> <br /><strong style="color:red;">Remember:</strong> Please save your form before going to <a href="${bitformBaseUrl}/app-settings/payments/${typ[fieldType]}" target="_blank"><strong>App Settings</strong></a></p>`)) }
    }
  }

  return {}
}

export const handleFieldExtraAttr = (fieldData, parentField = 'root') => {
  const extraAttr = checkFieldsExtraAttr(fieldData, parentField)
  if (extraAttr.validType === 'pro') {
    setAtom($proModal, { show: true, ...proHelperData[fieldData.typ] })
    return 0
  }

  if (extraAttr.validType === 'onlyOne' || extraAttr.validType === 'keyEmpty') {
    setAtom($alertModal, { show: true, msg: extraAttr.msg, cancelBtn: false })
    return 0
  }

  if (extraAttr.validType === 'notConfigured') {
    setAtom($alertModal, { show: true, msg: extraAttr.msg, cancelBtn: false })
    return 0
  }

  if (extraAttr.validType === 'setDefaultPayConfig') {
    const newFldData = { ...fieldData }
    newFldData.payIntegID = extraAttr.payData.id
    return newFldData
  }

  return fieldData
}

export function sortLayoutItemsByRowCol(layout) {
  // Slice to clone array as sort modifies
  return layout.slice(0).sort((a, b) => {
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    } if (a.y === b.y && a.x === b.x) {
      // Without this, we can get different sort results in IE vs. Chrome/FF
      return 0
    }
    return -1
  })
}

// export function produceNewLayouts(layouts, breakpointArr, cols) {
//   return create(layouts, draftLay => {
//     draftLay.lg = sortLayoutItemsByRowCol(draftLay.lg)
//     const minFieldW = draftLay.lg.reduce((prv, cur) => (prv < cur ? prv : cur))
//     const tmpLg = deepCopy(layouts.lg)
//     if (breakpointArr.indexOf('md') > -1) {
//       draftLay.md = convertLayout(tmpLg, cols.md, minFieldW)
//     }
//     if (breakpointArr.indexOf('sm') > -1) {
//       draftLay.sm = convertLayout(tmpLg, cols.sm, minFieldW)
//     }
//     console.log('drft', draftLay.lg, draftLay.md, draftLay.sm)
//   })
// }
export function produceNewLayouts(layouts, breakpointArr, gridCols) {
  const lays = deepCopy(layouts)
  lays.lg = sortLayoutItemsByRowCol(lays.lg)
  const minFieldW = lays.lg.reduce((prv, cur) => (prv < cur ? prv : cur))
  if (breakpointArr.includes('lg')) {
    lays.lg = convertLayout(lays.lg, gridCols.lg, minFieldW)
  }
  if (breakpointArr.includes('md')) {
    lays.md = convertLayout(lays.lg, gridCols.md, minFieldW)
  }
  if (breakpointArr.includes('sm')) {
    lays.sm = convertLayout(lays.lg, gridCols.sm, minFieldW)
  }
  return lays
}

// export function layoutOrderSortedByLg(lay, cols) {
//   return create(lay, drft => {
//     const draftedLay = drft
//     draftedLay.md = sortLayoutByLg(draftedLay.md, draftedLay.lg)
//     draftedLay.sm = sortLayoutByLg(draftedLay.sm, draftedLay.lg)
//     draftedLay.lg = sortLayoutItemsByRowCol(draftedLay.lg)
//     const minFieldWidthMd = draftedLay.md.reduce((prv, cur) => (prv < cur ? prv : cur))
//     const minFieldWidthSm = draftedLay.sm.reduce((prv, cur) => (prv < cur ? prv : cur))
//     draftedLay.md = convertLayout(draftedLay.md, cols.md, minFieldWidthMd)
//     draftedLay.sm = convertLayout(draftedLay.lg, cols.sm, minFieldWidthSm)
//   })
// }

export function layoutOrderSortedByLg(lay, gridCols) {
  const tmpLay = deepCopy(lay)
  const newLay = { lg: [], md: [], sm: [] }

  newLay.lg = sortLayoutItemsByRowCol(tmpLay.lg)
  newLay.md = sortLayoutByLg(tmpLay.md, newLay.lg)

  newLay.sm = sortLayoutByLg(tmpLay.sm, newLay.lg)

  const minFieldWidthSm = tmpLay.sm.reduce((prv, cur) => (prv < cur ? prv : cur))
  const minFieldWidthMd = tmpLay.md.reduce((prv, cur) => (prv < cur ? prv : cur))

  newLay.md = convertLayout(newLay.md, gridCols.md, minFieldWidthMd)
  newLay.sm = convertLayout(newLay.sm, gridCols.sm, minFieldWidthSm)

  return newLay
}

export function prepareLayout(lays, respectLGLayoutOrder) {
  let layouts = compactResponsiveLayouts(lays, cols)

  // if all layout length not same then produce new layout
  if (layouts.lg.length !== layouts.md.length
    || layouts.lg.length !== layouts.sm.length) {
    layouts = produceNewLayouts(layouts, ['md', 'sm'], cols)
  }

  if (respectLGLayoutOrder) {
    layouts = layouts.lg.length > 0 ? layoutOrderSortedByLg(layouts, cols) : layouts
  } else {
    // sort all layout by x and y
    layouts.lg = sortLayoutItemsByRowCol(layouts.lg)
    layouts.md = sortLayoutItemsByRowCol(layouts.md)
    layouts.sm = sortLayoutItemsByRowCol(layouts.sm)

    // if any layout item width cross the max col then produce new layout
    if (layouts.md.findIndex(itm => itm.w > cols.md) > -1) {
      const minFieldWidthMd = layouts.md.reduce((prv, cur) => (prv < cur ? prv : cur))
      layouts.md = convertLayout(layouts.md, cols.md, minFieldWidthMd)
    }
    // if any layout item width cross the max col then produce new layout
    if (layouts.sm.findIndex(itm => itm.w > cols.sm) > -1) {
      const minFieldWidthSm = layouts.sm.reduce((prv, cur) => (prv < cur ? prv : cur))
      layouts.sm = convertLayout(layouts.sm, cols.sm, minFieldWidthSm)
    }
  }

  return layouts
}

export const addToBuilderHistory = (historyData, unsaved = true, index = undefined) => {
  const builderHistoryState = getAtom($builderHistory)
  const changedHistory = create(builderHistoryState, draft => {
    if (index !== undefined) {
      if (!draft.histories[index]) draft.histories[index] = {}
      const history = draft.histories[index]
      draft.histories[index] = mergeNestedObj(history, historyData)
    } else {
      const lastHistory = draft.histories[draft.histories.length - 1]
      if ((lastHistory.type === historyData.type) && (lastHistory.state.fldKey === historyData.state.fldKey)) {
        draft.histories.pop()
        draft.active = draft.histories.length - 1
      }
      draft.histories.splice(draft.active + 1)
      draft.active = draft.histories.push(historyData) - 1
    }
  })
  setAtom($builderHistory, changedHistory)

  if (unsaved) {
    const updateBtn = getAtom($updateBtn)
    setAtom($updateBtn, { ...updateBtn, unsaved: true })
  }
}

const checkErrKeyIndex = (fieldKey, errorKey) => {
  const updateBtn = getAtom($updateBtn)
  return Array.isArray(updateBtn.errors) ? updateBtn.errors.findIndex(({ fieldKey: fldKey,
    errorKey: errKey }) => (fieldKey || errorKey) && (fieldKey ? fieldKey === fldKey : true) && (errorKey ? errorKey === errKey : true)) : -1
}

export const addFormUpdateError = (err) => {
  const updateBtn = getAtom($updateBtn)
  const { fieldKey, errorKey } = err
  const errIndex = checkErrKeyIndex(fieldKey, errorKey)
  if (errIndex > -1) return
  const newUpdateBtn = create(updateBtn, draftUpdateBtn => {
    if (!draftUpdateBtn.errors) {
      draftUpdateBtn.errors = []
    }
    draftUpdateBtn.errors.push(err)
  })
  setAtom($updateBtn, newUpdateBtn)
}

export const removeFormUpdateError = (fieldKey, errorKey) => {
  const updateBtn = getAtom($updateBtn)
  const errIndex = checkErrKeyIndex(fieldKey, errorKey)

  if (errIndex < 0) return
  if (fieldKey && !errorKey) {
    const newUpdateBtn = create(updateBtn, draftUpdateBtn => {
      // delete all matched fieldKey errors
      draftUpdateBtn.errors = draftUpdateBtn.errors.filter(({ fieldKey: fldKey }) => fldKey !== fieldKey)
      if (draftUpdateBtn.errors.length === 0) {
        delete draftUpdateBtn.errors
      }
    })
    setAtom($updateBtn, newUpdateBtn)
    return
  }
  const newUpdateBtn = create(updateBtn, draftUpdateBtn => {
    draftUpdateBtn.errors.splice(errIndex, 1)

    const otherFldErrors = draftUpdateBtn.errors.filter(({ errorKey: errKey }) => errorKey === errKey)
    if (otherFldErrors.length === 1) {
      const otherErrorsIndex = checkErrKeyIndex('', errorKey)
      draftUpdateBtn.errors.splice(otherErrorsIndex, 1)
    }

    if (draftUpdateBtn.errors.length === 0) {
      delete draftUpdateBtn.errors
    }
  })

  setAtom($updateBtn, newUpdateBtn)
}

export const compactNewLayoutItem = (breakpoint, layout, layouts) => create(layouts, drftLay => {
  let minFieldW = 55
  drftLay.lg.map(layItm => {
    if (layItm.w < minFieldW) {
      minFieldW = layItm.w
    }
  })
  drftLay.lg.push(layout.lg || layout)
  drftLay.md.push(layout.md || layout)
  drftLay.sm.push(layout.sm || layout)
  drftLay[breakpoint] = sortLayoutByXY(drftLay[breakpoint])
  if (breakpoint === 'lg') {
    drftLay.md = convertLayout(sortLayoutByXY(drftLay.md), cols.md, minFieldW)
    drftLay.sm = convertLayout(sortLayoutByXY(drftLay.sm), cols.sm, minFieldW)
  } else if (breakpoint === 'md') {
    drftLay.lg = convertLayout(sortLayoutByXY(drftLay.lg), cols.lg, minFieldW)
    drftLay.sm = convertLayout(sortLayoutByXY(drftLay.sm), cols.sm, minFieldW)
  } else if (breakpoint === 'sm') {
    drftLay.lg = convertLayout(sortLayoutByXY(drftLay.lg), cols.lg, minFieldW)
    drftLay.md = convertLayout(sortLayoutByXY(drftLay.md), cols.md, minFieldW)
  }
})

export const addNewItemInLayout = (layouts, newItem) => create(layouts, draftLayouts => {
  draftLayouts.lg.push(newItem)
  draftLayouts.md.push(newItem)
  draftLayouts.sm.push(newItem)
})

export const filterLayoutItem = (fldKey, layouts) => create(layouts, draft => {
  draft.lg = draft.lg.filter(l => l.i !== fldKey)
  draft.md = draft.md.filter(l => l.i !== fldKey)
  draft.sm = draft.sm.filter(l => l.i !== fldKey)
})

export function sortLayoutByLg(layoutArr, orderLayout) {
  const newLayoutByOrder = []
  const layout = layoutArr
  for (let i = 0; i < orderLayout.length; i += 1) {
    const index = layout.findIndex(itm => itm.i === orderLayout[i].i)
    newLayoutByOrder.push(layout[index])
    layout.splice(index, 0)
  }
  return newLayoutByOrder
}

const getElementTotalHeight = (elm) => {
  if (elm) {
    const elmOldHeight = elm.style.height
    elm.style.height = 'auto'
    const height = elm.offsetHeight || 0
    const { marginTop, marginBottom } = window.getComputedStyle(elm)
    const marginTopNumber = Number(marginTop.match(/\d+/gi))
    const marginBottomNumber = Number(marginBottom.match(/\d+/gi))
    elm.style.height = elmOldHeight
    return Math.ceil(height + marginTopNumber + marginBottomNumber)
  }
  console.error('getElementTotalHeight: elm is null')
  return 0
}

export const fitAllLayoutItems = (lays) => {
  const newLays = deepCopy(lays)
  for (let i = 0; i < newLays?.lg?.length; i += 1) {
    newLays.lg[i].h = Math.ceil(getElementTotalHeight(selectInGrid(`.${newLays.lg[i].i}-fld-wrp`))) || newLays.lg[i].h
    newLays.md[i].h = Math.ceil(getElementTotalHeight(selectInGrid(`.${newLays.md[i].i}-fld-wrp`))) || newLays.md[i].h
    newLays.sm[i].h = Math.ceil(getElementTotalHeight(selectInGrid(`.${newLays.sm[i].i}-fld-wrp`))) || newLays.sm[i].h
  }
  return newLays
}

export const fitSpecificLayoutItem = (lays, fieldKey) => {
  const newLays = deepCopy(lays)
  const lgFld = newLays.lg.find(itm => itm.i === fieldKey)
  const mdFld = newLays.md.find(itm => itm.i === fieldKey)
  const smFld = newLays.sm.find(itm => itm.i === fieldKey)

  if (lgFld) lgFld.h = Math.ceil(getElementTotalHeight(selectInGrid(`.${lgFld.i}-fld-wrp`))) || lgFld.h
  if (mdFld) mdFld.h = Math.ceil(getElementTotalHeight(selectInGrid(`.${mdFld.i}-fld-wrp`))) || mdFld.h
  if (smFld) smFld.h = Math.ceil(getElementTotalHeight(selectInGrid(`.${smFld.i}-fld-wrp`))) || smFld.h
  return newLays
}

export const nestedObjAssign = (obj, paths, value, createNonExist = true) => {
  const path = paths?.split?.('->') || []
  if (path.length === 1) {
    if (createNonExist) {
      if (value instanceof Object) {
        const tmp = obj[path]
        obj[path] = { ...tmp, ...value }
        return
      }
      obj[path] = value
      return
    } return
  }

  if (path.length > 1 && obj[path[0]] === undefined) {
    if (createNonExist) {
      obj[path[0]] = {}
    } else return
  }

  return nestedObjAssign(obj[path[0]], path.slice(1), value)
}

export const deleteNestedObj = (obj, keyPath) => {
  const paths = keyPath?.split('->') || []
  if (paths.length === 1) {
    delete obj[paths[0]]
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
  delete obj[paths[lastKeyIndex]]
}

export const propertyValueSumY = (propertyValue = '') => {
  let arr = propertyValue?.replace(/px|em|rem|!important/g, '').split(' ')
  if (arr.length === 1) { arr = Array(4).fill(arr[0]) }
  if (arr.length === 2) { arr = [arr[0], arr[1], arr[0], arr[1]] }
  if (arr.length === 3) { arr = [arr[0], arr[1], arr[2], arr[1]] }
  arr = [arr[0], arr[2]]
  const summ = arr?.reduce((pv, cv) => Number(pv) + Number(cv), 0)
  return summ || 0
}

export const filterNumber = numberString => Number(numberString.replace(/px|em|rem|!important/g, ''))

export const reCalculateFldHeights = (fieldKey) => {
  const builderHookState = getAtom($builderHookStates)
  const layouts = getAtom($layouts)
  const isExistInLayout = layouts.lg.find(itm => itm.i === fieldKey)
  if (fieldKey && isExistInLayout) {
    const newBuilderHookState = create(builderHookState, draft => {
      const { counter } = draft.reCalculateSpecificFldHeight
      draft.reCalculateSpecificFldHeight = {
        fieldKey,
        counter: counter + 1,
      }
    })
    setAtom($builderHookStates, newBuilderHookState)
  } else if (!fieldKey) {
    const newBuilderHookState = create(builderHookState, draft => {
      draft.reCalculateFieldHeights += 1
    })
    setAtom($builderHookStates, newBuilderHookState)
  } else if (!isExistInLayout) {
    const parentFieldKey = getParentFieldKey(fieldKey)
    const newBuilderHookState = create(builderHookState, draft => {
      const { counter } = draft.recalculateNestedField
      draft.recalculateNestedField = {
        fieldKey,
        parentFieldKey,
        counter: counter + 1,
      }
    })
    setAtom($builderHookStates, newBuilderHookState)
  }
}

export const getParentFieldKey = (childFieldKey) => {
  const nestedLayout = getAtom($nestedLayouts)
  let parentFieldKey = ''
  Object.entries(nestedLayout || {}).forEach(([key, layout]) => {
    if (layout.lg.find(itm => itm.i === childFieldKey)) {
      parentFieldKey = key
      return parentFieldKey
    }
    if (layout.md.find(itm => itm.i === childFieldKey)) {
      parentFieldKey = key
      return parentFieldKey
    }
    if (layout.sm.find(itm => itm.i === childFieldKey)) {
      parentFieldKey = key
      return parentFieldKey
    }
  })
  return parentFieldKey
}

export const isFieldInNestedLayouts = (fieldKey, breakpoint = 'lg') => {
  const nestedLayout = getAtom($nestedLayouts)
  let isInNestedLayout = false
  Object.entries(nestedLayout).forEach(([key, layout]) => {
    if (layout[breakpoint]?.some(itm => itm.i === fieldKey)) {
      isInNestedLayout = true
      return isInNestedLayout
    }
  })
  return isInNestedLayout
}

export const generateHistoryData = (element, fieldKey, path, changedValue, state) => {
  const propertyName = genaratePropertyName(path)
  let event = ''
  if (fieldKey) {
    state.fldKey = fieldKey
    event = `${propertyName} ${changedValue ? `changed to ${changedValue}` : ''}: ${elementLabel(element)}`
  } else {
    state.fldKey = elementLabel(element)
    event = `${propertyName} ${changedValue ? `changed to ${changedValue}` : ''}`
  }
  return {
    event,
    type: `${propertyName}_changed`,
    state,
  }
}

export const getLatestState = (stateName) => {
  // conver if statement to switch
  switch (stateName) {
    case 'fields': return getAtom($fields)
    case 'styles': return getAtom($styles)
    case 'themeVars': return getAtom($themeVars)
    case 'themeColors': return getAtom($themeColors)
    case 'breakpoint': return getAtom($breakpoint)
    case 'colorScheme': return getAtom($colorScheme)
    case 'allLayouts': return getAtom($allLayouts)
    case 'formInfo': return getAtom($formInfo)
    case 'layouts': return getAtom($layouts)
    case 'nestedLayouts': return getAtom($nestedLayouts)
    case 'activeBuilderStep': return getAtom($activeBuilderStep)
    default: return undefined
  }
}

const elementLabel = (element) => {
  const labels = {
    'quick-tweaks': 'Theme Quick Tweaks',
    '_frm-bg': 'Form Wrapper',
    _frm: 'Form Container',
    'field-containers': 'Field Container',
    'label-containers': 'Label & Subtitle Container',
    'lbl-wrp': 'Label Container',
    lbl: 'Label',
    'lbl-pre-i': 'Label Leading Icon',
    'lbl-suf-i': 'Label Trailing Icon',
    'sub-titl': 'Subtitle',
    'sub-titl-pre-i': 'Subtitle Leading Icon',
    'sub-titl-suf-i': 'Subtitle Trailing Icon',
    'pre-i': 'Input Leading Icon',
    'suf-i': 'Input Trailing Icons',
    'hlp-txt': 'Helper Text',
    'hlp-txt-pre-i': 'Helper Text Leading Icon',
    'hlp-txt-suf-i': 'Helper Text Trailing Icon',
    'err-msg': 'Error Message',
    'err-txt-pre-i': 'Error Text Leading Icon',
    'err-txt-suf-i': 'Error Text Trailing Icon',
    btn: 'Button',
    'btn-pre-i': 'Button Leading Icon',
    'btn-suf-i': 'Button Trailing Icon',
    'req-smbl': 'Asterisk Symbol',
    fld: 'Input Field',
  }
  return labels[element] || element || ''
}

const genaratePropertyName = (propertyName) => {
  const newPropertyName = propertyName?.includes('->') ? propertyName.slice(propertyName.lastIndexOf('->') + 2) : propertyName
  return newPropertyName
    ?.replace(/--/g, '')
    .replace(/-/g, ' ')
    .replace(/\b(fld)\b/g, 'Field')
    .replace(/\b(pre)\b/g, 'Leading')
    .replace(/\b(suf)\b/g, 'Suffix')
    .replace(/\b(i)\b/g, 'Icon')
    .replace(/\b(lbl)\b/g, 'Label')
    .replace(/\b(clr)\b/g, 'Color')
    .replace(/\b(c)\b/g, 'Color')
    .replace(/\b(bdr)\b/g, 'Border')
    .replace(/\b(fltr)\b/g, 'Filter')
    .replace(/\b(sh)\b/g, 'Shadow')
    .replace(/\b(bg)\b/g, 'Background')
    .replace(/\b(hlp)\b/g, 'Helper')
    .replace(/\b(err)\b/g, 'Error')
    .replace(/\b(titl)\b/g, 'Title')
    .replace(/\b(smbl)\b/g, 'Symbol')
    .replace(/\b(fs)\b/g, 'Font Size')
    .replace(/\b(m)\b/g, 'Margin')
    .replace(/\b(p)\b/g, 'Padding')
    .replace(/\b(w)\b/g, 'Width')
    .replace(/\b(h)\b/g, 'Height')
    .replace(/\b(wrp)\b/g, 'Container')
    .replace(/\b(req)\b/g, 'Required')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export const calculateFormGutter = (styles, formId) => {
  let gutter = 0
  if (!styles) return gutter
  if (styles[`._frm-b${formId}`]?.['border-width']) { gutter += propertyValueSumX(styles[`._frm-b${formId}`]['border-width']) }
  if (styles[`._frm-b${formId}`]?.padding) { gutter += propertyValueSumX(styles[`._frm-b${formId}`].padding) }
  if (styles[`._frm-b${formId}`]?.margin) { gutter += propertyValueSumX(styles[`._frm-b${formId}`].margin) }
  if (styles[`._frm-bg-b${formId}`]?.['border-width']) { gutter += propertyValueSumX(styles[`._frm-bg-b${formId}`]['border-width']) }
  if (styles[`._frm-bg-b${formId}`]?.padding) { gutter += propertyValueSumX(styles[`._frm-bg-b${formId}`].padding) }
  if (styles[`._frm-bg-b${formId}`]?.margin) { gutter += propertyValueSumX(styles[`._frm-bg-b${formId}`].margin) }
  return gutter
}

export const getResizableHandles = fieldType => {
  switch (fieldType) {
    // case 'divider':
    case 'textarea':
    case 'spacer':
    case 'image':
    case 'signature':
      return ['se', 'e']
    default:
  }
}

export const setRequired = (e, callBack) => {
  const fields = getAtom($fields)
  const fldKey = getAtom($selectedFieldId)
  const globalMessages = getAtom($globalMessages)
  const fieldData = deepCopy(fields[fldKey])
  if (e.target.checked) {
    const tmp = { ...fieldData.valid }
    tmp.req = true
    tmp.reqShow = true
    tmp.reqPos = 'after'
    fieldData.valid = tmp
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err.req) fieldData.err.req = {}
    fieldData.err.req.dflt = globalMessages?.err?.[fieldData.typ]?.req || globalMessages?.err?.req || `<p style="margin:0">${__('This field is required')}</p>`
    fieldData.err.req.show = true
    addDefaultStyleClasses(fldKey, 'reqSmbl')
  } else {
    delete fieldData.valid.req
  }
  const allFields = create(fields, draft => { draft[fldKey] = fieldData })
  setAtom($fields, allFields)
  const req = e.target.checked ? 'on' : 'off'
  addToBuilderHistory({ event: `Field required ${req}: ${fieldData.adminLbl || fieldData.lbl || fldKey}`, type: `required_${req}`, state: { fields: allFields, fldKey } })
  callBack && callBack()
}

/**
 * find different field between 2 layout
 * @param lay1 layout Object
 * @param lay2 layout Object
 * @returns layout object which is different from lay1
 *  */
export function getLayoutDiff(lay1, lay2) {
  const diff = lay2.filter((l2) => {
    const l1Item = lay1.find((l1) => l2.i === l1.i)
    if (l1Item) {
      if (
        l1Item.w !== l2.w
        || l1Item.h !== l2.h
        || l1Item.x !== l2.x
        || l1Item.y !== l2.y
      ) {
        return true
      }
    }
  })
  return diff
}

// fast compare 2 layout object
export function isLayoutSame(l1, l2) {
  const l1LgLength = l1.lg.length
  const l1MdLength = l1.md.length
  const l1SmLength = l1.sm.length

  if (l1LgLength !== l2.lg.length) return false
  if (l1MdLength !== l2.md.length) return false
  if (l1SmLength !== l2.sm.length) return false

  // compare lg
  for (let i = 0; i < l1LgLength; i += 1) {
    const l1ItemKeys = Object.keys(l1.lg[i])
    const l2ItemKeys = Object.keys(l2.lg[i])
    const l1ItemKeysLength = l1ItemKeys.length
    if (l1ItemKeysLength !== l2ItemKeys.length) return false

    for (let j = 0; j < l1ItemKeysLength; j += 1) {
      const l1ItemKey = l1ItemKeys[j]
      if (Array.isArray(l1.lg[i][l1ItemKey])) {
        if (
          JSON.stringify(l1.lg[i][l1ItemKey])
          !== JSON.stringify(l2.lg[i][l1ItemKey])
        ) {
          return false
        }
      } else if (l1.lg[i][l1ItemKey] !== l2.lg[i][l1ItemKey]) {
        return false
      }
    }
  }

  // compare md
  for (let i = 0; i < l1MdLength; i += 1) {
    const l1ItemKeys = Object.keys(l1.md[i])
    const l2ItemKeys = Object.keys(l2.md[i])
    const l1ItemKeysLength = l1ItemKeys.length
    if (l1ItemKeysLength !== l2ItemKeys.length) return false

    for (let j = 0; j < l1ItemKeysLength; j += 1) {
      const l1ItemKey = l1ItemKeys[j]
      if (Array.isArray(l1.md[i][l1ItemKey])) {
        if (
          JSON.stringify(l1.md[i][l1ItemKey])
          !== JSON.stringify(l2.md[i][l1ItemKey])
        ) {
          return false
        }
      } else if (l1.md[i][l1ItemKey] !== l2.md[i][l1ItemKey]) {
        return false
      }
    }
  }

  // compare sm
  for (let i = 0; i < l1LgLength; i += 1) {
    const l1ItemKeys = Object.keys(l1.sm[i])
    const l2ItemKeys = Object.keys(l2.sm[i])
    const l1ItemKeysLength = l1ItemKeys.length
    if (l1ItemKeysLength !== l2ItemKeys.length) return false

    for (let j = 0; j < l1ItemKeysLength; j += 1) {
      const l1ItemKey = l1ItemKeys[j]
      if (Array.isArray(l1.sm[i][l1ItemKey])) {
        if (
          JSON.stringify(l1.sm[i][l1ItemKey])
          !== JSON.stringify(l2.sm[i][l1ItemKey])
        ) {
          return false
        }
      } else if (l1.sm[i][l1ItemKey] !== l2.sm[i][l1ItemKey]) {
        return false
      }
    }
  }
  return true
}

export function getAbsoluteElmHeight(el, withMargin = 1) {
  if (!el) return 0
  const iFrameWindow = document.getElementById('bit-grid-layout').contentWindow
  if (!withMargin) return el.offsetHeight
  const stl = iFrameWindow.getComputedStyle(el)
  const margin = parseFloat(stl.marginTop) + parseFloat(stl.marginBottom)
  return el.offsetHeight + margin
}

export const generateSessionKey = key => {
  const formId = getAtom($formId)
  if (!formId) return null
  return `btcd-${key}-bf-${formId}`
}

export async function addToSessionStorage(key, value, { strType } = {}) {
}

export const getSessionStorageStates = (key, { strType } = {}) => {
  if (!key) return null
  const state = sessionStorage.getItem(key)
  if (!state) return null
  if (!strType) return state
  if (strType === 'json') return JSON.parse(state)
  if (strType === 'jcof') return JCOF.parse(state)
  return state
}

export const getCurrentFormUrl = () => {
  const formID = getAtom($formId)
  const { hash } = window.location
  const url = hash.replace('#', '')
  const regex = new RegExp(`/(.*?)${formID}`)
  const matchedUrl = url.match(regex)
  if (matchedUrl) return matchedUrl[0]
  return null
}

export const getTotalLayoutHeight = () => {
  const layouts = getAtom($layouts)
  const breakpoint = getAtom($breakpoint)
  const layout = layouts[breakpoint]

  return layout.reduce((acc, { h, y }) => {
    const { [y]: prevH = 0 } = acc.maxHeightsByY
    const newH = Math.max(prevH, h)
    return {
      maxHeightsByY: { ...acc.maxHeightsByY, [y]: newH },
      totalHeight: acc.totalHeight + (newH - prevH),
    }
  }, { maxHeightsByY: {}, totalHeight: 0 }).totalHeight
}

export const getFieldsBasedOnLayoutOrder = () => {
  const fields = getAtom($fields)
  const layouts = getAtom($layouts)
  const breakpoint = getAtom($breakpoint)
  const nestedLayouts = getAtom($nestedLayouts)
  const breakpointLayouts = layouts[breakpoint]
  const breakpointNestedLayouts = Object.entries(nestedLayouts).reduce((acc, [fieldKey, lays]) => {
    const fldPosition = breakpointLayouts.find((lay) => lay.i === fieldKey)
    if (!fldPosition) return acc
    const breakpointLays = lays[breakpoint]
    const laysSumFldPosition = breakpointLays.map((lay) => ({ ...lay, y: lay.y + fldPosition.y }))
    return [...acc, ...laysSumFldPosition]
  }, [])
  const mergedLayouts = [...breakpointLayouts, ...breakpointNestedLayouts]
  const sortedLayouts = mergedLayouts.sort(sortArrOfObjByMultipleProps(['y', 'x']))
  const sortedFields = sortedLayouts.reduce((acc, lay) => ({ ...acc, [lay.i]: fields[lay.i] }), {})
  return sortedFields
}

export const getNestedLayoutHeight = (fieldKey) => {
  const nestedLayouts = getAtom($nestedLayouts)
  const layouts = nestedLayouts[fieldKey]
  const breakpoint = getAtom($breakpoint)
  if (!layouts) return 0
  const layout = layouts[breakpoint]
  return layout.reduce((acc, { h, y }) => {
    const { [y]: prevH = 0 } = acc.maxHeightsByY
    const newH = Math.max(prevH, h)
    return {
      maxHeightsByY: { ...acc.maxHeightsByY, [y]: newH },
      totalHeight: acc.totalHeight + (newH - prevH),
    }
  }, { maxHeightsByY: {}, totalHeight: 0 }).totalHeight
}

export const getNestedFieldKeysFromNestedLayouts = () => {
  const nestedLayouts = getAtom($nestedLayouts)
  return Object.keys(nestedLayouts || {})
}

export const isValidJsonString = (str) => {
  try {
    if (!JSON.parse(str)) return false
  } catch (e) {
    return false
  }
  return true
}

export const getUploadedFilesArr = files => {
  try {
    if (!files) return []
    if (Array.isArray(files)) return files
    const parsedFiles = isValidJsonString(files) ? JSON.parse(files) : [files]
    if (Array.isArray(parsedFiles)) {
      return parsedFiles
    }
    if (Object.prototype.toString.call(parsedFiles) === '[object Object]') {
      return Object.values(parsedFiles)
    }
    return parsedFiles
  } catch (_) {
    return []
  }
}

export const splitFileName = (fileId) => {
  const bits = getAtom($bits)
  const fileName = fileId?.split(bits?.configs?.bf_separator)
  if (fileName.length > 1) {
    return fileName[1]
  }
  return fileId
}

export const splitFileLink = (fileId) => {
  const bits = getAtom($bits)
  const fileName = fileId?.split(bits?.configs?.bf_separator)
  if (fileName.length > 1) {
    return fileName[0]
  }
  return fileId
}

export const getGeneratedConversationalStyleObject = (formId) => {
  const formInfo = getAtom($formInfo)
  const fields = getAtom($fields)
  return conversationalStyles(formId, formInfo?.conversationalSettings, fields)
}

export const setLocalItem = (itemName, itemValue) => localStorage.setItem(itemName, itemValue)

export const getLocalItem = (itemName) => localStorage.getItem(itemName)

export const generateBackslashPattern = str => str.replace(/\$_bf_\$/g, '\\')
export const escapeBackslashPattern = str => str.replace(/\\/g, '$_bf_$')
