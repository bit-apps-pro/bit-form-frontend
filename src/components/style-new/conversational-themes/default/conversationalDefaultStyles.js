import advancedFileUpDefaultStyles from './advancedFileUpDefaultStyles'
import checkAndRadioDefaultStyles from './checkAndRadioDefaultStyles'
import conversationalWrapperDefaultStyles from './conversationalWrapperDefaultStyles'
import countryDefaultStyles from './countryDefaultStyles'
import currencyDefaultStyles from './currencyDefaultStyles'
import dropdownDefaultStyles from './dropdownDefaultStyles'
import fileUpDefaultStyles from './fileUpDefaultStyles'
import htmlDefaultStyles from './htmlDefaultStyles'
import imageSelectDefaultStyles from './imageSelectDefaultStyles'
import paypalDefaultStyles from './paypalDefaultStyles'
import phoneNumberDefaultStyles from './phoneNumberDefaultStyles'
import ratingDefaultStyles from './ratingDefaultStyles'
import razorpayDefaultStyles from './razorpayDefaultStyles'
import repeaterDefaultStyles from './repeaterDefaultStyles'
import sectionDefaultStyles from './sectionDefaultStyles'
import selectDefaultStyles from './selectDefaultStyles'
import signatureDefaultStyles from './signatureDefaultStyles'
import stripeDefaultStyles from './stripeDefaultStyles'
import textDefaultStyles from './textDefaultStyles'

export default function conversationalDefaultStyles(formId, conversationalSettings, fields) {
  // define stylesObject with variables

  let stylesObject = conversationalWrapperDefaultStyles(formId)
  const fieldTypes = new Set()
  Object.values(fields).forEach(({ typ }) => fieldTypes.add(typ))
  const { themeSettings, stepListObject } = conversationalSettings
  const { welcomePage, allSteps, ...restSteps } = stepListObject

  stylesObject = Object.assign(stylesObject, {
    [`.bc${formId}-step`]: {
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      ...allSteps.background,
    },
    [`._frm-bg-b${formId}`]: {
      position: 'relative',
      height: '100%',
      ...themeSettings.background,
    },
  })

  if (welcomePage.enable) {
    stylesObject = Object.assign(stylesObject, {
      ...welcomePage.background && {
        [`.bc${formId}-step.bc${formId}-welcome`]: {
          ...welcomePage.background,
        },
      },
      ...welcomePage.buttonBgColor && {
        [`.bc${formId}-welcome .bc${formId}-btn`]: {
          background: welcomePage.buttonBgColor,
          ...welcomePage.buttonTextColor && {
            color: welcomePage.buttonTextColor,
          },
        },
        [`.bc${formId}-welcome .bc${formId}-btn:hover`]: {
          background: `hsl( from ${welcomePage.buttonBgColor} h s calc(l - .05)) !important`,
        },
        [`.bc${formId}-welcome .bc${formId}-btn:focus-visible`]: {
          outline: `2px solid ${welcomePage.buttonBgColor} !important`,
        },
        [`.bc${formId}-welcome .bc${formId}-step-hints`]: {
          color: `hsl( from ${welcomePage.buttonBgColor} h s calc(l - .05) / 50%) !important`,
        },
      },
    })
  }
  Object.entries(fields).forEach(([key, field]) => {
    if (['select', 'country', 'phone-number', 'currency'].includes(field.typ)) {
      stylesObject = Object.assign(stylesObject, {
        [`.bc${formId}-${key} .bc${formId}-step-fld-wrpr`]: {
          overflow: 'visible',
        },
      })
    }
  })
  Object.entries(restSteps).forEach(([key, value]) => {
    if (typeof value.enable === 'undefined' || value.enable) {
      stylesObject = Object.assign(stylesObject, {
        [`.bc${formId}-step.bc${formId}-${key}`]: {
          ...value.background,
        },
        ...value.buttonBgColor && {
          [`.bc${formId}-${key} .bc${formId}-btn`]: {
            background: value.buttonBgColor,
            ...value.buttonTextColor && {
              color: value.buttonTextColor,
            },
          },
          [`.bc${formId}-${key} .bc${formId}-btn:hover`]: {
            background: `hsl( from ${value.buttonBgColor} h s calc(l - .05)) !important`,
          },
          [`.bc${formId}-${key} .bc${formId}-btn:focus-visible`]: {
            outline: `2px solid ${value.buttonBgColor} !important`,
          },
          [`.bc${formId}-${key} .bc${formId}-step-hints`]: {
            color: `hsl( from ${value.buttonBgColor} h s calc(l - .05) / 50%) !important`,
          },
        },
      })
    }
  })

  // merge stylesObject with other styles by fieldTypes object
  fieldTypes.forEach((fieldType) => {
    switch (fieldType) {
      case 'text':
      case 'username':
      case 'number':
      case 'password':
      case 'email':
      case 'url':
      case 'date':
      case 'datetime-local':
      case 'time':
      case 'month':
      case 'week':
      case 'color':
      case 'textarea':
        stylesObject = Object.assign(stylesObject, textDefaultStyles(formId))
        break
      case 'check':
      case 'radio':
        stylesObject = Object.assign(stylesObject, checkAndRadioDefaultStyles(formId, fieldType))
        break
      case 'file-up':
        stylesObject = Object.assign(stylesObject, fileUpDefaultStyles(formId))
        break
      case 'advanced-file-up':
        stylesObject = Object.assign(stylesObject, advancedFileUpDefaultStyles(formId))
        break
      case 'html-select':
        stylesObject = Object.assign(stylesObject, selectDefaultStyles(formId))
        break
      case 'select':
        stylesObject = Object.assign(stylesObject, dropdownDefaultStyles(formId))
        break
      case 'currency':
        stylesObject = Object.assign(stylesObject, currencyDefaultStyles(formId))
        break
      case 'country':
        stylesObject = Object.assign(stylesObject, countryDefaultStyles(formId))
        break
      case 'phone-number':
        stylesObject = Object.assign(stylesObject, phoneNumberDefaultStyles(formId))
        break
      case 'hidden':
        stylesObject = Object.assign(stylesObject, textDefaultStyles(formId))
        break
      case 'paypal':
        stylesObject = Object.assign(stylesObject, paypalDefaultStyles(formId))
        break
      case 'stripe':
        stylesObject = Object.assign(stylesObject, stripeDefaultStyles(formId))
        break
      case 'razorpay':
        stylesObject = Object.assign(stylesObject, razorpayDefaultStyles(formId))
        break
      case 'section':
        stylesObject = Object.assign(stylesObject, sectionDefaultStyles(formId))
        break
      case 'repeater':
        stylesObject = Object.assign(stylesObject, repeaterDefaultStyles(formId))
        break
      case 'rating':
        stylesObject = Object.assign(stylesObject, ratingDefaultStyles(formId))
        break
      case 'signature':
        stylesObject = Object.assign(stylesObject, signatureDefaultStyles(formId))
        break
      case 'image-select':
        stylesObject = Object.assign(stylesObject, imageSelectDefaultStyles(formId))
        break
      case 'html':
        stylesObject = Object.assign(stylesObject, htmlDefaultStyles(formId))
        break
      default:
        break
    }
  })
  return stylesObject
}
