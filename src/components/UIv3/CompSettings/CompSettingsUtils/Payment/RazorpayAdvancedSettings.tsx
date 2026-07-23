/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../../GlobalStates/StylesState'
import TrashIcn from '../../../../../Icons/TrashIcn'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import CheckBox from '../../../../Utilities/CheckBox'
import SelectBox2 from '../../../../Utilities/SelectBox2'
import SingleInput from '../../../../Utilities/SingleInput'
import SingleToggle from '../../../../Utilities/SingleToggle'

interface RazorpayAdvancedSettingsProps {
  /**
   * Additional CSS class names
   */
  className?: string
}

interface Note {
  key?: string
  value?: string
}

export default function RazorpayAdvancedSettings({
  className = ''
}: RazorpayAdvancedSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const newOrderId = fieldData?.newOrderId || false
  const fieldLabel = fieldData?.lbl ?? ''

  // Initialize payment notes state
  const [payNotes, setPayNotes] = useState<Note[]>(() => {
    if (fieldData?.options?.notes) {
      return Object.entries(fieldData.options.notes).map(([key, value]) => ({
        key,
        value: value as string
      }))
    }
    return [{}]
  })

  const pos = [
    { name: __('Left'), value: 'left' },
    { name: __('Center'), value: 'center' },
    { name: __('Right'), value: 'right' },
  ]

  // Get specified field types
  const getSpecifiedFields = (type: string) => {
    let pattern: RegExp
    if (type === 'desc') {
      pattern = /text|username/g
    } else if (type === 'email') {
      pattern = /text|email/g
    } else if (type === 'number') {
      pattern = /number/g
    } else if (type === 'orderId') {
      pattern = /text|radio|select|html-select/g
    } else {
      return []
    }

    const formFields = Object.entries(fields)
    const filteredFields = formFields.filter(field => field[1].typ.match(pattern))
    return filteredFields.map(itm => (
      <option key={itm[0]} value={itm[0]}>
        {itm[1].adminLbl || itm[1].lbl}
      </option>
    ))
  }

  const handleInput = (name: string, value: string, type?: string): void => {
    const updatedFields = create(fields, draft => {
      if (!draft[fldKey].options) {
        draft[fldKey].options = {}
      }

      if (type) {
        if (!draft[fldKey].options[type]) {
          draft[fldKey].options[type] = {}
        }
        if (value) {
          draft[fldKey].options[type][name] = value
        } else {
          delete draft[fldKey].options[type][name]
        }
      } else if (value) {
        draft[fldKey].options[name] = value
      } else {
        delete draft[fldKey].options[name]
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} changed to ${value}: ${fieldLabel || fldKey}`,
      type: `${name}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleAction = (name: string, value: boolean | string): void => {
    fieldData[name] = value
    const updatedFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} "${value ? 'On' : 'Off'}": ${fieldLabel || fldKey}`,
      type: `${name}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleBtnStyle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    fieldData[name] = value
    const updatedFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(updatedFields)

    let newStyles = styles
    if (name === 'align') {
      newStyles = create(styles, drft => {
        drft.fields[fldKey].classes[`.${fldKey}-razorpay-wrp`]['justify-content'] = value
      })
      setStyles(newStyles)
    }

    addToBuilderHistory({
      event: `Button Style changed to "${value}": ${fieldLabel || fldKey}`,
      type: 'set_button_style',
      state: { fields: updatedFields, styles: newStyles, fldKey }
    })
  }

  const setFulW = (e: React.ChangeEvent<HTMLInputElement>): void => {
    fieldData.fulW = e.target.checked
    const updatedFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(updatedFields)

    const newStyles = create(styles, drft => {
      if (e.target.checked) {
        drft.fields[fldKey].classes[`.${fldKey}-razorpay-btn`].width = '100%'
        delete drft.fields[fldKey].classes[`.${fldKey}-razorpay-btn`]['min-width']
      } else {
        drft.fields[fldKey].classes[`.${fldKey}-razorpay-btn`]['min-width'] = '160px'
        delete drft.fields[fldKey].classes[`.${fldKey}-razorpay-btn`].width
      }
    })
    setStyles(newStyles)

    addToBuilderHistory({
      event: `Full Width "${e.target.checked ? 'On' : 'Off'}": ${fieldLabel || fldKey}`,
      type: 'set_button_width',
      state: { fields: updatedFields, styles: newStyles, fldKey }
    })
  }

  const setSubTitl = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedFields = create(fields, draft => {
      draft[fldKey].subTitl = e.target.checked
    })
    setFields(updatedFields)

    addToBuilderHistory({
      event: `Subtitle "${e.target.checked ? 'On' : 'Off'}": ${fieldLabel || fldKey}`,
      type: 'set_sub_title',
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleNotes = (action: string, i?: number, type?: string, val?: string): void => {
    const tmpNotes = [...payNotes]

    if (action === 'add') {
      tmpNotes.push({})
      setPayNotes(tmpNotes)
      mapNotesToElmData(tmpNotes)
      return
    }

    if (action === 'delete' && i !== undefined) {
      tmpNotes.splice(i, 1)
      setPayNotes(tmpNotes)
      mapNotesToElmData(tmpNotes)
      return
    }

    if (i !== undefined && type && val !== undefined) {
      tmpNotes[i][type as keyof Note] = val
      setPayNotes(tmpNotes)
      mapNotesToElmData(tmpNotes)
    }
  }

  console.log('Field Data:', fieldData)

  const mapNotesToElmData = (notes: Note[]): void => {
    const noteObj: Record<string, string> = {}

    notes.forEach(note => {
      if (note.key && note.value) {
        noteObj[note.key] = note.value
      }
    })

    const updatedFields = create(fields, draft => {
      if (!draft[fldKey].options) {
        draft[fldKey].options = {}
      }
      draft[fldKey].options.notes = noteObj
    })
    setFields(updatedFields)

    addToBuilderHistory({
      event: `Notes Changes: ${fieldLabel || fldKey}`,
      type: 'set_notes',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <div className={className}>
      {/* Description */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <b>{__('Description')}</b>
        <br />
        <textarea
          data-testid="dscrptn-txt-ara"
          className={css(FieldStyle.input)}
          placeholder="Order Description"
          name="description"
          rows={5}
          value={fieldData.options?.description || ''}
          onChange={e => handleInput('description', e.target.value)}
        />
      </div>

      <FieldSettingsDivider />

      {/* Include Order ID */}
      <SimpleAccordion
        id="order-stng"
        title="Include Order ID"
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={e => {
          handleAction('includeOrderId', e.target.checked)
          if (!e.target.checked) {
            handleAction('newOrderId', false)
          }
          if (e.target.checked && !fieldData?.orderIdFld) {
            handleAction('newOrderId', true)
          }
        }}
        toggleChecked={fieldData?.includeOrderId || false}
        open={fieldData?.includeOrderId || false}
        disable={!fieldData?.includeOrderId}
      >
        <div>
          <CheckBox
            id="new-ord-id"
            onChange={e => handleAction('newOrderId', e.target.checked)}
            check
            sqr
            checked={newOrderId}
            title={__('Generate new ID')}
            value="newOrderId"
          />
        </div>
        {!newOrderId && (
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <b>{__('Select Order Id Field')}</b>
            <select
              data-testid="slct-ord-id-fld"
              onChange={e => handleAction('orderIdFld', e.target.value)}
              name="orderIdFld"
              className={css(FieldStyle.input)}
              value={fieldData?.orderIdFld || ''}
            >
              <option value="">{__('Select Field')}</option>
              {getSpecifiedFields('orderId')}
            </select>
          </div>
        )}
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* Additional Settings */}
      <SimpleAccordion
        id="adtnl-stng"
        title="Additional Settings"
        className={css(FieldStyle.fieldSection)}
      >
        {/* Button Settings */}
        <SimpleAccordion
          id="adtnl-stng-btn"
          title="Button"
          className={css(FieldStyle.fieldSection)}
        >
          <SingleInput
            id="btn-txt"
            inpType="text"
            title={__('Button Text')}
            value={fieldData.btnTxt || ''}
            name="btnTxt"
            action={handleBtnStyle}
            className={css(ut.mt0, { pr: 1 })}
            cls={css(FieldStyle.input)}
          />
          <SelectBox2
            id="btn-algn"
            className={css({ pr: 1 })}
            title={__('Button Align:')}
            options={pos}
            value={fieldData.align || 'left'}
            action={handleBtnStyle}
            name="align"
            cls={css(FieldStyle.input)}
          />
          <SingleToggle
            id="ful-wid"
            title={__('Full Width')}
            action={setFulW}
            isChecked={fieldData.fulW || false}
            className="mt-5"
          />
          <SingleToggle
            id="sub-titl"
            title={__('Subtitle:')}
            action={setSubTitl}
            isChecked={fieldData?.subTitl || false}
            className="mt-5"
          />
        </SimpleAccordion>

        <div className="btcd-hr" />

        {/* Theme Settings */}
        <SimpleAccordion
          id="thm-stng"
          title="Theme"
          className={css(FieldStyle.fieldSection)}
        >
          <div className={css(ut.flxcb, ut.mt2)}>
            <b>{__('Theme Color:')}</b>
            <input
              data-testid="thm-clr-inp"
              aria-label="Theme color"
              className="ml-2"
              type="color"
              value={fieldData.options?.theme?.color || '#528FF0'}
              onChange={e => handleInput('color', e.target.value, 'theme')}
            />
          </div>
          <div className={css(ut.flxcb, ut.mt2)}>
            <b>{__('Background Color:')}</b>
            <input
              data-testid="bg-clr-inp"
              aria-label="Background color"
              className="ml-2"
              type="color"
              value={fieldData.options?.theme?.backdrop_color || '#FFFFFF'}
              onChange={e => handleInput('backdrop_color', e.target.value, 'theme')}
            />
          </div>
        </SimpleAccordion>

        <div className="btcd-hr" />

        {/* Modal Settings */}
        <SimpleAccordion
          id="mdl-stng"
          title="Modal"
          className={css(FieldStyle.fieldSection)}
        >
          <SingleToggle
            id="cnfrm-cls"
            className={css(ut.mt2)}
            title={__('Confirm on Close:')}
            action={e => handleInput('confirm_close', e.target.checked ? 'true' : 'false', 'modal')}
            isChecked={fieldData.options?.modal?.confirm_close || false}
          />
        </SimpleAccordion>

        <div className="btcd-hr" />

        {/* Prefill Settings */}
        <SimpleAccordion
          id="prfil-stng"
          title="Prefill"
          className={css(FieldStyle.fieldSection)}
        >
          <div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Name :')}</b>
              <select
                data-testid="prfil-nam-slct"
                onChange={e => handleInput('prefillNameFld', e.target.value, 'prefill')}
                name="prefillNameFld"
                className={css(FieldStyle.input)}
                value={fieldData.options?.prefill?.prefillNameFld || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('desc')}
              </select>
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Email :')}</b>
              <select
                data-testid="prfil-eml-slct"
                onChange={e => handleInput('prefillEmailFld', e.target.value, 'prefill')}
                name="prefillEmailFld"
                className={css(FieldStyle.input)}
                value={fieldData.options?.prefill?.prefillEmailFld || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('email')}
              </select>
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Contact :')}</b>
              <select
                data-testid="prfil-cntct-slct"
                onChange={e => handleInput('prefillContactFld', e.target.value, 'prefill')}
                name="prefillContactFld"
                className={css(FieldStyle.input)}
                value={fieldData.options?.prefill?.prefillContactFld || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('number')}
              </select>
            </div>
          </div>
        </SimpleAccordion>

        <div className="btcd-hr" />

        {/* Notes Settings */}
        <SimpleAccordion
          id="nots-stng"
          title="Notes"
          className={css(FieldStyle.fieldSection)}
        >
          <div className="flx">
            <div className="w-10"><b>{__('Key :')}</b></div>
            <div className="w-10"><b>{__('Value :')}</b></div>
          </div>
          {payNotes.map((note, indx) => (
            <div className="flx" key={`rp${indx * 2}`}>
              <div className={css({ pl: 2 })}>
                <input
                  data-testid="nots-key-inp"
                  aria-label="Note key"
                  className={css(FieldStyle.input, { pr: 1 })}
                  type="text"
                  value={note.key || ''}
                  onChange={e => handleNotes('edit', indx, 'key', e.target.value)}
                />
              </div>
              <div className="ml-1">
                <input
                  data-testid="nots-val-inp"
                  aria-label="Note value"
                  className={css(FieldStyle.input)}
                  type="text"
                  value={note.value || ''}
                  onChange={e => handleNotes('edit', indx, 'value', e.target.value)}
                />
              </div>
              <button
                data-testid="nots-del-btn"
                className="icn-btn ml-1 mt-3"
                type="button"
                aria-label="Delete note"
                onClick={() => handleNotes('delete', indx)}
              >
                <TrashIcn />
              </button>
            </div>
          ))}
          <div className="txt-center mt-2">
            <button
              data-testid="nots-ad-btn"
              className="icn-btn"
              type="button"
              onClick={() => handleNotes('add')}
            >
              +
            </button>
          </div>
        </SimpleAccordion>
      </SimpleAccordion>
    </div>
  )
}