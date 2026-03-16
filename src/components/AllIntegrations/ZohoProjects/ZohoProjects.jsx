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
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NextBtn from '../NextBtn'
import ZohoProjectsAuthorization from './ZohoProjectsAuthorization'
import { checkAllRequired, handleInput, refreshPortals } from './ZohoProjectsCommonFunc'
import ZohoProjectsIntegLayout from './ZohoProjectsIntegLayout'

function ZohoProjects({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
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

  const connectedProjectsApps = getConnectedAppList([projectsConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${projectsConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === projectsConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setProjectsConf(draftProjectsConf => create(draftProjectsConf, tempProjectsConf => {
        tempProjectsConf.parentAppId = app.id
        tempProjectsConf.clientId = appDetails.clientId
        tempProjectsConf.clientSecret = appDetails.clientSecret
        tempProjectsConf.tokenDetails = appDetails.tokenDetails
        tempProjectsConf.dataCenter = appDetails.dataCenter
        tempProjectsConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setProjectsConf(draftProjectsConf => create(draftProjectsConf, tempProjectsConf => {
      const selectedApp = connectedProjectsApps.find(app => app.id === projectsConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempProjectsConf.clientId = appDetails.clientId
        tempProjectsConf.clientSecret = appDetails.clientSecret
        tempProjectsConf.tokenDetails = appDetails.tokenDetails
        tempProjectsConf.dataCenter = appDetails.dataCenter
        tempProjectsConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (projectsConf?.parentAppId) refreshPortals(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)
  }, [projectsConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoProjects')
  }, [])

  const nextPage = (val) => {
    if (val === 3) {
      if (!checkAllRequired(projectsConf, setSnackbar)) {
        setSnackbar({ show: true, msg: __('Please map mandatory fields') })
        return
      }
      setStep(3)
    }
  }

  return (
    <div>
      <Modal
        title="Authorize New Zoho Projects App"
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoProjectsAuthorization
          formID={formID}
          projectsConf={projectsConf}
          setProjectsConf={setProjectsConf}
          step={step}
          setStep={setStep}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
          authorizedAction={authorizedAction}
        />
      </Modal>

      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2 cal-width">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      {
        (connectedProjectsApps.length > 0 && step === 1) && (
          <ConnectedAppsList
            allIntegURL={allIntegURL}
            specificTypes={[projectsConf.type]}
            onClickAction={authAppCardClickAction}
            allowAddNew
            addNewAction={() => setShowMdl(true)}
          />
        )
      }
      {
        step === 1 && connectedProjectsApps.length === 0 && (
          <ZohoProjectsAuthorization
            formID={formID}
            projectsConf={projectsConf}
            setProjectsConf={setProjectsConf}
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
        <ZohoProjectsIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, projectsConf, setProjectsConf, formID, setisLoading, setSnackbar)}
          projectsConf={projectsConf}
          setProjectsConf={setProjectsConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />
        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={projectsConf.portalId === '' || projectsConf.event === ''}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, projectsConf, history)}
      />
    </div>
  )
}

export default ZohoProjects
