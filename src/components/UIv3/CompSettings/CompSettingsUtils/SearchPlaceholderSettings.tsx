/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

interface SearchPlaceholderSettingsProps {
  className?: string
  propsFldKey?: string
}

/**
 * Search Placeholder Settings Component
 *
 * Allows users to enable/disable and customize the search placeholder text
 * for dropdown fields with search functionality.
 */
export default function SearchPlaceholderSettings({
  className = '',
  propsFldKey
}: SearchPlaceholderSettingsProps) {
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const showSearchPlaceholder = fieldData?.config?.showSearchPh ?? false
  const searchPlaceholder = fieldData?.config?.searchPlaceholder ?? ''
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleToggleSearchPlaceholder = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      const field = draft[fldKey]
      if (checked) {
        field.config.searchPlaceholder = 'Search Options...'
        field.config.showSearchPh = true
      } else {
        field.config.searchPlaceholder = ''
        field.config.showSearchPh = false
      }
    })

    const actionType = checked ? 'Show' : 'Hide'

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${actionType} Search Placeholder: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `${actionType.toLowerCase()}_placeholder`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleSearchPlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.searchPlaceholder = value
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Search Placeholder updated: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'change_placeholder',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="srch-plchldr-stng"
      title={__('Search Placeholder')}
      className={`${css(FieldStyle.fieldSection, FieldStyle.hover_tip)} ${className}`}
      switching
      tip="By disabling this option, the field search placeholder will be remove"
      tipProps={{ width: 250, icnSize: 17 }}
      toggleAction={handleToggleSearchPlaceholder}
      toggleChecked={showSearchPlaceholder}
      open={showSearchPlaceholder}
      disable={!showSearchPlaceholder }
      proProperty="searchPlaceholder"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="srch-plchldr-stng-inp"
          aria-label="Placeholder for Search"
          placeholder="Type Placeholder here..."
          className={css(FieldStyle.input)}
          type="text"
          value={searchPlaceholder}
          onChange={handleSearchPlaceholderChange}
        />
      </div>
    </SimpleAccordion>
  )
}