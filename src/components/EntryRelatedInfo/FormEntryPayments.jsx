import { useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { $bits, $fieldLabels } from '../../GlobalStates/GlobalStates'
import paymentFields from '../../Utils/StaticData/paymentFields'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import PaypalInfo from './PaymentInfo/PaypalInfo'
import RazorpayInfo from './PaymentInfo/RazorpayInfo'
import StripeInfo from './PaymentInfo/StripeInfo'
import MollieInfo from './PaymentInfo/MollieInfo'

export default function FormEntryPayments({ formID, rowDtl }) {
  const allLabels = useAtomValue($fieldLabels)
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const [paymentInfo, setPaymentInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const payFields = allLabels.filter(label => paymentFields.includes(label.type))
  const payFld = payFields.find(field => rowDtl[field.key]) || {}
  const payInfoFound = useRef(0) // 1 - found, 2 - not found
  const { css } = useFela()

  useEffect(() => {
    if (isPro) {
      setIsLoading(true)
      const tnId = rowDtl?.[payFld?.key]
      const transactionID = tnId?.split(',')?.[0]

      bitsFetch({ formID, transactionID }, 'bitforms_payment_details')
        .then(result => {
          if (result.success && result.data.length) {
            setPaymentInfo(result.data[0])
            payInfoFound.current = 1
          } else {
            payInfoFound.current = 2
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
    return () => setPaymentInfo({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowDtl])

  const showPaymentInfo = () => {
    switch (payFld?.type) {
      case 'paypal':
        return <PaypalInfo paymentInfo={paymentInfo} payInfoFound={payInfoFound} />
      case 'razorpay':
        return <RazorpayInfo paymentInfo={paymentInfo} payInfoFound={payInfoFound} fldKey={payFld?.key} transactionID={rowDtl?.[payFld?.key]} />
      case 'stripe':
        return <StripeInfo paymentInfo={paymentInfo} payInfoFound={payInfoFound} fldKey={payFld?.key} transactionID={rowDtl?.[payFld?.key]} />
      case 'mollie':
        return <MollieInfo paymentInfo={paymentInfo} payInfoFound={payInfoFound} />
      default:
        return <h2 className={css({ fs: 14, cr: 'red', mt: 20, ml: 10, fw: 'normal' })}>{__('No Payment Info Found!')}</h2>
    }
  }

  return (
    <div className="pos-rel">
      {!isPro && (
        <div className="pro-blur mt-4 flx">
          <div className="pro">
            {__('Available On')}
            <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
              <span className="txt-pro">
                {' '}
                {__('Premium')}
              </span>
            </a>
          </div>
        </div>
      )}
      {isLoading ? (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
          transform: 'scale(0.7)',
        }}
        />
      ) : showPaymentInfo()}
    </div>
  )
}
