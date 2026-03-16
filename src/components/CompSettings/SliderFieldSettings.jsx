/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { memo, useState } from 'react'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../GlobalStates/AppSettingsStates'
import { $fields, $updateBtn } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy } from '../../Utils/Helpers'
import autofillList from '../../Utils/StaticData/autofillList'
import tippyHelperMsg from '../../Utils/StaticData/tippyHelperMsg'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'
import FieldDisabledSettings from './CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import RequiredSettings from './CompSettingsUtils/RequiredSettings'
import SubTitleSettings from './CompSettingsUtils/SubTitleSettings'
import EditOptions from './EditOptions/EditOptions'
import Icons from './Icons'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

function SliderFieldSettings() {
  const { fieldKey: fldKey } = useParams()

  if (!fldKey) return <>No field exist with this field key</>
  const setUpdateBtn = useSetAtom($updateBtn)
  const [optionMdl, setOptionMdl] = useState(false)
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const defaultValue = fieldData.defaultValue || 0
  const suggestions = fieldData.suggestions || []
  const ac = fieldData?.ac ? fieldData.ac.trim().split(',') : ['Off']
  const min = fieldData.mn || ''
  const max = fieldData.mx || ''
  const globalErrMsg = globalMessages?.err || {}
  const { css } = useFela()

  const hideDefalutValue = (e) => {
    if (!IS_PRO) return
    if (e.target.checked) {
      fieldData.defaultValue = 1
      fieldData.defaultValueHide = true
    } else {
      fieldData.defaultValueHide = false
      delete fieldData.defaultValue
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default value ${req}: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req.toLowerCase()}_defaultValue`, state: { fields: allFields, fldKey } })
  }

  const setDefaultValue = ({ target: { value } }) => {
    if (!IS_PRO) return
    if (value === '') delete fieldData.defaultValue
    else fieldData.defaultValue = value

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Default value updated: ${value || fieldData.lbl || adminLabel || fldKey}`, type: 'change_defaultValue', state: { fields: allFields, fldKey } })
  }

  function setMin(e) {
    if (e.target.value === '') {
      delete fieldData.mn
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = globalErrMsg?.[fieldData.typ]?.mn || globalErrMsg?.mn || `<p style="margin:0">Minimum number is ${e.target.value}<p>`
      fieldData.err.mn.show = true
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Min value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_min', state: { fields: allFields, fldKey } })
  }

  function setMax(e) {
    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = globalErrMsg?.[fieldData.typ]?.mx || globalErrMsg?.mx || `<p style="margin:0">Maximum number is ${e.target.value}</p>`
      fieldData.err.mx.show = true
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Max value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_max', state: { fields: allFields, fldKey } })
  }

  function setStep(e) {
    if (e.target.value === '') {
      delete fieldData.step
    } else {
      fieldData.step = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Step value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_step', state: { fields: allFields, fldKey } })
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const hideSuggestionVal = ({ target: { checked } }) => {
    if (!IS_PRO) return
    if (checked) {
      fieldData.suggestionHide = true
    } else {
      fieldData.suggestionHide = false
      delete fieldData.suggestions
    }
    const req = checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Suggestion ${req}: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req.toLowerCase()}_defaultValue`, state: { fields: allFields, fldKey } })
  }

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const seAutoComplete = (value) => {
    const splitted = value.split(',')
    let val = ''

    if (splitted.length === 1) val = value
    else {
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

    if (!val) delete fieldData.ac
    else fieldData.ac = val

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Auto Complete updated ${val}: ${fieldData.lbl || adminLabel || fldKey}`, type: `change_autoComplete_${value}`, state: { fields: allFields, fldKey } })
  }

  const hideAutoComplete = ({ target: { checked } }) => {
    if (checked) fieldData.acHide = true
    else delete fieldData.acHide

    const req = checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Auto Complete  ${req}: ${fieldData.lbl || adminLabel || fldKey}`, type: `change_autoComplete_${req}`, state: { fields: allFields, fldKey } })
  }

  const handleSuggestions = newSuggestions => {
    fieldData.suggestions = newSuggestions
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    setUpdateBtn({ unsaved: true })
    addToBuilderHistory({ event: `Suggestion Update: ${fieldData.lbl || adminLabel || fldKey}`, type: 'suggestion_update', state: { fields: allFields, fldKey } })
  }

  return (
    <>
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

        <HelperTxtSettings defaultText={`Value: $\{input.${fieldData.fieldName}}`} />

        <FieldSettingsDivider />

        <SimpleAccordion
          id="dflt-val-stng"
          title={__('Default value')}
          className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
          switching
          tip={tippyHelperMsg.defaultValue}
          tipProps={{ width: 250, icnSize: 17 }}
          toggleAction={hideDefalutValue}
          toggleChecked={fieldData?.defaultValueHide}
          open={fieldData?.defaultValueHide}
          {...IS_PRO && { disable: !fieldData?.defaultValueHide }}
          isPro
          proProperty="defaultValue"
        >
          <div className={css(FieldStyle.placeholder)}>
            <input
              data-testid="dflt-val-stng-inp"
              aria-label="Default value for this Field"
              placeholder="Type default value here..."
              className={css(FieldStyle.input)}
              type="number"
              value={defaultValue}
              onChange={setDefaultValue}
            />
          </div>
        </SimpleAccordion>
        <FieldSettingsDivider />

        <SimpleAccordion
          id="sgsn-stng"
          title={__('Suggestion')}
          className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
          switching
          tip={tippyHelperMsg.suggestion}
          tipProps={{ width: 250, icnSize: 17 }}
          toggleAction={hideSuggestionVal}
          toggleChecked={fieldData?.suggestionHide}
          open={fieldData?.suggestionHide}
          {...IS_PRO && { disable: !fieldData?.suggestionHide }}
          isPro
          proProperty="suggestion"
        >
          <div className={css(FieldStyle.placeholder, ut.mb1)}>
            <Btn
              variant="primary-outline"
              size="sm"
              className={css({ mt: 10 })}
              onClick={openOptionModal}
              dataTestId="sgsn-stng-btn"
            >
              {__('Add/Edit Suggestions')}
              <span className={css(style.plsIcn)}>
                <CloseIcn size="13" stroke="4" />
              </span>
            </Btn>
          </div>
        </SimpleAccordion>

        <FieldSettingsDivider />

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
              onChange={val => seAutoComplete(val)}
              disableChip
            />
          </div>
        </SimpleAccordion>

        <FieldSettingsDivider />

        <RequiredSettings />

        <FieldSettingsDivider />

        <SimpleAccordion id="nmbr-stng" title="Slider Range(Min/Max) and Step:" className={css(FieldStyle.fieldSection)}>
          {/* <input aria-label="Maximum number for this field" className={css(FieldStyle.input)} type="text" value={placeholder} onChange={setPlaceholder} /> */}
          <div className={css({ mx: 5 })}>
            <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
              <span>{__('Min:')}</span>
              <input
                data-testid="nmbr-stng-min-inp"
                title="Minimum number for this field"
                aria-label="Minimum number for this field"
                placeholder="0"
                // className={css(FieldStyle.inputNumber, FieldStyle.w140)}
                className={css(FieldStyle.input, FieldStyle.w140)}
                type="number"
                value={min}
                onChange={setMin}
              />
            </div>
            {/* <SingleInput inpType="number" title={__('Min:')} value={min} action={setMin} cls={css(FieldStyle.input)} /> */}
            {fieldData.mn && (
              <ErrorMessageSettings
                id="nmbr-stng-min"
                type="mn"
                title="Min Error Message"
                tipTitle={`By enabling this feature, user will see the error message when input number is less than ${fieldData.mn}`}
              />
            )}
            <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
              <span>{__('Max:')}</span>
              <input
                data-testid="nmbr-stng-max-inp"
                title="Maximum number for this field"
                aria-label="Maximum number for this field"
                placeholder="100"
                className={css(FieldStyle.input, FieldStyle.w140)}
                type="number"
                value={max}
                onChange={setMax}
              />
            </div>
            {/* <SingleInput inpType="number" title={__('Max:')} value={max} action={setMax} cls={css(FieldStyle.input)} /> */}
            {fieldData.mx && (
              <ErrorMessageSettings
                id="nmbr-stng-max"
                type="mx"
                title="Max Error Message"
                tipTitle={`By enabling this feature, user will see the error message when input number is greater than ${fieldData.mx}`}
              />
            )}

            <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
              <span>{__('Step:')}</span>
              <input
                data-testid="slider-step-inp"
                title="Step for slider field"
                aria-label="Step for slider field"
                placeholder="1"
                className={css(FieldStyle.input, FieldStyle.w140)}
                type="number"
                value={fieldData.step}
                onChange={setStep}
              />
            </div>
          </div>

        </SimpleAccordion>
        <FieldSettingsDivider />

        <FieldHideSettings />

        <FieldSettingsDivider />

        <FieldDisabledSettings />

        <FieldSettingsDivider />
      </div>

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Suggestion')}
      >
        <div className="pos-rel">
          {/* {!isPro && (
            <div className="pro-blur flx" style={{ top: -7, width: '105%', left: -17 }}>
              <div className="pro">
                {__('Available On')}
                <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                  <span className="txt-pro">
                    &nbsp;
                    {__('Premium')}
                  </span>
                </a>
              </div>
            </div>
          )} */}

          <EditOptions
            optionMdl={optionMdl}
            options={suggestions}
            setOptions={newSuggestions => handleSuggestions(newSuggestions)}
            lblKey="lbl"
            valKey="val"
            checkByDefault={false}
          />
        </div>
      </Modal>

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title={__('Icons')}
      >
        <div className="pos-rel" />

        <Icons iconType={icnType} setModal={setIcnMdl} />
      </Modal>
    </>
  )
}

export default memo(SliderFieldSettings)

const style = {
  dotBtn: {
    b: 0,
    brs: 5,
    mr: 15,
    curp: 1,
  },
  button: {
    dy: 'block',
    w: '100%',
    ta: 'left',
    b: 0,
    bd: 'none',
    p: 3,
    curp: 1,
    '&:hover':
    {
      bd: 'var(--white-0-95)',
      cr: 'var(--black-0)',
      brs: 8,
    },
    fs: 11,
  },
  plsIcn: {
    ml: 8, mt: 3, tm: 'rotate(45deg)',
  },
}
