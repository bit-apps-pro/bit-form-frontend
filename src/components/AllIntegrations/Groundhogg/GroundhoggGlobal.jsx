import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { $bits } from '../../../GlobalStates/GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'
import GroundhoggAuthorization from './GroundhoggAuthorization'

function GroundhoggGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const bits = useAtomValue($bits)
  const { css } = useFela()

  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const contactsFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'first_name', label: 'First Name', required: false },
    { key: 'last_name', label: 'Last Name', required: false },
    { key: 'user_id', label: 'User Id', required: false },
    { key: 'owner_id', label: 'Owner Id', required: false },
    { key: 'optin_status', label: 'Optin Status', required: false },
  ]

  const contactMetaFields = [
    { key: 'primary_phone', label: 'Primary Phone', required: false },
    { key: 'street_address_1', label: 'Street Address 1', required: false },
    { key: 'street_address_2', label: 'Street Address 2', required: false },
    { key: 'postal_zip', label: 'Postal Zip', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'country', label: 'Country', required: false },
  ]

  const allActions = [
    { key: '1', label: 'Create Contact' },
    { key: '2', label: 'Add tag to user' },
  ]
  const [groundhoggConf, setGroundhoggConf] = useState({
    name: 'Groundhogg',
    type: 'Groundhogg',
    token: process.env.NODE_ENV === 'development' ? '42dc55e1864d0fad0332a5b1535490bf' : '',
    public_key: process.env.NODE_ENV === 'development' ? '28d8e58d723a34d1a35bb7e4fed21803' : '',
    secret_key: 'cf9a0967829abed1d465b1a407d7f45a',
    id: '',
    mainAction: '',
    addTagToUser: '',
    emailAddress: '',
    domainName: bits.siteURL,
    showMeta: false,
    field_map: [
      { formField: '', GroundhoggMapField: '' },
    ],
    field_map_meta: [
      { formField: '', GroundhoggMetaMapField: '' },
    ],
    contactsFields,
    contactMetaFields,
    allActions,
    address_field: [],
    actions: {},
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      {/* STEP 1 */}
      <GroundhoggAuthorization
        formID={formID}
        groundhoggConf={groundhoggConf}
        setGroundhoggConf={setGroundhoggConf}
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

export default GroundhoggGlobal
