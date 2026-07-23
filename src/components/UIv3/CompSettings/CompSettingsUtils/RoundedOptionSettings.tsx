/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../GlobalStates/StylesState'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import { assignNestedObj } from '../../../style-new/styleHelpers'
import SingleToggle from '../../../Utilities/SingleToggle'

/**
 * Rounded Option Settings Component
 * 
 * Toggles rounded styling for radio buttons and checkboxes.
 * Changes border-radius between 5px (square) and 50% (round).
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function RoundedOptionSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const isRound = fieldData.round || false

  const setRound = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    const fldClsSelector = fieldData.typ === 'radio' ? 'rdo' : 'ck'
    const path = `fields->${fldKey}->classes->.${fldKey}-${fldClsSelector}->border-radius`

    const newStyles = create(styles, drft => {
      let bdr = '5px'
      if (checked) {
        fieldData.round = true
        bdr = '50%'
        assignNestedObj(drft, path, bdr)
      } else {
        delete fieldData.round
        assignNestedObj(drft, path, bdr)
      }
    })

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })

    setFields(allFields)
    setStyles(newStyles)
    addToBuilderHistory({
      event: `Option rounded ${checked ? 'on' : 'off'}`,
      type: 'set_round',
      state: { fields: allFields, styles: newStyles, fldKey },
    })
  }

  return (
    <div className={`${css(FieldStyle.fieldSection)} ${css({ pr: 36 })}`}>
      <SingleToggle
        id="rnd-stng"
        tip="By disabling this option, the field rounded will be remove"
        title={__('Rounded')}
        action={setRound}
        isChecked={isRound}
      />
    </div>
  )
}