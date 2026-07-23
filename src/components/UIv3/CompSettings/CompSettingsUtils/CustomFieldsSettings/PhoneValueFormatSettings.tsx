import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function PhoneValueFormatSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { valueFormat } = fieldData.config

  const handleConfigChange = (val: string) => {
    fieldData.config.valueFormat = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Value Format Changed to '${val}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'valueFormat_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="val-frmt-opt-stng"
      title={__('Value Format Option')}
      className={css(FieldStyle.fieldSection)}
      isPro
      proProperty="valueFormatOptions"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="val-frmt-opt-inp"
          aria-label="Value Format Option"
          placeholder="Value Format(Ex: +c #### ### ###)"
          className={css(FieldStyle.input)}
          type="text"
          value={valueFormat || ''}
          onChange={e => handleConfigChange(e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}