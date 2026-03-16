import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import Modal from '../../Utilities/Modal'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import ConnectedAppsList from '../ConnectedAppsList'
import { getConnectedAppList } from '../integrationHelper'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveIntegConfig } from '../IntegrationHelpers/MailChimpIntegrationHelpers'
import NextBtn from '../NextBtn'
import MailChimpAuthorization from './MailChimpAuthorization'
import { checkAddressFieldMapRequired, checkMappedFields, handleInput, refreshAudience, setGrantTokenResponse } from './MailChimpCommonFunc'
import MailChimpIntegLayout from './MailChimpIntegLayout'

function MailChimp({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [showMdl, setShowMdl] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const { css } = useFela()
  const [sheetConf, setSheetConf] = useState({
    name: 'Mail Chimp Integration',
    type: 'Mail Chimp',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    listId: '',
    listName: '',
    tags: '',
    field_map: [
      { formField: '', mailChimpField: '' },
    ],
    address_field: [],
    actions: {},
  })
  const connectedGoogleSheetApps = getConnectedAppList([sheetConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${sheetConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === sheetConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setSheetConf(draftMailConf => create(draftMailConf, tempMailConf => {
        tempMailConf.parentAppId = app.id
        tempMailConf.clientId = appDetails.clientId
        tempMailConf.clientSecret = appDetails.clientSecret
        tempMailConf.tokenDetails = appDetails.tokenDetails
      }))
      setstep(2)
    }
  }

  useEffect(() => {
    setSheetConf(draftMailConf => create(draftMailConf, tempMailConf => {
      const selectedApp = connectedGoogleSheetApps.find(app => app.id === sheetConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempMailConf.clientId = appDetails.clientId
        tempMailConf.clientSecret = appDetails.clientSecret
        tempMailConf.tokenDetails = appDetails.tokenDetails
      }
    }))
    if (sheetConf?.parentAppId) refreshAudience(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)
  }, [sheetConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('mailChimp')
  }, [])
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (sheetConf.actions?.address && !checkAddressFieldMapRequired(sheetConf)) {
      setSnackbar({ show: true, msg: 'Please map address required fields to continue.' })
      return
    }
    if (!checkMappedFields(sheetConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (sheetConf.listId !== '') {
      setstep(3)
    }
  }

  return (
    <div>
      <Modal
        title={__('Authorize New Mailchimp App')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
        <MailChimpAuthorization
          formID={formID}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
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
        (connectedGoogleSheetApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[sheetConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedGoogleSheetApps.length === 0 && (
          <MailChimpAuthorization
            formID={formID}
            sheetConf={sheetConf}
            setSheetConf={setSheetConf}
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

        <MailChimpIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, sheetConf, setSheetConf, formID, setisLoading, setSnackbar)}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
          isLoading={isLoading}
          setisLoading={setisLoading}
          setSnackbar={setSnackbar}
          setShowMdl={setShowMdl}
        />
        <NextBtn
          nextPageHandler={() => nextPage(3)}
          disabled={!sheetConf.listId || sheetConf.field_map.length < 1}
        />

        {/* <button
          onClick={() => nextPage(3)}
          disabled={!sheetConf.listId || sheetConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(integrations, setIntegration, allIntegURL, sheetConf, history)}
      />
    </div>
  )
}

export default MailChimp
