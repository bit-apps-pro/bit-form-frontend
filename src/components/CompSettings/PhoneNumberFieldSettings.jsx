import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import BdrDottedIcn from '../../Icons/BdrDottedIcn'
import CloseIcn from '../../Icons/CloseIcn'
import { addToBuilderHistory, escapeBackslashPattern, generateBackslashPattern } from '../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../Utils/Helpers'
import predefinedPatterns from '../../Utils/StaticData/phonePatterns.json'
import tippyHelperMsg from '../../Utils/StaticData/tippyHelperMsg'
import { isDev } from '../../Utils/config'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import Btn from '../Utilities/Btn'
import Downmenu from '../Utilities/Downmenu'
import Modal from '../Utilities/Modal'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import AutoResizeInput from './CompSettingsUtils/AutoResizeInput'
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
import UniqFieldSettings from './CompSettingsUtils/UniqFieldSettings'
import EditOptions from './EditOptions/EditOptions'
import Icons from './Icons'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

const PhoneNumberFieldSettings = () => {
  const { fieldKey: fldKey } = useParams()
  if (!fldKey) return <>No field exist with this field key</>

  const { css } = useFela()
  const [fields, setFields] = useAtom($fields)
  const [optionMdl, setOptionMdl] = useState(false)
  const globalMessages = useAtomValue($globalMessages)
  const [icnMdl, setIcnMdl] = useState(false)
  const [fieldName, setFieldName] = useState('')
  const fieldData = deepCopy(fields[fldKey])
  const patternTippy = useRef()
  const regexr = fieldData.valid.regexr || ''
  const flags = fieldData.valid.flags || ''
  const adminLabel = fieldData.adminLbl || ''
  const globalErrMsg = globalMessages.err || {}
  const { placeholderImage, options } = fieldData

  const {
    selectedFlagImage,
    hideCountryList,
    selectedCountryClearable,
    searchClearable,
    optionFlagImage,
    detectCountryByIp,
    detectCountryByGeo,
    showSearchPh,
    searchPlaceholder,
    noCountryFoundText,
    inputFormat,
    valueFormat,
    maxHeight,
  } = fieldData.config

  const toggleSearchPlaceholder = (e) => {
    if (e.target.checked) {
      fieldData.config.searchPlaceholder = 'Search Country Here...'
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

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const setDefaultValue = ({ target: { value } }) => {
    if (!IS_PRO) return
    if (value === '') delete fieldData.defaultValue
    else fieldData.defaultValue = value

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default value updated: ${value || fieldData.lbl || adminLabel || fldKey}`, type: 'change_defaultValue', state: { fields: allFields, fldKey } })
  }

  const hideDefalutValue = (e) => {
    if (!IS_PRO) return
    if (e.target.checked) {
      fieldData.defaultValueHide = true
    } else {
      fieldData.defaultValueHide = false
      delete fieldData.defaultValue
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default value ${req}: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req.toLowerCase()}_defaultValue`, state: { fields: allFields, fldKey } })
  }

  const handleOptions = newOpts => {
    const checkedOpt = newOpts.find(opt => opt.check)
    const allFields = create(fields, draft => {
      draft[fldKey].options = newOpts
      draft[fldKey].config.defaultCountryKey = checkedOpt ? checkedOpt.i : ''
    })
    setFields(allFields)
    addToBuilderHistory({ event: `Modify Options List: ${fieldData.lbl || fldKey}`, type: 'options_modify', state: { fields: allFields, fldKey } })
  }

  const handleConfigChange = (val, name, config) => {
    fieldData[config][name] = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }

  const setRegexrValue = value => {
    // eslint-disable-next-line no-underscore-dangle
    patternTippy?.current?._tippy?.hide()
    if (!IS_PRO) return
    if (value === '') {
      delete fieldData.valid.regexr
    } else {
      const val = escapeBackslashPattern(value)
      fieldData.valid.regexr = val
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.regexr) fieldData.err.regexr = {}
      const ifPredefined = predefinedPatterns.find(opt => opt.val === val)
      fieldData.err.regexr.dflt = ifPredefined ? `<p style="margin:0">${ifPredefined.msg}</p>` : (globalErrMsg[fieldData.typ]?.regexr || globalErrMsg?.regexr || '<p style="margin:0">Pattern not matched</p>')
      fieldData.err.regexr.show = true
      if (fieldData.typ === 'password') {
        delete fieldData.valid.validations
      }
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Regex Pattern updated: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_regexr', state: { fields: allFields, fldKey } })
  }

  const setRegexr = e => {
    if (!IS_PRO) return
    const { value } = e.target
    if (value === '') {
      delete fieldData.valid.regexr
    } else {
      const val = escapeBackslashPattern(value)
      fieldData.valid.regexr = val
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.regexr) fieldData.err.regexr = {}
      const ifPredefined = predefinedPatterns.find(opt => opt.val === val)
      fieldData.err.regexr.dflt = ifPredefined ? `<p style="margin:0">${ifPredefined.msg}</p>` : (globalErrMsg[fieldData.typ]?.regexr || globalErrMsg?.regexr || '<p style="margin:0">Pattern not matched</p>')
      fieldData.err.regexr.show = true
      if (fieldData.typ === 'password') {
        delete fieldData.valid.validations
      }
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Regex Pattern updated: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_regexr', state: { fields: allFields, fldKey } })
  }

  const setFlags = e => {
    if (!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.valid.flags
    } else {
      fieldData.valid.flags = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Regex Pattern Flag updated: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_flags', state: { fields: allFields, fldKey } })
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

      <FieldReadOnlySettings />

      <FieldSettingsDivider />

      <FieldDisabledSettings />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="dflt-val-stng"
        title={__('Default Phone Number')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tip={tippyHelperMsg.defaultValue}
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={hideDefalutValue}
        toggleChecked={fieldData?.defaultValueHide}
        open={fieldData?.defaultValueHide}
        {...IS_PRO && { disable: !fieldData?.defaultValueHide }}
        isPro
        proProperty="defaultValue"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="dflt-val-stng-inp"
            aria-label="Default value for this Field"
            placeholder="Type a phone number.. (Ex: +01 555 1523)"
            className={css(FieldStyle.input)}
            type={fieldData.typ === 'textarea' ? 'text' : fieldData.typ}
            value={fieldData?.defaultValue || ''}
            onChange={setDefaultValue}
          />
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <SimpleAccordion
        id="inp-frmt-opt-stng"
        title={__('Input Format Option')}
        className={css(FieldStyle.fieldSection)}
        // switching
        // toggleAction={hideAdminLabel}
        // toggleChecked={fieldData?.adminLblHide}
        // disable={!fieldData?.adminLblHide}
        isPro
        proProperty="inputFormatOptions"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="inp-frmt-opt-inp"
            aria-label="Input Format Option"
            placeholder="Input Format(Ex: +c #### ### ###)"
            className={css(FieldStyle.input)}
            type="text"
            value={inputFormat}
            onChange={e => handleConfigChange(e.target.value, 'inputFormat', 'config')}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="val-frmt-opt-stng"
        title={__('Value Format Option')}
        className={css(FieldStyle.fieldSection)}
        // switching
        // toggleAction={hideAdminLabel}
        // toggleChecked={fieldData?.adminLblHide}
        // disable={!fieldData?.adminLblHide}
        isPro
        proProperty="valueFormatOptions"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="val-frmt-opt-inp"
            aria-label="Value Format Option"
            placeholder="Value Format(Ex: +c #### ### ###)"
            className={css(FieldStyle.input)}
            type="text"
            value={valueFormat}
            onChange={e => handleConfigChange(e.target.value, 'valueFormat', 'config')}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="ptrn-stng"
        title={__('Custom Validation (RegEx) Pattern')}
        className={css(FieldStyle.fieldSection)}
        isPro
        tip={tippyHelperMsg.pattern}
        proProperty="regexPattern"
      >
        <>
          <div className={css(ut.mr2, ut.mt3, ut.pl1)}>
            <div className={css(ut.flxcb, ut.ml1)}>
              <h4 className={css(ut.m0, FieldStyle.title)}>
                {__('Expression')}
                :
              </h4>
              <Downmenu instance={patternTippy}>
                <button
                  data-testid="ptrn-stng-exprsn-btn"
                  data-close
                  type="button"
                  className={css(style.dotBtn)}
                  unselectable="on"
                  draggable="false"
                  style={{ cursor: 'pointer' }}
                  title={__('Fields')}
                >
                  <BdrDottedIcn size="19" />
                </button>
                <div>
                  <ul role="menu">
                    {predefinedPatterns?.map((opt, i) => (
                      <li
                        data-testid={`ptrn-stng-expn-itm-${i}`}
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        role="menuitem"
                        className={`${css(style.button)} btnHover`}
                        onKeyDown={() => setRegexrValue(opt.val)}
                        onClick={() => setRegexrValue(opt.val)}
                      >
                        <span>{opt.lbl}</span>
                        <br />
                        <small>{generateBackslashPattern(opt.val)}</small>
                      </li>
                    ))}
                  </ul>
                  {/* {predefinedPatterns.map((opt, i) => <option key={`${i * 2}`} value={generateBackslashPattern(opt.val)}>{opt.lbl}</option>)} */}
                </div>
              </Downmenu>
            </div>
            <AutoResizeInput
              id="ptrn-stng-expn"
              ariaLabel="Pattern for input field"
              placeholder="e.g. ([A-Z])\w+"
              list="patterns"
              disabled={!IS_PRO}
              value={generateBackslashPattern(regexr)}
              changeAction={setRegexr}
            />
          </div>
          <div className={css({ mr: 5 }, ut.pl1)}>
            <SingleInput
              id="ptrn-stng-flg"
              inpType="text"
              title={__('Flags:')}
              value={flags}
              action={setFlags}
              placeholder="e.g. g"
              cls={css(FieldStyle.input)}
              disabled={!IS_PRO}
            />
          </div>
          {regexr && (
            <ErrorMessageSettings
              id="ptrn-stng-expn"
              type="regexr"
              title="Error Message"
              tipTitle={tippyHelperMsg.patternsErrMsg}
            />
          )}
        </>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <SimpleAccordion id="nmbr-stng" title="Invalid Error Message:" className={css(FieldStyle.fieldSection)}>
        <ErrorMessageSettings
          id="invalid-err-msg"
          type="invalid"
          title="Invalid Error Message"
          tipTitle="By enabling this feature, user will see the error message when input value is Invalid"
        />
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
        isPro
        proProperty="searchPlaceholder"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="srch-plchldr-stng-inp"
            aria-label="Placeholer for Country Search"
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
        title={__('Country Not Found Text')}
        className={css(FieldStyle.fieldSection)}
        // switching
        // toggleAction={hideAdminLabel}
        // toggleChecked={fieldData?.adminLblHide}
        // disable={!fieldData?.adminLblHide}
        isPro
        proProperty="countryNotFoundText"
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="cntry-nt-fund-inp"
            aria-label="Country Not Found Text"
            placeholder="Type no country found text here..."
            className={css(FieldStyle.input)}
            type="text"
            value={noCountryFoundText}
            onChange={e => handleConfigChange(e.target.value, 'noCountryFoundText', 'config')}
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
        id="hide-slctble-opt"
        tip="By enabling this option, the country list will be hidden."
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        title={__('Hide Country List')}
        action={e => handleConfigChange(e.target.checked, 'hideCountryList', 'config')}
        isChecked={hideCountryList}
        isPro
        proProperty="hideCountryList"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="slctd-clrbl-stng"
        tip="By disabling this option, the selected country clearable button will be hidden"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        title={__('Selected Country Clearable')}
        action={e => handleConfigChange(e.target.checked, 'selectedCountryClearable', 'config')}
        isChecked={selectedCountryClearable}
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="srch-clrbl-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, the selected country search clearable button will be hidden"
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
        proProperty="optionFlagImage"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="dtct-cntry-by-ip-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, are not detect county by ip"
        title={__('Detect Country By IP')}
        action={e => handleConfigChange(e.target.checked, 'detectCountryByIp', 'config')}
        isChecked={detectCountryByIp || false}
        isPro
        proProperty="detectCountryByIp"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="dtct-cntry-by-geo-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, are not detect county by Geo location"
        title={__('Detect Country By Geo')}
        action={e => handleConfigChange(e.target.checked, 'detectCountryByGeo', 'config')}
        isChecked={detectCountryByGeo || false}
        isPro
        proProperty="detectCountryByGeo"
      />

      <FieldSettingsDivider />

      <FieldHideSettings />

      <FieldSettingsDivider />

      <OptionsListHeightSettings />

      <FieldSettingsDivider />

      <UniqFieldSettings
        type="entryUnique"
        title={__('Unique Entry')}
        tipTitle={tippyHelperMsg.uniqueEntry}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        isUnique="show"
      />
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
        title={__('Options 2')}
        width="730px"
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

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title="Image"
      >
        <div className="pos-rel" />

        <Icons
          iconType={fieldName}
          selected="Upload Image"
          uploadLbl="Upload Image"
          setModal={setIcnMdl}
          addPaddingOnSelect={false}
        />
      </Modal>

    </>
  )
}

const propNameLabel = {
  inputFormat: 'Input Formate Changed to',
  valueFormat: 'Value Formate Changed to',
  noCountryFoundText: 'Country Not Found Text',
  selectedFlagImage: 'Selected Flag Image',
  selectedCountryClearable: 'Selected Country Clearable',
  searchClearable: 'Search Clearable',
  optionFlagImage: 'Option Flag Image',
  detectCountryByIp: 'Detect Country By IP',
  detectCountryByGeo: 'Detect Country By Geo',
}

const style = {
  dotBtn: {
    b: 0,
    brs: 5,
    mr: 15,
    curp: 1,
  },
  button: {
    dy: 'block',
    w: '100%',
    ta: 'left',
    b: 0,
    bd: 'none',
    p: 3,
    curp: 1,
    '&:hover':
    {
      bd: 'var(--white-0-95)',
      cr: 'var(--black-0)',
      brs: 8,
    },
    fs: 11,
  },
}

export default PhoneNumberFieldSettings
