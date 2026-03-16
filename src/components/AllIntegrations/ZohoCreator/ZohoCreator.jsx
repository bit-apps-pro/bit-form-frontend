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
import ZohoCreatorAuthorization from './ZohoCreatorAuthorization'
import { checkMappedFields, handleInput, refreshApplications } from './ZohoCreatorCommonFunc'
import ZohoCreatorIntegLayout from './ZohoCreatorIntegLayout'

function ZohoCreator({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [creatorConf, setCreatorConf] = useState({
    name: 'Zoho Creator API',
    type: 'Zoho Creator',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    accountOwner: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    actions: {},
  })

  const connectedCreatorApps = getConnectedAppList([creatorConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${creatorConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === creatorConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setCreatorConf(draftCreatorConf => create(draftCreatorConf, tempCreatorConf => {
        tempCreatorConf.parentAppId = app.id
        tempCreatorConf.clientId = appDetails.clientId
        tempCreatorConf.clientSecret = appDetails.clientSecret
        tempCreatorConf.tokenDetails = appDetails.tokenDetails
        tempCreatorConf.dataCenter = appDetails.dataCenter
        tempCreatorConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setCreatorConf(draftCreatorConf => create(draftCreatorConf, tempCreatorConf => {
      const selectedApp = connectedCreatorApps.find(app => app.id === creatorConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempCreatorConf.clientId = appDetails.clientId
        tempCreatorConf.clientSecret = appDetails.clientSecret
        tempCreatorConf.tokenDetails = appDetails.tokenDetails
        tempCreatorConf.dataCenter = appDetails.dataCenter
        tempCreatorConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (creatorConf?.parentAppId) refreshApplications(formID, creatorConf, setCreatorConf, setisLoading, setSnackbar)
  }, [creatorConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoCreator')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(creatorConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }

    if (creatorConf.accountOwner !== '' && creatorConf.field_map.length > 0) {
      setStep(3)
    }
  }

  return (
    <div>
      <Modal
        title={__('Authorize New Zoho Creator App')}
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoCreatorAuthorization
          formID={formID}
          creatorConf={creatorConf}
          setCreatorConf={setCreatorConf}
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
        (connectedCreatorApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[creatorConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedCreatorApps.length === 0 && (
          <ZohoCreatorAuthorization
            formID={formID}
            creatorConf={creatorConf}
            setCreatorConf={setCreatorConf}
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
        <ZohoCreatorIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, creatorConf, setCreatorConf, formID, setisLoading, setSnackbar)}
          creatorConf={creatorConf}
          setCreatorConf={setCreatorConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage()}
          disabled={creatorConf.accountOwner === '' || creatorConf.field_map.length < 1}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, creatorConf, history)}
      />
    </div>
  )
}

export default ZohoCreator
