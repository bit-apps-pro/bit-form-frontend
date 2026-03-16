import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '../../Utilities/Modal'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import ConnectedAppsList from '../ConnectedAppsList'
import { getConnectedAppList } from '../integrationHelper'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NextBtn from '../NextBtn'
import ZohoSignAuthorization from './ZohoSignAuthorization'
import { refreshTemplates, setGrantTokenResponse } from './ZohoSignCommonFunc'
import ZohoSignIntegLayout from './ZohoSignIntegLayout'

function ZohoSign({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [signConf, setSignConf] = useState({
    name: 'Zoho Sign API',
    type: 'Zoho Sign',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    template: '',
    actions: {},
  })

  const connectedSignApps = getConnectedAppList([signConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${signConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === signConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setSignConf(draftSignConf => create(draftSignConf, tempSignConf => {
        tempSignConf.parentAppId = app.id
        tempSignConf.clientId = appDetails.clientId
        tempSignConf.clientSecret = appDetails.clientSecret
        tempSignConf.tokenDetails = appDetails.tokenDetails
        tempSignConf.dataCenter = appDetails.dataCenter
        tempSignConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setSignConf(draftSignConf => create(draftSignConf, tempSignConf => {
      const selectedApp = connectedSignApps.find(app => app.id === signConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempSignConf.clientId = appDetails.clientId
        tempSignConf.clientSecret = appDetails.clientSecret
        tempSignConf.tokenDetails = appDetails.tokenDetails
        tempSignConf.dataCenter = appDetails.dataCenter
        tempSignConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (signConf.parentAppId) refreshTemplates(formID, signConf, setSignConf, setisLoading, setSnackbar)
  }, [signConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoSign')
  }, [])

  const nextPage = (val) => {
    if (val === 2) {
      if (!signConf?.default?.templates) {
        refreshTemplates(formID, signConf, setSignConf, setisLoading, setSnackbar)
      }
    }
    setStep(val)
  }

  return (
    <div>
      <Modal
        title="Authorize New Zoho Sign App"
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoSignAuthorization
          formID={formID}
          signConf={signConf}
          setSignConf={setSignConf}
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
        (connectedSignApps.length > 0 && step === 1) && (
          <ConnectedAppsList
            allIntegURL={allIntegURL}
            specificTypes={[signConf.type]}
            onClickAction={authAppCardClickAction}
            allowAddNew
            addNewAction={() => setShowMdl(true)}
          />
        )
      }
      {
        step === 1 && connectedSignApps.length === 0 && (
          <ZohoSignAuthorization
            formID={formID}
            signConf={signConf}
            setSignConf={setSignConf}
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
        <ZohoSignIntegLayout
          formID={formID}
          formFields={formFields}
          signConf={signConf}
          setSignConf={setSignConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={signConf.template === ''}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, signConf, history)}
      />
    </div>
  )
}

export default ZohoSign
