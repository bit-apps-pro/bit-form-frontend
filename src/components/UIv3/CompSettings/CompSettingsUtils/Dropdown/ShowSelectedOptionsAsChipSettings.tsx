/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import SingleToggle from '../../../../Utilities/SingleToggle'

interface ShowSelectedOptionChipSettingsProps {
  className?: string
}

/**
 * Show Selected Option Chip Settings Component
 * 
 * Controls whether selected options are displayed as chips (badges) in multiple select mode.
 * When disabled, shows count of selected options as text instead.
 * 
 * Note: This setting is only visible when multiple select is enabled.
 */
export default function ShowSelectedOptionsAsChipSettings({
  className = ''
}: ShowSelectedOptionChipSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const multipleSelect = fieldData?.config?.multipleSelect ?? false
  const showChip = fieldData?.config?.showChip ?? false
  const adminLabel = fieldData?.adminLbl ?? ''

  // Don't render if multiple select is not enabled
  if (!multipleSelect) return null

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.showChip = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Show Chip ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'showChip_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="show-chip"
      className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption)} ${className}`}
      title={__('Show Selected Option Chip:')}
      action={handleToggle}
      isChecked={showChip}
      tip="Show selected options as chip (clearable). If disabled, count of selected options will be shown as text."
    />
  )
}