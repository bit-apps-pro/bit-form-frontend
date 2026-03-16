import { getAtom } from '../../../GlobalStates/BitStore'
import { $bits } from '../../../GlobalStates/GlobalStates'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { saveConnectedIntegrationApp } from '../integrationHelper'

export const handleInput = (e, formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...marketingHubConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'list':
      newConf = listChange(newConf, formID, setMarketingHubConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setMarketingHubConf({ ...newConf })
}

export const listChange = (marketingHubConf, formID, setMarketingHubConf, setisLoading, setSnackbar) => {
  const newConf = { ...marketingHubConf }
  newConf.field_map = [{ formField: '', zohoFormField: 'Contact Email' }]

  if (!newConf?.default?.fields?.[newConf.list]) {
    refreshContactFields(formID, newConf, setMarketingHubConf, setisLoading, setSnackbar)
  }
  return newConf
}

export const refreshLists = (formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshListsRequestParams = {
    formID,
    id: marketingHubConf.id,
    dataCenter: marketingHubConf.dataCenter,
    clientId: marketingHubConf.clientId,
    clientSecret: marketingHubConf.clientSecret,
    tokenDetails: marketingHubConf.tokenDetails,
  }
  bitsFetch(refreshListsRequestParams, 'bitforms_zmarketingHub_refresh_lists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...marketingHubConf }
        if (result.data.lists) {
          newConf.default = { ...newConf.default, lists: result.data.lists }
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Lists refreshed') })
        setMarketingHubConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Lists refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Lists refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshContactFields = (formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar) => {
  const { list } = marketingHubConf
  if (!list) {
    return
  }

  setisLoading(true)
  const refreshContactFieldsRequestParams = {
    formID,
    list,
    dataCenter: marketingHubConf.dataCenter,
    clientId: marketingHubConf.clientId,
    clientSecret: marketingHubConf.clientSecret,
    tokenDetails: marketingHubConf.tokenDetails,
  }
  bitsFetch(refreshContactFieldsRequestParams, 'bitforms_zmarketingHub_refresh_contact_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...marketingHubConf }
        if (result.data.fields) {
          if (!newConf.default.fields) {
            newConf.default.fields = {}
          }

          newConf.default.fields[list] = result.data

          setSnackbar({ show: true, msg: __('Contact Fields refreshed') })
        } else {
          setSnackbar({ show: true, msg: __("Zoho didn't provide fields names for this list") })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setMarketingHubConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Contact Fields refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const checkMappedFields = (marketingHubConf) => {
  const mappedFields = marketingHubConf?.field_map ? marketingHubConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && marketingHubConf?.default?.fields?.[marketingHubConf.list]?.required.indexOf(mappedField.zohoFormField) !== -1)) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}
export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setisLoading, setSnackbar) => {
  if (!confTmp.dataCenter || !confTmp.clientId || !confTmp.clientSecret) {
    setError({
      dataCenter: !confTmp.dataCenter ? __('Data center cann\'t be empty') : '',
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty') : '',
    })
    return
  }
  const bits = getAtom($bits)
  setisLoading(true)
  const scopes = 'ZohoMarketingHub.lead.READ,ZohoMarketingHub.lead.CREATE,ZohoMarketingHub.lead.UPDATE'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.zohoRedirectURL)}`
  const authWindow = window.open(apiEndpoint, 'zohoMarkatingHub', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__bitforms_zohoMarkatingHub')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__bitforms_zohoMarkatingHub')
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed')} ${errorCause}. ${__('please try again')}` })
        setisLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(grantTokenResponse, newConf, setConf, setisAuthorized, setisLoading, setSnackbar)
      }
    }
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setisAuthorized, setisLoading, setSnackbar) => {
  const bits = getAtom($bits)
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.dataCenter = confTmp.dataCenter
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = encodeURIComponent(bits.zohoRedirectURL)
  bitsFetch(tokenRequestParams, 'bitforms_zmarketingHub_generate_token')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        saveConnectedIntegrationApp(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Authorization failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Authorization failed. please try again') })
      }
      setisLoading(false)
    })
}

export const setGrantTokenResponse = () => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}/redirect`, '').split('&')
  if (queryParams) {
    queryParams.forEach(element => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1]
      }
    })
  }
  localStorage.setItem('__bitforms_zohoMarkatingHub', JSON.stringify(grantTokenResponse))
  window.close()
}
