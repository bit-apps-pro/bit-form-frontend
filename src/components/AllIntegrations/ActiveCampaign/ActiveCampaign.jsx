// eslint-disable-next-line import/no-extraneous-dependencies
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
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NextBtn from '../NextBtn'
import ActiveCampaignAuthorization from './ActiveCampaignAuthorization'
import { checkMappedFields, refreshActiveCampaingList } from './ActiveCampaignCommonFunc'
import ActiveCampaignIntegLayout from './ActiveCampaignIntegLayout'

function ActiveCampaign({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [showMdl, setShowMdl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [activeCampaingConf, setActiveCampaingConf] = useState({
    name: 'Active Campaign API',
    type: 'ActiveCampaign',
    api_url: process.env.NODE_ENV === 'development' ? 'https://mdrobiulhasan262020722.activehosted.com' : '',
    api_key: process.env.NODE_ENV === 'development' ? '1291c51ffd0bb1c9a8a2c334c5937a471ebf15991d10f43b1afcb5172b30ef95ed4667bd' : '',
    field_map: [
      { formField: '', activeCampaignField: '' },
    ],
    actions: {},
  })
  const connectedActiveCampainAPIs = getConnectedAppList(['ActiveCampaign'])
  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(activeCampaingConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!activeCampaingConf?.listId) {
        setSnackbar({ show: true, msg: 'Please select list to continue.' })
        return
      }
      if (activeCampaingConf.name !== '' && activeCampaingConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }

  const apiCardClickAction = (app, i) => {
    if (app.integration_type === 'ActiveCampaign') {
      const appDetails = JSON.parse(app.integration_details)
      setActiveCampaingConf(draftCampaingConf => create(draftCampaingConf, tempCampaignConf => {
        tempCampaignConf.parentAppId = app.id
        tempCampaignConf.api_url = appDetails.api_url
        tempCampaignConf.api_key = appDetails.api_key
      }))
      setstep(2)
    }
  }

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${activeCampaingConf.type}`) }, 1000)
    setShowMdl(false)
  }

  useEffect(() => {
    setActiveCampaingConf(draftCampaingConf => create(draftCampaingConf, tempCampaignConf => {
      const selectedApp = connectedActiveCampainAPIs.find(app => app.id === activeCampaingConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempCampaignConf.api_url = appDetails.api_url
        tempCampaignConf.api_key = appDetails.api_key
      }
    }))
    if (activeCampaingConf?.parentAppId) refreshActiveCampaingList(activeCampaingConf, setActiveCampaingConf, setIsLoading, setSnackbar)
  }, [activeCampaingConf.parentAppId])

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <Modal
        title={__('Connect New Active Campaing API')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
        <ActiveCampaignAuthorization
          formID={formID}
          activeCampaingConf={activeCampaingConf}
          setActiveCampaingConf={setActiveCampaingConf}
          step={step}
          setstep={setstep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          authorizedAction={authorizedAction}
        />
      </Modal>
      <div className="txt-center w-9 mt-2 cal-width"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      {
        (connectedActiveCampainAPIs.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[activeCampaingConf.type]} onClickAction={apiCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {step === 1 && connectedActiveCampainAPIs.length === 0 && (
        <ActiveCampaignAuthorization
          formID={formID}
          activeCampaingConf={activeCampaingConf}
          setActiveCampaingConf={setActiveCampaingConf}
          step={step}
          setstep={setstep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          authorizedAction={authorizedAction}
        />
      )}

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, minHeight: step === 2 && `${900}px` }}>

        <ActiveCampaignIntegLayout
          formID={formID}
          formFields={formFields}
          activeCampaingConf={activeCampaingConf}
          setActiveCampaingConf={setActiveCampaingConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          setShowMdl={setShowMdl}
        />
        {/* <button
          onClick={() => nextPage(3)}
          disabled={!activeCampaingConf?.listId || activeCampaingConf.field_map.length < 1}
          className={`${css(app.btn)} f-right btcd-btn-lg green sh-sm flx`}
          type="button"
        >
          {__('Next')}
          {' '}
          &nbsp;
          <BackIcn className="ml-1 rev-icn" />
        </button> */}
        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={!activeCampaingConf?.listId || activeCampaingConf.field_map.length < 1}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, activeCampaingConf, history)}
      />
    </div>
  )
}

export default ActiveCampaign
