import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import { setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoMarketingHubAuthorization from './ZohoMarketingHubAuthorization'

function ZohoMarketingHubGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [marketingHubConf, setMarketingHubConf] = useState({
    name: 'Zoho Marketing Hub API',
    type: 'Zoho Marketing Hub',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    list: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoMarkatingHub')
  }, [])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      {/* <div className="txt-center w-9 mt-2 cal-width">
        <Steps step={3} active={step} />
      </div> */}

      {/* STEP 1 */}
      <ZohoMarketingHubAuthorization
        formID={formID}
        marketingHubConf={marketingHubConf}
        setMarketingHubConf={setMarketingHubConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
        authorizedAction={authorizedAction}
      />

    </div>
  )
}

export default ZohoMarketingHubGlobal
