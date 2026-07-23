/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, escapeBackslashPattern, generateBackslashPattern } from '../../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import AutoResizeInput from '../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import ErrorMessageSettings from '../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function InputMaskSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const inputMask = fieldData.valid.inputMask || ''
  const globalErrMsg = globalMessages.err || {}

  const setInputMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!IS_PRO) return

    const { value } = e.target
    if (value === '') {
      delete fieldData.valid.inputMask
    } else {
      fieldData.valid.inputMask = escapeBackslashPattern(value)
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.inputMask) fieldData.err.inputMask = {}
      fieldData.err.inputMask.dflt = globalErrMsg[fieldData.typ]?.inputMask || globalErrMsg?.inputMask || `<p style="margin:0">${__('Pattern not matched')}</p>`
      fieldData.err.inputMask.show = true
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Input Mask updated: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_input_mask',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="inp-msk-stng"
      title={__('Input Mask')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      tip={tippyHelperMsg.inputMask}
      tipProps={{ width: 250, icnSize: 17 }}
    >
      <div className={css(FieldStyle.placeholder)}>
        <AutoResizeInput
          id="input-mask"
          ariaLabel="Input mask for this Field"
          placeholder="e.g. (999) 999-9999"
          list="patterns"
          value={generateBackslashPattern(inputMask)}
          changeAction={setInputMask}
        />
        {inputMask && (
          <ErrorMessageSettings
            id="ptrn-stng-expn"
            type="inputMask"
            title="Error Message"
            tipTitle={tippyHelperMsg.patternsErrMsg}
          />
        )}
      </div>
    </SimpleAccordion>
  )
}