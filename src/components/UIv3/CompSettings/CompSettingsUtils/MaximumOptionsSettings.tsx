/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../GlobalStates/AppSettingsStates'
import { $bits, $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import ErrorMessageSettings from '../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import SingleToggle from '../../../Utilities/SingleToggle'

/**
 * Maximum Options Settings Component
 * 
 * Sets the maximum number of checkboxes that can be selected.
 * Includes option to disable remaining checkboxes when max is reached.
 * Only applicable for checkbox field types.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if not applicable
 */
export default function MaximumOptionsSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const bits = useAtomValue($bits)
  const { isPro } = bits

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const max = fieldData.mx || ''
  const globalErrMsg = globalMessages?.err || {}

  const setMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) return

    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = globalErrMsg?.[fieldData.typ]?.mx || `<p style="margin:0">Maximum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}</p>`
      fieldData.err.mx.show = true
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Max value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_max',
      state: { fields: allFields, fldKey },
    })
  }

  const setDisabledOnMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) return

    if (e.target.checked) {
      fieldData.valid.disableOnMax = true
    } else {
      delete fieldData.valid.disableOnMax
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Disable on max selected ${e.target.checked ? 'on' : 'off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_disable_on_max',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="mxmm-stng"
      title={__('Maximum')}
      className={css(FieldStyle.fieldSection)}
      tip="Set maximum number to be selected for checkbox option"
      isPro
      proProperty="maximumOption"
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="mxmm-stng-inp"
          aria-label="maximim number"
          className={css(FieldStyle.input)}
          value={max}
          type="number"
          onChange={setMax}
          disabled={!isPro}
        />
      </div>

      {fieldData.mx && (
        <>
          <ErrorMessageSettings
            id="mxmm-stng"
            type="mx"
            title="Max Error Message"
            tipTitle={`By enabling this feature, user will see the error message when selected checkbox is greater than ${fieldData.mx}`}
          />
          <SingleToggle
            id="mxmm-slctd"
            title={__('Disable if maximum selected:')}
            action={setDisabledOnMax}
            isChecked={fieldData.valid.disableOnMax}
            disabled={!isPro}
            className="mt-3 mb-2"
          />
        </>
      )}
    </SimpleAccordion>
  )
}