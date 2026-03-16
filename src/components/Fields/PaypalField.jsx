import BitPaypalField from 'bit-paypal-field/src/bit-paypal-field'
import { useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import { addFormUpdateError, reCalculateFldHeights, removeFormUpdateError } from '../../Utils/FormBuilderHelper'
import { loadScript, removeScript, selectInGrid } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

export default function PaypalField({ fieldKey, formID, attr, isBuilder, styleClasses }) {
  const payments = useAtomValue($payments)
  const [clientID, setClientID] = useState('')
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]

  const paypalElemnRaf = useRef(null)
  const paypalFldWrapRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isSubscription = fieldData?.payType === 'subscription'
  const { locale, currency, disableFunding } = fieldData || {}

  useEffect(() => {
    if (!attr.payIntegID) { setClientID(''); return }
    const payInteg = payments?.find(pay => pay.id && attr.payIntegID && Number(pay.id) === Number(attr.payIntegID))
    if (payInteg) {
      const key = payInteg.clientID
      setClientID(key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attr.payIntegID])

  useEffect(() => {
    if (!clientID) {
      addFormUpdateError({
        fieldKey,
        errorKey: 'paypalClientIdMissing',
        errorMsg: __('PayPal Client ID is missing'),
        errorUrl: `field-settings/${fieldKey}`,
      })
      return
    }
    setIsLoading(true)
    removeFormUpdateError(fieldKey, 'paypalClientIdMissing')
    const urlQueryParams = { 'client-id': clientID }
    if (fieldData?.locale) urlQueryParams.locale = fieldData.locale
    if (fieldData?.disableFunding) urlQueryParams['disable-funding'] = fieldData.disableFunding
    if (isSubscription) {
      urlQueryParams.intent = 'subscription'
      urlQueryParams.vault = 'true'
    }
    if (!isSubscription && fieldData?.currency) {
      urlQueryParams.currency = fieldData.currency
    }
    const src = `https://www.paypal.com/sdk/js?${new URLSearchParams(urlQueryParams).toString()}`
    const srcData = {
      src,
      integrity: '',
      id: `bf-paypal-script-${fieldKey}`,
      scriptInGrid: false,
      attr: { 'data-namespace': fieldKey },
      callback: () => {
        reCalculateFldHeights(fieldKey)
        setLoaded(true)
        setIsLoading(false)
      },
    }
    loadScript(srcData)

    return () => {
      removeScript('bf-paypal-script')
    }
  }, [clientID, locale, currency, disableFunding])

  useEffect(() => {
    if (!loaded || isLoading) return
    if (!paypalElemnRaf?.current) {
      paypalElemnRaf.current = selectInGrid(`#${fieldKey}-paypal-wrp`)
    }
    const fldConstructor = paypalFldWrapRef.current
    const fldElemnt = paypalElemnRaf.current
    if (!clientID || (fldConstructor && fldElemnt && 'destroy' in fldConstructor)) {
      fldConstructor.destroy()
      reCalculateFldHeights(fieldKey)
    }

    if (!clientID) return setLoaded(false)

    const { style, currency } = fieldData

    const config = {
      namespace: fieldKey,
      style,
      currency,
      payType: 'payment',
      shipping: 0,
      tax: 0,
      onInit: () => {
        reCalculateFldHeights(fieldKey)
      },
    }

    paypalFldWrapRef.current = new BitPaypalField(fldElemnt, config)
  }, [loaded, isLoading])

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
        {(loaded && clientID && !isLoading) && (
          <div className={`${fieldKey}-paypal-wrp`}>
            <div ref={paypalElemnRaf} id={`${fieldKey}-paypal-wrp`} />
          </div>
        )}
        {(!isLoading && (!loaded || !clientID)) && (
          <p>
            Please select a PayPal account from
            <strong> Field Settings </strong>
            to load PayPal field.
          </p>
        )}
        {isLoading && <p>Loading PayPal...</p>}
      </InputWrapper>
    </>
  )
}
