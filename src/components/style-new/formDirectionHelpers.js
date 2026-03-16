import { create } from 'mutative'
import { isObjectEmpty } from '../../Utils/Helpers'

export const changeFormStylesDir = (style, dir) => create(style, drft => {
  const fieldsKeysArr = Object.keys(drft.fields)
  const fieldsKeysArrLen = fieldsKeysArr.length
  for (let i = 0; i < fieldsKeysArrLen; i += 1) {
    const fieldKey = fieldsKeysArr[i]
    if (Object.hasOwnProperty.call(drft.fields, fieldKey)) {
      if (drft.fields[fieldKey].overrideGlobalTheme.length === 0) {
        if (drft.theme === 'bitformDefault') {
          bitformDefaultThemeDirStyle(drft, fieldKey, dir)
        } else if (drft.theme === 'atlassian') {
          atlassianThemeDirStyle(drft, fieldKey, dir)
        }
      }
    }
  }
})

const bitformDefaultThemeDirStyle = (style, fieldKey, dir) => {
  const { classes = {}, fieldType = '' } = style.fields[fieldKey]
  if (isObjectEmpty(classes)) return
  switch (fieldType) {
    case 'check':
    case 'radio':
    case 'gdpr':
    case 'decision-box': {
      const checkBx = classes?.[`.${fieldKey}-bx`]
      if (checkBx) checkBx.margin = switchXSpacing(checkBx.margin)
      const otherInp = classes?.[`.${fieldKey}-other-inp`]
      if (otherInp) otherInp.margin = switchXSpacing(otherInp.margin)
      break
    }
    case 'select':
    case 'country':
    case 'currency':
    case 'phone-number': {
      const countrySelectedCountryImg = classes?.[`.${fieldKey}-selected-country-img`]
      if (countrySelectedCountryImg) countrySelectedCountryImg.margin = switchXSpacing(countrySelectedCountryImg.margin)
      const currencySelectedCurrencyImg = classes?.[`.${fieldKey}-selected-currency-img`]
      if (currencySelectedCurrencyImg) currencySelectedCurrencyImg.margin = switchXSpacing(currencySelectedCurrencyImg.margin)
      const countryOptIcn = classes?.[`.${fieldKey}-option-list .opt-icn`]
      if (countryOptIcn) countryOptIcn.margin = switchXSpacing(countryOptIcn.margin)
      const currencyAmountInput = classes?.[`.${fieldKey}-currency-amount-input`]
      if (currencyAmountInput) currencyAmountInput.padding = switchXSpacing(currencyAmountInput.padding)
      const phoneNumberInput = classes?.[`.${fieldKey}-phone-number-input`]
      if (phoneNumberInput) phoneNumberInput.padding = switchXSpacing(phoneNumberInput.padding)
      const countryOptSearchInput = classes?.[`.${fieldKey}-opt-search-input`]
      if (countryOptSearchInput) countryOptSearchInput.padding = switchXSpacing(countryOptSearchInput.padding)
      const countryOptSearchIcn = classes?.[`.${fieldKey}-opt-search-icn`]
      if (countryOptSearchIcn) switchXProperties(countryOptSearchIcn, dir === 'rtl' ? 'right' : 'left', '13px')
      const countrySearchClearBtn = classes?.[`.${fieldKey}-search-clear-btn`]
      if (countrySearchClearBtn) switchXProperties(countrySearchClearBtn, dir === 'rtl' ? 'left' : 'right', '6px')
      const countryInputClearBtn = classes?.[`.${fieldKey}-input-clear-btn`]
      if (countryInputClearBtn) switchXProperties(countryInputClearBtn, dir === 'rtl' ? 'left' : 'right', '6px')
      break
    }
    case 'button': {
      const btnPrefixIcn = classes?.[`.${fieldKey}-btn-pre-i`]
      if (btnPrefixIcn) btnPrefixIcn.margin = switchXSpacing(btnPrefixIcn.margin)
      const btnSuffixIcn = classes?.[`.${fieldKey}-btn-suf-i`]
      if (btnSuffixIcn) btnSuffixIcn.margin = switchXSpacing(btnSuffixIcn.margin)
      break
    }
    default:
      break
  }
}

