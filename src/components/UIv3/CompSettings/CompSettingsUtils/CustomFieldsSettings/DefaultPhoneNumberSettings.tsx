import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import tippyHelperMsg from '../../../../../Utils/StaticData/tippyHelperMsg'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function DefaultPhoneNumberSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''

  const setDefaultValue = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '') delete fieldData.defaultValue
    else fieldData.defaultValue = value

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Default value updated: ${value || fieldData.lbl || adminLabel || fldKey}`,
      type: 'change_defaultValue',
      state: { fields: allFields, fldKey }
    })
  }

  const hideDefaultValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      fieldData.defaultValueHide = true
    } else {
      fieldData.defaultValueHide = false
      delete fieldData.defaultValue
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Default value ${req}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `${req.toLowerCase()}_defaultValue`,
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="dflt-val-stng"
      title={__('Default Phone Number')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      switching
      tip={tippyHelperMsg.defaultValue}
      tipProps={{ width: 250, icnSize: 17 }}
      toggleAction={hideDefaultValue}
      toggleChecked={fieldData?.defaultValueHide || false}
      open={fieldData?.defaultValueHide || false}
      disable={!fieldData?.defaultValueHide }
      proProperty="defaultValue"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="dflt-val-stng-inp"
          aria-label="Default value for this Field"
          placeholder="Type a phone number.. (Ex: +01 555 1523)"
          className={css(FieldStyle.input)}
          type="text"
          value={fieldData?.defaultValue || ''}
          onChange={setDefaultValue}
        />
      </div>
    </SimpleAccordion>
  )
}