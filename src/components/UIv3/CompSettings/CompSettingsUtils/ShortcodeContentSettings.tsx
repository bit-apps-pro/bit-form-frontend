import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../Utils/i18nwrap'
import ut from '../../../../styles/2.utilities'
import FieldStyle from '../../../../styles/FieldStyle.style'
import AutoResizeInput from '../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import Cooltip from '../../../Utilities/Cooltip'

/**
 * Shortcode Content Settings Component
 * Handles the shortcode input interface for Shortcode fields
 */
export default function ShortcodeContentSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = fields[fldKey]

  const setContent = (val: string) => {
    const allFields = create(fields, draft => {
      draft[fldKey].content = val
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Shortcode Change to: ${val}`,
      type: 'shortcode_content_change',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <div className={css(FieldStyle.fieldSection)}>
      <div className={css(ut.flxcb)}>
        <div className={css(ut.flxc)}>
          <b>Shortcode: </b>
          <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
            <div className={css(ut.tipBody)}>
              {__('Enter the shortcode in this Input. ')}
            </div>
          </Cooltip>
        </div>
      </div>

      <AutoResizeInput
        id="admn-lbl-stng"
        ariaLabel="Admin label for this Field"
        placeholder="Ex: [type_shortcode]"
        value={fieldData.content}
        changeAction={(e) => setContent(e.target.value)}
      />
    </div>
  )
}