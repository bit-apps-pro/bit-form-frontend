import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import { isDev } from '../../Utils/config'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import tippyHelperMsg from '../../Utils/StaticData/tippyHelperMsg'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import SingleToggle from '../Utilities/SingleToggle'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'
import FieldDisabledSettings from './CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldReadOnlySettings from './CompSettingsUtils/FieldReadOnlySettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import OptionsListHeightSettings from './CompSettingsUtils/OptionsListHeightSettings'
import PlaceholderSettings from './CompSettingsUtils/PlaceholderSettings'
import RequiredSettings from './CompSettingsUtils/RequiredSettings'
import SubTitleSettings from './CompSettingsUtils/SubTitleSettings'
import EditOptions from './EditOptions/EditOptions'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

const CurrencyFieldSettings = () => {
  const { fieldKey: fldKey } = useParams()
  if (!fldKey) return <>No field exist with this field key</>
  const { css } = useFela()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const [optionMdl, setOptionMdl] = useState(false)
  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { options } = fieldData
  const globalErrMsg = globalMessages?.err || {}

  const {
    selectedFlagImage,
    selectedCurrencyClearable,
    defaultValue,
    searchClearable,
    optionFlagImage,
    showSearchPh,
    searchPlaceholder,
    noCurrencyFoundText,
    maxHeight,
    minValue,
    maxValue,
  } = fieldData.config

  const {
    showCurrencySymbol,
    roundToClosestInteger: inputRoundToClosestInteger,
    roundToClosestFractionDigits: inputRoundToClosestFractionDigit,
    formatter: inputFormatter,
    numberFormat: inputNumberFormat,
    decimalSeparator: inputDecimalSeparator,
    minimumFractionDigits: inputMinimumFractionDigits,
    maximumFractionDigits: inputMaximumFractionDigits,
  } = fieldData.inputFormatOptions

  const {
    formatter: valueFormatter, numberFormat, decimalSeparator, minimumFractionDigits,
    maximumFractionDigits, symbolPosition, currencyPosition, roundToClosestInteger, roundToClosestFractionDigits,
  } = fieldData.valueFormatOptions

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const hideDefalutValue = (e) => {
    if (e.target.checked) {
      fieldData.config.defaultValue = 'USD 0.0'
      fieldData.defaultValueHide = true
    } else {
      fieldData.defaultValueHide = false
      delete fieldData.config.defaultValue
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default value ${req}: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req.toLowerCase()}_defaultValue`, state: { fields: allFields, fldKey } })
  }

  const setDefaultValue = ({ target: { value } }) => {
    if (value === '') delete fieldData.config.defaultValue
    else fieldData.config.defaultValue = value

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default value updated: ${value || fieldData.lbl || adminLabel || fldKey}`, type: 'change_defaultValue', state: { fields: allFields, fldKey } })
  }
  const handleOptions = newOpts => {
    const checkedOpt = newOpts.find(opt => opt.check)
    const allFields = create(fields, draft => {
      draft[fldKey].options = newOpts
      draft[fldKey].config.defaultCurrencyKey = checkedOpt ? checkedOpt.i : ''
    })
    setFields(allFields)
    addToBuilderHistory({ event: `Modify Options List: ${fieldData.lbl || fldKey}`, type: 'options_modify', state: { fields: allFields, fldKey } })
  }

  const handleConfigChange = (val, name, config) => {
    fieldData[config][name] = val
    if (name === 'minValue') fieldData.err.minValue.dflt = globalErrMsg?.[fieldData.typ]?.minValue || globalErrMsg?.minValue || `Invalid amount. The minimum amount allowed is ${val}.`
    else if (name === 'maxValue') fieldData.err.maxValue.dflt = globalErrMsg?.[fieldData.typ]?.maxValue || globalErrMsg?.maxValue || `Invalid amount. The maximum amount allowed is ${val}.`
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }

  const toggleSearchPlaceholder = (e) => {
    if (e.target.checked) {
      fieldData.config.searchPlaceholder = 'Search Currency Here...'
      fieldData.config.showSearchPh = true
    } else {
      fieldData.config.searchPlaceholder = ''
      fieldData.config.showSearchPh = false
    }
    const req = e.target.checked ? 'Show' : 'Hide'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${req} Search Placeholder: ${fieldData.lbl || adminLabel || fldKey}`, type: 'toggle_search_placeholder', state: { fields: allFields, fldKey } })
  }

  function setSearchPlaceholder(e) {
    fieldData.config.searchPlaceholder = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Search Placeholder updated: ${fieldData.lbl || adminLabel || fldKey}`, type: 'change_placeholder', state: { fields: allFields, fldKey } })
  }

  if (isDev) {
    window.selectedFieldData = fieldData
  }

  return (
    <>
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      <FieldLabelSettings />

      <FieldSettingsDivider />

      <SubTitleSettings />

      <FieldSettingsDivider />

      <AdminLabelSettings />

      <FieldSettingsDivider />

      <SizeAndPosition />

      <FieldSettingsDivider />

      <PlaceholderSettings />

      <FieldSettingsDivider />

      <HelperTxtSettings />

      <FieldSettingsDivider />

      <RequiredSettings />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="dflt-val-stng"
        title={__('Default Amount Value')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tip={tippyHelperMsg.defaultValue}
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={hideDefalutValue}
        toggleChecked={fieldData?.defaultValueHide}
        open={fieldData?.defaultValueHide}
        disable={!fieldData?.defaultValueHide}
        proProperty="defaultValue"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="dflt-val-stng-inp"
            aria-label="Default value for this Field"
            placeholder="e.g. USD 100.0"
            className={css(FieldStyle.input)}
            type={fieldData.typ}
            value={defaultValue}
            onChange={setDefaultValue}
          />
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <FieldReadOnlySettings />

      <FieldSettingsDivider />

      <FieldDisabledSettings />

      <FieldSettingsDivider />

      <FieldHideSettings />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="nmbr-stng"
        title="Input Amount Range(Min/Max):"
        className={css(FieldStyle.fieldSection)}
        isPro
        proProperty="minMaxValue"
      >
        <div className={css({ mx: 5 })}>
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Minimum amount:')}</span>
            <input
              data-testid="nmbr-stng-min-inp"
              title="Minimum amount for this field"
              aria-label="Minimum amount for this field"
              placeholder="Type minimum amount here..."
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={minValue}
              onChange={e => handleConfigChange(e.target.value, 'minValue', 'config')}
            />
          </div>
          {minValue && (
            <ErrorMessageSettings
              id="nmbr-stng-min"
              type="minValue"
              title="Minimum amount Error Message"
              tipTitle={`By enabling this feature, user will see the error message when input amount is less than ${minValue}`}
            />
          )}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Maximum amount:')}</span>
            <input
              data-testid="nmbr-stng-max-inp"
              title="Maximum amount for this field"
              aria-label="Maximum amount for this field"
              placeholder="Type maximun amount here..."
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={maxValue}
              onChange={e => handleConfigChange(e.target.value, 'maxValue', 'config')}
            />
          </div>

          {maxValue && (
            <ErrorMessageSettings
              id="nmbr-stng-max"
              type="maxValue"
              title="Max Error Message"
              tipTitle={`By enabling this feature, user will see the error message when input amount is greater than ${maxValue}`}
            />
          )}
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <SimpleAccordion
        id="inp-frmt-opt-stng"
        title={__('Input Format Options')}
        className={css(FieldStyle.fieldSection)}
        isPro
        proProperty="inputFormatOptions"
      >
        <div className={css(FieldStyle.placeholder)}>
          <div className={css(FieldStyle.labelInput)}>
            <span className={css(ut.m0, FieldStyle.title)}>{__('Formatter:')}</span>
            <select
              data-testid="frmtr-slct"
              className={css(FieldStyle.input, ut.wdt100)}
              aria-label="Formatter"
              value={fieldData?.inputFormatOptions?.formatter}
              onChange={e => handleConfigChange(e.target.value, 'formatter', 'inputFormatOptions')}
            >
              <option value="none">{__('None')}</option>
              <option value="browser">{__('Browser')}</option>
              <option value="custom">{__('Custom')}</option>
            </select>
          </div>

          <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
            <SingleToggle
              id="crncy-symbl"
              tip="By disabling this option, the currency symbol will be show"
              title={__('Currency Symbol:')}
              action={e => handleConfigChange(e.target.checked, 'showCurrencySymbol', 'inputFormatOptions')}
              isChecked={showCurrencySymbol}
            />
          </div>

          <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
            <SingleToggle
              id="rnd-to-clsst-int"
              tip="By disabling this option, the currency symbol will be show"
              title={__('Round to Closest Integer:')}
              action={e => handleConfigChange(e.target.checked, 'roundToClosestInteger', 'inputFormatOptions')}
              isChecked={inputRoundToClosestInteger}
            />
          </div>
          {
            inputFormatter === 'custom' && (
              <>
                <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
                  <SingleToggle
                    id="rnd-to-clsst-frc-dgt"
                    tip="By Enabling this option, the Fraction Will Rounded"
                    title={__('Round to Closest Fraction Digits:')}
                    action={e => handleConfigChange(e.target.checked, 'roundToClosestFractionDigits', 'inputFormatOptions')}
                    isChecked={inputRoundToClosestFractionDigit}
                    className={css(ut.m0, FieldStyle.title)}
                  />
                </div>

                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Minimum Fraction Digit:')}</span>
                  <input
                    data-testid="mnmm-frctn-dgt"
                    title="Minimum Fraction Digit"
                    aria-label="Minimum Fraction Digit"
                    placeholder="Minimum Fraction Digit"
                    className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                    type="number"
                    value={inputMinimumFractionDigits}
                    onChange={e => handleConfigChange(e.target.value, 'minimumFractionDigits', 'inputFormatOptions')}
                  />
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Maximum Fraction Digit:')}</span>
                  <input
                    data-testid="mxmm-frctn-dgt"
                    title="Maximum Fraction Digit"
                    aria-label="Maximum Fraction Digit"
                    placeholder="Maximum Fraction Digit"
                    className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                    type="number"
                    value={inputMaximumFractionDigits}
                    onChange={e => handleConfigChange(e.target.value, 'maximumFractionDigits', 'inputFormatOptions')}
                  />
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Decimal Separator:')}</span>
                  <input
                    data-testid="dcml-sprtr"
                    title="Decimal Separator"
                    aria-label="Decimal Separator"
                    placeholder="Decimal Separator"
                    className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                    type="text"
                    value={inputDecimalSeparator}
                    onChange={e => handleConfigChange(e.target.value, 'decimalSeparator', 'inputFormatOptions')}
                  />
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Number Format:')}</span>
                  <input
                    data-testid="inp-frmt-opt-inp"
                    title="Number Format"
                    aria-label="Input Number Format"
                    placeholder="Ex: ###,###,###"
                    className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                    type="text"
                    value={inputNumberFormat}
                    onChange={e => handleConfigChange(e.target.value, 'numberFormat', 'inputFormatOptions')}
                  />
                </div>
              </>
            )
          }
          {
            (inputFormatter === 'custom' || inputFormatter === 'none') && (
              <>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Currency Position:')}</span>
                  <select
                    data-testid="crncy-pstn"
                    className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                    aria-label="Currency Position"
                    value={fieldData?.inputFormatOptions?.currencyPosition}
                    onChange={e => handleConfigChange(e.target.value, 'currencyPosition', 'inputFormatOptions')}
                  >
                    <option value="right">{__('Right')}</option>
                    <option value="left">{__('Left')}</option>
                  </select>
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Symbol Position:')}</span>
                  <select
                    data-testid="smbl-pstn"
                    className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                    aria-label="Symbol Position"
                    value={fieldData?.inputFormatOptions?.symbolPosition}
                    onChange={e => handleConfigChange(e.target.value, 'symbolPosition', 'inputFormatOptions')}
                  >
                    <option value="left-number">{__('Left Number')}</option>
                    <option value="right-number">{__('Right Number')}</option>
                    <option value="left-currency">{__('Left Currency')}</option>
                    <option value="right-currency">{__('Right Currency')}</option>
                  </select>
                </div>
              </>
            )
          }
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="inp-frmt-opt-stng"
        title={__('Value Format Options')}
        className={css(FieldStyle.fieldSection)}
        isPro
        proProperty="valueFormatOptions"
      >
        <div className={css(FieldStyle.placeholder)}>
          <div className={css(FieldStyle.labelInput)}>
            <span className={css(ut.m0, FieldStyle.title)}>{__('Formatter:')}</span>
            <select
              data-testid="frmtr-slct"
              className={css(FieldStyle.input, ut.wdt100)}
              aria-label="Formatter"
              value={fieldData?.valueFormatOptions?.formatter}
              onChange={e => handleConfigChange(e.target.value, 'formatter', 'valueFormatOptions')}
            >
              <option value="none">{__('None')}</option>
              <option value="browser">{__('Browser')}</option>
              <option value="custom">{__('Custom')}</option>
            </select>
          </div>

          <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
            <SingleToggle
              id="crncy-symbl"
              tip="By disabling this option, the currency symbol will be show"
              title={__('Currency Symbol:')}
              action={e => handleConfigChange(e.target.checked, 'showCurrencySymbol', 'valueFormatOptions')}
              isChecked={showCurrencySymbol}
            />
          </div>

          <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
            <SingleToggle
              id="rnd-to-clsst-int"
              tip="By disabling this option, the currency symbol will be show"
              title={__('Round to Closest Integer:')}
              action={e => handleConfigChange(e.target.checked, 'roundToClosestInteger', 'valueFormatOptions')}
              isChecked={roundToClosestInteger}
            />
          </div>
          {
            valueFormatter === 'custom' && (
              <>

                <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
                  <SingleToggle
                    id="rnd-to-clsst-frc-dgt"
                    tip="By Enabling this option, the Fraction Will Rounded"
                    title={__('Round to Closest Fraction Digits:')}
                    action={e => handleConfigChange(e.target.checked, 'roundToClosestFractionDigits', 'valueFormatOptions')}
                    isChecked={roundToClosestFractionDigits}
                  />
                </div>

                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Minimum Fraction Digit:')}</span>
                  <input
                    data-testid="mnmm-frctn-dgt"
                    title="Minimum Fraction Digit"
                    aria-label="Minimum Fraction Digit"
                    placeholder="Minimum Fraction Digit"
                    className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                    type="number"
                    value={minimumFractionDigits}
                    onChange={e => handleConfigChange(e.target.value, 'minimumFractionDigits', 'valueFormatOptions')}
                  />
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Maximum Fraction Digit:')}</span>
                  <input
                    data-testid="mxmm-frctn-dgt"
                    title="Maximum Fraction Digit"
                    aria-label="Maximum Fraction Digit"
                    placeholder="Maximum Fraction Digit"
                    className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                    type="number"
                    value={maximumFractionDigits}
                    onChange={e => handleConfigChange(e.target.value, 'maximumFractionDigits', 'valueFormatOptions')}
                  />
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Decimal Separator:')}</span>
                  <input
                    data-testid="dcml-sprtr"
                    title="Decimal Separator"
                    aria-label="Decimal Separator"
                    placeholder="Decimal Separator"
                    className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                    type="text"
                    value={decimalSeparator}
                    onChange={e => handleConfigChange(e.target.value, 'decimalSeparator', 'valueFormatOptions')}
                  />
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Number Format:')}</span>
                  <input
                    data-testid="inp-frmt-opt-inp"
                    title="Number Format"
                    aria-label="Input Number Format"
                    placeholder="Ex: ###,###,###"
                    className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                    type="text"
                    value={numberFormat}
                    onChange={e => handleConfigChange(e.target.value, 'numberFormat', 'valueFormatOptions')}
                  />
                </div>
              </>
            )
          }
          {
            (valueFormatter === 'custom' || valueFormatter === 'none') && (
              <>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Currency Position:')}</span>
                  <select
                    data-testid="crncy-pstn"
                    className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                    aria-label="Currency Position"
                    value={currencyPosition}
                    onChange={e => handleConfigChange(e.target.value, 'currencyPosition', 'valueFormatOptions')}
                  >
                    <option value="right">{__('Right')}</option>
                    <option value="left">{__('Left')}</option>
                  </select>
                </div>
                <div className={css(FieldStyle.labelInput)}>
                  <span className={css(ut.m0, FieldStyle.title)}>{__('Symbol Position:')}</span>
                  <select
                    data-testid="smbl-pstn"
                    className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                    aria-label="Symbol Position"
                    value={symbolPosition}
                    onChange={e => handleConfigChange(e.target.value, 'symbolPosition', 'valueFormatOptions')}
                  >
                    <option value="left-number">{__('Left Number')}</option>
                    <option value="right-number">{__('Right Number')}</option>
                    <option value="left-currency">{__('Left Currency')}</option>
                    <option value="right-currency">{__('Right Currency')}</option>
                  </select>
                </div>
              </>
            )
          }
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="srch-plchldr-stng"
        title={__('Search Placeholder')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tip="By disabling this option, the search placeholder text will be remove"
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={toggleSearchPlaceholder}
        toggleChecked={showSearchPh}
        open={showSearchPh}
        disable={!showSearchPh}
        // isPro
        proProperty="searchPlaceholder"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="srch-plchldr-stng-inp"
            aria-label="Placeholer for Currency Search"
            placeholder="Type Placeholder here..."
            className={css(FieldStyle.input)}
            type="text"
            value={searchPlaceholder}
            onChange={setSearchPlaceholder}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="cntry-nt-fund-stng"
        title={__('Currency Not Found Text')}
        className={css(FieldStyle.fieldSection)}
        // switching
        // toggleAction={hideAdminLabel}
        // toggleChecked={fieldData?.adminLblHide}
        // disable={!fieldData?.adminLblHide}
        isPro
        proProperty="currencyNotFoundText"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="cntry-nt-fund-inp"
            aria-label="Currency Not Found Text"
            placeholder="Type no Currency found text here..."
            className={css(FieldStyle.input)}
            type="text"
            value={noCurrencyFoundText}
            onChange={e => handleConfigChange(e.target.value, 'noCurrencyFoundText', 'config')}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SingleToggle
        id="shw-slctd-img-stng"
        tip="By disabling this option, the show selected flag image will be hidden"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        title={__('Show Selected Flag Image')}
        action={e => handleConfigChange(e.target.checked, 'selectedFlagImage', 'config')}
        isChecked={selectedFlagImage}
        isPro
        proProperty="selectedOptImage"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="slctd-clrbl-stng"
        tip="By disabling this option, the selected currency clearable button will be hidden"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        title={__('Selected Currency Clearable')}
        action={e => handleConfigChange(e.target.checked, 'selectedCurrencyClearable', 'config')}
        isChecked={selectedCurrencyClearable}
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="srch-clrbl-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, the selected currency search clearable button will be hidden"
        title={__('Search Clearable')}
        action={e => handleConfigChange(e.target.checked, 'searchClearable', 'config')}
        isChecked={searchClearable}
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="opt-icn-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, the option flags image will be hidden"
        title={__('Option Flag Image')}
        action={e => handleConfigChange(e.target.checked, 'optionFlagImage', 'config')}
        isChecked={optionFlagImage}
        isPro
        proProperty="optionIcon"
      />

      <FieldSettingsDivider />

      <OptionsListHeightSettings />

      <FieldSettingsDivider />

      <div className={css(FieldStyle.fieldSection)}>
        <Btn
          dataTestId="edt-opt-stng"
          variant="primary-outline"
          size="sm"
          className={css({ mt: 10 })}
          onClick={openOptionModal}
        >
          {__('Edit Options')}
          <span className={css({ ml: 3, mt: 3, tm: 'rotate(45deg)' })}>
            <CloseIcn size="13" stroke="3" />
          </span>
        </Btn>
      </div>

      <FieldSettingsDivider />

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Options')}
      >
        <div className="pos-rel">
          <EditOptions
            optionMdl={optionMdl}
            options={options}
            setOptions={newOpts => handleOptions(newOpts)}
            lblKey="lbl"
            valKey="val"
            type="radio"
            onlyVisualOptionsTab
            hideNDisabledOptions
          />
        </div>
      </Modal>

    </>
  )
}

const propNameLabel = {
  formatter: 'Formatter Changed to',
  showCurrencySymbol: 'Show Currency Symbol',
  roundToClosestInteger: 'Round to closest integer',
  roundToClosestFractionDigits: 'Round to closest Fraction Digit',
  noCurrencyFoundText: 'Currency Not Found Text',
  selectedFlagImage: 'Selected Flag Image',
  selectedCurrencyClearable: 'Selected Country Clearable',
  searchClearable: 'Search Clearable',
  optionFlagImage: 'Option Flag Image',
}

export default CurrencyFieldSettings
