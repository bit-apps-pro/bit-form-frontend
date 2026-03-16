/* eslint-disable camelcase */
/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $fields } from '../../GlobalStates/GlobalStates'
import { addFormUpdateError, reCalculateFldHeights, removeFormUpdateError } from '../../Utils/FormBuilderHelper'
import { __ } from '../../Utils/i18nwrap'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

export default function MollieField({ fieldKey, formID, attr, isBuilder, styleClasses }) {
  const payments = useAtomValue($payments)
  const [apiKey, setApiKey] = useState('')
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { currency, redirect_url } = fieldData.config || {}

  useEffect(() => {
    if (!attr.payIntegID) {
      setApiKey('')
      navigate(`field-settings/${fieldKey}`)
      return
    }
    const payInteg = payments?.find(pay => pay.id && attr.payIntegID && Number(pay.id) === Number(attr.payIntegID))
    if (payInteg) {
      const key = payInteg.apiKey
      setApiKey(key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attr.payIntegID])

  useEffect(() => {
    if (!apiKey) {
      addFormUpdateError({
        fieldKey,
        errorKey: 'mollieApiKeyMissing',
        errorMsg: __('Mollie API key is missing'),
        errorUrl: `field-settings/${fieldKey}`,
      })
      return
    }
    if (!redirect_url) {
      addFormUpdateError({
        fieldKey,
        errorKey: 'mollieRedirectUrlMissing',
        errorMsg: __('Mollie Redirect Url is not Selected'),
        errorUrl: `field-settings/${fieldKey}`,
      })
    }
    setIsLoading(false)
    removeFormUpdateError(fieldKey, 'mollieApiKeyMissing')
    reCalculateFldHeights(fieldKey)
  }, [apiKey, currency, redirect_url])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldData={attr}
        fieldKey={fieldKey}
        noLabel
        isBuilder={isBuilder}
      >
        {(apiKey && !isLoading) && (
          <div className={`${fieldKey}-mollie-wrp`}>
            <button data-dev-mollie-btn={fieldKey} type="button" className={`${fieldKey}-mollie-btn`}>
              <svg
                data-dev-mollie-icn={fieldKey}
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 80 80"
                xmlSpace="preserve"
                className={`${fieldKey}-mollie-icn`}
              >
                <path
                  strokeWidth="6"
                  fill="currentColor"
                  d="M74.79,39.15v21.4c0,0.36-0.07,0.46-0.44,0.46c-3.59-0.02-7.21-0.02-10.8,0c-0.41,0-0.51-0.1-0.51-0.51  c0.02-6.94,0-13.86,0.02-20.79c0-2.89-0.97-5.31-3.25-7.09c-2.62-2.06-5.56-2.5-8.64-1.21c-3.03,1.26-4.76,3.62-5.24,6.89  c-0.05,0.49-0.07,0.99-0.07,1.48c0,6.89,0,13.78,0.02,20.7c0,0.41-0.1,0.53-0.53,0.53c-3.57-0.02-7.16-0.02-10.75,0  c-0.36,0-0.46-0.1-0.46-0.49V39.73c0.02-2.89-0.97-5.34-3.28-7.13c-2.62-2.04-5.56-2.48-8.61-1.19c-3.03,1.26-4.76,3.62-5.22,6.87  c-0.07,0.51-0.07,1.02-0.07,1.53c0,6.89-0.02,13.81,0,20.7c0,0.41-0.1,0.51-0.51,0.51c-3.59-0.02-7.18-0.02-10.77,0  c-0.36,0-0.46-0.1-0.46-0.46c0.02-7.3-0.05-14.61,0.05-21.94c0.05-4.97,1.89-9.37,5.29-13.01c4.54-4.9,10.19-7.09,16.86-6.53  c4.76,0.39,8.83,2.35,12.28,5.63c0.24,0.24,0.36,0.24,0.61,0c4.78-4.46,10.41-6.38,16.91-5.53c8.83,1.14,15.8,7.93,17.28,16.72  C74.69,36.99,74.79,38.06,74.79,39.15z"
                />
              </svg>
              {' '}
              {fieldData.txt}
            </button>

          </div>
        )}
        {(!isLoading && !apiKey) && (
          <p>
            Please select a Mollie account from
            <strong> Field Settings </strong>
            to load Mollie field.
          </p>
        )}
        {isLoading && <p>Loading mollie...</p>}
      </InputWrapper>
    </>
  )
}
