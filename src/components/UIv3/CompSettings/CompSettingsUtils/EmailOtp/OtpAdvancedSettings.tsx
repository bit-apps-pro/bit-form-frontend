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
import SingleToggle from '../../../../Utilities/SingleToggle'

export default function OtpAdvancedSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const config = fieldData?.config || {}
  const fieldLabel = fieldData?.lbl ?? fldKey

  const handleConfig = (name: string, value: number | boolean | string) => {
    const updatedFields = create(fields, draft => {
      draft[fldKey].config = draft[fldKey].config || {}
      draft[fldKey].config[name] = value
    })
    setFields(updatedFields)
    addToBuilderHistory({
      event: `OTP ${name} changed to ${String(value)}: ${fieldLabel}`,
      type: `otp_${name}_changed`,
      state: { fields: updatedFields, fldKey },
    })
  }

  return (
    <>
      {/* ── Button Texts ────────────────────────────────────────────────── */}
      <SimpleAccordion
        id="otp-btn-texts-stng"
        title={__('Button Texts')}
        className={css([FieldStyle.fieldSection, FieldStyle.hover_tip])}
        tip={__('Customize the label text shown on the Send, Resend, and Verify buttons.')}
        open
      >
        <div className={css([FieldStyle.placeholder, ut.pt1])}>
          <label htmlFor="send-btn-txt">
            <span className={css(ut.inputLabel)}>{__('Send OTP')}</span>
            <input
              id="send-btn-txt"
              type="text"
              className={css([FieldStyle.input, ut.mt1, ut.mb3])}
              value={config.sendBtnTxt || ''}
              onChange={e => handleConfig('sendBtnTxt', (e.target as HTMLInputElement).value)}
            />
          </label>
          <label htmlFor="resend-btn-txt">
            <span className={css(ut.inputLabel)}>{__('Resend OTP')}</span>
            <input
              id="resend-btn-txt"
              type="text"
              className={css([FieldStyle.input, ut.mt1, ut.mb3])}
              value={config.resendBtnTxt || ''}
              onChange={e => handleConfig('resendBtnTxt', (e.target as HTMLInputElement).value)}
            />
          </label>
          <label htmlFor="verify-btn-txt">
            <span className={css(ut.inputLabel)}  >{__('Verify OTP')}</span>
            <input
              id="verify-btn-txt"
              type="text"
              className={css([FieldStyle.input, ut.mt1, ut.mb3])}
              value={config.verifyBtnTxt || ''}
              onChange={e => handleConfig('verifyBtnTxt', (e.target as HTMLInputElement).value)}
            />
          </label>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* ── Resend OTP Countdown Text ────────────────────────────────────── */}
      <SimpleAccordion
        id="otp-wait-txt-stng"
        title={__('Resend OTP Countdown Text')}
        className={css([FieldStyle.fieldSection, FieldStyle.hover_tip])}
        tip={__('Text shown while the user waits to resend. Use ${bf_resend_countdown} as a placeholder for the live countdown number.')}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            id="wait-txt"
            type="text"
            className={css(FieldStyle.input)}
            value={config.waitTxt || ''}
            onChange={e => handleConfig('waitTxt', (e.target as HTMLInputElement).value)}
          />
          <p className={css(ut.helpText)}>
            {__('Use ${bf_resend_countdown} as placeholder for the resend countdown number.')}
          </p>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* ── Max Attempts ─────────────────────────────────────────────────── */}
      <SimpleAccordion
        id="otp-max-attempts-stng"
        title={__('Maximum OTP Verification Attempts')}
        className={css([FieldStyle.fieldSection, FieldStyle.hover_tip])}
        open
        tip={__('Limits the number of OTP verification attempts on the frontend. Once the maximum limit is reached, the field will be locked until the page is reloaded.')}
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            id="max-attempts"
            type="number"
            className={css([FieldStyle.input, FieldStyle.hover_tip])}
            value={config.maxAttempts ?? 5}
            onChange={e => handleConfig('maxAttempts', Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 5))}
          />
          <p className={css(ut.helpText)}>
            {__('Limits the number of OTP verification attempts on the frontend. Once the maximum limit is reached, the field will be locked until the page is reloaded.')}
          </p>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* ── OTP Expiry ───────────────────────────────────────────────────── */}
      <SimpleAccordion
        id="otp-expiry-stng"
        title={__('OTP Expiration Time (Minutes)')}
        className={css([FieldStyle.fieldSection, FieldStyle.hover_tip])}
        tip={__('How long the OTP remains valid in minutes. The expiration is verified on the server during form submission.')}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            id="expiry-delay"
            type="number"
            className={css(FieldStyle.input)}
            value={config.expiryDelay ?? 15}
            onChange={e => handleConfig('expiryDelay', Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 15))}
          />
          <p className={css(ut.helpText)}>
            {__('Defines how long the OTP remains valid. The expiration is verified on the server during form submission.')}
          </p>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* ── Send OTP on Validate ─────────────────────────────────────────── */}
      <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}>
        <SingleToggle
          id="otp-send-on-validate-stng"
          tip={__('When enabled, the OTP will be automatically sent if the user attempts to submit the form or move to the next step without clicking "Send OTP" first.')}
          title={__('Automatically Send OTP on Validation')}
          action={() => handleConfig('sendOnValidate', config.sendOnValidate ? false : true)}
          isChecked={config.sendOnValidate}
          isPro
          proProperty="sendOnValidate"
        />
      </div>

      <FieldSettingsDivider />

      {/* ── Auto Verify on Input ─────────────────────────────────────────── */}
      <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}>
        <SingleToggle
          id="otp-auto-verify-on-input-stng"
          tip={__('When enabled, OTP verification is triggered automatically once the user has entered all digits (via typing, pasting, or autofill).')}
          title={__('Automatically Verify OTP on Input')}
          action={() => handleConfig('autoVerifyOnInput', !config.autoVerifyOnInput)}
          isChecked={config.autoVerifyOnInput}
        />
      </div>

    </>
  )
}
