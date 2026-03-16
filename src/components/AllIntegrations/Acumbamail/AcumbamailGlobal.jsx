import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import AcumbamailAuthorization from './AcumbamailAuthorization'
import { checkMappedFields } from './AcumbamailCommonFunc'

function AcumbamailGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Add/Update Subscriber' },
    { key: '2', label: 'Delete Subscriber' },
  ]

  const addSubsCriberFields = [
    { key: 'email', label: 'Email', required: true },
  ]
  const [acumbamailConf, setAcumbamailConf] = useState({
    name: 'Acumbamail',
    type: 'Acumbamail',
    mainAction: '',
    listId: '',
    auth_token: process.env.NODE_ENV === 'development' ? '9fc10c9bca34453582ae5c0f5c740c40' : '',
    field_map: [
      { formField: '', acumbamailFormField: 'email' },
    ],
    addSubsCriberFields,
    allActions,
    address_field: [],
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(acumbamailConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (acumbamailConf.listId !== '') {
      setstep(3)
    }
  }

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      {/* <div className="txt-center w-9 mt-2 cal-width"><Steps step={3} active={step} /></div> */}

      {/* STEP 1 */}
      <AcumbamailAuthorization
        formID={formID}
        acumbamailConf={acumbamailConf}
        setAcumbamailConf={setAcumbamailConf}
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

export default AcumbamailGlobal
