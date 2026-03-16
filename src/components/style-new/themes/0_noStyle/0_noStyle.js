/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */

import { getAtom } from '../../../../GlobalStates/BitStore'
import { $allLayouts } from '../../../../GlobalStates/GlobalStates'
import { msgDefaultConfig } from '../../../../Utils/StaticData/form-templates/defaultConfirmation'
import { cleanObj, mergeNestedObj } from '../../../../Utils/globalHelpers'
import confirmMsgCssStyles from '../../../ConfirmMessage/confirmMsgCssStyles'
import { defaultLgLightThemeVars } from '../1_bitformDefault/1_bitformDefault'
import advancedDatetimeStyle_0_noStyle from './advancedDatetimeStyle_0_noStyle'
import advancedFileUp_0_noStyle from './advancedFileUp_0_noStyle'
import buttonStyle_0_noStyle from './buttonStyle_0_noStyle'
import checkboxNradioStyle_0_noStyle from './checkboxNradioStyle_0_noStyle'
import countryStyle_0_noStyle from './countryStyle_0_noStyle'
import currencyStyle_0_noStyle from './currencyStyle_0_noStyle'
import decisionBoxStyle_0_noStyle from './decisionBoxStyle_0_noStyle'
import dividerStyle_0_noStyle from './dividerStyle_0_noStyle'
import dropdownStyle_0_noStyle from './dropdownStyle_0_noStyle'
import fileUploadStyle_0_noStyle from './fileUpload_0_noStyle'
import gdprStyle_0_noStyle from './gdprStyle_0_noStyle'
import hcaptchaStyle_0_noStyle from './hcaptchaStyle_0_noStyle'
import hiddenStyle_0_noStyle from './hiddenStyle_0_noStyle'
import htmlStyle_0_noStyle from './htmlStyle_0_noStyle'
import imageSelectStyle_0_noStyle from './imageSelectStyle_0_noStyle'
import imageStyle_0_noStyle from './imageStyle_0_noStyle'
import mollieStyle_0_noStyle from './mollieStyle_0_noStyle'
import multiStepStyle_0_noStyle from './multiStepStyle_0_noStyle'
import paypalStyle_0_noStyle from './paypalStyle_0_noStyle'
import phoneNumberStyle_0_noStyle from './phoneNumberStyle_0_noStyle'
import ratingStyle_0_noStyle from './ratingStyle_0_noStyle'
import razorpayStyle_0_noStyle from './razorpayStyle_0_noStyle'
import recaptchaStyle_0_noStyle from './recaptchaStyle_0_noStyle'
import repeaterStyle_0_noStyle from './repeaterStyle_0_noStyle'
import sectionStyle_0_noStyle from './sectionStyle_0_noStyle'
import selectStyle_0_noStyle from './selectStyle_0_noStyle'
import signature_0_noStyle from './signature_0_noStyle'
import sliderStyle_0_noStyle from './sliderStyle_0_noStyle'
import spacerStyle_0_noStyle from './spacerStyle_0_noStyle'
import stripeStyle_0_noStyle from './stripeStyle_0_noStyle'
import textStyle_0_noStyle from './textStyle_0_noStyle'
import titleStyle_0_noStyle from './titleStyle_0_noStyle'
import turnstileStyle_0_noStyle from './turnstileStyle_0_noStyle'

