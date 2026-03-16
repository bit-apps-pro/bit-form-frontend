/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import { addFormUpdateError, reCalculateFldHeights, removeFormUpdateError } from '../../Utils/FormBuilderHelper'
import { loadScript, removeScript, selectInGrid } from '../../Utils/globalHelpers'
import { __ } from '../../Utils/i18nwrap'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

export default function StripeField({ fieldKey, formID, attr, isBuilder, styleClasses }) {
  const payments = useAtomValue($payments)
  const [publishableKey, setPublishableKey] = useState('')
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const stripeElemnRaf = useRef(null)
  const stripeFldWrapRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isSubscription = fieldData?.payType === 'subscription'
  const { locale, currency } = fieldData || {}
  useEffect(() => {
    if (!attr.payIntegID) { setPublishableKey(''); return }
    const payInteg = payments?.find(pay => pay.id && attr.payIntegID && Number(pay.id) === Number(attr.payIntegID))
    if (payInteg) {
      const key = payInteg.publishableKey
      console.log('key', key)
      setPublishableKey(key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attr.payIntegID])

  useEffect(() => {
    if (!publishableKey) {
      addFormUpdateError({
        fieldKey,
        errorKey: 'publishableKeyMissing',
        errorMsg: __('Stripe publishable key is missing'),
        errorUrl: `field-settings/${fieldKey}`,
      })
      return
    }
    setIsLoading(true)
    removeFormUpdateError(fieldKey, 'publishableKeyMissing')
    // const urlQueryParams = { 'client-id': publishableKey }
    // if (fieldData?.locale) urlQueryParams.locale = fieldData.locale
    // if (fieldData?.disableFunding) urlQueryParams['disable-funding'] = fieldData.disableFunding
    // if (isSubscription) {
    //   urlQueryParams.intent = 'subscription'
    //   urlQueryParams.vault = 'true'
    // }
    // if (!isSubscription && fieldData?.currency) {
    //   urlQueryParams.currency = fieldData.currency
    // }
    const src = 'https://js.stripe.com/v3/'
    const srcData = {
      src,
      integrity: '',
      id: `bf-stripe-script-${fieldKey}`,
      scriptInGrid: false,
      callback: () => {
        reCalculateFldHeights(fieldKey)
        setLoaded(true)
        setIsLoading(false)
      },
    }
    loadScript(srcData)

    return () => {
      removeScript(`bf-stripe-script-${fieldKey}`)
    }
  }, [publishableKey, locale, currency])

  useEffect(() => {
    if (!loaded || isLoading) return
    if (!stripeElemnRaf?.current) {
      stripeElemnRaf.current = selectInGrid(`#${fieldKey}-stripe-wrp`)
    }
    const fldConstructor = stripeFldWrapRef.current
    const fldElemnt = stripeElemnRaf.current
    if (!publishableKey || (fldConstructor && fldElemnt && 'destroy' in fldConstructor)) {
      fldConstructor.destroy()
      reCalculateFldHeights(fieldKey)
    }

    if (!publishableKey) return setLoaded(false)

    // const { currency } = fieldData

    // console.log({ currency })

    const config = {
      options: {
        // mode: 'payment',
        // currency,
        // amount: 1,
        // payment_method_types: ['card'],
        ...fieldData.config.options,
      },
      layout: {
        // type: 'tabs',
        // defaultCollapsed: false,
        ...fieldData.config.layout,
      },
      publishableKey,
      onInit: () => {
        reCalculateFldHeights(fieldKey)
      },
    }

    // stripeFldWrapRef.current = new BitStripeField(fldElemnt, config)
  }, [loaded, isLoading])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldData={attr}
        fieldKey={fieldKey}
        noLabel
        // noErrMsg
        isBuilder={isBuilder}
      >
        {(loaded && publishableKey && !isLoading) && (
          <div className={`${fieldKey}-stripe-wrp`}>
            <button data-dev-stripe-btn={fieldKey} type="button" className={`${fieldKey}-stripe-btn`}>
              <svg data-dev-stripe-icn={fieldKey} xmlns="http://www.w3.org/2000/svg" className={`${fieldKey}-stripe-icn`} viewBox="0 0 24 24">
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
                  />
                  <path
                    fill="currentColor"
                    d="M6.936 3.715C8.326 2.567 10.24 2 12.404 2c1.746 0 3.49.275 5.259.981a1 1 0 0 1 .629.929v3.64c0 1.244-1.286 1.916-2.291 1.5c-1.198-.494-2.532-.759-3.597-.759c-.217 0-.386.016-.512.04c-.05.01-.089.02-.12.03c.089.072.25.17.528.29c.309.134.68.263 1.129.416l.061.02c.42.144.892.305 1.367.495c.99.396 2.094.954 2.95 1.882c.885.957 1.445 2.241 1.45 3.954v.003c0 2.065-.835 3.755-2.305 4.904C15.511 21.454 13.542 22 11.34 22a14.62 14.62 0 0 1-5.777-1.21a1 1 0 0 1-.604-.918V16.18c0-1.241 1.297-1.937 2.322-1.47c1.39.636 2.901 1.038 4.059 1.038c.497 0 .761-.073.87-.134a.255.255 0 0 0 .017-.01a.352.352 0 0 0 .005-.062v-.005a.34.34 0 0 0-.04-.05c-.084-.086-.25-.205-.56-.353a13.21 13.21 0 0 0-1.112-.444a146.78 146.78 0 0 0-.22-.08c-.373-.135-.782-.283-1.189-.448c-.973-.395-2.066-.935-2.916-1.81c-.882-.908-1.453-2.127-1.453-3.753c0-2.026.782-3.717 2.194-4.883ZM8.21 5.257c-.918.758-1.467 1.866-1.467 3.34c0 1.104.366 1.824.888 2.361c.555.571 1.334.985 2.233 1.349c.369.15.736.283 1.107.417l.234.085c.437.16.888.329 1.288.519c.713.34 1.74.97 1.74 2.213c0 .375-.083.744-.277 1.077a2.015 2.015 0 0 1-.766.74c-.561.314-1.243.39-1.85.39c-1.373 0-2.957-.408-4.38-.998v2.447c1.503.562 3.001.803 4.38.803c1.898 0 3.388-.473 4.381-1.249c.964-.754 1.537-1.852 1.538-3.327c-.005-1.234-.39-2.03-.92-2.602c-.556-.603-1.334-1.026-2.223-1.382c-.426-.17-.855-.316-1.285-.463l-.047-.017a17.654 17.654 0 0 1-1.278-.473c-.387-.168-.809-.387-1.142-.703c-.362-.344-.634-.819-.634-1.424c0-.72.328-1.323.936-1.683c.52-.308 1.157-.385 1.739-.385c1.203 0 2.597.259 3.888.728V4.608C15.002 4.177 13.717 4 12.404 4c-1.836 0-3.255.481-4.195 1.257Z"
                  />
                </g>
              </svg>
              {fieldData.txt}
            </button>
            <button type="button" data-dev-stripe-pay-btn={fieldKey} className="stripe-pay-btn">
              {fieldData.config.payBtnTxt}
            </button>
          </div>
        )}
        {(!isLoading && (!loaded || !publishableKey)) && (
          <p>
            Please select a Stripe account from
            <strong> Field Settings </strong>
            to load Stripe field.
          </p>
        )}
        {isLoading && <p>Loading Stripe...</p>}
      </InputWrapper>
    </>
  )
}
