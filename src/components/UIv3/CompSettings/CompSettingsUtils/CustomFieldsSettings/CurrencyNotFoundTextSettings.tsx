import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function CurrencyNotFoundTextSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const { noCurrencyFoundText } = fieldData.config

  const handleConfigChange = (val: string) => {
    fieldData.config.noCurrencyFoundText = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Currency Not Found Text '${val}': ${fieldData.lbl || fldKey}`,
      type: 'noCurrencyFoundText_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="crncy-nt-fund-stng"
      title={__('Currency Not Found Text')}
      className={css(FieldStyle.fieldSection)}
      proProperty="currencyNotFoundText"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="crncy-nt-fund-inp"
          aria-label="Currency Not Found Text"
          placeholder="Type no Currency found text here..."
          className={css(FieldStyle.input)}
          type="text"
          value={noCurrencyFoundText || ''}
          onChange={e => handleConfigChange(e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}