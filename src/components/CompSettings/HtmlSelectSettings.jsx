import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import FieldStyle from '../../styles/FieldStyle.style'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import FieldDisabledSettings from './CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldReadOnlySettings from './CompSettingsUtils/FieldReadOnlySettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import PlaceholderSettings from './CompSettingsUtils/PlaceholderSettings'
import RequiredSettings from './CompSettingsUtils/RequiredSettings'
import SubTitleSettings from './CompSettingsUtils/SubTitleSettings'
import UniqFieldSettings from './CompSettingsUtils/UniqFieldSettings'
import EditOptions from './EditOptions/EditOptions'
import OptionList from './OptionList'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

export default function HtmlSelectSettings() {
  const { fieldKey: fldKey } = useParams()
  if (!fldKey) return <>No field exist with this field key</>
  const { css } = useFela()
  const [fields, setFields] = useAtom($fields)
  const [optionMdl, setOptionMdl] = useState(false)
  const fieldData = deepCopy(fields[fldKey])
  const options = fieldData.opt

  const handleOptions = newOpts => {
    setFields(allFields => create(allFields, draft => { draft[fldKey].opt = newOpts }))
  }

  const handleCustomType = newCustomType => {
    setFields(allFields => create(allFields, draft => { draft[fldKey].customType = newCustomType }))
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

      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(FieldStyle.fieldSectionTitle)}>
          {__('Options')}
        </div>
        <OptionList
          options={options}
          onClick={() => setOptionMdl(true)}
        />
        <Btn
          dataTestId="edt-opt-stng"
          variant="primary-outline"
          size="sm"
          className={css({ mt: 10 })}
          onClick={() => setOptionMdl(true)}
        >
          {__('Add/Edit Options')}
          <span className={css({ ml: 3, mt: 3, tm: 'rotate(45deg)' })}>
            <CloseIcn size="12" stroke="4" />
          </span>
        </Btn>
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

      <FieldHideSettings />

      <FieldSettingsDivider />

      <FieldReadOnlySettings />

      <FieldSettingsDivider />

      <FieldDisabledSettings />

      <FieldSettingsDivider />

      <UniqFieldSettings
        type="entryUnique"
        title={__('Validate as Entry Unique')}
        tipTitle={__('Enabling this option will check from the entry database whether its value is duplicate.')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        isUnique="show"
      />
      <FieldSettingsDivider />

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={() => setOptionMdl(false)}
        className="o-v"
        title={__('Options')}
        width="730px"
      >
        {/* <div className="pos-rel"> */}
        {/* {!isPro && (
            <div className="pro-blur flx" style={{ top: -7, width: '105%', left: -17 }}>
              <div className="pro">
                {__('Available On')}
                <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                  <span className="txt-pro">
                    &nbsp;
                    {__('Premium')}
                  </span>
                </a>
              </div>
            </div>
          )} */}
        <EditOptions
          optionMdl={optionMdl}
          options={options}
          setOptions={newOpts => handleOptions(newOpts)}
          lblKey="lbl"
          valKey="val"
          type="radio"
          hasGroup
          customType={fieldData.customType}
          setCustomType={handleCustomType}
        />
        {/* </div> */}
      </Modal>
    </>
  )
}
