/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import EditIcn from '../../Icons/EditIcn'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { isDev } from '../../Utils/config'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import ErrorMessages from '../../styles/ErrorMessages.style'
import FieldStyle from '../../styles/FieldStyle.style'
import Cooltip from '../Utilities/Cooltip'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import DecisionBoxLabelModal from './CompSettingsUtils/DecisionBoxLabelModal'
import FieldDisabledSettings from './CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import RequiredSettings from './CompSettingsUtils/RequiredSettings'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

export default function GDPRAgreementSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [labelModal, setLabelModal] = useState(false)
  const { css } = useFela()

  function setChecked(e) {
    const { checked } = e.target
    if (checked) {
      const tmp = { ...fieldData.valid }
      tmp.checked = true
      fieldData.valid = tmp
    } else {
      delete fieldData.valid.checked
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Check by default ${checked ? 'on' : 'off'} : ${fieldData.adminLbl || fldKey}`, type: 'set_check_by_default', state: { fields: allFields, fldKey } })
  }

  const setValue = (val, typ) => {
    fieldData.msg[typ] = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${typ[0].toUpperCase() + typ.slice(1)} Value Modified to "${val}"`, type: `${typ}_value_modify`, state: { fields: allFields, fldKey } })
  }

  if (isDev) {
    window.selectedFieldData = fieldData
  }

  return (
    <div>
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      <div className={css(FieldStyle.fieldSection)}>
        <div className={`flx flx-between ${FieldStyle.hover_tip}`}>
          <div className="flx">
            <b>Label </b>
            <Cooltip
              width={250}
              icnSize={17}
              className="hover-tip"
            >
              <div className="txt-body">
                {__('Edit GDPR Concent label by clicking on edit icon')}
              </div>
            </Cooltip>
          </div>
          <span
            data-testid="lbl-edt-btn"
            role="button"
            tabIndex="-1"
            className="mr-2 cp"
            onClick={() => setLabelModal(true)}
            onKeyDown={() => setLabelModal(true)}
          >
            <EditIcn size={19} />
          </span>
        </div>
        <div
          className={`${css(ErrorMessages.errMsgBox)} ${css(ut.mt2)}`}
          tabIndex="0"
          role="button"
          onClick={() => setLabelModal(true)}
          onKeyDown={() => setLabelModal(true)}
        >
          <p className={css(ut.m0)}>Click to edit GDPR Concent Label</p>
        </div>
      </div>

      <FieldSettingsDivider />

      <DecisionBoxLabelModal
        labelModal={labelModal}
        setLabelModal={setLabelModal}
        title={__('Edit GDPR Concent Label')}
      />

      <AdminLabelSettings />

      <FieldSettingsDivider />

      <SizeAndPosition />

      <FieldSettingsDivider />

      <RequiredSettings asteriskIsAllow={false} />

      <FieldSettingsDivider />

      <FieldDisabledSettings />

      <FieldSettingsDivider />

      <FieldHideSettings />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="chek-val-stng"
        title={__('Checked Value')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="chek-val-inp"
            aria-label="Checked value"
            className={css(FieldStyle.input)}
            type="text"
            value={fieldData.msg.checked || ''}
            onChange={e => setValue(e.target.value, 'checked')}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="unchek-val-stng"
        title={__('Unchecked Value')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="unchek-val-inp"
            aria-label="Uncheked value"
            className={css(FieldStyle.input)}
            type="text"
            value={fieldData.msg.unchecked || ''}
            onChange={e => setValue(e.target.value, 'unchecked')}
          />
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      {/* <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '36px !important' })}>
        <SingleToggle
          id="chek-by-dflt"
          tip="By disabling this option, the field checked by default will be hidden"
          title={__('Checked by Default')}
          action={setChecked}
          isChecked={fieldData.valid.checked}
        />
      </div>
      <FieldSettingsDivider /> */}
    </div>
  )
}
