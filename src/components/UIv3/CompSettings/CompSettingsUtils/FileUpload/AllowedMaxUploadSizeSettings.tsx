// src/components/FormBuilder/CompSettingsUtils/FileUpload/AllowMaxUploadSizeSettings.tsx
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
import ErrorMessageSettings from '../../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import SizeControl from '../../../../CompSettings/StyleCustomize/ChildComp/SizeControl'
import CheckBoxMini from '../../../../Utilities/CheckBoxMini'

const propNameLabel = {
  allowMaxSize: 'Allow Maximum Upload Size',
  isItTotalMax: 'Total Maximum Size',
}

export default function AllowMaxUploadSizeSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()

  const {
    allowMaxSize,
    maxSize,
    sizeUnit,
    isItTotalMax,
    multiple,
  } = fieldData.config

  const setConfigValue = (propName: string, value: boolean | string) => {
    fieldData.config[propName] = value
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    const label = propNameLabel[propName as keyof typeof propNameLabel] || propName
    addToBuilderHistory({
      event: `${label}: ${fieldData.lbl || fldKey}`,
      type: `${propName}_changed`,
      state: { fields: allFields, fldKey },
    })
  }

  const maxSizeHandler = (unit: string, value: number) => {
    fieldData.config.maxSize = value
    fieldData.config.sizeUnit = unit
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Modify Maximum size to ${value}${unit}: ${fieldData.lbl || fldKey}`,
      type: 'modify_maximum_size',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="mxmm-upld-siz-stng"
      title={__('Allow Maximum Upload Size')}
      toggleAction={(e) => setConfigValue('allowMaxSize', e.target.checked)}
      toggleChecked={allowMaxSize}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      switching
      tip="By enabling this feature, you will limit the upload size"
      tipProps={{ width: 200, icnSize: 17 }}
      open={allowMaxSize}
      disable={!allowMaxSize}
    >
      <div className={css(FieldStyle.placeholder)}>
        <SizeControl
          dataTestId="mxmm-upld-siz"
          className={css(ut.w10, ut.mt2, ut.mb1, {
            bd: 'var(--b-79-96) !important',
            brs: '8px !important',
            p: 5,
          })}
          inputHandler={({ unit, value }) => maxSizeHandler(unit, value)}
          sizeHandler={({ unitKey, unitValue }) => maxSizeHandler(unitKey, unitValue)}
          value={maxSize}
          unit={sizeUnit}
          width="128px"
          options={['Bytes', 'KB', 'MB', 'GB']}
          step={1}
          max={1024}
        />
        {multiple && (
          <CheckBoxMini
            id="ttl-mxmm-siz"
            className={css(ut.mr2, ut.ml1, ut.mt1, ut.fw500)}
            checked={isItTotalMax}
            title={__('Total Maximum Size')}
            onChange={(e) => setConfigValue('isItTotalMax', e.target.checked)}
          />
        )}
        <ErrorMessageSettings
          id="mxmm-upld-siz"
          type="maxSize"
          defaultMsg="Max Upload Size Exceeded"
          allowIcons={false}
        />
      </div>
    </SimpleAccordion>
  )
}