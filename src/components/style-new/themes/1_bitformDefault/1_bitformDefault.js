/* eslint-disable camelcase */

import { getAtom } from '../../../../GlobalStates/BitStore'
import { $allLayouts } from '../../../../GlobalStates/GlobalStates'
import { msgDefaultConfig } from '../../../../Utils/StaticData/form-templates/defaultConfirmation'
import { cleanObj, mergeNestedObj } from '../../../../Utils/globalHelpers'
import confirmMsgCssStyles from '../../../ConfirmMessage/confirmMsgCssStyles'
import advancedDateTimeStyle_1_bitformDefault from './advancedDatetimeStyle_1_bitformDefault'
import advancedFileUp_1_bitformDefault from './advancedFileUp_1_bitformDefault'
import buttonStyle_1_bitformDefault from './buttonStyle_1_bitformDefault'
import checkboxNradioStyle_1_bitformDefault from './checkboxNradioStyle_1_bitformDefault'
import countryStyle_1_BitformDefault from './countryStyle_1_bitformDefault'
import currencyStyle_1_BitformDefault from './currencyStyle_1_bitformDefault'
import decisionBoxStyle_1_bitformDefault from './decisionBoxStyle_1_bitformDefault'
import dividerStyle_1_bitformDefault from './dividerStyle_1_bitformDefault'
import dropdownStyle_1_BitformDefault from './dropdownStyle_1_bitformDefault'
import fileUploadStyle_1_BitformDefault from './fileUpload_1_bitformDefault'
import gdprStyle_1_bitformDefault from './gdprStyle_1_bitformDefault '
import hcaptchaStyle_1_bitformDefault from './hcaptchaStyle_1_bitformDefault'
import hiddenStyle_1_bitformDefault from './hiddenStyle_1_bitformDefault'
import htmlStyle_1_bitformDefault from './htmlStyle_1_bitformDefault'
import imageSelectStyle_1_bitformDefault from './imageSelectStyle_1_bitformDefault'
import imageStyle_1_bitformDefault from './imageStyle_1_bitformDefault'
import mollieStyle_1_BitformDefault from './mollieStyle_1_BitformDefault'
import multiStepStyle_1_bitformDefault from './multiStepStyle_1_bitformDefaullt'
import paypalStyle_1_BitformDefault from './paypalStyle_1_BitformDefault'
import phoneNumberStyle_1_bitformDefault from './phoneNumberStyle_1_bitformDefault'
import ratingStyle_1_bitformDefault from './ratingStyle_1_bitformDefault'
import razorpayStyle_1_BitformDefault from './razorpayStyle_1_BitformDefault'
import recaptchaStyle_1_bitformDefault from './recaptchaStyle_1_bitformDefault'
import repeaterStyle_1_bitformDefault from './repeaterStyle_1_bitformDefault'
import sectionStyle_1_bitformDefault from './sectionStyle_1_bitformDefault'
import selectStyle_1_BitformDefault from './selectStyle_1_bitformDefault'
import shortcodeStyle_1_bitformDefault from './shortcodeStyle_1_bitformDefault'
import signatureStyle_1_bitformDefault from './signatureStyle_1_bitformDefault'
import sliderStyle_1_bitformDefault from './sliderStyle_1_bitformDefault'
import spacerStyle_1_bitformDefault from './spacerStyle_1_bitformDefault'
import stripeStyle_1_BitformDefault from './stripeStyle_1_BitformDefault'
import textStyle_1_bitformDefault from './textStyle_1_bitformDefault'
import titleStyle_1_bitformDefault from './titleStyle_1_bitformDefault'
import turnstileStyle_1_bitformDefault from './turnstileStyle_1_bitformDefault'

