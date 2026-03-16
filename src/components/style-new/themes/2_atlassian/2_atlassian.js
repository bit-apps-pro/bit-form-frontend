/* eslint-disable camelcase */

import { getAtom } from '../../../../GlobalStates/BitStore'
import { $allLayouts } from '../../../../GlobalStates/GlobalStates'
import { cleanObj, mergeNestedObj } from '../../../../Utils/globalHelpers'
import { msgDefaultConfig } from '../../../../Utils/StaticData/form-templates/defaultConfirmation'
import confirmMsgCssStyles from '../../../ConfirmMessage/confirmMsgCssStyles'
import { defaultDarkThemeColors, defaultFont, defaultLgLightform, defaultLgLightThemeVars, defaultLightThemeColors } from '../1_bitformDefault/1_bitformDefault'
import advancedDatetimeStyle_2_atlassian from './advancedDatetimeStyle_2_atlassian'
import advancedFileUp_2_atlassian from './advancedFileUp_2_atlassian'
import buttonStyle_2_atlassian from './buttonStyle_2_atlassian'
import checkboxNradioStyle_2_atlassian from './checkboxNradioStyle_2_atlassian'
import countryStyle_2_atlassian from './countryStyle_2_atlassian'
import currencyStyle_2_atlassian from './currencyStyle_2_atlassian'
import decisionBoxStyle_2_atlassian from './decisionBoxStyle_2_atlassian'
import dividerStyle_2_atlassian from './dividerStyle_2_atlassian'
import dropdownStyle_2_atlassian from './dropdownStyle_2_atlassian'
import fileUploadStyle_2_atlassian from './fileUpload_2_atlassian'
import gdprStyle_2_atlassian from './gdprStyle_2_atlassian'
import hcaptchaStyle_2_atlassian from './hcaptchaStyle_2_atlassian'
import hiddenStyle_2_atlassian from './hiddenStyle_2_atlassian'
import htmlStyle_2_atlassian from './htmlStyle_2_atlassian'
import imageSelectStyle_2_atlassian from './imageSelectStyle_2_atlassian'
import imageStyle_2_atlassian from './imageStyle_2_atlassian'
import mollieStyle_2_atlassian from './mollieStyle_2_atlassian'
import multiStepeStyle_2_atlassian from './multiStepStyle_2_atlassian'
import paypalStyle_2_atlassian from './paypalStyle_2_atlassian'
import phoneNumberStyle_2_atlassian from './phoneNumberStyle_2_atlassian'
import ratingStyle_2_atlassian from './ratingStyle_2_atlassian'
import razorpayStyle_2_atlassian from './razorpayStyle_2_atlassian'
import recaptchaStyle_2_atlassian from './recaptchaStyle_2_atlassian'
import repeaterStyle_2_atlassian from './repeaterStyle_2_atlassian'
import sectionStyle_2_atlassian from './sectionStyle_2_atlassian'
import selectStyle_2_atlassian from './selectStyle_2_atlassian'
import signatureStyle_2_atlassian from './signatureStyle_2_atlassian'
import sliderStyle_2_atlassian from './sliderStyle_2_atlassian'
import spacerStyle_2_atlassian from './spacerStyle_2_atlassian'
import stripeStyle_2_atlassian from './stripeStyle_2_atlassian'
import textStyle_2_atlassian from './textStyle_2_atlassian'
import titleStyle_2_atlassian from './titleStyle_2_atlassian'
import turnstileStyle_2_atlassian from './turnstileStyle_2_atlassian'

