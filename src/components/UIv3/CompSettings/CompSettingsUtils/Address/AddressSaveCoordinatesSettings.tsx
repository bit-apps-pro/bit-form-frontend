/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SingleToggle from '../../../../Utilities/SingleToggle'

export default function AddressSaveCoordinatesSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const saveCoordinates = fieldData.config?.saveCoordinates || false

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    fieldData.config.saveCoordinates = checked
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Save coordinates '${checked ? 'On' : 'Off'}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'address_save_coordinates_changed',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SingleToggle
      id="addr-save-coords-stng"
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      tip={__('When enabled, latitude and longitude are saved as hidden fields alongside the address entry.')}
      title={__('Save Coordinates')}
      action={handleToggle}
      isChecked={saveCoordinates}
      isPro
    />
  )
}
