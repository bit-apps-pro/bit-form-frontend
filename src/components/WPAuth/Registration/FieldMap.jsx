import { useSetAtom } from 'jotai'
import { $updateBtn } from '../../../GlobalStates/GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { fileUpOrMappableImageFieldTypes } from '../../../Utils/StaticData/allStaticArrays'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from './UserHelperFunction'

export default function FieldMap({
  i, type, formFields, field, userConf, setUserConf, customFields, setSnackbar, fieldType, authType,
}) {
  const setUpdateBtn = useSetAtom($updateBtn)
  const fldType = {
    user: {
      propName: 'user_map',
      fldName: 'userField',
    },
    meta: {
      propName: 'meta_map',
      fldName: 'metaField',
    },
  }
  const { propName, fldName } = fldType[type]

  const handleCustomValue = (event, indx) => {
    const newConf = deepCopy(userConf)
    newConf[authType][propName][indx].customValue = event.target.value
    setUserConf(newConf)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }
  const isRequired = !!customFields.find(fl => fl.key === field[fldName] && fl.required)

  return (
    <div className="flx mt-2 mr-1">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(authType, propName, ev, i, userConf, setUserConf, formFields, setSnackbar)}>
          <option value="">{__('Select Field')}</option>
          {
            fieldType === 'file'
              ? formFields.map(f => fileUpOrMappableImageFieldTypes.includes(f.type) && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
              : formFields?.map(f => !fileUpOrMappableImageFieldTypes.includes(f.type) && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
          }
          {fieldType !== 'file' && <option value="custom">{__('Custom...')}</option>}
        </select>
        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value')} />}

        {
          type !== 'meta' ? (
            <select className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(authType, propName, ev, i, userConf, setUserConf, formFields, setSnackbar)} disabled={isRequired}>
              <option>{__('Select Field')}</option>
              {
                customFields?.map(header => (
                  <option key={`${header.key}-1`} value={header.key}>
                    {`${header.name}`}
                  </option>
                ))
              }
            </select>
          ) : (
            <input className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(authType, propName, ev, i, userConf, setUserConf, formFields, setSnackbar)} type="text" />
          )
        }

      </div>

      {!isRequired
        && (
          <>
            <button
              onClick={() => addFieldMap(authType, propName, i, userConf, setUserConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(authType, propName, i, userConf, setUserConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )}

    </div>
  )
}
