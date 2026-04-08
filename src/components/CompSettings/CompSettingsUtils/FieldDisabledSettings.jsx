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

export default function FieldDisabledSettings({ cls, tip }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const isDiasabled = fields[fldKey].valid.disabled || false
  const { css } = useFela()
  const setDiasabled = e => {
    // if (!IS_PRO) return
    const { checked } = e.target

    const allFields = create(fields, draft => {
      const fldData = draft[fldKey]
      if (checked) {
        fldData.valid.disabled = true
      } else {
        delete fldData.valid.disabled
      }
    })
    const req = checked ? 'on' : 'off'
    setFields(allFields)
    addToBuilderHistory({ event: `Disabled field ${req}`, type: 'disabled_field_on_off', state: { fields: allFields, fldKey } })
  }

  return (
    <div className={`${css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)} ${cls}`}>
      <SingleToggle
        id="fld-dsbl-stng"
        tip={tippyHelperMsg.disabled}
        title={__('Disabled')}
        action={setDiasabled}
        isChecked={isDiasabled}
        // isPro
        proProperty="disabled"
      />
    </div>
  )
}
