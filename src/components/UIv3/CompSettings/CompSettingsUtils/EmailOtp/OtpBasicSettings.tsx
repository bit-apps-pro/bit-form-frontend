/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function OtpBasicSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const config = fieldData?.config || {}
  const fieldLabel = fieldData?.lbl ?? fldKey

  const handleConfig = (name: string, value: string | number) => {
    const updatedFields = create(fields, draft => {
      draft[fldKey].config = draft[fldKey].config || {}
      draft[fldKey].config[name] = value
    })
    setFields(updatedFields)
    addToBuilderHistory({
      event: `OTP ${name} changed to ${value}: ${fieldLabel}`,
      type: `otp_${name}_changed`,
      state: { fields: updatedFields, fldKey },
    })
  }

  return (
    <>
      <SimpleAccordion
        id="otp-digit-len-stng"
        title={__('OTP Code Length')}
        className={css([FieldStyle.fieldSection, FieldStyle.hover_tip])}
        tip={__('Set how many digits the OTP code will contain. Accepted range: 4 \u2013 8.')}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            id="otp-length"
            type="number"
            className={css(FieldStyle.input)}
            value={config.otpLength ?? 6}
            onChange={e => {
              const v = Math.min(8, Math.max(4, parseInt((e.target as HTMLInputElement).value, 10) || 6))
              handleConfig('otpLength', v)
            }}
          />
          <p className={css(ut.helpText)}>
            {__('Allowed range: 4 to 8 digits.')}
          </p>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="otp-resend-delay-stng"
        title={__('OTP Resend Delay (Seconds)')}
        className={css([FieldStyle.fieldSection, FieldStyle.hover_tip])}
        tip={__('Sets the waiting time (in seconds) before the "Resend OTP" button becomes active again.')}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            id="resend-delay"
            type="number"
            className={css(FieldStyle.input)}
            value={config.resendDelay ?? 60}
            onChange={e => handleConfig('resendDelay', parseInt((e.target as HTMLInputElement).value, 10) || 60)}
          />
        </div>
      </SimpleAccordion>
    </>
  )
}
