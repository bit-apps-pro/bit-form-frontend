import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import { addDefaultStyleClasses } from '../../../style-new/styleHelpers'
import SingleToggle from '../../../Utilities/SingleToggle'

interface ImageSelectOptionLabelShowHideSettingsProps {
  cls?: string
}

export default function ImageSelectOptionLabelShowHideSettings({
  cls = ''
}: ImageSelectOptionLabelShowHideSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const isImageLabelHidden = fields[fldKey]?.optLblHide ?? false

  const handleToggleImageLabel = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {

    const { checked } = target

    const updatedFields = create(fields, draft => {
      const fieldData = draft[fldKey]

      if (checked) {
        fieldData.optLblHide = true
      } else {
        fieldData.optLblHide = false
        addDefaultStyleClasses(fldKey, 'imageSelectOptLbl')
      }
    })

    const actionType = checked ? 'on' : 'off'

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Hide image ${actionType}`,
      type: 'Hide_image_label_on_off',
      state: { fields: updatedFields, fldKey }
    })
    reCalculateFldHeights(fldKey)
  }

  return (
    <div className={`${css(FieldStyle.fieldSection, FieldStyle.hover_tip, FieldStyle.singleOption)} ${cls}`}>
      <SingleToggle
        id="opt-img-lbl-hide-or-show"
        tip={tippyHelperMsg.imageOptLbl}
        title={__('Hide Image Label')}
        action={handleToggleImageLabel}
        isChecked={isImageLabelHidden}
        // isPro
        proProperty="hidden"
      />
    </div>
  )
}