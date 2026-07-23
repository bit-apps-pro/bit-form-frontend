import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SingleToggle from '../../../../Utilities/SingleToggle'

/**
 * Option Flag Image Settings Component
 * 
 * Toggles the display of flag images in the dropdown options list.
 * When enabled, each country option shows its flag icon.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function ShowOptionFlagImageSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { optionFlagImage } = fieldData.config

  const handleConfigChange = (val: boolean) => {
    fieldData.config.optionFlagImage = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Allow Option Flag Image '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'optionFlagImage_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="opt-icn-stng"
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      tip="By disabling this option, the option flags image will be hidden"
      title={__('Show Option Flag Image')}
      action={e => handleConfigChange(e.target.checked)}
      isChecked={optionFlagImage || false}
      isPro
      proProperty="optionIcon"
    />
  )
}