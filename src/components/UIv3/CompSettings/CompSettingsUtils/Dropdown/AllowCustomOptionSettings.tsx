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

interface AllowCustomOptionSettingsProps {
  className?: string
}

/**
 * Allow Custom Option Settings Component
 * 
 * Controls whether users can add custom options that aren't in the predefined list.
 * When enabled, users can type and add their own options.
 */
export default function AllowCustomOptionSettings({
  className = ''
}: AllowCustomOptionSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const allowCustomOption = fieldData?.config?.allowCustomOption ?? false
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.allowCustomOption = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Allow Custom Option ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'allowCustomOption_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="alw-cstm-opt-stng"
      className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption)} ${className}`}
      title={__('Allow Custom Option:')}
      action={handleToggle}
      isChecked={allowCustomOption}
      isPro
      tip="By disabling this option, the field allow custom option will be hidden"
    />
  )
}