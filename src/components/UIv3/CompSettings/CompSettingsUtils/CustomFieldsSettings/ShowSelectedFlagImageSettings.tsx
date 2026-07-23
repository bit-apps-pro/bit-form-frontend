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
 * Show Selected Flag Image Settings Component
 * 
 * Toggles the visibility of the flag image next to the selected country.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function ShowSelectedFlagImageSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { selectedFlagImage } = fieldData.config

  const handleConfigChange = (val: boolean) => {
    fieldData.config.selectedFlagImage = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Selected Flag Image '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'selectedFlagImage_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="shw-slctd-img-stng"
      tip="By disabling this option, the show selected flag image will be hidden"
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      title={__('Show Selected Flag Image')}
      action={e => handleConfigChange(e.target.checked)}
      isChecked={selectedFlagImage || false}
      isPro
      proProperty="selectedFlagImage"
    />
  )
}