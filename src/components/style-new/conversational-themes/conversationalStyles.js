import conversationalDefaultStyles from './default/conversationalDefaultStyles'

export default function conversationalStyles(formId, conversationalSettings, fields) {
  if (!conversationalSettings.enable) return {}
  const { themeSettings, stepListObject } = conversationalSettings

  const { themeStyle } = themeSettings
  const { accentColor, inputTextColor } = themeSettings
  const { allSteps } = stepListObject
  // split hsla from accentColor
  const [h, s, l, a] = accentColor.slice(5, -1).split(',')

  const buttonBgColor = allSteps.buttonBgColor?.includes('var') ? accentColor : allSteps.buttonBgColor
  const [btnH, btnS, btnL, btnA] = buttonBgColor.slice(5, -1).split(',')
  const [inpCH, inpCS, inpCL, inpCA] = inputTextColor.slice(5, -1).split(',')
  let stylesObject = {
    ':root': {
      [`--bc${formId}-stp-bg-clr`]: 'transparent',
      [`--bc${formId}-a-clr`]: accentColor,
      [`--bc${formId}-a-h`]: h,
      [`--bc${formId}-a-s`]: s,
      [`--bc${formId}-a-l`]: l,
      [`--bc${formId}-a-a`]: a,
      [`--bc${formId}-inp-clr`]: inputTextColor,
      [`--bc${formId}-fld-bg-clr`]: '#fff',
      [`--bc${formId}-fld-bg-h`]: '0',
      [`--bc${formId}-fld-bg-s`]: '0%',
      [`--bc${formId}-fld-bg-l`]: '100%',
      [`--bc${formId}-fld-bg-a`]: '1',
      [`--bc${formId}-fld-bdr`]: 'solid',
      [`--bc${formId}-fld-bdr-clr`]: accentColor,
      [`--bc${formId}-fld-bdr-wdt`]: '0px 0px 1px 0px',
      [`--bc${formId}-fld-bdr-rds`]: '0px',
      [`--bc${formId}-fld-p`]: '6px',
      [`--bc${formId}-fld-fs`]: '1.5rem',
      [`--bc${formId}-fld-fw`]: '400',
      [`--bc${formId}-fld-clr`]: `var(--bc${formId}-inp-clr)`,
      [`--bc${formId}-fld-c-h`]: inpCH,
      [`--bc${formId}-fld-c-s`]: inpCS,
      [`--bc${formId}-fld-c-l`]: inpCL,
      [`--bc${formId}-fld-c-a`]: inpCA,
      [`--bc${formId}-lbl-clr`]: themeSettings.labelTextColor,
      [`--bc${formId}-lbl-fs`]: '2rem',
      [`--bc${formId}-lbl-fw`]: '400',
      [`--bc${formId}-sub-titl-clr`]: themeSettings.labelTextColor,
      [`--bc${formId}-sub-titl-fs`]: '1rem',
      [`--bc${formId}-sub-titl-fw`]: '400',
      [`--bc${formId}-hlp-txt-clr`]: themeSettings.labelTextColor,
      [`--bc${formId}-hlp-txt-fs`]: '1rem',
      [`--bc${formId}-hlp-txt-fw`]: '400',
      [`--bc${formId}-err-msg-clr`]: 'red',
      [`--bc${formId}-err-msg-fs`]: '1rem',
      [`--bc${formId}-err-msg-fw`]: '400',
      [`--bc${formId}-btn-bg-clr`]: allSteps.buttonBgColor,
      [`--bc${formId}-btn-bg-h`]: btnH,
      [`--bc${formId}-btn-bg-s`]: btnS,
      [`--bc${formId}-btn-bg-l`]: btnL,
      [`--bc${formId}-btn-bg-a`]: btnA,
      [`--bc${formId}-btn-txt-clr`]: allSteps.buttonTextColor,
      [`--bc${formId}-btn-icn-fltr`]: allSteps.buttonIconFilter,
      '--bg-0': 'hsla(0, 0%, 100%, 100%)',
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
    },
  }
  switch (themeStyle) {
    case 'default':
      stylesObject = Object.assign(stylesObject, conversationalDefaultStyles(formId, conversationalSettings, fields))
      break
    default:
      stylesObject = Object.assign(stylesObject, conversationalDefaultStyles(formId, conversationalSettings, fields))
  }
  return stylesObject
}
