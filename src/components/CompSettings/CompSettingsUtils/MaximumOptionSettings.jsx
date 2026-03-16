/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import FieldStyle from '../../../styles/FieldStyle.style'
import SingleToggle from '../../Utilities/SingleToggle'
import SimpleAccordion from '../StyleCustomize/ChildComp/SimpleAccordion'
import ErrorMessageSettings from './ErrorMessageSettings'

export default function MaximumOptionSettings({ cls, tip, checkIsPro }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const fieldData = deepCopy(fields[fldKey])
  const max = fieldData.mx || ''
  const adminLabel = fieldData.adminLbl || ''
  const { css } = useFela()

  function setMax(e) {
    if (checkIsPro && !IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = globalMessages?.err?.[fieldData.typ]?.mx || globalMessages?.err?.mx || `<p style="margin:0">Maximum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}</p>`
      fieldData.err.mx.show = true
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Max value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_max', state: { fields: allFields, fldKey } })
  }

  const setDisabledOnMax = e => {
    if (checkIsPro && !IS_PRO) return
    if (e.target.checked) {
      fieldData.valid.disableOnMax = true
    } else {
      delete fieldData.valid.disableOnMax
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Disable on max selected ${e.target.checked ? 'on' : 'off'}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_disable_on_max', state: { fields: allFields, fldKey } })
  }

  return (
    <SimpleAccordion
      id="mxmm-stng"
      title={__('Maximum')}
      className={`${css(FieldStyle.fieldSection)} ${cls}`}
      tip={tip}
      isPro
      proProperty="maximumOption"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="mxmm-stng-inp"
          aria-label="Maximum number"
          className={css(FieldStyle.input)}
          value={max}
          type="number"
          onChange={setMax}
          placeholder="Set maximum number"
          disabled={checkIsPro && !IS_PRO}
        />
      </div>

      {max && (
        <>
          <ErrorMessageSettings
            id="mxmm-stng"
            type="mx"
            title="Max Error Message"
            tipTitle={`By enabling this feature, user will see the error message when selected checkbox is greater than ${max}`}
          />
          <SingleToggle id="mxmm-slctd" title={__('Disable if maximum selected:')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={checkIsPro && !IS_PRO} className="mt-3 mb-2" />
        </>
      )}
    </SimpleAccordion>
  )
}
