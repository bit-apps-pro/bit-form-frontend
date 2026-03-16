/* eslint-disable jsx-a11y/control-has-associated-label */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useEffect } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $builderHookStates, $fields } from '../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import Cooltip from '../Utilities/Cooltip'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import AutoResizeInput from './CompSettingsUtils/AutoResizeInput'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

export default function ShortcodeFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const setBuilderHookState = useSetAtom($builderHookStates)
  const fieldData = fields[fldKey]
  const { css } = useFela()

  const setContent = val => {
    const allFields = create(fields, draft => { draft[fldKey].content = val })
    setFields(allFields)
    addToBuilderHistory({
      event: `Shortcode Change to: ${val}`,
      type: 'shortcode_content_change',
      state: { fields: allFields, fldKey },
    })
  }

  const setBuilderFldWrpHeight = () => {
    setBuilderHookState(olds => ({ ...olds, reCalculateSpecificFldHeight: { fieldKey: fldKey, counter: olds.reCalculateSpecificFldHeight.counter + 1 } }))
  }

  useEffect(() => {
    setBuilderFldWrpHeight()
  }, [fieldData.content])

  return (
    <div>
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />
      <AdminLabelSettings />
      <FieldSettingsDivider />
      <SizeAndPosition />
      <FieldSettingsDivider />

      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(ut.flxcb)}>
          <div className={css(ut.flxc)}>
            <b>Shortcode: </b>
            <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
              <div className={css(ut.tipBody)}>{__('Enter the shortcode in this Input. ')}</div>
            </Cooltip>
          </div>
        </div>

        <AutoResizeInput
          id="admn-lbl-stng"
          ariaLabel="Admin label for this Field"
          placeholder="Ex: [type_shortcode]"
          value={fieldData.content}
          changeAction={e => setContent(e.target.value)}
        />

      </div>

      <FieldSettingsDivider />

      <FieldHideSettings />

      <FieldSettingsDivider />

    </div>
  )
}
