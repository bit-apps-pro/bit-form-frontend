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
import ZohoCRMAuthorization from './ZohoCRMAuthorization'
import { checkMappedFields, handleInput, refreshModules } from './ZohoCRMCommonFunc'
import ZohoCRMIntegLayout from './ZohoCRMIntegLayout'

function ZohoCRM({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)

  const [crmConf, setCrmConf] = useState({
    name: 'Zoho CRM API',
    type: 'Zoho CRM',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    module: '',
    layout: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    relatedlists: [],
    actions: {},
  })

  const connectedCRMApps = getConnectedAppList([crmConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${crmConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === crmConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setCrmConf(draftCrmConf => create(draftCrmConf, tempCrmConf => {
        tempCrmConf.parentAppId = app.id
        tempCrmConf.clientId = appDetails.clientId
        tempCrmConf.clientSecret = appDetails.clientSecret
        tempCrmConf.tokenDetails = appDetails.tokenDetails
        tempCrmConf.dataCenter = appDetails.dataCenter
        tempCrmConf.ownerEmail = appDetails.ownerEmail
      }))
      setstep(2)
    }
  }

  useEffect(() => {
    setCrmConf(draftCrmConf => create(draftCrmConf, tempCrmConf => {
      const selectedApp = connectedCRMApps.find(app => app.id === crmConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempCrmConf.clientId = appDetails.clientId
        tempCrmConf.clientSecret = appDetails.clientSecret
        tempCrmConf.tokenDetails = appDetails.tokenDetails
        tempCrmConf.dataCenter = appDetails.dataCenter
        tempCrmConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (crmConf?.parentAppId) refreshModules(formID, crmConf, setCrmConf, setisLoading, setSnackbar)
  }, [crmConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoCRM')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(crmConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }

    if (crmConf.module !== '' && crmConf.layout !== '' && crmConf.field_map.length > 0) {
      setstep(3)
    }
  }

  return (
    <div>
      <Modal
        title={__('Authorize New Zoho CRM App')}
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoCRMAuthorization
          formID={formID}
          crmConf={crmConf}
          setCrmConf={setCrmConf}
          step={step}
          setstep={setstep}
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
        (connectedCRMApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[crmConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedCRMApps.length === 0 && (
          <ZohoCRMAuthorization
            formID={formID}
            crmConf={crmConf}
            setCrmConf={setCrmConf}
            step={step}
            setstep={setstep}
            isLoading={isLoading}
            setisLoading={setisLoading}
            setSnackbar={setSnackbar}
            authorizedAction={authorizedAction}
          />
        )
      }

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>
        <ZohoCRMIntegLayout
          tab={tab}
          settab={settab}
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, tab, crmConf, setCrmConf, formID, setisLoading, setSnackbar)}
          crmConf={crmConf}
          setCrmConf={setCrmConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage()}
          disabled={crmConf.module === '' || crmConf.layout === '' || crmConf.field_map.length < 1}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, crmConf, history)}
      />
    </div>
  )
}

export default ZohoCRM
