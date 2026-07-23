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

/**
 * Country Not Found Text Settings Component
 * 
 * Allows users to customize the text displayed when no country is found in search results.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function CountryNotFoundTextSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const { noCountryFoundText } = fieldData.config

  const handleConfigChange = (val: string) => {
    fieldData.config.noCountryFoundText = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Country Not Found Text '${val}': ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'noCountryFoundText_changed',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="cntry-nt-fund-stng"
      title={__('Country Not Found Text')}
      className={css(FieldStyle.fieldSection)}
      proProperty="countryNotFoundText"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="cntry-nt-fund-inp"
          aria-label="Country Not Found Text"
          placeholder="Type no country found text here..."
          className={css(FieldStyle.input)}
          type="text"
          value={noCountryFoundText || ''}
          onChange={e => handleConfigChange(e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}