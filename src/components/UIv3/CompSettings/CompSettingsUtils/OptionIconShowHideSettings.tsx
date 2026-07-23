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

interface OptionIconSettingsProps {
  className?: string
}

/**
 * Option Icon Settings Component
 * 
 * Controls whether icons/images are displayed for each option in the dropdown.
 * This is a PRO feature that allows visual representation of options.
 */
export default function OptionIconShowHideSettings({
  className = ''
}: OptionIconSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const optionIcon = fieldData?.config?.optionIcon ?? false
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.optionIcon = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Option Icon ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'optionIcon_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="opt-icn-stng"
      className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption)} ${className}`}
      title={__('Option Icon/Image:')}
      action={handleToggle}
      isChecked={optionIcon}
      tip="By disabling this option, the field option icon will be hidden"
      isPro
      proProperty="optionIcon"
    />
  )
}