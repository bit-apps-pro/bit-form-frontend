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
 * Detect Country By IP Settings Component
 * 
 * Enables automatic country detection based on the user's IP address.
 * When enabled, the country field will pre-populate with the detected country.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function DetectCountryByIPSettings({ propsFldKey }: { propsFldKey?: string } = {}) {
  const { css } = useFela()
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { detectCountryByIp } = fieldData.config

  const handleConfigChange = (val: boolean) => {
    fieldData.config.detectCountryByIp = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Detect Country By Ip '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'detectCountryByIp_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SingleToggle
      id="dtct-cntry-by-ip-stng"
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}
      tip="By disabling this option, are not detect county by ip"
      title={__('Detect Country By IP')}
      action={e => handleConfigChange(e.target.checked)}
      isChecked={detectCountryByIp || false}
      isPro
      proProperty="detectCountryByIp"
    />
  )
}