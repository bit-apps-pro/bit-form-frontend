import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../Utils/i18nwrap'

export default function ValueStepSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = fields[fldKey] || {}
  const { css } = useFela()


  function setStep(e) {
    if (e.target.value === '') {
      delete fieldData.step
    } else {
      fieldData.step = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Step value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_step', state: { fields: allFields, fldKey } })
  }

  return (
    <div className={css([FieldStyle.fieldSection, { flx: 'center-between', '& input': { mt: 0 } }])}>
      <span>{__('Step:')}</span>
      <input
        data-testid="slider-step-inp"
        title="Step for slider field"
        aria-label="Step for slider field"
        placeholder="1"
        className={css(FieldStyle.input, FieldStyle.w140)}
        type="number"
        value={fieldData.step}
        onChange={setStep}
      />
    </div>
  )
}
