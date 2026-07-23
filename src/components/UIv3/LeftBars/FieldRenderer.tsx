import { memo } from 'react'
import { isLabelOverrideStyles } from '../../style-new/styleHelpers'
import ElementConfiguration from './ElementConfiguration'
import NavBtn from './NavBtn'
import { DROPDOWN_FIELD_CONFIG } from './StyleLayersConfig'

interface FieldRendererProps {
  fldKey: string
  fldData: any
  styles: any
}

const FieldRenderer = ({ fldKey, fldData, styles }: FieldRendererProps) => {
  const offset = '2.5'

  // Helper function to render NavBtn with common props
  const renderNavBtn = (
    route: string,
    label: string,
    styleKey?: string,
    customHighlight?: string
  ) => (
    <NavBtn
      subRoute={fldKey}
      route={route}
      label={label}
      offset={offset}
      highlightSelector={customHighlight || `[data-dev-${route}="${fldKey}"]`}
      styleOverride={styleKey ? isLabelOverrideStyles(styles, fldKey, styleKey) : undefined}
    />
  )

  return (
    <>
      {/* Quick Tweaks */}
      {!fldData.typ.match(/^(title|image|html|divider)$/gi) && renderNavBtn(
        'quick-tweaks',
        'Quick Tweaks',
        undefined,
        `[data-dev-fld-wrp="${fldKey}"]`
      )}

      {/* Field Container */}
      {fldData.typ !== 'paypal' && renderNavBtn('fld-wrp', 'Field Container', 'fld-wrp')}

      {/* Element Configuration */}
      <ElementConfiguration fldKey={fldKey} />

      {/* Check/Radio/Decision-box/GDPR fields */}
      {fldData.typ.match(/^(check|radio|decision-box|gdpr)$/gi) && (
        <>
          {renderNavBtn('cc', 'Check Container', 'cc')}
          {renderNavBtn('ct', 'Option Label', 'ct')}
        </>
      )}

      {/* Check/Radio specific */}
      {fldData.typ.match(/^(check|radio)$/gi) && (
        <>
          {renderNavBtn('cw', 'Check Wrapper', 'cw')}
          {renderNavBtn('cl', 'Option Wrapper', 'cl')}
        </>
      )}

      {/* Checkbox/Radio/Decision-box/GDPR Box */}
      {fldData.typ.match(/(check|decision-box|radio|gdpr)/gi) &&
        renderNavBtn('bx', fldData.typ === 'radio' ? 'Radio Box' : 'Check Box', 'bx')
      }

      {/* Other Option Input */}
      {fldData.typ.match(/(check|radio)/gi) &&
        renderNavBtn('other-inp', 'Other Option Input', 'other-inp')
      }

      {/* Stripe */}
      {fldData.typ === 'stripe' && (
        <>
          {renderNavBtn('stripe-btn', 'Stripe Button', 'stripe-btn')}
          {renderNavBtn('stripe-icn', 'Stripe Icon', 'stripe-icn')}
          {renderNavBtn('stripe-pay-btn', 'Stripe Pay Button', 'stripe-pay-btn')}
        </>
      )}

      {/* Mollie */}
      {fldData.typ === 'mollie' && (
        <>
          {renderNavBtn('mollie-btn', 'Mollie Button', 'mollie-btn')}
          {renderNavBtn('mollie-icn', 'Mollie Icon', 'mollie-icn')}
        </>
      )}

      {/* Razorpay */}
      {fldData.typ === 'razorpay' && (
        <>
          {renderNavBtn('razorpay-btn', 'Razorpay Button', 'razorpay-btn')}
          {renderNavBtn('razorpay-btn-text', 'Button Wrapper', 'razorpay-btn-text')}
          {renderNavBtn('razorpay-btn-title', 'Button Title', 'razorpay-btn-title')}
          {renderNavBtn('razorpay-btn-sub-title', 'Button Subtitle', 'razorpay-btn-sub-title')}
        </>
      )}

      {/* Dropdown-like fields (Select, Currency, Phone, Country) */}
      {(fldData.typ === 'select' ||
        fldData.typ === 'currency' ||
        fldData.typ === 'phone-number' ||
        fldData.typ === 'country') && (
          <DropdownFieldElements
            fldKey={fldKey}
            fldType={fldData.typ}
            styles={styles}
          />
        )}

      {/* Error Message */}
      {!fldData.typ.match(/^(button|divider|spacer|title|image|html|razorpay|paypal|recaptcha|section|repeater|turnstile|hcaptcha)$/) &&
        renderNavBtn('err-msg', 'Error Message', 'err-msg')
      }
    </>
  )
}

