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
import ZohoBiginAuthorization from './ZohoBiginAuthorization'
import { handleInput, refreshModules } from './ZohoBiginCommonFunc'
import ZohoBiginIntegLayout from './ZohoBiginIntegLayout'

function ZohoBigin({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  // const scopes = 'ZohoBigin.settings.modules.READ,ZohoBigin.settings.fields.READ,ZohoBigin.settings.tags.READ,ZohoBigin.users.READ,ZohoBigin.modules.ALL'
  const [biginConf, setBiginConf] = useState({
    name: 'Zoho Bigin API',
    type: 'Zoho Bigin',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    module: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    relatedlists: [],
    actions: {},
  })

  const connectedAnalyticsApps = getConnectedAppList([biginConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${biginConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === biginConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setBiginConf(draftBiginConf => create(draftBiginConf, tempBiginConf => {
        tempBiginConf.parentAppId = app.id
        tempBiginConf.clientId = appDetails.clientId
        tempBiginConf.clientSecret = appDetails.clientSecret
        tempBiginConf.tokenDetails = appDetails.tokenDetails
        tempBiginConf.dataCenter = appDetails.dataCenter
        tempBiginConf.ownerEmail = appDetails.ownerEmail
      }))
      setstep(2)
    }
  }

  useEffect(() => {
    setBiginConf(draftbiginConf => create(draftbiginConf, tempBiginConf => {
      const selectedApp = connectedAnalyticsApps.find(app => app.id === biginConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempBiginConf.clientId = appDetails.clientId
        tempBiginConf.clientSecret = appDetails.clientSecret
        tempBiginConf.tokenDetails = appDetails.tokenDetails
        tempBiginConf.dataCenter = appDetails.dataCenter
        tempBiginConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (biginConf?.parentAppId) refreshModules(formID, biginConf, setBiginConf, setisLoading, setSnackbar)
  }, [biginConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoBigin')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (biginConf.module !== '' && biginConf.field_map.length > 0) {
      setstep(3)
    }
  }

  return (
    <div>
      <Modal
        title={__('Authorize New Zoho Bigin App')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
        <ZohoBiginAuthorization
          formID={formID}
          biginConf={biginConf}
          setBiginConf={setBiginConf}
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
        (connectedAnalyticsApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[biginConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedAnalyticsApps.length === 0 && (
          <ZohoBiginAuthorization
            formID={formID}
            biginConf={biginConf}
            setBiginConf={setBiginConf}
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

        <ZohoBiginIntegLayout
          tab={tab}
          settab={settab}
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, tab, biginConf, setBiginConf, formID, setisLoading, setSnackbar)}
          biginConf={biginConf}
          setBiginConf={setBiginConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, biginConf, history)}
      />
    </div>
  )
}

export default ZohoBigin
