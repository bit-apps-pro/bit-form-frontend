import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import MailChimpAuthorization from './MailChimpAuthorization'
import { setGrantTokenResponse } from './MailChimpCommonFunc'

function MailChimpGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const { css } = useFela()
  const [sheetConf, setSheetConf] = useState({
    name: 'Mail Chimp API',
    type: 'Mail Chimp',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    listId: '',
    listName: '',
    tags: '',
    field_map: [
      { formField: '', mailChimpField: '' },
    ],
    address_field: [],
    actions: {},
  })

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }
  useEffect(() => {
    window.opener && setGrantTokenResponse('mailChimp')
  }, [])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      {/* STEP 1 */}
      <MailChimpAuthorization
        formID={formID}
        sheetConf={sheetConf}
        setSheetConf={setSheetConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
        allIntegURL={allIntegURL}
        authorizedAction={authorizedAction}
      />

    </div>
  )
}

export default MailChimpGlobal
