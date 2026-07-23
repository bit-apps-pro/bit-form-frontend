/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $payments } from '../../../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { ucFirst } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'


export default function PaymentAccountSelection() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const payments = useAtomValue($payments)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const paymentType = ucFirst(fieldData?.typ || '')
  const payIntegID = fieldData?.payIntegID ?? ''
  const fieldLabel = fieldData?.lbl ?? fieldData?.adminLbl ?? ''

  // Filter payment configurations by type
  const getPaymentConfigs = () => {
    const filteredPayments = payments.filter(pay => pay.type.toLowerCase() === paymentType.toLowerCase())
    return filteredPayments.map(payment => (
      <option key={payment.id} value={payment.id}>
        {payment.name}
      </option>
    ))
  }

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].payIntegID = value
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${paymentType} Account Changed to "${value}": ${fieldLabel || fldKey}`,
      type: 'payment_account_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="slct-cnfg-stng"
      title={`${paymentType} Accounts`}
      className={`${css(FieldStyle.fieldSection)}`}
      open
    >
      <select
        data-testid="slct-cnfg-slct"
        name="payIntegID"
        id="payIntegID"
        onChange={handleAccountChange}
        className={css(FieldStyle.input)}
        value={payIntegID}
        aria-label={`Select ${paymentType} Account`}
      >
        <option value="">{__('Select Account')}</option>
        {getPaymentConfigs()}
      </select>
    </SimpleAccordion>
  )
}