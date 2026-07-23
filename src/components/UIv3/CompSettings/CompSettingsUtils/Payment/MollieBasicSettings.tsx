/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useRef } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { $bits, $fields } from '../../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../../GlobalStates/StylesState'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addFormUpdateError, addToBuilderHistory, removeFormUpdateError } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import { currencies, paymentMethodLists } from '../../../../../Utils/StaticData/mollieData'
import AutoResizeInput from '../../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import CheckBox from '../../../../Utilities/CheckBox'
import SingleInput from '../../../../Utilities/SingleInput'
import SingleToggle from '../../../../Utilities/SingleToggle'

interface MollieBasicSettingsProps {
  /**
   * Additional CSS class names
   */
  className?: string
}

export default function MollieBasicSettings({
  className = ''
}: MollieBasicSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const setStyles = useSetAtom($styles)
  const { allPages } = useAtomValue($bits)
  const { css } = useFela()
  const shortcodeText = useRef<HTMLInputElement>(null)

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const config = fieldData.config || {}
  const isDynamicAmount = config.amountType === 'dynamic'
  const fieldLabel = fieldData?.lbl ?? ''

  const pos = [
    { name: __('Left'), value: 'start' },
    { name: __('Center'), value: 'center' },
    { name: __('Right'), value: 'end' },
  ]

  // Get amount fields
  const getAmountFields = () => {
    const formFields = Object.entries(fields)
    const filteredFields = formFields.filter(field =>
      field[1].typ.match(/^(radio|number|currency)/)
    )
    return filteredFields.map(itm => (
      <option key={itm[0]} value={itm[0]}>
        {itm[1].adminLbl || itm[1].lbl}
      </option>
    ))
  }

  const handleInput = (name: string, value: string): void => {
    const updatedFields = create(fields, draft => {
      if (!draft[fldKey].config) {
        draft[fldKey].config = {}
      }

      if (value) {
        const keys = name.split('->')
        let current: any = draft[fldKey]

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = value
          } else {
            if (!current[key]) current[key] = {}
            current = current[key]
          }
        })
      }

      // Validation
      if (name === 'config->redirect_url') {
        if (value) {
          removeFormUpdateError(fldKey, 'mollieRedirectUrlMissing')
        } else {
          addFormUpdateError({
            fieldKey: fldKey,
            errorKey: 'mollieRedirectUrlMissing',
            errorMsg: __('Mollie Redirect Url is not Selected'),
            errorUrl: `field-settings/${fldKey}`,
          })
        }
      } else if (name === 'config->currency') {
        if (value) {
          removeFormUpdateError(fldKey, 'mollieCurrencyMissing')
        }
      } else if (name === 'config->amount') {
        const currencyMinAmount = 0.01
        if (Number(value) < currencyMinAmount) {
          addFormUpdateError({
            fieldKey: fldKey,
            errorKey: 'mollieAmountMin',
            errorMsg: __(`Mollie Minimum Amount is ${currencyMinAmount}`),
            errorUrl: `field-settings/${fldKey}`,
          })
        } else {
          removeFormUpdateError(fldKey, 'mollieAmountMin')
          removeFormUpdateError(fldKey, 'mollieAmountMissing')
        }
      } else if (name === 'config->amountFld') {
        if (value) {
          removeFormUpdateError(fldKey, 'mollieAmountFldMissing')
        }
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} changed to ${value}: ${fieldLabel || fldKey}`,
      type: `${name}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const setPayBtnTxt = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedFields = create(fields, draft => {
      draft[fldKey].txt = e.target.value
    })
    setFields(updatedFields)

    addToBuilderHistory({
      event: `Mollie pay button text updated : ${e.target.value}`,
      type: 'change_mollie_pay_btn_txt',
      state: { fields: updatedFields, fldKey }
    })
  }

  const setAmountType = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      if (!draft[fldKey].config) {
        draft[fldKey].config = {}
      }

      if (value) {
        draft[fldKey].config.amountType = value
      } else {
        delete draft[fldKey].config.amountType
      }

      delete draft[fldKey].config.amount
      delete draft[fldKey].config.amountFld

      // Update validation
      if (value === 'dynamic') {
        removeFormUpdateError(fldKey, 'mollieAmountMissing')
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'mollieAmountFldMissing',
          errorMsg: __('Mollie Dynamic Amount Field is not Selected'),
          errorUrl: `field-settings/${fldKey}`,
        })
      } else {
        removeFormUpdateError(fldKey, 'mollieAmountFldMissing')
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'mollieAmountMissing',
          errorMsg: __('Mollie Fixed Amount is not valid'),
          errorUrl: `field-settings/${fldKey}`,
        })
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Amount Type Changed to "${value}": ${fieldLabel || fldKey}`,
      type: 'set_amount',
      state: { fields: updatedFields, fldKey }
    })
  }

  const paymentMethods = () => paymentMethodLists.map(itm => ({
    value: itm.method,
    label: itm.title
  }))

  const handlePaymentMethodType = (val: string): void => {
    const updatedFields = create(fields, draft => {
      if (!draft[fldKey].config) {
        draft[fldKey].config = {}
      }

      if (val) {
        const valArr = val.split(',')
        draft[fldKey].config.payment_method = valArr
      } else {
        draft[fldKey].config.payment_method = ['creditcard']
      }
    })

    setFields(updatedFields)
  }

  const onChangeHandler = (name: string, value: boolean | string): void => {
    let message: string | null = null
    let type: string | null = null

    setStyles(preStyle => create(preStyle, drftStyle => {
      if (name === 'btnFulW') {
        drftStyle.fields[fldKey].classes[`.${fldKey}-mollie-btn`].width = value ? '100%' : 'auto'
        message = `Button Full width ${value ? 'on' : 'off'}`
        type = 'set_btn_full'
      } else if (name === 'txtAlign') {
        drftStyle.fields[fldKey].classes[`.${fldKey}-mollie-btn`]['justify-content'] = value
        message = `Button Text Align ${value}`
        type = 'set_btn_txt_align'
      } else if (name === 'btnAlign') {
        drftStyle.fields[fldKey].classes[`.${fldKey}-mollie-wrp`]['justify-content'] = value
        message = `Button Align ${value}`
        type = 'set_btn_align'
      }
    }))

    const updatedFields = create(fields, draft => {
      draft[fldKey][name] = value
    })
    setFields(updatedFields)

    if (message && type) {
      addToBuilderHistory({
        event: message,
        type,
        state: { fields: updatedFields, fldKey }
      })
    }
  }

  const copyToClipboard = (value: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value)
    }
    if (shortcodeText.current) {
      shortcodeText.current.setAttribute('value', value)
      shortcodeText.current.select()
    }

    return new Promise<void>((res, rej) => {
      if (document.execCommand('copy')) res()
      else rej()
    })
  }

  const copyText = () => {
    copyToClipboard('[bitform_payments]')
      .then(() => toast.success(__('Copied on clipboard.')))
      .catch(() => toast.error(__('Failed to Copy, Try Again.')))
  }

  return (
    <div className={className}>
      {/* Redirect Page URL */}
      <SimpleAccordion
        id="btn-txt-stng"
        title={__('Redirect Page Url')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <select
            data-testid="prfil-page_url-slct"
            onChange={e => handleInput('config->redirect_url', e.target.value)}
            className={css(FieldStyle.input)}
            value={config.redirect_url || ''}
          >
            <option value="">{__('Select Page')}</option>
            {allPages.map(page => (
              <option key={page.title} value={page.url}>
                {page.title}
              </option>
            ))}
          </select>
        </div>
        <div className={css(FieldStyle.placeholder)}>
          <p>Page URL</p>
          <input
            data-testid="nam-stng-inp"
            aria-label="Redirect Page URL"
            placeholder="Enter Page URL"
            className={css(FieldStyle.input)}
            value={config.redirect_url || ''}
            onChange={e => handleInput('config->redirect_url', e.target.value)}
          />
        </div>
        <p className={css({ fw: 400, cr: '#5c5959' })}>
          <strong>Note: </strong>
          Create/Edit a page and insert the shortcode
          {' '}
          <span
            title="Click for Copy shortcode"
            role="button"
            tabIndex={0}
            onClick={copyText}
            className={css({
              cr: '#44484a',
              cur: 'pointer',
              '&:hover': { cr: '#0056b3', td: 'underline' }
            })}
          >
            <strong>[bitform_payments]</strong>
          </span>
          {' '}
          into the page content.
        </p>
        <input
          className={css({ oy: 0, h: 0, m: 0, pn: 'absolute', tp: 0 })}
          ref={shortcodeText}
        />
      </SimpleAccordion>
      <FieldSettingsDivider />

      {/* Pay Button Text */}
      <SimpleAccordion
        id="pay-btn-txt-stng"
        title={__('Pay Button Text')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <AutoResizeInput
            id="pay-btn-txt"
            aria-label="Mollie pay button text"
            placeholder="Type text here..."
            value={fieldData.txt || ''}
            changeAction={setPayBtnTxt}
          />
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      {/* Payment Method */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <label htmlFor="payment_method">
          <b>{__('Payment Method')}</b>
          <MultiSelect
            className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
            options={paymentMethods()}
            onChange={handlePaymentMethodType}
            defaultValue={(config.payment_method || []).join(',')}
          />
        </label>
      </div>
      <FieldSettingsDivider />

      {/* Currency */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <label htmlFor="currency">
          <b>{__('Currency')}</b>
          <select
            data-testid="prfil-country-slct"
            onChange={e => handleInput('config->currency', e.target.value)}
            className={css(FieldStyle.input)}
            value={config.currency || ''}
          >
            <option value="">{__('Select Currency')}</option>
            {Object.entries(currencies).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
      <FieldSettingsDivider />

      {/* Amount Type */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <b>{__('Amount Type')}</b>
        <CheckBox
          id="amnt-typ-fxd"
          onChange={setAmountType}
          radio
          checked={!isDynamicAmount}
          title={__('Fixed')}
        />
        <CheckBox
          id="amnt-typ-dynmc"
          onChange={setAmountType}
          radio
          checked={isDynamicAmount}
          title={__('Dynamic')}
          value="dynamic"
        />
      </div>

      {/* Fixed Amount */}
      {!isDynamicAmount && (
        <div className={css(ut.ml2, ut.mr2, ut.p1)}>
          <SingleInput
            id="amnt"
            className={css(ut.mt0)}
            cls={css(FieldStyle.input)}
            inpType="number"
            title={__('Amount')}
            value={config.amount || ''}
            action={e => handleInput('config->amount', e.target.value)}
          />
        </div>
      )}

      {/* Dynamic Amount Field */}
      {isDynamicAmount && (
        <div className={css(ut.ml2, ut.mr2, ut.p1)}>
          <b>{__('Select Amount Field')}</b>
          <select
            data-testid="slct-amnt-slct"
            onChange={e => handleInput('config->amountFld', e.target.value)}
            name="amountFld"
            className={css(FieldStyle.input)}
            value={config.amountFld || ''}
          >
            <option value="">{__('Select Field')}</option>
            {getAmountFields()}
          </select>
        </div>
      )}
      <FieldSettingsDivider />
      {/* Full Width Toggle */}
      <div className={css(ut.ml2, ut.mr2, ut.p1, { pr: '36px' })}>
        <SingleToggle
          id="ful-wid-btn"
          tip="By disabling this option, the button full width will be removed"
          title={__('Full Width')}
          action={({ target }) => onChangeHandler('btnFulW', target.checked)}
          isChecked={fieldData.btnFulW || false}
        />
      </div>

      {/* Button Align (when not full width) */}
      {!fieldData.btnFulW && (
        <SimpleAccordion
          id="mollie-btn-algn"
          title={__('Button Align')}
          className={css(FieldStyle.fieldSection)}
          open
        >
          <div className={css(FieldStyle.placeholder)}>
            <select
              data-testid="btn-algn-slct"
              className={css(FieldStyle.input)}
              value={fieldData.btnAlign || 'start'}
              onChange={({ target }) => onChangeHandler('btnAlign', target.value)}
            >
              {pos.map(itm => (
                <option key={`btcd-k-${itm.name}`} value={itm.value}>
                  {itm.name}
                </option>
              ))}
            </select>
          </div>
        </SimpleAccordion>
      )}

      {/* Text Align (when full width) */}
      {fieldData.btnFulW && (
        <SimpleAccordion
          id="mollie-txt-algn"
          title={__('Text Align')}
          className={css(FieldStyle.fieldSection)}
          open
        >
          <div className={css(FieldStyle.placeholder)}>
            <select
              data-testid="mollie-txt-algn"
              className={css(FieldStyle.input)}
              value={fieldData.txtAlign || 'center'}
              onChange={({ target }) => onChangeHandler('txtAlign', target.value)}
            >
              {pos.map(itm => (
                <option key={`btcd-k-${itm.name}`} value={itm.value}>
                  {itm.name}
                </option>
              ))}
            </select>
          </div>
        </SimpleAccordion>
      )}
    </div>
  )
}