// TurnstileAppearanceSetting.tsx
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


export default function TurnstileAppearanceSetting() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const { css } = useFela()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { appearance } = fieldData.config

  const setConfigValue = (propName: string, value: string) => {
    fieldData.config[propName] = value
    const allFields = create(fields, (draft) => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propName[0].toUpperCase() + propName.slice(1)} changed to ${value} : ${fieldData.adminLbl || fldKey}`,
      type: `${propName}_change`,
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="appearance-stng"
      title={__('Appearance')}
      className={css(FieldStyle.fieldSection)}
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="turnstile-appearance"
          className={css(FieldStyle.input)}
          aria-label="Appearance for Turnstile Field"
          placeholder="Select appearance here..."
          value={appearance}
          onChange={(e) => setConfigValue('appearance', e.target.value)}
        >
          <option value="always">{__('Always (default)')}</option>
          <option value="interaction-only">{__('Interaction Only')}</option>
        </select>
      </div>
    </SimpleAccordion>
  )
}