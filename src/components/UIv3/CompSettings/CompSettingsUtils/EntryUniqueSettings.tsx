/* eslint-disable no-param-reassign */
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { __ } from '../../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import UniqFieldSettings from '../../../CompSettings/CompSettingsUtils/UniqFieldSettings'

/**
 * Entry Unique Settings Component
 * 
 * Validates if the field value is unique across all form entries.
 * Applicable for text, url, textarea, password, number, email, color, date, and username field types.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if not applicable
 */
export default function EntryUniqueSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()

  if (!fldKey) return null
  return (
    <UniqFieldSettings
      type="entryUnique"
      title={__('Unique Entry')}
      tipTitle={tippyHelperMsg.uniqueEntry}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      isUnique="show"
    />
  )
}