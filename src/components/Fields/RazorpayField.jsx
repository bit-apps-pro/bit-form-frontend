/* eslint-disable react/jsx-props-no-spreading */
import BitRazorpayField from 'bit-razorpay-field/src/bit-razorpay-field'
import { useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import { addFormUpdateError, reCalculateFldHeights, removeFormUpdateError } from '../../Utils/FormBuilderHelper'
import { getCustomAttributes, getCustomClsName, loadScript, selectInGrid } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

export default function RazorpayField({ fieldKey, formID, attr, isBuilder, styleClasses }) {
  const payments = useAtomValue($payments)
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const [clientID, setClientID] = useState('')
  const razorpayElemntRef = useRef(null)
  const razorpayFldWrpRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!clientID) {
      addFormUpdateError({
        fieldKey,
        errorKey: 'razorpayClientIdMissing',
        errorMsg: __('Razorpay Client ID is missing'),
        errorUrl: `field-settings/${fieldKey}`,
      })
      return
    }
    removeFormUpdateError(fieldKey, 'razorpayClientIdMissing')
    if (loaded) return
    const src = 'https://checkout.razorpay.com/v1/checkout.js'
    const srcData = {
      src,
      integrity: '',
      id: `bf-razorpay-script-${fieldKey}`,
      scriptInGrid: false,
      callback: () => {
        setLoaded(true)
      },
    }
    loadScript(srcData)
  }, [clientID])

  useEffect(() => {
    if (!attr.payIntegID) { setClientID(''); return }

    const payInteg = payments?.find(pay => pay.id && attr.payIntegID && Number(pay.id) === Number(attr.payIntegID))
    if (!payInteg) return
    const key = payInteg.apiKey
    setClientID(key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attr.payIntegID])

  useEffect(() => {
    if (!loaded) return
    if (!razorpayElemntRef?.current) {
      razorpayElemntRef.current = selectInGrid(`${fieldKey}-razorpay-wrp`)
    }
    const fldElemnt = razorpayElemntRef.current
    const fldConstructor = razorpayFldWrpRef.current
    if (!clientID || (fldConstructor && fldElemnt && 'destroy' in fldConstructor)) {
      fldConstructor.destroy()
      reCalculateFldHeights(fieldKey)
    }
    if (!clientID) return

    const config = {
      clientId: clientID,
      fieldKey,
      options: fieldData.options,
      onPaymentSuccess: resp => { console.log('success') },
      onPaymentFailed: () => { console.log('failed') },
    }

    razorpayFldWrpRef.current = new BitRazorpayField(fldElemnt, config)
  }, [loaded, fieldData])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldData={attr}
        fieldKey={fieldKey}
        noLabel
        noErrMsg
        isBuilder={isBuilder}
      >
        {loaded && clientID && (
          <div className="bf-form">
            <div
              ref={razorpayElemntRef}
              className={`${fieldKey}-razorpay-wrp`}
            >
              <button
                type="button"
                data-dev-razorpay-btn={fieldKey}
                className={`${fieldKey}-razorpay-btn ${getCustomClsName(fieldKey, 'razorpay-btn')}`}
                {...getCustomAttributes(fieldKey, 'razorpay-btn')}
              >
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.077 6.476l-.988 3.569 5.65-3.589-3.695 13.54 3.752.004 5.457-20L7.077 6.476z" fill="#fff" />
                  <path d="M1.455 14.308L0 20h7.202L10.149 8.42l-8.694 5.887z" fill="#fff" />
                </svg>
                <div
                  data-dev-razorpay-btn-text={fieldKey}
                  className={`${fieldKey}-razorpay-btn-text ${getCustomClsName(fieldKey, 'razorpay-btn-text')}`}
                  {...getCustomAttributes(fieldKey, 'razorpay-btn-text')}
                >
                  <span
                    data-dev-razorpay-btn-title={fieldKey}
                    className={`${fieldKey}-razorpay-btn-title ${getCustomClsName(fieldKey, 'razorpay-btn-title')}`}
                    {...getCustomAttributes(fieldKey, 'razorpay-btn-title')}
                  >
                    {fieldData.btnTxt}
                  </span>
                  {fieldData.subTitl && (
                    <span
                      data-dev-razorpay-btn-sub-title={fieldKey}
                      className={`${fieldKey}-razorpay-btn-sub-title ${getCustomClsName(fieldKey, 'razorpay-btn-sub-title')}`}
                      {...getCustomAttributes(fieldKey, 'razorpay-btn-sub-title')}
                    >
                      Secured by Razorpay
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}
        {(!loaded || !clientID) && (
          <p>
            Please select a Razorpay account from
            <strong> Field Settings </strong>
            to load Razorpay field.
          </p>
        )}
      </InputWrapper>
    </>
  )
}
