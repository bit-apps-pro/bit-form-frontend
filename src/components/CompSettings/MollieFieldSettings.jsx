/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useRef } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $bits, $fields } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { addFormUpdateError, addToBuilderHistory, deleteNestedObj, removeFormUpdateError } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { currencies, locale, paymentMethodLists } from '../../Utils/StaticData/mollieData'
import tippyHelperMsg from '../../Utils/StaticData/tippyHelperMsg'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import CheckBox from '../Utilities/CheckBox'
import Cooltip from '../Utilities/Cooltip'
import RenderHtml from '../Utilities/RenderHtml'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import { assignNestedObj } from '../style-new/styleHelpers'
import AutoResizeInput from './CompSettingsUtils/AutoResizeInput'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'

export default function MollieFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const setStyles = useSetAtom($styles)
  const fieldData = deepCopy(fields[fldKey])
  const formFields = Object.entries(fields)
  const payments = useAtomValue($payments)
  const isDynamicAmount = fieldData.config?.amountType === 'dynamic'
  const { css } = useFela()
  const { payIntegID, config, txt, btnFulW, btnAlign, txtAlign } = fieldData
  const { allPages } = useAtomValue($bits)
  const shortcodeText = useRef(null)

  const pos = [
    { name: __('Left'), value: 'start' },
    { name: __('Center'), value: 'center' },
    { name: __('Right'), value: 'end' },
  ]

  const requiredSettingChecker = (value, errorKey, errorMsg) => {
    if (value) {
      removeFormUpdateError(fldKey, errorKey)
    } else {
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey,
        errorMsg: __(errorMsg),
        errorUrl: `field-settings/${fldKey}`,
      })
    }
  }
  const handleInput = (name, value) => {
    if (value) {
      assignNestedObj(fieldData, name, value)
    } else {
      deleteNestedObj(fieldData, name)
    }
    // https://help.mollie.com/hc/en-us/articles/115000667365-What-is-the-minimum-and-maximum-amount-per-payment-method
    switch (name) {
      case 'config->amount': {
        const currencyMinAmount = 0.01
        if (currencyMinAmount && Number(value) < currencyMinAmount) {
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
      }
        break

      case 'config->amountFld':
        requiredSettingChecker(value, 'mollieAmountFldMissing', 'Mollie Dynamic Amount Field is not Selected')
        break

      case 'config->redirect_url':
        requiredSettingChecker(value, 'mollieRedirectUrlMissing', 'Mollie Redirect Url is not Selected')
        break

      case 'config->currency':
        requiredSettingChecker(value, 'mollieCurrencyMissing', 'Mollie Currency is not Selected')
        break

      case 'config->description':
        requiredSettingChecker(value, 'mollieDescriptionMissing', 'Mollie Description is Required')
        break
      default:
        console.log('Not matched', value, name)
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} to ${value}: ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }

  const setAmountType = e => {
    if (e.target.value) fieldData.config.amountType = e.target.value
    else delete fieldData.config.amountType
    delete fieldData.config.amount
    delete fieldData.config.amountFld

    if (fieldData.config.amountType === 'dynamic') {
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

    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Amount Type Changed to "${e.target.value}": ${fieldData.lbl || fldKey}`, type: 'set_amount', state: { fields: allFields, fldKey } })
  }

  const getAmountFields = () => {
    const filteredFields = formFields.filter(field => field[1].typ.match(/^(radio|number|currency)/))
    return filteredFields.map(itm => (<option key={itm[0]} value={itm[0]}>{itm[1].adminLbl || itm[1].lbl}</option>))
  }

  const getMollieConfigs = () => {
    const MollieConfigs = payments.filter(pay => pay.type === 'Mollie')
    return MollieConfigs.map(mollie => (
      <option key={mollie.id} value={mollie.id}>{mollie.name}</option>
    ))
  }

  function setPayBtnTxt(e) {
    fieldData.txt = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Mollie pay button text updated : ${fieldData.txt}`, type: 'change_mollie_pay_btn_txt', state: { fields: allFields, fldKey } })
  }

  const paymentMethods = () => paymentMethodLists.map(itm => ({ value: itm.method, label: itm.title }))

  const handlePaymentMethodType = (val) => {
    if (val) {
      const valArr = val.split(',')
      assignNestedObj(fieldData, 'config->payment_method', valArr)
    } else {
      assignNestedObj(fieldData, 'config->payment_method', ['creditcard'])
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
  }

  const onChangeHandler = (name, value) => {
    let message = null
    let type = null
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
    fieldData[name] = value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: message, type, state: { fields: allFields, fldKey } })
  }

  const copyToClipboard = (value) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value)
    }
    shortcodeText.current.setAttribute('value', value)
    shortcodeText.current.select()

    return new Promise((res, rej) => {
      if (document.execCommand('copy')) res()
      else rej()
    })
  }

  const copyText = () => {
    copyToClipboard('[bitform_payments]').then(() => toast.success(__('Copied on clipboard.')))
      .catch(() => toast.error(__('Failed to Copy, Try Again.')))
  }

  return (
    <div>
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      <SimpleAccordion
        id="slct-cnfg-stng"
        title="Mollie Accounts"
        className={css(FieldStyle.fieldSection)}
        open
      >
        <select
          data-testid="slct-cnfg-slct"
          name="payIntegID"
          id="payIntegID"
          onChange={e => handleInput(e.target.name, e.target.value)}
          className={css(FieldStyle.input)}
          value={payIntegID}
        >
          <option value="">Select Account</option>
          {getMollieConfigs()}
        </select>
      </SimpleAccordion>
      <FieldSettingsDivider />
      {payIntegID && (
        <>
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
                value={config?.redirect_url || ''}
              >
                <option value="">{__('Select Page')}</option>
                {allPages.map(page => <option key={page.title} value={page.url}>{page.title}</option>)}
              </select>
            </div>
            <div className={css(FieldStyle.placeholder)}>
              <p>Page URL</p>
              <input
                data-testid="nam-stng-inp"
                aria-label="Name for this Field"
                placeholder="Name for this Field"
                className={css(FieldStyle.input)}
                value={config?.redirect_url || ''}
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
                tabIndex="0"
                onClick={copyText}
                className={css({ cr: '#44484a', cur: 'pointer', '&:hover': { cr: '#0056b3', td: 'underline' } })}
              >
                <strong>
                  [bitform_payments]
                </strong>
              </span>
              {' '}
              into the page content. Once the page is save successfully, copy the page URL and paste it into the
              {' '}
              <strong>Page URL</strong>
              .
              {' '}
              field. After a successful payment, Mollie will redirect users to this page.
            </p>
            <input className={css({ oy: 0, h: 0, m: 0, pn: 'absolute', tp: 0 })} ref={shortcodeText} />
          </SimpleAccordion>
          <FieldSettingsDivider />
          <SimpleAccordion
            id="btn-txt-stng"
            title={__('Pay Button Text')}
            className={css(FieldStyle.fieldSection)}
            open
          >
            <div className={css(FieldStyle.placeholder)}>
              <AutoResizeInput
                id="pay-btn-txt"
                aria-label="Mollie pay button text"
                placeholder="Type text here..."
                value={txt}
                changeAction={e => setPayBtnTxt(e)}
              />
            </div>
          </SimpleAccordion>
          <FieldSettingsDivider />
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <label htmlFor="currency">
              <b>
                {__('Payment Method')}
                {' '}
              </b>
              <MultiSelect
                className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
                options={paymentMethods()}
                onChange={val => handlePaymentMethodType(val)}
                defaultValue={config.payment_method || []}
              />
            </label>
          </div>
          <FieldSettingsDivider />
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <label htmlFor="currency">
              <b>
                {__('Currency')}
                {' '}
              </b>
              <select
                data-testid="prfil-country-slct"
                onChange={e => handleInput('config->currency', e.target.value)}
                className={css(FieldStyle.input)}
                value={config?.currency || ''}
              >
                <option value="">{__('Select Currency')}</option>
                {Object.entries(currencies).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
              </select>
            </label>
          </div>

          <FieldSettingsDivider />
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <b className={css(style.amountType)}>
              {__('Amount Type')}
            </b>
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
          {!isDynamicAmount && (
            <div className={css(ut.ml2, ut.mr2, ut.p1)}>
              <SingleInput
                id="amnt"
                className={css(ut.mt0)}
                cls={css(FieldStyle.input)}
                inpType="number"
                title={__('Amount')}
                value={config?.amount || ''}
                action={e => handleInput('config->amount', e.target.value)}
              />
            </div>
          )}
          {isDynamicAmount && (
            <div className={css(ut.ml2, ut.mr2, ut.p1)}>
              <b>{__('Select Amount Field')}</b>
              <select
                data-testid="slct-amnt-slct"
                onChange={e => handleInput('config->amountFld', e.target.value)}
                name="amountFld"
                className={css(FieldStyle.input)}
                value={config?.amountFld}
              >
                <option value="">{__('Select Field')}</option>
                {getAmountFields()}
              </select>
            </div>
          )}
          <FieldSettingsDivider />
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <label htmlFor="description">
              <b className={css(style.amountType)}>
                {__('Description')}
                <Cooltip>
                  <div className="txt-body">
                    <RenderHtml html={tippyHelperMsg.mollieDescription} />
                  </div>
                </Cooltip>
              </b>
              <AutoResizeInput
                id="description"
                aria-label="Mollie description text"
                placeholder="Type text here..."
                value={config?.description}
                changeAction={e => handleInput('config->description', e.target.value)}
              />
            </label>
          </div>
          <FieldSettingsDivider />
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <label htmlFor="locale">
              <b className={css(style.amountType)}>
                {__('Locale')}
                <Cooltip>
                  <div className="txt-body">
                    <RenderHtml html={tippyHelperMsg.mollieLocale} />
                  </div>
                </Cooltip>
              </b>
              <select
                data-testid="prfil-locale-slct"
                onChange={e => handleInput('config->locale', e.target.value)}
                className={css(FieldStyle.input)}
                value={config?.locale || ''}
              >
                <option value="">{__('Select Locale')}</option>
                {Object.entries(locale).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
              </select>
            </label>
          </div>
        </>
      )}

      <FieldSettingsDivider />
      <div className={css(ut.ml2, ut.mr2, ut.p1, { pr: '36px' })}>
        <SingleToggle
          id="ful-wid-btn"
          tip="By disabling this option, the button full width will be remove"
          title={__('Full Width')}
          action={({ target }) => onChangeHandler('btnFulW', target.checked)}
          isChecked={btnFulW || ''}
        />
      </div>
      <FieldSettingsDivider />

      {!btnFulW && (
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
              value={btnAlign}
              onChange={({ target }) => onChangeHandler('btnAlign', target.value)}
            >
              {pos.map(itm => <option key={`btcd-k-${itm.name}`} value={itm.value}>{itm.name}</option>)}
            </select>
          </div>
        </SimpleAccordion>
      )}
      {btnFulW && (
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
              value={txtAlign || 'center'}
              onChange={({ target }) => onChangeHandler('txtAlign', target.value)}
            >
              {pos.map(itm => <option key={`btcd-k-${itm.name}`} value={itm.value}>{itm.name}</option>)}
            </select>
          </div>
        </SimpleAccordion>
      )}
      <FieldSettingsDivider />

      <FieldHideSettings />

      <FieldSettingsDivider />
    </div>
  )
}

const propNameLabel = {
  payIntegID: 'Payment Configuration Changed',
  planId: 'Plan Id Changed',
  locale: 'Language Selected',
  disableFunding: 'Disabled Card',
  amount: 'Amount',
  amountFld: 'Amount Field Selected',
  shipping: 'Shipping Cost',
  shippingFld: 'Shipping Amount Field Selected',
  tax: 'Tax changed',
  taxFld: 'Tax Amount Field Selected',
  currency: 'Currency Selected',
  description: 'Other Description',
  descFld: 'Description Field Selected',
  layout: 'Layout Changed',
}

const style = {
  amountType: {
    dy: 'flex !important',
    // flx: 'align-center',
    fw: 600,
    '& .hover-tip': { oy: 0 },
  },
}
