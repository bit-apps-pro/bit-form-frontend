import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'


export default function FileExistMessageSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const selectedFieldId = useAtomValue($selectedFieldId)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()
  const { fileExistMsg } = fieldData.config

  function setConfigValue(propName, value) {
    fieldData.config[propName] = value
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `File Exist Message: '${String(value || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`, type: `${propName}_changed`, state: { fields: allFields, fldKey } })
  }

  return (
    <SimpleAccordion
      id="fil-exst-err-msg"
      title={__('File Exist Message')}
      className={css(FieldStyle.fieldSection)}
      proProperty="fileExistMsg"
    >
      <div className={css({ m: 2 })}>
        <input
          data-testid="fil-exst-msg-inp"
          className={css(FieldStyle.input)}
          type="text"
          value={fileExistMsg}
          onChange={e => setConfigValue('fileExistMsg', e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}