/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import { IS_PRO } from '../../../Utils/Helpers'
import { userFields } from '../../../Utils/StaticData/userField'
import { __ } from '../../../Utils/i18nwrap'
import useSWROnce from '../../../hooks/useSWROnce'
import SnackMsg from '../../Utilities/SnackMsg'
import UserFieldMap from './UserFieldMap'
import UserMetaField from './UserMetaField'

export default function Registration({ formFields, dataConf, setDataConf, pages, type, status }) {
  const { formID } = useParams()
  const [snack, setSnackbar] = useState({ show: false })
  const [roles, setRoles] = useState([])

  useSWROnce('bitforms_get_wp_roles', {}, { fetchCondition: IS_PRO, onSuccess: data => setRoles(Object.values(data)) })

  useEffect(() => {
    setDataConf(tmpConf => create(tmpConf, draft => {
      if (!draft[type]?.user_map?.[0]?.userField) {
        draft[type].user_map = userFields.filter(fld => fld.required).map(fl => ({ formField: '', userField: fl.key, required: fl.required }))
      }
    }))
  }, [])

  return (
    <div style={{ width: 900, opacity: status === 0 && 0.6, pointerEvents: status === 0 && 'none' }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div>
        <UserFieldMap
          formFields={formFields}
          formID={formID}
          userConf={dataConf}
          setUserConf={setDataConf}
          pages={pages}
          roles={roles}
          type={type}
        />
      </div>
      <div>
        <UserMetaField
          formFields={formFields}
          formID={formID}
          userConf={dataConf}
          setUserConf={setDataConf}
          type={type}
        />
        <br />
      </div>
      <p className="p-1 f-m">
        <strong>{__('Note:')}</strong>
        {' '}
        {__('If the Username and Password fields are blank then the user will take the value of the email field as the field and the password will be auto-generated.')}
      </p>

    </div>
  )
}
