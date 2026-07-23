import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SingleToggle from '../../../../Utilities/SingleToggle'

export default function HideCountryListSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { hideCountryList } = fieldData.config

  const handleConfigChange = (val: boolean) => {
    fieldData.config.hideCountryList = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Hide Country List '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'hideCountryList_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="hide-slctble-opt"
      tip="By enabling this option, the country list will be hidden."
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      title={__('Hide Country List')}
      action={e => handleConfigChange(e.target.checked)}
      isChecked={hideCountryList || false}
      isPro
      proProperty="hideCountryList"
    />
  )
}