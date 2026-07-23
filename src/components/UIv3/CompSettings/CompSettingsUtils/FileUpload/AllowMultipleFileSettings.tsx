// AllowMultipleSettings.tsx
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../../GlobalStates/AppSettingsStates'
import { $fields, $selectedFieldId } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory, setRequired } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import ErrorMessageSettings from '../../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

const propNameLabel = {
  minFile: 'Change Minimum File to',
  maxFile: 'Change Maximum File to',
}

export default function AllowMultipleSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const selectedFieldId = useAtomValue($selectedFieldId)
  const globalMessages = useAtomValue($globalMessages)
  const fieldData = deepCopy(fields[fldKey])
  const { multiple, minFile: rawMin, maxFile: rawMax } = fieldData.config
  const globalErrMsg = globalMessages?.err || {}

  let minFile = isNaN(rawMin) ? 0 : Number(rawMin)
  let maxFile = isNaN(rawMax) ? 0 : Number(rawMax)

  const { css } = useFela()

  const setConfigValue = (propName: string, value: boolean) => {
    fieldData.config[propName] = value
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propNameLabel[propName as keyof typeof propNameLabel] || propName} '${String(value || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`,
      type: `${propName}_changed`,
      state: { fields: allFields, fldKey },
    })
  }

  const setMinMaxValueConfig = (propName: 'minFile' | 'maxFile', value: string) => {
    const numVal = isNaN(Number(value)) ? 0 : Number(value)
    if (numVal >= 0) {
      if (propName === 'maxFile' && minFile && numVal < minFile) {
        fieldData.config.minFile = numVal
        fieldData.err.minFile.dflt = globalErrMsg?.minFile || `Minimum ${numVal} File Required`
      } else if (propName === 'minFile' && numVal > maxFile && maxFile) {
        fieldData.config.maxFile = numVal
        fieldData.err.maxFile.dflt = globalErrMsg?.maxFile || `Maximum ${numVal} File can uploaded`
      }

      if (propName === 'minFile')
        fieldData.err.minFile.dflt = globalErrMsg?.minFile || `Minimum ${numVal} File Required`
      else if (propName === 'maxFile')
        fieldData.err.maxFile.dflt = globalErrMsg?.maxFile || `Maximum ${numVal} File can uploaded`

      fieldData.config[propName] = numVal
      const allFields = create(fields, draft => {
        draft[fldKey] = fieldData
      })
      setFields(allFields)
      addToBuilderHistory({
        event: `${propNameLabel[propName]} '${numVal}': ${fieldData.lbl || fldKey}`,
        type: `${propName}_changed`,
        state: { fields: allFields, fldKey },
      })
      if (propName === 'minFile' && numVal > 0) {
        setRequired({ target: { checked: true } } as any)
      }
    }
  }

  return (
    <SimpleAccordion
      id="alw-mltpl-stng"
      title={__('Allow Multiple:')}
      toggleAction={(e) => setConfigValue('multiple', e.target.checked)}
      toggleChecked={multiple}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      switching
      tip="By enabling this feature, you wil enable to select multiple file control file upload limit"
      tipProps={{ width: 200, icnSize: 17 }}
      open={multiple}
      disable={!multiple}
    >
      <div className={css(ut.ml1, ut.mr1)}>
        <div className={css(ut.flxc)}>
          <span>Minimum File</span>
          <input
            data-testid="alw-mltpl-min-inp"
            className={css(FieldStyle.input, ut.w5, ut.mt1)}
            type="number"
            value={minFile}
            onChange={(e) => setMinMaxValueConfig('minFile', e.target.value)}
          />
        </div>
        <ErrorMessageSettings
          className={css(ut.mt0)}
          id="min-fil-err-msg"
          type="minFile"
          defaultMsg={`Minimum ${minFile} File Required`}
          allowIcons={false}
        />
        <div className={css(ut.flxc, ut.mt2)}>
          <span>Maximum File</span>
          <input
            data-testid="alw-mltpl-max-inp"
            className={css(FieldStyle.input, ut.w5, ut.mt1)}
            type="number"
            value={maxFile}
            onChange={(e) => setMinMaxValueConfig('maxFile', e.target.value)}
          />
        </div>
        <ErrorMessageSettings
          className={css(ut.mt0)}
          id="max-fil-err-msg"
          type="maxFile"
          defaultMsg={`Maximum ${maxFile} File can uploaded`}
          allowIcons={false}
        />
      </div>
    </SimpleAccordion>
  )
}