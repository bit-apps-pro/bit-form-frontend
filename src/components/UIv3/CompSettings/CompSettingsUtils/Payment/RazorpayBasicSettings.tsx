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
import { sortArrOfObj } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import { razorpayCurrencyCodes } from '../../../../../Utils/StaticData/razorpayData'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import CheckBox from '../../../../Utilities/CheckBox'
import SingleInput from '../../../../Utilities/SingleInput'

interface RazorpayBasicSettingsProps {
  /**
   * Additional CSS class names
   */
  className?: string
}

export default function RazorpayBasicSettings({
  className = ''
}: RazorpayBasicSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const isDynamicAmount = fieldData.options?.amountType === 'dynamic'
  const fieldLabel = fieldData?.lbl ?? ''

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
      if (!draft[fldKey].options) {
        draft[fldKey].options = {}
      }

      if (value) {
        draft[fldKey].options[name] = value
      } else {
        delete draft[fldKey].options[name]
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} changed to ${value}: ${fieldLabel || fldKey}`,
      type: `${name}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const setAmountType = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      if (!draft[fldKey].options) {
        draft[fldKey].options = {}
      }

      if (value) {
        draft[fldKey].options.amountType = value
      } else {
        delete draft[fldKey].options.amountType
      }

      // Update validation based on amount type
      if (value === 'dynamic') {
        removeFormUpdateError(fldKey, 'razorpayAmountMissing')
        if (!draft[fldKey].options.amountFld) {
          addFormUpdateError({
            fieldKey: fldKey,
            errorKey: 'razorpayAmountFldMissing',
            errorMsg: __('Razorpay Dynamic Amount Field is not Selected'),
            errorUrl: `field-settings/${fldKey}`,
          })
        }
      } else {
        removeFormUpdateError(fldKey, 'razorpayAmountFldMissing')
        if (!draft[fldKey].options.amount || parseInt(draft[fldKey].options.amount, 10) <= 0) {
          addFormUpdateError({
            fieldKey: fldKey,
            errorKey: 'razorpayAmountMissing',
            errorMsg: __('Razorpay Fixed Amount is not valid'),
            errorUrl: `field-settings/${fldKey}`,
          })
        }
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Amount Type changed to "${value}": ${fieldLabel || fldKey}`,
      type: 'set_amount_type',
      state: { fields: updatedFields, fldKey }
    })
  }


  useEffect(() => {
    removeFormUpdateError(fldKey, 'razorpayAmountFldMissing')
    removeFormUpdateError(fldKey, 'razorpayAmountMissing')
    removeFormUpdateError(fldKey, 'razorpayOrderIdFldMissing')
    if (isDynamicAmount && !fieldData.options?.amountFld) {
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'razorpayAmountFldMissing',
        errorMsg: __('Razorpay Dyanmic Amount Field is not Selected'),
        errorUrl: `field-settings/${fldKey}`,
      })
    } else if (!isDynamicAmount && (!fieldData.options?.amount || parseInt(fieldData.options?.amount, 10) <= 0)) {
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'razorpayAmountMissing',
        errorMsg: __('Razorpay Fixed Amount is not valid'),
        errorUrl: `field-settings/${fldKey}`,
      })
    }
    if (fieldData.includeOrderId && !fieldData.newOrderId && !fieldData.orderIdFld) {
      addFormUpdateError({
        fieldKey: fldKey,
        errorKey: 'razorpayOrderIdFldMissing',
        errorMsg: __('Razorpay Order ID Field is not Selected'),
        errorUrl: `field-settings/${fldKey}`,
      })
    }
  }, [fieldData.options?.amountType, fieldData.options?.amount, fieldData.options?.amountFld, fieldData.includeOrderId, fieldData.newOrderId, fieldData.orderIdFld])


  return (
    <div className={className}>
      {/* Amount Type Selection */}
      <div className={css(ut.ml2, ut.p1)}>
        <b>{__('Amount Type')}</b>
        <br />
        <CheckBox
          id="amnt-typ-fxd"
          onChange={setAmountType}
          radio
          checked={!isDynamicAmount}
          title={__('Fixed')}
          value="fixed"
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
            inpType="number"
            title={__('Amount')}
            value={fieldData.options?.amount || ''}
            action={e => handleInput('amount', e.target.value)}
            className={css({ mt: 0 })}
            cls={css(FieldStyle.input)}
          />
        </div>
      )}

      {/* Dynamic Amount Field Selection */}
      {isDynamicAmount && (
        <div className={css(ut.ml2, ut.mr2, ut.p1)}>
          <b>{__('Select Amount Field')}</b>
          <select
            data-testid="slct-amnt-fld-slct"
            onChange={e => handleInput('amountFld', e.target.value)}
            name="amountFld"
            className={css(FieldStyle.input)}
            value={fieldData.options?.amountFld || ''}
          >
            <option value="">{__('Select Field')}</option>
            {getAmountFields()}
          </select>
        </div>
      )}
      <FieldSettingsDivider />
      {/* Currency Selection */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <label htmlFor="currency">
          <b>{__('Currency')}</b>
          <select
            data-testid="crncy-slct"
            onChange={e => handleInput('currency', e.target.value)}
            name="currency"
            value={fieldData.options?.currency || 'INR'}
            className={css(FieldStyle.input)}
          >
            {sortArrOfObj(razorpayCurrencyCodes, 'currency').map(itm => (
              <option key={itm.currency} value={itm.code}>
                {`${itm.currency} - ${itm.code}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <FieldSettingsDivider />

      {/* Account Name */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <b>{__('Account Name')}</b>
        <br />
        <input
          data-testid="acnt-nam-inp"
          aria-label="Account Name"
          type="text"
          className={css(FieldStyle.input)}
          placeholder="Account Name"
          name="name"
          value={fieldData.options?.name || ''}
          onChange={e => handleInput('name', e.target.value)}
        />
      </div>
    </div>
  )
}