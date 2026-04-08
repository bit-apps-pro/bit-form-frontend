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

export default function FieldHideSettings({ cls }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const isHidden = fields[fldKey].valid?.hide || false
  const { css } = useFela()

  const setHidden = ({ target }) => {
    // if (!IS_PRO) return
    const { checked } = target
    const allFields = create(fields, draft => {
      const fldData = draft[fldKey]
      if (!fldData.valid) fldData.valid = {}
      if (checked) {
        fldData.valid.hide = true
      } else {
        delete fldData.valid.hide
      }
    })
    const req = checked ? 'on' : 'off'
    setFields(allFields)
    addToBuilderHistory({ event: `Hidden Field ${req}`, type: 'hide_Field_on_off', state: { fields: allFields, fldKey } })
  }

  return (
    <div className={`${css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)} ${cls}`}>
      <SingleToggle
        id="fld-hid-stng"
        tip={tippyHelperMsg.fieldHidden}
        title={__('Hidden')}
        action={setHidden}
        isChecked={isHidden}
        // isPro
        proProperty="hidden"
      />
    </div>
  )
}
