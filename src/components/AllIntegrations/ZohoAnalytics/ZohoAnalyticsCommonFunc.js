import { getAtom } from '../../../GlobalStates/BitStore'
import { $bits } from '../../../GlobalStates/GlobalStates'
import bitsFetch from '../../../Utils/bitsFetch'
import { checkValidEmail } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { saveConnectedIntegrationApp } from '../integrationHelper'

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
  localStorage.setItem('__bitforms_zohoAnalytics', JSON.stringify(grantTokenResponse))
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
  if (!checkValidEmail(confTmp.ownerEmail)) {
    setError({ ownerEmail: !checkValidEmail(confTmp.ownerEmail) ? __('Email is invalid') : '' })
    return
  }
  const bits = getAtom($bits)
  setisLoading(true)
  const scopes = 'ZohoAnalytics.metadata.read,ZohoAnalytics.data.read,ZohoAnalytics.data.create,ZohoAnalytics.data.update,ZohoAnalytics.usermanagement.read,ZohoAnalytics.share.create'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.zohoRedirectURL)}`
  const authWindow = window.open(apiEndpoint, 'zohoAnalytics', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__bitforms_zohoAnalytics')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__bitforms_zohoAnalytics')
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
  bitsFetch(tokenRequestParams, 'bitforms_zanalytics_generate_token')
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

export const handleInput = (e, analyticsConf, setAnalyticsConf, formID, setisLoading, setSnackbar) => {
  let newConf = { ...analyticsConf }
  const { name, value } = e.target
  newConf[name] = value

  switch (name) {
    case 'workspace':
      newConf = workspaceChange(newConf, formID, setAnalyticsConf, setisLoading, setSnackbar)
      break
    case 'table':
      newConf = tableChange(newConf, formID, setAnalyticsConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setAnalyticsConf({ ...newConf })
}

export const workspaceChange = (analyticsConf, formID, setAnalyticsConf, setisLoading, setSnackbar) => {
  const newConf = { ...analyticsConf }
  newConf.table = ''
  newConf.field_map = [{ formField: '', zohoFormField: '' }]

  if (!newConf?.default?.tables?.[analyticsConf.workspace]) {
    refreshTables(formID, newConf, setAnalyticsConf, setisLoading, setSnackbar)
  } else if (Object.keys(newConf?.default?.tables?.[analyticsConf.workspace]).length === 1) {
    newConf.table = newConf?.default?.tables?.[analyticsConf.workspace][0].viewName

    if (!newConf?.default?.tables?.headers?.[newConf.table]) {
      refreshTableHeaders(formID, newConf, setAnalyticsConf, setisLoading, setSnackbar)
    }
  }

  if (!analyticsConf.default.users) {
    refreshUsers(formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar)
  }

  return newConf
}

export const tableChange = (analyticsConf, formID, setAnalyticsConf, setisLoading, setSnackbar) => {
  const newConf = { ...analyticsConf }
  newConf.field_map = [{ formField: '', zohoFormField: '' }]

  if (!newConf?.default?.tables?.headers?.[analyticsConf.table]) {
    refreshTableHeaders(formID, newConf, setAnalyticsConf, setisLoading, setSnackbar)
  }

  return newConf
}

export const refreshWorkspaces = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: analyticsConf.id,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zanalytics_refresh_workspaces')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.workspaces) {
          newConf.default.workspaces = result.data.workspaces
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Workspaces refreshed') })
        setAnalyticsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Workspaces refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Workspaces refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshUsers = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshUsersRequestParams = {
    formID,
    id: analyticsConf.id,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshUsersRequestParams, 'bitforms_zanalytics_refresh_users')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.users) {
          newConf.default.users = result.data.users
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Users refreshed') })
        setAnalyticsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Users refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Users refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTables = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  const { workspace } = analyticsConf
  if (!workspace) {
    return
  }

  setisLoading(true)
  const refreshTablesRequestParams = {
    formID,
    workspace,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshTablesRequestParams, 'bitforms_zanalytics_refresh_tables')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (result.data.tables) {
          if (!newConf.default.tables) {
            newConf.default.tables = {}
          }
          newConf.default.tables[workspace] = result.data.tables
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Tables refreshed') })
        setAnalyticsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Tables refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTableHeaders = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  const { workspace, table } = analyticsConf
  if (!table) {
    return
  }

  setisLoading(true)
  const refreshTableHeadersRequestParams = {
    formID,
    workspace,
    table,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshTableHeadersRequestParams, 'bitforms_zanalytics_refresh_table_headers')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (result.data.table_headers) {
          if (!newConf.default.tables.headers) {
            newConf.default.tables.headers = {}
          }
          newConf.default.tables.headers[table] = result.data.table_headers
          setSnackbar({ show: true, msg: __('Table Headers refreshed') })
        } else {
          setSnackbar({ show: true, msg: __("Zoho didn't provide column names for this table") })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setAnalyticsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Table Headers refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}
