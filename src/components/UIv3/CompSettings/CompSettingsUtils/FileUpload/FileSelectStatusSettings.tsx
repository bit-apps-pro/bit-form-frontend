// src/components/FormBuilder/CompSettingsUtils/FileUpload/FileSelectStatusSettings.tsx
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

const propNameLabel = {
  showSelectStatus: 'Show Selected Status',
  fileSelectStatus: 'File Select Status',
}

export default function FileSelectStatusSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()

  const { showSelectStatus, fileSelectStatus } = fieldData.config

  const setConfigValue = (propName: string, value: boolean | string) => {
    fieldData.config[propName] = value
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    const label = propNameLabel[propName as keyof typeof propNameLabel] || propName
    addToBuilderHistory({
      event: `${label} '${String(value || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`,
      type: `${propName}_changed`,
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="fil-slct-stts-stng"
      title={__('File Select Status')}
      toggleAction={(e) => setConfigValue('showSelectStatus', e.target.checked)}
      toggleChecked={showSelectStatus}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, ut.px10)}
      switching
      tip="By enabling this feature, you will see file select status"
      tipProps={{ width: 200, icnSize: 17 }}
      disable={!showSelectStatus}
      proProperty="fileSelectStatus"
    >
      <div className={css({ m: 2 })}>
        <input
          data-testid="fil-slct-stts-inp"
          className={css(FieldStyle.input)}
          type="text"
          value={fileSelectStatus}
          onChange={(e) => setConfigValue('fileSelectStatus', e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}