import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '../../Utilities/Modal'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import ConnectedAppsList from '../ConnectedAppsList'
import { getConnectedAppList } from '../integrationHelper'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NextBtn from '../NextBtn'
import ZohoWorkDriveAuthorization from './ZohoWorkDriveAuthorization'
import ZohoWorkDriveIntegLayout from './ZohoWorkDriveIntegLayout'

function ZohoWorkDrive({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [workDriveConf, setWorkDriveConf] = useState({
    name: 'Zoho WorkDrive API',
    type: 'Zoho WorkDrive',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    team: '',
    folder: '',
    folderMap: [],
    actions: {},
  })

  const connectedWorkDriveApps = getConnectedAppList([workDriveConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${workDriveConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === workDriveConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setWorkDriveConf(draftWorkDriveConf => create(draftWorkDriveConf, tempWorkDriveConf => {
        tempWorkDriveConf.parentAppId = app.id
        tempWorkDriveConf.clientId = appDetails.clientId
        tempWorkDriveConf.clientSecret = appDetails.clientSecret
        tempWorkDriveConf.tokenDetails = appDetails.tokenDetails
        tempWorkDriveConf.dataCenter = appDetails.dataCenter
        tempWorkDriveConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setWorkDriveConf(draftWorkDriveConf => create(draftWorkDriveConf, tempWorkDriveConf => {
      const selectedApp = connectedWorkDriveApps.find(app => app.id === workDriveConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempWorkDriveConf.clientId = appDetails.clientId
        tempWorkDriveConf.clientSecret = appDetails.clientSecret
        tempWorkDriveConf.tokenDetails = appDetails.tokenDetails
        tempWorkDriveConf.dataCenter = appDetails.dataCenter
        tempWorkDriveConf.ownerEmail = appDetails.ownerEmail
      }
    }))
  }, [workDriveConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoWorkDrive')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (workDriveConf.team !== '' && workDriveConf.folder !== '') {
      setStep(3)
    }
  }

  return (
    <div>
      <Modal
        title="Authorize New Zoho WorkDrive App"
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoWorkDriveAuthorization
          formID={formID}
          workDriveConf={workDriveConf}
          setWorkDriveConf={setWorkDriveConf}
          step={step}
          setStep={setStep}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
          authorizedAction={authorizedAction}
        />
      </Modal>

      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2 cal-width"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      {
        (connectedWorkDriveApps.length > 0 && step === 1) && (
          <ConnectedAppsList
            allIntegURL={allIntegURL}
            specificTypes={[workDriveConf.type]}
            onClickAction={authAppCardClickAction}
            allowAddNew
            addNewAction={() => setShowMdl(true)}
          />
        )
      }
      {
        step === 1 && connectedWorkDriveApps.length === 0 && (
          <ZohoWorkDriveAuthorization
            formID={formID}
            workDriveConf={workDriveConf}
            setWorkDriveConf={setWorkDriveConf}
            step={step}
            setStep={setStep}
            isLoading={isLoading}
            setisLoading={setisLoading}
            setSnackbar={setSnackbar}
            authorizedAction={authorizedAction}
          />
        )
      }

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>
        <ZohoWorkDriveIntegLayout
          formID={formID}
          formFields={formFields}
          workDriveConf={workDriveConf}
          setWorkDriveConf={setWorkDriveConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={workDriveConf.team === '' || workDriveConf.folder === ''}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, workDriveConf, history)}
      />
    </div>
  )
}

export default ZohoWorkDrive
