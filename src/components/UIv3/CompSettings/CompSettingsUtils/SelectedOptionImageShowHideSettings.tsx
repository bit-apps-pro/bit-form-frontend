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

interface SelectedOptionImageSettingsProps {
  className?: string
}

/**
 * Selected Option Image Settings Component
 * 
 * Controls whether the selected option's image is displayed in the dropdown field.
 * This is a PRO feature.
 */
export default function selectedOptionImageShowHideSettings({
  className = ''
}: SelectedOptionImageSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const selectedOptImage = fieldData?.config?.selectedOptImage ?? false
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.selectedOptImage = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Selected Option Image ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'selectedOptImage_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="shw-slctd-img-stng"
      className={`${css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)} ${className}`}
      title={__('Show Selected Option Image')}
      action={handleToggle}
      isChecked={selectedOptImage}
      tip="By disabling this option, the field show selected option image will be hidden"
      isPro
      proProperty="selectedOptImage"
    />
  )
}