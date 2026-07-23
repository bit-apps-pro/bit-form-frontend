// UploadButtonTextSettings.tsx
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function FileUploadButtonTextSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()

  const setUpBtnTxt = (e: React.ChangeEvent<HTMLInputElement>) => {
    fieldData.btnTxt = e.target.value
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Button Text Modify: ${fieldData.lbl || fldKey}`,
      type: 'modify_button_text',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="upld-btn-txt-stng"
      title={__('Upload Button Text:')}
      className={css(FieldStyle.fieldSection)}
      open
    >
      <input
        data-testid="upld-btn-txt-inp"
        className={css(FieldStyle.input)}
        type="text"
        value={fieldData.btnTxt}
        onChange={setUpBtnTxt}
      />
    </SimpleAccordion>
  )
}