import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import { setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoAnalyticsAuthorization from './ZohoAnalyticsAuthorization'

export default function ZohoAnalyticsGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [analyticsConf, setAnalyticsConf] = useState({
    name: 'Zoho Analytics API',
    type: 'Zoho Analytics',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    actions: {},
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoAnalytics')
  }, [])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ZohoAnalyticsAuthorization
        formID={formID}
        analyticsConf={analyticsConf}
        setAnalyticsConf={setAnalyticsConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
        authorizedAction={authorizedAction}
      />
    </div>
  )
}
