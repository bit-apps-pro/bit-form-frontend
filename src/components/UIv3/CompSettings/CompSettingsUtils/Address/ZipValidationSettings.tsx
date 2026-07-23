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

const ZIP_VALIDATION_OPTIONS = [
  { value: 'auto', label: 'Auto (country-driven)' },
  { value: 'off', label: 'Off' },
  { value: 'custom', label: 'Custom regex' },
]

export default function ZipValidationSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const zipValidation = fieldData.config?.zipValidation || 'auto'
  const zipCustomRegex = fieldData.config?.zipCustomRegex || ''

  const handleModeChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const allFields = create(fields, draft => {
      draft[fldKey].config.zipValidation = value
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `ZIP validation set to '${value}': ${fieldData.lbl || fldKey}`,
      type: 'address_zip_validation_changed',
      state: { fields: allFields, fldKey },
    })
  }

  const handleRegexChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const allFields = create(fields, draft => {
      draft[fldKey].config.zipCustomRegex = value
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `ZIP custom regex updated: ${fieldData.lbl || fldKey}`,
      type: 'address_zip_regex_changed',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="addr-zip-val-stng"
      title={__('ZIP / Postal Validation')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      open
    >
      <div className={css({ px: 6, py: 10 })}>
        {ZIP_VALIDATION_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className={css({ dy: 'flex', alignItems: 'center', gap: 8, mb: 6, cursor: 'pointer' })}
          >
            <input
              type="radio"
              name={`zip-val-${fldKey}`}
              value={opt.value}
              checked={zipValidation === opt.value}
              onChange={handleModeChange}
            />
            {__(opt.label)}
          </label>
        ))}

        {zipValidation === 'custom' && (
          <div className={css({ mt: 8 })}>
            <input
              data-testid="addr-zip-regex-inp"
              className={css(FieldStyle.input)}
              type="text"
              placeholder="e.g. ^\d{5}(-\d{4})?$"
              aria-label={__('Custom ZIP regex pattern')}
              value={zipCustomRegex}
              onChange={handleRegexChange}
            />
          </div>
        )}
      </div>
    </SimpleAccordion>
  )
}
