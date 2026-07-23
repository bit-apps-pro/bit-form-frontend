/* eslint-disable camelcase */
// Import all field override styles
import advancedDatetimeStyle_2_atlassian from './advancedDatetimeStyle_2_atlassian'
import buttonStyle_2_atlassian from './buttonStyle_2_atlassian'
import checkboxNradioStyle_2_atlassian from './checkboxNradioStyle_2_atlassian'
import countryStyle_2_atlassian from './countryStyle_2_atlassian'
import currencyStyle_2_atlassian from './currencyStyle_2_atlassian'
import decisionBoxStyle_2_atlassian from './decisionBoxStyle_2_atlassian'
import dropdownStyle_2_atlassian from './dropdownStyle_2_atlassian'
import gdprStyle_2_atlassian from './gdprStyle_2_atlassian'
import hiddenStyle_2_atlassian from './hiddenStyle_2_atlassian'
import imageSelectStyle_2_atlassian from './imageSelectStyle_2_atlassian'
import mollieStyle_2_atlassian from './mollieStyle_2_atlassian'
import multiStepeStyle_2_atlassian from './multiStepStyle_2_atlassian'
import phoneNumberStyle_2_atlassian from './phoneNumberStyle_2_atlassian'
import repeaterStyle_2_atlassian from './repeaterStyle_2_atlassian'
import sectionStyle_2_atlassian from './sectionStyle_2_atlassian'
import selectStyle_2_atlassian from './selectStyle_2_atlassian'
import signatureStyle_2_atlassian from './signatureStyle_2_atlassian'
import sliderStyle_2_atlassian from './sliderStyle_2_atlassian'
import stripeStyle_2_atlassian from './stripeStyle_2_atlassian'
import textStyle_2_atlassian from './textStyle_2_atlassian'

/**
 * Atlassian Theme Configuration
 * Inherits from bitformLegacy with Atlassian design language
 */
export default {
  basedOn: 'bitformLegacy',

  themeVars: {
    lgLightThemeVars: {
      '--g-bdr-rad': '3px',
      '--btn-p': '12px 15px',
      '--g-bdr-width': '2px',
      '--fld-lbl-fs': '12px',
      '--lbl-font-w': 600,
      '--lbl-wrp-m': '0 0 4px 0',
      '--fld-fs': '14px',
      '--err-m': '4px 0 0 0',
      '--err-bdr-rad': '2px',
      '--err-bdr-width': '0px 0px 0px 3px',
      '--err-p': '7px',
      '--g-font-family': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
  },

  themeColors: {
    lightThemeColors: {
      '--btn-sh': '',
      '--global-bg-color': 'hsla(0, 0%, 100%, 100%)',
      '--gbg-h': 0,
      '--gbg-s': '0%',
      '--gbg-l': '100%',
      '--gbg-a': '100%',
      '--global-fld-bdr-clr': 'hsla(223, 12%, 89%, 100%)',
      '--gfbc-h': 223,
      '--gfbc-s': '12%',
      '--gfbc-l': '89%',
      '--gfbc-a': '100%',
      '--global-fld-bg-color': 'hsla(210, 25%, 98%, 100%)',
      '--gfbg-h': 210,
      '--gfbg-s': '25%',
      '--gfbg-l': '98%',
      '--gfbg-a': '100%',
      '--global-font-color': 'hsla(218, 76%, 15%, 100%)',
      '--gfh': 218,
      '--gfs': '76%',
      '--gfl': '15%',
      '--gfa': '100%',
      '--err-bg': 'hsla(0, 100%, 97%, 100%)',
      '--err-bdr-clr': 'hsla(0, 55%, 78%, 100%)',
    },
    darkThemeColors: {
      '--global-accent-color': 'hsla(215, 100%, 67%, 100%)',
      '--gah': 215,
      '--gas': '100%',
      '--gal': '67%',
      '--gaa': '100%',
      '--global-bg-color': 'hsla(206, 14%, 10%, 100%)',
      '--gbg-h': 206,
      '--gbg-s': '14%',
      '--gbg-l': '10%',
      '--gbg-a': '100%',
      '--global-fld-bg-color': 'hsla(210, 12%, 13%, 100%)',
      '--gfbg-h': 210,
      '--gfbg-s': '12%',
      '--gfbg-l': '13%',
      '--gfbg-a': '100%',
      '--global-fld-bdr-clr': 'hsla(209, 51%, 77%, 16%)',
      '--gfbc-h': 209,
      '--gfbc-s': '51%',
      '--gfbc-l': '77%',
      '--gfbc-a': '16%',
    },
  },

  // Field overrides: only fields with actual style differences from legacy
  fieldOverrides: {
    // Text-like fields with hover effects
    text: textStyle_2_atlassian,
    number: textStyle_2_atlassian,
    password: textStyle_2_atlassian,
    name: textStyle_2_atlassian,
    username: textStyle_2_atlassian,
    email: textStyle_2_atlassian,
    url: textStyle_2_atlassian,
    date: textStyle_2_atlassian,
    'datetime-local': textStyle_2_atlassian,
    time: textStyle_2_atlassian,
    month: textStyle_2_atlassian,
    week: textStyle_2_atlassian,
    color: textStyle_2_atlassian,
    textarea: textStyle_2_atlassian,

    // Fields with custom styles
    'html-select': selectStyle_2_atlassian,
    'phone-number': phoneNumberStyle_2_atlassian,
    button: buttonStyle_2_atlassian,
    select: dropdownStyle_2_atlassian,
    currency: currencyStyle_2_atlassian,
    country: countryStyle_2_atlassian,
    check: checkboxNradioStyle_2_atlassian,
    radio: checkboxNradioStyle_2_atlassian,
    'image-select': imageSelectStyle_2_atlassian,
    'decision-box': decisionBoxStyle_2_atlassian,
    gdpr: gdprStyle_2_atlassian,
    repeater: repeaterStyle_2_atlassian,
    range: sliderStyle_2_atlassian,
    signature: signatureStyle_2_atlassian,
    'advanced-datetime': advancedDatetimeStyle_2_atlassian,
    hidden: hiddenStyle_2_atlassian,
    mollie: mollieStyle_2_atlassian,
    stripe: stripeStyle_2_atlassian,
    section: sectionStyle_2_atlassian,
  },

  multiStepStyle: (formId, breakpoint, direction, colorScheme) => multiStepeStyle_2_atlassian({ formId, breakpoint, direction, colorScheme }),
}
