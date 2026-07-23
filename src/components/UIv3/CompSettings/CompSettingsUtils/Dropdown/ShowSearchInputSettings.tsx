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

interface ShowSearchSettingsProps {
  className?: string
}

export default function ShowSearchInputSettings({
  className = ''
}: ShowSearchSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const showSearch = fieldData?.config?.showSearch ?? true
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.showSearch = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Search Input ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'showSearch_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="show-srch-stng"
      className={`${css(FieldStyle.fieldSection, FieldStyle.singleOption)} ${className}`}
      title={__('Show Search Input')}
      action={handleToggle}
      isChecked={showSearch}
      tip="By disabling this option, the dropdown search input will be hidden"
    />
  )
}
