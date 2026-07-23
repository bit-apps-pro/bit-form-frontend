/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import EditIcn from '../../../../../Icons/EditIcn'
import ut from '../../../../../styles/2.utilities'
import app from '../../../../../styles/app.style'
import sc from '../../../../../styles/commonStyleEditorStyle'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import { truncatedString } from '../../../../style-new/styleHelpers'
import Modal from '../../../../Utilities/Modal'
import RenderHtml from '../../../../Utilities/RenderHtml'
import TinyMCE from '../../../../Utilities/TinyMCE'

export default function OtpEmailTemplateSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [showModal, setShowModal] = useState(false)
  const originalTemplateRef = useRef<string>('')

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const config = fieldData?.config || {}
  const template = config.emailTemplate || ''

  const setTemplate = (val: string) => {
    const updatedFields = create(fields, draft => {
      draft[fldKey].config = draft[fldKey].config || {}
      draft[fldKey].config.emailTemplate = val
    })
    setFields(updatedFields)
    addToBuilderHistory({
      event: `OTP Email Template changed: ${fldKey}`,
      type: 'otp_email_template_changed',
      state: { fields: updatedFields, fldKey },
    })
  }

  const openModal = () => {
    originalTemplateRef.current = fields[fldKey]?.config?.emailTemplate || ''
    setShowModal(true)
  }

  const cancelModal = () => {
    setTemplate(originalTemplateRef.current)
    setShowModal(false)
  }

  return (
    <>
      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(ut.flxcb)}>
          <span className={`title ${css(ut.flxc)}`}>
            {__('Email Template')}
          </span>
          <span
            role="button"
            tabIndex={-1}
            className={css(ut.mr2, ut.cp)}
            onClick={openModal}
            onKeyDown={openModal}
          >
            <EditIcn size={19} />
          </span>
        </div>
        <div
          role="button"
          tabIndex={-1}
          className={`${css(
            FieldStyle.input,
            ut.px10,
            ut.py5,
            sc.childPmargin0,
            { h: 'auto', fs: '12px !important' },
          )} body`}
          onClick={openModal}
          onKeyDown={openModal}
        >
          <RenderHtml html={truncatedString(template)} />
        </div>
        <p className={css(ut.helpText)}>
          {__('Available placeholders: ${bf_otp_code}, ${bf_expiry_minutes}')}
        </p>
        <p className={css(ut.helpText)}>
          {__('Note: To send OTP emails, SMTP must be configured on your site. You can set it up in Bit Form ')}
          <strong>App Settings &gt; SMTP </strong> 
          {__('section.')}
        </p>
      </div>

      <Modal
        md
        show={showModal}
        setModal={cancelModal}
        title={__('Edit OTP Email Template')}
      >
        <TinyMCE
          id={`otp-tmpl-${fldKey}`}
          value={fields[fldKey]?.config?.emailTemplate || ''}
          onChangeHandler={setTemplate}
        />
        <p className={css({ fs: '12px', c: '#888', mt: 5 })}>
          {__('Placeholders: ${bf_otp_code} — the OTP code, ${bf_expiry_minutes} — expiry time in minutes')}
        </p>
        <div className="mt-2 f-right">
          <button type="button" className={`${css(app.btn)} mr-2`} onClick={cancelModal}>{__('Cancel')}</button>
          <button type="button" className={`${css(app.btn)} blue`} onClick={() => setShowModal(false)}>{__('Save')}</button>
        </div>
      </Modal>
    </>
  )
}
