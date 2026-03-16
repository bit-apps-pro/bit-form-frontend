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
import ZohoMailAuthorization from './ZohoMailAuthorization'
import ZohoMailIntegLayout from './ZohoMailIntegLayout'

function ZohoMail({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [mailConf, setMailConf] = useState({
    name: 'Zoho Mail API',
    type: 'Zoho Mail',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    actions: {},
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  })

  const connectedMailApps = getConnectedAppList([mailConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${mailConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === mailConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setMailConf(draftMailConf => create(draftMailConf, tempMailConf => {
        tempMailConf.parentAppId = app.id
        tempMailConf.clientId = appDetails.clientId
        tempMailConf.clientSecret = appDetails.clientSecret
        tempMailConf.tokenDetails = appDetails.tokenDetails
        tempMailConf.dataCenter = appDetails.dataCenter
        tempMailConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setMailConf(draftMailConf => create(draftMailConf, tempMailConf => {
      const selectedApp = connectedMailApps.find(app => app.id === mailConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempMailConf.clientId = appDetails.clientId
        tempMailConf.clientSecret = appDetails.clientSecret
        tempMailConf.tokenDetails = appDetails.tokenDetails
        tempMailConf.dataCenter = appDetails.dataCenter
        tempMailConf.ownerEmail = appDetails.ownerEmail
      }
    }))
  }, [mailConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoMail')
  }, [])

  const nextPage = (val) => {
    setStep(val)
  }

  return (
    <div>
      <Modal
        title="Authorize New Zoho Mail App"
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoMailAuthorization
          formID={formID}
          mailConf={mailConf}
          setMailConf={setMailConf}
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
        (connectedMailApps.length > 0 && step === 1) && (
          <ConnectedAppsList
            allIntegURL={allIntegURL}
            specificTypes={[mailConf.type]}
            onClickAction={authAppCardClickAction}
            allowAddNew
            addNewAction={() => setShowMdl(true)}
          />
        )
      }
      {
        step === 1 && connectedMailApps.length === 0 && (
          <ZohoMailAuthorization
            formID={formID}
            mailConf={mailConf}
            setMailConf={setMailConf}
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
        <ZohoMailIntegLayout
          formFields={formFields}
          mailConf={mailConf}
          setMailConf={setMailConf}
        />
        <NextBtn nextPageHandler={() => nextPage(3)} />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, mailConf, history)}
      />
    </div>
  )
}

export default ZohoMail
