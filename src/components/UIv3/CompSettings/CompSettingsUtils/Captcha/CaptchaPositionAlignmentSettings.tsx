/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../../GlobalStates/StylesState'
import TxtAlignCntrIcn from '../../../../../Icons/TxtAlignCntrIcn'
import TxtAlignLeftIcn from '../../../../../Icons/TxtAlignLeftIcn'
import TxtAlignRightIcn from '../../../../../Icons/TxtAlignRightIcn'
import ut from '../../../../../styles/2.utilities'
import style from '../../../../../styles/FieldSettingTitle.style'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import StyleSegmentControl from '../../../../Utilities/StyleSegmentControl'

interface CaptchaPositionAlignmentSettingsProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string
}

/**
 * ReCaptcha Position Alignment Settings Component
 * 
 * Controls the horizontal alignment (left/center/right) of the reCAPTCHA widget.
 * Updates the CSS flexbox justify-content property for the field wrapper.
 * 
 * Features:
 * - Left alignment
 * - Center alignment
 * - Right alignment
 * - Visual icon-based segment control
 * - Updates styles (not field config)
 * - History tracking
 * 
 * @component
 * @example
 * ```tsx
 * <ReCaptchaPositionAlignmentSettings />
 * ```
 */
export default function CaptchaPositionAlignmentSettings({
  className = ''
}: CaptchaPositionAlignmentSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [styles, setStyles] = useAtom($styles)
  const [fields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const adminLabel = fieldData?.adminLbl ?? ''

  // Get current alignment from styles
  const fldStyleObj = styles?.fields?.[fldKey]
  const wrpClass = `.${fldKey}-fld-wrp`
  const alignment = fldStyleObj?.classes?.[wrpClass]?.['justify-content'] ?? 'left'

  const handleAlignmentChange = (value: string): void => {
    const updatedStyles = create(styles, draftStyle => {
      // Ensure the structure exists
      if (!draftStyle.fields[fldKey]) {
        draftStyle.fields[fldKey] = { classes: {} }
      }
      if (!draftStyle.fields[fldKey].classes[wrpClass]) {
        draftStyle.fields[fldKey].classes[wrpClass] = {}
      }

      // Set display flex and alignment
      draftStyle.fields[fldKey].classes[wrpClass].display = 'flex'
      draftStyle.fields[fldKey].classes[wrpClass]['justify-content'] = value
    })

    setStyles(updatedStyles)
    addToBuilderHistory({
      event: `Position alignment to "${value}" : ${adminLabel || fldKey}`,
      type: 'position_alignment_change',
      state: { styles: updatedStyles, fldKey }
    })
  }

  return (
    <div className={`${css(FieldStyle.fieldSection)} ${className}`}>
      <div className={css(ut.flxcb)}>
        <span className={css(style.label)}>Position Alignment</span>
        <StyleSegmentControl
          show={['icn']}
          tipPlace="bottom"
          className={css(style.segment)}
          options={[
            {
              icn: <TxtAlignLeftIcn size="17" />,
              label: 'left',
              tip: 'Left'
            },
            {
              icn: <TxtAlignCntrIcn size="17" />,
              label: 'center',
              tip: 'Center'
            },
            {
              icn: <TxtAlignRightIcn size="17" />,
              label: 'right',
              tip: 'Right'
            },
          ]}
          onChange={handleAlignmentChange}
          defaultActive={alignment}
        />
      </div>
    </div>
  )
}