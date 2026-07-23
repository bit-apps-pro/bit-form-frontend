/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../GlobalStates/AppSettingsStates'
import { $bits, $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, setRequired } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'

import ErrorMessageSettings from '../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

/**
 * Minimum Options Settings Component
 * 
 * Sets the minimum number of checkboxes that must be selected.
 * Only applicable for checkbox field types.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if not applicable
 */
export default function MinimumOptionsSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const bits = useAtomValue($bits)
  const { isPro } = bits

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const min = fieldData.mn || ''
  const globalErrMsg = globalMessages?.err || {}


  const setMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) return

    if (!Number(e.target.value)) {
      delete fieldData.mn
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = globalErrMsg?.[fieldData.typ]?.mn || `<p style="margin:0">Minimum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}<p>`
      fieldData.err.mn.show = true
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Min value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_min',
      state: { fields: allFields, fldKey },
    })

    // Auto-enable required if minimum is set
    if (e.target.value >= '1' && !fieldData.req) {
      setRequired({ target: { checked: true } })
    }
  }

  return (
    <SimpleAccordion
      id="mnmm-stng"
      title={__('Minimum')}
      className={css(FieldStyle.fieldSection)}
      tip="Set minimum number to be selected for checkbox option"
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
          disabled={!isPro}
        />
      </div>

      {fieldData.mn && (
        <ErrorMessageSettings
          id="mnmm-stng"
          type="mn"
          title="Min Error Message"
          tipTitle={`By enabling this feature, user will see the error message when selected checkbox is less than ${fieldData.mn}`}
        />
      )}
    </SimpleAccordion>
  )
}