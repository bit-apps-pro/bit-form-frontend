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
import ZohoMarketingHubAuthorization from './ZohoMarketingHubAuthorization'
import { checkMappedFields, handleInput, refreshLists } from './ZohoMarketingHubCommonFunc'
import ZohoMarketingHubIntegLayout from './ZohoMarketingHubIntegLayout'

function ZohoMarketingHub({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [marketingHubConf, setMarketingHubConf] = useState({
    name: 'Zoho Marketing Hub API',
    type: 'Zoho Marketing Hub',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    list: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
  })

  const connectedMarketingHubApps = getConnectedAppList([marketingHubConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${marketingHubConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === marketingHubConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setMarketingHubConf(draftMarketingHubConf => create(draftMarketingHubConf, tempMarketingHubConf => {
        tempMarketingHubConf.parentAppId = app.id
        tempMarketingHubConf.clientId = appDetails.clientId
        tempMarketingHubConf.clientSecret = appDetails.clientSecret
        tempMarketingHubConf.tokenDetails = appDetails.tokenDetails
        tempMarketingHubConf.dataCenter = appDetails.dataCenter
        tempMarketingHubConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setMarketingHubConf(draftMarketingHubConf => create(draftMarketingHubConf, tempMarketingHubConf => {
      const selectedApp = connectedMarketingHubApps.find(app => app.id === marketingHubConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempMarketingHubConf.clientId = appDetails.clientId
        tempMarketingHubConf.clientSecret = appDetails.clientSecret
        tempMarketingHubConf.tokenDetails = appDetails.tokenDetails
        tempMarketingHubConf.dataCenter = appDetails.dataCenter
        tempMarketingHubConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (marketingHubConf?.parentAppId) refreshLists(formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar)
  }, [marketingHubConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoMarketingHub')
  }, [])

  const nextPage = (val) => {
    if (val === 3) {
      if (!checkMappedFields(marketingHubConf)) {
        setSnackbar({ show: true, msg: __('Please map mandatory fields') })
        return
      }

      if (marketingHubConf.list !== '' && marketingHubConf.field_map.length > 0) {
        setStep(val)
      }
    } else {
      setStep(val)
      if (val === 2 && !marketingHubConf.list) {
        refreshLists(formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar)
      }
    }
  }

  return (
    <div>
      <Modal
        title="Authorize New Zoho Marketing Hub App"
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoMarketingHubAuthorization
          formID={formID}
          marketingHubConf={marketingHubConf}
          setMarketingHubConf={setMarketingHubConf}
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
        (connectedMarketingHubApps.length > 0 && step === 1) && (
          <ConnectedAppsList
            allIntegURL={allIntegURL}
            specificTypes={[marketingHubConf.type]}
            onClickAction={authAppCardClickAction}
            allowAddNew
            addNewAction={() => setShowMdl(true)}
          />
        )
      }
      {
        step === 1 && connectedMarketingHubApps.length === 0 && (
          <ZohoMarketingHubAuthorization
            formID={formID}
            marketingHubConf={marketingHubConf}
            setMarketingHubConf={setMarketingHubConf}
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
        <ZohoMarketingHubIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar)}
          marketingHubConf={marketingHubConf}
          setMarketingHubConf={setMarketingHubConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={marketingHubConf.list === '' || marketingHubConf.table === '' || marketingHubConf.field_map.length < 1}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, marketingHubConf, history)}
      />
    </div>
  )
}

export default ZohoMarketingHub
