import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import ZohoSignAuthorization from './ZohoSignAuthorization'
import { setGrantTokenResponse } from './ZohoSignCommonFunc'

function ZohoSignGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [signConf, setSignConf] = useState({
    name: 'Zoho Sign API',
    type: 'Zoho Sign',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoSign')
  }, [])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <ZohoSignAuthorization
        formID={formID}
        signConf={signConf}
        setSignConf={setSignConf}
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

export default ZohoSignGlobal
