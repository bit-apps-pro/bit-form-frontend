/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy } from '../../Utils/Helpers'
import { sanitizeHTML } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import FieldStyle from '../../styles/FieldStyle.style'
import Modal from '../Utilities/Modal'
import SingleToggle from '../Utilities/SingleToggle'
import { addDefaultStyleClasses, iconElementLabel, isStyleExist, setIconFilterValue, styleClasses } from '../style-new/styleHelpers'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import AutoResizeInput from './CompSettingsUtils/AutoResizeInput'
import FieldDisabledSettings from './CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import Icons from './Icons'
import FieldIconSettings from './StyleCustomize/ChildComp/FieldIconSettings'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

export default function ButtonSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [error, setError] = useState({})
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')
  const { txt, align, txtAlign, fulW, btnTyp } = fieldData
  const [btnAlign, setBtnAlign] = useState(align)
  const { css } = useFela()
  const [styles, setStyles] = useAtom($styles)
  const selectedFieldId = useAtomValue($selectedFieldId)

  const pos = [
    { name: __('Left'), value: 'start' },
    { name: __('Center'), value: 'center' },
    { name: __('Right'), value: 'end' },
  ]
  const type = [
    { name: 'Reset', value: 'reset', disabled: false },
    { name: 'Button', value: 'button', disabled: false },
  ]
  if (IS_PRO) {
    type.push({ name: 'Save Draft', value: 'save-draft', disabled: false })
  }

  function setSubBtnTxt(e) {
    const { value } = e.target
    const val = sanitizeHTML(value)
    fieldData.txt = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Button text updated : ${fieldData.txt}`, type: 'change_btn_txt', state: { fields: allFields, fldKey } })
  }

  function setBtnTyp(e) {
    const { value } = e.target

    fieldData.btnTyp = value
    if (fieldData.btnTyp === 'submit' && checkSubmitBtn()) {
      setError({ btnTyp: __('Already have a submit button') })
      setTimeout(() => {
        setError({ btnTyp: '' })
      }, 3000)
      return
    }

    if (error.btnTyp) {
      setError({ btnTyp: '' })
    }

    let bgClr = 'var(--btn-bg)'
    let clr = 'var(--btn-c)'
    let bdrClr = 'var(--btn-bdr-clr)'
    let bdrStl = 'var(--btn-bdr)'
    let bdrWdth = 'var(--btn-bdr-width)'

    if (value === 'reset') {
      bgClr = 'hsla(240, 12%, 94%, 100)'
      clr = 'hsla(208, 46%, 25%, 100)'
    }

    if (value === 'save-default') {
      bgClr = 'hsla(0, 0%, 100%, 100)'
      clr = 'var(--btn-bgc)'
      bdrClr = 'var(--btn-bgc)'
      bdrStl = 'solid'
      bdrWdth = '1px'
    }

    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`].background = bgClr
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`].color = clr
      if (value !== 'save-draft') {
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['border-color'] = bdrClr
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['border-style'] = bdrStl
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['border-width'] = bdrWdth
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn:hover`].color = 'var(--btn-c)'
      }
    }))
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Button Type updated to ${value}: ${fieldData.txt}`, type: 'set_btn_typ', state: { fields: allFields, fldKey } })
  }

  function setButtonAlign(e) {
    const { value } = e.target
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-inp-fld-wrp`]['justify-content'] = value
    }))
    fieldData.align = value
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    setBtnAlign(value)
    addToBuilderHistory({ event: `Button Alignment changed to ${value}: ${fieldData.txt}`, type: 'set_btn_align', state: { fields, fldKey } })
  }

  function setButtonTextAlign(e) {
    const { value } = e.target
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['justify-content'] = value
    }))
    fieldData.txtAlign = value
    setFields(create(fields, draft => { draft[fldKey] = fieldData }))
    addToBuilderHistory({ event: `Button Text Alignment changed to ${value}: ${fieldData.txt}`, type: 'set_btn_text_align', state: { fields, fldKey } })
  }

  const checkSubmitBtn = () => {
    const btns = Object.values(fields).filter(fld => fld.typ === 'button' && fld.btnTyp === 'submit')
    return btns.length >= 1
  }

  if (!checkSubmitBtn() || btnTyp === 'submit') {
    type.push({ name: 'Submit', value: 'submit', disabled: true })
  }

  function setFulW(e) {
    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`].width = e.target.checked ? '100%' : 'auto'
    }))
    fieldData.fulW = e.target.checked
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Button Full width ${e.target.checked ? 'on' : 'off'}`, type: 'set_btn_full', state: { fields: allFields, fldKey } })
  }

  const setIconModel = (typ) => {
    if (!isStyleExist(styles, fldKey, styleClasses[typ])) addDefaultStyleClasses(selectedFieldId, typ)
    setIconFilterValue(typ, fldKey)
    setIcnType(typ)
    setIcnMdl(true)
  }

  const removeIcon = (iconType) => {
    if (fieldData[iconType]) {
      delete fieldData[iconType]
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      addToBuilderHistory({ event: `${iconElementLabel[iconType]} Icon Deleted`, type: `delete_${iconType}`, state: { fldKey, fields: allFields } })
    }
  }

  return (
    <>
      <div className="">
        <FieldSettingTitle
          title="Field Settings"
          subtitle={fieldData.typ}
          fieldKey={fldKey}
        />

        <SizeAndPosition />

        <FieldSettingsDivider />

        <SimpleAccordion
          id="btn-txt-stng"
          title={__('Button Text')}
          className={css(FieldStyle.fieldSection)}
          open
        >
          <div className={css(FieldStyle.placeholder)}>
            <AutoResizeInput
              id="btn-txt"
              aria-label="Button text"
              placeholder="Type text here..."
              value={txt}
              changeAction={setSubBtnTxt}
            />
          </div>
          <FieldIconSettings
            label={__('Leading Icon')}
            iconSrc={fieldData?.btnPreIcn}
            styleRoute="btn-pre-i"
            setIcon={() => setIconModel('btnPreIcn')}
            removeIcon={() => removeIcon('btnPreIcn')}
            isPro
          />
          <FieldIconSettings
            label={__('Trailing Icon')}
            iconSrc={fieldData?.btnSufIcn}
            styleRoute="btn-suf-i"
            setIcon={() => setIconModel('btnSufIcn')}
            removeIcon={() => removeIcon('btnSufIcn')}
            isPro
          />
        </SimpleAccordion>

        <FieldSettingsDivider />

        <AdminLabelSettings />

        <FieldSettingsDivider />

        <HelperTxtSettings />

        <FieldSettingsDivider />

        <FieldDisabledSettings />

        <FieldSettingsDivider />

        <div className={css(FieldStyle.fieldSection, { pr: '36px' })}>
          <SingleToggle
            id="ful-wid-btn"
            tip="By disabling this option, the button full width will be remove"
            title={__('Full Width')}
            action={setFulW}
            isChecked={fulW || ''}
          />
        </div>
        <FieldSettingsDivider />
        {!fulW && (
          <SimpleAccordion
            id="btn-algn"
            title={__('Button Align')}
            className={css(FieldStyle.fieldSection)}
            open
          >
            <div className={css(FieldStyle.placeholder)}>
              <select
                data-testid="btn-algn-slct"
                className={css(FieldStyle.input)}
                name=""
                id=""
                value={btnAlign}
                onChange={setButtonAlign}
              >
                {pos.map(itm => <option key={`btcd-k-${itm.name}`} value={itm.value}>{itm.name}</option>)}
              </select>
            </div>
          </SimpleAccordion>
        )}
        {fulW && (
          <SimpleAccordion
            id="txt-algn"
            title={__('Text Align')}
            className={css(FieldStyle.fieldSection)}
            open
          >
            <div className={css(FieldStyle.placeholder)}>
              <select
                data-testid="txt-algn-slct"
                className={css(FieldStyle.input)}
                name=""
                id=""
                value={txtAlign || 'center'}
                onChange={setButtonTextAlign}
              >
                {pos.map(itm => <option key={`btcd-k-${itm.name}`} value={itm.value}>{itm.name}</option>)}
              </select>
            </div>
          </SimpleAccordion>
        )}

        <FieldSettingsDivider />

        <SimpleAccordion
          id="btn-typ"
          title={__('Button Type')}
          className={css(FieldStyle.fieldSection)}
          open
        >
          <div className={css(FieldStyle.placeholder)}>
            <select
              data-testid="btn-typ-slct"
              className={css(FieldStyle.input)}
              name=""
              id=""
              value={btnTyp}
              onChange={setBtnTyp}
            >
              {type.map(itm => (
                <option
                  key={`btcd-k-${itm.name}`}
                  value={itm.value}
                >
                  {itm.name}
                </option>
              ))}
            </select>
          </div>
          {error.btnTyp && <span className={css({ cr: 'red', ml: 10 })}>{error.btnTyp}</span>}
        </SimpleAccordion>

        <FieldSettingsDivider />

        <FieldHideSettings />

      </div>

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title={__('Icons')}
      >
        <div className="pos-rel" />
        <Icons
          iconType={icnType}
          addPaddingOnSelect={false}
          setModal={setIcnMdl}
        />
      </Modal>
    </>
  )
}
