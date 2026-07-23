import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addFormUpdateError, addToBuilderHistory, deleteNestedObj, removeFormUpdateError } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { currencyCodes, paymentMethodType } from '../../../../../Utils/StaticData/StripeData'
import tippyHelperMsg from '../../../../../Utils/StaticData/tippyHelperMsg'
import { __ } from '../../../../../Utils/i18nwrap'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import AutoResizeInput from '../../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import CheckBox from '../../../../Utilities/CheckBox'
import Cooltip from '../../../../Utilities/Cooltip'
import RenderHtml from '../../../../Utilities/RenderHtml'
import SingleInput from '../../../../Utilities/SingleInput'
import { assignNestedObj } from '../../../../style-new/styleHelpers'

export default function StripeBasicSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const formFields = Object.entries(fields)
  const isSubscription = fieldData?.payType === 'subscription'
  const isDynamicAmount = fieldData.config?.amountType === 'dynamic'

  const { css } = useFela()

  const handleInput = (name: string, value: string) => {
    if (value) {
      assignNestedObj(fieldData, name, value)
    } else {
      deleteNestedObj(fieldData, name)
    }

    if (name === 'config->amount') {
      const currencyMinAmount = currencyCodes.find(item => item.code === fieldData.config.options.currency)?.minAmount || 0
      if (currencyMinAmount && Number(value) < currencyMinAmount) {
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'stripeAmountMin',
          errorMsg: __(`Stripe Minimum Amount is ${currencyMinAmount}`),
          errorUrl: `field-settings/${fldKey}`,
        })
      } else {
        removeFormUpdateError(fldKey, 'stripeAmountMin')
        removeFormUpdateError(fldKey, 'stripeAmountMissing')
      }
    } else if (name === 'config->amountFld') {
      if (value) {
        removeFormUpdateError(fldKey, 'stripeAmountFldMissing')
      } else {
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'stripeAmountFldMissing',
          errorMsg: __('Stripe Dynamic Amount Field is not Selected'),
          errorUrl: `field-settings/${fldKey}`,
        })
      }
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propNameLabel[name]} to ${value}: ${fieldData.lbl || fldKey}`,
      type: `${name}_changed`,
      state: { fields: allFields, fldKey }
    })
  }

  function findCommonItems(types: string[]) {
    if (!types || types.length === 0) return currencyCodes
    const cntris = paymentMethodType.filter(item => types.includes(item.type))
    const arrays = cntris.map(item => item.currency)
    const codes = arrays?.reduce((a, b) => a.filter(c => b.includes(c)))
    const currencies = currencyCodes.filter(item => codes.includes(item.code))
    return currencies || []
  }

  const handlePaymentMethodType = (val: string) => {
    if (val) {
      const valArr = val.split(',')
      assignNestedObj(fieldData, 'config->options->payment_method_types', valArr)
      const commonCurrencies = findCommonItems(valArr)
      if (!commonCurrencies.length) {
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'stripeCurrencyMissing',
          errorMsg: __('Select a valid currency for the selected payment method types'),
          errorUrl: `field-settings/${fldKey}`,
        })
        assignNestedObj(fieldData, 'config->options->currency', '')
      } else {
        removeFormUpdateError(fldKey, 'stripeCurrencyMissing')
        assignNestedObj(fieldData, 'config->options->currency', commonCurrencies[0]?.code || '')
      }
    } else {
      deleteNestedObj(fieldData, 'config->options->payment_method_types')
      removeFormUpdateError(fldKey, 'stripeCurrencyMissing')
      assignNestedObj(fieldData, 'config->options->currency', 'usd')
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
  }

  const setAmountType = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) fieldData.config.amountType = e.target.value
    else delete fieldData.config.amountType
    delete fieldData.config.amount
    delete fieldData.config.amountFld

    if (fieldData.config.amountType === 'dynamic') {
      removeFormUpdateError(fldKey, 'stripeAmountMissing')
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'stripeAmountFldMissing',
        errorMsg: __('Stripe Dynamic Amount Field is not Selected'),
        errorUrl: `field-settings/${fldKey}`,
      })
    } else {
      removeFormUpdateError(fldKey, 'stripeAmountFldMissing')
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'stripeAmountMissing',
        errorMsg: __('Stripe Fixed Amount is not valid'),
        errorUrl: `field-settings/${fldKey}`,
      })
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Amount Type Changed to "${e.target.value}": ${fieldData.lbl || fldKey}`,
      type: 'set_amount',
      state: { fields: allFields, fldKey }
    })
  }

  const getAmountFields = () => {
    const filteredFields = formFields.filter(field => (field[1] as { typ?: string })?.typ?.match(/^(radio|number|currency)/))
    return filteredFields.map(itm => (<option key={itm[0]} value={itm[0]}>{itm[1].adminLbl || itm[1].lbl}</option>))
  }

  const currencyCodeOptions = () => availableCurrencies.map(currency => ({
    label: (
      <div className="flx flx-between">
        <span className="btcd-ttl-ellipsis">{currency.currency}</span>
        <code className="btcd-code" style={{ textTransform: 'uppercase' }}>{currency.code}</code>
      </div>
    ),
    title: `${currency.currency} - ${currency.code}`,
    value: currency.code,
  }))

  const paymentMethodTypes = () => paymentMethodType?.map(method => ({ label: method.name, value: method.type }))

  function setBtnTxt(e: React.ChangeEvent<HTMLInputElement>) {
    fieldData.txt = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Stripe button text updated : ${fieldData.txt}`,
      type: 'change_stripe_btn_txt',
      state: { fields: allFields, fldKey }
    })
  }

  function setPayBtnTxt(e: React.ChangeEvent<HTMLInputElement>) {
    fieldData.config.payBtnTxt = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Stripe pay button text updated : ${fieldData.config.payBtnTxt}`,
      type: 'change_stripe_pay_btn_txt',
      state: { fields: allFields, fldKey }
    })
  }

  const availableCurrencies = findCommonItems(fieldData.config.options.payment_method_types)

  return (
    <div>
      {/* Button Text */}
      <SimpleAccordion
        id="btn-txt-stng"
        title={__('Button Text')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <AutoResizeInput
            id="btn-txt"
            aria-label="Stripe button text"
            placeholder="Type text here..."
            value={fieldData.txt}
            changeAction={e => setBtnTxt(e)}
          />
        </div>
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
            aria-label="Stripe pay button text"
            placeholder="Type text here..."
            value={fieldData.config.payBtnTxt}
            changeAction={e => setPayBtnTxt(e)}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {!isSubscription && (
        <>
          {/* Payment Method Type */}
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <b>{__('Payment Method Type')}</b>
            <MultiSelect
              className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
              options={paymentMethodTypes()}
              onChange={val => handlePaymentMethodType(val)}
              defaultValue={fieldData.config.options?.payment_method_types || []}
            />
          </div>

          <FieldSettingsDivider />

          {/* Currency */}
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <label htmlFor="currency">
              <b>{__('Currency')}</b>
              <MultiSelect
                className="w-10 btcd-paper-drpdwn mt-1"
                options={currencyCodeOptions()}
                onChange={val => handleInput('config->options->currency', val)}
                defaultValue={fieldData.config.options?.currency}
                largeData
                singleSelect
              />
            </label>
          </div>

          <FieldSettingsDivider />

          {/* Amount Type */}
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <b className={css(style.amountType)}>
              {__('Amount Type')}
              <Cooltip>
                <div className="txt-body">
                  <RenderHtml html={tippyHelperMsg.amountType} />
                </div>
              </Cooltip>
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

          {/* Fixed Amount */}
          {!isDynamicAmount && (
            <div className={css(ut.ml2, ut.mr2, ut.p1)}>
              <SingleInput
                id="amnt"
                className={css(ut.mt0)}
                cls={css(FieldStyle.input)}
                inpType="number"
                title={__('Amount')}
                value={fieldData.config?.amount || ''}
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
                value={fieldData.config.amountFld}
              >
                <option value="">{__('Select Field')}</option>
                {getAmountFields()}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const propNameLabel: Record<string, string> = {
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
    fw: 600,
    '& .hover-tip': { oy: 0 },
  },
}