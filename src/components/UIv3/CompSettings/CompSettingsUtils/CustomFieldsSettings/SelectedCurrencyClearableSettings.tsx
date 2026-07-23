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
 * Selected Currency Clearable Settings Component
 * 
 * Toggles the clearable button for the selected currency field.
 * When enabled, users can clear their currency selection.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function SelectedCurrencyClearableSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const { selectedCurrencyClearable } = fieldData.config

  const handleConfigChange = (val: boolean) => {
    fieldData.config.selectedCurrencyClearable = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Selected Currency Clearable '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`,
      type: 'selectedCurrencyClearable_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="slctd-clrbl-stng"
      tip="By disabling this option, the selected currency clearable button will be hidden"
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      title={__('Selected Currency Clearable')}
      action={e => handleConfigChange(e.target.checked)}
      isChecked={selectedCurrencyClearable || false}
    />
  )
}