import { create } from 'mutative'
import { useEffect } from 'react'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { useAtom, useAtomValue } from 'jotai'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import { addFormUpdateError, addToBuilderHistory, removeFormUpdateError } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { currencyCodes, fundLists, localeCodes } from '../../Utils/StaticData/paypalData'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import CheckBox from '../Utilities/CheckBox'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'

export default function PaypalFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const formFields = Object.entries(fields)
  const payments = useAtomValue($payments)
  const isSubscription = fieldData?.payType === 'subscription'
  const isDynamicDesc = fieldData?.descType === 'dynamic'
  const isDynamicAmount = fieldData?.amountType === 'dynamic'
  const isDynamicShipping = fieldData?.shippingType === 'dynamic'
  const isDynamicTax = fieldData?.taxType === 'dynamic'

  const { css } = useFela()
  useEffect(() => {
    removeFormUpdateError(fldKey, 'paypalAmountFldMissing')
    removeFormUpdateError(fldKey, 'paypalAmountMissing')
    if (isDynamicAmount && !fieldData.amountFld) {
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'paypalAmountFldMissing',
        errorMsg: __('PayPal Dynamic Amount Field is not Selected'),
        errorUrl: `field-settings/${fldKey}`,
      })
    } else if (!isDynamicAmount && (!fieldData.amount || fieldData.amount <= 0) && !isSubscription) {
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'paypalAmountMissing',
        errorMsg: __('PayPal Fixed Amount is not valid'),
        errorUrl: `field-settings/${fldKey}`,
      })
    }
    if (fieldData.isSubscription) {
      if (fieldData.planId) {
        removeFormUpdateError(fldKey, 'paypalAmountFldMissing')
        removeFormUpdateError(fldKey, 'paypalAmountMissing')
      } else {
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'paypalPlanIdMissing',
          errorMsg: __('PayPal Plan Id missing'),
          errorUrl: `field-settings/${fldKey}`,
        })
      }
    }
  }, [fieldData?.amountType, fieldData?.amount, fieldData?.amountFld])

  const handleInput = (name, value) => {
    if (value) {
      fieldData[name] = value
      if (name === 'planId') removeFormUpdateError(fldKey, 'paypalPlanIdMissing')
      if (name === 'locale') {
        const localeArr = value.split(' - ')
        fieldData.locale = localeArr[localeArr.length - 1]
        fieldData.language = value
      }
    } else {
      delete fieldData[name]
    }
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} to ${value}: ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }

  const setSubscription = e => {
    if (e.target.checked) {
      fieldData.payType = 'subscription'
      delete fieldData.currency
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'paypalPlanIdMissing',
        errorMsg: __('PayPal Plan Id missing'),
        errorUrl: `field-settings/${fldKey}`,
      })
      removeFormUpdateError(fldKey, 'paypalAmountMissing')
      removeFormUpdateError(fldKey, 'paypalAmountFldMissing')
    } else {
      fieldData.currency = 'USD'
      delete fieldData.payType
      delete fieldData.planId
      removeFormUpdateError(fldKey, 'paypalPlanIdMissing')
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'paypalAmountMissing',
        errorMsg: __('PayPal Fixed Amount is not valid'),
        errorUrl: `field-settings/${fldKey}`,
      })
    }
    delete fieldData.amountType
    delete fieldData.amount
    delete fieldData.amountFld

    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Subscription "${e.target.checked ? 'On' : 'Off'}": ${fieldData.lbl || fldKey}`, type: 'toggle_subscription', state: { fields: allFields, fldKey } })
  }

  const setAmountType = e => {
    if (e.target.value) fieldData.amountType = e.target.value
    else delete fieldData.amountType
    delete fieldData.amount
    delete fieldData.amountFld

    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Ammount Type Changed to "${e.target.value}": ${fieldData.lbl || fldKey}`, type: 'set_amount', state: { fields: allFields, fldKey } })
  }

  const setShippingType = e => {
    if (e.target.value) fieldData.shippingType = e.target.value
    else delete fieldData.shippingType
    delete fieldData.shipping
    delete fieldData.shippingFld

    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Shipping Type changed to "${e.target.value}": ${fieldData.lbl || fldKey}`, type: 'set_shipping_type', state: { fields: allFields, fldKey } })
  }

  const setTaxType = e => {
    if (e.target.value) fieldData.taxType = e.target.value
    else delete fieldData.taxType
    delete fieldData.tax
    delete fieldData.taxFld

    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Tax type changed to "${e.target.value}": ${fieldData.lbl || fldKey}`, type: 'set_tax_type', state: { fields: allFields, fldKey } })
  }

  const setDescType = e => {
    if (e.target.value) fieldData.descType = e.target.value
    else delete fieldData.descType
    delete fieldData.description
    delete fieldData.descFld

    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Description type to "${e.target.value}": ${fieldData.lbl || fldKey}`, type: 'set_description_type', state: { fields: allFields, fldKey } })
  }

  const getAmountFields = () => {
    const filteredFields = formFields.filter(field => field[1].typ.match(/^(radio|number|currency)/))
    return filteredFields.map(itm => (<option key={itm[0]} value={itm[0]}>{itm[1].adminLbl || itm[1].lbl}</option>))
  }

  const getDescFields = () => {
    const filteredFields = formFields.filter(field => field[1].typ.match(/text/g))
    return filteredFields.map(itm => (<option key={itm[0]} value={itm[0]}>{itm[1].adminLbl || itm[1].lbl}</option>))
  }

  const localeCodeOptions = () => localeCodes.map(locale => ({
    label: (
      <div className="flx flx-between">
        <span className="btcd-ttl-ellipsis">{locale.region}</span>
        <code className="btcd-code">{locale.code}</code>
      </div>
    ),
    title: `${locale.region} - ${locale.code}`,
    value: `${locale.region} - ${locale.code}`,
  }))

  const getPaypalConfigs = () => {
    const paypalConfigs = payments.filter(pay => pay.type === 'PayPal')
    return paypalConfigs.map(paypal => (
      <option key={paypal.id} value={paypal.id}>{paypal.name}</option>
    ))
  }

  const fundOptions = () => fundLists.map(fund => ({ label: fund.label, value: fund.value }))

  return (
    <div>

      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      {/*
      <div className="mb-2">
        <span className="font-w-m">{__('Field Type : ')}</span>
        {__('Paypal')}
      </div> */}

      <SimpleAccordion
        id="slct-cnfg-stng"
        title="PayPal Accounts"
        className={css(FieldStyle.fieldSection)}
      >
        <select
          data-testid="slct-cnfg-slct"
          name="payIntegID"
          id="payIntegID"
          onChange={e => handleInput(e.target.name, e.target.value)}
          className={css(FieldStyle.input)}
          value={fieldData.payIntegID}
        >
          <option value="">Select Account</option>
          {getPaypalConfigs()}
        </select>
      </SimpleAccordion>
      <FieldSettingsDivider />

      {/* <div className="mt-3">
        <b>{__('Select Config')}</b>
        <br />
        <select name="payIntegID" id="payIntegID" onChange={e => handleInput(e.target.name, e.target.value)} className="btcd-paper-inp mt-1" value={fieldData.payIntegID}>
          <option value="">Select Config</option>
          {getPaypalConfigs()}
        </select>
      </div> */}

      {fieldData.payIntegID && (
        <>
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <SingleToggle
              id="sbscrptn"
              title={__('Subscription:')}
              action={setSubscription}
              isChecked={isSubscription}
              className="mt-3"
            />
            {isSubscription && (
              <SingleInput
                id="pln-id"
                inpType="text"
                title={__('Plan Id')}
                value={fieldData.planId || ''}
                action={e => handleInput('planId', e.target.value)}
                cls={css(FieldStyle.input)}
              />
            )}
          </div>
          {!isSubscription && (
            <>
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Language')}</b>
                <MultiSelect
                  className="w-10 btcd-paper-drpdwn mt-1"
                  options={localeCodeOptions()}
                  onChange={val => handleInput('locale', val)}
                  defaultValue={fieldData.language}
                  largeData
                  singleSelect
                />
              </div>
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Disable Card')}</b>
                <MultiSelect
                  className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
                  options={fundOptions()}
                  onChange={val => handleInput('disableFunding', val)}
                  defaultValue={fieldData.disableFunding}
                />
              </div>
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Amount Type')}</b>
                <br />
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
                    cls={css(FieldStyle.input)}
                    inpType="number"
                    title={__('Amount')}
                    value={fieldData.amount || ''}
                    action={e => handleInput('amount', e.target.value)}
                  />
                </div>
              )}
              {isDynamicAmount && (
                <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                  <b>{__('Select Amount Field')}</b>
                  <select
                    data-testid="slct-amnt-slct"
                    onChange={e => handleInput(e.target.name, e.target.value)}
                    name="amountFld"
                    className={css(FieldStyle.input)}
                    value={fieldData.amountFld}
                  >
                    <option value="">{__('Select Field')}</option>
                    {getAmountFields()}
                  </select>
                </div>
              )}
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Shipping Amount')}</b>
                <br />
                <CheckBox
                  id="shpng-amnt-fxd"
                  onChange={setShippingType}
                  radio
                  checked={!isDynamicShipping}
                  title={__('Fixed')}
                />
                <CheckBox
                  id="shpng-amnt-dynmc"
                  onChange={setShippingType}
                  radio
                  checked={isDynamicShipping}
                  title={__('Dynamic')}
                  value="dynamic"
                />
              </div>
              {!isDynamicShipping && (
                <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                  <SingleInput
                    id="spng-cst"
                    cls={css(FieldStyle.input)}
                    inpType="number"
                    title={__('Shipping Cost')}
                    value={fieldData.shipping || ''}
                    action={e => handleInput('shipping', e.target.value)}
                  />
                </div>
              )}
              {isDynamicShipping && (
                <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                  <b>{__('Select Shipping Amount Field')}</b>
                  <select
                    data-testid="slct-shpng-amnt"
                    onChange={e => handleInput(e.target.name, e.target.value)}
                    name="shippingFld"
                    className={css(FieldStyle.input)}
                    value={fieldData.shippingFld}
                  >
                    <option value="">{__('Select Field')}</option>
                    {getAmountFields()}
                  </select>
                </div>
              )}
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Tax Amount Type')}</b>
                <br />
                <CheckBox
                  id="tx-amnt-fxd"
                  onChange={setTaxType}
                  radio
                  checked={!isDynamicTax}
                  title={__('Fixed')}
                />
                <CheckBox
                  id="tx-amnt-dynmc"
                  onChange={setTaxType}
                  radio
                  checked={isDynamicTax}
                  title={__('Dynamic')}
                  value="dynamic"
                />
              </div>
              {!isDynamicTax && (
                <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                  <SingleInput
                    id="tax"
                    cls={css(FieldStyle.input)}
                    inpType="number"
                    title={__('Tax (%)')}
                    value={fieldData.tax || ''}
                    action={e => handleInput('tax', e.target.value)}
                  />
                </div>
              )}
              {isDynamicTax && (
                <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                  <b>{__('Select Amount Field')}</b>
                  <select
                    data-testid="slct-amnt-fld"
                    onChange={e => handleInput(e.target.name, e.target.value)}
                    name="taxFld"
                    className={css(FieldStyle.input)}
                    value={fieldData.taxFld}
                  >
                    <option value="">{__('Select Field')}</option>
                    {getAmountFields()}
                  </select>
                </div>
              )}
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <label htmlFor="recap-thm">
                  <b>{__('Currency')}</b>
                  <select
                    data-testid="crncy-fld-slct"
                    onChange={e => handleInput(e.target.name, e.target.value)}
                    name="currency"
                    value={fieldData.currency}
                    className={css(FieldStyle.input)}
                  >
                    {currencyCodes.map(itm => (
                      <option key={itm.currency} value={itm.code}>
                        {`${itm.currency} - ${itm.code}`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* ---------Description Added in bit-paypal-filed.js with form-id,entry-id,field-key value---------- currently using user input for desc from field settings */}
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Description')}</b>
                <br />
                <CheckBox id="dscrptn-sttc" onChange={setDescType} radio checked={!isDynamicDesc} title={__('Static')} />
                <CheckBox id="dscrptn-dynmc" onChange={setDescType} radio checked={isDynamicDesc} title={__('Dynamic')} value="dynamic" />
              </div>
              {!isDynamicDesc
                && (
                  <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                    <textarea
                      data-testid="ordr-dscrptn-txt-ara"
                      className="mt-1 btcd-paper-inp"
                      placeholder="Order Description"
                      name="description"
                      rows="5"
                      onChange={e => handleInput(e.target.name, e.target.value)}
                    />
                  </div>
                )}
              {isDynamicDesc && (
                <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                  <b>{__('Select Description Field')}</b>
                  <select
                    data-testid="slct-dscrptn-fld"
                    onChange={e => handleInput(e.target.name, e.target.value)}
                    name="descFld"
                    className={css(FieldStyle.input)}
                    value={fieldData.descFld}
                  >
                    <option value="">{__('Select Field')}</option>
                    {getDescFields()}
                  </select>
                </div>
              )}
            </>
          )}
        </>
      )}

      <FieldSettingsDivider />
      <FieldHideSettings />
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
}
