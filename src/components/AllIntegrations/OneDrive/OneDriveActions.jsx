/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { fileUpOrMappableImageFieldTypes } from '../../../Utils/StaticData/allStaticArrays'

export default function OneDriveActions({ oneDriveConf, setOneDriveConf, formFields, formID, setSnackbar }) {
  const folder = oneDriveConf.folderMap ? oneDriveConf.folderMap[0] : oneDriveConf.folder
  const [isLoading, setisLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (val, typ, share) => {
    const newConf = { ...oneDriveConf }
    if (typ === 'create_folder') {
      if (val.target.checked) {
        newConf.actions.create_folder = { name: '', suffix: false }
      } else {
        delete newConf.actions.create_folder
        delete newConf.actions.share.folder
      }
    } else if (typ === 'attachments') {
      if (val !== '') {
        newConf.actions.attachments = val
      } else {
        delete newConf.actions.attachments
        delete newConf.actions.share.file
      }
    }

    setOneDriveConf({ ...newConf })
  }

  const openUploadFileMdl = () => {
    if (!oneDriveConf.actions?.share) oneDriveConf.actions.share = {}

    if (!oneDriveConf.actions?.share?.file) {
      oneDriveConf.actions.share.file = {
        permissions: [
          { email: '', access: '34', accessLabel: 'View' },
          { email: '', access: '5', accessLabel: 'Edit' },
          { email: '', access: '4', accessLabel: 'Share' },
          { email: '', access: '6', accessLabel: 'View and Comment' },
        ],
        mail: 'false',
      }
    }

    setActionMdl({ show: 'attachments' })
  }
  const actionDeleteHandler = (e, type) => {
    const newConf = { ...oneDriveConf }
    if (type === 'deleteFile') {
      if (e.target.checked) {
        newConf.actions.delete_from_wp = true
      } else {
        delete newConf.actions.delete_from_wp
      }
    }
    setOneDriveConf({ ...newConf })
  }

  const getFileUpFields = () => formFields.filter(itm => (fileUpOrMappableImageFieldTypes.includes(itm.type))).map(itm => ({ label: itm.lbl, value: itm.key }))

  return (
    <div className="pos-rel d-flx w-5">
      <div className="pos-rel d-flx flx-col w-8">
        <TableCheckBox
          onChange={openUploadFileMdl}
          checked={'attachments' in oneDriveConf.actions}
          className="wdt-200 mt-4 mr-2"
          value="Attachment"
          title={__('Upload Files', 'bit-integration-pro')}
          subTitle={__('Add attachments from Bit-integration-pro to OneDrive folder.', 'bit-integration-pro')}
        />
        {!oneDriveConf.actions.attachments
          && (
            <small
              style={{ marginLeft: 30, marginTop: 10, color: 'red', fontWeight: 'bold' }}
            >
              {__('This action is required.')}
            </small>
          )}
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
        <div style={{ height: '95%' }}>
          <div className="mt-2">{__('Select file upload fields')}</div>
          <MultiSelect
            defaultValue={oneDriveConf.actions.attachments}
            className="mt-2 w-10 mb-25"
            options={getFileUpFields()}
            onChange={(val) => actionHandler(val, 'attachments')}
            height={300}
          />
        </div>
      </ConfirmModal>

      <div className="pos-rel d-flx flx-col w-8">
        <TableCheckBox
          checked={oneDriveConf.actions?.delete_from_wp || false}
          onChange={(e) => actionDeleteHandler(e, 'deleteFile')}
          className="mt-4 mr-2"
          value="delete_from_wp"
          title={__('Delete File From Wordpress')}
          subTitle={__('Delete file from Wordpress after upload in OneDrive')}
        />
      </div>
    </div>
  )
}
