/* eslint-disable react/jsx-props-no-spreading */
import BitCurrencyField from 'bit-currency-field/src/bit-currency-field'
import { observeElm } from 'bit-helpers/src'
import bitVirtualizedList from 'bit-virtualized-list/src/bit-virtualized-list'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { $bits, $fields } from '../../GlobalStates/GlobalStates'
import { getCustomAttributes, getCustomClsName, getDataDevAttrArr, selectInGrid } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

const CurrencyField = ({ fieldKey, formID, attr, onBlurHandler, contentID, styleClasses }) => {
  const currencyWrapElmRef = useRef(null)
  const currencyFieldRef = useRef(null)
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const bits = useAtomValue($bits)
  const {
    selectedFlagImage,
    selectedCurrencyClearable,
    searchClearable,
    optionFlagImage,
    defaultCurrencyKey,
    searchPlaceholder,
    noCurrencyFoundText,
    defaultValue,
  } = fieldData.config

  useEffect(() => {
    const iFrameWindow = document.getElementById('bit-grid-layout').contentWindow
    if (!currencyWrapElmRef?.current) {
      currencyWrapElmRef.current = selectInGrid(`.${fieldKey}-currency-fld-wrp`)
    }
    const fldConstructor = currencyFieldRef.current
    const fldElm = currencyWrapElmRef.current
    if (fldConstructor && fldElm && 'destroy' in fldConstructor) {
      fldConstructor.destroy()
    }

    const { options, inputFormatOptions, valueFormatOptions } = fieldData

    const configOptions = {
      fieldKey,
      inputFormatOptions,
      valueFormatOptions,
      selectedFlagImage,
      selectedCurrencyClearable,
      searchClearable,
      optionFlagImage,
      defaultCurrencyKey,
      defaultValue,
      searchPlaceholder,
      noCurrencyFoundText,
      options,
      assetsURL: `${bits.assetsURL}/../static/currencies/`,
      document: document.getElementById('bit-grid-layout').contentDocument,
      window: iFrameWindow,
      attributes: {
        option: getDataDevAttrArr(fieldKey, 'option'),
        'opt-lbl-wrp': getDataDevAttrArr(fieldKey, 'opt-lbl-wrp'),
        'opt-icn': getDataDevAttrArr(fieldKey, 'opt-icn'),
        'opt-lbl': getDataDevAttrArr(fieldKey, 'opt-lbl'),
        'opt-suffix': getDataDevAttrArr(fieldKey, 'opt-suffix'),
      },
      classNames: {
        option: getCustomClsName(fieldKey, 'option'),
        'opt-lbl-wrp': getCustomClsName(fieldKey, 'opt-lbl-wrp'),
        'opt-icn': getCustomClsName(fieldKey, 'opt-icn'),
        'opt-lbl': getCustomClsName(fieldKey, 'opt-lbl'),
        'opt-suffix': getCustomClsName(fieldKey, 'opt-suffix'),
      },
    }

    // add bit_virtualized_list to global
    if (!iFrameWindow.bit_virtualized_list) {
      iFrameWindow.bit_virtualized_list = bitVirtualizedList // eslint-disable-line camelcase
    }
    if (!iFrameWindow.observeElm) {
      iFrameWindow.observeElm = observeElm
    }
    currencyFieldRef.current = new BitCurrencyField(fldElm, configOptions)
  }, [fieldData])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={attr}
      >
        <div className={`${fieldKey}-currency-fld-container`}>
          <div
            data-dev-currency-fld-wrp={fieldKey}
            className={`${fieldKey}-currency-fld-wrp ${getCustomClsName(fieldKey, 'currency-fld-wrp')} ${fieldData.valid.disabled ? 'disabled' : ''} ${fieldData.valid.readonly ? 'readonly' : ''}`}
            ref={currencyWrapElmRef}
            {...getCustomAttributes(fieldKey, 'currency-fld-wrp')}
          >
            <input
              name={fieldKey}
              type="hidden"
              className={`${fieldKey}-currency-hidden-input`}
              {...'disabled' in fieldData.valid && { disabled: fieldData.valid.disabled }}
              {...'readonly' in fieldData.valid && { readOnly: fieldData.valid.readonly }}
            />
            <div className={`${fieldKey}-currency-inner-wrp`}>
              <div
                data-testid={`${fieldKey}-dpd-wrp`}
                className={`${fieldKey}-dpd-wrp`}
                data-dev-dpd-wrp={fieldKey}
                role="combobox"
                aria-controls="currency-dropdown"
                aria-live="assertive"
                aria-labelledby="currency-label-2"
                aria-expanded="false"
                tabIndex={fieldData.valid.disabled ? '-1' : '0'}
              >
                {selectedFlagImage && (
                  <div className={`${fieldKey}-selected-currency-wrp`}>
                    <img
                      data-dev-selected-currency-img={fieldKey}
                      alt="Selected currency image"
                      aria-hidden="true"
                      className={`${fieldKey}-selected-currency-img ${getCustomClsName(fieldKey, 'selected-currency-img')}`}
                      src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"
                      {...getCustomAttributes(fieldKey, 'selected-currency-img')}
                    />
                  </div>
                )}
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
              </div>
              <input
                data-dev-currency-amount-input={fieldKey}
                data-testid={`${fieldKey}-crncy-amnt-inp`}
                aria-label="Currency Input"
                type="text"
                {...'ph' in attr && { placeholder: attr.ph }}
                className={`${fieldKey}-currency-amount-input`}
                tabIndex={fieldData.valid.disabled ? '-1' : '0'}
              />
              {selectedCurrencyClearable && (
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
            <div className={`${fieldKey}-option-wrp  ${getCustomClsName(fieldKey, 'option-wrp')}`} data-dev-option-wrp={fieldKey} {...getCustomAttributes(fieldKey, 'option-search-wrp')}>
              <div className={`${fieldKey}-option-inner-wrp`}>
                <div
                  data-dev-option-search-wrp={fieldKey}
                  className={`${fieldKey}-option-search-wrp ${getCustomClsName(fieldKey, 'option-search-wrp')}`}
                  {...getCustomAttributes(fieldKey, 'option-search-wrp')}
                >
                  <input
                    data-testid={`${fieldKey}-opt-srch-inp`}
                    data-dev-opt-search-input={fieldKey}
                    type="search"
                    className={`${fieldKey}-opt-search-input ${getCustomClsName(fieldKey, 'opt-search-input')}`}
                    placeholder={fieldData.config.searchPlaceholder}
                    autoComplete="off"
                    tabIndex="-1"
                    {...getCustomAttributes(fieldKey, 'opt-search-input')}
                  />
                  <svg
                    className={`${fieldKey}-opt-search-icn ${getCustomClsName(fieldKey, 'opt-search-icn')}`}
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
                  {searchClearable && (
                    <button
                      data-testid={`${fieldKey}-srch-clr-btn`}
                      data-dev-search-clear-btn={fieldKey}
                      type="button"
                      aria-label="Clear search"
                      className={`${fieldKey}-search-clear-btn ${getCustomClsName(fieldKey, 'search-clear-btn')}`}
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
                  )}

                </div>
                <ul
                  className={`${fieldKey}-option-list ${getCustomClsName(fieldKey, 'option-list')}`}
                  tabIndex="-1"
                  role="listbox"
                  aria-label="currency list"
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
          </div>
        </div>
      </InputWrapper>
    </>
  )
}
export default CurrencyField
