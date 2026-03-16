/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import SimpleAccordion from '../StyleCustomize/ChildComp/SimpleAccordion'
import ErrorMessageSettings from './ErrorMessageSettings'

export default function UniqFieldSettings({ type, title, tipTitle, isUnique, className }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const fieldData = deepCopy(fields[fldKey])

  const setShowErrMsg = e => {
    if (!IS_PRO) return
    const { checked } = e.target
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err[type]) fieldData.err[type] = {}
    if (checked) {
      fieldData.err[type].show = true
      const msg = 'That field value is taken. Try another'
      if (!fieldData.err[type].dflt) fieldData.err[type].dflt = globalMessages?.err?.[fieldData.typ]?.[type] || globalMessages?.err?.[type] || msg
    } else {
      delete fieldData.err[type].show
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${title} ${checked ? 'On' : 'Off'}`, type: title, state: { fields: allFields, fldKey } })
  }

  return (
    <SimpleAccordion
      id={`${type}-stng`}
      title={__(title)}
      className={className}
      tip={tipTitle}
      toggleName={type}
      toggleAction={setShowErrMsg}
      toggleChecked={fieldData?.err?.[type]?.[isUnique]}
      switching
      tipProps={{ width: 200, icnSize: 17 }}
      open={fieldData?.err?.[type]?.[isUnique]}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...IS_PRO && { disable: !fieldData?.err?.[type]?.[isUnique] }}
      isPro
      proProperty={type}
    >
      <ErrorMessageSettings
        id={`${type}-stng`}
        type={type}
        title={title}
        tipTitle={tipTitle}
      />
    </SimpleAccordion>
  )
}
