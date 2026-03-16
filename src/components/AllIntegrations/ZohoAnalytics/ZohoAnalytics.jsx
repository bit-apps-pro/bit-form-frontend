import { create } from 'mutative'
import { useEffect, useState } from 'react'
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
import ZohoAnalyticsAuthorization from './ZohoAnalyticsAuthorization'
import { handleInput, refreshWorkspaces } from './ZohoAnalyticsCommonFunc'
import ZohoAnalyticsIntegLayout from './ZohoAnalyticsIntegLayout'

export default function ZohoAnalytics({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showMdl, setShowMdl] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [analyticsConf, setAnalyticsConf] = useState({
    name: 'Zoho Analytics API',
    type: 'Zoho Analytics',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    actions: {},
  })

  const connectedAnalyticsApps = getConnectedAppList([analyticsConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${analyticsConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === analyticsConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setAnalyticsConf(draftAnalyticConf => create(draftAnalyticConf, tempAnalyticsConf => {
        tempAnalyticsConf.parentAppId = app.id
        tempAnalyticsConf.clientId = appDetails.clientId
        tempAnalyticsConf.clientSecret = appDetails.clientSecret
        tempAnalyticsConf.tokenDetails = appDetails.tokenDetails
        tempAnalyticsConf.dataCenter = appDetails.dataCenter
        tempAnalyticsConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setAnalyticsConf(draftAnalyticsConf => create(draftAnalyticsConf, tempAnayticsConf => {
      const selectedApp = connectedAnalyticsApps.find(app => app.id === analyticsConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempAnayticsConf.clientId = appDetails.clientId
        tempAnayticsConf.clientSecret = appDetails.clientSecret
        tempAnayticsConf.tokenDetails = appDetails.tokenDetails
        tempAnayticsConf.dataCenter = appDetails.dataCenter
        tempAnayticsConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (analyticsConf?.parentAppId) refreshWorkspaces(formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar)
  }, [analyticsConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoAnalytics')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (analyticsConf.workspace !== '' && analyticsConf.table !== '' && analyticsConf.field_map.length > 0) {
      setStep(3)
    }
  }

  return (
    <div>

      <Modal
        title={__('Authorize New Zoho Analytics App')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
        <ZohoAnalyticsAuthorization
          formID={formID}
          analyticsConf={analyticsConf}
          setAnalyticsConf={setAnalyticsConf}
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
        (connectedAnalyticsApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[analyticsConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedAnalyticsApps.length === 0 && (
          <ZohoAnalyticsAuthorization
            formID={formID}
            analyticsConf={analyticsConf}
            setAnalyticsConf={setAnalyticsConf}
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
        <ZohoAnalyticsIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, analyticsConf, setAnalyticsConf, formID, setisLoading, setSnackbar)}
          analyticsConf={analyticsConf}
          setAnalyticsConf={setAnalyticsConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage()}
          disabled={analyticsConf.workspace === '' || analyticsConf.table === '' || analyticsConf.field_map.length < 1}
        />

        {/* <button
          onClick={nextPage}
          disabled={analyticsConf.workspace === '' || analyticsConf.table === '' || analyticsConf.field_map.length < 1}
          className={`${css(app.btn)} f-right btcd-btn-lg green sh-sm flx`}
          type="button"
        >
          {__('Next')}
          <BackIcn className="ml-1 rev-icn" />
        </button> */}
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, analyticsConf, history)}
      />
    </div>
  )
}
