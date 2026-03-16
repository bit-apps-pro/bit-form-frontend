/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import RapidmailAuthorization from './RapidmailAuthorization'
import { checkMappedFields } from './RapidmailCommonFunc'

function RapidmailGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const recipientsFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'firstname', label: 'First name', required: false },
    { key: 'lastname', label: 'Last name', required: false },
    { key: 'gender', label: 'Gender', required: false },
    { key: 'title', label: 'Title', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'birthdate', label: 'Birthdate', required: false },
    { key: 'extra1', label: 'Extra field 1', required: false },
    { key: 'extra2', label: 'Extra field 2', required: false },
    { key: 'extra3', label: 'Extra field 3', required: false },
    { key: 'extra4', label: 'Extra field 4', required: false },
    { key: 'extra5', label: 'Extra field 5', required: false },
    { key: 'extra6', label: 'Extra field 6', required: false },
    { key: 'extra7', label: 'Extra field 7', required: false },
    { key: 'extra8', label: 'Extra field 8', required: false },
    { key: 'extra9', label: 'Extra field 9', required: false },
    { key: 'extra10', label: 'Extra field 10', required: false },
  ]

  const [rapidmailConf, setRapidmailConf] = useState({
    name: 'Rapidmail',
    type: 'Rapidmail',
    username: process.env.NODE_ENV === 'development' ? '3794a7c6ad7cc48871b97c2b68f328e374a089d2' : '',
    password: process.env.NODE_ENV === 'development' ? 'd7db58d60026707dc677fd5b240e9de4b5bd7841' : '',
    field_map: [
      { formField: '', rapidmailFormField: '' },
    ],
    recipientsFields,
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
      <RapidmailAuthorization
        rapidmailConf={rapidmailConf}
        setRapidmailConf={setRapidmailConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        authorizedAction={authorizedAction}
      />
    </div>
  )
}

export default RapidmailGlobal
