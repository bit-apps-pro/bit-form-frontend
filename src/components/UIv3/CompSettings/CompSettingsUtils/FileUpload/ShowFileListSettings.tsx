// src/components/FormBuilder/CompSettingsUtils/FileUpload/ShowFileListSettings.tsx
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import {
  addDefaultStyleClasses,
} from '../../../../style-new/styleHelpers'
import CheckBoxMini from '../../../../Utilities/CheckBoxMini'

const propNameLabel = {
  showFileList: 'Show File List',
  showFilePreview: 'Show File Preview',
  showFileSize: 'Show File Size',
}

export default function ShowFileListSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const selectedFieldId = useAtomValue($selectedFieldId)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()

  const { showFileList, showFilePreview, showFileSize } = fieldData.config

  const setConfigValue = (propName: string, value: boolean) => {
    fieldData.config[propName] = value
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)

    // Add default style class if turning ON certain visual features
    const addStyleSettingType = ['showFileSize', 'showFilePreview', 'showFileList']
    if (addStyleSettingType.includes(propName) && value) {
      addDefaultStyleClasses(selectedFieldId, propName)
    }

    const label = propNameLabel[propName as keyof typeof propNameLabel] || propName
    addToBuilderHistory({
      event: `${label} '${value ? 'On' : 'Off'}': ${fieldData.lbl || fldKey}`,
      type: `${propName}_changed`,
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="shw-fil-lst-stng"
      title={__('Show File List')}
      toggleAction={(e) => setConfigValue('showFileList', e.target.checked)}
      toggleChecked={showFileList}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, ut.px10)}
      switching
      tip="By enabling this feature, you will see file list with preview and size"
      tipProps={{ width: 200, icnSize: 17 }}
      open={showFileList}
      disable={!showFileList}
      proProperty="showFileList"
    >
      <div className={css(ut.ml1)}>
        <CheckBoxMini
          id="shw-fil-prvw"
          className={css(ut.mr2, ut.mt2, ut.fw500)}
          checked={showFilePreview}
          title={__('Show File Preview')}
          onChange={(e) => setConfigValue('showFilePreview', e.target.checked)}
        />
        <CheckBoxMini
          id="shw-fil-siz"
          className={css(ut.mr2, ut.mt2, ut.fw500)}
          checked={showFileSize}
          title={__('Show File Size')}
          onChange={(e) => setConfigValue('showFileSize', e.target.checked)}
        />
      </div>
    </SimpleAccordion>
  )
}