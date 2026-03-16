import { useAtomValue } from 'jotai'
import { $bits } from '../../../GlobalStates/GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { generateMappedField } from './ElasticEmailCommonFunc'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from './IntegrationHelpers'

export default function ElasticEmailFieldMap({ i, formFields, field, elasticEmailConf, setElasticEmailConf }) {
  if (elasticEmailConf?.field_map?.length === 1 && field.elasticEmailField === '') {
    const newConf = { ...elasticEmailConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setElasticEmailConf(newConf)
  }
  const requiredFlds = elasticEmailConf?.elasticEmailFields.filter(fld => fld.required === true) || []
  const nonRequiredFlds = elasticEmailConf?.elasticEmailFields.filter(fld => fld.required === false) || []

  const bits = useAtomValue($bits)
  const { isPro } = bits

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            defaultValue="0"
            onChange={(ev) => handleFieldMapping(ev, i, elasticEmailConf, setElasticEmailConf)}
          >
            <option selected value="0">{__('Select Field')}</option>
            <optgroup label="Form Fields">
              {
                formFields?.map(f => (
                  <option key={`ff-rm-${f.key}`} value={f.key}>
                    {f.name}
                  </option>
                ))
              }
            </optgroup>
            <option value="custom">{__('Custom...')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>

          </select>

          {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, elasticEmailConf, setElasticEmailConf)} label={__('Custom Value')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value')} />}

          <select
            className="btcd-paper-inp"
            disabled={i < requiredFlds.length}
            defaultValue="0"
            name="elasticEmailField"
            value={i < requiredFlds.length ? (requiredFlds[i].label || '') : (field.elasticEmailField || '')}
            onChange={(ev) => handleFieldMapping(ev, i, elasticEmailConf, setElasticEmailConf)}
          >
            <option selected value="0">{__('Select Field')}</option>
            {
              i < requiredFlds.length ? (
                <option key={requiredFlds[i].key} value={requiredFlds[i].key}>
                  {requiredFlds[i].label}
                </option>
              ) : (
                nonRequiredFlds.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
          </select>
        </div>
        {
          i >= requiredFlds.length && (
            <>
              <button
                onClick={() => addFieldMap(i, elasticEmailConf, setElasticEmailConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button
                onClick={() => delFieldMap(i, elasticEmailConf, setElasticEmailConf)}
                className="icn-btn sh-sm ml-1"
                type="button"
                aria-label="btn"
              >
                <span className="btcd-icn icn-trash-2" />
                <TrashIcn size="15" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
