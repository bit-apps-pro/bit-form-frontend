import { useAtomValue } from 'jotai'
import { $bits } from '../../../GlobalStates/GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from './MetaboxHelperFunction'
import BitformFieldMapping from '../IntegrationHelpers/BitformFieldMapping'
import { fileUpOrMappableImageFieldTypes } from '../../../Utils/StaticData/allStaticArrays'

export default function FieldMap({
  i, type, formFields, field, dataConf, setDataConf, customFields, fieldType,
}) {
  const bits = useAtomValue($bits)
  const { isPro } = bits

  const fldType = {
    metabox: {
      propName: 'metabox_map',
      fldName: 'metaboxField',
    },
    post: {
      propName: 'post_map',
      fldName: 'postField',
    },
    metaboxFile: {
      propName: 'metabox_file_map',
      fldName: 'metaboxFileUpload',
    },
  }

  const { propName, fldName } = fldType[type]

  const handleCustomValue = (event, indx) => {
    const newConf = { ...dataConf }
    newConf[propName][indx].customValue = event.target.value
    setDataConf(newConf)
  }

  const isRequired = !!customFields.find(fl => fl.key === field[fldName] && fl.required)

  const uploadField = ['file-up', 'advanced-file-up']

  return (
    <div className="flx mt-2 mr-1">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, dataConf, setDataConf)}>
          <option value="">{__('Select Field')}</option>
          {type !== 'metaboxFile' ? (
            <>
              {/* {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)} */}
              <BitformFieldMapping formFields={formFields} notAllowFieldType={['file-up']} />
              <option value="custom">{__('Custom...')}</option>
            </>
          ) : (
            <optgroup label="Form Fields">
              {formFields.map(f => fileUpOrMappableImageFieldTypes.includes(f.type) && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)}
            </optgroup>
          )}

          {fieldType !== 'file'
            && (
              <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                {isPro && SmartTagField?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            )}

        </select>
        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value')} />}
        <select className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, dataConf, setDataConf)} disabled={isRequired}>
          <option value="">{__('Select Field')}</option>
          {
            customFields?.map(header => (
              <option key={`${header.name}-1`} value={header.key}>
                {`${header.name}`}
              </option>
            ))
          }
        </select>

      </div>

      {!isRequired
        && (
          <>
            <button
              onClick={() => addFieldMap(propName, i, dataConf, setDataConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(propName, i, dataConf, setDataConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn size="15" />
            </button>
          </>
        )}

    </div>
  )
}
