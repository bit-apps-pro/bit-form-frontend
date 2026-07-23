// TurnstileLanguageSetting.tsx
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import turnstileLanguage from '../../../../../Utils/StaticData/turnstileLanguage'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function CaptchaLanguageSetting() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const { css } = useFela()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { language } = fieldData.config

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
      id="language-stng"
      title={__('Language')}
      className={css(FieldStyle.fieldSection)}
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="turnstile-language"
          className={css(FieldStyle.input)}
          aria-label="Language for Turnstile Field"
          placeholder="Select Language here..."
          value={language}
          onChange={(e) => setConfigValue('language', e.target.value)}
        >
          {turnstileLanguage.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </SimpleAccordion>
  )
}