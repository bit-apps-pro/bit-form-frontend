/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import { fundLists, localeCodes } from '../../../../../Utils/StaticData/paypalData'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import CheckBox from '../../../../Utilities/CheckBox'
import SingleInput from '../../../../Utilities/SingleInput'

interface PaypalAdvancedSettingsProps {
  /**
   * Additional CSS class names
   */
  className?: string
}

export default function AdvancedPaypalSettings({
  className = ''
}: PaypalAdvancedSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const isDynamicShipping = fieldData?.shippingType === 'dynamic'
  const isDynamicTax = fieldData?.taxType === 'dynamic'
  const fieldLabel = fieldData?.lbl ?? ''

  // Get amount fields for shipping and tax
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
      if (value) {
        draft[fldKey][name] = value

        // Special handling for locale
        if (name === 'locale') {
          const localeArr = value.split(' - ')
          draft[fldKey].locale = localeArr[localeArr.length - 1]
          draft[fldKey].language = value
        }
      } else {
        delete draft[fldKey][name]
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} changed to ${value}: ${fieldLabel || fldKey}`,
      type: `${name}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const setShippingType = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      if (value) {
        draft[fldKey].shippingType = value
      } else {
        delete draft[fldKey].shippingType
      }

      // Clear shipping values when switching type
      delete draft[fldKey].shipping
      delete draft[fldKey].shippingFld
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Shipping Type changed to "${value}": ${fieldLabel || fldKey}`,
      type: 'set_shipping_type',
      state: { fields: updatedFields, fldKey }
    })
  }

  const setTaxType = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      if (value) {
        draft[fldKey].taxType = value
      } else {
        delete draft[fldKey].taxType
      }

      // Clear tax values when switching type
      delete draft[fldKey].tax
      delete draft[fldKey].taxFld
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Tax type changed to "${value}": ${fieldLabel || fldKey}`,
      type: 'set_tax_type',
      state: { fields: updatedFields, fldKey }
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
    value: `${locale.region} - ${locale.code}`,
  }))

  const fundOptions = () => fundLists.map(fund => ({
    label: fund.label,
    value: fund.value
  }))

  return (
    <div className={className}>
      {/* Language Selection */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <b>{__('Language')}</b>
        <MultiSelect
          className="w-10 btcd-paper-drpdwn mt-1"
          options={localeCodeOptions()}
          onChange={val => handleInput('locale', val)}
          defaultValue={fieldData.language || ''}
          largeData
          singleSelect
        />
      </div>
      <FieldSettingsDivider />
      {/* Disable Card */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <b>{__('Disable Card')}</b>
        <MultiSelect
          className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
          options={fundOptions()}
          onChange={val => handleInput('disableFunding', val)}
          defaultValue={fieldData.disableFunding || ''}
        />
      </div>
      <FieldSettingsDivider />
      {/* Shipping Amount Type */}
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

      {/* Fixed Shipping Cost */}
      {!isDynamicShipping && (
        <div className={css(ut.ml2, ut.mr2, ut.p1)}>
          <SingleInput
            id="spng-cst"
            cls={css(FieldStyle.input)}
            inpType="number"
            title={__('Shipping Cost')}
            value={fieldData.shipping || ''}
            action={e => handleInput('shipping', e.target.value)}
            className={css({ mt: 0 })}
          />
        </div>
      )}

      {/* Dynamic Shipping Field Selection */}
      {isDynamicShipping && (
        <div className={css(ut.ml2, ut.mr2, ut.p1)}>
          <label htmlFor="shippingFld">{__('Select Shipping Amount Field')}</label>
          <select
            data-testid="slct-shpng-amnt"
            onChange={e => handleInput('shippingFld', e.target.value)}
            name="shippingFld"
            className={css(FieldStyle.input)}
            value={fieldData.shippingFld || ''}
          >
            <option value="">{__('Select Field')}</option>
            {getAmountFields()}
          </select>
        </div>
      )}
      <FieldSettingsDivider />
      {/* Tax Amount Type */}
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

      {/* Fixed Tax */}
      {!isDynamicTax && (
        <div className={css(ut.ml2, ut.mr2, ut.p1)}>
          <SingleInput
            id="tax"
            cls={css(FieldStyle.input)}
            inpType="number"
            title={__('Tax (%)')}
            value={fieldData.tax || ''}
            action={e => handleInput('tax', e.target.value)}
            className={css({ mt: 0 })}
          />
        </div>
      )}

      {/* Dynamic Tax Field Selection */}
      {isDynamicTax && (
        <div className={css(ut.ml2, ut.mr2, ut.p1)}>
          <label htmlFor="taxFld">{__('Select Amount Field')}</label>
          <select
            data-testid="slct-amnt-fld"
            onChange={e => handleInput('taxFld', e.target.value)}
            name="taxFld"
            className={css(FieldStyle.input)}
            value={fieldData.taxFld || ''}
          >
            <option value="">{__('Select Field')}</option>
            {getAmountFields()}
          </select>
        </div>
      )}
    </div>
  )
}