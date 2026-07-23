/* eslint-disable no-param-reassign */
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { __ } from '../../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import UniqFieldSettings from '../../../CompSettings/CompSettingsUtils/UniqFieldSettings'

/**
 * User Unique Settings Component
 * 
 * Validates if the field value is unique among WordPress users.
 * Only applicable for email and username field types.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if not applicable
 */
export default function UserUniqueSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()

  if (!fldKey) return null

  return (
    <div className="pos-rel">
      <UniqFieldSettings
        type="userUnique"
        title={__('Validate as User Unique')}
        tipTitle={tippyHelperMsg.userUnique}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        isUnique="show"
      />
    </div>
  )
}