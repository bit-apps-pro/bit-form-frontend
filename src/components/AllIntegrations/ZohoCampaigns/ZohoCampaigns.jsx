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
import ZohoCampaignsAuthorization from './ZohoCampaignsAuthorization'
import { checkMappedFields, handleInput, refreshLists } from './ZohoCampaignsCommonFunc'
import ZohoCampaignsIntegLayout from './ZohoCampaignsIntegLayout'

function ZohoCampaigns({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [campaignsConf, setCampaignsConf] = useState({
    name: 'Zoho Campaigns API',
    type: 'Zoho Campaigns',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    list: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
  })

  const connectedCampaignsApps = getConnectedAppList([campaignsConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${campaignsConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === campaignsConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setCampaignsConf(draftCampaignsConf => create(draftCampaignsConf, tempCampaignsConf => {
        tempCampaignsConf.parentAppId = app.id
        tempCampaignsConf.clientId = appDetails.clientId
        tempCampaignsConf.clientSecret = appDetails.clientSecret
        tempCampaignsConf.tokenDetails = appDetails.tokenDetails
        tempCampaignsConf.dataCenter = appDetails.dataCenter
        tempCampaignsConf.ownerEmail = appDetails.ownerEmail
      }))
      setstep(2)
    }
  }

  useEffect(() => {
    setCampaignsConf(draftCampaignsConf => create(draftCampaignsConf, tempCampaignsConf => {
      const selectedApp = connectedCampaignsApps.find(app => app.id === campaignsConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempCampaignsConf.clientId = appDetails.clientId
        tempCampaignsConf.clientSecret = appDetails.clientSecret
        tempCampaignsConf.tokenDetails = appDetails.tokenDetails
        tempCampaignsConf.dataCenter = appDetails.dataCenter
        tempCampaignsConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (campaignsConf?.parentAppId) refreshLists(formID, campaignsConf, setCampaignsConf, setisLoading, setSnackbar)
  }, [campaignsConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoCampaigns')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(campaignsConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }

    if (campaignsConf.list !== '' && campaignsConf.table !== '' && campaignsConf.field_map.length > 0) {
      setstep(3)
    }
  }

  return (
    <div>
      <Modal
        title={__('Authorize New Zoho Campaigns App')}
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoCampaignsAuthorization
          formID={formID}
          campaignsConf={campaignsConf}
          setCampaignsConf={setCampaignsConf}
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
        (connectedCampaignsApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[campaignsConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedCampaignsApps.length === 0 && (
          <ZohoCampaignsAuthorization
            formID={formID}
            campaignsConf={campaignsConf}
            setCampaignsConf={setCampaignsConf}
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
        <ZohoCampaignsIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, formID, campaignsConf, setCampaignsConf, setisLoading, setSnackbar)}
          campaignsConf={campaignsConf}
          setCampaignsConf={setCampaignsConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={campaignsConf.list === '' || campaignsConf.table === '' || campaignsConf.field_map.length < 1}
        />
        {/* <button
          onClick={() => nextPage(3)}
          disabled={campaignsConf.list === '' || campaignsConf.table === '' || campaignsConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, campaignsConf, history)}
      />
    </div>
  )
}

export default ZohoCampaigns
