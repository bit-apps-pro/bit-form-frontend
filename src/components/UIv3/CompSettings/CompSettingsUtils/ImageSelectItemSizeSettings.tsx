/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../GlobalStates/StylesState'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

/**
 * Item Size Settings Component
 * 
 * Controls the minimum size of image select items.
 * Updates grid-template-columns with auto-fit and minmax.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function ImageSelectItemSizeSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { itemSize } = fieldData

  const setItemSize = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '') {
      delete fieldData.itemSize
    } else {
      fieldData.itemSize = value
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })

    const newStyles = create(styles, drft => {
      const repeat = `repeat(auto-fit, minmax(${value}px, 1fr))`
      drft.fields[fldKey].classes[`.${fldKey}-ic`]['grid-template-columns'] = repeat
    })

    setFields(allFields)
    setStyles(newStyles)
    addToBuilderHistory({
      event: `Image Column Update to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'image_columns_update',
      state: { fields: allFields, styles: newStyles, fldKey },
    })

    setTimeout(() => {
      reCalculateFldHeights(fldKey)
    }, 100)
  }

  return (
    <SimpleAccordion
      id="itm-sz-stng"
      title={__('Item Size')}
      className={css(FieldStyle.fieldSection)}
      proProperty="itemSize"
      tip={__("Specify item's minimum size (in pixels)")}
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="itm-sz-stng-inp"
          aria-label="Item size"
          className={css(FieldStyle.input)}
          min="50"
          max="500"
          step="50"
          type="number"
          value={itemSize}
          onChange={setItemSize}
        />
      </div>
    </SimpleAccordion>
  )
}