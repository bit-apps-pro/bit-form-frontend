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

interface CloseOnSelectSettingsProps {
  className?: string
}

/**
 * Close On Select Settings Component
 * 
 * Controls whether the dropdown closes automatically after selecting an option.
 * When disabled, the dropdown remains open for additional selections.
 */
export default function CloseOnSelectSettings({
  className = ''
}: CloseOnSelectSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const closeOnSelect = fieldData?.config?.closeOnSelect ?? false
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.closeOnSelect = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Close On Select ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'closeOnSelect_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="cls-on-slct-stng"
      className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption)} ${className}`}
      title={__('Close On Select:')}
      action={handleToggle}
      isChecked={closeOnSelect}
      isPro
      tip="By disabling this option, the field close on select will be hidden"
    />
  )
}