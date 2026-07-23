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

const MAP_MODE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'preview', label: 'Preview' },
  { value: 'interactive', label: 'Interactive' },
]

export default function AddressShowMapSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const showMap = fieldData.config?.showMap || 'none'

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    const allFields = create(fields, draft => {
      draft[fldKey].config.showMap = value
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Show map set to '${value}': ${fieldData.lbl || fldKey}`,
      type: 'address_show_map_changed',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="addr-show-map-stng"
      title={__('Show Map')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      tip={__('Embed a Google Map below the address fields. Preview shows the selected location; Interactive lets users click or drag the pin to set the address.')}
      isPro
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="addr-show-map-slct"
          className={css(FieldStyle.input)}
          aria-label={__('Map mode')}
          value={showMap}
          onChange={handleChange}
        >
          {MAP_MODE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </SimpleAccordion>
  )
}
