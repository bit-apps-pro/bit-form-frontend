/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

const AUTO_LOCATE_OPTIONS = [
  { value: 'disable', label: 'Disabled' },
  { value: 'page-load', label: 'On Page Load' },
  { value: 'on-click', label: 'On Button Click' },
]

export default function AddressAutoLocateSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const autoLocate = fieldData.config?.autoLocate || 'disable'

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    const allFields = create(fields, draft => {
      draft[fldKey].config.autoLocate = value
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Address auto-locate set to '${value}': ${fieldData.lbl || fldKey}`,
      type: 'address_autolocate_changed',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="addr-auto-locate-stng"
      title={__('Auto Locate')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      tip={__('Use the browser geolocation API to auto-fill the address. Requires HTTPS.')}
      isPro
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="addr-auto-locate-slct"
          className={css(FieldStyle.input)}
          aria-label={__('Auto locate mode')}
          value={autoLocate}
          onChange={handleChange}
        >
          {AUTO_LOCATE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </SimpleAccordion>
  )
}
