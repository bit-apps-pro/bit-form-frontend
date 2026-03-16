import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import Modal from '../../Utilities/Modal'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import ConnectedAppsList from '../ConnectedAppsList'
import { getConnectedAppList } from '../integrationHelper'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NextBtn from '../NextBtn'
import AcumbamailAuthorization from './AcumbamailAuthorization'
import { checkMappedFields, fetchAllList, handleInput } from './AcumbamailCommonFunc'
import AcumbamailIntegLayout from './AcumbamailIntegLayout'

function Acumbamail({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [showMdl, setShowMdl] = useState(false)
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
  const connectedAccumbaMailAPIs = getConnectedAppList([acumbamailConf.type])

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

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, acumbamailConf, history)
  }

  const apiCardClickAction = (app, i) => {
    if (app.integration_type === acumbamailConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setAcumbamailConf(draftMailConf => create(draftMailConf, tempMailConf => {
        tempMailConf.parentAppId = app.id
        tempMailConf.auth_token = appDetails.auth_token
      }))
      setstep(2)
    }
  }

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${acumbamailConf.type}`) }, 1000)
    setShowMdl(false)
  }

  useEffect(() => {
    setAcumbamailConf(draftMailConf => create(draftMailConf, tempMailConf => {
      const selectedApp = connectedAccumbaMailAPIs.find(app => app.id === acumbamailConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempMailConf.auth_token = appDetails.auth_token
      }
    }))
    if (acumbamailConf?.parentAppId) fetchAllList(acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar)
  }, [acumbamailConf.parentAppId])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2 cal-width"><Steps step={3} active={step} /></div>
      <Modal
        title={__('Connect New Active Campaing API')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
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
      </Modal>
      {/* STEP 1 */}
      {
        (connectedAccumbaMailAPIs.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[acumbamailConf.type]} onClickAction={apiCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {step === 1 && connectedAccumbaMailAPIs.length === 0 && (
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
      )}

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}
      >
        <AcumbamailIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar, formID)}
          acumbamailConf={acumbamailConf}
          setAcumbamailConf={setAcumbamailConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          setShowMdl={setShowMdl}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={!acumbamailConf.mainAction || !checkMappedFields(acumbamailConf)}
        />
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
      />

    </div>
  )
}

export default Acumbamail
