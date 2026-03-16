/* eslint-disable no-shadow */
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { $payments } from '../GlobalStates/AppSettingsStates'
import { $bits } from '../GlobalStates/GlobalStates'
import { deepCopy } from '../Utils/Helpers'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import LoaderSm from './Loaders/LoaderSm'
import MollieSetting from './MollieSetting'
import UserGuide from './PaymentSetting/UserGuide'
import PaypalSettings from './PaypalSettings'
import RazorpaySettings from './RazorpaySettings'
import StripeSettings from './StripeSettings'
import Btn from './Utilities/Btn'
import SnackMsg from './Utilities/SnackMsg'

export default function Payment({ allIntegURL }) {
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const [payments, setPayments] = useAtom($payments)
  const { type, indx } = useParams()
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [paySetting, setPaySetting] = useState(
    (indx && payments?.[indx])
      ? { ...payments[indx] }
      : { type, name: type },
  )

  if (paySetting.type !== type) {
    navigate(allIntegURL)
  }

  const handleInput = e => {
    const { name, value } = e.target
    const tmpSetting = { ...paySetting }
    tmpSetting[name] = value
    setPaySetting(tmpSetting)
  }

  const validation = () => {
    let validation = false
    const tmpSetting = { ...paySetting }

    switch (type) {
      case 'PayPal':
        if (!tmpSetting.name || !tmpSetting.clientID || !tmpSetting.clientSecret || !tmpSetting.mode) {
          validation = true
        }
        break
      case 'Razorpay':
        if (!tmpSetting.apiKey || !tmpSetting.apiSecret || !tmpSetting.name) {
          validation = true
        }
        break
      case 'Stripe':
        if (!tmpSetting.name || !tmpSetting.publishableKey || !tmpSetting.clientSecret) {
          validation = true
        }
        break
      case 'Mollie':
        if (!tmpSetting.name || !tmpSetting.apiKey) {
          validation = true
        }
        break
      // eslint-disable-next-line no-fallthrough
      default:
        console.log('not found')
        break
    }

    return validation
  }

  const handleSubmit = () => {
    if (!bits.isPro) return
    if (validation()) {
      setSnackbar({ show: true, msg: __('All fields are required') })
      return
    }
    setisLoading(true)
    const tmpSetting = { ...paySetting }
    const paymentSavePromise = bitsFetch({ paySetting }, 'bitforms_save_payment_setting')
      .then(res => {
        if (res !== undefined && res.success) {
          if (res.data && res.data.id) {
            tmpSetting.id = res.data.id
          }
          setPaySetting(tmpSetting)
          const tmpPayments = deepCopy(payments)
          if (!indx) tmpPayments.push(tmpSetting)
          else tmpPayments[indx] = tmpSetting
          setPayments(tmpPayments)
          // setSnackbar({ show: true, msg: __(res.data.message) })
          navigate('/app-settings/payments')
          return __(res.data.message)
        }
        setisLoading(false)
        return Promise.reject(__(res.data || 'Error Occured'))
      })
    toast.promise(paymentSavePromise, {
      success: data => data,
      error: data => data,
      loading: __('Saving Payment Setting...'),
    })
  }

  return (
    <div className="pos-rel">
      {!isPro && (
        <div className="pro-blur flx" style={{ top: -5, left: -10, height: '140%', width: '102%' }}>
          <div className="pro">
            {__('Available On')}
            <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
              <span className="txt-pro">
                {__('Premium')}
              </span>
            </a>
          </div>
        </div>
      )}
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      {
        {
          PayPal: <PaypalSettings
            paySetting={paySetting}
            setPaySetting={setPaySetting}
            handleInput={handleInput}
          />,
          Razorpay: <RazorpaySettings
            paySetting={paySetting}
            setPaySetting={setPaySetting}
            handleInput={handleInput}
          />,
          Stripe: <StripeSettings
            paySetting={paySetting}
            setPaySetting={setPaySetting}
            handleInput={handleInput}
          />,
          Mollie: <MollieSetting
            paySetting={paySetting}
            setPaySetting={setPaySetting}
            handleInput={handleInput}
          />,
        }[type]
      }
      <Btn
        onClick={handleSubmit}
        disabled={isLoading}
        className="f-left mt-2"
        shadow
      >
        {__('Save')}
        {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
      </Btn>

      <UserGuide type={type} />

    </div>
  )
}
