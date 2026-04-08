/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../Utils/FormBuilderHelper'
import { __ } from '../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../Utils/StaticData/tippyHelperMsg'
import SingleToggle from '../../Utilities/SingleToggle'

export default function FieldReadOnlySettings({ cls }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const isReadOnly = fields[fldKey].valid.readonly || false
  const { css } = useFela()
  const setReadOnly = e => {
    // if (!IS_PRO) return
    const { checked } = e.target

    const allFields = create(fields, draft => {
      const fldData = draft[fldKey]
      if (checked) {
        fldData.valid.readonly = true
      } else {
        delete fldData.valid.readonly
      }
    })
    const req = checked ? 'on' : 'off'
    setFields(allFields)
    addToBuilderHistory({ event: `Read only field ${req}`, type: 'read_only_field_on_off', state: { fields: allFields, fldKey } })
  }

  return (
    <div className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption, FieldStyle.hover_tip)} ${cls}`}>
      <SingleToggle
        id="rdonly-stng"
        tip={tippyHelperMsg.readonly}
        title={__('Read-only')}
        action={setReadOnly}
        isChecked={isReadOnly}
        // isPro
        proProperty="readOnly"
      />
    </div>
  )
}
