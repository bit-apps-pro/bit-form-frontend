/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useEffect } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addFormUpdateError, addToBuilderHistory, removeFormUpdateError } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import { currencyCodes } from '../../../../../Utils/StaticData/paypalData'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import CheckBox from '../../../../Utilities/CheckBox'
import SingleInput from '../../../../Utilities/SingleInput'
import SingleToggle from '../../../../Utilities/SingleToggle'

interface PaypalBasicSettingsProps {
  /**
   * Additional CSS class names
   */
  className?: string
}

export default function PaypalBasicSettings({
  className = ''
}: PaypalBasicSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const isSubscription = fieldData?.payType === 'subscription'
  const isDynamicAmount = fieldData?.amountType === 'dynamic'
  const fieldLabel = fieldData?.lbl ?? ''

  // Get all fields that can be used for amount
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
    if (value) {
      fieldData[name] = value
      // Remove specific errors when fixed
      if (name === 'planId') {
        removeFormUpdateError(fldKey, 'paypalPlanIdMissing')
      }
    } else {
      delete fieldData[name]
    }
    const updatedFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} changed to ${value}: ${fieldLabel || fldKey}`,
      type: `${name}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const setSubscription = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      if (checked) {
        draft[fldKey].payType = 'subscription'
        delete draft[fldKey].currency

        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'paypalPlanIdMissing',
          errorMsg: __('PayPal Plan Id missing'),
          errorUrl: `field-settings/${fldKey}`,
        })
        removeFormUpdateError(fldKey, 'paypalAmountMissing')
        removeFormUpdateError(fldKey, 'paypalAmountFldMissing')
      } else {
        draft[fldKey].currency = 'USD'
        delete draft[fldKey].payType
        delete draft[fldKey].planId

        removeFormUpdateError(fldKey, 'paypalPlanIdMissing')
        addFormUpdateError({
          fieldKey: fldKey,
          errorKey: 'paypalAmountMissing',
          errorMsg: __('PayPal Fixed Amount is not valid'),
          errorUrl: `field-settings/${fldKey}`,
        })
      }

      // Clear amount settings when switching
      delete draft[fldKey].amountType
      delete draft[fldKey].amount
      delete draft[fldKey].amountFld
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Subscription "${checked ? 'On' : 'Off'}": ${fieldLabel || fldKey}`,
      type: 'toggle_subscription',
      state: { fields: updatedFields, fldKey }
    })
  }

  const setAmountType = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      if (value) {
        draft[fldKey].amountType = value
      } else {
        delete draft[fldKey].amountType
      }

      // Clear amount values when switching type
      delete draft[fldKey].amount
      delete draft[fldKey].amountFld
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Amount Type Changed to "${value}": ${fieldLabel || fldKey}`,
      type: 'set_amount',
      state: { fields: updatedFields, fldKey }
    })
  }

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

  return (
    <div className={className}>
      {/* Subscription Toggle */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <SingleToggle
          id="sbscrptn"
          title={__('Subscription:')}
          action={setSubscription}
          isChecked={isSubscription}
          className="mt-1 mb-1"
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

      <FieldSettingsDivider />

      {/* Show rest of settings only if not subscription */}
      {!isSubscription && (
        <>
          {/* Currency Selection */}
          <div className={css(ut.ml2, ut.mr2, ut.p1)}>
            <label htmlFor="currency">
              <b>{__('Currency')}</b>
              <select
                data-testid="crncy-fld-slct"
                onChange={e => handleInput('currency', e.target.value)}
                name="currency"
                value={fieldData.currency || 'USD'}
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
          <FieldSettingsDivider />

          {/* Amount Type Selection */}
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

          {/* Fixed Amount Input */}
          {!isDynamicAmount && (
            <div className={css(ut.ml2, ut.mr2, ut.p1)}>
              <SingleInput
                id="amnt"
                cls={css(FieldStyle.input)}
                inpType="number"
                title={__('Amount')}
                value={fieldData.amount || ''}
                action={e => handleInput('amount', e.target.value)}
                className={css({ mt: 0 })}
              />
            </div>
          )}

          {/* Dynamic Amount Field Selection */}
          {isDynamicAmount && (
            <div className={css(ut.ml2, ut.mr2, ut.p1)}>
              <b>{__('Select Amount Field')}</b>
              <select
                data-testid="slct-amnt-slct"
                onChange={e => handleInput('amountFld', e.target.value)}
                name="amountFld"
                className={css(FieldStyle.input)}
                value={fieldData.amountFld || ''}
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