// DecisionBoxCheckedByDefaultSetting.tsx
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SingleToggle from '../../../../Utilities/SingleToggle'

export default function DecisionCheckedByDefaultSetting() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  const fieldData = deepCopy(fields[fldKey])
  const isChecked = !!fieldData.valid?.checked

  const setChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    if (checked) {
      fieldData.valid.checked = true
    } else {
      delete fieldData.valid.checked
    }
    const allFields = create(fields, (draft) => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Check by default ${checked ? 'on' : 'off'} : ${fieldData.adminLbl || fldKey}`,
      type: 'set_check_by_default',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '36px !important' })}>
      <SingleToggle
        id="chek-by-dflt"
        tip="By disabling this option, the field checked by default will be hidden"
        title={__('Checked by Default')}
        action={setChecked}
        isChecked={isChecked}
      />
    </div>
  )
}