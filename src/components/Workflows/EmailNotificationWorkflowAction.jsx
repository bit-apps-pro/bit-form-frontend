import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $bits, $fieldsArr, $mailTemplates, $pdfTemplates, $updateBtn, $workflows } from '../../GlobalStates/GlobalStates'
import { fileUpOrMappableImageFieldTypes } from '../../Utils/StaticData/allStaticArrays'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import DropDown from '../Utilities/DropDown'
import TableCheckBox from '../Utilities/TableCheckBox'

export default function EmailNotificationWorkflowAction({
  lgcGrpInd,
  condGrpInd,
  actionKey,
  enableAction,
  checkKeyInArr,
  getValueFromArr,
  title,
}) {
  const { css } = useFela()
  const [workflows, setWorkflows] = useAtom($workflows)
  const mailTem = useAtomValue($mailTemplates)
  const pdfTem = useAtomValue($pdfTemplates)
  const fieldsArr = useAtomValue($fieldsArr)
  const setUpdateBtn = useSetAtom($updateBtn)
  const bits = useAtomValue($bits)
  const fileInFormField = () => {
    const file = []
    fieldsArr.map(field => {
      if (fileUpOrMappableImageFieldTypes.includes(field.type)) {
        file.push({ label: field.name, value: field.key })
      }
    })
    return file
  }

  const emailInFormField = () => fieldsArr.filter(field => field.type === 'email').length > 0

  const mailOptions = () => {
    const mail = []
    if (emailInFormField()) {
      const flds = []

      fieldsArr.map(fld => {
        if (fld.type === 'email') {
          flds.push({ label: fld.name, value: `\${${fld.key}}` })
        }
      })
      mail.push({ title: 'Form Fields', type: 'group', childs: flds })
    }

    if (bits.userMail && Array.isArray(bits.userMail)) {
      mail.push({ title: 'WP Emails', type: 'group', childs: bits.userMail })
    }
    return mail
  }

  const setEmailSetting = (typ, value) => {
    const tmpWorkflows = create(workflows, draftWorkflow => {
      const { success: draftSuccessActions } = draftWorkflow[lgcGrpInd].conditions[condGrpInd].actions
      const findEmailActions = draftSuccessActions.find(val => val.type === actionKey)
      if (findEmailActions) findEmailActions.details[typ] = value
    })
    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  return (
    <div className={css(ut.mt2)}>
      <TableCheckBox
        onChange={e => enableAction(e.target.checked, actionKey)}
        title={title}
        checked={checkKeyInArr(actionKey)}
        className={css(ut.flxc)}
      />
      {checkKeyInArr(actionKey) && (
        <div className={css({ mt: 5, ml: 28 })}>
          <label className="f-m f-5">
            {__('Email Template:')}
          </label>
          <div className="mt-1" />
          <select
            className="btcd-paper-inp w-7"
            onChange={e => setEmailSetting('id', e.target.value)}
            value={getValueFromArr(actionKey, 'id')}
          >
            <option value="">{__('Select Email Template')}</option>
            {mailTem?.map((itm, i) => (
              <option
                key={`sem-${i + 2.3}`}
                value={itm.id ? JSON.stringify({ id: String(itm.id) }) : JSON.stringify({ index: String(i) })}
              >
                {itm.title}
              </option>
            ))}
          </select>
          <DropDown
            action={val => setEmailSetting('to', val ? val.split(',') : [])}
            value={getValueFromArr(actionKey, 'to')}
            placeholder={__('Add Email Receiver')}
            title={<span className="f-m f-5">{__('To')}</span>}
            isMultiple
            titleClassName="w-7 mt-2"
            className="w-10 mt-1"
            addable
            options={mailOptions(getValueFromArr(actionKey, 'to'))}
          />
          <DropDown
            action={val => setEmailSetting('from', val)}
            placeholder={__('Add mail from address')}
            value={getValueFromArr(actionKey, 'from')}
            title={<span className="f-m f-5">{__('From Mail')}</span>}
            titleClassName="w-7 mt-2"
            className="w-10 mt-1"
            addable
            options={mailOptions(getValueFromArr(actionKey, 'from'))}
            tip={__('Some servers block emails if "From Email" differs from the authenticated (login) email— use the same email to ensure delivery.')}
          />
          <div className="mt-1" />
          <div>
            <label htmlFor="from_name" className="f-m f-5">
              {__('From Name')}
            </label>
            <div className="mt-2" />
            <input
              id="from_name"
              type="text"
              className="btcd-paper-inp"
              style={{ height: '35px', width: '69%', background: 'var(--b-79-96)' }}
              value={getValueFromArr(actionKey, 'from_name')}
              onChange={e => setEmailSetting('from_name', e.target.value)}
              placeholder="Add mail from name"
            />
          </div>
          <DropDown
            action={val => setEmailSetting('cc', val ? val.split(',') : [])}
            value={getValueFromArr(actionKey, 'cc')}
            placeholder={__('Add Email CC')}
            title={<span className="f-m f-5">{__('CC')}</span>}
            isMultiple
            titleClassName="w-7 mt-2"
            className="w-10 mt-1"
            addable
            options={mailOptions(getValueFromArr(actionKey, 'cc'))}
          />
          <DropDown
            action={val => setEmailSetting('bcc', val ? val.split(',') : [])}
            placeholder={__('Add Email BCC')}
            value={getValueFromArr(actionKey, 'bcc')}
            title={<span className="f-m f-5">{__('BCC')}</span>}
            isMultiple
            titleClassName="w-7 mt-2"
            className="w-10 mt-1"
            addable
            options={mailOptions(getValueFromArr(actionKey, 'bcc'))}
          />
          <DropDown
            action={val => setEmailSetting('replyto', val ? val.split(',') : [])}
            placeholder={__('Reply To')}
            value={getValueFromArr(actionKey, 'replyto')}
            title={<span className="f-m f-5">{__('Reply To')}</span>}
            isMultiple
            titleClassName="w-7 mt-2"
            className="w-10 mt-1"
            addable
            options={mailOptions(getValueFromArr(actionKey, 'replyto'))}
          />
          <DropDown
            action={val => setEmailSetting('attachment', val ? val.split(',') : [])}
            placeholder={__('Attachment')}
            value={getValueFromArr(actionKey, 'attachment')}
            title={<span className="f-m f-5">{__('Attachment')}</span>}
            isMultiple
            titleClassName="w-7 mt-2"
            className="w-10 mt-1"
            options={fileInFormField()}
          />
          <div className="mt-2">
            <label htmlFor="pdf-template" className="f-m f-5">
              {__('PDF Attachment Template:')}
            </label>
            <div className="mt-1" />
            <select
              className="btcd-paper-inp w-7"
              onChange={e => setEmailSetting('pdfId', e.target.value)}
              value={getValueFromArr(actionKey, 'pdfId')}
            >
              <option value="">{__('Select PDF Template')}</option>
              {pdfTem?.map((itm, i) => (
                <option
                  key={`sem-${i + 2.3}`}
                  value={itm.id ? JSON.stringify({ id: String(itm.id) }) : JSON.stringify({ index: String(i) })}
                >
                  {itm.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
