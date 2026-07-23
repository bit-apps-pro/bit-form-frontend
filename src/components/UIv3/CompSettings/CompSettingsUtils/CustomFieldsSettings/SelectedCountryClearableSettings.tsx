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
 * Selected Country Clearable Settings Component
 * 
 * Toggles the clearable button for the selected country field.
 * When enabled, users can clear their country selection.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function SelectedCountryClearableSettings({ propsFldKey }: { propsFldKey?: string } = {}) {
  const { css } = useFela()
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { selectedCountryClearable } = fieldData.config

  const handleConfigChange = (val: boolean) => {
    fieldData.config.selectedCountryClearable = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Selected Country Clearable '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'selectedCountryClearable_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="slctd-clrbl-stng"
      tip="By disabling this option, the selected country clearable button will be hidden"
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      title={__('Selected Country Clearable')}
      action={e => handleConfigChange(e.target.checked)}
      isChecked={selectedCountryClearable || false}
    />
  )
}