/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import ut from '../../../styles/2.utilities'
import { __ } from '../../../Utils/i18nwrap'
import Btn from '../../Utilities/Btn'
import Modal from '../../Utilities/Modal'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import ConnectedAppsList from '../ConnectedAppsList'
import { getConnectedAppList } from '../integrationHelper'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/GoogleIntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import GoogleSheetAuthorization from './GoogleSheetAuthorization'
import { checkMappedFields, handleInput, refreshSpreadsheets } from './GoogleSheetCommonFunc'
import GoogleSheetIntegLayout from './GoogleSheetIntegLayout'

function GoogleSheet({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [showMdl, setShowMdl] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [step, setstep] = useState(1)
  const { css } = useFela()
  const [snack, setSnackbar] = useState({ show: false })
  const [sheetConf, setSheetConf] = useState({
    name: 'Google Sheet API',
    type: 'Google Sheet',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    spreadsheetId: '',
    worksheetName: '',
    field_map: [
      { formField: '', googleSheetField: '' },
    ],
    header: 'ROWS',
    headerRow: 'A1',
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
      setSheetConf(draftSheetConf => create(draftSheetConf, tempSheetConf => {
        tempSheetConf.parentAppId = app.id
        tempSheetConf.clientId = appDetails.clientId
        tempSheetConf.clientSecret = appDetails.clientSecret
        tempSheetConf.tokenDetails = appDetails.tokenDetails
      }))
      setstep(2)
    }
  }

  useEffect(() => {
    setSheetConf(draftSheetConf => create(draftSheetConf, tempSheetConf => {
      const selectedApp = connectedGoogleSheetApps.find(app => app.id === sheetConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempSheetConf.clientId = appDetails.clientId
        tempSheetConf.clientSecret = appDetails.clientSecret
        tempSheetConf.tokenDetails = appDetails.tokenDetails
      }
    }))
    if (sheetConf?.parentAppId) refreshSpreadsheets(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)
  }, [sheetConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('googleSheet')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(sheetConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (sheetConf.spreadsheetId !== '' && sheetConf.worksheetName !== '' && sheetConf.field_map.length > 0) {
      setstep(3)
    }
  }

  return (
    <div>

      <Modal
        title={__('Authorize New Google App')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
        <GoogleSheetAuthorization
          formID={formID}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
          step={step}
          setstep={setstep}
          setSnackbar={setSnackbar}
          isLoading={isLoading}
          setisLoading={setisLoading}
          allIntegURL={allIntegURL}
          authorizedAction={authorizedAction}
        />
      </Modal>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2 cal-width">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      {
        (connectedGoogleSheetApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[sheetConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedGoogleSheetApps.length === 0 && (
          <GoogleSheetAuthorization
            formID={formID}
            sheetConf={sheetConf}
            setSheetConf={setSheetConf}
            step={step}
            setstep={setstep}
            setSnackbar={setSnackbar}
            isLoading={isLoading}
            setisLoading={setisLoading}
            allIntegURL={allIntegURL}
            authorizedAction={authorizedAction}
          />
        )
      }

      {/* <GoogleSheetAuthorization
        formID={formID}
        sheetConf={sheetConf}
        setSheetConf={setSheetConf}
        step={step}
        setstep={setstep}
        setSnackbar={setSnackbar}
        isLoading={isLoading}
        setisLoading={setisLoading}
      /> */}

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>

        <GoogleSheetIntegLayout
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
        {/* {console.log(sheetConf.spreadsheetId, sheetConf.worksheetName, sheetConf.field_map)} */}
        <Btn
          onClick={() => nextPage(3)}
          disabled={!sheetConf.spreadsheetId || !sheetConf.worksheetName || sheetConf.field_map.length < 1}
          className={css(ut.ftRight)}
        >
          {__('Next')}
          <BackIcn className="ml-1 rev-icn" />
        </Btn>
        {/* <button
          onClick={() => nextPage(3)}
          disabled={!sheetConf.spreadsheetId || !sheetConf.worksheetName || sheetConf.field_map.length < 1}
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

export default GoogleSheet
