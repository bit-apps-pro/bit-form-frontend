/* eslint-disable no-param-reassign */
import { json } from 'react-router-dom'
import { getMultiStepStyle, multiStepResponsiveStaticStyles } from '../../../components/MultiStep/BuilderStepHelper'
import themeProvider from '../../../components/style-new/themes/themeProvider'
import { replaceConditionFldKeyWithFormId, replaceFldKey, replaceFormIdDigits, replaceFormIdInStyles, replaceLayoutKeyValue } from '../../../components/Template/templateHelpers'
import templateList from '../../../components/Template/templateList'
import { $payments } from '../../../GlobalStates/AppSettingsStates'
import { getAtom } from '../../../GlobalStates/BitStore'
import bitsFetch from '../../bitsFetch'
import { addDomainName, mergeNestedObj } from '../../globalHelpers'
import { defaultConfirmations } from './defaultConfirmation'
import getTemplateData from './getTemplateData'

export default function templateProvider(templateSlug, formId, bits) {
  return new Promise((resolve, reject) => {
    let templateData = {}
    const url = window.location.href.split('#')[0]

    const templateConfig = templateList.find(t => t.slug === templateSlug)
    if (!templateConfig) {
      window.open(url, '_self')
      return
    }

    if (templateConfig?.isPro && !bits?.isPro) {
      window.open(url, '_self')
      return
    }

    if (templateConfig?.isPro && bits?.isPro) {
      bitsFetch({
        templateSlug,
      }, 'bitforms_get_form_template')
        .then((res) => {
          if (res.success) {
            templateData = JSON.parse(res.data)
            templateData.theme = templateConfig?.theme || 'bitformDefault'
            if (templateConfig?.paymentType) {
              const { fields } = templateData
              const paymentTyp = templateConfig.paymentType.map(p => p.toLowerCase())
              setPaymentConfigId(paymentTyp, fields)
            }

            templateData = formattedData(templateData, formId, false)
            resolve(templateData)
          }
        })
        .catch((err) => reject(err))
    } else {
      templateData = getTemplateData(templateSlug)
      templateData.theme = templateConfig?.theme || 'bitformDefault'
      templateData = formattedData(templateData, formId)

      resolve(templateData)
    }
  })
}

const setPaymentConfigId = (paymentType, fields) => {
  const payments = getAtom($payments)
  const paymentMap = payments.reduce((map, payment) => {
    map[payment.type.toLowerCase()] = payment.id
    return map
  }, {})

  const fieldKeyArr = Object.keys(fields)

  fieldKeyArr.forEach((fld) => {
    const typ = fields[fld].typ.toLowerCase()
    if (paymentType.includes(typ) && paymentMap[typ]) {
      fields[fld].payIntegID = paymentMap[typ]
    }
  })
}

export const defaultConds = {
  cond_type: 'if',
  logics: [
    {
      field: '',
      logic: '',
      val: '',
    },
    'or',
    {
      field: '',
      logic: '',
      val: '',
    },
  ],
  actions: {
    fields: [
      {
        field: '',
        action: 'value',
      },
    ],
    success: [
      {
        type: 'successMsg',
        details: { id: '{"index":0}' },
      },
    ],
  },
}

function defaultConditions() {
  return ([
    {
      title: 'Show Success Message',
      action_type: 'onsubmit',
      action_run: 'create_edit',
      action_behaviour: 'always',
      conditions: [defaultConds],
    },
  ])
}

function formattedData(templateData, formId, isDefaultCondition = true) {
  const nestedLayouts = {}
  const {
    name, fields, layouts, conditions, confirmations, theme: themeSlug, additionalSettings, formInfo,
  } = templateData

  const newFields = addDomainName(fields)

  const fldKeys = Object.keys(newFields)
  const fieldsWithKey = {}
  let staticStyles = {}

  let confirmationsWithId
  let defaultConditionsVal

  if (isDefaultCondition) {
    confirmationsWithId = mergeNestedObj(defaultConfirmations(formId), confirmations || {})
    defaultConditionsVal = [...defaultConditions(), ...(conditions || [])]
  } else {
    confirmationsWithId = confirmations
    defaultConditionsVal = replaceConditionFldKeyWithFormId(conditions, formId)
  }

  fldKeys.forEach((fldKey) => {
    const newKey = fldKey.replace('fld_key', `b${formId}`)
    const fldData = { ...newFields[fldKey] }
    fldData.fieldName = `${fldData.typ}-${newKey}`
    fieldsWithKey[newKey] = fldData
  })

  const bfId = `b${formId}`

  const layoutsWithKey = replaceLayoutKeyValue(layouts, /fld_key/, bfId)

  if (templateData?.nestedLayouts) {
    const layout = templateData.nestedLayouts
    replaceFldKey(layout, /fld_key/, bfId)
    Object.keys(layout).forEach((key) => {
      const lgValue = layout[key].lg
      nestedLayouts[key] = {
        lg: lgValue,
        md: lgValue,
        sm: lgValue,
      }
    })
  }

  const fieldsArr = Object.entries(fieldsWithKey)
  let { themeColors, themeVars, styles } = themeProvider(themeSlug, fieldsArr, formId)

  if (templateData?.themeColors) {
    themeColors = mergeNestedObj(themeColors, templateData.themeColors)
  }

  if (templateData?.themeVars) {
    themeVars = mergeNestedObj(themeVars, templateData.themeVars)
  }

  if (templateData?.styles) {
    const templateStyle = replaceFormIdDigits(templateData?.styles, formId)
    styles = mergeNestedObj(styles, templateStyle)
  }

  if (Array.isArray(layouts)) {
    styles.lgLightStyles.form = mergeNestedObj(styles.lgLightStyles.form, getMultiStepStyle(formId, styles.lgLightStyles.theme))
    staticStyles = multiStepResponsiveStaticStyles(formId)
  }

  const newFormInfo = formInfo || { formName: name }

  const formData = {
    name,
    fields: fieldsWithKey,
    layouts: layoutsWithKey,
    confirmations: confirmationsWithId,
    conditions: defaultConditionsVal,
    allThemeColors: themeColors,
    allThemeVars: themeVars,
    allStyles: styles,
    additionalSettings,
    nestedLayouts,
    formInfo: newFormInfo,
    staticStyles,
  }
  return formData
}
