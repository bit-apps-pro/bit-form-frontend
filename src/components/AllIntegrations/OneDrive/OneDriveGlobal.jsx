/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import { setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'

import OneDriveAuthorization from './OneDriveAuthorization'

function OneDriveGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { flowID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [oneDriveConf, setOneDriveConf] = useState({
    name: 'OneDrive',
    type: 'OneDrive',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    field_map: [{ formField: '', OneDriveFormField: '' }],
    folder: '',
    folderMap: [],
    foldersList: [],
    actions: {},
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  useEffect(() => {
    window.opener && setGrantTokenResponse('oneDrive')
  }, [])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      {/* STEP 1 */}
      <OneDriveAuthorization
        flowID={flowID}
        oneDriveConf={oneDriveConf}
        setOneDriveConf={setOneDriveConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        authorizedAction={authorizedAction}
      />
    </div>
  )
}

export default OneDriveGlobal
