/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../GlobalStates/StylesState'
import AddIcon from '../../../../Icons/AddIcon'
import BottomLefArrowIcn from '../../../../Icons/BottomLefArrowIcn'
import BottomRightArrowIcn from '../../../../Icons/BottomRightArrowIcn'
import TopLeftArrowIcn from '../../../../Icons/TopLeftArrowIcn'
import TopRightArrowIcn from '../../../../Icons/TopRightArrowIcn'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, deleteNestedObj, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { mergeNestedObj } from '../../../../Utils/globalHelpers'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import tickPosition from '../../../CompSettings/ImageSelectField/tickPosition'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import { assignNestedObj } from '../../../style-new/styleHelpers'
import StyleSegmentControl from '../../../Utilities/StyleSegmentControl'

/**
 * Check Position Settings Component
 * 
 * Controls the position of the checkmark/tick on image select items.
 * Provides 5 position options: top-left, top-right, center, bottom-left, bottom-right.
 * Updates styles by removing old position properties and applying new ones.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function CheckPositionSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''

  const setTicPosition = (position: string) => {
    const allFields = create(fields, draft => {
      draft[fldKey].tickPosition = position
    })

    const getPosStyle = tickPosition(position)

    const newStyles = create(styles, drft => {
      const delProperties = ['top', 'left', 'right', 'bottom', 'transform']
      delProperties.forEach(prop => {
        if (styles.fields[fldKey].classes[`.${fldKey}-check-box`]?.[prop]) {
          deleteNestedObj(drft, `fields->${fldKey}->classes->.${fldKey}-check-box->${prop}`)
        }
      })
      const prvStyle = drft.fields[fldKey].classes[`.${fldKey}-check-box`]
      const newProp = mergeNestedObj(prvStyle, getPosStyle)
      assignNestedObj(drft, `fields->${fldKey}->classes->.${fldKey}-check-box`, newProp)
    })

    setStyles(newStyles)
    setFields(allFields)
    addToBuilderHistory({
      event: `Tick Position Update to ${position}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'tick_position_update',
      state: { fields: allFields, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }

  return (
    <SimpleAccordion
      id="chk-pos-stng"
      title={__('Check Position')}
      className={css(FieldStyle.fieldSection)}
      proProperty="checkPosition"
      tip={__('Specify the check position.')}
    >
      <div className={css(style.tikPosIcn)}>
        <StyleSegmentControl
          className={css({ w: 180 })}
          show={['icn']}
          tipPlace="right"
          size="120"
          h="37px"
          options={[
            { icn: <TopLeftArrowIcn size="30" />, label: 'top-left', tip: 'Top Left' },
            { icn: <TopRightArrowIcn size="30" />, label: 'top-right', tip: 'Top Right' },
            { icn: <AddIcon size="30" />, label: 'center', tip: 'Center' },
            { icn: <BottomLefArrowIcn size="30" />, label: 'bottom-left', tip: 'Bottom Left' },
            { icn: <BottomRightArrowIcn size="30" />, label: 'bottom-right', tip: 'Bottom Right' },
          ]}
          onChange={(e) => setTicPosition(e)}
          defaultActive={fieldData.tickPosition}
        />
      </div>
    </SimpleAccordion>
  )
}

const style = {
  tikPosIcn: {
    flx: 'align-center',
    mt: 10,
  },
}