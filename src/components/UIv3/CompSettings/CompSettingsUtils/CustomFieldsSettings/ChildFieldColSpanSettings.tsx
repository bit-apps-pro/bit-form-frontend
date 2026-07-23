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

/**
 * Address Child Column Width Settings Component
 *
 * Controls the column span of an individual address sub-field within the
 * 12-column grid layout. Only meaningful when the parent field is of type
 * "address".
 *
 * @param propsFldKey - Optional field key override; falls back to the route param.
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing.
 */
export default function ChildFieldColSpanSettings({ propsFldKey }: { propsFldKey?: string } = {}) {
  const { css } = useFela()
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])

  const handleColSpanChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    const allFields = create(fields, draft => {
      draft[fldKey].colSpan = parseInt(value, 10)
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Column width changed: ${fieldData.lbl || fldKey}`,
      type: 'address_child_colspan_changed',
      state: { fields: allFields, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }

  return (
    <div
      className={css(FieldStyle.fieldSection)}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`col-span-${fldKey}`}>{__('Column Width')}</label>
      <select
        id={`col-span-${fldKey}`}
        value={fieldData.colSpan ?? 12}
        onChange={handleColSpanChange}
        className={css(FieldStyle.multiselectInput)}
        style={{ width: '50%' }}
      >
        <option value={12}>{__('Full (12)')}</option>
        <option value={9}>{__('3/4 (9)')}</option>
        <option value={8}>{__('2/3 (8)')}</option>
        <option value={6}>{__('Half (6)')}</option>
        <option value={4}>{__('1/3 (4)')}</option>
        <option value={3}>{__('1/4 (3)')}</option>
      </select>
    </div>
  )
}
