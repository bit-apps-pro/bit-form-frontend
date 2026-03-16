/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $bits, $fields } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Btn from '../Utilities/Btn'
import Cooltip from '../Utilities/Cooltip'
import Modal from '../Utilities/Modal'
import SingleToggle from '../Utilities/SingleToggle'
import AutoResizeInput from './CompSettingsUtils/AutoResizeInput'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import UniqFieldSettings from './CompSettingsUtils/UniqFieldSettings'
import EditOptions from './EditOptions/EditOptions'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'

export default function SelectSettings() {
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const options = fieldData.opt
  const isRequired = fieldData.valid.req !== undefined
  const isMultiple = fieldData.mul
  const allowCustomOpt = fieldData.customOpt !== undefined
  const adminLabel = fieldData.adminLbl === undefined ? '' : fieldData.adminLbl
  const fieldName = fieldData.fieldName || fldKey
  const placeholder = fieldData.ph === undefined ? '' : fieldData.ph
  const min = fieldData.mn || ''
  const max = fieldData.mx || ''
  const dataSrc = fieldData?.customType?.type || 'fileupload'
  let fieldObject = null
  let disabled = false
  if (fieldData?.customType?.type) {
    fieldObject = fieldData?.customType
    disabled = true
  }
  const [importOpts, setImportOpts] = useState({})
  const [optionMdl, setOptionMdl] = useState(false)

  useEffect(() => setImportOpts({ dataSrc, fieldObject, disabled }), [fldKey])
  // set defaults
  if (isMultiple) {
    if ('val' in fieldData) {
      if (!Array.isArray(fieldData.val)) {
        fieldData.val = [fieldData.val]
      }
    } else {
      fieldData.val = []
    }
  }

  function setRequired(e) {
    console.log('from SelectSetting', fieldData)
    if (e.target.checked) {
      const tmp = { ...fieldData.valid }
      tmp.req = true
      fieldData.valid = tmp
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.req) fieldData.err.req = {}
      fieldData.err.req.dflt = `<p style="margin:0">${__('This field is required')}</p>`
      fieldData.err.req.show = true
    } else {
      delete fieldData.valid.req
      delete fieldData.mn
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Field required ${req}: ${adminLabel || fieldData.lbl || fldKey}`, type: `required_${req}`, state: { fields: allFields, fldKey } })
  }

  function setAdminLabel(e) {
    if (e.target.value === '') {
      delete fieldData.adminLbl
    } else {
      fieldData.adminLbl = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Admin label updated: ${adminLabel || fieldData.lbl || fldKey}`, type: 'change_adminlabel', state: { fields: allFields, fldKey } })
  }

  function setPlaceholder(e) {
    if (e.target.value === '') {
      delete fieldData.ph
    } else {
      fieldData.ph = e.target.value
    }
    const req = e.target.checked ? 'Show' : 'Hide'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${req} Placeholder: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req.toLowerCase()}_placeholder`, state: { fields: allFields, fldKey } })
  }

  function setMultiple(e) {
    if (e.target.checked) {
      fieldData.mul = true
    } else {
      delete fieldData.mul
      delete fieldData.mn
      delete fieldData.mx
      if (fieldData.err) {
        delete fieldData.err.mn
        delete fieldData.err.mx
      }
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Multiple option ${req}: ${fieldData.lbl || adminLabel || fldKey}`, type: `set_multiple_${req}`, state: { fields: allFields, fldKey } })
  }

  function setAllowCustomOption(e) {
    if (e.target.checked) {
      fieldData.customOpt = true
    } else {
      delete fieldData.customOpt
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Custom option ${req}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_allow_custom_option', state: { fields: allFields, fldKey } })
  }

  function rmvOpt(ind) {
    options.splice(ind, 1)
    fieldData.opt = options
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Option removed to ${options[ind].label}`, type: 'rmv_option_field', state: { fields: allFields, fldKey } })
  }

  function addOpt() {
    options.push({ label: `Option ${fieldData.opt.length + 1}`, value: `Option ${fieldData.opt.length + 1}` })
    fieldData.opt = options
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Option added to ${fieldData.opt.label}`, type: 'add_option_field', state: { fields: allFields, fldKey } })
  }

  function setCheck(e) {
    if (e.target.checked) {
      if (isMultiple) {
        if (!Array.isArray(fieldData.val)) {
          fieldData.val = []
        }
        // fieldData.val.push(e.target.getAttribute('data-value'))
        fieldData.val = [...fieldData.val, e.target.getAttribute('data-value')]
      } else {
        fieldData.val = e.target.getAttribute('data-value')
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isMultiple) {
        fieldData.val = [...fieldData.val.filter(itm => itm !== e.target.getAttribute('data-value'))]
      } else {
        delete fieldData.val
      }
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Check by default ${e.target.checked ? 'on' : 'off'} : {options}`, type: 'set_check_field', state: { fields: allFields, fldKey } })
  }

  function setOptLbl(e, i) {
    const updateVal = e.target.value
    const tmp = { ...options[i] }
    tmp.label = updateVal
    tmp.value = updateVal.replace(/,/g, '_')
    fieldData.opt[i] = tmp
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Option label updated to ${tmp.label}`, type: 'set_opt_label_field', state: { fields: allFields, fldKey } })
  }

  const openImportModal = () => {
    importOpts.show = true
    setImportOpts({ ...importOpts })
  }

  const openOptionModal = () => {
    console.log(fieldData.opt, 'aa')
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  const closeImportModal = () => {
    delete importOpts.show
    setImportOpts({ ...importOpts })
  }

  function setMin(e) {
    if (!isPro) return
    if (!Number(e.target.value)) {
      delete fieldData.mn
      setRequired({ target: { checked: false } })
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = `<p style="margin:0">Minimum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}<p>`
      fieldData.err.mn.show = true
      setRequired({ target: { checked: true } })
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Min value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_min', state: { fields: allFields, fldKey } })
  }

  function setMax(e) {
    if (!isPro) return
    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = `<p style="margin:0">Maximum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}</p>`
      fieldData.err.mx.show = true
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Max value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_max', state: { fields: allFields, fldKey } })
  }

  const setDisabledOnMax = e => {
    if (!isPro) return
    if (e.target.checked) {
      fieldData.valid.disableOnMax = true
    } else {
      delete fieldData.valid.disableOnMax
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Disable on max selected ${e.target.checked ? 'on' : 'off'}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_disable_on_max', state: { fields: allFields, fldKey } })
  }

  const hideAdminLabel = (e) => {
    console.log('from SelectSetting', fieldData)
    if (e.target.checked) {
      fieldData.adminLbl = fieldData.lbl || fldKey
    } else {
      delete fieldData.adminLbl
    }
    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${req} Admin label: ${fieldData.lbl || adminLabel || fldKey}`, type: `${req}_adminlabel`, state: { fields: allFields, fldKey } })
  }

  const handleFieldName = ({ target: { value } }) => {
    if (value !== '') fieldData.fieldName = value
    else fieldData.fieldName = fldKey

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Field name updated ${value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'change_field_name', state: { fields: allFields, fldKey } })
  }

  const handleOptions = newOpts => {
    setFields(allFields => create(allFields, draft => { draft[fldKey].opt = newOpts }))
  }

  return (
    <div className="">
      {/*
      <div className="mb-2">
        <span className="font-w-m">Field Type : </span>
        {fieldData.typ.charAt(0).toUpperCase() + fieldData.typ.slice(1)}
      </div>
      <div className="flx">
        <span className="font-w-m mr-1">{__('Field Key : ')}</span>
        <CopyText value={fldKey} className="field-key-cpy m-0 w-7" />
      </div> */}
      <FieldSettingTitle title="Field Settings" subtitle={fieldData.typ} fieldKey={fldKey} />

      <FieldLabelSettings />

      <hr className={css(FieldStyle.divider)} />

      <SimpleAccordion
        title={__('Admin Label')}
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={hideAdminLabel}
        toggleChecked={fieldData?.adminLbl !== undefined}
        open={fieldData?.adminLbl !== undefined}
        disable={!fieldData?.adminLbl}
      >
        <div className={css(FieldStyle.placeholder)}>
          <AutoResizeInput
            ariaLabel="Admin label"
            value={adminLabel}
            changeAction={setAdminLabel}
          />
        </div>
      </SimpleAccordion>

      <hr className={css(FieldStyle.divider)} />

      <SimpleAccordion
        id="nam-stng"
        title={__('Name')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="nam-stng-inp"
            aria-label="Name for this Field"
            placeholder="Type field name here..."
            className={css(FieldStyle.input)}
            value={fieldName}
            onChange={handleFieldName}
          />
        </div>
      </SimpleAccordion>
      <hr className={css(FieldStyle.divider)} />

      {/* <SingleInput inpType="text" title={__('Admin Label:')} value={adminLabel} action={setAdminLabel} /> */}

      {/* {fieldData.typ.match(/^(text|url|password|number|email|select)$/) && <SingleInput inpType="text" title={__('Placeholder:')} value={placeholder} action={setPlaceholder} />} */}
      {fieldData.typ.match(/^(text|url|password|number|email|select)$/) && (
        <SimpleAccordion
          title={__('Placeholder')}
          className={css(FieldStyle.fieldSection)}
          open
        >
          <div className={css(FieldStyle.placeholder)}>
            <input aria-label="Field placeholder" className={css(FieldStyle.input)} type="text" value={placeholder} onChange={setPlaceholder} />
          </div>
        </SimpleAccordion>
      )}

      <hr className={css(FieldStyle.divider)} />

      <SimpleAccordion
        title={__('Required')}
        // eslint-disable-next-line react/jsx-no-bind
        toggleAction={setRequired}
        toggleChecked={isRequired}
        className={`${css(FieldStyle.fieldSection)} ${css(FieldStyle.hover_tip)}`}
        switching
        tip="By enabling this feature, user will see the error message when input is empty"
        tipProps={{ width: 200, icnSize: 17 }}
        open
      >
        <ErrorMessageSettings
          type="req"
          title="Error Message"
          tipTitle="By enabling this feature, user will see the error message when input is empty"
        />
      </SimpleAccordion>

      <hr className={css(FieldStyle.divider)} />

      {/* <SingleToggle title={__('Required:')} action={setRequired} isChecked={isRequired} className="mt-3" />
      {fieldData?.valid?.req && (
        <ErrorMessageSettings
          type="req"
          title="Error Message"
          tipTitle="By enabling this feature, user will see the error message if select box is empty"
        />
      )} */}
      {/* <div className="pos-rel">
        {!bits.isPro && (
          <div className="pro-blur flx" style={{ height: '100%', left: 0, width: '100%', marginTop: 14 }}>
            <div className="pro">
              {__('Available On')}
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {' '}
                  {__('Premium')}
                </span>
              </a>
            </div>
          </div>
        )}
        <ErrorMessageSettings
          type="entryUnique"
          title="Validate as Entry Unique"
          tipTitle="Enabling this option will check from the entry database whether its value is duplicate."
        />
      </div> */}
      <div className="pos-rel">
        <UniqFieldSettings
          type="entryUnique"
          isUnique="isEntryUnique"
          title={__('Validate as Entry Unique')}
          tipTitle={__('Enabling this option will check from the entry database whether its value is duplicate.')}
          className={css(FieldStyle.fieldSection)}
          isPro
        />
      </div>

      <hr className={css(FieldStyle.divider)} />

      {/* <SingleToggle title={__('Allow Other Option:')} action={setAllowCustomOption} isChecked={allowCustomOpt} className="mt-3 mb-2" /> */}
      <div className={`${css(FieldStyle.fieldSection)} ${css(ut.pr8)}`}>
        <SingleToggle title={__('Allow Other Option:')} action={setAllowCustomOption} isChecked={allowCustomOpt} />
      </div>

      <hr className={css(FieldStyle.divider)} />

      <SimpleAccordion
        title={__('Multiple Select:')}
        // eslint-disable-next-line react/jsx-no-bind
        toggleAction={setMultiple}
        toggleChecked={isMultiple}
        className={`${css(FieldStyle.fieldSection)} ${css(FieldStyle.hover_tip)}`}
        switching
        tip="By enabling this feature, user will see the error message when input is empty"
        tipProps={{ width: 200, icnSize: 17 }}
        open
      >
        {
          fieldData.mul && (
            <>
              <div>
                <div className={`${css(FieldStyle.flxCenter)} ${css(ut.mt2)} ${css(ut.mb2)}`}>
                  <h4 className={css(ut.m0)}>{__('Minimum:')}</h4>
                  <Cooltip width={250} icnSize={17} className={`${css(ut.ml2)} hovertip`}>
                    <div className={css(ut.tipBody)}>{__('Set minimum number to be selected for dropdown option')}</div>
                  </Cooltip>
                  {!isPro && <span className={`${css(ut.proBadge)} ${css(ut.ml2)}`}>{__('Pro')}</span>}
                </div>
                <input aria-label="Minimum number" className={css(FieldStyle.input)} type="number" value={min} onChange={setMin} disabled={!isPro} />
              </div>

              {fieldData.mn && (
                <ErrorMessageSettings
                  type="mn"
                  title="Min Error Message"
                  tipTitle={`By enabling this feature, user will see the error message when selected options is less than ${fieldData.mn}`}
                />
              )}

              <div>
                <div className={`${css(FieldStyle.flxCenter)} ${css(ut.mt2)} ${css(ut.mb2)}`}>
                  <h4 className={css(ut.m0)}>{__('Maximum:')}</h4>
                  <Cooltip width={250} icnSize={17} className={`${css(ut.ml2)} hovertip`}>
                    <div className={css(ut.tipBody)}>{__('Set maximum number to be selected for dropdown option')}</div>
                  </Cooltip>
                  {!bits.isPro && <span className={`${css(ut.proBadge)} ${css(ut.ml2)}`}>{__('Pro')}</span>}
                </div>
                <input aria-label="Maximum numebr" className={css(FieldStyle.input)} type="number" value={max} onChange={setMax} disabled={!isPro} />
              </div>
              {fieldData.mx && (
                <>
                  <ErrorMessageSettings
                    type="mx"
                    title="Max Error Message"
                    tipTitle={`By enabling this feature, user will see the error message when selected options is greater than ${fieldData.mx}`}
                  />
                  {/* <SingleToggle title={__('Disable if maximum selected:')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={!isPro} className="mt-3 mb-2" /> */}
                </>
              )}
            </>
          )
        }
      </SimpleAccordion>

      <hr className={css(FieldStyle.divider)} />

      {/* <SingleToggle title={__('Multiple Select:')} action={setMultiple} isChecked={isMultiple} className="mt-3" />
      {
        fieldData.mul && (
          <>
            <div>
              <div className="flx mt-2 mb-2">
                <h4 className="m-0">{__('Minimum:')}</h4>
                <Cooltip width={250} icnSize={17} className="ml-2">
                  <div className="txt-body">{__('Set minimum number to be selected for dropdown option')}</div>
                </Cooltip>
                {!isPro && <span className="pro-badge ml-2">{__('Pro')}</span>}
              </div>
              <input className="btcd-paper-inp" type="number" value={min} onChange={setMin} disabled={!isPro} />
            </div>

            {fieldData.mn && (
              <ErrorMessageSettings
                type="mn"
                title="Min Error Message"
                tipTitle={`By enabling this feature, user will see the error message when selected options is less than ${fieldData.mn}`}
              />
            )}

            <div>
              <div className="flx mt-2 mb-2">
                <h4 className="m-0">{__('Maximum:')}</h4>
                <Cooltip width={250} icnSize={17} className="ml-2">
                  <div className="txt-body">{__('Set maximum number to be selected for dropdown option')}</div>
                </Cooltip>
                {!bits.isPro && <span className="pro-badge ml-2">{__('Pro')}</span>}
              </div>
              <input className="btcd-paper-inp" type="number" value={max} onChange={setMax} disabled={!isPro} />
            </div>
            {fieldData.mx && (
              <>
                <ErrorMessageSettings
                  type="mx"
                  title="Max Error Message"
                  tipTitle={`By enabling this feature, user will see the error message when selected options is greater than ${fieldData.mx}`}
                  defaultMsg="The value is already taken. Try another."
                />
                <SingleToggle title={__('Disable if maximum selected:')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={!isPro} className="mt-3 mb-2" />
              </>
            )}
          </>
        )
      } */}

      <hr className={css(FieldStyle.divider)} />
      {/* <button onClick={openImportModal} className={css(app.btn)} type="button">
        <DownloadIcon size="16" />
        &nbsp;
        {__('Import Options')}
      </button>
      <br /> */}
      <Btn
        dataTestId="edt-opt-stng"
        variant="primary-outline"
        size="sm"
        className={css({ mt: 10 })}
        onClick={openOptionModal}
      >
        {__('Edit Options')}
        <span className={css({ ml: 3, mt: 3, tm: 'rotate(45deg)' })}>
          <CloseIcn size="13" stroke="3" />
        </span>
      </Btn>

      {/* <div className="opt">
        <span className="font-w-m">{__('Options:')}</span>
        {fieldData.opt.map((itm, i) => (
          <div key={`opt-${i + 8}`} className="flx flx-between">
            <SingleInput inpType="text" value={itm.label} action={e => setOptLbl(e, i)} width={140} className="mt-0" />
            <div className="flx mt-2">
              <label className="btcd-ck-wrp tooltip" style={{ '--tooltip-txt': `'${__('Check by Default')}'` }}>
                <input aria-label="chek" onChange={setCheck} type="checkbox" data-value={itm.value} checked={typeof fieldData.val === 'string' ? fieldData.val === itm.value : fieldData?.val?.some(d => d === itm.value)} />
                <span className="btcd-mrk ck br-50" />
              </label>
              <button onClick={() => rmvOpt(i)} className={`${css(app.btn)} cls-btn`} type="button" aria-label="remove option"><CloseIcn size="14" /></button>
            </div>
          </div>
        ))}
        <button onClick={addOpt} className={`${css(app.btn)} blue`} type="button">{__('Add More +')}</button>
      </div> */}
      {/* <Modal
        md
        autoHeight
        show={importOpts.show}
        setModal={closeImportModal}
        className="o-v"
        title={__('Import Options')}
      >
        <div className="pos-rel">
          {!isPro && (
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
          )}
          <ImportOptions
            importOpts={importOpts}
            setImportOpts={setImportOpts}
            lblKey="label"
            valKey="value"
          />
        </div>
      </Modal> */}

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Options')}
      >
        <div className="pos-rel">
          {!isPro && (
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
          )}
          {/* <Option
            optionMdl={optionMdl}
            options={fieldData.opt}
            lblKey="label"
            valKey="value"
            type="select"
          /> */}
          <EditOptions
            optionMdl={optionMdl}
            options={fieldData.opt}
            setOptions={newOpts => handleOptions(newOpts)}
            lblKey="label"
            valKey="value"
            type="select"
            hasGroup
          />
        </div>
      </Modal>
    </div>
  )
}
