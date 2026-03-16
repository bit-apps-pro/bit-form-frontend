// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import ActiveCampaignAuthorization from './ActiveCampaignAuthorization'
import { checkMappedFields } from './ActiveCampaignCommonFunc'

function ActiveCampaignGlobal({ formFields, setIntegration, integrations, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
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

  const authorizedAction = () => {
    setTimeout(() => { navigate(allIntegURL) }, 1000)
  }
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

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <ActiveCampaignAuthorization
        formID={formID}
        activeCampaingConf={activeCampaingConf}
        setActiveCampaingConf={setActiveCampaingConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        allIntegURL={allIntegURL}
        authorizedAction={authorizedAction}
      />
    </div>
  )
}

export default ActiveCampaignGlobal
