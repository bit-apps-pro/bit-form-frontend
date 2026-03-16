/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import DropboxAuthorization from './DropboxAuthorization'

function DropboxGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const { css } = useFela()

  const [dropboxConf, setDropboxConf] = useState({
    name: 'Dropbox Integration',
    type: 'Dropbox',
    apiKey: process.env.NODE_ENV === 'development' ? 'jkuaskbflscbbh2' : '',
    apiSecret: process.env.NODE_ENV === 'development' ? 'k4mvl6n0u7ll7ll' : '',
    accessCode: '',
    field_map: [{ formField: '', dropboxFormField: '' }],
    foldersList: [],
    actions: {},
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  // document.querySelector('.btcd-s-wrp').scrollTop = 0

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      {/* STEP 1 */}
      <DropboxAuthorization
        formID={formID}
        dropboxConf={dropboxConf}
        setDropboxConf={setDropboxConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        authorizedAction={authorizedAction}
      />
    </div>
  )
}

export default DropboxGlobal
