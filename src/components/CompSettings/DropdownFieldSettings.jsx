/* eslint-disable react/jsx-props-no-spreading */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { Fragment, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $proModal } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import EditIcn from '../../Icons/EditIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy } from '../../Utils/Helpers'
import proHelperData from '../../Utils/StaticData/proHelperData'
import { isDev } from '../../Utils/config'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import Btn from '../Utilities/Btn'
import CheckBox from '../Utilities/CheckBox'
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
import UniqFieldSettings from './CompSettingsUtils/UniqFieldSettings'
import EditOptions from './EditOptions/EditOptions'
import OptionList from './OptionList'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'
import { $globalMessages } from '../../GlobalStates/AppSettingsStates'

export default function DropdownFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  const setProModal = useSetAtom($proModal)
  if (!fldKey) return <>No field exist with this field key</>
  const { css } = useFela()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const [optionMdl, setOptionMdl] = useState(false)
  const [duplicateListName, setDuplicateListName] = useState(false)
  const [currentOptList, setCurrentOptList] = useState(0)
  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const globalErrMsg = globalMessages?.err || {}

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const { optionsList } = fieldData
  const listLength = optionsList.length

  const {
    selectedOptImage, selectedOptClearable, searchClearable,
    optionIcon,
    showSearchPh,
    searchPlaceholder, multipleSelect, allowCustomOption, closeOnSelect, activeList, showChip, maxHeight,
  } = fieldData.config
  const { mn, mx } = fieldData

  const handleConfigChange = (val, name) => {
    fieldData.config[name] = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} ${val ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`, type: `${name}_change`, state: { fields: allFields, fldKey } })
  }

  const handleMultiSelect = (val, name) => {
    fieldData.config[name] = val
    fieldData.config.showChip = val
    fieldData.config.closeOnSelect = !val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} ${val ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`, type: `${name}_change`, state: { fields: allFields, fldKey } })
  }

  const setCustomType = (customType) => {
    setFields(allFields => create(allFields, draft => {
      if (!draft[fldKey].customTypeList) draft[fldKey].customTypeList = []
      draft[fldKey].customTypeList[currentOptList] = customType
    }))
  }

  const toggleSearchPlaceholder = (e) => {
    if (e.target.checked) {
      fieldData.config.searchPlaceholder = 'Search Options...'
      fieldData.config.showSearchPh = true
    } else {
      fieldData.config.searchPlaceholder = ''
      fieldData.config.showSearchPh = false
    }
    const req = e.target.checked ? 'Show' : 'Hide'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${req} Search Placeholder: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req.toLowerCase()}_placeholder`, state: { fields: allFields, fldKey } })
  }

  function setSearchPlaceholder(e) {
    fieldData.config.searchPlaceholder = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Search Placeholder updated: ${fieldData.lbl || adminLabel || fldKey}`, type: 'change_placeholder', state: { fields: allFields, fldKey } })
  }
  const handleOptionList = ({ target }, index) => {
    fieldData.config.activeList = index
    const allFields = create(fields, draft => {
      const defaultOpt = fieldData.optionsList[index][Object.keys(fieldData.optionsList[index])[0]].find(opt => opt.check)
      fieldData.config.defaultValue = defaultOpt ? (defaultOpt.val || defaultOpt.lbl) : ''
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({ event: `Change Active List: ${fieldData.lbl || adminLabel || fldKey}`, type: 'change_active_list', state: { fields: allFields, fldKey } })
  }
  const handleEditOptions = newOpts => {
    const allFields = create(fields, draft => {
      draft[fldKey].optionsList[currentOptList][Object.keys(fieldData.optionsList[currentOptList])[0]] = newOpts
      if (currentOptList === activeList) {
        const defaultOpt = newOpts.find(opt => opt.check)
        draft[fldKey].config.defaultValue = defaultOpt ? (defaultOpt.val || defaultOpt.lbl) : ''
      }
    })
    setFields(allFields)
    addToBuilderHistory({ event: `Modify Option List: ${fieldData.lbl || adminLabel || fldKey}`, type: 'modify_options_list', state: { fields: allFields, fldKey } })
  }

  const handleAddNewOptionList = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.optionList })
      return
    }
    let newKey = `List-${Object.keys(optionsList).length + 1}`
    while (isListNameExist(newKey)) { newKey = `${newKey}1` }
    fieldData.optionsList = [
      ...optionsList, {
        [newKey]: [
          { lbl: 'Option 1' },
          { lbl: 'Option 2' },
          { lbl: 'Option 3' },
        ],
      },
    ]
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Add New List: ${fieldData.lbl || adminLabel || fldKey}`, type: 'add_new_list', state: { fields: allFields, fldKey } })
  }

  const isListNameExist = (listName) => {
    const len = optionsList.length
    for (let i = 0; i < len; i += 1) {
      if (Object.keys(optionsList[i])[0] === listName) {
        return true
      }
    }
    return false
  }

  const handleRemoveList = (index) => {
    fieldData.optionsList.splice(index, 1)
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Remove List: ${fieldData.lbl || adminLabel || fldKey}`, type: 'remove_list', state: { fields: allFields, fldKey } })
  }

  const handleListNameChange = (e, index) => {
    const { target } = e
    if (!isListNameExist(target.value)) {
      fieldData.optionsList[index] = { [target.value]: fieldData.optionsList[index][target.defaultValue] }
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      addToBuilderHistory({ event: `List Name Change: ${fieldData.lbl || adminLabel || fldKey}`, type: 'list_name_change', state: { fields: allFields, fldKey } })
      setDuplicateListName(false)
    } else {
      e.preventDefault()
      setDuplicateListName(index)
    }
  }

  function setMinMaxValue(propName, val) {
    const value = isNaN(val) ? '' : Number(val)
    if (value >= 0) {
      if (!fieldData.err.mn && propName === 'mn') fieldData.err.mn = { show: true }
      if (!fieldData.err.mx && propName === 'mx') fieldData.err.mx = { show: true }
      if (propName === 'mx' && mn && value < mn && mn) {
        fieldData.mn = value
        fieldData.err.mn.dflt = globalErrMsg?.[fieldData.typ]?.mn || `Minimum ${value} Option Required`
      } else if (propName === 'mn' && value > mx && mx) {
        fieldData.mx = value
        fieldData.err.mx.dflt = globalErrMsg?.[fieldData.typ]?.mx || `Maximum ${value} Option can select.`
      }
      if (propName === 'mn') fieldData.err.mn.dflt = globalErrMsg?.[fieldData.typ]?.mn || `Minimum ${value} Option Required`
      else if (propName === 'mx') fieldData.err.mx.dflt = globalErrMsg?.[fieldData.typ]?.mx || `Maximum ${value} Option can select.`

      fieldData[propName] = value
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      addToBuilderHistory({ event: `${propNameLabel[propName]} '${String(value || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`, type: `${propName}_changed`, state: { fields: allFields, fldKey } })
      // fieldData.mn > 0 && setRequired({ target: { checked: true } })
    }
  }

  const setDisabledOnMax = e => {
    if (!IS_PRO) return
    if (e.target.checked) {
      fieldData.valid.disableOnMax = true
    } else {
      delete fieldData.valid.disableOnMax
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Disable on max selected ${e.target.checked ? 'on' : 'off'}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_disable_on_max', state: { fields: allFields, fldKey } })
  }

  if (isDev) {
    window.selectedFieldData = fieldData
  }

  const activeListOptions = optionsList[activeList][Object.keys(optionsList[activeList])[0]]

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
      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(FieldStyle.fieldSectionTitle)}>
          {__('Active Options')}
        </div>
        <OptionList
          options={activeListOptions}
          onClick={() => {
            setCurrentOptList(activeList)
            openOptionModal()
          }}
        />
      </div>
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
        id="srch-plchldr-stng"
        title={__('Search Placeholder')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tip="By disabling this option, the field search placeholder will be remove"
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={toggleSearchPlaceholder}
        toggleChecked={showSearchPh}
        open={showSearchPh}
        {...IS_PRO && { disable: !showSearchPh }}
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

      <SingleToggle
        id="shw-slctd-img-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
        title={__('Show Selected Option Image')}
        action={e => handleConfigChange(e.target.checked, 'selectedOptImage')}
        isChecked={selectedOptImage}
        tip="By disabling this option, the field show selected option image will be hidden"
        isPro
        proProperty="selectedOptImage"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="slctd-clrbl-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.singleOption)}
        title={__('Selected Option Clearable:')}
        action={e => handleConfigChange(e.target.checked, 'selectedOptClearable')}
        isChecked={selectedOptClearable}
        tip="By disabling this option, the field selected option clearable will be hidden"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="srch-clrbl-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.singleOption)}
        title={__('Search Clearable:')}
        action={e => handleConfigChange(e.target.checked, 'searchClearable')}
        isChecked={searchClearable}
        tip="By disabling this option, the field search clearable will be hidden"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="opt-icn-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.singleOption)}
        title={__('Option Icon/Image:')}
        action={e => handleConfigChange(e.target.checked, 'optionIcon')}
        isChecked={optionIcon}
        tip="By disabling this option, the field option icon will be hidden"
        isPro
        proProperty="optionIcon"
      />

      <FieldSettingsDivider />

      <SingleToggle
        id="alw-cstm-opt-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.singleOption)}
        title={__('Allow Custom Option:')}
        action={e => handleConfigChange(e.target.checked, 'allowCustomOption')}
        isChecked={allowCustomOption}
        tip="By disabling this option, the field allow custom option will be hidden"
      />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="alw-mltpl-stng"
        title={__('Allow Multiple Select:')}
        // eslint-disable-next-line react/jsx-no-bind
        toggleAction={e => handleMultiSelect(e.target.checked, 'multipleSelect')}
        toggleChecked={multipleSelect}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tip="By enabling this feature, you wil enable to select Multiple Options"
        tipProps={{ width: 200, icnSize: 17 }}
        open={multipleSelect}
        disable={!multipleSelect}
        isPro
        allowToggle
        proProperty="minMaxOpt"
      >
        <div className={css(ut.ml1, ut.mr1)}>
          <div className={css(ut.flxc)}>
            <span>Minimum Option</span>
            <input
              data-testid="alw-mltpl-min-inp"
              className={css(FieldStyle.input, ut.w5, ut.mt1)}
              type="number"
              value={mn}
              onChange={e => setMinMaxValue('mn', e.target.value)}
            />
          </div>
          {!!mn && (
            <ErrorMessageSettings
              className={css(ut.mt0)}
              id="min-fil-err-msg"
              type="mn"
              defaultMsg={`Minimum ${mn} Option Required`}
              allowIcons={false}
            />
          )}
          <div className={css(ut.flxc, ut.mt2)}>
            <span>Maximum Option</span>
            <input
              data-testid="alw-mltpl-max-inp"
              className={css(FieldStyle.input, ut.w5, ut.mt1)}
              type="number"
              value={mx}
              onChange={e => setMinMaxValue('mx', e.target.value)}
            />
          </div>
          {!!mx && (
            <>
              <ErrorMessageSettings
                className={css(ut.mt0)}
                id="max-fil-err-msg"
                type="mx"
                defaultMsg={`Maximum ${mx} Option can select`}
                allowIcons={false}
              />
              <SingleToggle id="mxmm-slctd" title={__('Disable if maximum selected:')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={!IS_PRO} className="mt-3 mb-2" />
            </>
          )}

        </div>
      </SimpleAccordion>

      {multipleSelect && (
        <>
          <FieldSettingsDivider />
          <SingleToggle
            id="show-chip"
            className={css(FieldStyle.fieldSection, FieldStyle.singleOption)}
            title={__('Show Selected Option Chip:')}
            action={e => handleConfigChange(e.target.checked, 'showChip')}
            isChecked={showChip}
            tip="Show selected options as chip (clearable). If disabled, count of selected options will be shown as text."
          />
        </>
      )}

      <FieldSettingsDivider />

      <SingleToggle
        id="cls-on-slct-stng"
        className={css(FieldStyle.fieldSection, FieldStyle.singleOption)}
        title={__('Close On Select:')}
        action={e => handleConfigChange(e.target.checked, 'closeOnSelect')}
        isChecked={closeOnSelect}
        tip="By disabling this option, the field close on select will be hidden"
      />

      <FieldSettingsDivider />

      <FieldHideSettings />

      <FieldSettingsDivider />

      <OptionsListHeightSettings />

      <FieldSettingsDivider />

      <UniqFieldSettings
        type="entryUnique"
        title={__('Validate as Entry Unique')}
        tipTitle={__('Enabling this option will check from the entry database whether its value is duplicate.')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        isUnique="show"
      />
      <FieldSettingsDivider />

      <SimpleAccordion
        id="lst-n-opt"
        title="Lists & Options"
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css({ p: '5px 10px' })}>
          {optionsList.map((listObj, index) => {
            const listName = Object.keys(listObj)
            return (
              <Fragment key={`list-name-${index + 1}`}>
                <div className={css(ut.flxcb)}>
                  <input
                    data-testid={`lst-name-inp-${index}`}
                    type="text"
                    name=""
                    id=""
                    value={listName}
                    className={css(FieldStyle.input, { mr: 10, my: 5 })}
                    onChange={e => handleListNameChange(e, index)}
                  />
                  <CheckBox
                    id={`lst-opt-${index}`}
                    radio
                    name="option-list"
                    className={css({ p: 0 })}
                    onChange={e => handleOptionList(e, index)}
                    checked={index === activeList}
                    value={index}
                    tip="Select this list as active"
                  />
                  <button
                    data-testid={`lst-opt-edt-btn-${index}`}
                    type="button"
                    className={css(c.delBtn)}
                    title="Edit List Options"
                    onClick={() => {
                      setCurrentOptList(index)
                      openOptionModal()
                    }}
                  >
                    <EditIcn size={19} />
                  </button>
                  {listLength > 1 && index !== activeList && (
                    <button
                      data-testid={`lst-opt-del-btn-${index}`}
                      type="button"
                      className={css(c.delBtn)}
                      onClick={() => handleRemoveList(index)}
                      title="Delete List"
                    >
                      <TrashIcn size={19} />
                    </button>
                  )}
                </div>
                {duplicateListName === index && <span className={css({ cr: 'red', ml: 5 })}>Duplicate List Name Not Allowed</span>}
              </Fragment>
            )
          })}
          <Btn
            dataTestId="edt-opt-stng"
            variant="primary-outline"
            size="sm"
            className={css({ mt: 10 })}
            onClick={handleAddNewOptionList}
          >
            {__('Add Options List')}
            <span className={css({ ml: 3, mt: 3, tm: 'rotate(45deg)' })}>
              <CloseIcn size="13" stroke="3" />
            </span>
          </Btn>

        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={() => setOptionMdl(false)}
        className="o-v "
        title={__('Options')}
        width="730px"
      >
        <div className="pos-rel">
          <EditOptions
            optionMdl={optionMdl}
            options={Object.values(optionsList[currentOptList] || {})[0]}
            setOptions={newOpts => handleEditOptions(newOpts)}
            lblKey="lbl"
            valKey="val"
            imgKey="img"
            type="radio"
            hasGroup
            showUpload={optionIcon}
            customType={fieldData?.customTypeList?.[currentOptList]}
            setCustomType={setCustomType}
          />
        </div>
      </Modal>
    </>
  )
}

const c = {
  delBtn: {
    se: 25,
    flx: 'center',
    b: 'none',
    p: 3,
    mr: 1,
    tn: '.2s all',
    curp: 1,
    brs: '50%',
    bd: 'none',
    ':hover': { bd: 'var(--b-20-93)', cr: 'var(--blue)' },
  },
}

const propNameLabel = {
  selectedOptImage: 'Selected Option Image',
  selectedOptClearable: 'Selected Option Clearable',
  searchClearable: 'Search Clearable',
  optionIcon: 'Option Icon',
  allowCustomOption: 'Allow Custom Option',
  multipleSelect: 'Multiple Select',
  closeOnSelect: 'Close On Select',
}
