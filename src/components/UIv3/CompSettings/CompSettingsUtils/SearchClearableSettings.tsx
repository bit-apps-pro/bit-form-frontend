/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../Utils/i18nwrap'
import SingleToggle from '../../../Utilities/SingleToggle'

interface SearchClearableSettingsProps {
  className?: string
  propsFldKey?: string
}

/**
 * Search Clearable Settings Component
 *
 * Controls whether users can clear the search input in the dropdown field.
 * When enabled, a clear button appears in the search field.
 */
export default function SearchClearableSettings({
  className = '',
  propsFldKey
}: SearchClearableSettingsProps) {
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const searchClearable = fieldData?.config?.searchClearable ?? false
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.searchClearable = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Search Clearable ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'searchClearable_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="srch-clrbl-stng"
      className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption)} ${className}`}
      title={__('Search Clearable:')}
      action={handleToggle}
      isChecked={searchClearable}
      tip="By disabling this option, the field search clearable will be hidden"
    />
  )
}