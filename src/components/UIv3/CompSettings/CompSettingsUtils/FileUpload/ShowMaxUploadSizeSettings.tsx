// src/components/FormBuilder/CompSettingsUtils/FileUpload/ShowMaxSizeSettings.tsx
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

const propNameLabel = {
  showMaxSize: 'Show Maximum Size',
  maxSizeLabel: 'Maximum Size Label',
}

export default function ShowMaxUploadSizeSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()

  const { showMaxSize, maxSizeLabel } = fieldData.config

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
      id="shw-mxmm-siz-stng"
      title={__('Show Maximum Size')}
      toggleAction={(e) => setConfigValue('showMaxSize', e.target.checked)}
      toggleChecked={showMaxSize}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      switching
      tip="By disabling this option, the field show maximum size will be hidden"
      tipProps={{ width: 200, icnSize: 17 }}
      open={showMaxSize}
      {...(IS_PRO && { disable: !showMaxSize })}
      isPro
      proProperty="showMaxSize"
    >
      <div className={css({ m: 2 })}>
        <input
          data-testid="mx-size-label-inp"
          className={css(FieldStyle.input)}
          type="text"
          value={maxSizeLabel}
          placeholder="Write a Max Size Label Ex:(Max 2MB)"
          onChange={(e) => setConfigValue('maxSizeLabel', e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}