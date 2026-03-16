import { getAtom } from '../../../GlobalStates/BitStore'
import { $bits } from '../../../GlobalStates/GlobalStates'
import bitsFetch from '../../../Utils/bitsFetch'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { saveConnectedIntegrationApp } from '../integrationHelper'

export const handleInput = (e, deskConf, setDeskConf, formID, setisLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...deskConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'orgId':
      newConf = portalChange(newConf, formID, setDeskConf, setisLoading, setSnackbar)
      break
    case 'department':
      newConf = departmentChange(newConf, formID, setDeskConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setDeskConf({ ...newConf })
}

export const portalChange = (deskConf, formID, setDeskConf, setisLoading, setSnackbar) => {
  const newConf = { ...deskConf }
  newConf.department = ''
  newConf.field_map = [{ formField: '', zohoFormField: '' }]
  newConf.actions = {}

  if (!newConf?.default?.departments?.[newConf.orgId]) {
    refreshDepartments(formID, newConf, setDeskConf, setisLoading, setSnackbar)
  } else if (newConf?.default?.departments?.[newConf.orgId].length === 1) newConf.field_map = generateMappedField(newConf)
  return newConf
}

export const departmentChange = (deskConf, formID, setDeskConf, setisLoading, setSnackbar) => {
  const newConf = { ...deskConf }
  newConf.field_map = [{ formField: '', zohoFormField: '' }]
  newConf.actions = {}

  if (!newConf?.default?.fields?.[newConf.orgId]) {
    refreshFields(formID, newConf, setDeskConf, setisLoading, setSnackbar)
  } else {
    newConf.field_map = generateMappedField(newConf)
  }
  return newConf
}

export const refreshOrganizations = (formID, deskConf, setDeskConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshOrganizationsRequestParams = {
    formID,
    id: deskConf.id,
    dataCenter: deskConf.dataCenter,
    clientId: deskConf.clientId,
    clientSecret: deskConf.clientSecret,
    tokenDetails: deskConf.tokenDetails,
  }
  bitsFetch(refreshOrganizationsRequestParams, 'bitforms_zdesk_refresh_organizations')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...deskConf }
        if (result.data.organizations) {
          newConf.default = { ...newConf.default, organizations: result.data.organizations }
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Portals refreshed') })
        setDeskConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Portals refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Portals refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshDepartments = (formID, deskConf, setDeskConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshDepartmentsRequestParams = {
    formID,
    id: deskConf.id,
    dataCenter: deskConf.dataCenter,
    clientId: deskConf.clientId,
    clientSecret: deskConf.clientSecret,
    tokenDetails: deskConf.tokenDetails,
    orgId: deskConf.orgId,
  }
  bitsFetch(refreshDepartmentsRequestParams, 'bitforms_zdesk_refresh_departments')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...deskConf }
        if (!newConf.default.departments) {
          newConf.default.departments = {}
        }
        if (result.data.departments) {
          newConf.default.departments[newConf.orgId] = result.data.departments
        }
        if (result.data.departments.length === 1) {
          newConf.department = result.data.departments[newConf.orgId][0].departmentName
          !newConf.default?.fields?.[newConf.orgId] && refreshFields(formID, newConf, setDeskConf, setisLoading, setSnackbar)
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Departments refreshed') })
        setDeskConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Departments refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Departments refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshFields = (formID, deskConf, setDeskConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshFieldsRequestParams = {
    formID,
    dataCenter: deskConf.dataCenter,
    clientId: deskConf.clientId,
    clientSecret: deskConf.clientSecret,
    tokenDetails: deskConf.tokenDetails,
    orgId: deskConf.orgId,
  }
  bitsFetch(refreshFieldsRequestParams, 'bitforms_zdesk_refresh_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...deskConf }
        if (result.data.fields) {
          if (!newConf.default.fields) {
            newConf.default.fields = {}
          }
          newConf.default.fields[newConf.orgId] = { ...result.data }
          newConf.field_map = generateMappedField(newConf)
          if (result.data.tokenDetails) {
            newConf.tokenDetails = result.data.tokenDetails
          }
          setSnackbar({ show: true, msg: __('Fields refreshed') })
        } else {
          setSnackbar({ show: true, msg: `${__('Fields refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setDeskConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Fields refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshOwners = (formID, deskConf, setDeskConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshOwnersRequestParams = {
    formID,
    id: deskConf.id,
    dataCenter: deskConf.dataCenter,
    clientId: deskConf.clientId,
    clientSecret: deskConf.clientSecret,
    tokenDetails: deskConf.tokenDetails,
    orgId: deskConf.orgId,
  }
  bitsFetch(refreshOwnersRequestParams, 'bitforms_zdesk_refresh_owners')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...deskConf }
        if (!newConf.default.owners) {
          newConf.default.owners = {}
        }
        if (result.data.owners) {
          newConf.default.owners[newConf.orgId] = result.data.owners
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Owners refreshed') })
        setDeskConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Owners refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Owners refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshProducts = (formID, deskConf, setDeskConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshProductsRequestParams = {
    formID,
    id: deskConf.id,
    dataCenter: deskConf.dataCenter,
    clientId: deskConf.clientId,
    clientSecret: deskConf.clientSecret,
    tokenDetails: deskConf.tokenDetails,
    orgId: deskConf.orgId,
    departmentId: deskConf.department,
  }
  bitsFetch(refreshProductsRequestParams, 'bitforms_zdesk_refresh_products')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...deskConf }
        if (!newConf.default.products) {
          newConf.default.products = {}
        }
        if (result.data.products) {
          newConf.default.products[newConf.department] = result.data.products
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Products refreshed') })
        setDeskConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Products refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Products refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const generateMappedField = deskConf => (deskConf.default.fields[deskConf.orgId].required.length > 0 ? deskConf.default.fields[deskConf.orgId].required?.map(field => ({ formField: '', zohoFormField: field })) : [{ formField: '', zohoFormField: '' }])

export const checkMappedFields = deskConf => {
  const mappedFields = deskConf?.field_map ? deskConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && deskConf?.default?.fields?.[deskConf.orgId]?.required.indexOf(mappedField.zohoFormField) !== -1)) : []
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
  const scopes = 'Desk.settings.READ,Desk.basic.READ,Desk.search.READ,Desk.contacts.READ,Desk.contacts.CREATE,Desk.contacts.UPDATE,Desk.tickets.CREATE,Desk.tickets.UPDATE'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.zohoRedirectURL)}`
  const authWindow = window.open(apiEndpoint, 'zohoDesk', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__bitforms_zohoDesk')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__bitforms_zohoDesk')
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
  bitsFetch(tokenRequestParams, 'bitforms_zdesk_generate_token')
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
