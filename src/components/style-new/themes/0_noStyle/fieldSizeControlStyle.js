/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { deepCopy } from '../../../../Utils/Helpers'
import { assignNestedObj } from '../../styleHelpers'

/**
 * @function commonStyle(fk, type, fieldType)
 * @param {string} fk field key
 * @param {string} type size
 * @param {string} fieldType field type
 * @return style classes
*/
export default function commonStyle(fk, type, fieldType, breakpoint, colorScheme) {
  switch (type) {
    case 'small-2':
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
          padding: '6px 4px !important',
          height: '25px',
          'border-radius': '6px',
          ...fieldType === 'html-select' && { padding: '2px 1px' },
          ...fieldType === 'color' && { padding: '2px 1px' },
          ...fieldType === 'textarea' && { height: '40px' },
        },

        ...!(fieldType === 'file-up') && {
          [`.${fk}-pre-i`]: { width: '30px', height: '30px' },
          [`.${fk}-suf-i`]: { width: '30px', height: '30px' },
        },
        ...(fieldType === 'select' || fieldType === 'country') && {
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '6px',
            'font-size': '0.625rem',
          },
        },

        ...fieldType === 'select' && { [`.${fk}-dpd-fld-container`]: { height: '25px' } },
        ...fieldType === 'country' && { [`.${fk}-country-fld-container`]: { height: '25px' } },

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

        ...(fieldType === 'select'
          || fieldType === 'country'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
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

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '7px 10px', 'font-size': '0.625rem' },
          [`.${fk}-btn-suf-i`]: { width: '16px', height: '16px' },
          [`.${fk}-btn-pre-i`]: { width: '16px', height: '16px' },
        },

        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '7px 10px', 'font-size': '0.625rem', height: '25px' },
          [`.${fk}-pre-i`]: { width: '15px', height: '15px' },
          [`.${fk}-suf-i`]: { width: '15px', height: '15px' },
          [`.${fk}-btn-txt`]: { 'font-size': '10px' },
        },

      }
    case 'small-1':
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
          padding: '8px 6px',
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

        ...!(fieldType === 'file-up') && {
          [`.${fk}-pre-i`]: { width: '34px', height: '34px' },
          [`.${fk}-suf-i`]: { width: '34px', height: '34px' },
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

        ...(fieldType === 'select'
          || fieldType === 'country'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
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

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '9px 15px', 'font-size': '0.875rem' },
          [`.${fk}-btn-suf-i`]: { width: '18px', height: '18px' },
          [`.${fk}-btn-pre-i`]: { width: '18px', height: '18px' },
        },

        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '4px 9px', 'font-size': '0.875rem', height: '30px' },
          [`.${fk}-pre-i`]: { width: '18px', height: '18px' },
          [`.${fk}-suf-i`]: { width: '18px', height: '18px' },
          [`.${fk}-btn-txt`]: { 'font-size': '12px' },
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
      return {
        [`.${fk}-lbl`]: { 'font-size': '16px' },
        [`.${fk}-sub-titl`]: { 'font-size': '12px' },
        [`.${fk}-hlp-txt`]: { 'font-size': '12px' },

        ...(['check', 'radio', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-bx`]: { width: '18px', height: '18px' },
          [`.${fk}-ct`]: { 'font-size': '16px' },
          ...(fieldType === 'radio' || fieldType === 'check') && {
            [`.${fk}-other-inp`]: {
              'font-size': '1rem',
              padding: '10px 8px',
              height: '40px',
            },
          },
        },
        ...(['check', 'decision-box', 'gdpr'].includes(fieldType)) && {
          [`.${fk}-ck`]: { 'border-radius': '5px' },
        },

        [`.${fk}-fld`]: {
          'font-size': '1rem',
          padding: '10px 8px',
          height: '40px',
          'border-radius': '11px',
          ...fieldType === 'html-select' && { padding: '5px 3px' },
          ...fieldType === 'color' && { padding: '5px 3px' },
          ...fieldType === 'textarea' && { height: '58px' },
        },

        [`.${fk}-lbl-pre-i`]: { width: '20px', height: '20px' },
        [`.${fk}-lbl-suf-i`]: { width: '20px', height: '20px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '20px', height: '20px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '20px', height: '20px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '20px', height: '20px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '20px', height: '20px' },

        ...!(fieldType === 'file-up') && {
          [`.${fk}-pre-i`]: { width: '40px', height: '40px' },
          [`.${fk}-suf-i`]: { width: '40px', height: '40px' },
        },

        ...fieldType === 'select' && {
          [`.${fk}-dpd-fld-container`]: { height: '40px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '1rem',
          },
        },

        ...fieldType === 'country' && {
          [`.${fk}-country-fld-container`]: { height: '40px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '1rem',
          },
        },

        ...fieldType === 'phone-number' && {
          [`.${fk}-phone-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '1rem',
          },
          [`.${fk}-phone-amount-input`]: { padding: '10px 8px' },
          [`.${fk}-phone-fld-container`]: { height: '40px' },
          [`.${fk}-selected-country-img`]: { height: '20px', width: '27px', 'border-radius': '4px' },
        },

        ...fieldType === 'currency' && {
          [`.${fk}-currency-fld-wrp`]: {
            'border-radius': '11px',
            'font-size': '1rem',
          },
          [`.${fk}-currency-amount-input`]: { padding: '10px 8px' },
          [`.${fk}-currency-fld-container`]: { height: '40px' },
          [`.${fk}-selected-currency-img`]: { height: '20px', width: '27px', 'border-radius': '4px' },
        },

        ...(fieldType === 'select'
          || fieldType === 'country'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '10px 8px',
            height: '40px',
          },
          [`.${fk}-opt-search-input`]: {
            height: '35px',
            'font-size': '1rem',
          },
          [`.${fk}-opt-search-icn`]: {
            height: '22px',
            width: '22px',
          },
        },

        ...fieldType === 'button' && {
          [`.${fk}-btn`]: { padding: '11px 20px', 'font-size': '1rem' },
          [`.${fk}-btn-suf-i`]: { width: '20px', height: '20px' },
          [`.${fk}-btn-pre-i`]: { width: '20px', height: '20px' },
        },

        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '5px 11px', 'font-size': '1rem', height: '35px' },
          [`.${fk}-pre-i`]: { width: '15px', height: '15px' },
          [`.${fk}-suf-i`]: { width: '15px', height: '15px' },
          [`.${fk}-btn-txt`]: { 'font-size': '16px' },
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
          padding: '11px 9px',
          height: '44px',
          'border-radius': '12px',
          ...fieldType === 'html-select' && { padding: '5px 3px' },
          ...fieldType === 'color' && { padding: '5px 3px' },
          ...fieldType === 'textarea' && { height: '70px' },
        },

        [`.${fk}-lbl-pre-i`]: { width: '24px', height: '24px' },
        [`.${fk}-lbl-suf-i`]: { width: '24px', height: '24px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '24px', height: '24px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '24px', height: '24px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '24px', height: '24px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '24px', height: '24px' },

        ...!(fieldType === 'file-up') && {
          [`.${fk}-pre-i`]: { width: '44px', height: '44px' },
          [`.${fk}-suf-i`]: { width: '44px', height: '44px' },
        },

        ...fieldType === 'select' && {
          [`.${fk}-dpd-fld-container`]: { height: '44px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '12px',
            'font-size': '1.2rem',
          },
        },
        ...fieldType === 'country' && {
          [`.${fk}-country-fld-container`]: { height: '44px' },
          [`.${fk}-dpd-fld-wrp`]: {
            'border-radius': '12px',
            'font-size': '1.2rem',
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
          || fieldType === 'country'
          || fieldType === 'currency'
          || fieldType === 'phone-number') && {
          [`.${fk}-dpd-wrp`]: {
            padding: '11px 9px',
            height: '44px',
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
          [`.${fk}-inp-btn`]: { padding: '12px 18px', 'font-size': '1.125rem', height: '44px' },
          [`.${fk}-pre-i`]: { width: '24px', height: '24px' },
          [`.${fk}-suf-i`]: { width: '24px', height: '24px' },
          [`.${fk}-btn-txt`]: { 'font-size': '1.125rem' },
        },
      }
    case 'large-2':
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
          padding: '12px 10px',
          height: '48px',
          'border-radius': '13px',
          ...fieldType === 'html-select' && { padding: '6px 4px' },
          ...fieldType === 'color' && { padding: '6px 4px' },
          ...fieldType === 'textarea' && { height: '84px' },
        },

        [`.${fk}-lbl-pre-i`]: { width: '28px', height: '28px' },
        [`.${fk}-lbl-suf-i`]: { width: '28px', height: '28px' },
        [`.${fk}-sub-titl-pre-i`]: { width: '28px', height: '28px' },
        [`.${fk}-sub-titl-suf-i`]: { width: '28px', height: '28px' },
        [`.${fk}-hlp-txt-pre-i`]: { width: '28px', height: '28px' },
        [`.${fk}-hlp-txt-suf-i`]: { width: '28px', height: '28px' },

        ...!(fieldType === 'file-up') && {
          [`.${fk}-pre-i`]: { width: '48px', height: '48px' },
          [`.${fk}-suf-i`]: { width: '48px', height: '48px' },
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
          [`.${fk}-btn`]: { padding: '14px 24px', 'font-size': '1.313rem' },
          [`.${fk}-btn-suf-i`]: { width: '28px', height: '28px' },
          [`.${fk}-btn-pre-i`]: { width: '28px', height: '28px' },
        },
        ...fieldType === 'file-up' && {
          [`.${fk}-inp-btn`]: { padding: '14px 22px', 'font-size': '1.313rem', height: '48px' },
          [`.${fk}-pre-i`]: { width: '28px', height: '28px' },
          [`.${fk}-suf-i`]: { width: '28px', height: '28px' },
          [`.${fk}-btn-txt`]: { 'font-size': '1.313rem' },
        },
      }
    default:
      return 'default......'
  }
}

export const updateFieldStyleByFieldSizing = (fieldPrvStyle, fldKey, fldType, fldSize, tempThemeVars) => {
  const commonStyles = commonStyle(fldKey, fldSize, fldType)
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
            if (mainStlVal?.match(/(var)/gi) && tempThemeVars) {
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