export default function bitformDefaultTheme({
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
      lightThemeColors: defaultLightThemeColors,
      darkThemeColors: defaultDarkThemeColors,
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
    case 'font': return defaultFont
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
      return slider({
        type, fk, direction, breakpoint, colorScheme, fldPrefix, fldSuffix,
      })
    }
    case 'signature': {
      const { fldPrefix, fldSuffix } = textOptions
      return signature({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix })
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
    case 'rating':
      return rating({ type, fk, breakpoint, colorScheme })
    case 'image-select':
      return imageSelect({ type, fk, direction, breakpoint, colorScheme })
    case 'advanced-datetime':
      return advancedDateTime({ type, fk, direction, breakpoint, colorScheme })
    default: {
      fieldsArr?.map(([fieldKey, fieldData]) => {
        lgLightFieldStyles[fieldKey] = bitformDefaultTheme({ fieldKey, type: fieldData.typ, breakpoint: 'lg', colorScheme: 'light', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        lgDarkFieldStyles[fieldKey] = bitformDefaultTheme({ fieldKey, type: fieldData.typ, breakpoint: 'lg', colorScheme: 'dark', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        mdLightFieldStyles[fieldKey] = bitformDefaultTheme({ fieldKey, type: fieldData.typ, breakpoint: 'md', colorScheme: 'light', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        mdDarkFieldStyles[fieldKey] = bitformDefaultTheme({ fieldKey, type: fieldData.typ, breakpoint: 'md', colorScheme: 'dark', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        smLightFieldStyles[fieldKey] = bitformDefaultTheme({ fieldKey, type: fieldData.typ, breakpoint: 'sm', colorScheme: 'light', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
        smDarkFieldStyles[fieldKey] = bitformDefaultTheme({ fieldKey, type: fieldData.typ, breakpoint: 'sm', colorScheme: 'dark', textOptions: { fldPrefix: !!fieldData.prefixIcn, fldSuffix: !!fieldData.suffixIcn }, buttonOptions: { align: fieldData.align, txtAlign: fieldData.txtAlign, btnTyp: fieldData.btnTyp, fulW: fieldData.fulW } })
      })

      const allLayouts = getAtom($allLayouts)
      const isMultiStep = Array.isArray(allLayouts) && allLayouts.length > 1
      const multiStepStyle = isMultiStep ? multiStepStyle_1_bitformDefault({ formId, breakpoint, direction, colorScheme }) : {}

      return {
        lgLightStyles: {
          theme: 'bitformDefault',
          fieldsSize: 'medium',
          font: defaultFont,
          form: mergeNestedObj(defaultLgLightform({ formId }), multiStepStyle),
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

export const defaultLgLightThemeVars = {
  '--global-fld-bdr': 'solid', // field border color
  '--g-bdr-rad': '11px', // border radius
  '--g-bdr-width': '1px', // border width
  '--g-font-family': 'inherit', // default font family inherit from theme
  '--dir': 'ltr', // direaction
  '--inp-wrp-width': '',
  '--lbl-al': '', // label align
  '--fld-p': '10px', // field padding
  '--fld-m': '', // field margin
  '--fld-fs': '14px', // field font size

  '--fld-wrp-dis': 'block', // field wrapper display
  '--fld-wrp-fdir': '', // field wrapper flex direction
  '--fld-wrp-justify': 'center',
  '--fld-wrp-m': '', // field wrapper margin
  '--fld-wrp-p': '7px 10px', // field wrapper paddin
  '--fld-wrp-bdr': '', // field wrapper border
  '--fld-wrp-bdr-width': '', // field wrapper border width
  '--fld-wrp-bdr-rad': '', // field wrapper border radius
  '--fld-wrp-width': '', // field wrapper width

  '--lbl-wrp-sa': '',
  '--lbl-wrp-width': '100%', // label wrapper  width
  '--lbl-wrp-m': '0 0 5px 0', // label wrapper for margin
  '--lbl-wrp-p': '', // label wrapper for padding
  '--lbl-wrp-bdr': '', // label wrapper border
  '--lbl-wrp-bdr-width': '', // label wrapper border width
  '--lbl-wrp-bdr-rad': '', // label wrapper border radius
  '--lbl-font-w': 500, // field font weight
  '--lbl-font-style': '', // field font style

  '--fld-lbl-m': '', // field label margin
  '--fld-lbl-p': '', // field label padding
  '--fld-lbl-fs': '1rem', // field label font size
  '--fld-lbl-bdr': '', // field label border
  '--fld-lbl-bdr-width': '', // field label border width
  '--fld-lbl-bdr-rad': '', // field label border radius
  '--fld-lbl-pn': '', // field label position
  '--fld-f-w': 500, // field font weight
  '--fld-f-style': 'normal', // field font style

  '--req-smbl-m': '', // Required Symbol Margin
  '--req-smbl-p': '', // Required Symbol Padding
  '--req-smbl-fs': '', // Required Symbol Font Size
  '--req-smbl-fw': '', // Required Symbol Font Weight
  '--req-smbl-lh': '', // Required Symbol line height
  '--req-smbl-pn': '', // Required Symbol position
  '--req-smbl-lt': '', // Required Symbol Left Value
  '--req-smbl-rt': '', // Required Symbol Right Value

  '--sub-titl-m': '2px 0px 0px 0px', // subtitle margin
  '--sub-titl-p': '3px 0', // subtitle padding
  '--sub-titl-al': '', // subtitle align
  '--sub-titl-fs': '12px', // subtitle font size
  '--sub-titl-bdr': '', // subtitle border
  '--sub-titl-bdr-width': '', // subtitle border width
  '--sub-titl-bdr-rad': '', // subtitle border radius
  '--sub-titl-font-w': 500, // sub title font weight
  '--sub-titl-font-style': '', // subtitle font style

  '--hlp-txt-m': '2px 0px 0px 0px', // helper text margin
  '--hlp-txt-p': '3px 0', // hepler text padding
  '--hlp-txt-fs': '12px', // hepler text font size
  '--hlp-txt-al': '', // helper text align
  '--hlp-txt-bdr': '', // helper text border
  '--hlp-txt-bdr-width': '', // helper text border width
  '--hlp-txt-bdr-rad': '', // helper text border radius
  '--hlp-txt-font-w': 400, // helper text font weight
  '--hlp-txt-font-style': '', // helper text font style

  '--err-m': '5px 0 0 0', // error messages margin
  '--err-p': '10px', // error messages padding
  '--err-bdr': 'solid', // error message border
  '--err-bdr-width': '1px', // error message border width
  '--err-bdr-rad': '8px', // error message border radius
  '--err-txt-al': '', // error text align
  '--err-txt-fs': '12px', // error text font size
  '--err-txt-font-w': 400, // helper text font weight
  '--err-txt-font-style': '', // helper text font style
  '--err-h': '', // error message height

  '--pre-i-h': '25px', // fld prefix icon height
  '--pre-i-w': '25px', // fld prefix icon width
  '--pre-i-m': '0px 0px 0px 3px', // fld prefix icon margin
  '--pre-i-p': '', // fld prefix icon padding
  '--pre-i-bdr': '', // prefix icon border
  '--pre-i-bdr-width': '', // fld prefix icon border width
  '--pre-i-bdr-rad': '0px', // fld prefix icon message border radius

  '--suf-i-h': '25px', // fld suffix icon height
  '--suf-i-w': '25px', // fld suffix icon width
  '--suf-i-m': '0px 3px 0px 0px', // fld suffix icon margin
  '--suf-i-p': '', // fld suffix icon padding
  '--suf-i-bdr': '', // suffix icon border
  '--suf-i-bdr-width': '', // fld suffix icon border width
  '--suf-i-bdr-rad': '0px', // fld suffix icon border radius

  '--lbl-pre-i-h': '20px', // label prefix icon height
  '--lbl-pre-i-w': '20px', // label prefix icon width
  '--lbl-pre-i-m': '0px 5px 0px 0px', // label prefix icon margin
  '--lbl-pre-i-p': '', // label prefix icon padding
  '--lbl-pre-i-bdr': '', // label prefix icon border
  '--lbl-pre-i-bdr-width': '', // label prefix icon border width
  '--lbl-pre-i-bdr-rad': '0px', // label prefix icon message border radius

  '--lbl-suf-i-h': '20px', // Label suffix icon height
  '--lbl-suf-i-w': '20px', // Label suffix icon width
  '--lbl-suf-i-m': '0px 0px 0px 5px', // Label suffix icon margin
  '--lbl-suf-i-p': '', // Label suffix icon padding
  '--lbl-suf-i-bdr': '', // label suffix icon border
  '--lbl-suf-i-bdr-width': '', // Label suffix icon border width
  '--lbl-suf-i-bdr-rad': '0px', // Label suffix icon border radius

  '--sub-titl-pre-i-h': '15px', // sub title prefix icon height
  '--sub-titl-pre-i-w': '15px', // sub title prefix icon width
  '--sub-titl-pre-i-m': '0px 5px 0px 0px', // sub title prefix icon margin
  '--sub-titl-pre-i-p': '', // sub title prefix icon padding
  '--sub-titl-pre-i-bdr': '', // sub title prefix icon border
  '--sub-titl-pre-i-bdr-width': '', // sub title prefix icon border width
  '--sub-titl-pre-i-bdr-rad': '0px', // sub title prefix icon message border radius

  '--sub-titl-suf-i-h': '15px', // sub title suffix icon height
  '--sub-titl-suf-i-w': '15px', // sub title suffix icon width
  '--sub-titl-suf-i-m': '0px 0px 0px 5px', // sub title suffix icon margin
  '--sub-titl-suf-i-p': '', // sub title suffix icon padding
  '--sub-titl-suf-i-bdr': '', // sub title suffix icon border
  '--sub-titl-suf-i-bdr-width': '', // sub title suffix icon border width
  '--sub-titl-suf-i-bdr-rad': '0px', // sub title suffix icon border radius

  '--hlp-txt-pre-i-h': '15px', // helper txt prefix icon height
  '--hlp-txt-pre-i-w': '15px', // helper txt prefix icon width
  '--hlp-txt-pre-i-m': '0px 5px 0px 0px', // helper txt prefix icon margin
  '--hlp-txt-pre-i-p': '', // helper txt prefix icon padding
  '--hlp-txt-pre-i-bdr': '', // helper txt prefix icon border
  '--hlp-txt-pre-i-bdr-width': '', // helper txt prefix icon border width
  '--hlp-txt-pre-i-bdr-rad': '0px', // helper txt prefix icon message border radius

  '--hlp-txt-suf-i-h': '15px', // helper txt suffix icon height
  '--hlp-txt-suf-i-w': '15px', // helper txt suffix icon width
  '--hlp-txt-suf-i-m': '0px 0px 0px 5px', // helper txt suffix icon margin
  '--hlp-txt-suf-i-p': '', // helper txt suffix icon padding
  '--hlp-txt-suf-i-bdr': '', // helper txt suffix icon border
  '--hlp-txt-suf-i-bdr-width': '', // helper txt suffix icon border width
  '--hlp-txt-suf-i-bdr-rad': '0px', // helper txt suffix icon border radius

  '--err-txt-pre-i-h': '15px', // error txt prefix icon height
  '--err-txt-pre-i-w': '15px', // error txt prefix icon width
  '--err-txt-pre-i-m': '0px 5px 0px 0px', // error txt prefix icon margin
  '--err-txt-pre-i-p': '', // error txt prefix icon padding
  '--err-txt-pre-i-bdr': '', // helper txt prefix icon border
  '--err-txt-pre-i-bdr-width': '', // error txt prefix icon border width
  '--err-txt-pre-i-bdr-rad': '0px', // error txt prefix icon message border radius

  '--err-txt-suf-i-h': '15px', // error txt suffix icon height
  '--err-txt-suf-i-w': '15px', // error txt suffix icon width
  '--err-txt-suf-i-m': '0px 0px 0px 5px', // error txt suffix icon margin
  '--err-txt-suf-i-p': '', // error txt suffix icon padding
  '--err-txt-suf-i-bdr': '', // helper txt suffix icon border
  '--err-txt-suf-i-bdr-width': '', // error txt suffix icon border width
  '--err-txt-suf-i-bdr-rad': '0px', // error txt suffix icon border radius

  '--btn-fs': 'var(--fld-fs)', // button txt font size
  '--btn-p': '13px 20px', // button padding
  '--btn-m': '0px 0px', // button marging
  '--btn-fw': 700, // button font weight
  '--btn-f-style': '', // button font style (italic, bold, etc)
  '--btn-bdr': 'none', // button border
  '--btn-bdr-rad': 'var(--g-bdr-rad)', // button border radius
  '--btn-bdr-width': '0', // button border width

  // outline style properties assign for testing purpose
  '--global-outline': '1px solid var(--global-accent-color)', // outline
  '--global-outline-offset': '1px', // outline offset
  '--g-o-offset': '1px', // outline offset
  '--g-o-w': '1px', // outline width
  '--g-o-s': 'solid', // outline style

}

export const defaultLightThemeColors = {
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

  '--fld-inp-c': 'var(--global-font-color)', // field text color

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

  // slider field variables
  '--bf-lower-track-clr': 'var(--global-accent-color)',
  '--bf-upper-track-clr': '#ffffff',

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

export const defaultDarkThemeColors = {
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

export const defaultFont = {
  fontType: '',
  fontURL: '',
  fontWeightVariants: [],
  fontStyle: [],
}

export const defaultLgLightform = ({ formId }) => ({
  [`._frm-bg-b${formId} *`]: {
    'box-sizing': 'border-box !important',
    'font-family': 'var(--g-font-family)',
  },
  [`._frm-bg-b${formId}`]: {
    background: 'var(--global-bg-color)',
    // 'background-color': 'var(--global-bg-color)', // discuss with rubel vaiya about this
    // outline: 'var(--g-o-w) var(--g-o-s) var(--g-o-c)',
    // outline: '1px solid hsla(217, 100%, 50%, 100)',
    // 'outline-offset': '10px',
  },
  [`._frm-b${formId}`]: {
    direction: 'var(--dir)',
  },
  [`._frm-b${formId} p`]: {
    margin: '0',
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

const text = ({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: textStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }),
    }
  }
  return {}
}

const hidden = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: hiddenStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const signature = ({ type, fk, breakpoint, colorScheme, fldPrefix, fldSuffix }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: signatureStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme, fldPrefix, fldSuffix }),
    }
  }
  return {}
}

const section = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: sectionStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const repeater = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: repeaterStyle_1_bitformDefault({ fk, type, breakpoint, colorScheme }),
    }
  }
  return {}
}

const rating = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: ratingStyle_1_bitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}
const imageSelect = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: imageSelectStyle_1_bitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const decisionBox = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: decisionBoxStyle_1_bitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const gdprAgreement = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: gdprStyle_1_bitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const checkNradioBox = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: checkboxNradioStyle_1_bitformDefault({ fk, type, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const title = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: titleStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const slider = ({
  type, fk, direction, breakpoint, colorScheme, fldPrefix, fldSuffix,
}) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: sliderStyle_1_bitformDefault({
        fk, type, direction, breakpoint, colorScheme, fldPrefix, fldSuffix,
      }),
    }
  }
  return {}
}

const image = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: imageStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const divider = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: dividerStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const spacer = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: spacerStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const button = ({
  type, fk, direction, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
}) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: buttonStyle_1_bitformDefault({
        fk, direction, breakpoint, colorScheme, align, txtAlign, btnTyp, fulW,
      }),
    }
  }
  return {}
}

const advancedFileUP = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: advancedFileUp_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const html = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: htmlStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const shortcode = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: shortcodeStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const currency = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: currencyStyle_1_BitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const country = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: countryStyle_1_BitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const recaptcha = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: recaptchaStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const turnstile = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: turnstileStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const hcaptcha = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: hcaptchaStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const fileUp = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: fileUploadStyle_1_BitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const htmlSelect = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: selectStyle_1_BitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const select = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: dropdownStyle_1_BitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const phoneNumber = ({ type, fk, direction, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: phoneNumberStyle_1_bitformDefault({ fk, direction, breakpoint, colorScheme }),
    }
  }
  return {}
}

const paypal = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: paypalStyle_1_BitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const stripe = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: stripeStyle_1_BitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const mollie = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: mollieStyle_1_BitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}

const razorpay = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: razorpayStyle_1_BitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
const advancedDateTime = ({ type, fk, breakpoint, colorScheme }) => {
  if (breakpoint === 'lg' && colorScheme === 'light') {
    return {
      theme: 'bitformDefault',
      fieldType: type,
      overrideGlobalTheme: [],
      fieldSize: 'medium',
      classes: advancedDateTimeStyle_1_bitformDefault({ fk, breakpoint, colorScheme }),
    }
  }
  return {}
}
