import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../../GlobalStates/StylesState'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function RatingPositionSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const setStyles = useSetAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const ratingPos = fieldData?.ratingPos || 'start'

  const pos = [
    { name: __('Left'), value: 'start' },
    { name: __('Center'), value: 'center' },
    { name: __('Right'), value: 'end' },
  ]

  const setRatingPos = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = target
    const allFields = create(fields, draft => {
      draft[fldKey].ratingPos = value
    })

    // Update styles for real-time positioning
    setStyles(prev => create(prev, draft => {
      draft.fields[fldKey].classes[`.${fldKey}-inp-fld-wrp`]['justify-content'] = value
      if (value === 'end') {
        draft.fields[fldKey].classes[`.${fldKey}-inp-fld-wrp`]['flex-direction'] = 'row-reverse'
      } else {
        delete draft.fields[fldKey].classes[`.${fldKey}-inp-fld-wrp`]['flex-direction']
      }
    }))

    setFields(allFields)
    addToBuilderHistory({
      event: `Rating position changed to ${value}: ${fieldData.lbl || fldKey}`,
      type: 'review_start_pos',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="rating-algn"
      title={__('Rating Position')}
      className={css(FieldStyle.fieldSection)}
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="rating-algn-slct"
          className={css(FieldStyle.input)}
          value={ratingPos}
          onChange={setRatingPos}
        >
          {pos.map(itm => (
            <option key={`rating-pos-${itm.value}`} value={itm.value}>
              {itm.name}
            </option>
          ))}
        </select>
      </div>
    </SimpleAccordion>
  )
}