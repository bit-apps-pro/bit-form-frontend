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

interface SelectedOptionClearableSettingsProps {
  className?: string
}

/**
 * Selected Option Clearable Settings Component
 * 
 * Controls whether users can clear the selected option in the dropdown field.
 * When enabled, a clear button appears next to the selected option.
 */
export default function SelectedOptionClearableSettings({
  className = ''
}: SelectedOptionClearableSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const selectedOptClearable = fieldData?.config?.selectedOptClearable ?? false
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.selectedOptClearable = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Selected Option Clearable ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'selectedOptClearable_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="slctd-clrbl-stng"
      className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption)} ${className}`}
      title={__('Selected Option Clearable:')}
      action={handleToggle}
      isChecked={selectedOptClearable}
      tip="By disabling this option, the field selected option clearable will be hidden"
    />
  )
}