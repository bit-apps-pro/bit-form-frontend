/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

const SCHEME_OPTIONS = [
  { value: 'international', label: 'International' },
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'custom', label: 'Custom' },
]

const SCHEME_CONFIGS: Record<string, { activeFields: string[], labels: Record<string, string> }> = {
  international: {
    activeFields: ['address_1', 'address_2', 'city', 'state', 'zip', 'country'],
    labels: { state: 'State / Province / Region', zip: 'Zip / Postal code' },
  },
  us: {
    activeFields: ['address_1', 'address_2', 'city', 'state', 'zip', 'country'],
    labels: { state: 'State', zip: 'ZIP Code' },
  },
  ca: {
    activeFields: ['address_1', 'address_2', 'city', 'state', 'zip', 'country'],
    labels: { state: 'Province', zip: 'Postal Code' },
  },
  uk: {
    activeFields: ['address_1', 'address_2', 'city', 'zip', 'country'],
    labels: { zip: 'Postcode' },
  },
  au: {
    activeFields: ['address_1', 'address_2', 'city', 'state', 'zip', 'country'],
    labels: { state: 'State / Territory', zip: 'Postcode' },
  },
  custom: {
    activeFields: [],
    labels: {},
  },
}

export default function AddressSchemeSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const scheme = fieldData.config?.scheme || 'international'

  const handleSchemeChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    fieldData.config.scheme = value

    if (value === 'custom') {
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      addToBuilderHistory({
        event: `Address scheme changed to ${value}: ${fieldData.lbl || fldKey}`,
        type: 'address_scheme_changed',
        state: { fields: allFields, fldKey },
      })
      reCalculateFldHeights(fldKey)
      return
    }

    const schemeConfig = SCHEME_CONFIGS[value]
    const childFields = fieldData.childFields || []

    const allFields = create(fields, draft => {
      draft[fldKey].config.scheme = value
      childFields.forEach(({ fldKey: childKey }: { fldKey: string }) => {
        const child = draft[childKey]
        if (!child) return
        const suffix = child.fieldName?.split('[').pop()?.replace(']', '') || ''
        if (schemeConfig.activeFields.length > 0) {
          draft[childKey].isDeactive = !schemeConfig.activeFields.includes(suffix)
        }
        if (schemeConfig.labels[suffix]) {
          draft[childKey].lbl = schemeConfig.labels[suffix]
        }
      })
    })

    setFields(allFields)
    addToBuilderHistory({
      event: `Address scheme changed to ${value}: ${fieldData.lbl || fldKey}`,
      type: 'address_scheme_changed',
      state: { fields: allFields, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }

  return (
    <SimpleAccordion
      id="addr-scheme-stng"
      title={__('Address Scheme')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="addr-scheme-stng-slct"
          className={css(FieldStyle.input)}
          aria-label={__('Address scheme preset')}
          value={scheme}
          onChange={handleSchemeChange}
        >
          {SCHEME_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </SimpleAccordion>
  )
}
