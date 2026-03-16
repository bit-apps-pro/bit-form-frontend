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
import ZohoDeskAuthorization from './ZohoDeskAuthorization'
import { checkMappedFields, handleInput, refreshOrganizations } from './ZohoDeskCommonFunc'
import ZohoDeskIntegLayout from './ZohoDeskIntegLayout'

function ZohoDesk({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()

  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [deskConf, setDeskConf] = useState({
    name: 'Zoho Desk API',
    type: 'Zoho Desk',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    orgId: '',
    department: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    actions: {},
  })

  const connectedDeskApps = getConnectedAppList([deskConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${deskConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === deskConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setDeskConf(draftDeskConf => create(draftDeskConf, tempDeskConf => {
        tempDeskConf.parentAppId = app.id
        tempDeskConf.clientId = appDetails.clientId
        tempDeskConf.clientSecret = appDetails.clientSecret
        tempDeskConf.tokenDetails = appDetails.tokenDetails
        tempDeskConf.dataCenter = appDetails.dataCenter
        tempDeskConf.ownerEmail = appDetails.ownerEmail
      }))
      setstep(2)
    }
  }

  useEffect(() => {
    setDeskConf(draftDeskConf => create(draftDeskConf, tempDeskConf => {
      const selectedApp = connectedDeskApps.find(app => app.id === deskConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempDeskConf.clientId = appDetails.clientId
        tempDeskConf.clientSecret = appDetails.clientSecret
        tempDeskConf.tokenDetails = appDetails.tokenDetails
        tempDeskConf.dataCenter = appDetails.dataCenter
        tempDeskConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (deskConf?.parentAppId) refreshOrganizations(formID, deskConf, setDeskConf, setisLoading, setSnackbar)
  }, [deskConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoDesk')
  }, [])

  const nextPage = (val) => {
    if (val === 3) {
      if (!checkMappedFields(deskConf)) {
        setSnackbar({ show: true, msg: __('Please map mandatory fields') })
        return
      }

      if (!deskConf.actions?.ticket_owner) {
        setSnackbar({ show: true, msg: __('Please select a ticket owner') })
        return
      }

      if (deskConf.department !== '' && deskConf.table !== '' && deskConf.field_map.length > 0) {
        setstep(val)
      }
    } else {
      setstep(val)
      if (val === 2 && !deskConf.department) {
        refreshOrganizations(formID, deskConf, setDeskConf, setisLoading, setSnackbar)
      }
    }
  }

  return (
    <div>
      <Modal
        title={__('Authorize New Zoho Desk App')}
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoDeskAuthorization
          formID={formID}
          deskConf={deskConf}
          setDeskConf={setDeskConf}
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
        (connectedDeskApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[deskConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedDeskApps.length === 0 && (
          <ZohoDeskAuthorization
            formID={formID}
            deskConf={deskConf}
            setDeskConf={setDeskConf}
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
        <ZohoDeskIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, deskConf, setDeskConf, formID, setisLoading, setSnackbar)}
          deskConf={deskConf}
          setDeskConf={setDeskConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={deskConf.department === '' || deskConf.table === '' || deskConf.field_map.length < 1}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, deskConf, history)}
      />
    </div>
  )
}

export default ZohoDesk
