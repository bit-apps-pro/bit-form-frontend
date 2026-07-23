/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import autofillList from '../../../../Utils/StaticData/autofillList'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function AutoCompleteSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const ac = fieldData?.ac ? fieldData.ac.trim().split(',') : ['Off']

  const setAutoComplete = (value: string) => {
    const splitted = value.split(',')
    let val = ''

    if (splitted.length === 1) {
      val = value
    } else {
      const lastIndx = splitted.length - 1
      if (splitted[lastIndx] === 'on') {
        val = 'on'
      } else if (splitted[lastIndx] === 'off') {
        val = 'off'
      } else if (splitted.includes('on')) {
        splitted.splice(splitted.indexOf('on'), 1)
        val = splitted.join(',')
      } else if (splitted.includes('off')) {
        splitted.splice(splitted.indexOf('off'), 1)
        val = splitted.join(',')
      } else {
        val = value
      }
    }

    if (!val) {
      delete fieldData.ac
    } else {
      fieldData.ac = val
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Auto Complete updated ${val}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `change_autoComplete_${value}`,
      state: { fields: allFields, fldKey },
    })
  }

  const hideAutoComplete = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      fieldData.acHide = true
    } else {
      delete fieldData.acHide
    }

    const req = checked ? 'on' : 'off'
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Auto Complete ${req}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `change_autoComplete_${req}`,
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="ato-cmplt"
      title={__('Auto Complete')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      switching
      tip={tippyHelperMsg.autoComplete}
      tipProps={{ width: 250, icnSize: 17 }}
      toggleAction={hideAutoComplete}
      toggleChecked={fieldData?.acHide}
      open={fieldData?.acHide}
      disable={!fieldData.acHide}
    >
      <div className={css(FieldStyle.placeholder)}>
        <MultiSelect
          data-testid="ato-cmplt-slct"
          defaultValue={ac}
          className={`${css(FieldStyle.multiselectInput)} `}
          placeholder="Select one"
          options={autofillList}
          onChange={(val) => setAutoComplete(val)}
          disableChip
        />
      </div>
    </SimpleAccordion>
  )
}