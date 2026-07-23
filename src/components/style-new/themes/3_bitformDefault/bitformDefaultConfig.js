/* eslint-disable camelcase */
import multiStepStyle_3_bitformDefault from './multiStepStyle_3_bitformDefault'
import textStyle_3_bitformDefault from './textStyle_3_bitformDefault'

/**
 * Bit Form Default Theme Configuration
 * Inherits from bitformLegacy with modern styling updates
 */
export default {
  basedOn: 'bitformLegacy',

  themeVars: {
    lgLightThemeVars: {
      '--g-bdr-rad': '4px', // More rounded borders
      // '--fld-wrp-m': '0px 0px 10px', // field wrapper margin
      '--fld-wrp-p': '12px 10px', // field wrapper paddin

      '--btn-p': '11px 18px', // Slightly adjusted button padding

      '--hlp-txt-font-style': 'italic', // helper text font style

      '--err-p': '0px', // error messages padding
      '--err-bdr': 'none', // error message border
      '--err-bdr-width': '0px', // error message border width
      '--err-bdr-rad': '0px', // error message border radius
      '--err-txt-fs': '0.8rem', // error text font size
    },
  },

  themeColors: {
    lightThemeColors: {
      '--global-accent-color': 'hsla(214, 100%, 50%, 100%)', // Accent Color
      '--gah': 214, // global primary hue
      '--gas': '100%', // global primary saturation
      '--gal': '50%', // global primary lightness
      '--gaa': '100%', // global primary opacity

      '--global-font-color': 'hsla(0, 0%, 22%, 100%)',
      '--gfh': 0, // global font color hue
      '--gfs': '0%', // global font color saturation
      '--gfl': '22%', // global font color lightness
      '--gfa': '100%', // global font color opacity

      '--err-bg': '', // error messages background color
      '--err-c': 'hsla(0, 100%, 50%, 100%)', // error messages text color
      '--err-sh': '', // error messages box shadow
      '--err-bdr-clr': '', // error message border color
    },
  },

  // Field overrides: only override specific field types that need customization
  fieldOverrides: {
    text: textStyle_3_bitformDefault,
    number: textStyle_3_bitformDefault,
    password: textStyle_3_bitformDefault,
    name: textStyle_3_bitformDefault,
    username: textStyle_3_bitformDefault,
    email: textStyle_3_bitformDefault,
    url: textStyle_3_bitformDefault,
    date: textStyle_3_bitformDefault,
    'datetime-local': textStyle_3_bitformDefault,
    time: textStyle_3_bitformDefault,
    month: textStyle_3_bitformDefault,
    week: textStyle_3_bitformDefault,
    color: textStyle_3_bitformDefault,
    textarea: textStyle_3_bitformDefault,
  },

  multiStepStyle: (formId, breakpoint, direction, colorScheme) => multiStepStyle_3_bitformDefault({ formId, breakpoint, direction, colorScheme }),
}
