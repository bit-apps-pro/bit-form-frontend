/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { memo, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../GlobalStates/AppSettingsStates'
import { $bits, $fields } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import CloseIcn from '../../Icons/CloseIcn'
import { addToBuilderHistory, reCalculateFldHeights, setRequired } from '../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../Utils/Helpers'
import tippyHelperMsg from '../../Utils/StaticData/tippyHelperMsg'
import { isDev } from '../../Utils/config'
import { __ } from '../../Utils/i18nwrap'
import FieldStyle from '../../styles/FieldStyle.style'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import SingleToggle from '../Utilities/SingleToggle'
import { assignNestedObj } from '../style-new/styleHelpers'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'
import FieldDisabledSettings from './CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import OtherOptionSettings from './CompSettingsUtils/OtherOptionSettings'
import RequiredSettings from './CompSettingsUtils/RequiredSettings'
import SubTitleSettings from './CompSettingsUtils/SubTitleSettings'
import UniqFieldSettings from './CompSettingsUtils/UniqFieldSettings'
import EditOptions from './EditOptions/EditOptions'
import OptionList from './OptionList'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

function RadioCheckSettings() {
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const [styles, setStyles] = useAtom($styles)
  const fieldData = deepCopy(fields[fldKey])
  const options = deepCopy(fields[fldKey].opt)
  const adminLabel = fieldData.adminLbl || ''
  const isRound = fieldData.round || false
  const optionCol = fieldData?.optionCol === undefined ? '' : fieldData?.optionCol

  const isOptionRequired = fieldData.opt.find(opt => opt.req)
  const min = fieldData.mn || ''
  const max = fieldData.mx || ''
  const dataSrc = fieldData?.customType?.type || 'fileupload'
  const globalErrMsg = globalMessages?.err || {}

  let fieldObject = null
  let disabled = false
  if (fieldData?.customType?.type) {
    disabled = true
    fieldObject = fieldData?.customType
  }
  const [importOpts, setImportOpts] = useState({})
  const [optionMdl, setOptionMdl] = useState(false)
  useEffect(() => setImportOpts({ dataSrc, fieldObject, disabled }), [fldKey])

  function setRound({ target: { checked } }) {
    const fldClsSelector = fieldData.typ === 'radio' ? 'rdo' : 'ck'
    const path = `fields->${fldKey}->classes->.${fldKey}-${fldClsSelector}->border-radius`
    const newStyles = create(styles, drft => {
      let bdr = '5px'
      if (checked) {
        fieldData.round = true
        bdr = '50%'
        assignNestedObj(drft, path, bdr)
      } else {
        delete fieldData.round
        assignNestedObj(drft, path, bdr)
      }
    })
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    setStyles(newStyles)
    addToBuilderHistory({ event: `Option rounded ${checked ? 'on' : 'off'}`, type: 'set_round', state: { fields: allFields, styles: newStyles, fldKey } })
  }

  const openOptionModal = () => {
    setOptionMdl(true)
  }

  const closeOptionModal = () => {
    setOptionMdl(false)
  }

  function setMin(e) {
    if (!isPro) return
    if (!Number(e.target.value)) {
      delete fieldData.mn
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = globalErrMsg?.[fieldData.typ]?.mn || `<p style="margin:0">Minimum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}<p>`
      fieldData.err.mn.show = true
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Min value updated to ${e.target.value}: ${fieldData.lbl || adminLabel || fldKey}`, type: 'set_min', state: { fields: allFields, fldKey } })
    if (e.target.value >= 1 && !fieldData.req) setRequired({ target: { checked: true } })
  }

  function setMax(e) {
    if (!isPro) return
    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = globalErrMsg?.[fieldData.typ]?.mx || `<p style="margin:0">Maximum ${e.target.value} option${Number(e.target.value) > 1 ? 's' : ''}</p>`
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

  const handleOptions = newOpts => {
    const reqOpts = newOpts.filter(opt => opt.req)
    reqOpts.length && setRequired({ target: { checked: true } })
    const allFields = create(fields, draft => {
      draft[fldKey].opt = newOpts
      if (reqOpts.length && draft[fldKey].err.req) {
        draft[fldKey].err.req.custom = true
        draft[fldKey].err.req.msg = `<p style="margin:0">${reqOpts.map(opt => opt.lbl).join(',')} is required</p>`
      } else if (draft[fldKey].err.req) draft[fldKey].err.req.msg = `<p style="margin:0">${__('This field is required')}</p>`
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Options List Moddified: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'option_list_modify',
      state: { fields: allFields, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }

  function setColumn({ target: { value } }) {
    if (!IS_PRO) return
    if (value === '') {
      delete fieldData.optionCol
    } else {
      fieldData.optionCol = value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })

    const newStyles = create(styles, drft => {
      const gridStyle = {
        display: 'grid',
        'grid-template-columns': `repeat(${value}, 1fr)`,
        width: '100%',
        'grid-row-gap': '10px',
        'column-gap': '10px',
      }

      const flxStyle = {
        display: 'flex',
        'flex-wrap': 'wrap',
        'margin-top': '8px',
      }

      drft.fields[fldKey].classes[`.${fldKey}-cc`] = value === '' ? flxStyle : gridStyle
    })
    setFields(allFields)
    setStyles(newStyles)
    addToBuilderHistory({
      event: `Column Update to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'columns_update',
      state: { fields: allFields, styles: newStyles, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }
  if (isDev) {
    window.selectedFieldData = fieldData
  }

  const handleCustomType = newCustomType => {
    setFields(allFields => create(allFields, draft => { draft[fldKey].customType = newCustomType }))
  }
  return (
    <div className="">
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ === 'check' ? 'Check Box' : 'Radio'}
        fieldKey={fldKey}
      />

      <FieldLabelSettings />

      <FieldSettingsDivider />

      {/* <SimpleAccordion
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
            changeAction={e => setAdminLabel(e)}
          />
        </div>
      </SimpleAccordion> */}

      <SubTitleSettings />

      <FieldSettingsDivider />

      <AdminLabelSettings />

      <FieldSettingsDivider />

      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(FieldStyle.fieldSectionTitle)}>
          {__('Options')}
        </div>
        <OptionList
          options={options}
          onClick={() => setOptionMdl(true)}
        />
        <Btn
          dataTestId="edt-opt-stng"
          variant="primary-outline"
          size="sm"
          className={css({ mt: 10 })}
          onClick={openOptionModal}
        >
          {__('Add/Edit Options')}
          <span className={css(style.plsIcn)}>
            <CloseIcn size="13" stroke="3" />
          </span>
        </Btn>
      </div>
      <FieldSettingsDivider />

      <SizeAndPosition />

      <FieldSettingsDivider />

      <HelperTxtSettings />

      <FieldSettingsDivider />

      <RequiredSettings />

      <FieldSettingsDivider />

      <FieldHideSettings />

      <FieldSettingsDivider />

      {/* <div className={`${css(FieldStyle.fieldSection)} ${css({ pr: 36 })}`}>
        <SingleToggle
          id="rnd-stng"
          tip="By disabling this option, the field rounded will be remove"
          title={__('Rounded')}
          action={e => setRound(e)}
          isChecked={isRound}
        />
      </div> */}

      <FieldSettingsDivider />

      <FieldDisabledSettings />

      <FieldSettingsDivider />
      <SimpleAccordion
        id="opt-clm-stng"
        title={__('Options Column')}
        className={css(FieldStyle.fieldSection)}
        isPro
        proProperty="optionColumn"
        tip={__('Specify the number of columns to display the options in. Leave blank to display the options as needed space.')}
      >
        <div className={css(FieldStyle.placeholder)}>
          <input
            data-testid="opt-clm-stng-inp"
            aria-label="Option Column"
            className={css(FieldStyle.input)}
            min="1"
            type="number"
            value={optionCol}
            onChange={setColumn}
          />
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      {
        fieldData.typ === 'check' && (
          <>
            <SimpleAccordion
              id="mnmm-stng"
              title={__('Minimum')}
              className={css(FieldStyle.fieldSection)}
              tip="Set minimum number to be selected for checkbox option"
              isPro
              proProperty="mimimumOption"
            >
              {/* <div>
                <div className="flx mt-2 mb-2">
                  <h4 className="m-0">{__('Minimum:')}</h4>
                  <Cooltip width={250} icnSize={17} className="ml-2">
                    <div className="txt-body">{__('Set minimum number to be selected for checkbox option')}</div>
                  </Cooltip>
                  {!bits.isPro && <span className="pro-badge ml-2">{__('Pro')}</span>}
                </div>
                <input className="btcd-paper-inp" type="number" value={min} onChange={setMin} disabled={!isPro} />
              </div> */}
              <div className={css(FieldStyle.placeholder)}>
                <input
                  data-testid="mnmm-stng-inp"
                  aria-label="Minimum number"
                  className={css(FieldStyle.input)}
                  value={min}
                  type="number"
                  onChange={setMin}
                  disabled={!isPro}
                />
              </div>

              {fieldData.mn && (
                <ErrorMessageSettings
                  id="mnmm-stng"
                  type="mn"
                  title="Min Error Message"
                  tipTitle={`By enabling this feature, user will see the error message when selected checkbox is less than ${fieldData.mn}`}
                />
              )}
            </SimpleAccordion>

            <FieldSettingsDivider />

            <SimpleAccordion
              id="mxmm-stng"
              title={__('Maximum')}
              className={css(FieldStyle.fieldSection)}
              tip="Set maximum number to be selected for checkbox option"
              isPro
              proProperty="maximumOption"
            >
              <div className={css(FieldStyle.placeholder)}>
                <input
                  data-testid="mxmm-stng-inp"
                  aria-label="maximim number"
                  className={css(FieldStyle.input)}
                  value={max}
                  type="number"
                  onChange={setMax}
                  disabled={!isPro}
                />
              </div>

              {fieldData.mx && (
                <>
                  <ErrorMessageSettings
                    id="mxmm-stng"
                    type="mx"
                    title="Max Error Message"
                    tipTitle={`By enabling this feature, user will see the error message when selected checkbox is greater than ${fieldData.mx}`}
                  />
                  <SingleToggle id="mxmm-slctd" title={__('Disable if maximum selected:')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={!isPro} className="mt-3 mb-2" />
                </>
              )}
            </SimpleAccordion>

            <FieldSettingsDivider />

            {/* <div>
              <div className="flx mt-2 mb-2">
                <h4 className="m-0">{__('Maximum:')}</h4>
                <Cooltip width={250} icnSize={17} className="ml-2">
                  <div className="txt-body">{__('Set maximum number to be selected for checkbox option')}</div>
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
                  tipTitle={`By enabling this feature, user will see the error message when selected checkbox is greater than ${fieldData.mx}`}
                />
                <SingleToggle title={__('Disable if maximum selected:')} action={setDisabledOnMax} isChecked={fieldData.valid.disableOnMax} disabled={!isPro} className="mt-3 mb-2" />
              </>
            )} */}

          </>
        )
      }

      <OtherOptionSettings id={`${fldKey}-other-stng`} />

      <FieldSettingsDivider />

      {/* <SimpleAccordion
        title={__('Options')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <>
          <button onClick={openImportModal} className={css(app.btn)} type="button">
            <DownloadIcon size="16" />
            &nbsp;
            {__('Import Options')}
          </button>
          <div className="opt mt-1">
            <span className="font-w-m">{__('Options:')}</span>
            {options.map((itm, i) => (
              <div key={`opt-${i + 8}`} className="flx flx-between">
                <SingleInput inpType="text" value={itm.lbl} action={e => setOptLbl(e, i)} width={140} className="mt-0" />
                <div className="flx mt-1">
                  {fieldData.typ === 'check'
                    && (
                      <label className="btcd-ck-wrp tooltip m-0" style={{ '--tooltip-txt': `'${__('Required')}'` }}>
                        <input aria-label="checkbox" onChange={(e) => setReq(e, i)} type="checkbox" checked={itm.req !== undefined} disabled={isRadioRequired} />
                        <span className="btcd-mrk ck br-50 " />
                      </label>
                    )}
                  <label className="btcd-ck-wrp tooltip m-0" style={{ '--tooltip-txt': `'${__('Check by Default')}'` }}>
                    <input aria-label="checkbox" onChange={(e) => setCheck(e, i)} type="checkbox" checked={itm.check !== undefined} />
                    <span className="btcd-mrk ck br-50 " />
                  </label>
                  <button onClick={() => rmvOpt(i)} className={`${css(app.btn)} cls-btn`} type="button" aria-label="close"><CloseIcn size="12" /></button>
                </div>
              </div>
            ))}
            <button onClick={addOpt} className={`${css(app.btn)} blue`} type="button">
              {__('Add More +')}
            </button>
          </div>
        </>
      </SimpleAccordion> */}
      <UniqFieldSettings
        type="entryUnique"
        title={__('Unique Entry')}
        tipTitle={tippyHelperMsg.uniqueEntry}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        isUnique="show"
      />

      <FieldSettingsDivider />

      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={closeOptionModal}
        className="o-v"
        title={__('Options')}
        width="755px"
      >
        <EditOptions
          optionMdl={optionMdl}
          options={options}
          setOptions={newOpts => handleOptions(newOpts)}
          lblKey="lbl"
          valKey="val"
          type={fieldData.typ}
          customType={fieldData.customType}
          setCustomType={handleCustomType}
        />
      </Modal>
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
            lblKey="lbl"
            valKey="val"
            customType={fieldData}
          />
        </div>
      </Modal> */}
    </div>
  )
}

export default memo(RadioCheckSettings)

const style = {
  plsIcn: {
    ml: 3, mt: 3, tm: 'rotate(45deg)',
  },
}
