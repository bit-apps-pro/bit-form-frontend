/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addFormUpdateError, addToBuilderHistory, removeFormUpdateError } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import CheckBox from '../../../../Utilities/CheckBox'
import SingleInput from '../../../../Utilities/SingleInput'

export default function ReceiverEmailSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const config = fieldData?.config || {}
  const isStatic = config.receiverEmailType === 'static'
  const fieldLabel = fieldData?.lbl ?? fldKey

  const getEmailFields = () => {
    const formFields = Object.entries(fields)
    const filteredFields = formFields.filter(([, fld]) => fld.typ === 'email')
    return filteredFields.map(([key, fld]) => (
      <option key={key} value={key}>
        {fld.adminLbl || fld.lbl || key}
      </option>
    ))
  }

  const setEmailType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const updatedFields = create(fields, draft => {
      draft[fldKey].config = draft[fldKey].config || {}
      draft[fldKey].config.receiverEmailType = value || 'dynamic'
      delete draft[fldKey].config.receiverEmail
      delete draft[fldKey].config.receiverEmailFld
    })
    setFields(updatedFields)
    addToBuilderHistory({
      event: `Receiver Email Type changed to "${value}": ${fieldLabel}`,
      type: 'otp_receiver_email_type_changed',
      state: { fields: updatedFields, fldKey },
    })
  }

  const handleInput = (name: string, value: string) => {
    const updatedFields = create(fields, draft => {
      draft[fldKey].config = draft[fldKey].config || {}
      draft[fldKey].config[name] = value
    })
    setFields(updatedFields)

    if (name === 'receiverEmailFld' || name === 'receiverEmail') {
      if (value) {
        removeFormUpdateError(fldKey, 'emailOtpReciverEmailMissing')
      } else {
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'emailOtpReciverEmailMissing',
          errorMsg: __('Email OTP Receiver Email is missing'),
          errorUrl: `field-settings/${fldKey}`,
        })
      }
    }
    addToBuilderHistory({
      event: `OTP ${name} changed: ${fieldLabel}`,
      type: `otp_${name}_changed`,
      state: { fields: updatedFields, fldKey },
    })
  }

  return (
    <>
      <SimpleAccordion
        id="rcvr-eml-stng"
        title={__('Receiver Email')}
        className={css([FieldStyle.fieldSection, FieldStyle.hover_tip])}
        tip={__('The email address where the OTP will be sent. Choose "Dynamic" to use an Email field from your form, or "Static" to enter a fixed address.')}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <div className={css(FieldStyle.flxCenter)}>
            <CheckBox
              id="rcvr-eml-dynamic"
              onChange={setEmailType}
              radio
              checked={!isStatic}
              title={__('Dynamic (Email Field)')}
              value="dynamic"
              className={css({ fs: 'var(--bf-font-small)', pl: 0 })}
            />
            <CheckBox
              id="rcvr-eml-static"
              onChange={setEmailType}
              radio
              checked={isStatic}
              title={__('Static (Fixed Email)')}
              value="static"
              className={css({ fs: 'var(--bf-font-small)' })}
            />
          </div>

          {/* <FieldSettingsDivider /> */}

          {isStatic ? (
            <SingleInput
              id="rcvr-eml-inp"
              inpType="email"
              title={__('Email Address')}
              className={css([ut.mt1, {cr: 'var(--bf-text-clr-dark)' }])}
              cls={css([FieldStyle.input, ut.mt1])}
              value={config.receiverEmail || ''}
              action={e => handleInput('receiverEmail', (e.target as HTMLInputElement).value)}
              placeholder={__('Enter a email here..')}
            />
          ) : (
            <label htmlFor="rcvr-eml-fld">
              <span className={css([ut.inputLabel, ut.ml1])}>{__('Select Email Field')}</span>
              <select
                id="rcvr-eml-fld"
                className={css([FieldStyle.input, ut.mt1])}
                value={config.receiverEmailFld || ''}
                onChange={e => handleInput('receiverEmailFld', e.target.value)}
              >
                <option value="">{__('-- Select Email Field --')}</option>
                {getEmailFields()}
              </select>
            </label>
          )}
        </div>
      </SimpleAccordion >
      {/* <FieldSettingsDivider /> */}
    </>
  )
}
