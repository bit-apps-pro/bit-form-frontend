import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory, deleteNestedObj } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { layouts, localeCodes, themes } from '../../../../../Utils/StaticData/StripeData'
import allCountries from '../../../../../Utils/StaticData/countries.json'
import tippyHelperMsg from '../../../../../Utils/StaticData/tippyHelperMsg'
import { __ } from '../../../../../Utils/i18nwrap'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import AutoResizeInput from '../../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import CheckBox from '../../../../Utilities/CheckBox'
import SingleInput from '../../../../Utilities/SingleInput'
import SingleToggle from '../../../../Utilities/SingleToggle'
import { assignNestedObj } from '../../../../style-new/styleHelpers'

export default function StripeAdvancedSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const formFields = Object.entries(fields)
  const isSubscription = fieldData?.payType === 'subscription'

  const { css } = useFela()

  const handleInput = (name: string, value: string | string[]) => {
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

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propNameLabel[name]} to ${value}: ${fieldData.lbl || fldKey}`,
      type: `${name}_changed`,
      state: { fields: allFields, fldKey }
    })
  }

  const handleLayout = (value: string) => {
    if (value) {
      fieldData.config.layout = layouts[value]
    } else {
      delete fieldData.config.layout
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propNameLabel.layout} to ${value}: ${fieldData.lbl || fldKey}`,
      type: 'layout_changed',
      state: { fields: allFields, fldKey }
    })
  }

  const handleTheme = (value: string) => {
    if (value) {
      fieldData.config.theme.name = value
      fieldData.config.theme.style = themes[value]
    } else {
      delete fieldData.config.theme
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propNameLabel.theme} to ${value}: ${fieldData.lbl || fldKey}`,
      type: 'theme_changed',
      state: { fields: allFields, fldKey }
    })
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

  const getSpecifiedFields = (type: string) => {
    let pattern: RegExp
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

  const handleAccordionToggle = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div>
      {!isSubscription && (
        <>
          {/* Language */}
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

          <FieldSettingsDivider />
        </>
      )}

      {/* Layout */}
      <SimpleAccordion
        id="slct-cnfg-layout"
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
          {Object
            .keys(layouts)
            .map(layout => (<option key={layout} value={layout}>{layout}</option>))}
        </select>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {/* Theme */}
      <SimpleAccordion
        id="slct-cnfg-theme"
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
          {Object
            .keys(themes)
            .map(tm => (<option key={`${themes[tm].theme}-${tm}`} value={tm}>{tm}</option>))}
        </select>
      </SimpleAccordion>

      <FieldSettingsDivider />

      {!isSubscription && (
        <>
          {/* Description */}
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <label htmlFor="description">
              <b>{__('Description')}</b>
              <AutoResizeInput
                id="description"
                aria-label="Stripe description text"
                placeholder="Type text here..."
                value={fieldData.config.options?.description}
                changeAction={e => handleInput('config->options->description', e.target.value)}
              />
            </label>
          </div>

          <FieldSettingsDivider />
        </>
      )}

      {/* Additional Settings */}
      <SimpleAccordion
        id="adtnl-stng"
        title="Additional Settings"
        className={css(FieldStyle.fieldSection)}
      >
        {/* Email */}
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

        {/* Address */}
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
            {/* Mode */}
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

            {/* Autocomplete */}
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

            {/* Google Maps API Key */}
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

            {/* Allowed Countries */}
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

            {/* Name Mode */}
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

            {/* Full Name Field */}
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

            {/* First Name and Last Name Fields */}
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

            {/* Phone Number Toggle */}
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

            {/* Phone Field */}
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

            {/* Address Line 1 */}
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

            {/* Address Line 2 */}
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

            {/* City */}
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

            {/* State */}
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

            {/* Postal Code */}
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

            {/* Country */}
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
  theme: 'Theme Changed',
}