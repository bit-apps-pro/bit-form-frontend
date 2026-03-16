/* eslint-disable no-unused-expressions */
import { __ } from '@wordpress/i18n'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'

import Modal from '../../Utilities/Modal'
import ConnectedAppsList from '../ConnectedAppsList'
import { getConnectedAppList } from '../integrationHelper'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NextBtn from '../NextBtn'
import OneDriveAuthorization from './OneDriveAuthorization'
import { getAllOneDriveFolders } from './OneDriveCommonFunc'
import OneDriveIntegLayout from './OneDriveIntegLayout'

function OneDrive({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showMdl, setShowMdl] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const [oneDriveConf, setOneDriveConf] = useState({
    name: 'OneDrive',
    type: 'OneDrive',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '' : '',
    field_map: [{ formField: '', OneDriveFormField: '' }],
    folder: '',
    folderMap: [],
    foldersList: [],
    actions: {},
  })
  const connectedOneDriveApps = getConnectedAppList([oneDriveConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${oneDriveConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === oneDriveConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setOneDriveConf(draftoneDriveConf => create(draftoneDriveConf, tempOneDriveConf => {
        tempOneDriveConf.parentAppId = app.id
        tempOneDriveConf.clientId = appDetails.clientId
        tempOneDriveConf.clientSecret = appDetails.clientSecret
        tempOneDriveConf.tokenDetails = appDetails.tokenDetails
      }))
      setStep(2)
    }
  }

  useEffect(() => {
    setOneDriveConf(draftOneDriveConf => create(draftOneDriveConf, tempOneDriveConf => {
      const selectedApp = connectedOneDriveApps.find(app => app.id === oneDriveConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempOneDriveConf.clientId = appDetails.clientId
        tempOneDriveConf.clientSecret = appDetails.clientSecret
        tempOneDriveConf.tokenDetails = appDetails.tokenDetails
      }
    }))
    if (oneDriveConf?.parentAppId) getAllOneDriveFolders(formID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar)
  }, [oneDriveConf.parentAppId])

  useEffect(() => {
    window.opener && setGrantTokenResponse('oneDrive')
  }, [])

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, oneDriveConf, history)
  }

  return (
    <div>
      <Modal
        title={__('Authorize New One Drive App')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
        <OneDriveAuthorization
          formID={formID}
          oneDriveConf={oneDriveConf}
          setOneDriveConf={setOneDriveConf}
          step={step}
          setStep={setStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          authorizedAction={authorizedAction}
        />
      </Modal>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2 cal-width">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      {
        (connectedOneDriveApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[oneDriveConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedOneDriveApps.length === 0 && (
          <OneDriveAuthorization
            formID={formID}
            oneDriveConf={oneDriveConf}
            setOneDriveConf={setOneDriveConf}
            step={step}
            setStep={setStep}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSnackbar={setSnackbar}
            authorizedAction={authorizedAction}
          />
        )
      }

      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: `${100}%`,
            overflow: 'visible',
          }),
        }}
      >
        <OneDriveIntegLayout
          formID={formID}
          formFields={formFields}
          oneDriveConf={oneDriveConf}
          setOneDriveConf={setOneDriveConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          setShowMdl={setShowMdl}
        />

        <NextBtn
          nextPageHandler={() => setStep(3)}
          disabled={!oneDriveConf.actions.attachments || !oneDriveConf.folder}
        />
        {/* <button
          onClick={() => setStep(3)}
          disabled={!oneDriveConf.actions.attachments || !oneDriveConf.folder}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next')}
          {' '}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button> */}
      </div>
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
      />
    </div>
  )
}

export default OneDrive
