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

interface CaptchaSizeSettingsProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string
}

export default function CaptchaSizeSettings({
  className = ''
}: CaptchaSizeSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const size = fieldData?.config?.size ?? 'normal'
  const adminLabel = fieldData?.adminLbl ?? ''

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config.size = value
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Size changed to ${value} : ${adminLabel || fldKey}`,
      type: 'size_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="siz-stng"
      title={__('Size')}
      className={`${css(FieldStyle.fieldSection)} ${className}`}
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="siz-slct"
          className={css(FieldStyle.input)}
          aria-label="Size for ReCaptcha Field"
          placeholder="Select Size here..."
          value={size}
          onChange={handleSizeChange}
        >
          <option value="normal">{__('Normal')}</option>
          <option value="compact">{__('Compact')}</option>
        </select>
      </div>
    </SimpleAccordion>
  )
}