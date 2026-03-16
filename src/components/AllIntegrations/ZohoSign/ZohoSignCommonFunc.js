import { getAtom } from '../../../GlobalStates/BitStore'
import { $bits } from '../../../GlobalStates/GlobalStates'
import bitsFetch from '../../../Utils/bitsFetch'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { saveConnectedIntegrationApp } from '../integrationHelper'

export const handleInput = (e, signConf, setSignConf, formID, setisLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...signConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'template':
      newConf = templateChange(newConf, formID, setSignConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setSignConf({ ...newConf })
}

export const templateChange = (signConf, formID, setSignConf, setisLoading, setSnackbar) => {
  const newConf = { ...signConf }
  newConf.table = ''
  newConf.field_map = [{ formField: '', zohoFormField: '' }]
  delete newConf.templateActions

  if (!newConf?.default?.templateDetails?.[signConf.template]) {
    refreshTemplateDetails(formID, newConf, setSignConf, setisLoading, setSnackbar)
  }

  return newConf
}

export const refreshTemplates = (formID, signConf, setSignConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: signConf.id,
    dataCenter: signConf.dataCenter,
    clientId: signConf.clientId,
    clientSecret: signConf.clientSecret,
    tokenDetails: signConf.tokenDetails,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zsign_refresh_templates')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...signConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.templates) {
          newConf.default.templates = result.data.templates
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Templates refreshed') })
        setSignConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Templates refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Templates refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTemplateDetails = (formID, signConf, setSignConf, setisLoading, setSnackbar) => {
  const { template } = signConf
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: signConf.id,
    dataCenter: signConf.dataCenter,
    clientId: signConf.clientId,
    clientSecret: signConf.clientSecret,
    tokenDetails: signConf.tokenDetails,
    template,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zsign_refresh_template_details')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...signConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (!newConf.default.templateDetails) newConf.default.templateDetails = {}
        if (result.data.templateDetails) {
          newConf.default.templateDetails[template] = result.data.templateDetails
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Template Details refreshed') })
        setSignConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Template Details refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Template Details refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const setGrantTokenResponse = (integ) => {
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
  localStorage.setItem(`__bitforms_${integ}`, JSON.stringify(grantTokenResponse))
  window.close()
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
  const scopes = 'ZohoSign.templates.CREATE,ZohoSign.templates.READ,ZohoSign.templates.UPDATE'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.zohoRedirectURL)}`
  const authWindow = window.open(apiEndpoint, 'zohoSign', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__bitforms_zohoSign')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__bitforms_zohoSign')
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
  bitsFetch(tokenRequestParams, 'bitforms_zsign_generate_token')
    .then(result => result)
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
