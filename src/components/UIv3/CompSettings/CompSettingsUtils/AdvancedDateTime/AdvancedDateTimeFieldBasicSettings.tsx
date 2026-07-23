import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useEffect, useRef } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import dateFormatsList from '../../../../CompSettings/FieldSettings/AdvancedDateTime/dateFomatesList'
import SetDateTimeComp from '../../../../CompSettings/FieldSettings/AdvancedDateTime/SetDateTimeComp'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Cooltip from '../../../../Utilities/Cooltip'
import RenderHtml from '../../../../Utilities/RenderHtml'
import SingleToggle from '../../../../Utilities/SingleToggle'

export default function AdvancedDateTimeFieldBasicSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  const minDateRef = useRef<HTMLInputElement>(null)
  const maxDateRef = useRef<HTMLInputElement>(null)
  const defaultDateRef = useRef<HTMLInputElement>(null)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])

  const handle = ({ target: { checked, name } }: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      fieldData.config[name] = true
    } else {
      fieldData.config[name] = false
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${name} ${checked ? 'on' : 'off'}: ${fieldData.lbl || fldKey}`,
      type: name,
      state: { fldKey, fields: allFields }
    })
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'altFormat') {
      if (value === '') {
        delete fieldData.config.altInput
      } else {
        fieldData.config.altInput = true
      }
    }

    if (name === 'dateFormat') {
      // Change date of static dates if they are set
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
    addToBuilderHistory({
      event: `Modify ${name}: ${fieldData.lbl || fldKey}`,
      type: name,
      state: { fldKey, fields: allFields }
    })
    setFields(allFields)
  }

  // Initialize flatpickr instances for date pickers
  useEffect(() => {
    if (minDateRef.current) {
      flatpickr(minDateRef.current, {
        dateFormat: fieldData.config.dateFormat,
        allowInput: true,
        noCalendar: fieldData.config.noCalendar,
        enableTime: fieldData.config.enableTime,
        time_24hr: fieldData.config.time_24hr,
        onChange: (selectedDates, dateStr) => {
          onChangeHandler({ target: { name: 'minDate', value: dateStr } } as any)
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
          onChangeHandler({ target: { name: 'maxDate', value: dateStr } } as any)
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
          onChangeHandler({ target: { name: 'defaultDate', value: dateStr } } as any)
        },
      })
    }
  }, [fieldData])

  return (
    <SimpleAccordion
      id="basic-stng"
      title={__('Basic Configuration')}
      className={css(FieldStyle.fieldSection)}
      open
      isPro
    >
      <div className={css(ut.p2)}>
        {/* Calendar Mode */}
        <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
          <span>Calender Mode</span>
          <select
            data-testid="advanced-date-time-mode"
            className={css(FieldStyle.input, ut.w5, ut.mt1)}
            name="mode"
            value={fieldData?.config?.mode || 'single'}
            onChange={onChangeHandler}
          >
            <option value="single">{__('Single')}</option>
            <option value="range">{__('Range')}</option>
            <option value="multiple">{__('Multiple')}</option>
          </select>
        </div>

        {/* View Format (altFormat) */}
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
            value={fieldData?.config?.altFormat || ''}
            onChange={onChangeHandler}
          >
            <option value="">Select One</option>
            {dateFormatsList.map((formatObj) => (
              <option key={formatObj.value} value={formatObj.value}>
                {formatObj.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value Format (dateFormat) */}
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
            value={fieldData?.config?.dateFormat || 'Y-m-d'}
            onChange={onChangeHandler}
          >
            {dateFormatsList.map((formatObj) => (
              <option key={formatObj.value} value={formatObj.value}>
                {formatObj.label}
              </option>
            ))}
          </select>
        </div>

        {/* Default Date */}
        <div className={css(settingOptionStyle.defaultDateMode, { mt: 5 })}>
          <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
            <span>Default Date</span>
            <select
              data-testid="advanced-date-time-default-mode"
              className={css(FieldStyle.input, ut.w5, ut.mt1)}
              name="defaultDateMode"
              value={fieldData?.config?.defaultDateMode || 'none'}
              onChange={onChangeHandler}
            >
              {dateModeList.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {fieldData?.config?.defaultDateMode === 'static' && (
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
          {fieldData?.config?.defaultDateMode === 'dynamic' && (
            <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
              <span className={css(settingOptionStyle.subLbl)}>{__('Relative to Today (± Days)')}</span>
              <input
                type="number"
                data-testid="default-date-dynamic-inp"
                className={`${css(FieldStyle.input, ut.w5, ut.mt1)} advanced-date-time-default-date`}
                name="defaultDateDynamic"
                value={fieldData?.config?.defaultDateDynamic || ''}
                onChange={onChangeHandler}
              />
            </div>
          )}
        </div>

        {/* Minimum Date */}
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
              {dateModeList.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {fieldData?.config?.minDateMode === 'static' && (
            <SetDateTimeComp
              compRef={minDateRef}
              typeName="minDate"
              fieldData={fieldData}
              onChangeHandler={onChangeHandler}
              label="Static"
              tipMsg="The minimum date that a user can start picking from (inclusive)."
            />
          )}

          {fieldData?.config?.minDateMode === 'dynamic' && (
            <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
              <span className={css(settingOptionStyle.subLbl)}>{__('Days before today')}</span>
              <input
                type="number"
                data-testid="min-date-dynamic-inp"
                className={`${css(FieldStyle.input, ut.w5, ut.mt1)} advanced-date-time-min-date`}
                name="minDateDynamic"
                value={fieldData?.config?.minDateDynamic || ''}
                onChange={onChangeHandler}
              />
            </div>
          )}
        </div>

        {/* Maximum Date */}
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
              {dateModeList.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {fieldData?.config?.maxDateMode === 'static' && (
            <SetDateTimeComp
              compRef={maxDateRef}
              typeName="maxDate"
              fieldData={fieldData}
              onChangeHandler={onChangeHandler}
              label="Static"
              tipMsg="The maximum date that a user can pick to (inclusive)."
            />
          )}

          {fieldData?.config?.maxDateMode === 'dynamic' && (
            <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
              <span className={css(settingOptionStyle.subLbl)}>{__('Days after today')}</span>
              <input
                type="number"
                data-testid="max-date-dynamic-inp"
                className={`${css(FieldStyle.input, ut.w5, ut.mt1)} advanced-date-time-max-date`}
                name="maxDateDynamic"
                value={fieldData?.config?.maxDateDynamic || ''}
                onChange={onChangeHandler}
              />
            </div>
          )}
        </div>

        {/* Allow Input Toggle */}
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
            isChecked={fieldData?.config?.allowInput || false}
            name="allowInput"
            action={handle}
          />
        </div>

        {/* Enable Time Toggle */}
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
            isChecked={fieldData?.config?.enableTime || false}
            name="enableTime"
            action={handle}
          />
        </div>

        {/* 24H Format Toggle (Conditional on Enable Time) */}
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
              isChecked={fieldData?.config?.time_24hr || false}
              name="time_24hr"
              action={handle}
            />
          </div>
        )}

        {/* Hide Calendar Toggle */}
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
            isChecked={fieldData?.config?.noCalendar || false}
            name="noCalendar"
            action={handle}
          />
        </div>
      </div>
    </SimpleAccordion>
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
    brs: 'var(--bf-bdr-radius-sm)',
    mb: 10,
  },
  subLbl: { fs: 12, ml: 10 },
}