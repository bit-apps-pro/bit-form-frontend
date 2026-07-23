import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import tippyHelperMsg from '../../../../../Utils/StaticData/tippyHelperMsg'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SingleToggle from '../../../../Utilities/SingleToggle'

/**
 * Rating Message On Hover Settings Component
 * 
 * Toggles the display of rating message/label when user hovers over rating icons.
 * When enabled, shows descriptive text (e.g., "Excellent", "Good", "Poor") on hover.
 * 
 * This helps users understand what each rating level represents before selecting.
 * Pro feature.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function RatingLabelOnHoverSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const isReviewLblShowOnHover = fieldData?.showReviewLblOnHover || false

  const setReviewLblOnHover = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = target
    const allFields = create(fields, draft => {
      const fldData = draft[fldKey]

      if (checked) {
        fldData.showReviewLblOnHover = true
      } else {
        fldData.showReviewLblOnHover = false
      }
    })

    const req = checked ? 'show' : 'hide'
    setFields(allFields)
    addToBuilderHistory({
      event: `Rating message on hover ${req}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'review_lbl_show_hide',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}>
      <SingleToggle
        id="fld-rating-lbl-hover"
        tip={tippyHelperMsg.ratingLbl}
        title={__('Show Rating Message On hover')}
        action={setReviewLblOnHover}
        isChecked={isReviewLblShowOnHover}
        isPro
        proProperty="ratingMsgOnHover"
      />
    </div>
  )
}