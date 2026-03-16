/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../GlobalStates/GlobalStates'
import { addToBuilderHistory, setRequired } from '../../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import FieldStyle from '../../../styles/FieldStyle.style'
import SimpleAccordion from '../StyleCustomize/ChildComp/SimpleAccordion'
import ErrorMessageSettings from './ErrorMessageSettings'

export default function MinimumOptionSettings({ cls, tip, checkIsPro }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const fieldData = deepCopy(fields[fldKey])
  const min = fieldData.mn || ''
  const adminLabel = fieldData.adminLbl || ''
  const { css } = useFela()

  function setMin(e) {
    if (checkIsPro && !IS_PRO) return
    if (!Number(e.target.value)) {
      delete fieldData.mn
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = globalMessages?.err?.[fieldData.typ]?.mn || globalMessages?.err?.mn || `<p style="margin:0">Minimum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}<p>`
      fieldData.err.mn.show = true
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Min value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_min', state: { fields: allFields, fldKey } })
    if (e.target.value >= 1 && !fieldData.req) setRequired({ target: { checked: true } })
  }

  return (
    <SimpleAccordion
      id="mnmm-stng"
      title={__('Minimum')}
      className={`${css(FieldStyle.fieldSection)} ${cls}`}
      tip={tip}
      isPro
      proProperty="mimimumOption"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="mnmm-stng-inp"
          aria-label="Minimum number"
          className={css(FieldStyle.input)}
          value={min}
          type="number"
          onChange={setMin}
          placeholder="Set minimum number"
          disabled={checkIsPro && !IS_PRO}
        />
      </div>

      {min && (
        <ErrorMessageSettings
          id="mnmm-stng"
          type="mn"
          title="Min Error Message"
          tipTitle={`By enabling this feature, user will see the error message when selected checkbox is less than ${min}`}
        />
      )}
    </SimpleAccordion>
  )
}
