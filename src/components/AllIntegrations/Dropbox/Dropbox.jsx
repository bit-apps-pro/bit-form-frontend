/* eslint-disable no-unused-expressions */
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
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import DropboxAuthorization from './DropboxAuthorization'
import { getAllDropboxFolders } from './DropboxCommonFunc'
import DropboxIntegLayout from './DropboxIntegLayout'

function Dropbox({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { formID } = useParams()
  const [showMdl, setShowMdl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const { css } = useFela()

  const [dropboxConf, setDropboxConf] = useState({
    name: 'Dropbox Integration',
    type: 'Dropbox',
    apiKey: process.env.NODE_ENV === 'development' ? 'jkuaskbflscbbh2' : '',
    apiSecret: process.env.NODE_ENV === 'development' ? 'k4mvl6n0u7ll7ll' : '',
    accessCode: '',
    field_map: [{ formField: '', dropboxFormField: '' }],
    foldersList: [],
    actions: {},
  })

  const connectedDropboxApps = getConnectedAppList([dropboxConf.type])

  const authorizedAction = () => {
    setTimeout(() => { history(`${allIntegURL}/new/${dropboxConf.type}`) }, 1000)
    setShowMdl(false)
  }

  const authAppCardClickAction = (app, i) => {
    if (app.integration_type === dropboxConf.type) {
      const appDetails = JSON.parse(app.integration_details)
      setDropboxConf(draftDropboxConf => create(draftDropboxConf, tempDropboxConf => {
        tempDropboxConf.parentAppId = app.id
        tempDropboxConf.apiKey = appDetails.apiKey
        tempDropboxConf.apiSecret = appDetails.apiSecret
        tempDropboxConf.tokenDetails = appDetails.tokenDetails
      }))
      setStep(2)
    }
  }

  const saveConfig = () => {
    saveIntegConfig(integrations, setIntegration, allIntegURL, dropboxConf, history)
  }

  useEffect(() => {
    setDropboxConf(draftDropboxConf => create(draftDropboxConf, tempDropboxConf => {
      const selectedApp = connectedDropboxApps.find(app => app.id === dropboxConf.parentAppId)
      if (selectedApp) {
        const appDetails = JSON.parse(selectedApp.integration_details)
        tempDropboxConf.apiKey = appDetails.apiKey
        tempDropboxConf.apiSecret = appDetails.apiSecret
        tempDropboxConf.tokenDetails = appDetails.tokenDetails
      }
    }))
    if (dropboxConf?.parentAppId) getAllDropboxFolders(formID, dropboxConf, setDropboxConf)
  }, [dropboxConf.parentAppId])

  document.querySelector('.btcd-s-wrp').scrollTop = 0

  return (
    <div>
      <Modal
        title={__('Authorize New Dropbox App')}
        show={showMdl}
        setModal={(() => setShowMdl(false))}
      >
        <DropboxAuthorization
          formID={formID}
          dropboxConf={dropboxConf}
          setDropboxConf={setDropboxConf}
          step={step}
          setStep={setStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          authorizedAction={authorizedAction}
        />
      </Modal>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center w-9 mt-2 cal-width">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      {
        (connectedDropboxApps.length > 0 && step === 1) && (
          <ConnectedAppsList allIntegURL={allIntegURL} specificTypes={[dropboxConf.type]} onClickAction={authAppCardClickAction} allowAddNew addNewAction={() => setShowMdl(true)} />
        )
      }
      {
        step === 1 && connectedDropboxApps.length === 0 && (
          <DropboxAuthorization
            formID={formID}
            dropboxConf={dropboxConf}
            setDropboxConf={setDropboxConf}
            step={step}
            setStep={setStep}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            authorizedAction={authorizedAction}
          />
        )
      }

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: `${150}%`,
            overintegrations: 'visible',
          }),
        }}
      >
        <DropboxIntegLayout
          formID={formID}
          formFields={formFields}
          dropboxConf={dropboxConf}
          setDropboxConf={setDropboxConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* <button
          onClick={() => setStep(3)}
          disabled={dropboxConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button> */}
        <Btn
          variant="success"
          onClick={() => setStep(3)}
          disabled={dropboxConf.field_map.length < 1}
          className={css(ut.ftRight)}
        >
          {__('Next')}
          <BackIcn className="ml-1 rev-icn" />
        </Btn>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
      />
    </div>
  )
}

export default Dropbox
