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
import SingleToggle from '../../../../Utilities/SingleToggle'

/**
 * Button Full Width Settings Component
 * Handles the toggle for button full width configuration
 */
export default function ButtonFullWidthSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const { fulW } = fieldData

  const setFulW = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`].width = e.target.checked ? '100%' : 'auto'
    }))
    fieldData.fulW = e.target.checked
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Button Full width ${e.target.checked ? 'on' : 'off'}`,
      type: 'set_btn_full',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <div className={css(FieldStyle.fieldSection, { pr: '36px' })}>
      <SingleToggle
        id="ful-wid-btn"
        tip="By disabling this option, the button full width will be remove"
        title={__('Full Width')}
        action={setFulW}
        isChecked={fulW || ''}
      />
    </div>
  )
}