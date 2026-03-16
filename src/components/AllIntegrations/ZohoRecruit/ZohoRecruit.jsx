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
import ZohoRecruitAuthorization from './ZohoRecruitAuthorization'
import { checkMappedFields, handleInput, refreshModules } from './ZohoRecruitCommonFunc'
import ZohoRecruitIntegLayout from './ZohoRecruitIntegLayout'

function ZohoRecruit({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setisLoading] = useState(false)
  const [showMdl, setShowMdl] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  const [recruitConf, setRecruitConf] = useState({
    name: 'Zoho Recruit API',
    type: 'Zoho Recruit',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    module: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    relatedlists: [],
    actions: {},
  })

  const connectedRecruitApps = getConnectedAppList([recruitConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${recruitConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === recruitConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setRecruitConf(draftRecruitConf => create(draftRecruitConf, tempRecruitConf => {
        tempRecruitConf.parentAppId = app.id
        tempRecruitConf.clientId = appDetails.clientId
        tempRecruitConf.clientSecret = appDetails.clientSecret
        tempRecruitConf.tokenDetails = appDetails.tokenDetails
        tempRecruitConf.dataCenter = appDetails.dataCenter
        tempRecruitConf.ownerEmail = appDetails.ownerEmail
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setRecruitConf(draftRecruitConf => create(draftRecruitConf, tempRecruitConf => {
      const selectedApp = connectedRecruitApps.find(app => app.id === recruitConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempRecruitConf.clientId = appDetails.clientId
        tempRecruitConf.clientSecret = appDetails.clientSecret
        tempRecruitConf.tokenDetails = appDetails.tokenDetails
        tempRecruitConf.dataCenter = appDetails.dataCenter
        tempRecruitConf.ownerEmail = appDetails.ownerEmail
      }
    }))
    if (recruitConf?.parentAppId) refreshModules(formID, recruitConf, setRecruitConf, setisLoading, setSnackbar)
  }, [recruitConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoRecruit')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(recruitConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }
    if (recruitConf.module !== '' && recruitConf.field_map.length > 0) {
      setStep(3)
    }
  }

  return (
    <div>
      <Modal
        title="Authorize New Zoho Recruit App"
        show={showMdl}
        setModal={() => setShowMdl(false)}
      >
        <ZohoRecruitAuthorization
          formID={formID}
          recruitConf={recruitConf}
          setRecruitConf={setRecruitConf}
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
        (connectedRecruitApps.length > 0 && step === 1) && (
          <ConnectedAppsList
            allIntegURL={allIntegURL}
            specificTypes={[recruitConf.type]}
            onClickAction={authAppCardClickAction}
            allowAddNew
            addNewAction={() => setShowMdl(true)}
          />
        )
      }
      {
        step === 1 && connectedRecruitApps.length === 0 && (
          <ZohoRecruitAuthorization
            formID={formID}
            recruitConf={recruitConf}
            setRecruitConf={setRecruitConf}
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
        <ZohoRecruitIntegLayout
          tab={tab}
          settab={settab}
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, tab, recruitConf, setRecruitConf, formID, setisLoading, setSnackbar)}
          recruitConf={recruitConf}
          setRecruitConf={setRecruitConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
        />

        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={recruitConf.module === '' || recruitConf.field_map.length < 1}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, recruitConf, history)}
      />
    </div>
  )
}

export default ZohoRecruit
