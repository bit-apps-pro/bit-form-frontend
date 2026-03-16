/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { memo } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { addToBuilderHistory, reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import FieldStyle from '../../styles/FieldStyle.style'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import RepeaterButtonSettings from './CompSettingsUtils/RepeaterButtonSettings'
import SubTitleSettings from './CompSettingsUtils/SubTitleSettings'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

function RepeaterFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  if (!fldKey) return <>No field exist with this field key</>
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)
  const { css } = useFela()
  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''

  function setDefaultRow(e) {
    if (!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.defaultRow
    } else {
      fieldData.defaultRow = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default Row updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_min', state: { fields: allFields, fldKey } })
  }

  function setMinRow(e) {
    if (!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.minRow
    } else {
      fieldData.minRow = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.minRow) fieldData.err.minRow = {}
      fieldData.err.minRow.dflt = `<p style="margin:0">Minimum Repeatable Row is ${e.target.value}<p>`
      fieldData.err.minRow.show = true
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Minimum Row updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_min', state: { fields: allFields, fldKey } })
  }

  function setMaxRow(e) {
    if (!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.maxRow
    } else {
      fieldData.maxRow = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.maxRow) fieldData.err.maxRow = {}
      fieldData.err.maxRow.dflt = `<p style="margin:0">Maximum Repeatable Row is ${e.target.value}</p>`
      fieldData.err.maxRow.show = true
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Maximum Row updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_max', state: { fields: allFields, fldKey } })
  }

  function handleButtonPosition({ target: { value: val } }) {
    if (!IS_PRO) return
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-rpt-wrp`]['flex-direction'] = val
    }))
    fieldData.btnPosition = val
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    addToBuilderHistory({ event: `Button Position changed to ${val}: ${fieldData.txt}`, type: 'set_btn_posn', state: { fields, fldKey } })
    reCalculateFldHeights(fldKey)
  }

  function handleButtonAlignment({ target: { value: val } }) {
    if (!IS_PRO) return
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-pair-btn-wrp`]['align-self'] = val
    }))
    fieldData.btnAlignment = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Button Alignment updated to ${val}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_btn_align', state: { fields: allFields, fldKey } })
  }

  function handleAddToEndBtnAlignment({ target: { value: val } }) {
    if (!IS_PRO) return
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-add-to-end-btn-wrp`]['align-self'] = val
    }))
    if (!fieldData.addToEndBtn) fieldData.addToEndBtn = {}
    fieldData.addToEndBtn.btnAlignment = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Button Alignment updated to ${val}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_to_end_btn_align', state: { fields: allFields, fldKey } })
    reCalculateFldHeights(fldKey)
  }

  function handleButtonView({ target: { value: val } }) {
    if (!IS_PRO) return
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-pair-btn-wrp`]['flex-direction'] = val
    }))
    fieldData.btnView = val
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    addToBuilderHistory({ event: `Button View to ${val}: ${fieldData.txt}`, type: 'set_btn_posn', state: { fields, fldKey } })
    reCalculateFldHeights(fldKey)
  }

  return (
    <div className="">
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      <FieldLabelSettings />

      <FieldSettingsDivider />

      <SubTitleSettings />

      <FieldSettingsDivider />

      <AdminLabelSettings />

      <FieldSettingsDivider />

      <SizeAndPosition />

      <FieldSettingsDivider />

      <HelperTxtSettings />

      <FieldSettingsDivider />

      {/* <RequiredSettings />

      <FieldSettingsDivider /> */}

      <FieldHideSettings />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="rpt-count-stng"
        title="Repeatable Row Count(Min/Max):"
        className={css(FieldStyle.fieldSection)}
        isPro
      >
        {/* <input aria-label="Maximum number for this field" className={css(FieldStyle.input)} type="text" value={placeholder} onChange={setPlaceholder} /> */}
        <div className={css({ mx: 5 })}>
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Default Row:')}</span>
            <input
              data-testid="nmbr-stng-min-inp"
              title="Default Repeatable Row"
              aria-label="Default Repeatable Row"
              placeholder="Type Default Row..."
              // className={css(FieldStyle.inputNumber, FieldStyle.w140)}
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={fieldData.defaultRow}
              onChange={setDefaultRow}
              min={0}
            />
          </div>

          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Minimum Row:')}</span>
            <input
              data-testid="nmbr-stng-min-inp"
              title="Minimum Repeatable Row"
              aria-label="Minimum Repeatable Row"
              placeholder="Type minimum row.."
              // className={css(FieldStyle.inputNumber, FieldStyle.w140)}
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={fieldData.minRow}
              onChange={setMinRow}
              min={0}
            />
          </div>

          {!!Number(fieldData.minRow) && (
            <ErrorMessageSettings
              id="nmbr-stng-min"
              type="minRow"
              title="Min Error Message"
              tipTitle={`By enabling this feature, user will see the error message when repeatable row is less than ${fieldData.minRow}`}
            />
          )}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Maximum Row:')}</span>
            <input
              data-testid="nmbr-stng-max-inp"
              title="Maximum Repeatable Row"
              aria-label="Maximum Repeatable Row"
              placeholder="Type maximun row.."
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={fieldData.maxRow}
              onChange={setMaxRow}
              min={0}
            />
          </div>
          {/* <SingleInput inpType="number" title={__('Max:')} value={max} action={setMax} cls={css(FieldStyle.input)} /> */}
          {!!Number(fieldData.maxRow) && (
            <ErrorMessageSettings
              id="nmbr-stng-max"
              type="maxRow"
              title="Max Error Message"
              tipTitle={`By enabling this feature, user will see the error message when repeatable row is greater than ${fieldData.maxRow}`}
            />
          )}
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="rpt-count-stng"
        title="Button Layout and Position:"
        className={css(FieldStyle.fieldSection)}
        isPro
      >
        {/* <input aria-label="Maximum number for this field" className={css(FieldStyle.input)} type="text" value={placeholder} onChange={setPlaceholder} /> */}
        <div className={css({ mx: 5 })}>
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Button Position:')}</span>
            <select
              data-testid="btn-posn-slct"
              className={css(FieldStyle.input, FieldStyle.w140)}
              name=""
              id=""
              value={fieldData.btnPosition}
              onChange={handleButtonPosition}
            >
              {btnPositionList.map(itm => <option key={`btcd-k-${itm.name}`} value={itm.value}>{itm.name}</option>)}
            </select>
          </div>
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Button Alignment:')}</span>
            <select
              data-testid="btn-algn-slct"
              className={css(FieldStyle.input, FieldStyle.w140)}
              name=""
              id=""
              value={fieldData.btnAlignment}
              onChange={handleButtonAlignment}
            >
              {btnAlignmentList.map(itm => <option key={`btcd-k-${itm.name}`} value={itm.value}>{itm.name}</option>)}
            </select>
          </div>
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Button View:')}</span>
            <select
              data-testid="btn-view-slct"
              className={css(FieldStyle.input, FieldStyle.w140)}
              name=""
              id=""
              value={fieldData.btnView}
              onChange={handleButtonView}
            >
              {btnViewList.map(itm => <option key={`btcd-k-${itm.name}`} value={itm.value}>{itm.name}</option>)}
            </select>
          </div>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />
      <RepeaterButtonSettings
        btnType="addBtn"
        btnName="Add Button"
        switching
      />
      <FieldSettingsDivider />
      <RepeaterButtonSettings
        btnType="removeBtn"
        btnName="Remove Button"
      />
      <FieldSettingsDivider />
      <RepeaterButtonSettings
        btnType="addToEndBtn"
        btnName="Add To End Button"
        switching
        handleButtonAlignment={handleAddToEndBtnAlignment}
        btnAlignmentList={btnAlignmentList}
      />
      <FieldSettingsDivider />

    </div>
  )
}

const btnPositionList = [
  { name: 'Top', value: 'column-reverse' },
  { name: 'Bottom', value: 'column' },
  { name: 'Left', value: 'row-reverse' },
  { name: 'Right', value: 'row' },
]

const btnAlignmentList = [
  { name: 'Start', value: 'start' },
  { name: 'Center', value: 'center' },
  { name: 'End', value: 'end' },
]

const btnViewList = [
  { name: 'Vertical', value: 'column' },
  { name: 'Vertical-reverse', value: 'column-reverse' },
  { name: 'Horizontal', value: 'row' },
  { name: 'Horizontal-Reverse', value: 'row-reverse' },
]

export default memo(RepeaterFieldSettings)
