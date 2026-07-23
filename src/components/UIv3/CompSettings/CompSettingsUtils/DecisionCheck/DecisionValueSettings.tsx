import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { BaseSettingsProps } from '../../../../../types/DecisionBoxTypes'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

type ValueType = 'checked' | 'unchecked'

interface ValueSettingsProps extends BaseSettingsProps {
  type: ValueType
}

/**
 * Value Settings Component
 * Handles the input for both checked and unchecked state values of Decision Box
 */
export default function ValueSettings({ type }: ValueSettingsProps) {

  const { fieldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fieldKey])


  const { css } = useFela()

  const config = {
    checked: {
      id: 'chek-val-stng',
      title: __('Checked Value'),
      testId: 'chek-val-inp',
      ariaLabel: 'Checked value'
    },
    unchecked: {
      id: 'unchek-val-stng',
      title: __('Unchecked Value'),
      testId: 'unchek-val-inp',
      ariaLabel: 'Unchecked value'
    }
  }

  const settings = config[type]
  const value = fieldData.msg[type]

  const handleValueChange = (newValue: string) => {
    fieldData.msg[type] = newValue
    const allFields = create(fields, draft => { draft[fieldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${type[0].toUpperCase() + type.slice(1)} Value Modified to "${newValue}"`, type: `${type}_value_modify`, state: { fields: allFields, fieldKey } })
  }

  return (
    <SimpleAccordion
      id={settings.id}
      title={settings.title}
      className={css(FieldStyle.fieldSection)}
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid={settings.testId}
          aria-label={settings.ariaLabel}
          className={css(FieldStyle.input)}
          type="text"
          value={value || ''}
          onChange={(e) => handleValueChange(e.target.value)}
        />
      </div>
    </SimpleAccordion>
  )
}