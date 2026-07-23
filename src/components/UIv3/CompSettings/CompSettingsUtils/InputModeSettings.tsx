/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

const inputModeList = ['none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url']

export default function InputModeSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const inputMode = fieldData.inputMode || 'text'

  const handleInputMode = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    if (value !== '') {
      fieldData.inputMode = value
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Field Input mode update to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'change_input_mode',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="inp-mod-stng"
      title={__('Input mode')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      tip={tippyHelperMsg.inputMode}
      tipProps={{ width: 250, icnSize: 17 }}
      isPro
      proProperty="inputMode"
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="inp-mod-stng-slct"
          className={css(FieldStyle.input)}
          aria-label="Input mode for this Field"
          placeholder="Type field inpur mode here..."
          value={inputMode}
          onChange={handleInputMode}
        >
          {inputModeList.map((itm) => (
            <option key={itm} value={itm}>
              {itm}
            </option>
          ))}
        </select>
      </div>
    </SimpleAccordion>
  )
}