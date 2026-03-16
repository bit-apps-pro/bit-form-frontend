import { useAtomValue } from 'jotai'
import { $bits } from '../../../GlobalStates/GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { __ } from '../../../Utils/i18nwrap'
import BitformFieldMapping from '../IntegrationHelpers/BitformFieldMapping'
import { addFieldMap, delFieldMap, handleFieldMapping } from './PodHelperFunction'

export default function PodsFieldMap({
  i, type, formFields, field, dataConf, setDataConf, podFields,
}) {
  const fldType = {
    pod: {
      propName: 'pod_map',
      fldName: 'podFormField',
    },
    post: {
      propName: 'post_map',
      fldName: 'postFormField',
    },
  }

  const bits = useAtomValue($bits)
  const { isPro } = bits

  const { propName, fldName } = fldType[type]

  const isRequired = !!podFields.find(fl => fl.key === field[fldName] && fl.required)

  return (
    <div className="flx mt-2 mr-1">
      <div className="flx integ-fld-wrp">
        <select
          className="btcd-paper-inp mr-2"
          name="formField"
          value={field.formField || ''}
          onChange={(ev) => handleFieldMapping(propName, ev, i, dataConf, setDataConf)}
        >
          <option value="">{__('Select Field')}</option>

          <BitformFieldMapping
            formFields={formFields}
            notAllowFieldType={['repeater', 'section']}
          />

          <option value="custom">{__('Custom...')}</option>
          {/* <hr /> */}

          <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
            {isPro && SmartTagField?.map(f => (
              <option key={`ff-rm-${f.name}`} value={f.name}>
                {f.label}
              </option>
            ))}
          </optgroup>
        </select>

        <select
          className="btcd-paper-inp"
          name={fldName}
          value={field[fldName] || ''}
          onChange={(ev) => handleFieldMapping(propName, ev, i, dataConf, setDataConf)}
          disabled={isRequired}
        >
          <option value="">{__('Select Field')}</option>
          {
            podFields?.map(header => (
              <option key={`${header.key}-1`} value={header.key}>
                {`${header.name}`}
              </option>
            ))
          }
        </select>
      </div>

      {
        isRequired
          ? (
            <button
              onClick={() => addFieldMap(propName, i, dataConf, setDataConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
          )
          : (
            <>
              <button
                onClick={() => addFieldMap(propName, i, dataConf, setDataConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button
                onClick={() => delFieldMap(propName, i, dataConf, setDataConf)}
                className="icn-btn sh-sm ml-1"
                type="button"
                aria-label="btn"
              >
                <TrashIcn />
              </button>
            </>
          )
      }
    </div>
  )
}
