import { useAtom } from 'jotai'
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


/**
 * Button Align Settings Component
 * Handles button alignment (when not full width) or text alignment (when full width)
 */
export default function ButtonAlignSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const { align, txtAlign, fulW } = fieldData

  const pos = [
    { name: __('Left'), value: 'start' },
    { name: __('Center'), value: 'center' },
    { name: __('Right'), value: 'end' },
  ]

  const setButtonAlign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-inp-fld-wrp`]['justify-content'] = value
    }))
    fieldData.align = value
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    addToBuilderHistory({
      event: `Button Alignment changed to ${value}: ${fieldData.txt}`,
      type: 'set_btn_align',
      state: { fields, fldKey }
    })
  }

  const setButtonTextAlign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['justify-content'] = value
    }))
    fieldData.txtAlign = value
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    addToBuilderHistory({
      event: `Button Text Alignment changed to ${value}: ${fieldData.txt}`,
      type: 'set_btn_text_align',
      state: { fields, fldKey }
    })
  }

  // Show button align only when not full width
  if (!fulW) {
    return (
      <SimpleAccordion
        id="btn-algn"
        title={__('Button Align')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <select
            data-testid="btn-algn-slct"
            className={css(FieldStyle.input)}
            value={align}
            onChange={setButtonAlign}
          >
            {pos.map(itm => (
              <option key={`btcd-k-${itm.name}`} value={itm.value}>
                {itm.name}
              </option>
            ))}
          </select>
        </div>
      </SimpleAccordion>
    )
  }

  // Show text align only when full width
  if (fulW) {
    return (
      <SimpleAccordion
        id="txt-algn"
        title={__('Text Align')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <select
            data-testid="txt-algn-slct"
            className={css(FieldStyle.input)}
            value={txtAlign || 'center'}
            onChange={setButtonTextAlign}
          >
            {pos.map(itm => (
              <option key={`btcd-k-${itm.name}`} value={itm.value}>
                {itm.name}
              </option>
            ))}
          </select>
        </div>
      </SimpleAccordion>
    )
  }

  return null
}