import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import ErrorMessageSettings from '../../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function InputAmountRangeSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const globalErrMsg = globalMessages?.err || {}
  const { minValue, maxValue } = fieldData.config

  const handleConfigChange = (val: string, name: string) => {
    fieldData.config[name] = val

    if (name === 'minValue') {
      fieldData.err.minValue.dflt = globalErrMsg?.[fieldData.typ]?.minValue
        || globalErrMsg?.minValue
        || `Invalid amount. The minimum amount allowed is ${val}.`
    } else if (name === 'maxValue') {
      fieldData.err.maxValue.dflt = globalErrMsg?.[fieldData.typ]?.maxValue
        || globalErrMsg?.maxValue
        || `Invalid amount. The maximum amount allowed is ${val}.`
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propNameLabel[name]} '${val}': ${fieldData.lbl || fldKey}`,
      type: `${name}_changed`,
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="nmbr-stng"
      title="Input Amount Range(Min/Max):"
      className={css(FieldStyle.fieldSection)}
      isPro
      proProperty="minMaxValue"
    >
      <div className={css({ mx: 5 })}>
        {/* Minimum Amount */}
        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Minimum amount:')}</span>
          <input
            data-testid="nmbr-stng-min-inp"
            title="Minimum amount for this field"
            aria-label="Minimum amount for this field"
            placeholder="Type minimum amount here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type="number"
            value={minValue || ''}
            onChange={e => handleConfigChange(e.target.value, 'minValue')}
          />
        </div>

        {minValue && (
          <ErrorMessageSettings
            id="nmbr-stng-min"
            type="minValue"
            title="Minimum amount Error Message"
            tipTitle={`By enabling this feature, user will see the error message when input amount is less than ${minValue}`}
          />
        )}

        {/* Maximum Amount */}
        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Maximum amount:')}</span>
          <input
            data-testid="nmbr-stng-max-inp"
            title="Maximum amount for this field"
            aria-label="Maximum amount for this field"
            placeholder="Type maximum amount here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type="number"
            value={maxValue || ''}
            onChange={e => handleConfigChange(e.target.value, 'maxValue')}
          />
        </div>

        {maxValue && (
          <ErrorMessageSettings
            id="nmbr-stng-max"
            type="maxValue"
            title="Max Error Message"
            tipTitle={`By enabling this feature, user will see the error message when input amount is greater than ${maxValue}`}
          />
        )}
      </div>
    </SimpleAccordion>
  )
}

const propNameLabel: Record<string, string> = {
  minValue: 'Minimum Amount Changed to',
  maxValue: 'Maximum Amount Changed to',
}