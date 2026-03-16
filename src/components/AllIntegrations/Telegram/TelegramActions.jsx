/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { allowUploadedFiletype } from './TelegramCommonFunc'

export default function TelegramActions({ formFields, telegramConf, setTelegramConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const attachments = typeof telegramConf.actions?.attachments === 'string' ? telegramConf.actions.attachments.split(',') : telegramConf.actions?.attachments

  const actionHandler = (val) => {
    const newConf = deepCopy(telegramConf)
    if (val !== '') {
      newConf.actions.attachments = val ? val.split(',') : []
    } else {
      delete newConf.actions.attachments
    }
    setTelegramConf({ ...newConf })
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <TableCheckBox
          onChange={() => setActionMdl({ show: 'attachments' })}
          checked={'attachments' in telegramConf.actions}
          className="wdt-400 mt-4 mr-2"
          value="Attachment"
          title={__('Attachments or Signature field')}
          subTitle={__('Add attachments or Signature field from BitForm to send Telegram.')}
        />
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={actionMdl.show === 'attachments'}
        close={() => setActionMdl({ show: false })}
        action={() => setActionMdl({ show: false })}
        title={__('Select Attachment')}
      >
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Please select file upload or signature field')}</div>
        <MultiSelect
          options={formFields.filter(itm => (allowUploadedFiletype.includes(itm.type))).map(itm => ({ label: itm.name, value: itm.key }))}
          className="btcd-paper-drpdwn w-10"
          defaultValue={attachments}
          onChange={val => actionHandler(val)}
        />
      </ConfirmModal>
    </div>
  )
}
