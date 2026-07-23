import { useAtom } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import Icons from '../../../../CompSettings/Icons'
// import FieldIconSettings from '../../../../CompSettings/StyleCustomize/ChildComp/FieldIconSettings'
import ut from '../../../../../styles/2.utilities'
import Modal from '../../../../Utilities/Modal'
import FieldIconSettings from '../../StyleCustomize/ChildComp/FieldIconSettings'

/**
 * Rating Icon Settings Component
 * 
 * Manages the icon used for rating display (e.g., star, heart, thumbs up).
 * Opens a modal to select from available icons or upload custom icon.
 * 
 * Icon is stored in the first option of the rating field options array.
 * Updates apply to all rating icons in the field.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function RatingIconSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields] = useAtom($fields)
  const [icnMdl, setIcnMdl] = useState(false)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])

  return (
    <>
      <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip,FieldStyle.singleOption, ut.flxcb)}>
        <span className={css(ut.fw500)}>{__('Rating Icon')}</span>
        <FieldIconSettings
          // label="Rating Icon"
          iconSrc={fieldData.opt[0]?.img}
          styleRoute="rating-img"
          setIcon={() => setIcnMdl(true)}
          // isPro
          proProperty="ratingIcon"
          position="suffix"
        />
      </div>

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title={__('Icons')}
      >
        <div className="pos-rel" />
        <Icons iconType="opt" setModal={setIcnMdl} />
      </Modal>
    </>
  )
}