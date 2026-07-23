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

export default function PhoneInputFormatSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { inputFormat } = fieldData.config

  const handleConfigChange = (val: string) => {
    fieldData.config.inputFormat = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Input Format Changed to '${val}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'inputFormat_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="inp-frmt-opt-stng"
      title={__('Input Format Option')}
      className={css(FieldStyle.fieldSection)}
      isPro
      proProperty="inputFormatOptions"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="inp-frmt-opt-inp"
          aria-label="Input Format Option"
          placeholder="Input Format(Ex: +c #### ### ###)"
          className={css(FieldStyle.input)}
          type="text"
          value={inputFormat || ''}
          onChange={e => handleConfigChange(e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}