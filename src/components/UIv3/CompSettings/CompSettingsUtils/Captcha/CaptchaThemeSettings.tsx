/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

interface CaptchaThemeSettingsProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string
}

export default function ReCaptchaThemeSettings({
  className = ''
}: CaptchaThemeSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const fieldType = fieldData?.typ ?? 'recaptcha'
  const theme = fieldData?.config?.theme ?? 'light'
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.theme = value
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Theme changed to ${value} : ${adminLabel || fldKey}`,
      type: 'theme_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="thm-stng"
      title={__('Theme')}
      className={`${css(FieldStyle.fieldSection)} ${className}`}
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="thm-slct"
          className={css(FieldStyle.input)}
          aria-label="Theme for Captcha Field"
          placeholder="Select Theme here..."
          value={theme}
          onChange={handleThemeChange}
        >
          {themeOptions[fieldType]?.map(option => (
            <option key={option.value} value={option.value}>
              {__(option.label)}
            </option>
          ))}
        </select>
      </div>
    </SimpleAccordion>
  )
}

const themeOptions = {
  recaptcha: [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ],
  turnstile: [
    { value: 'auto', label: 'Auto' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ],
  hcaptcha: [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ],
}