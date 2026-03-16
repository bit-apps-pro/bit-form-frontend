/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { getAtom } from '../../../../GlobalStates/BitStore'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { deepCopy } from '../../../../Utils/Helpers'
import { assignNestedObj } from '../../styleHelpers'

const getPaddingForExistIcn = (fk, size) => {
  const fields = getAtom($fields)
  let value
  if ('prefixIcn' in fields[fk] && 'suffixIcn' in fields[fk]) {
    value = `var(--fld-p) ${size}px var(--fld-p) ${size}px !important`
  } else if ('prefixIcn' in fields[fk]) {
    value = `var(--fld-p) var(--fld-p) var(--fld-p) ${size}px !important`
  } else if ('suffixIcn' in fields[fk]) {
    value = `var(--fld-p) ${size}px var(--fld-p) var(--fld-p) !important`
  }
  return value
}

/**
 * @function commonStyle(fk, type, fieldType)
 * @param {string} fk field key
 * @param {string} type size
 * @param {string} fieldType field type
 * @return style classes
*/
export default function commonStyle({
  fk, type, fieldType, breakpoint, theme, colorScheme, direction = '',
}) {
  let fldPadding = null
  switch (type) {
    case 'small-2':
      // fldPadding = getPaddingForExistIcn(fk, 25) || '6px 4px !important'
      fldPadding = getPaddingForExistIcn(fk, 25) || '4px !important'
      return {
        [`.${fk}-lbl`]: { 'font-size': '12px' },
        [`.${fk}-lbl-pre-i`]: { width: '16px', height: '16px' },
        [`.${fk}-lbl-suf-i`]: { width: '16px', height: '16px' },
        [`.${fk}-sub-titl`]: { 'font-size': '8px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '16px', height: '16px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '16px', height: '16px' },
        [`.${fk}-hlp-txt`]: { 'font-size': '8px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '16px', height: '16px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '16px', height: '16px' },

        ...(['check', 'radio', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-bx`]: { width: '10px', height: '10px' },
          [`.${fk}-ct`]: { 'font-size': '12px' },
          ...(fieldType === 'check' || fieldType === 'radio') && {
            [`.${fk}-other-inp`]: {
              'font-size': '0.625rem',
              padding: '6px 4px !important',
              height: '25px',
              'border-radius': '6px',
            },
          },
        },
        ...(['check', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-ck`]: { 'border-radius': '3px' },
        },

        [`.${fk}-fld`]: {
          'font-size': '0.625rem',
          height: '25px',
          'border-radius': '6px',
          padding: fldPadding,
          ...fieldType === 'html-select' && { padding: '2px 1px' },
          ...fieldType === 'color' && { padding: '2px 1px' },
          ...fieldType === 'textarea' && { height: '40px' },
        },

        ...(fieldType !== 'file-up') && {
          [`.${fk}-pre-i`]: { width: '16px', height: '16px' },
          [`.${fk}-suf-i`]: { width: '16px', height: '16px' },
        },
        ...(fieldType === 'select' || fieldType === 'country') && {
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '6px',
            'font-size': '0.625rem',
          },
        },

        ...fieldType === 'select' && { [`.${fk}-dpd-fld-container`]: { height: '21px' } },
        ...fieldType === 'country' && {
          [`.${fk}-country-fld-container`]: { height: '21px' },
          [`.${fk}-dpd-wrp`]: {
            padding: '6px 4px',
            height: '25px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '25px',
            'font-size': '0.625rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '18px',
            width: '18px',
          },
        },

        ...fieldType === 'phone-number' && {
          [`.${fk}-phone-fld-wrp`]: {
            'border-radius': '6px',
            'font-size': '0.625rem',
          },
          [`.${fk}-phone-amount-input`]: { padding: '6px 4px' },
          [`.${fk}-phone-fld-container`]: { height: '25px' },
          [`.${fk}-selected-country-img`]: { height: '13px', width: '25px', 'border-radius': '3px' },
        },

        ...fieldType === 'currency' && {
          [`.${fk}-currency-fld-wrp`]: {
            'border-radius': '6px',
            'font-size': '0.625rem',
          },
          [`.${fk}-currency-amount-input`]: { padding: '6px 4px' },
          [`.${fk}-currency-fld-container`]: { height: '25px' },
          [`.${fk}-selected-currency-img`]: { height: '13px', width: '25px', 'border-radius': '3px' },
        },
        ...(fieldType === 'select') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '3px 4px',
            'min-height': '30px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '25px',
            'font-size': '0.625rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '18px',
            width: '18px',
          },
          [`.${fk}-selected-opt-lbl .chip-wrp`]: {
            padding: '3px 8px',
          },
        },

        ...(fieldType === 'currency'
          || fieldType === 'phone-number') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '6px 4px',
            height: '24px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '25px',
            'font-size': '0.625rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '18px',
            width: '18px',
          },
        },

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '7px 10px', 'font-size': '0.625rem' },
          [`.${fk}-btn-suf-i`]: { width: '16px', height: '16px' },
          [`.${fk}-btn-pre-i`]: { width: '16px', height: '16px' },
        },

        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '7px 10px', 'font-size': '0.625rem' },
          [`.${fk}-pre-i`]: { width: '15px', height: '15px' },
          [`.${fk}-suf-i`]: { width: '15px', height: '15px' },
          // [`.${fk}-btn-txt`]: { 'font-size': '10px' },
        },

      }
    case 'small-1':
      // fldPadding = getPaddingForExistIcn(fk, 30) || '8px 6px'
      fldPadding = getPaddingForExistIcn(fk, 30) || '6px'
      return {
        [`.${fk}-lbl`]: { 'font-size': '14px' },
        [`.${fk}-sub-titl`]: { 'font-size': '10px' },
        [`.${fk}-hlp-txt`]: { 'font-size': '10px' },

        ...(['check', 'radio', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-bx`]: { width: '14px', height: '14px' },
          [`.${fk}-ct`]: { 'font-size': '14px' },
          ...(fieldType === 'radio' || fieldType === 'check') && {
            [`.${fk}-other-inp`]: {
              'font-size': '0.8rem',
              padding: '8px 6px',
              height: '30px',
              'border-radius': '8px',
            },
          },
        },
        ...(['check', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-ck`]: { 'border-radius': '4px' },
        },

        [`.${fk}-fld`]: {
          'font-size': '0.8rem',
          ...(fldPadding !== null) && { padding: fldPadding },
          height: '30px',
          'border-radius': '8px',
          ...fieldType === 'html-select' && { padding: '3px 1px' },
          ...fieldType === 'color' && { padding: '3px 2px' },
          ...fieldType === 'textarea' && { height: '48px' },
        },

        [`.${fk}-lbl-pre-i`]: { width: '18px', height: '18px' },
        [`.${fk}-lbl-suf-i`]: { width: '18px', height: '18px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '18px', height: '18px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '18px', height: '18px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '18px', height: '18px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '18px', height: '18px' },

        ...(fieldType !== 'file-up') && {
          [`.${fk}-pre-i`]: { width: '20px', height: '20px' },
          [`.${fk}-suf-i`]: { width: '20px', height: '20px' },
        },

        ...fieldType === 'select' && {
          [`.${fk}-dpd-fld-container`]: { height: '30px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '8px',
            'font-size': '0.8rem',
          },
        },

        ...fieldType === 'country' && {
          [`.${fk}-country-fld-container`]: { height: '30px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '8px',
            'font-size': '0.8rem',
          },
        },

        ...fieldType === 'phone-number' && {
          [`.${fk}-phone-fld-wrp`]: {
            'border-radius': '8px',
            'font-size': '0.8rem',
          },
          [`.${fk}-phone-amount-input`]: { padding: '8px 6px' },
          [`.${fk}-phone-fld-container`]: { height: '30px' },
          [`.${fk}-selected-country-img`]: { height: '17px', width: '25px', 'border-radius': '4px' },
        },

        ...fieldType === 'currency' && {
          [`.${fk}-currency-fld-wrp`]: {
            'border-radius': '8px',
            'font-size': '0.8rem',
          },
          [`.${fk}-currency-amount-input`]: { padding: '8px 6px' },
          [`.${fk}-currency-fld-container`]: { height: '30px' },
          [`.${fk}-selected-currency-img`]: { height: '17px', width: '25px', 'border-radius': '4px' },
        },
        ...(fieldType === 'country') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '8px 6px',
            height: '30px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '30px',
            'font-size': '0.8rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '20px',
            width: '20px',
          },
        },

        ...(fieldType === 'select'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '8px 6px',
            height: '24px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '30px',
            'font-size': '0.8rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '20px',
            width: '20px',
          },
        },

        ...(fieldType === 'select') && {
          [`.${fk}-selected-opt-lbl .chip-wrp`]: {
            padding: '4px 8px',
          },
        },

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '9px 15px', 'font-size': '0.875rem' },
          [`.${fk}-btn-suf-i`]: { width: '18px', height: '18px' },
          [`.${fk}-btn-pre-i`]: { width: '18px', height: '18px' },
        },

        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '9px 11px', 'font-size': '0.875rem' },
          [`.${fk}-pre-i`]: { width: '18px', height: '18px' },
          [`.${fk}-suf-i`]: { width: '18px', height: '18px' },
          // [`.${fk}-btn-txt`]: { 'font-size': '12px' },
        },
      }
    // case 'small':
    //   return {
    //     [`.${fk}-lbl`]: { 'font-size': '14px' },
    //     [`.${fk}-sub-titl`]: { 'font-size': '12px' },
    //     [`.${fk}-hlp-txt`]: { 'font-size': '12px' },
    //     [`.${fk}-fld`]: { 'font-size': '14px', padding: '7px 4px' },
    //   }
    case 'medium':
      // fldPadding = getPaddingForExistIcn(fk, 35) || '10px 8px'
      fldPadding = getPaddingForExistIcn(fk, 35) || '8px'
      return {
        [`.${fk}-lbl`]: { 'font-size': '1rem' },
        [`.${fk}-sub-titl`]: { 'font-size': '12px' },
        [`.${fk}-hlp-txt`]: { 'font-size': '12px' },

        ...(['check', 'radio', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-bx`]: { width: '18px', height: '18px' },
          [`.${fk}-ct`]: { 'font-size': '14px' },
          ...(fieldType === 'radio' || fieldType === 'check') && {
            [`.${fk}-other-inp`]: {
              'font-size': '14px',
              padding: '10px 8px !important',
              height: '40px',
            },
          },
        },
        // ...(fieldType === 'check' || fieldType === 'decision-box') && {
        //   [`.${fk}-ck`]: { 'border-radius': '5px' },
        // },

        [`.${fk}-fld`]: {
          'font-size': '14px',
          padding: fldPadding,
          height: '40px',
          'border-radius': '11px',
          ...fieldType === 'html-select' && { padding: '6px!important' },
          ...fieldType === 'color' && { padding: '10px' },
          // ...fieldType === 'textarea' && { height: '58px' },
        },

        [`.${fk}-lbl-pre-i`]: { width: '20px', height: '20px' },
        [`.${fk}-lbl-suf-i`]: { width: '20px', height: '20px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '15px', height: '15px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '15px', height: '15px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '15px', height: '15px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '15px', height: '15px' },

        ...(fieldType !== 'file-up') && {
          [`.${fk}-pre-i`]: { width: '15px', height: '15px' },
          [`.${fk}-suf-i`]: { width: '15px', height: '15px' },
        },

        ...fieldType === 'select' && {
          [`.${fk}-dpd-fld-container`]: { height: '40px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '14px',
          },
        },

        ...fieldType === 'country' && {
          [`.${fk}-country-fld-container`]: { height: '40px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '14px',
          },
        },

        ...fieldType === 'phone-number' && {
          [`.${fk}-phone-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '14px',
          },
          // [`.${fk}-phone-amount-input`]: { padding: '10px 8px' }, // discuss with @rubel vaiya
          [`.${fk}-phone-fld-container`]: { height: '40px' },
          [`.${fk}-selected-country-img`]: {
            height: '17px !important',
            width: '25px',
            'border-radius': '3px !important',
          },
        },

        ...fieldType === 'currency' && {
          [`.${fk}-currency-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '14px',
          },
          [`.${fk}-currency-amount-input`]: {
            ...direction !== 'rtl' && { padding: '8px 26px 8px 8px !important' },
            ...direction === 'rtl' && { padding: '8px 8px 8px 26px !important' },
          },
          [`.${fk}-currency-fld-container`]: { height: '40px' },
          [`.${fk}-selected-currency-img`]: {
            height: '17px !important',
            width: '25px',
            'border-radius': '3px !important',
          },
        },
        ...(fieldType === 'select') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '4px 10px',
            'min-height': '38px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '35px',
            'font-size': '14px',
          },

          [`.${fk}-selected-opt-lbl .chip-wrp`]: {
            padding: '5px 8px',
          },
        },

        ...(fieldType === 'country'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '10px',
            height: fieldType === 'country' ? '38px' : '32px',
          },

          [`.${fk}-opt-search-input`]: {
            height: '35px',
            'font-size': '1rem',
          },
        },

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '11px 20px', 'font-size': '14px' },
          [`.${fk}-btn-suf-i`]: { width: '20px', height: '20px' },
          [`.${fk}-btn-pre-i`]: { width: '20px', height: '20px' },
        },

        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '11px 20px', 'font-size': '14px' },
          [`.${fk}-pre-i`]: { width: '15px', height: '15px' },
          [`.${fk}-suf-i`]: { width: '15px', height: '15px' },
        },
      }
    // case 'large':
    //   return {
    //     [`.${fk}-lbl`]: { 'font-size': '18px' },
    //     [`.${fk}-sub-titl`]: { 'font-size': '12px' },
    //     [`.${fk}-hlp-txt`]: { 'font-size': '12px' },
    //     [`.${fk}-fld`]: { 'font-size': '18px', padding: '9px 6px' },
    //   }
    case 'large-1':
      // fldPadding = getPaddingForExistIcn(fk, 40) || '11px 9px'
      fldPadding = getPaddingForExistIcn(fk, 40) || '9px'
      return {
        [`.${fk}-lbl`]: { 'font-size': '18px' },
        [`.${fk}-sub-titl`]: { 'font-size': '14px' },
        [`.${fk}-hlp-txt`]: { 'font-size': '14px' },

        ...(['check', 'radio', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-bx`]: { width: '22px', height: '22px' },
          [`.${fk}-ct`]: { 'font-size': '18px' },
          ...(fieldType === 'radio' || fieldType === 'check') && {
            [`.${fk}-other-inp`]: {
              'font-size': '1.2rem',
              padding: '11px 9px',
              height: '44px',
              'border-radius': '12px',
            },
          },
        },

        ...(['check', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-ck`]: { 'border-radius': '6px' },
        },

        [`.${fk}-fld`]: {
          'font-size': '1.2rem',
          padding: fldPadding,
          'border-radius': '12px',
          ...fieldType === 'html-select' && { padding: '5px 3px' },
          ...fieldType === 'color' && { padding: '5px 3px' },
          ...fieldType !== 'textarea' && { height: '45px' },
        },

        [`.${fk}-lbl-pre-i`]: { width: '24px', height: '24px' },
        [`.${fk}-lbl-suf-i`]: { width: '24px', height: '24px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '24px', height: '24px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '24px', height: '24px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '24px', height: '24px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '24px', height: '24px' },

        ...(fieldType !== 'file-up') && {
          [`.${fk}-pre-i`]: { width: '30px', height: '30px' },
          [`.${fk}-suf-i`]: { width: '30px', height: '30px' },
        },

        ...fieldType === 'select' && {
          [`.${fk}-dpd-fld-container`]: { height: '44px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '12px',
            'font-size': '1.2rem',
          },
        },
        ...fieldType === 'country' && {
          [`.${fk}-country-fld-container`]: { height: '45px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '12px',
            'font-size': '1.2rem',
          },
          [`.${fk}-dpd-wrp`]: {
            padding: '11px 9px',
            height: '45px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '40px',
            'font-size': '1.2rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '24px',
            width: '24px',
          },
        },

        ...(fieldType === 'phone-number') && {
          [`.${fk}-phone-fld-wrp`]: {
            'border-radius': '12px',
            'font-size': '1.2rem',
          },
          [`.${fk}-phone-amount-input`]: { padding: '11px 9px' },
          [`.${fk}-phone-fld-container`]: { height: '44px' },
          [`.${fk}-selected-country-img`]: { height: '25px', width: '33px', 'border-radius': '6px' },
        },

        ...(fieldType === 'currency') && {
          [`.${fk}-currency-fld-wrp`]: {
            'border-radius': '12px',
            'font-size': '1.2rem',
          },
          [`.${fk}-currency-amount-input`]: { padding: '11px 9px' },
          [`.${fk}-currency-fld-container`]: { height: '44px' },
          [`.${fk}-selected-currency-img`]: { height: '25px', width: '33px', 'border-radius': '6px' },
        },

        ...(fieldType === 'select'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '11px 9px',
            height: '40px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '40px',
            'font-size': '1.2rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '24px',
            width: '24px',
          },
        },

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '12px 22px', 'font-size': '1.125rem' },
          [`.${fk}-btn-suf-i`]: { width: '24px', height: '24px' },
          [`.${fk}-btn-pre-i`]: { width: '24px', height: '24px' },
        },

        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '12px 18px', 'font-size': '1.125rem' },
          [`.${fk}-pre-i`]: { width: '24px', height: '24px' },
          [`.${fk}-suf-i`]: { width: '24px', height: '24px' },
          // [`.${fk}-btn-txt`]: { 'font-size': '1.125rem' },
        },
      }
    case 'large-2':
      // fldPadding = getPaddingForExistIcn(fk, 45) || '12px 10px'
      fldPadding = getPaddingForExistIcn(fk, 45) || '10px'
      return {
        [`.${fk}-lbl`]: { 'font-size': '20px' },
        [`.${fk}-sub-titl`]: { 'font-size': '16px' },
        [`.${fk}-hlp-txt`]: { 'font-size': '16px' },

        ...(['check', 'radio', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-bx`]: { width: '26px', height: '26px' },
          [`.${fk}-ct`]: { 'font-size': '20px' },
          ...(fieldType === 'radio' || fieldType === 'check') && {
            [`.${fk}-other-inp`]: {
              'font-size': '1.4rem',
              padding: '12px 10px',
              height: '48px',
              'border-radius': '13px',
            },
          },
        },
        ...(['check', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-ck`]: { 'border-radius': '7px' },
        },

        [`.${fk}-fld`]: {
          'font-size': '1.4rem',
          padding: fldPadding,
          'border-radius': '13px',
          ...fieldType === 'html-select' && { padding: '6px 4px' },
          ...fieldType === 'color' && { padding: '6px 4px' },
          ...fieldType !== 'textarea' && { height: '54px' },
        },

        [`.${fk}-lbl-pre-i`]: { width: '28px', height: '28px' },
        [`.${fk}-lbl-suf-i`]: { width: '28px', height: '28px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '28px', height: '28px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '28px', height: '28px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '28px', height: '28px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '28px', height: '28px' },

        ...(fieldType !== 'file-up') && {
          [`.${fk}-pre-i`]: { width: '35px', height: '35px' },
          [`.${fk}-suf-i`]: { width: '35px', height: '35px' },
        },

        ...fieldType === 'select' && {
          [`.${fk}-dpd-fld-container`]: { height: '48px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '13px',
            'font-size': '1.4rem',
          },
        },

        ...fieldType === 'country' && {
          [`.${fk}-country-fld-container`]: { height: '48px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '13px',
            'font-size': '1.4rem',
          },
        },

        ...(fieldType === 'phone-number') && {
          [`.${fk}-phone-fld-wrp`]: {
            'border-radius': '13px',
            'font-size': '1.4rem',
          },
          [`.${fk}-phone-amount-input`]: { padding: '12px 10px' },
          [`.${fk}-phone-fld-container`]: { height: '48px' },
          [`.${fk}-selected-country-img`]: { height: '26px', width: '35px', 'border-radius': '7px' },
        },

        ...(fieldType === 'currency') && {
          [`.${fk}-currency-fld-wrp`]: {
            'border-radius': '13px',
            'font-size': '1.4rem',
          },
          [`.${fk}-currency-amount-input`]: { padding: '12px 10px' },
          [`.${fk}-currency-fld-container`]: { height: '48px' },
          [`.${fk}-selected-currency-img`]: { height: '26px', width: '35px', 'border-radius': '7px' },
        },

        ...(fieldType === 'select'
          || fieldType === 'country'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '12px 10px',
            height: '48px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '45px',
            'font-size': '1.4rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '26px',
            width: '26px',
          },
        },

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '13px 20px', 'font-size': '1.313rem' },
          [`.${fk}-btn-suf-i`]: { width: '28px', height: '28px' },
          [`.${fk}-btn-pre-i`]: { width: '28px', height: '28px' },
        },
        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '13px 20px', 'font-size': '1.313rem' },
          [`.${fk}-pre-i`]: { width: '28px', height: '28px' },
          [`.${fk}-suf-i`]: { width: '28px', height: '28px' },
          // [`.${fk}-btn-txt`]: { 'font-size': '1.313rem' },
        },
      }
    default:
      return 'default......'
  }
}

export const updateFieldStyleByFieldSizing = (fieldPrvStyle, fldKey, fldType, theme, fldSize, tempThemeVars) => {
  const props = {
    fk: fldKey,
    type: fldSize,
    fieldType: fldType,
    theme,
    direction: '',
  }
  const commonStyles = commonStyle(props)
  const commonStylClasses = Object.keys(commonStyles)
  const copyFieldPrvStyle = deepCopy(fieldPrvStyle)
  const fldClassesObj = copyFieldPrvStyle.classes
  assignNestedObj(copyFieldPrvStyle, 'fieldSize', fldSize)

  const commonStylClassesLen = commonStylClasses.length
  for (let indx = 0; indx < commonStylClassesLen; indx += 1) {
    const comnStylClass = commonStylClasses[indx]

    if (Object.prototype.hasOwnProperty.call(fldClassesObj, comnStylClass)) {
      const mainStlPropertiesObj = fldClassesObj[comnStylClass]
      const comStlPropertiesObj = commonStyles[comnStylClass]
      const comnStlProperties = Object.keys(comStlPropertiesObj)
      const comnStlPropertiesLen = comnStlProperties.length

      for (let popIndx = 0; popIndx < comnStlPropertiesLen; popIndx += 1) {
        const comnStlProperty = comnStlProperties[popIndx]
        if (Object.prototype.hasOwnProperty.call(mainStlPropertiesObj, comnStlProperty)) {
          const mainStlVal = mainStlPropertiesObj[comnStlProperty]
          const comStlVal = comStlPropertiesObj[comnStlProperty]
          if (mainStlVal !== comStlVal) {
            if (mainStlVal?.match(/(var)/gi)?.length === 1 && tempThemeVars) {
              const mainStateVar = mainStlVal.replace(/\(|var|!important|,.*|\)/gi, '')?.trim()
              if (tempThemeVars[mainStateVar] !== comStlVal) {
                tempThemeVars[mainStateVar] = comStlVal
              }
            } else {
              const path = `classes->${comnStylClass}->${comnStlProperty}`
              assignNestedObj(copyFieldPrvStyle, path, comStlVal)
            }
          }
        } else {
          const path = `classes->${comnStylClass}->${comnStlProperty}`
          assignNestedObj(copyFieldPrvStyle, path, comStlPropertiesObj[comnStlProperty])
        }
      }
    }
  }

  return copyFieldPrvStyle
}
