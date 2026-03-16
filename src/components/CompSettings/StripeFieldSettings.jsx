import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import { addFormUpdateError, addToBuilderHistory, deleteNestedObj, removeFormUpdateError } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { currencyCodes, layouts, localeCodes, paymentMethodType, themes } from '../../Utils/StaticData/StripeData'
import allCountries from '../../Utils/StaticData/countries.json'
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

export default function StripeFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const formFields = Object.entries(fields)
  const payments = useAtomValue($payments)
  const isSubscription = fieldData?.payType === 'subscription'
  const isDynamicAmount = fieldData.config?.amountType === 'dynamic'

  const { css } = useFela()
  const handleInput = (name, value) => {
    if (value === 'split') {
      deleteNestedObj(fieldData, 'config->address->defaultValues->name')
    }
    if (value === 'full') {
      deleteNestedObj(fieldData, 'config->address->defaultValues->firstName')
      deleteNestedObj(fieldData, 'config->address->defaultValues->lastName')
    }
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
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel[name]} to ${value}: ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }

  function findCommonItems(types) {
    if (!types || types.length === 0) return currencyCodes
    const cntris = paymentMethodType.filter(item => types.includes(item.type))
    const arrays = cntris.map(item => item.currency)
    const codes = arrays?.reduce((a, b) => a.filter(c => b.includes(c)))
    const currencies = currencyCodes.filter(item => codes.includes(item.code))
    return currencies || []
  }

  const handlePaymentMethodType = (val) => {
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

  const handleLayout = (value) => {
    if (value) {
      fieldData.config.layout = layouts[value]
    } else {
      delete fieldData.config.layout
    }
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel.layout} to ${value}: ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }

  const handleTheme = (value) => {
    if (value) {
      fieldData.config.theme.name = value
      fieldData.config.theme.style = themes[value]
    } else {
      delete fieldData.config.theme
    }
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propNameLabel.layout} to ${value}: ${fieldData.lbl || fldKey}`, type: `${name}_changed`, state: { fields: allFields, fldKey } })
  }
  const setAmountType = e => {
    if (e.target.value) fieldData.config.amountType = e.target.value
    else delete fieldData.config.amountType
    delete fieldData.config.amount
    delete fieldData.config.amountFld

    if (fieldData.config.amountType === 'dynamic') {
      removeFormUpdateError(fldKey, 'stripeAmountMissing')
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'stripeAmountFldMissing',
        errorMsg: __('Stripe Dyanmic Amount Field is not Selected'),
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

    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Ammount Type Changed to "${e.target.value}": ${fieldData.lbl || fldKey}`, type: 'set_amount', state: { fields: allFields, fldKey } })
  }

  const getAmountFields = () => {
    const filteredFields = formFields.filter(field => field[1].typ.match(/^(radio|number|currency)/))
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
    value: locale.code,
  }))

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

  const getStripeConfigs = () => {
    const stripeConfigs = payments.filter(pay => pay.type === 'Stripe')
    return stripeConfigs.map(stripe => (
      <option key={stripe.id} value={stripe.id}>{stripe.name}</option>
    ))
  }

  const paymentMethodTypes = () => paymentMethodType?.map(method => ({ label: method.name, value: method.type }))

  function setBtnTxt(e) {
    fieldData.txt = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Stripe button text updated : ${fieldData.txt}`, type: 'change_stripe_btn_txt', state: { fields: allFields, fldKey } })
  }
  function setPayBtnTxt(e) {
    fieldData.config.payBtnTxt = e.target.value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Stripe pay button text updated : ${fieldData.config.payBtnTxt}`, type: 'change_stripe_pay_btn_txt', state: { fields: allFields, fldKey } })
  }

  const getSpecifiedFields = type => {
    let pattern
    if (type === 'email') {
      pattern = /^(text|email)$/
    } else if (type === 'text') {
      pattern = /^(text|textarea|username)$/
    } else if (type === 'number') {
      pattern = /^(number)$/
    } else if (type === 'phone') {
      pattern = /^(number|phone-number)$/
    } else if (type === 'country') {
      pattern = /^(text|country)$/
    } else if (type === 'number-text') {
      pattern = /^(number|text)$/
    }
    const filteredFields = formFields.filter(field => field[1].typ.match(pattern))
    return filteredFields.map(itm => (<option key={itm[0]} value={itm[0]}>{itm[1].adminLbl || itm[1].lbl}</option>))
  }

  const handleAccordionToggle = type => e => {
    const { checked } = e.target
    if (checked) {
      if (!fieldData.config[type]) fieldData.config[type] = {}
      fieldData.config[type].active = checked
      if (type === 'address') {
        fieldData.config.address.mode = 'billing'
        if (!fieldData.config.address.display) {
          fieldData.config.address.display = {}
        }
        fieldData.config.address.display.name = 'full'
        if (!fieldData.config.address.defaultValues) {
          fieldData.config.address.defaultValues = {}
        }
        fieldData.config.address.defaultValues.name = ''
      }
    } else delete fieldData.config[type]
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
  }

  const availableCurrencies = findCommonItems(fieldData.config.options.payment_method_types)

  return (
    <div>
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      <SimpleAccordion
        id="slct-cnfg-stng"
        title="Stripe Accounts"
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
          {getStripeConfigs()}
        </select>
      </SimpleAccordion>
      <FieldSettingsDivider />
      {fieldData.payIntegID && (
        <>
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
          <SimpleAccordion
            id="btn-txt-stng"
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
          <SimpleAccordion
            id="slct-cnfg-stng"
            title="Layout"
            className={css(FieldStyle.fieldSection)}
          >
            <select
              data-testid="slct-cnfg-layout"
              name="layout"
              id="layout"
              onChange={e => handleLayout(e.target.value)}
              className={css(FieldStyle.input)}
              value={fieldData.config.layout.type}
            >
              {/* <option value="">Select Layout</option> */}
              {Object
                .keys(layouts)
                .map(layout => (<option key={layout} value={layout}>{layout}</option>))}
            </select>
          </SimpleAccordion>
          <FieldSettingsDivider />
          <SimpleAccordion
            id="slct-cnfg-stng"
            title="Theme"
            className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
            tip={tippyHelperMsg.stripeTheme}
            tipProps={{ width: 250, icnSize: 17 }}
          >
            <select
              data-testid="slct-cnfg-theme"
              name="theme"
              id="theme"
              onChange={e => handleTheme(e.target.value)}
              className={css(FieldStyle.input)}
              value={fieldData.config?.theme.name}
            >
              {/* <option value="">Select Layout</option> */}
              {Object
                .keys(themes)
                .map(tm => (<option key={`${themes[tm].theme}-${tm}`} value={tm}>{tm}</option>))}
            </select>
          </SimpleAccordion>
          <FieldSettingsDivider />
          {!isSubscription && (
            <>
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Language')}</b>
                <MultiSelect
                  className="w-10 btcd-paper-drpdwn mt-1"
                  options={localeCodeOptions()}
                  onChange={val => handleInput('config->options->locale', val)}
                  defaultValue={fieldData.config.options?.locale}
                  largeData
                  singleSelect
                />
              </div>
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <b>{__('Payment Method Type')}</b>
                <MultiSelect
                  className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
                  options={paymentMethodTypes()}
                  // onChange={val => handleInput('config->options->payment_method_types', val)}
                  onChange={val => handlePaymentMethodType(val)}
                  defaultValue={fieldData.config.options?.payment_method_types || []}
                />
              </div>

              <FieldSettingsDivider />

              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <label htmlFor="description">
                  <b>
                    {__('Description')}
                    {' '}
                  </b>
                  <AutoResizeInput
                    id="description"
                    aria-label="Stripe description text"
                    placeholder="Type text here..."
                    value={fieldData.config.options?.description}
                    changeAction={e => handleInput('config->options->description', e.target.value)}
                  />
                </label>
              </div>
              <div className={css(ut.ml2, ut.mr2, ut.p1)}>
                <label htmlFor="recap-thm">
                  <b>
                    {__('Currency')}
                    {' '}
                  </b>

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
              <FieldSettingsDivider />
            </>
          )}
        </>
      )}

      <SimpleAccordion
        id="adtnl-stng"
        title="Additional Settings"
        className={css(FieldStyle.fieldSection)}
      >
        <SimpleAccordion
          id="link-auth-stng"
          title="Email"
          className={css(FieldStyle.fieldSection)}
          switching
          toggleAction={handleAccordionToggle('linkAuthentication')}
          toggleChecked={fieldData.config?.linkAuthentication?.active || false}
          open={fieldData.config?.linkAuthentication?.active || false}
          disable={!fieldData.config?.linkAuthentication?.active || false}
        >
          <div>
            <select
              data-testid="prfil-nam-slct"
              onChange={e => handleInput('config->linkAuthentication->emailFld', e.target.value)}
              name="prefillNameFld"
              className={css(FieldStyle.input)}
              value={fieldData.config?.linkAuthentication?.emailFld || ''}
            >
              <option value="">{__('Select Field')}</option>
              {getSpecifiedFields('email')}
            </select>
          </div>
        </SimpleAccordion>

        <FieldSettingsDivider />

        <SimpleAccordion
          id="address-stng"
          title="Address"
          className={css(FieldStyle.fieldSection)}
          switching
          toggleAction={handleAccordionToggle('address')}
          toggleChecked={fieldData.config?.address?.active || false}
          open={fieldData.config?.address?.active || false}
          disable={!fieldData.config?.address?.active || false}
        >
          <div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Mode :')}</b>
              <CheckBox
                id="addr-mode-bill"
                onChange={e => handleInput('config->address->mode', e.target.value)}
                radio
                checked={fieldData.config?.address?.mode === 'billing'}
                title={__('Billing')}
                value="billing"
              />
              <CheckBox
                id="addr-mode-shp"
                onChange={e => handleInput('config->address->mode', e.target.value)}
                radio
                checked={fieldData.config?.address?.mode === 'shipping'}
                title={__('Shipping')}
                value="shipping"
              />
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Autocomplete :')}</b>
              <select
                data-testid="addr-autocmplt-slct"
                onChange={e => handleInput('config->address->autocomplete->mode', e.target.value)}
                name="autocomplete"
                className={css(FieldStyle.input)}
                value={fieldData.config?.address?.autocomplete?.mode || ''}
              >
                <option value="automatic">{__('Automatic')}</option>
                <option value="google_maps_api">{__('Google Maps API')}</option>
                <option value="disabled">{__('Disabled')}</option>
              </select>
            </div>
            {fieldData.config?.address?.autocomplete?.mode === 'google_maps_api' && (
              <div className={css(ut.mt2, { px: 1 })}>
                <SingleInput
                  id="addr-gmap-api-key"
                  className={css(ut.mt0)}
                  cls={css(FieldStyle.input)}
                  inpType="text"
                  title={__('Google Maps API Key')}
                  value={fieldData.config?.address?.autocomplete?.google_maps_api_key || ''}
                  action={e => handleInput('config->address->autocomplete->apiKey', e.target.value)}
                />
              </div>
            )}
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Allowed Countries :')}</b>
              <MultiSelect
                className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
                options={allCountries.map(c => ({ label: c.lbl, value: c.i }))}
                onChange={val => handleInput('config->address->allowedCountries', val.split(','))}
                defaultValue={(fieldData.config?.address?.allowedCountries || []).join(',')}
                largeData
              />
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Name Mode:')}</b>
              <CheckBox
                id="name-full"
                onChange={e => handleInput('config->address->display->name', e.target.value)}
                radio
                checked={fieldData.config?.address?.display?.name === 'full' || false}
                title={__('Full')}
                value="full"
              />
              <CheckBox
                id="name-split"
                onChange={e => handleInput('config->address->display->name', e.target.value)}
                radio
                checked={fieldData.config?.address?.display?.name === 'split' || false}
                title={__('Split')}
                value="split"
              />
            </div>
            {fieldData.config?.address?.display?.name === 'full' && (
              <div className={css(ut.mt2, { px: 1 })}>
                <b>{__('Full Name:')}</b>
                <select
                  data-testid="prfil-nam-slct"
                  onChange={e => handleInput('config->address->defaultValues->name', e.target.value)}
                  name="prefillNameFld"
                  className={css(FieldStyle.input)}
                  value={fieldData.config?.address?.defaultValues?.name || ''}
                >
                  <option value="">{__('Select Field')}</option>
                  {getSpecifiedFields('text')}
                </select>
              </div>
            )}
            {fieldData.config?.address?.display?.name === 'split' && (
              <>
                <div className={css(ut.mt2, { px: 1 })}>
                  <b>{__('First Name:')}</b>
                  <select
                    data-testid="prfil-nam-slct"
                    onChange={e => handleInput('config->address->defaultValues->firstName', e.target.value)}
                    name="prefillFirstNameFld"
                    className={css(FieldStyle.input)}
                    value={fieldData.config?.address?.defaultValues?.firstName || ''}
                  >
                    <option value="">{__('Select Field')}</option>
                    {getSpecifiedFields('text')}
                  </select>
                </div>
                <div className={css(ut.mt2, { px: 1 })}>
                  <b>{__('Last Name:')}</b>
                  <select
                    data-testid="prfil-nam-slct"
                    onChange={e => handleInput('config->address->defaultValues->lastName', e.target.value)}
                    name="prefilllastNameFld"
                    className={css(FieldStyle.input)}
                    value={fieldData.config?.address?.defaultValues?.lastName || ''}
                  >
                    <option value="">{__('Select Field')}</option>
                    {getSpecifiedFields('text')}
                  </select>
                </div>
              </>
            )}
            <div className={css(ut.mt2, { px: 1 })}>
              <div className="flx flx-between">
                <b>{__('Phone Number:')}</b>
                <SingleToggle
                  id="phoneNumber"
                  className={css(ut.mr2)}
                  name="phoneNumber"
                  action={e => handleInput('config->address->fields->phone', e.target.checked ? 'always' : 'auto')}
                  isChecked={fieldData.config?.address?.fields?.phone === 'always'}
                />
              </div>
            </div>
            {fieldData.config?.address?.fields?.phone === 'always' && (
              <div className={css(ut.mt2, { px: 1 })}>
                <b>{__('Phone:')}</b>
                <select
                  data-testid="prfil-nam-slct"
                  onChange={e => handleInput('config->address->defaultValues->phone', e.target.value)}
                  name="prefillphoneFld"
                  className={css(FieldStyle.input)}
                  value={fieldData.config?.address?.defaultValues?.phone || ''}
                >
                  <option value="">{__('Select Field')}</option>
                  {getSpecifiedFields('phone')}
                </select>
              </div>
            )}
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Line 1:')}</b>
              <select
                data-testid="prfil-line1-slct"
                onChange={e => handleInput('config->address->defaultValues->address->line1', e.target.value)}
                name="prefillline1Fld"
                className={css(FieldStyle.input)}
                value={fieldData.config?.address?.defaultValues?.address?.line1 || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('text')}
              </select>
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Line 2:')}</b>
              <select
                data-testid="prfil-line2-slct"
                onChange={e => handleInput('config->address->defaultValues->address->line2', e.target.value)}
                name="prefillline2Fld"
                className={css(FieldStyle.input)}
                value={fieldData.config?.address?.defaultValues?.address?.line2 || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('text')}
              </select>
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('City:')}</b>
              <select
                data-testid="prfil-city-slct"
                onChange={e => handleInput('config->address->defaultValues->address->city', e.target.value)}
                name="prefillcityFld"
                className={css(FieldStyle.input)}
                value={fieldData.config?.address?.defaultValues?.address?.city || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('text')}
              </select>
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('State:')}</b>
              <select
                data-testid="prfil-state-slct"
                onChange={e => handleInput('config->address->defaultValues->address->state', e.target.value)}
                name="prefillstateFld"
                className={css(FieldStyle.input)}
                value={fieldData.config?.address?.defaultValues?.address?.state || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('text')}
              </select>
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Postal Code:')}</b>
              <select
                data-testid="prfil-postal_code-slct"
                onChange={e => handleInput('config->address->defaultValues->address->postal_code', e.target.value)}
                name="prefillpostal_codeFld"
                className={css(FieldStyle.input)}
                value={fieldData.config?.address?.defaultValues?.address?.postal_code || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('number-text')}
              </select>
            </div>
            <div className={css(ut.mt2, { px: 1 })}>
              <b>{__('Country:')}</b>
              <select
                data-testid="prfil-country-slct"
                onChange={e => handleInput('config->address->defaultValues->address->country', e.target.value)}
                name="prefillcountryFld"
                className={css(FieldStyle.input)}
                value={fieldData.config?.address?.defaultValues?.address?.country || ''}
              >
                <option value="">{__('Select Field')}</option>
                {getSpecifiedFields('country')}
              </select>
            </div>
          </div>
        </SimpleAccordion>

      </SimpleAccordion>

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