const atlassianThemeDirStyle = (style, fieldKey, dir) => {
  const { classes = {}, fieldType = '' } = style.fields[fieldKey]
  if (isObjectEmpty(classes)) return
  switch (fieldType) {
    case 'check':
    case 'radio':
    case 'gdpr':
    case 'decision-box': {
      const checkBx = classes?.[`.${fieldKey}-bx`]
      if (checkBx) checkBx.margin = switchXSpacing(checkBx.margin)
      const otherInp = classes?.[`.${fieldKey}-other-inp`]
      if (otherInp) otherInp.margin = switchXSpacing(otherInp.margin)
      break
    }
    case 'select':
    case 'country':
    case 'currency':
    case 'phone-number': {
      const countrySelectedCountryImg = classes?.[`.${fieldKey}-selected-country-img`]
      if (countrySelectedCountryImg) countrySelectedCountryImg.margin = switchXSpacing(countrySelectedCountryImg.margin)
      const currencySelectedCurrencyImg = classes?.[`.${fieldKey}-selected-currency-img`]
      if (currencySelectedCurrencyImg) currencySelectedCurrencyImg.margin = switchXSpacing(currencySelectedCurrencyImg.margin)
      const countryOptIcn = classes?.[`.${fieldKey}-option-list .opt-icn`]
      if (countryOptIcn) countryOptIcn.margin = switchXSpacing(countryOptIcn.margin)
      const currencyAmountInput = classes?.[`.${fieldKey}-currency-amount-input`]
      if (currencyAmountInput) currencyAmountInput.padding = switchXSpacing(currencyAmountInput.padding)
      const phoneNumberInput = classes?.[`.${fieldKey}-phone-number-input`]
      if (phoneNumberInput) phoneNumberInput.padding = switchXSpacing(phoneNumberInput.padding)
      const countryOptSearchInput = classes?.[`.${fieldKey}-opt-search-input`]
      if (countryOptSearchInput) countryOptSearchInput.padding = switchXSpacing(countryOptSearchInput.padding)
      const countryOptSearchIcn = classes?.[`.${fieldKey}-opt-search-icn`]
      if (countryOptSearchIcn) {
        switchXProperties(countryOptSearchIcn, dir === 'rtl' ? 'left' : 'right', '5px')
        switchXProperties(countryOptSearchIcn, dir === 'rtl' ? 'border-right' : 'border-left', '1px solid var(--bg-20)')
      }
      const countrySearchClearBtn = classes?.[`.${fieldKey}-search-clear-btn`]
      if (countrySearchClearBtn) switchXProperties(countrySearchClearBtn, dir === 'rtl' ? 'left' : 'right', '40px')
      const countryInputClearBtn = classes?.[`.${fieldKey}-input-clear-btn`]
      if (countryInputClearBtn) switchXProperties(countryInputClearBtn, dir === 'rtl' ? 'left' : 'right', '6px')
      break
    }
    case 'button': {
      const btnPrefixIcn = classes?.[`.${fieldKey}-btn-pre-i`]
      if (btnPrefixIcn) btnPrefixIcn.margin = switchXSpacing(btnPrefixIcn.margin)
      const btnSuffixIcn = classes?.[`.${fieldKey}-btn-suf-i`]
      if (btnSuffixIcn) btnSuffixIcn.margin = switchXSpacing(btnSuffixIcn.margin)
      break
    }
    default:
      break
  }
}

const switchXSpacing = spacing => {
  if (!spacing) return spacing
  const newSpacing = spacing.replace(/\s+/g, ' ')
  const extracted = newSpacing.split(' ')
  if (extracted.length < 4) return spacing
  const [spacingTop, spacingRight, spacingBottom, spacingLeft, ...rest] = extracted
  return [spacingTop, spacingLeft, spacingBottom, spacingRight].join(' ') + (rest.length ? ` ${rest.join(' ')}` : '')
}

const switchXPositions = (draft, positionName, defaultStl) => {
  if (positionName === 'left') {
    draft.left = draft.right || defaultStl
    delete draft.right
    return
  }
  draft.right = draft.left || defaultStl
  delete draft.left
}

const switchXProperties = (draft, propName, defaultStl) => {
  const [propName1, propName2] = propName.split('-')
  let oppositeProp = ''
  if (propName2 && propName1 !== 'left' && propName1 !== 'right') {
    oppositeProp = `${propName1}-${propName2 === 'left' ? 'right' : 'left'}`
  } else {
    oppositeProp = propName1 === 'left' ? 'right' : 'left'
  }
  draft[propName] = draft[oppositeProp] || defaultStl
  delete draft[oppositeProp]
}

const switchFlexContent = justifyCont => {
  if (!justifyCont) return justifyCont
  if (justifyCont === 'flex-start') return 'flex-end'
  if (justifyCont === 'flex-end') return 'flex-start'
  if (justifyCont === 'start') return 'end'
  if (justifyCont === 'end') return 'start'
  return justifyCont
}

export const changeFormThemeVarsDir = (themeVars, dir) => create(themeVars, draftThemeVars => {
  draftThemeVars['--dir'] = dir
  if ('--lbl-pre-i-m' in draftThemeVars) draftThemeVars['--lbl-pre-i-m'] = switchXSpacing(draftThemeVars['--lbl-pre-i-m'])
  if ('--lbl-suf-i-m' in draftThemeVars) draftThemeVars['--lbl-suf-i-m'] = switchXSpacing(draftThemeVars['--lbl-suf-i-m'])
  if ('--sub-titl-pre-i-m' in draftThemeVars) draftThemeVars['--sub-titl-pre-i-m'] = switchXSpacing(draftThemeVars['--sub-titl-pre-i-m'])
  if ('--sub-titl-suf-i-m' in draftThemeVars) draftThemeVars['--sub-titl-suf-i-m'] = switchXSpacing(draftThemeVars['--sub-titl-suf-i-m'])
  if ('--hlp-txt-pre-i-m' in draftThemeVars) draftThemeVars['--hlp-txt-pre-i-m'] = switchXSpacing(draftThemeVars['--hlp-txt-pre-i-m'])
  if ('--hlp-txt-suf-i-m' in draftThemeVars) draftThemeVars['--hlp-txt-suf-i-m'] = switchXSpacing(draftThemeVars['--hlp-txt-suf-i-m'])
  if ('--err-txt-pre-i-m' in draftThemeVars) draftThemeVars['--err-txt-pre-i-m'] = switchXSpacing(draftThemeVars['--err-txt-pre-i-m'])
  if ('--err-txt-suf-i-m' in draftThemeVars) draftThemeVars['--err-txt-suf-i-m'] = switchXSpacing(draftThemeVars['--err-txt-suf-i-m'])
})
