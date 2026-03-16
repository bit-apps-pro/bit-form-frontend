import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import { setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoBiginAuthorization from './ZohoBiginAuthorization'

function ZohoBiginGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  // const scopes = 'ZohoBigin.settings.modules.READ,ZohoBigin.settings.fields.READ,ZohoBigin.settings.tags.READ,ZohoBigin.users.READ,ZohoBigin.modules.ALL'
  const [biginConf, setBiginConf] = useState({
    name: 'Zoho Bigin API',
    type: 'Zoho Bigin',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    module: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    relatedlists: [],
    actions: {},
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoBigin')
  }, [])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ZohoBiginAuthorization
        formID={formID}
        biginConf={biginConf}
        setBiginConf={setBiginConf}
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

export default ZohoBiginGlobal
