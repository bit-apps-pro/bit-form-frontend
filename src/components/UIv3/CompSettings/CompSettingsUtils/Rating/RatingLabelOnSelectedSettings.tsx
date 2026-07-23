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

export default function RatingMessageOnSelectedSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const isReviewLblShowOnSelect = fieldData?.showReviewLblOnSelect || false

  const setReviewLblOnSelect = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = target
    const allFields = create(fields, draft => {
      const fldData = draft[fldKey]

      if (checked) {
        fldData.showReviewLblOnSelect = true
      } else {
        fldData.showReviewLblOnSelect = false
      }
    })

    const req = checked ? 'show' : 'hide'
    setFields(allFields)
    addToBuilderHistory({
      event: `Rating message on select ${req}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'review_lbl_show_select_hide',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)}>
      <SingleToggle
        id="fld-rating-lbl-select"
        tip={tippyHelperMsg.ratingSelectTip}
        title={__('Show Rating Message On Selected')}
        action={setReviewLblOnSelect}
        isChecked={isReviewLblShowOnSelect}
        isPro
        proProperty="ratingMsgOnSelect"
      />
    </div>
  )
}