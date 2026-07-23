/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import ErrorMessageSettings from '../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'


export default function ValueRangeSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const fieldType = fieldData.typ || 'text'
  const inputFieldType = fieldType === 'range' ? 'number' : fieldType
  const adminLabel = fieldData.adminLbl || ''
  const min = fieldData.mn || ''
  const max = fieldData.mx || ''
  const globalErrMsg = globalMessages.err || {}

  const setMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.mn
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = globalErrMsg[fieldData.typ]?.mn || globalErrMsg?.mn || `<p style="margin:0">Minimum number is ${e.target.value}<p>`
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
  }

  const setMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = globalErrMsg[fieldData.typ]?.mx || globalErrMsg?.mx || `<p style="margin:0">Maximum number is ${e.target.value}</p>`
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

  return (
    <SimpleAccordion
      id="nmbr-stng"
      title="Value Range(Min/Max):"
      className={css(FieldStyle.fieldSection)}
      isPro
    >
      <div className={css({ mx: 5 })}>
        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Minimum:')}</span>
          <input
            data-testid="nmbr-stng-min-inp"
            title="Minimum value for this field"
            aria-label="Minimum value for this field"
            placeholder="Type minimum value here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type={inputFieldType}
            value={min}
            onChange={setMin}
          />
        </div>
        {fieldData.mn && (
          <ErrorMessageSettings
            id="nmbr-stng-min"
            type="mn"
            title="Min Error Message"
            tipTitle={`By enabling this feature, user will see the error message when input value is less than ${fieldData.mn}`}
          />
        )}
        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Maximum:')}</span>
          <input
            data-testid="nmbr-stng-max-inp"
            title="Maximum value for this field"
            aria-label="Maximum value for this field"
            placeholder="Type maximun value here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type={inputFieldType}
            value={max}
            onChange={setMax}
          />
        </div>
        {fieldData.mx && (
          <ErrorMessageSettings
            id="nmbr-stng-max"
            type="mx"
            title="Max Error Message"
            tipTitle={`By enabling this feature, user will see the error message when input value is greater than ${fieldData.mx}`}
          />
        )}
      </div>
    </SimpleAccordion>
  )
}