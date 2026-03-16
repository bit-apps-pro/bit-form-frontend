import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import { setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoProjectsAuthorization from './ZohoProjectsAuthorization'

function ZohoProjectsGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [projectsConf, setProjectsConf] = useState({
    name: 'Zoho Projects API',
    type: 'Zoho Projects',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    portalId: '',
    event: '',
    field_map: {},
    actions: {},
  })
  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoProjects')
  }, [])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ZohoProjectsAuthorization
        formID={formID}
        projectsConf={projectsConf}
        setProjectsConf={setProjectsConf}
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

export default ZohoProjectsGlobal
