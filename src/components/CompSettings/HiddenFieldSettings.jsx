/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { memo, useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import { $fields, $updateBtn } from '../../GlobalStates/GlobalStates'
import FieldStyle from '../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import tippyHelperMsg from '../../Utils/StaticData/tippyHelperMsg'
import Modal from '../Utilities/Modal'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import EditOptions from './EditOptions/EditOptions'
import Icons from './Icons'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'

function HiddenFieldSettings() {
  const { fieldKey: fldKey } = useParams()

  if (!fldKey) return <>No field exist with this field key</>
  const setUpdateBtn = useSetAtom($updateBtn)
  const [optionMdl, setOptionMdl] = useState(false)
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])

  const adminLabel = fieldData.adminLbl || ''
  const defaultValue = fieldData.defaultValue || ''
  const suggestions = fieldData.suggestions || []

  const { css } = useFela()

  const hideDefalutValue = (e) => {
    if (e.target.checked) {
      fieldData.defaultValue = fieldData.lbl || fldKey
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

  const setDefaultValue = ({ target: { value } }) => {
    if (value === '') delete fieldData.defaultValue
    else fieldData.defaultValue = value

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default value updated: ${value || fieldData.lbl || adminLabel || fldKey}`, type: 'change_defaultValue', state: { fields: allFields, fldKey } })
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const handleSuggestions = newSuggestions => {
    fieldData.suggestions = newSuggestions
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    setUpdateBtn({ unsaved: true })
    addToBuilderHistory({ event: `Suggestion Update: ${fieldData.lbl || adminLabel || fldKey}`, type: 'suggestion_update', state: { fields: allFields, fldKey } })
  }

  return (
    <>
      <div className="">
        <FieldSettingTitle
          title="Field Settings"
          subtitle={fieldData.typ}
          fieldKey={fldKey}
        />

        <FieldLabelSettings hideIcons />

        <FieldSettingsDivider />

        <SimpleAccordion
          id="dflt-val-stng"
          title={__('Default value')}
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
              placeholder="Type default value here..."
              className={css(FieldStyle.input)}
              type={fieldData.typ === 'hidden' ? 'text' : fieldData.typ}
              value={defaultValue}
              onChange={setDefaultValue}
            />
          </div>
        </SimpleAccordion>
        <FieldSettingsDivider />

      </div>

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Suggestion')}
      >
        <div className="pos-rel">

          <EditOptions
            optionMdl={optionMdl}
            options={suggestions}
            setOptions={newSuggestions => handleSuggestions(newSuggestions)}
            lblKey="lbl"
            valKey="val"
            checkByDefault={false}
          />
        </div>
      </Modal>

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title={__('Icons')}
      >
        <div className="pos-rel" />

        <Icons iconType={icnType} setModal={setIcnMdl} />
      </Modal>
    </>
  )
}

export default memo(HiddenFieldSettings)
