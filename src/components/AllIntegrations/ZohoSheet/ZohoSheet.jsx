import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NextBtn from '../NextBtn'
import ZohoSheetAuthorization from './ZohoSheetAuthorization'
import { handleInput, refreshWorkbooks } from './ZohoSheetCommonFunc'
import ZohoSheetIntegLayout from './ZohoSheetIntegLayout'
import Modal from '../../Utilities/Modal'
import ConnectedAppsList from '../ConnectedAppsList'
import { getConnectedAppList } from '../integrationHelper'

function ZohoSheet({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [sheetConf, setSheetConf] = useState({
    name: 'Zoho Sheet API',
    type: 'Zoho Sheet',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    workbook: '',
    worksheet: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    headerRow: 1,
    actions: {},
  })

  const connectedSheetApps = getConnectedAppList([sheetConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${sheetConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === sheetConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setSheetConf(draftSheetConf => create(draftSheetConf, tempSheetConf => {
        tempSheetConf.parentAppId = app.id
        tempSheetConf.clientId = appDetails.clientId
        tempSheetConf.clientSecret = appDetails.clientSecret
        tempSheetConf.tokenDetails = appDetails.tokenDetails
        tempSheetConf.dataCenter = appDetails.dataCenter
        tempSheetConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setSheetConf(draftSheetConf => create(draftSheetConf, tempSheetConf => {
      const selectedApp = connectedSheetApps.find(app => app.id === sheetConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempSheetConf.clientId = appDetails.clientId
        tempSheetConf.clientSecret = appDetails.clientSecret
        tempSheetConf.tokenDetails = appDetails.tokenDetails
        tempSheetConf.dataCenter = appDetails.dataCenter
        tempSheetConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (sheetConf.parentAppId) refreshWorkbooks(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)
  }, [sheetConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoSheet')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (sheetConf.workbook !== '' && sheetConf.worksheet !== '' && sheetConf.field_map.length > 0) {
      setStep(3)
    }
  }

  return (
    <div>
      <Modal
        title="Authorize New Zoho Sheet App"
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoSheetAuthorization
          formID={formID}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
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
        (connectedSheetApps.length > 0 && step === 1) && (
          <ConnectedAppsList
            allIntegURL={allIntegURL}
            specificTypes={[sheetConf.type]}
            onClickAction={authAppCardClickAction}
            allowAddNew
            addNewAction={() => setShowMdl(true)}
          />
        )
      }
      {
        step === 1 && connectedSheetApps.length === 0 && (
          <ZohoSheetAuthorization
            formID={formID}
            sheetConf={sheetConf}
            setSheetConf={setSheetConf}
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
        <ZohoSheetIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, sheetConf, setSheetConf, formID, setisLoading, setSnackbar)}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={sheetConf.workbook === '' || sheetConf.worksheet === '' || sheetConf.field_map.length < 1}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, sheetConf, history)}
      />
    </div>
  )
}

export default ZohoSheet
