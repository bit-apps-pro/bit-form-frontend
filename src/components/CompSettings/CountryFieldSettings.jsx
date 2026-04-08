/* eslint-disable react/jsx-props-no-spreading */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { isDev } from '../../Utils/config'
import { __ } from '../../Utils/i18nwrap'
import FieldStyle from '../../styles/FieldStyle.style'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import SingleToggle from '../Utilities/SingleToggle'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
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

const CountryFieldSettings = () => {
  const { fieldKey: fldKey } = useParams()
  if (!fldKey) return <>No field exist with this field key</>
  const { css } = useFela()
  const [fields, setFields] = useAtom($fields)
  const [optionMdl, setOptionMdl] = useState(false)
  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { options } = fieldData

  const {
    selectedFlagImage,
    selectedCountryClearable,
    searchClearable,
    optionFlagImage,
    detectCountryByIp,
    detectCountryByGeo,
    showSearchPh,
    searchPlaceholder,
    noCountryFoundText,
    maxHeight,
  } = fieldData.config

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const handleOptions = newOpts => {
    const checkedOpt = newOpts.find(opt => opt.check)
    const allFields = create(fields, draft => {
      draft[fldKey].options = newOpts
      draft[fldKey].config.defaultValue = checkedOpt ? checkedOpt.i : ''
    })
    setFields(allFields)
    addToBuilderHistory({ event: `Modify Options List: ${fieldData.lbl || fldKey}`, type: 'options_modify', state: { fields: allFields, fldKey } })
  }

  const handleConfigChange = (val, name) => {
    fieldData.config[name] = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }

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

      <RequiredSettings />

      <FieldSettingsDivider />

      <PlaceholderSettings />

      <FieldSettingsDivider />

      <HelperTxtSettings />

      <FieldSettingsDivider />

      <FieldReadOnlySettings />

      <FieldSettingsDivider />

      <FieldDisabledSettings />

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
        action={e => handleConfigChange(e.target.checked, 'selectedFlagImage')}
        isChecked={selectedFlagImage}
        isPro
        proProperty="selectedFlagImage"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="slctd-clrbl-stng"
        tip="By disabling this option, the selected country clearable button will be hidden"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        title={__('Selected Country Clearable')}
        action={e => handleConfigChange(e.target.checked, 'selectedCountryClearable')}
        isChecked={selectedCountryClearable}
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="srch-clrbl-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, the selected country search clearable button will be hidden"
        title={__('Search Clearable')}
        action={e => handleConfigChange(e.target.checked, 'searchClearable')}
        isChecked={searchClearable}
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="opt-icn-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, the option flags image will be hidden"
        title={__('Option Flag Image')}
        action={e => handleConfigChange(e.target.checked, 'optionFlagImage')}
        isChecked={optionFlagImage}
        isPro
        proProperty="optionIcon"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="dtct-cntry-by-ip-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        tip="By disabling this option, are not detect county by ip"
        title={__('Detect Country By IP')}
        action={e => handleConfigChange(e.target.checked, 'detectCountryByIp')}
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
        action={e => handleConfigChange(e.target.checked, 'detectCountryByGeo')}
        isChecked={detectCountryByGeo || false}
        isPro
        proProperty="detectCountryByGeo"
      />

      <FieldSettingsDivider />

      <FieldHideSettings />

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
  noCountryFoundText: 'Country Not Found Text',
  selectedFlagImage: 'Selected Flag Image',
  selectedCountryClearable: 'Selected Country Clearable',
  searchClearable: 'Search Clearable',
  optionFlagImage: 'Allow Option Flag Image',
  detectCountryByIp: 'Detect Country By Ip',
  detectCountryByGeo: 'Detect Country By Geo',
}

export default CountryFieldSettings