export default function noStyleTheme({
  type, fieldKey: fk, direction, fieldsArr, breakpoint = 'lg', colorScheme = 'light', formId,
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
      lgLightThemeVars: defaultLgLightThemeVars,
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
    case 'textarea':
      return text({ type, fk, breakpoint, colorScheme })
    case 'range':
      return slider({ type, fk, breakpoint, colorScheme })
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
    case 'button':
      return button({ type, fk, direction, breakpoint, colorScheme })
    case 'advanced-file-up':
      return advancedFileUP({ type, fk, breakpoint, colorScheme })
    case 'advanced-datetime':
      return advancedDatetime({ type, fk, breakpoint, colorScheme })
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
    case 'razorpay':
      return razorpay({ type, fk, breakpoint, colorScheme })
    case 'section':
      return section({ type, fk, breakpoint, colorScheme })
    case 'repeater':
      return repeater({ type, fk, breakpoint, colorScheme })
    case 'stripe':
      return stripe({ type, fk, breakpoint, colorScheme })
    case 'mollie':
      return mollie({ type, fk, breakpoint, colorScheme })
    case 'signature':
      return signature({ type, fk, breakpoint, colorScheme })
    case 'rating':
      return rating({ type, fk, breakpoint, colorScheme })
    case 'image-select':
      return imageSelect({ type, fk, breakpoint, colorScheme })

    default: {
      fieldsArr?.map(([fieldKey, fieldData]) => {
        lgLightFieldStyles[fieldKey] = noStyleTheme({ fieldKey, type: fieldData.typ, breakpoint: 'lg', colorScheme: 'light' })
        lgDarkFieldStyles[fieldKey] = noStyleTheme({ fieldKey, type: fieldData.typ, breakpoint: 'lg', colorScheme: 'dark' })
        mdLightFieldStyles[fieldKey] = noStyleTheme({ fieldKey, type: fieldData.typ, breakpoint: 'md', colorScheme: 'light' })
        mdDarkFieldStyles[fieldKey] = noStyleTheme({ fieldKey, type: fieldData.typ, breakpoint: 'md', colorScheme: 'dark' })
        smLightFieldStyles[fieldKey] = noStyleTheme({ fieldKey, type: fieldData.typ, breakpoint: 'sm', colorScheme: 'light' })
        smDarkFieldStyles[fieldKey] = noStyleTheme({ fieldKey, type: fieldData.typ, breakpoint: 'sm', colorScheme: 'dark' })
      })

      const allLayouts = getAtom($allLayouts)
      const isMultiStep = Array.isArray(allLayouts) && allLayouts.length > 1
      const multiStepStyle = isMultiStep ? multiStepStyle_0_noStyle({ formId, breakpoint, direction, colorScheme }) : {}

      return {
        lgLightStyles: {
          theme: 'noStyle',
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

export const lightThemeColors = {
  '--global-accent-color': 'hsla(217, 100%, 50%, 100%)', // Accent Color
  '--gah': 217, // global primary hue
  '--gas': '100%', // global primary saturation
  '--gal': '50%', // global primary lightness
  '--gaa': '100%', // global primary opacity
  '--global-font-color': 'hsla(0, 0%, 14%, 100%)',
  '--gfh': 0, // global font color hue
  '--gfs': '0%', // global font color saturation
  '--gfl': '14%', // global font color lightness
  '--gfa': '100%', // global font color opacity
  '--global-bg-color': '', // background color
  '--gbg-h': 0, // global background color hue
  '--gbg-s': '0%', // global background color saturation
  '--gbg-l': '100%', // global background color lightness
  '--gbg-a': '100%', // global background color opacity
  '--global-fld-bdr-clr': 'hsla(0, 0%, 67%, 100%)', // field border color
  '--gfbc-h': 0, // global field border color hue
  '--gfbc-s': '0%', // global field border color saturation
  '--gfbc-l': '67%', // global field border color lightness
  '--gfbc-a': '100%', // global field border color opacity
  '--global-fld-bg-color': '', // field background color
  '--gfbg-h': 0, // global field background color hue
  '--gfbg-s': '0%', // global field background color saturation
  '--gfbg-l': '100%', // global field background color lightness
  '--gfbg-a': '100%', // global field background color opacity

  '--fld-focs-i-fltr': 'invert(26%) sepia(41%) saturate(6015%) hue-rotate(211deg) brightness(100%) contrast(108%)',

  '--fld-wrp-bg': '', // field wrapper background
  '--fld-wrp-bdr-clr': '', // field wrapper border color
  '--fld-wrp-sh': '', // field wrapper box shadow

  '--lbl-wrp-bg': '', // label wrapper for background
  '--lbl-wrp-sh': '', // label wrapper box shadow
  '--lbl-wrp-bdr-clr': '', // label wrapper border color

  '--fld-lbl-bg': '', // field label background color
  '--fld-lbl-c': 'var(--global-font-color)', // field babel color
  '--fld-lbl-sh': '', // field label box shadow
  '--fld-lbl-bdr-clr': '', // field label border color

  '--req-smbl-c': 'hsla(0, 100%, 50%, 100%)', // Required Symbol Color

  '--sub-titl-bg': '', // sub title background color
  '--sub-titl-c': 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.7)', // sub title color
  '--sub-titl-sh': '', // subtitle box shadow
  '--sub-titl-bdr-clr': '', // subtitle border color

  '--hlp-txt-bg': '', // helper text background color
  '--hlp-txt-c': 'hsla(var(--gfh), var(--gfs), var(--gfl), 0.7)', // helpertext color
  '--hlp-txt-sh': '', // helper text box shadow
  '--hlp-txt-bdr-clr': '', // helper text border color

  '--pre-i-clr': '', // prefix icon color
  '--pre-i-fltr': '', // prefix icon filter
  '--pre-i-sh': '', // prefix icon shadow
  '--pre-i-bdr-clr': '', // prefix icon border color

  '--suf-i-clr': '', // suffix icon color
  '--suf-i-fltr': '', // suffix icon filter
  '--suf-i-sh': '', // suffix icon shadow
  '--suf-i-bdr-clr': '', // suffix icon border color

  '--lbl-pre-i-clr': '', // label prefix icon color
  '--lbl-pre-i-fltr': '', // label prefix icon filter
  '--lbl-pre-i-sh': '', // label prefix icon shadow
  '--lbl-pre-i-bdr-clr': '', // label prefix icon border color

  '--lbl-suf-i-clr': '', // label suffix icon color
  '--lbl-suf-i-fltr': '', // label suffix icon filter
  '--lbl-suf-i-sh': '', // label suffix icon shadow
  '--lbl-suf-i-bdr-clr': '', // label suffix icon border color

  '--sub-titl-pre-i-clr': '', // sub title prefix icon color
  '--sub-titl-pre-i-fltr': '', // sub title prefix icon filter
  '--sub-titl-pre-i-sh': '', // sub title prefix icon shadow
  '--sub-titl-pre-i-bdr-clr': '', // sub title prefix icon border color

  '--sub-titl-suf-i-clr': '', // sub title suffix icon color
  '--sub-titl-suf-i-fltr': '', // sub title suffix icon filter
  '--sub-titl-suf-i-sh': '', // sub title suffix icon shadow
  '--sub-titl-suf-i-bdr-clr': '', // sub title suffix icon border color

  '--hlp-txt-pre-i-clr': '', // helper txt prefix icon color
  '--hlp-txt-pre-i-fltr': '', // helper txt prefix icon filter
  '--hlp-txt-pre-i-sh': '', // helper txt prefix icon shadow
  '--hlp-txt-pre-i-bdr-clr': '', // helper txt prefix icon border color

  '--hlp-txt-suf-i-clr': '', // helper txt suffix icon color
  '--hlp-txt-suf-i-fltr': '', // helper txt suffix icon filter
  '--hlp-txt-suf-i-sh': '', // helper txt suffix icon shadow
  '--hlp-txt-suf-i-bdr-clr': '', // helper txt suffix icon border color

  '--err-txt-pre-i-clr': '', // helper txt prefix icon color
  '--err-txt-pre-i-fltr': '', // helper txt prefix icon filter
  '--err-txt-pre-i-sh': '', // helper txt prefix icon shadow
  '--err-txt-pre-i-bdr-clr': '', // helper txt prefix icon border color

  '--err-txt-suf-i-clr': '', // helper txt suffix icon color
  '--err-txt-suf-i-fltr': '', // helper txt suffix icon filter
  '--err-txt-suf-i-sh': '', // helper txt suffix icon shadow
  '--err-txt-suf-i-bdr-clr': '', // helper txt suffix icon border color

  '--err-bg': 'hsla(0, 100%, 94%, 100%)', // error messages background color
  '--err-c': 'hsla(0, 100%, 11%, 100%)', // error messages text color
  '--err-sh': '', // error messages box shadow
  '--err-bdr-clr': 'hsla(0, 50%, 90%, 100%)', // error message border color

  '--btn-bg': 'var(--global-accent-color)', // button backgrond
  '--btn-bgc': 'var(--global-accent-color)', // button backgrond color
  '--btn-c': 'hsla(0, 0%, 100%, 100%)', // button font color color
  '--btn-bdr-clr': 'none', // button border color
  '--btn-sh': '0   2px 4px -2px hsla(0, 0%, 0%, 40%)', // button shadow

  '--ck-bdr-c': 'hsla(210, 78%, 96%, 100%)',

  '--g-o-c': 'hsla(217, 100%, 50%, 100%)', // outline color for testing purposes

  '--bg-0': 'hsl(0, 0%, 100%)',
  '--bg-5': 'hsl(0, 0%, 95%)',
  '--bg-10': 'hsl(0, 0%, 90%)',
  '--bg-15': 'hsl(0, 0%, 85%)',
  '--bg-20': 'hsl(0, 0%, 80%)',
  '--bg-25': 'hsl(0, 0%, 75%)',
  '--bg-30': 'hsl(0, 0%, 70%)',
  '--bg-35': 'hsl(0, 0%, 65%)',
  '--bg-40': 'hsl(0, 0%, 60%)',
  '--bg-45': 'hsl(0, 0%, 55%)',
  '--bg-50': 'hsl(0, 0%, 50%)',
  '--bg-55': 'hsl(0, 0%, 45%)',
  '--bg-60': 'hsl(0, 0%, 40%)',
  '--bg-65': 'hsl(0, 0%, 35%)',
  '--bg-70': 'hsl(0, 0%, 30%)',
  '--bg-75': 'hsl(0, 0%, 25%)',
  '--bg-80': 'hsl(0, 0%, 20%)',
  '--bg-85': 'hsl(0, 0%, 15%)',
  '--bg-90': 'hsl(0, 0%, 10%)',
  '--bg-95': 'hsl(0, 0%, 5%)',
  '--bg-100': 'hsl(0, 0%, 0%)',
}

export const darkThemeColors = {
  '--global-accent-color': 'hsla(210, 100%, 50%, 100%)', // Accent Color
  '--gah': 210, // global primary hue
  '--gas': '100%', // global primary saturation
  '--gal': '50%', // global primary lightness
  '--gaa': '100%', // global primary opacity
  '--global-font-color': 'hsla(215, 35%, 91%, 100%)',
  '--gfh': 215, // global font color hue
  '--gfs': '35%', // global font color saturation
  '--gfl': '91%', // global font color lightness
  '--gfa': '100%', // global font color opacity
  '--global-bg-color': 'hsla(213,32%,14%,100%)', // background color
  '--gbg-h': 212, // global background color hue
  '--gbg-s': '46%', // global background color saturation
  '--gbg-l': '15%', // global background color lightness
  '--gbg-a': '100%',
  '--global-fld-bdr-clr': 'hsla(220, 22%, 30%, 100%)', // field border color
  '--gfbc-h': 220, // global field border color hue
  '--gfbc-s': '22%', // global field border color saturation
  '--gfbc-l': '30%', // global field border color lightness
  '--gfbc-a': '100%', // global field border color opacity
  '--global-fld-bg-color': 'hsla(211, 27%, 22%, 100%)', // field background color
  '--gfbg-h': 211, // global field background color hue
  '--gfbg-s': '27%', // global field background color saturation
  '--gfbg-l': '22%', // global field background color lightness
  '--gfbg-a': '100%', // global field background color opacity

  '--bg-0': 'hsl(213, 32%, 14%)',
  '--bg-5': 'hsl(213, 32%, 19%)',
  '--bg-10': 'hsl(213, 32%, 24%)',
  '--bg-15': 'hsl(213, 32%, 29%)',
  '--bg-20': 'hsl(213, 32%, 34%)',
  '--bg-25': 'hsl(213, 32%, 39%)',
  '--bg-30': 'hsl(213, 32%, 44%)',
  '--bg-35': 'hsl(213, 32%, 49%)',
  '--bg-40': 'hsl(213, 32%, 54%)',
  '--bg-45': 'hsl(213, 32%, 59%)',
  '--bg-50': 'hsl(213, 32%, 64%)',
  '--bg-55': 'hsl(213, 32%, 69%)',
  '--bg-60': 'hsl(213, 32%, 74%)',
  '--bg-65': 'hsl(213, 32%, 79%)',
  '--bg-70': 'hsl(213, 32%, 84%)',
  '--bg-75': 'hsl(213, 32%, 89%)',
  '--bg-80': 'hsl(213, 32%, 94%)',
  '--bg-85': 'hsl(213, 32%, 99%)',
  '--bg-90': 'hsl(213, 32%, 100%)',
  '--bg-95': 'hsl(213, 32%, 100%)',
  '--bg-100': 'hsl(213, 32%, 100%)',
}

export const font = {
  fontType: '',
  fontURL: '',
  fontWeightVariants: [],
  fontStyle: [],
}

export const lgLightform = ({ formId }) => ({
  [`._frm-bg-b${formId} *`]: {
    'box-sizing': 'border-box !important',
    'font-family': 'var(--g-font-family)',
  },
  [`._frm-bg-b${formId}`]: {
    background: 'var(--global-bg-color)',
  },
  [`._frm-b${formId}`]: {
    direction: 'var(--dir)',
  },
})

const { msgType, position, animation, styles } = msgDefaultConfig || {}
const TEMP_CONF_ID = '_tmp_0_conf_id'
const lgLightConfMsg = [
  {
    confMsgId: TEMP_CONF_ID,
    style: confirmMsgCssStyles('formId', TEMP_CONF_ID, msgType, position, animation, styles),
  },
]

const text = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: textStyle_0_noStyle({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const hidden = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: hiddenStyle_0_noStyle({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const slider = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: sliderStyle_0_noStyle({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const section = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: sectionStyle_0_noStyle({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const repeater = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: repeaterStyle_0_noStyle({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const decisionBox = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: decisionBoxStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const gdprAgreement = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: gdprStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const checkNradioBox = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: checkboxNradioStyle_0_noStyle({ fk, type, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const title = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: titleStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const image = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: imageStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const divider = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: dividerStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const spacer = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: spacerStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const button = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: buttonStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const signature = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: signature_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const rating = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: ratingStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
}
const imageSelect = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: imageSelectStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
}

const advancedFileUP = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: advancedFileUp_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const advancedDatetime = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: advancedDatetimeStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const html = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: htmlStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const shortcode = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: shortcodeStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
}

const currency = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: currencyStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const country = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: countryStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const recaptcha = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: recaptchaStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const turnstile = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: turnstileStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const hcaptcha = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: hcaptchaStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const fileUp = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: fileUploadStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const htmlSelect = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: selectStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const select = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: dropdownStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const phoneNumber = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: phoneNumberStyle_0_noStyle({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const paypal = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: paypalStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const razorpay = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: razorpayStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const stripe = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: stripeStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const mollie = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'noStyle',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: mollieStyle_0_noStyle({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
