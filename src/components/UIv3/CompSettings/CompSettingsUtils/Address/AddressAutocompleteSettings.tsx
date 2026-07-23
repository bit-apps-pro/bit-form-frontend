/* eslint-disable no-param-reassign */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { isAutocompleteKeyMissing } from '../../../../../GlobalStates/AddressApiKeysState'
import { $fieldConfigModal, $fields } from '../../../../../GlobalStates/GlobalStates'
import useAddressApiKeys from '../../../../../hooks/useAddressApiKeys'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

const AUTOCOMPLETE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'nominatim', label: 'OpenStreetMap (Nominatim)' },
  { value: 'google', label: 'Google Places' },
  { value: 'mapbox', label: 'Mapbox' },
]

export default function AddressAutocompleteSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { keys } = useAddressApiKeys()
  const setFieldConfigModal = useSetAtom($fieldConfigModal)

  const openKeyModal = () => setFieldConfigModal({ show: true, fieldType: 'address', onConfigured: null })

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const autocomplete = fieldData.config?.autocomplete || 'none'
  const needsKeyProvider = autocomplete === 'google' || autocomplete === 'mapbox'
  const keyMissing = isAutocompleteKeyMissing(fieldData.config, keys)

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    const allFields = create(fields, draft => {
      draft[fldKey].config.autocomplete = value
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Address autocomplete provider set to '${value}': ${fieldData.lbl || fldKey}`,
      type: 'address_autocomplete_changed',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="addr-autocmpl-stng"
      title={__('Address Autocomplete')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      tip={__('Provider for address lookup suggestions. Nominatim is free. Google and Mapbox require an API key.')}
      open
      isPro
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="addr-autocmpl-stng-slct"
          className={css(FieldStyle.input)}
          aria-label={__('Address autocomplete provider')}
          value={autocomplete}
          onChange={handleChange}
        >
          {AUTOCOMPLETE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {autocomplete === 'nominatim' && (
        <small style={{ display: 'block', marginTop: 6, color: 'var(--bf-text-clr-gray)' }}>
          {__('Nominatim is free but rate-limited. Do not use for high-traffic forms.')}
        </small>
      )}
      {needsKeyProvider && (
        keyMissing ? (
          <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 6, background: 'rgba(255, 168, 0, 0.08)', border: '1px solid rgba(255, 168, 0, 0.35)' }}>
            <small style={{ display: 'block', color: 'var(--bf-text-clr-gray)', marginBottom: 6 }}>
              {__('This provider needs an API key to work. Add the key once and all Address fields will use it (a per-field key overrides it).')}
            </small>
            <button
              type="button"
              data-testid="addr-autocmpl-setup-key-btn"
              onClick={openKeyModal}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--bf-primary-color, #0066ff)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {__('Set up API Key')}
            </button>
          </div>
        ) : (
          <small style={{ display: 'block', marginTop: 6, color: 'var(--bf-success-clr, #1a9d54)' }}>
            {__('✓ API key configured.')}
            {' '}
            <button
              type="button"
              data-testid="addr-autocmpl-edit-key-btn"
              onClick={openKeyModal}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--bf-primary-color, #0066ff)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {__('Edit key')}
            </button>
          </small>
        )
      )}
    </SimpleAccordion>
  )
}