// Separate component for dropdown-like fields to keep main component clean
interface DropdownFieldElementsProps {
  fldKey: string
  fldType: 'select' | 'currency' | 'phone-number' | 'country'
  styles: any
}

const DropdownFieldElements = memo(({ fldKey, fldType, styles }: DropdownFieldElementsProps) => {
  const config = DROPDOWN_FIELD_CONFIG[fldType]
  const offset = '2.5'

  const renderNavBtn = (route: string, label: string, styleKey?: string) => (
    <NavBtn
      subRoute={fldKey}
      route={route}
      label={label}
      offset={offset}
      highlightSelector={`[data-dev-${route}="${fldKey}"]`}
      styleOverride={styleKey ? isLabelOverrideStyles(styles, fldKey, styleKey) : undefined}
    />
  )

  return (
    <>
      {/* Field-specific wrapper */}
      {config.wrapperKey && renderNavBtn(config.wrapperKey, config.wrapperLabel, config.wrapperKey)}

      {/* Dropdown Wrapper */}
      {renderNavBtn('dpd-wrp', 'Dropdown Wrapper', 'dpd-wrp')}

      {/* Selected Image */}
      {config.selectedImageKey && renderNavBtn(
        config.selectedImageKey,
        config.selectedImageLabel,
        config.selectedImageKey
      )}

      {/* Selected Label (for select & country) */}
      {config.selectedLabelKey && renderNavBtn(
        config.selectedLabelKey,
        config.selectedLabelText,
        config.selectedLabelKey
      )}

      {/* Input field (for currency & phone) */}
      {config.inputKey && renderNavBtn(config.inputKey, config.inputLabel, config.inputKey)}

      {/* Clear Button */}
      {(fldType === 'select' || fldType === 'currency' || fldType === 'phone-number') &&
        renderNavBtn(
          fldType === 'select' ? 'selected-opt-clear-btn' : 'input-clear-btn',
          'Input Clear Button',
          fldType === 'select' ? 'selected-opt-clear-btn' :
            fldType === 'phone-number' ? 'phone-input-clear-btn' : 'input-clear-btn'
        )
      }

      {/* Country-specific clear button */}
      {fldType === 'country' && renderNavBtn('inp-clr-btn', 'Input Clear Button', 'inp-clr-btn')}

      {/* Option Elements */}
      {renderNavBtn('option-wrp', 'Option Wrapper', 'option-wrp')}
      {renderNavBtn('option-search-wrp', 'Option Search Wrapper', 'option-search-wrp')}

      {/* Search Icon (all except country which has different order) */}
      {fldType !== 'country' && renderNavBtn('opt-search-icn', 'Option Search Icon', 'opt-search-icn')}

      {/* Search Input */}
      {renderNavBtn('opt-search-input', 'Option Search Input', 'opt-search-input')}

      {/* Search Icon for country */}
      {fldType === 'country' && renderNavBtn('opt-search-icn', 'Option Search Icon', 'opt-search-icn')}

      {/* Search Clear Button */}
      {renderNavBtn(
        'search-clear-btn',
        'Search Clear Button',
        fldType === 'phone-number' ? 'phone-search-clear-btn' : 'search-clear-btn'
      )}

      {/* Option List */}
      {renderNavBtn('option-list', 'Option List', 'option-list')}

      {/* Option */}
      {renderNavBtn('option', config.optionLabel, 'option')}

      {/* Option Label Wrapper */}
      {renderNavBtn('opt-lbl-wrp', 'Option Label Wrapper', 'opt-lbl-wrp')}

      {/* Option Icon */}
      {renderNavBtn('opt-icn', config.optionIconLabel, 'opt-icn')}

      {/* Option Label */}
      {renderNavBtn('opt-lbl', config.optionLabelText, 'opt-lbl')}

      {/* Option Suffix (for currency, phone) */}
      {config.hasSuffix && renderNavBtn(
        'opt-suffix',
        `${fldType === 'currency' ? 'Currency' : 'Phone'} Option Trailing`,
        'opt-suffix'
      )}

      {/* Chips (for select only) */}
      {config.hasChips && (
        <>
          {renderNavBtn('chip-wrp', 'Chip Wrapper', 'chip-wrp')}
          {renderNavBtn('chip-icn', 'Chip Icon', 'chip-icn')}
          {renderNavBtn('chip-lbl', 'Chip Label', 'chip-lbl')}
          {renderNavBtn('chip-clear-btn', 'Chip Clear Button', 'chip-clear-btn')}
        </>
      )}
    </>
  )
})

DropdownFieldElements.displayName = 'DropdownFieldElements'

export { FieldRenderer }
