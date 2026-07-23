import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../GlobalStates/StylesState'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import FieldStyle from '../../../../styles/FieldStyle.style'
import ErrorMessageSettings from '../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import FieldSettingsDivider from '../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import RepeaterButtonSettings from '../../../CompSettings/CompSettingsUtils/RepeaterButtonSettings'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

export default function RepeaterFieldBasicSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''

  function setDefaultRow(e: React.ChangeEvent<HTMLInputElement>) {
    if (!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.defaultRow
    } else {
      fieldData.defaultRow = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Default Row updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_default_row',
      state: { fields: allFields, fldKey }
    })
  }

  function setMinRow(e: React.ChangeEvent<HTMLInputElement>) {
    if (!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.minRow
    } else {
      fieldData.minRow = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.minRow) fieldData.err.minRow = {}
      fieldData.err.minRow.dflt = `<p style="margin:0">Minimum Repeatable Row is ${e.target.value}</p>`
      fieldData.err.minRow.show = true
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Minimum Row updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_min',
      state: { fields: allFields, fldKey }
    })
  }

  function setMaxRow(e: React.ChangeEvent<HTMLInputElement>) {
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
    addToBuilderHistory({
      event: `Maximum Row updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_max',
      state: { fields: allFields, fldKey }
    })
  }

  function handleButtonPosition({ target: { value: val } }: React.ChangeEvent<HTMLSelectElement>) {
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-rpt-wrp`]['flex-direction'] = val
    }))
    fieldData.btnPosition = val
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    addToBuilderHistory({
      event: `Button Position changed to ${val}: ${fieldData.txt}`,
      type: 'set_btn_posn',
      state: { fields, fldKey }
    })
    reCalculateFldHeights(fldKey)
  }

  function handleButtonAlignment({ target: { value: val } }: React.ChangeEvent<HTMLSelectElement>) {
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-pair-btn-wrp`]['align-self'] = val
    }))
    fieldData.btnAlignment = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Button Alignment updated to ${val}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_btn_align',
      state: { fields: allFields, fldKey }
    })
  }

  function handleAddToEndBtnAlignment({ target: { value: val } }: React.ChangeEvent<HTMLSelectElement>) {
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-add-to-end-btn-wrp`]['align-self'] = val
    }))
    if (!fieldData.addToEndBtn) fieldData.addToEndBtn = {}
    fieldData.addToEndBtn.btnAlignment = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Add To End Button Alignment updated to ${val}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_to_end_btn_align',
      state: { fields: allFields, fldKey }
    })
    reCalculateFldHeights(fldKey)
  }

  function handleButtonView({ target: { value: val } }: React.ChangeEvent<HTMLSelectElement>) {
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-pair-btn-wrp`]['flex-direction'] = val
    }))
    fieldData.btnView = val
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    addToBuilderHistory({
      event: `Button View changed to ${val}: ${fieldData.txt}`,
      type: 'set_btn_view',
      state: { fields, fldKey }
    })
    reCalculateFldHeights(fldKey)
  }

  return (
    <>
      {/* Repeatable Row Count (Min/Max) */}
      <SimpleAccordion
        id="rpt-count-stng"
        title="Repeatable Row Count(Min/Max):"
        className={css(FieldStyle.fieldSection)}
        isPro
      >
        <div className={css({ mx: 5 })}>
          {/* Default Row */}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Default Row:')}</span>
            <input
              data-testid="dflt-row-inp"
              title="Default Repeatable Row"
              aria-label="Default Repeatable Row"
              placeholder="Type Default Row..."
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={fieldData.defaultRow || ''}
              onChange={setDefaultRow}
              min={0}
            />
          </div>

          {/* Minimum Row */}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Minimum Row:')}</span>
            <input
              data-testid="min-row-inp"
              title="Minimum Repeatable Row"
              aria-label="Minimum Repeatable Row"
              placeholder="Type minimum row..."
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={fieldData.minRow || ''}
              onChange={setMinRow}
              min={0}
            />
          </div>

          {!!Number(fieldData.minRow) && (
            <ErrorMessageSettings
              id="min-row-err"
              type="minRow"
              title="Min Error Message"
              tipTitle={`By enabling this feature, user will see the error message when repeatable row is less than ${fieldData.minRow}`}
            />
          )}

          {/* Maximum Row */}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Maximum Row:')}</span>
            <input
              data-testid="max-row-inp"
              title="Maximum Repeatable Row"
              aria-label="Maximum Repeatable Row"
              placeholder="Type maximum row..."
              className={css(FieldStyle.input, FieldStyle.w140)}
              type="number"
              value={fieldData.maxRow || ''}
              onChange={setMaxRow}
              min={0}
            />
          </div>

          {!!Number(fieldData.maxRow) && (
            <ErrorMessageSettings
              id="max-row-err"
              type="maxRow"
              title="Max Error Message"
              tipTitle={`By enabling this feature, user will see the error message when repeatable row is greater than ${fieldData.maxRow}`}
            />
          )}
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* Button Layout and Position */}
      <SimpleAccordion
        id="btn-layout-posn-stng"
        title="Button Layout and Position:"
        className={css(FieldStyle.fieldSection)}
      >
        <div className={css({ mx: 5 })}>
          {/* Button Position */}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Button Position:')}</span>
            <select
              data-testid="btn-posn-slct"
              className={css(FieldStyle.input, FieldStyle.w140)}
              value={fieldData.btnPosition || 'column'}
              onChange={handleButtonPosition}
            >
              {btnPositionList.map(itm => (
                <option key={`btn-posn-${itm.name}`} value={itm.value}>
                  {itm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Button Alignment */}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Button Alignment:')}</span>
            <select
              data-testid="btn-algn-slct"
              className={css(FieldStyle.input, FieldStyle.w140)}
              value={fieldData.btnAlignment || 'center'}
              onChange={handleButtonAlignment}
            >
              {btnAlignmentList.map(itm => (
                <option key={`btn-algn-${itm.name}`} value={itm.value}>
                  {itm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Button View */}
          <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
            <span>{__('Button View:')}</span>
            <select
              data-testid="btn-view-slct"
              className={css(FieldStyle.input, FieldStyle.w140)}
              value={fieldData.btnView || 'column'}
              onChange={handleButtonView}
            >
              {btnViewList.map(itm => (
                <option key={`btn-view-${itm.name}`} value={itm.value}>
                  {itm.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* Add Button */}
      <RepeaterButtonSettings
        btnType="addBtn"
        btnName="Add Button"
        switching
      />

      <FieldSettingsDivider />

      {/* Remove Button */}
      <RepeaterButtonSettings
        btnType="removeBtn"
        btnName="Remove Button"
      />

      <FieldSettingsDivider />

      {/* Add To End Button */}
      <RepeaterButtonSettings
        btnType="addToEndBtn"
        btnName="Add To End Button"
        switching
        handleButtonAlignment={handleAddToEndBtnAlignment}
        btnAlignmentList={btnAlignmentList}
      />

    </>
  )
}

// Button Position Options
const btnPositionList = [
  { name: 'Top', value: 'column-reverse' },
  { name: 'Bottom', value: 'column' },
  { name: 'Left', value: 'row-reverse' },
  { name: 'Right', value: 'row' },
]

// Button Alignment Options
const btnAlignmentList = [
  { name: 'Start', value: 'start' },
  { name: 'Center', value: 'center' },
  { name: 'End', value: 'end' },
]

// Button View Options
const btnViewList = [
  { name: 'Vertical', value: 'column' },
  { name: 'Vertical-reverse', value: 'column-reverse' },
  { name: 'Horizontal', value: 'row' },
  { name: 'Horizontal-Reverse', value: 'row-reverse' },
]