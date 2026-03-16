/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/role-has-required-aria-props */
import { observeElm } from 'bit-helpers/src'
import BitPhoneNumberField from 'bit-phone-number-field/src/bit-phone-number-field'
import BitVirtualizedList from 'bit-virtualized-list/src/bit-virtualized-list'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { $bits, $fields } from '../../GlobalStates/GlobalStates'
import { getCustomAttributes, getCustomClsName, getDataDevAttrArr, selectInGrid } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

export default function PhoneNumberField({ fieldKey, formID, attr, styleClasses }) {
  const phoneNumberWrapElmRef = useRef(null)
  const phoneNumberFieldRef = useRef(null)
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const bits = useAtomValue($bits)
  const {
    selectedFlagImage,
    hideCountryList,
    selectedCountryClearable,
    searchClearable,
    optionFlagImage,
    detectCountryByIp,
    detectCountryByGeo,
    defaultCountryKey,
    searchPlaceholder,
    noCountryFoundText,
    inputFormat,
    valueFormat,
  } = fieldData.config

  useEffect(() => {
    if (!phoneNumberWrapElmRef?.current) {
      phoneNumberWrapElmRef.current = selectInGrid(`.${fieldKey}-phone-fld-wrp`)
    }
    const fldConstructor = phoneNumberFieldRef.current
    const fldElm = phoneNumberWrapElmRef.current
    if (fldConstructor && fldElm && 'destroy' in fldConstructor) {
      fldConstructor.destroy()
    }
    const iframeWindow = document.getElementById('bit-grid-layout').contentWindow
    // add bit_virtualized_list to global
    if (!iframeWindow.bit_virtualized_list) {
      iframeWindow.bit_virtualized_list = BitVirtualizedList
    }
    if (!iframeWindow.observeElm) {
      iframeWindow.observeElm = observeElm
    }
    const { placeholderImage, options } = fieldData
    const configOptions = {
      fieldKey,
      selectedFlagImage,
      hideCountryList,
      selectedCountryClearable,
      searchClearable,
      optionFlagImage,
      detectCountryByIp,
      detectCountryByGeo,
      defaultCountryKey,
      searchPlaceholder,
      noCountryFoundText,
      placeholderImage,
      options,
      inputFormat,
      valueFormat,
      assetsURL: `${bits.assetsURL}/../static/countries/`,
      document: document.getElementById('bit-grid-layout').contentDocument,
      window: iframeWindow,
      attributes: {
        option: getDataDevAttrArr(fieldKey, 'option'),
        'opt-lbl-wrp': getDataDevAttrArr(fieldKey, 'opt-lbl-wrp'),
        'opt-icn': getDataDevAttrArr(fieldKey, 'opt-icn'),
        'opt-lbl': getDataDevAttrArr(fieldKey, 'opt-lbl'),
        'opt-a': getDataDevAttrArr(fieldKey, 'opt-prefix'),
      },
      classNames: {
        option: getCustomClsName(fieldKey, 'option'),
        'opt-lbl-wrp': getCustomClsName(fieldKey, 'opt-lbl-wrp'),
        'opt-icn': getCustomClsName(fieldKey, 'opt-icn'),
        'opt-lbl': getCustomClsName(fieldKey, 'opt-lbl'),
        'opt-prefix': getCustomClsName(fieldKey, 'opt-prefix'),
      },
    }
    phoneNumberFieldRef.current = new BitPhoneNumberField(fldElm, configOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldData])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={attr}
      >
        <div className={`${fieldKey}-phone-fld-container`}>
          <div
            data-dev-phone-fld-wrp={fieldKey}
            className={`${fieldKey}-phone-fld-wrp ${getCustomClsName(fieldKey, 'phone-fld-wrp')} ${fieldData.valid.disabled ? 'disabled' : ''} ${fieldData.valid.readonly ? 'readonly' : ''}`}
            ref={phoneNumberWrapElmRef}
            {...getCustomAttributes(fieldKey, 'phone-fld-wrp')}
          >
            <input
              name={fieldKey}
              type="hidden"
              className={`${fieldKey}-phone-hidden-input`}
              {...'disabled' in fieldData.valid && { disabled: fieldData.valid.disabled }}
              {...'readonly' in fieldData.valid && { readOnly: fieldData.valid.readonly }}
            />
            <div className={`${fieldKey}-phone-inner-wrp`}>
              {(!hideCountryList || selectedFlagImage) && (
                <div
                  data-testid={`${fieldKey}-dpd-wrp`}
                  className={`${fieldKey}-dpd-wrp`}
                  data-dev-dpd-wrp={fieldKey}
                  role="combobox"
                  aria-live="assertive"
                  aria-labelledby="country-label-2"
                  aria-expanded="false"
                  tabIndex={fieldData.valid.disabled ? '-1' : '0'}
                >
                  {selectedFlagImage && (
                    <div className={`${fieldKey}-selected-country-wrp`}>
                      <img
                        data-dev-selected-phone-img={fieldKey}
                        alt="Selected Country image"
                        aria-hidden="true"
                        className={`${fieldKey}-selected-country-img ${getCustomClsName(fieldKey, 'selected-phone-img')}`}
                        src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"
                        {...getCustomAttributes(fieldKey, 'selected-phone-img')}
                      />
                    </div>
                  )}
                  {!hideCountryList && (
                    <div className={`${fieldKey}-dpd-down-btn`}>
                      <svg
                        width="15"
                        height="15"
                        role="img"
                        title="Downarrow icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
              <input
                data-testid={`${fieldKey}-phone-nmbr-inp`}
                data-dev-phone-number-input={fieldKey}
                aria-label="Phone Number"
                {...'ph' in attr && { placeholder: attr.ph }}
                type="tel"
                className={`${fieldKey}-phone-number-input`}
                autoComplete="tel"
                tabIndex={fieldData.valid.disabled ? '-1' : '0'}
              />
              {selectedCountryClearable && (
                <button
                  data-testid={`${fieldKey}-inp-clr-btn`}
                  data-dev-input-clear-btn={fieldKey}
                  type="button"
                  title="Clear value"
                  className={`${fieldKey}-input-clear-btn ${getCustomClsName(fieldKey, 'input-clear-btn')}`}
                  {...getCustomAttributes(fieldKey, 'input-clear-btn')}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

            </div>
            {!hideCountryList && (
              <div className={`${fieldKey}-option-wrp ${getCustomClsName(fieldKey, 'option-wrp')}`} data-dev-option-wrp={fieldKey} {...getCustomAttributes(fieldKey, 'option-search-wrp')}>
                <div className={`${fieldKey}-option-inner-wrp`}>
                  <div
                    data-dev-option-search-wrp={fieldKey}
                    className={`${fieldKey}-option-search-wrp ${getCustomClsName(fieldKey, 'option-search-wrp')}`}
                    {...getCustomAttributes(fieldKey, 'option-search-wrp')}
                  >
                    <input
                      data-testid={`${fieldKey}-opt-srch-inp`}
                      data-dev-opt-search-input={fieldKey}
                      aria-label="Search for countries"
                      type="search"
                      className={`${fieldKey}-opt-search-input`}
                      placeholder={searchPlaceholder}
                      autoComplete="off"
                      tabIndex="-1"
                    />
                    <svg
                      className={`${fieldKey}-icn ${fieldKey}-opt-search-icn ${getCustomClsName(fieldKey, 'opt-search-icn')}`}
                      data-dev-opt-search-icn={fieldKey}
                      aria-hidden="true"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      {...getCustomAttributes(fieldKey, 'opt-search-icn')}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    {
                      searchClearable && (
                        <button
                          data-testid={`${fieldKey}-srch-clr-btn`}
                          type="button"
                          aria-label="Clear search"
                          className={`${fieldKey}-icn ${fieldKey}-search-clear-btn ${getCustomClsName(fieldKey, 'search-clear-btn')}`}
                          data-dev-search-clear-btn={fieldKey}
                          tabIndex="-1"
                          {...getCustomAttributes(fieldKey, 'search-clear-btn')}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )
                    }
                  </div>
                  <ul
                    className={`${fieldKey}-option-list ${getCustomClsName(fieldKey, 'option-list')}`}
                    tabIndex="-1"
                    role="listbox"
                    aria-label="country list"
                    data-dev-option-list={fieldKey}
                    {...getCustomAttributes(fieldKey, 'option-list')}
                  >
                    <li className="option">
                      <span className="opt-prefix">Prefix</span>
                      <span className="opt-lbl-wrp">
                        <img className="opt-icn" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>" alt="Placeholder" />
                        <span className="opt-lbl">Option</span>
                      </span>
                      <span className="opt-suffix">Suffix</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </InputWrapper>
    </>
  )
}
