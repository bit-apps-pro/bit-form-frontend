/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import 'ace-builds'
// modes
import 'ace-builds/src-min-noconflict/mode-css'
import 'ace-builds/src-min-noconflict/mode-javascript'
// snippets
import 'ace-builds/src-min-noconflict/snippets/css'
import 'ace-builds/src-min-noconflict/snippets/javascript'
// themes
import 'ace-builds/src-min-noconflict/theme-tomorrow'
import 'ace-builds/src-min-noconflict/theme-twilight'
// extensions
import 'ace-builds/src-min-noconflict/ext-emmet'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { memo, useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import ut from '../../../../styles/2.utilities'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import Cooltip from '../../../Utilities/Cooltip'
import Modal from '../../../Utilities/Modal'
import RenderHtml from '../../../Utilities/RenderHtml'
import SingleToggle from '../../../Utilities/SingleToggle'
import AdminLabelSettings from '../../CompSettingsUtils/AdminLabelSettings'
import FieldDisabledSettings from '../../CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from '../../CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from '../../CompSettingsUtils/FieldLabelSettings'
import FieldSettingsDivider from '../../CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from '../../CompSettingsUtils/HelperTxtSettings'
import InputIconsSettings from '../../CompSettingsUtils/InputIconsSettings'
import PlaceholderSettings from '../../CompSettingsUtils/PlaceholderSettings'
import RequiredSettings from '../../CompSettingsUtils/RequiredSettings'
import SubTitleSettings from '../../CompSettingsUtils/SubTitleSettings'
import Icons from '../../Icons'
import SimpleAccordion from '../../StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from '../../StyleCustomize/FieldSettingTitle'
import SizeAndPosition from '../../StyleCustomize/StyleComponents/SizeAndPosition'
import AdvancedDateTimeFieldAceModel from './AdvancedDateTimeFieldAceModel'
import dateFormatsList from './dateFomatesList'
import SetDateTimeComp from './SetDateTimeComp'

function AdvancedDateTimeFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  const minDateRef = useRef(null)
  const maxDateRef = useRef(null)
  const defaultDateRef = useRef(null)
  const { css } = useFela()

  if (!fldKey) return <>No field exist with this field key</>

  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [labelModal, setLabelModal] = useState(false)

  const handle = ({ target: { checked, name } }) => {
    if (checked) {
      fieldData.config[name] = true
    } else {
      fieldData.config[name] = false
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${name} ${checked ? 'on' : 'off'} : ${fieldData.lbl || fldKey}`, type: name, state: { fldKey, fields: allFields } })
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target

    if (name === 'altFormat') {
      if (value === '') {
        delete fieldData.config.altInput
      } else {
        fieldData.config.altInput = true
      }
    }

    if (name === 'dateFormat') {
      // change date of static dates if they are set
      if (fieldData.config.defaultDate) {
        const parsedDate = flatpickr.parseDate(fieldData.config.defaultDate, fieldData.config.dateFormat)
        if (parsedDate) {
          fieldData.config.defaultDate = flatpickr.formatDate(parsedDate, value)
        }
      }
      if (fieldData.config.minDate) {
        const parsedDate = flatpickr.parseDate(fieldData.config.minDate, fieldData.config.dateFormat)
        if (parsedDate) {
          fieldData.config.minDate = flatpickr.formatDate(parsedDate, value)
        }
      }
      if (fieldData.config.maxDate) {
        const parsedDate = flatpickr.parseDate(fieldData.config.maxDate, fieldData.config.dateFormat)
        if (parsedDate) {
          fieldData.config.maxDate = flatpickr.formatDate(parsedDate, value)
        }
      }
    }

    fieldData.config[name] = value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    addToBuilderHistory({ event: `Modify Type : ${fieldData.lbl || fldKey}`, type: name, state: { fldKey, fields: allFields } })
    setFields(allFields)
  }

  useEffect(() => {
    if (minDateRef.current) {
      flatpickr(minDateRef.current, {
        dateFormat: fieldData.config.dateFormat,
        allowInput: true,
        noCalendar: fieldData.config.noCalendar,
        enableTime: fieldData.config.enableTime,
        time_24hr: fieldData.config.time_24hr,
        onChange: (selectedDates, dateStr) => {
          onChangeHandler({ target: { name: 'minDate', value: dateStr } })
        },
      })
    }
    if (maxDateRef.current) {
      flatpickr(maxDateRef.current, {
        dateFormat: fieldData.config.dateFormat,
        allowInput: true,
        noCalendar: fieldData.config.noCalendar,
        enableTime: fieldData.config.enableTime,
        time_24hr: fieldData.config.time_24hr,
        onChange: (selectedDates, dateStr) => {
          onChangeHandler({ target: { name: 'maxDate', value: dateStr } })
        },
      })
    }

    if (defaultDateRef.current) {
      flatpickr(defaultDateRef.current, {
        dateFormat: fieldData.config.dateFormat,
        allowInput: true,
        mode: fieldData.config.mode,
        noCalendar: fieldData.config.noCalendar,
        enableTime: fieldData.config.enableTime,
        time_24hr: fieldData.config.time_24hr,
        onChange: (selectedDates, dateStr) => {
          onChangeHandler({ target: { name: 'defaultDate', value: dateStr } })
        },
      })
    }
  }, [fieldData])
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
        <InputIconsSettings />

        <FieldSettingsDivider />
        <SimpleAccordion
          id="basic-stng"
          title={__('Basic Configuration')}
          className={css(FieldStyle.fieldSection)}
          open
          isPro
        >
          <div className={css(ut.p2)}>
            <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
              <span>Calender Mode</span>
              <select
                data-testid="advanced-date-time-mode"
                className={css(FieldStyle.input, ut.w5, ut.mt1)}
                name="mode"
                value={fieldData?.config?.mode}
                onChange={onChangeHandler}
              >
                <option value="single">{__('Single')}</option>
                <option value="range">{__('Range')}</option>
                <option value="multiple">{__('Multiple')}</option>
              </select>
            </div>
            <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
              <div className={css(ut.flxb)}>
                <div className={css(ut.fw500)}>{__('View Format')}</div>
                <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                  <div className={css(ut.tipBody)}>
                    <RenderHtml html={__('Show the user a readable date (as per altFormat), but return something totally different to the server. <a href="https://flatpickr.js.org/options/#:~:text=Description-,altFormat,-String" target="_blank">Learn more</>')} />
                  </div>
                </Cooltip>
              </div>
              <select
                data-testid="advanced-date-time-alt-format"
                className={css(FieldStyle.input, ut.w5, ut.mt1)}
                name="altFormat"
                value={fieldData?.config?.altFormat}
                onChange={onChangeHandler}
              >
                <option value="">Select One</option>
                {dateFormatsList.map((formatObj) => <option key={formatObj.value} value={formatObj.value}>{formatObj.label}</option>)}
              </select>
            </div>

            <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
              <div className={css(ut.flxb)}>
                <div className={css(ut.fw500)}>{__('Value Format')}</div>
                <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                  <div className={css(ut.tipBody)}>
                    <RenderHtml html={__('A string of characters which are used to define how the date will be displayed in the input box. The supported characters are defined in the <a href="https://flatpickr.js.org/formatting/" target="_blank">documentation.</a>')} />
                  </div>
                </Cooltip>
              </div>
              <select
                data-testid="advanced-date-time-date-format"
                className={css(FieldStyle.input, ut.w5, ut.mt1)}
                name="dateFormat"
                value={fieldData?.config?.dateFormat}
                onChange={onChangeHandler}
              >
                {dateFormatsList.map((formatObj) => <option key={formatObj.value} value={formatObj.value}>{formatObj.label}</option>)}
              </select>
            </div>

            <div className={css(settingOptionStyle.defaultDateMode, { mt: 5 })}>
              <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
                <span>Default Date</span>
                <select
                  data-testid="advanced-date-time-mode"
                  className={css(FieldStyle.input, ut.w5, ut.mt1)}
                  name="defaultDateMode"
                  value={fieldData?.config?.defaultDateMode || 'none'}
                  onChange={onChangeHandler}
                >
                  {dateModeList.map((mode) => (<option key={mode.value} value={mode.value}>{mode.label}</option>))}
                </select>
              </div>

              {fieldData?.config?.defaultDateMode && fieldData?.config?.defaultDateMode === 'static' && (
                <SetDateTimeComp
                  compRef={defaultDateRef}
                  typeName="defaultDate"
                  fieldData={fieldData}
                  onChangeHandler={onChangeHandler}
                  label="Static"
                  tipMsg="The default date that a user can start picking from (inclusive)."
                  cls={css({ ml: '10px' })}
                />
              )}
              {fieldData?.config?.defaultDateMode && fieldData?.config?.defaultDateMode === 'dynamic' && (
                <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
                  <span className={css(settingOptionStyle.subLbl)}>{__('Relative to Today (± Days)')}</span>
                  <input
                    type="number"
                    data-testid="alw-mltpl-max-inp"
                    className={`${css(FieldStyle.input, ut.w5, ut.mt1)} advanced-date-time-default-date`}
                    name="defaultDateDynamic"
                    value={fieldData?.config?.defaultDateDynamic || ''}
                    onChange={onChangeHandler}
                  />
                </div>
              )}
            </div>

            <div className={css(settingOptionStyle.defaultDateMode)}>
              <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
                <span>Minimum Date</span>
                <select
                  data-testid="advanced-date-time-min-mode"
                  className={css(FieldStyle.input, ut.w5, ut.mt1)}
                  name="minDateMode"
                  value={fieldData?.config?.minDateMode || 'none'}
                  onChange={onChangeHandler}
                >
                  {dateModeList.map((mode) => (<option key={mode.value} value={mode.value}>{mode.label}</option>))}
                </select>
              </div>

              {fieldData?.config?.minDateMode && fieldData?.config?.minDateMode === 'static' && (
                <SetDateTimeComp
                  compRef={minDateRef}
                  typeName="minDate"
                  fieldData={fieldData}
                  onChangeHandler={onChangeHandler}
                  label="Static"
                  tipMsg="The minimum date that a user can start picking from (inclusive)."
                />
              )}

              {fieldData?.config?.minDateMode && fieldData?.config?.minDateMode === 'dynamic' && (
                <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
                  <span className={css(settingOptionStyle.subLbl)}>{__('Days before today')}</span>
                  <input
                    type="number"
                    data-testid="alw-mltpl-max-inp"
                    className={`${css(FieldStyle.input, ut.w5, ut.mt1)} advanced-date-time-min-date`}
                    name="minDateDynamic"
                    value={fieldData?.config?.minDateDynamic || ''}
                    onChange={onChangeHandler}
                  />
                </div>
              )}
            </div>

            <div className={css(settingOptionStyle.defaultDateMode)}>
              <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
                <span>Maximum Date</span>
                <select
                  data-testid="advanced-date-time-max-mode"
                  className={css(FieldStyle.input, ut.w5, ut.mt1)}
                  name="maxDateMode"
                  value={fieldData?.config?.maxDateMode || 'none'}
                  onChange={onChangeHandler}
                >
                  {dateModeList.map((mode) => (<option key={mode.value} value={mode.value}>{mode.label}</option>))}
                </select>
              </div>

              {fieldData?.config?.maxDateMode && fieldData?.config?.maxDateMode === 'static' && (
                <SetDateTimeComp
                  compRef={maxDateRef}
                  typeName="maxDate"
                  fieldData={fieldData}
                  onChangeHandler={onChangeHandler}
                  label="Static"
                  tipMsg="The maximum date that a user can pick to (inclusive)."
                />
              )}

              {fieldData?.config?.maxDateMode && fieldData?.config?.maxDateMode === 'dynamic' && (
                <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
                  <span className={css(settingOptionStyle.subLbl)}>{__('Days after today')}</span>
                  <input
                    type="number"
                    data-testid="alw-mltpl-max-inp"
                    className={`${css(FieldStyle.input, ut.w5, ut.mt1)} advanced-date-time-min-date`}
                    name="maxDateDynamic"
                    value={fieldData?.config?.maxDateDynamic || ''}
                    onChange={onChangeHandler}
                  />
                </div>
              )}
            </div>

            <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip, { my: 15 })}>
              <div className={css(ut.flxb)}>
                <div className={css(ut.fw500)}>{__('Allow Input')}</div>
                <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                  <div className={css(ut.tipBody)}>
                    {__('Allows the user to enter a date directly into the input field. By default, direct entry is disabled.')}
                  </div>
                </Cooltip>
              </div>

              <SingleToggle
                id="advanced-date-time-allow-input"
                className={css(ut.mr4)}
                isChecked={fieldData?.config?.allowInput}
                name="allowInput"
                action={handle}
              />
            </div>

            <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip, { my: 15 })}>
              <div className={css(ut.flxb)}>
                <div className={css(ut.fw500)}>{__('Enable Time')}</div>
                <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                  <div className={css(ut.tipBody)}>
                    {__('Enables time picker. By default, time picker is disabled. If you want to use time picker, you need to enable this.')}
                  </div>
                </Cooltip>
              </div>
              <SingleToggle
                id="advanced-date-time-enable-time"
                className={css(ut.mr4)}
                isChecked={fieldData?.config?.enableTime}
                name="enableTime"
                action={handle}
              />
            </div>
            {fieldData?.config?.enableTime && (
              <div className={css(ut.flxcb, FieldStyle.labelTip)}>
                <div className={css(ut.flxb)}>
                  <div className={css(ut.fw500)}>{__('24H Format')}</div>
                  <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                    <div className={css(ut.tipBody)}>
                      {__('Enables 24-hour format for time. By default, 12-hour format is used. If you want to use 24-hour format, you need to enable this.')}
                    </div>
                  </Cooltip>
                </div>
                <SingleToggle
                  id="advanced-date-time-time_24hr"
                  className={css(ut.mr4)}
                  isChecked={fieldData?.config?.time_24hr}
                  name="time_24hr"
                  action={handle}
                />
              </div>
            )}

            <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip, { my: 15 })}>
              <div className={css(ut.flxb)}>
                <div className={css(ut.fw500)}>{__('Hide Calender')}</div>
                <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                  <div className={css(ut.tipBody)}>
                    {__('Hides the calendar. By default, calendar is shown. If you want to hide the calendar, you need to enable this.')}
                  </div>
                </Cooltip>
              </div>
              <SingleToggle
                id="advanced-date-time-hide-calender"
                className={css(ut.mr4)}
                isChecked={fieldData?.config?.noCalendar}
                name="noCalendar"
                action={handle}
              />
            </div>
          </div>
        </SimpleAccordion>

        <FieldSettingsDivider />

        <SimpleAccordion
          id="basic-stng"
          title={__('Advanced Configuration')}
          className={css(FieldStyle.fieldSection)}
          open
          isPro
        >
          <div
            role="button"
            tabIndex={-1}
            data-testid="alw-mltpl-max-inp"
            className={css(ut.p2)}
            onClick={() => setLabelModal(true)}
            onKeyDown={() => setLabelModal(true)}
          >
            <AceEditor
              placeholder="Write your custom configuration here"
              mode="javascript"
              theme="twilight"
              name="blah2"
              value={fieldData?.config?.advancedConfig || ''}
              fontSize={14}
              lineHeight={19}
              height="200px"
              width="100%"
              showPrintMargin
              showGutter={false}
              highlightActiveLine
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                enableMobileMenu: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
            <p className={css(ut.mt1, ut.fw500, { cr: 'var(--white-0-50)' })}>
              <RenderHtml html={__('Only valid JS object will work. for more details please check<a target="_blank" href="https://flatpickr.js.org/options/" rel="noreferrer"> the documentation for available configuration options</a>')} />
            </p>
          </div>
        </SimpleAccordion>
        <AdvancedDateTimeFieldAceModel labelModal={labelModal} setLabelModal={setLabelModal} />
        <FieldSettingsDivider />

        <PlaceholderSettings />

        <FieldSettingsDivider />

        <HelperTxtSettings />

        <FieldSettingsDivider />

        <RequiredSettings />

        <FieldSettingsDivider />

        <FieldDisabledSettings />

        <FieldSettingsDivider />

        <FieldHideSettings />

        <FieldSettingsDivider />

        {/* <FieldDisabledSettings />

        <FieldSettingsDivider /> */}

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

        <Icons iconType={icnType} setModal={setIcnMdl} />
      </Modal>
    </>
  )
}

const dateModeList = [
  { value: 'none', label: __('None') },
  { value: 'today', label: __('Current Date') },
  { value: 'static', label: __('Static') },
  { value: 'dynamic', label: __('Dynamic') },
]

const settingOptionStyle = {
  defaultDateMode: {
    b: '1px solid var(--white-0-83)',
    p: '5px 10px',
    brs: 8,
    mb: 10,
  },
  subLbl: { fs: 12, ml: 10 },
}

export default memo(AdvancedDateTimeFieldSettings)
