import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import fieldsTypes from '../../../Utils/StaticData/fieldTypes'
import FieldSettingsTitle from './CompSettingsUtils/FieldSettingsTitle'
import EmptyFieldState from './EmptyFieldState'
import { FieldSettingsTabs } from './FieldSettingsConfig'

export default function FieldSettings() {
  const { fieldKey, formType, formID } = useParams<Record<string, string>>()
  const fields = useAtomValue($fields) as Record<string, any>
  const { css } = useFela()
  const fieldData = fieldKey ? fields?.[fieldKey] : undefined
  const selectedFieldType = fieldData?.typ

  if (!fieldKey) {
    return <div>{__('No field key provided')}</div>
  }

  if (!selectedFieldType) {
    return (<EmptyFieldState
      title={__('No field found with this key.')}
      description={__('The field you are trying to access does not exist or has been removed.')}
      note={__('Please select a valid field to customize its settings.')}
    />)
  }

  const fieldTypeTitle = (fieldsTypes as Record<string, string>)[selectedFieldType] || selectedFieldType

  return (
    <div className={css({ p: 10 })}>
      <FieldSettingsTitle title={fieldTypeTitle} fieldKey={fieldKey} highlightSelector={`[data-dev-fld-wrp="${fieldKey}"]`} />
      <FieldSettingsTabs fieldKey={fieldKey} fieldType={selectedFieldType} />
      <div className="mb-50" />
    </div>
  )
}