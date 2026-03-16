/* eslint-disable react/jsx-props-no-spreading */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../GlobalStates/GlobalStates'
import ut from '../../../styles/2.utilities'
import FieldStyle from '../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { addDefaultStyleClasses } from '../../style-new/styleHelpers'
import SingleToggle from '../../Utilities/SingleToggle'
import SimpleAccordion from '../StyleCustomize/ChildComp/SimpleAccordion'
import ErrorMessageSettings from './ErrorMessageSettings'

export default function OtherOptionSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()

  const adminLabel = fieldData.adminLbl || ''

  const toggleAddOtherOption = (e) => {
    if (!IS_PRO) return
    if (e.target.checked) {
      fieldData.addOtherOpt = true
      fieldData.valid.otherOptReq = true
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.otherOptReq) fieldData.err.otherOptReq = {}
      fieldData.err.otherOptReq.dflt = globalMessages?.err?.otherOptReq || '<p style="margin:0">Custom Option Required</p>'
      fieldData.err.otherOptReq.show = true
      addDefaultStyleClasses(fldKey, 'otherOptions')
    } else {
      delete fieldData.valid.otherOptReq
      delete fieldData.addOtherOpt
    }
    const evnt = e.target.checked ? 'Add' : 'Remove'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${evnt} Other Option: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `${evnt.toLowerCase()}_Other_Option`,
      state: { fields: allFields, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }

  const toggleOtherOptReq = (e) => {
    if (e.target.checked) {
      fieldData.valid.otherOptReq = true
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.otherOptReq) fieldData.err.otherOptReq = {}
      fieldData.err.otherOptReq.dflt = '<p style="margin:0">Custom Option Required</p>'
      fieldData.err.otherOptReq.show = true
    } else {
      delete fieldData.valid.otherOptReq
    }

    const evnt = e.target.checked ? 'Requred' : 'Optional'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${evnt} Required Other Option: ${fieldData.lbl || adminLabel || fldKey}`, type: `${evnt.toLowerCase()}_Other_Option`, state: { fields: allFields, fldKey } })
  }

  const toggleOtherInpPh = (e) => {
    if (e.target.checked) {
      fieldData.otherInpPh = 'Write Custom Option...'
      fieldData.otherPhShow = true
    } else {
      fieldData.otherPhShow = false
      delete fieldData.otherInpPh
    }
    const req = e.target.checked ? 'Show' : 'Hide'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${req} Placeholder: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req.toLowerCase()}_placeholder`, state: { fields: allFields, fldKey } })
  }

  const otherOptionLabel = (e) => {
    fieldData.otherOptLbl = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Other Option Label updated: ${fieldData.lbl || adminLabel || fldKey}`, type: 'change_other_option_label', state: { fields: allFields, fldKey } })
  }

  function setOtherInpPlaceholder(e) {
    if (e.target.value === '') {
      delete fieldData.otherInpPh
    } else {
      fieldData.otherInpPh = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Other Input Placeholder updated: ${fieldData.lbl || adminLabel || fldKey}`, type: 'change_placeholder', state: { fields: allFields, fldKey } })
  }

  return (
    <SimpleAccordion
      id="other-opt-stng"
      title={__('Allow Other Option')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      switching
      tip="An option will be added as labelled 'Other...' to get custom input from the user"
      tipProps={{ width: 250, icnSize: 17 }}
      toggleAction={toggleAddOtherOption}
      toggleChecked={fieldData?.addOtherOpt}
      open={fieldData?.addOtherOpt}
      {...IS_PRO && { disable: !fieldData?.addOtherOpt }}
      isPro
      proProperty="otherOption"
    >
      <div className={css(FieldStyle.placeholder)}>
        <div className={css({ flx: 'center-between', my: 5 })}>
          <span className={css(FieldStyle.title, { w: '150px', ml: 0 })}>Option Label</span>
          <input
            data-testid="other-opt-inp"
            aria-label="Other Option Label"
            placeholder="Type Option Label here..."
            className={css(FieldStyle.input, { mt: 5 })}
            type="text"
            value={fieldData.otherOptLbl || ''}
            onChange={otherOptionLabel}
          />
        </div>
        <div className={css({ flx: 'center-between', my: 5 })}>
          <span>Required Custom Input</span>
          <SingleToggle id="req-other-opt" className={css(ut.mr2)} name="req-other-opt" action={toggleOtherOptReq} isChecked={!!fieldData.valid.otherOptReq} />
        </div>
        {fieldData.valid.otherOptReq && (
          <ErrorMessageSettings
            id="other-opt-stng"
            type="otherOptReq"
            title="Error Message"
            tipTitle="By enabling this feature, user will see the error message when input is empty"
          />
        )}

        <div className={css({ flx: 'center-between', my: 5 })}>
          <span>Input Placeholder</span>
          <SingleToggle id="other-inp-ph" className={css(ut.mr2)} name="other-inp-ph" action={toggleOtherInpPh} isChecked={!!fieldData.otherPhShow} />
        </div>

        {fieldData.otherPhShow && (
          <input
            data-testid="othep-ph-inp"
            aria-label="Placeholer for Other Input"
            placeholder="Type Placeholder here..."
            className={css(FieldStyle.input)}
            type="text"
            value={fieldData.otherInpPh || ''}
            onChange={setOtherInpPlaceholder}
          />
        )}
      </div>
    </SimpleAccordion>
  )
}
