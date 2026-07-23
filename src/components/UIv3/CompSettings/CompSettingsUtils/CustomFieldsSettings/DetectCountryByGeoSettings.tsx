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

/**
 * Detect Country By Geo Settings Component
 * 
 * Enables automatic country detection based on the user's geolocation.
 * When enabled, the country field will pre-populate with the detected country using browser geolocation.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function DetectCountryByGeoSettings({ propsFldKey }: { propsFldKey?: string } = {}) {
  const { css } = useFela()
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { detectCountryByGeo } = fieldData.config

  const handleConfigChange = (val: boolean) => {
    fieldData.config.detectCountryByGeo = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Detect Country By Geo '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'detectCountryByGeo_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="dtct-cntry-by-geo-stng"
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      tip="By disabling this option, are not detect county by Geo location"
      title={__('Detect Country By Geo')}
      action={e => handleConfigChange(e.target.checked)}
      isChecked={detectCountryByGeo || false}
      isPro
      proProperty="detectCountryByGeo"
    />
  )
}