export default function atlassianTheme({
  type, fieldKey: fk, direction, fieldsArr, breakpoint = 'lg', colorScheme = 'light', formId, textOptions = {}, buttonOptions = {},
}) {
  const lgLightFieldStyles = {}
  const lgDarkFieldStyles = {}
  const mdLightFieldStyles = {}
  const mdDarkFieldStyles = {}
  const smLightFieldStyles = {}
  const smDarkFieldStyles = {}

  switch (type) {
    case 'themeColors': return {
      lightThemeColors,
      darkThemeColors,
    }
    case 'themeVars': return {
      lgLightThemeVars,
      lgDarkThemeVars: {},
      mdLightThemeVars: {},
      mdDarkThemeVars: {},
      smLightThemeVars: {},
      smDarkThemeVars: {},
    }
    // case 'form': return form
    case 'font': return font
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
    case 'textarea': {
      const { fldPrefix, fldSuffix } = textOptions
      return text({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix })
    }
    case 'range': {
      const { fldPrefix, fldSuffix } = textOptions
      return slider({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix })
    }
    case 'decision-box':
      return decisionBox({ type, fk, direction, breakpoint, colorScheme })
    case 'gdpr':
      return gdprAgreement({ type, fk, direction, breakpoint, colorScheme })
    case 'check':
    case 'radio':
      return checkNradioBox({ type, fk, direction, breakpoint, colorScheme })
    case 'title':
      return title({ type, fk, breakpoint, colorScheme })
    case 'image':
      return image({ type, fk, breakpoint, colorScheme })
    case 'divider':
      return divider({ type, fk, breakpoint, colorScheme })
    case 'spacer':
      return spacer({ type, fk, breakpoint, colorScheme })
    case 'button': {
      const { align, txtAlign, btnTyp, fulW } = buttonOptions
      return button({
        type, fk, direction, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
      })
    }
    case 'advanced-file-up':
      return advancedFileUP({ type, fk, breakpoint, colorScheme })
    case 'html':
      return html({ type, fk, breakpoint, colorScheme })
    case 'shortcode':
      return shortcode({ type, fk, breakpoint, colorScheme })
    case 'currency':
      return currency({ type, fk, direction, breakpoint, colorScheme })
    case 'country':
      return country({ type, fk, direction, breakpoint, colorScheme })
    case 'recaptcha':
      return recaptcha({ type, fk, breakpoint, colorScheme })
    case 'turnstile':
      return turnstile({ type, fk, breakpoint, colorScheme })
    case 'hcaptcha':
      return hcaptcha({ type, fk, breakpoint, colorScheme })
    case 'file-up':
      return fileUp({ type, fk, breakpoint, colorScheme })
    case 'html-select':
      return htmlSelect({ type, fk, breakpoint, colorScheme })
    case 'select':
      return select({ type, fk, direction, breakpoint, colorScheme })
    case 'phone-number':
      return phoneNumber({ type, fk, direction, breakpoint, colorScheme })
    case 'hidden':
      return hidden({ type, fk, breakpoint, colorScheme })
    case 'paypal':
      return paypal({ type, fk, breakpoint, colorScheme })
    case 'stripe':
      return stripe({ type, fk, breakpoint, colorScheme })
    case 'mollie':
      return mollie({ type, fk, breakpoint, colorScheme })
    case 'razorpay':
      return razorpay({ type, fk, breakpoint, colorScheme })
    case 'section':
      return section({ type, fk, breakpoint, colorScheme })
    case 'repeater':
      return repeater({ type, fk, breakpoint, colorScheme })
    case 'signature':
      return signature({ type, fk, breakpoint, colorScheme })
    case 'rating':
      return rating({ type, fk, breakpoint, colorScheme })
    case 'image-select':
      return imageSelect({ type, fk, breakpoint, colorScheme })
    case 'advanced-datetime':
      return advancedDateTime({ type, fk, breakpoint, colorScheme })
    default: {
      fieldsArr?.map(([fieldKey, fieldData]) => {
        lgLightFieldStyles[fieldKey] = atlassianTheme({ fieldKey, type: fieldData.typ, breakpoint: 'lg', colorScheme: 'light', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        lgDarkFieldStyles[fieldKey] = atlassianTheme({ fieldKey, type: fieldData.typ, breakpoint: 'lg', colorScheme: 'dark', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        mdLightFieldStyles[fieldKey] = atlassianTheme({ fieldKey, type: fieldData.typ, breakpoint: 'md', colorScheme: 'light', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        mdDarkFieldStyles[fieldKey] = atlassianTheme({ fieldKey, type: fieldData.typ, breakpoint: 'md', colorScheme: 'dark', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        smLightFieldStyles[fieldKey] = atlassianTheme({ fieldKey, type: fieldData.typ, breakpoint: 'sm', colorScheme: 'light', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        smDarkFieldStyles[fieldKey] = atlassianTheme({ fieldKey, type: fieldData.typ, breakpoint: 'sm', colorScheme: 'dark', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
      })

      const allLayouts = getAtom($allLayouts)
      const isMultiStep = Array.isArray(allLayouts) && allLayouts.length > 1
      const multiStepStyle = isMultiStep ? multiStepeStyle_2_atlassian({ formId, breakpoint, direction, colorScheme }) : {}
      return {
        lgLightStyles: {
          theme: 'atlassian',
          fieldsSize: 'medium',
          font,
          form: mergeNestedObj(lgLightform({ formId }), multiStepStyle),
          fields: lgLightFieldStyles,
          confirmations: lgLightConfMsg,
        },
        lgDarkStyles: cleanObj({ form: {}, fields: lgDarkFieldStyles, confirmations: {} }),
        mdLightStyles: cleanObj({ form: {}, fields: mdLightFieldStyles, confirmations: {} }),
        mdDarkStyles: cleanObj({ form: {}, fields: mdDarkFieldStyles, confirmations: {} }),
        smLightStyles: cleanObj({ form: {}, fields: smLightFieldStyles, confirmations: {} }),
        smDarkStyles: cleanObj({ form: {}, fields: smDarkFieldStyles, confirmations: {} }),
      }
    }
  }
}

const lgLightThemeVars = {
  ...defaultLgLightThemeVars,
  '--g-bdr-rad': '3px', // border radius
  '--btn-p': '12px 15px', // button padding
  '--g-bdr-width': '2px', // border width
  '--fld-lbl-fs': '12px', // field label font size
  '--lbl-font-w': 600, // field font weight
  '--lbl-wrp-m': '0 0 4px 0', // label wrapper for margin
  '--fld-fs': '14px', // field font size
  '--err-m': '4px 0 0 0', // error messages margin
  '--err-bdr-rad': '3px', // error message border radius
  '--err-p': '7px', // error messages padding
  '--g-font-family': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif", // default font family inherit from theme

}

const lightThemeColors = {
  ...defaultLightThemeColors,
  '--btn-sh': '',
  '--global-bg-color': 'hsla(0, 0%, 100%, 100%)', // background color
  '--gbg-h': 0, // global background color hue
  '--gbg-s': '0%', // global background color saturation
  '--gbg-l': '100%', // global background color lightness
  '--gbg-a': '100%', // global background color opacity
  '--global-fld-bdr-clr': 'hsla(223, 12%, 89%, 100%)', // field border color
  '--gfbc-h': 223, // global field border color hue
  '--gfbc-s': '12%', // global field border color saturation
  '--gfbc-l': '89%', // global field border color lightness
  '--gfbc-a': '100%', // global field border color opacity
  '--global-fld-bg-color': 'hsla(210, 25%, 98%, 100%)', // field background color
  '--gfbg-h': 210, // global field background color hue
  '--gfbg-s': '25%', // global field background color saturation
  '--gfbg-l': '98%', // global field background color lightness
  '--gfbg-a': '100%', // global field background color opacity
  '--global-font-color': 'hsla(218, 76%, 15%, 100%)',
  '--gfh': 218, // global font color hue
  '--gfs': '76%', // global font color saturation
  '--gfl': '15%', // global font color lightness
  '--gfa': '100%', // global font color opacity
  '--err-bg': 'hsla(0, 100%, 96%, 100%)', // error messages background color
  '--err-bdr-clr': 'hsla(0, 55%, 78%, 100%)', // error message border color
}

const darkThemeColors = {
  ...defaultDarkThemeColors,
  '--global-accent-color': 'hsla(215, 100%, 67%, 100%)', // Accent Color
  '--gah': 215, // global primary hue
  '--gas': '100%', // global primary saturation
  '--gal': '67%', // global primary lightness
  '--gaa': '100%', // global primary opacity
  '--global-bg-color': 'hsla(206, 14%, 10%, 100%)', // background color
  '--gbg-h': 206, // global background color hue
  '--gbg-s': '14%', // global background color saturation
  '--gbg-l': '10%', // global background color lightness
  '--gbg-a': '100%', // global background color opacity
  '--global-fld-bg-color': 'hsla(210, 12%, 13%, 100%)', // field background color
  '--gfbg-h': 210, // global field background color hue
  '--gfbg-s': '12%', // global field background color saturation
  '--gfbg-l': '13%', // global field background color lightness
  '--gfbg-a': '100%', // global field background color opacity
  '--global-fld-bdr-clr': 'hsla(209, 51%, 77%, 16%)', // field border color
  '--gfbc-h': 209, // global field border color hue
  '--gfbc-s': '51%', // global field border color saturation
  '--gfbc-l': '77%', // global field border color lightness
  '--gfbc-a': '16%', // global field border color opacity
}

const font = {
  ...defaultFont,
}

const lgLightform = ({ formId }) => ({
  ...defaultLgLightform({ formId }),
})

const { msgType, position, animation, styles } = msgDefaultConfig || {}
const TEMP_CONF_ID = '_tmp_0_conf_id'
const lgLightConfMsg = [
  {
    confMsgId: TEMP_CONF_ID,
    style: confirmMsgCssStyles('formId', TEMP_CONF_ID, msgType, position, animation, styles),
  },
]

const text = ({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: textStyle_2_atlassian({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }),
    }
  }
  return {}
}

const advancedDateTime = ({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: advancedDatetimeStyle_2_atlassian({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }),
    }
  }
  return {}
}

const hidden = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: hiddenStyle_2_atlassian({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}
const slider = ({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: sliderStyle_2_atlassian({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }),
    }
  }
  return {}
}

const section = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: sectionStyle_2_atlassian({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const repeater = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: repeaterStyle_2_atlassian({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}
const signature = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: signatureStyle_2_atlassian({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const rating = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: ratingStyle_2_atlassian({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const imageSelect = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: imageSelectStyle_2_atlassian({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const decisionBox = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: decisionBoxStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const gdprAgreement = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: gdprStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const checkNradioBox = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: checkboxNradioStyle_2_atlassian({ fk, type, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const title = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: titleStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const image = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: imageStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const divider = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: dividerStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const spacer = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: spacerStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const button = ({
  type, fk, direction, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
}) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: buttonStyle_2_atlassian({
        fk, direction, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
      }),
    }
  }
  return {}
}

const advancedFileUP = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: advancedFileUp_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const html = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: htmlStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const shortcode = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: htmlStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const currency = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: currencyStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const country = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: countryStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const recaptcha = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: recaptchaStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const turnstile = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: turnstileStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const hcaptcha = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: hcaptchaStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const fileUp = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: fileUploadStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const htmlSelect = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: selectStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const select = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: dropdownStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const phoneNumber = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: phoneNumberStyle_2_atlassian({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const paypal = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: paypalStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const stripe = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: stripeStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const mollie = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: mollieStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const razorpay = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'atlassian',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: razorpayStyle_2_atlassian({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
