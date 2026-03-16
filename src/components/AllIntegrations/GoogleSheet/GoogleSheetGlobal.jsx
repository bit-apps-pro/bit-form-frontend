import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { setGrantTokenResponse } from '../IntegrationHelpers/GoogleIntegrationHelpers'
import GoogleSheetAuthorization from './GoogleSheetAuthorization'

function GoogleSheetGlobal({ formFields, setConnectedApps, connectedApps, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const { css } = useFela()
  const [snack, setSnackbar] = useState({ show: false })
  const [sheetConf, setSheetConf] = useState({
    name: 'Google Sheet Authorization',
    type: 'Google Sheet',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    actions: {},
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  useEffect(() => {
    window.opener && setGrantTokenResponse('googleSheet')
  }, [])

  return (
    <div>
      {/* <SnackMsg snack={snack} setSnackbar={setSnackbar} /> */}
      <div className="txt-center w-9 mt-2 cal-width">
        {/* <Steps step={3} active={step} /> */}
      </div>

      {/* STEP 1 */}
      <GoogleSheetAuthorization
        formID={formID}
        allIntegURL={allIntegURL}
        sheetConf={sheetConf}
        setSheetConf={setSheetConf}
        step={step}
        setstep={setstep}
        setSnackbar={setSnackbar}
        isLoading={isLoading}
        setisLoading={setisLoading}
        authorizedAction={authorizedAction}
      />

    </div>
  )
}

export default GoogleSheetGlobal
