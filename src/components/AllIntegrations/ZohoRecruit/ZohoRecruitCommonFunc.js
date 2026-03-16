import { getAtom } from '../../../GlobalStates/BitStore'
import { $bits } from '../../../GlobalStates/GlobalStates'
import bitsFetch from '../../../Utils/bitsFetch'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { saveConnectedIntegrationApp } from '../integrationHelper'

export const handleInput = (e, recordTab, recruitConf, setRecruitConf, formID, setisLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...recruitConf }

  if (recordTab === 0) {
    if (isNew) {
      const rmError = { ...error }
      rmError[e.target.name] = ''
      setError({ ...rmError })
    }
    newConf[e.target.name] = e.target.value
  } else {
    newConf.relatedlists[recordTab - 1][e.target.name] = e.target.value
  }

  switch (e.target.name) {
    case 'module':
      newConf = moduleChange(recordTab, newConf, formID, setRecruitConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setRecruitConf({ ...newConf })
}

export const handleTabChange = (recordTab, settab, recruitConf, setRecruitConf, formID, setisLoading, setSnackbar) => {
  if (recordTab) {
    !recruitConf?.default?.relatedlists?.[recruitConf.module] && refreshRelatedList(formID, recruitConf, setRecruitConf, setisLoading, setSnackbar)
  }

  settab(recordTab)
}

export const moduleChange = (recordTab, recruitConf, formID, setRecruitConf, setisLoading, setSnackbar) => {
  const newConf = { ...recruitConf }
  const module = recordTab === 0 ? newConf.module : newConf.relatedlists[recordTab - 1].module

  if (recordTab === 0) {
    newConf.actions = {}
    newConf.field_map = [{ formField: '', zohoFormField: '' }]
    newConf.upload_field_map = [{ formField: '', zohoFormField: '' }]

    if (recordTab) newConf.relatedlists[recordTab - 1] = {}
  } else {
    newConf.relatedlists[recordTab - 1].field_map = [{ formField: '', zohoFormField: '' }]
    newConf.relatedlists[recordTab - 1].upload_field_map = [{ formField: '', zohoFormField: '' }]
    newConf.relatedlists[recordTab - 1].actions = {}
  }

  if (!newConf.default?.moduleData?.[module]) {
    getFields(recordTab, formID, newConf, setRecruitConf, setisLoading, setSnackbar)
  } else if (recordTab === 0) {
    newConf.field_map = generateMappedField(recordTab, newConf)
    if (Object.keys(newConf.default.moduleData[module].fileUploadFields).length > 0) {
      newConf.upload_field_map = generateMappedField(recordTab, newConf, true)
    }
  } else {
    newConf.relatedlists[recordTab - 1].field_map = generateMappedField(recordTab, newConf)
    if (Object.keys(newConf.default.moduleData[module].fileUploadFields).length > 0) {
      newConf.relatedlists[recordTab - 1].upload_field_map = generateMappedField(recordTab, newConf, true)
    }
  }

  return newConf
}

export const refreshModules = (formID, recruitConf, setRecruitConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: recruitConf.id,
    dataCenter: recruitConf.dataCenter,
    clientId: recruitConf.clientId,
    clientSecret: recruitConf.clientSecret,
    tokenDetails: recruitConf.tokenDetails,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zrecruit_refresh_modules')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...recruitConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.modules) {
          newConf.default.modules = result.data.modules
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setRecruitConf({ ...newConf })
        setSnackbar({ show: true, msg: __('Modules refreshed') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Modules refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Modules refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshNoteTypes = (formID, recruitConf, setRecruitConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: recruitConf.id,
    dataCenter: recruitConf.dataCenter,
    clientId: recruitConf.clientId,
    clientSecret: recruitConf.clientSecret,
    tokenDetails: recruitConf.tokenDetails,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zrecruit_refresh_notetypes')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...recruitConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.noteTypes) {
          newConf.default.noteTypes = result.data.noteTypes
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setRecruitConf({ ...newConf })
        setSnackbar({ show: true, msg: __('Note Types refreshed') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Note Types refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Note Types refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshRelatedList = (formID, recruitConf, setRecruitConf, setisLoading, setSnackbar) => {
  if (!recruitConf.module) {
    return
  }
  setisLoading(true)
  const relatedListRequestParams = {
    formID,
    module: recruitConf.module,
    dataCenter: recruitConf.dataCenter,
    clientId: recruitConf.clientId,
    clientSecret: recruitConf.clientSecret,
    tokenDetails: recruitConf.tokenDetails,
  }
  bitsFetch(relatedListRequestParams, 'bitforms_zrecruit_refresh_related_lists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...recruitConf }
        if (result.data.related_modules) {
          if (!newConf.default.relatedlists) {
            newConf.default.relatedlists = {}
          }
          newConf.default.relatedlists[newConf.module] = result.data.related_modules
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setRecruitConf({ ...newConf })
        setSnackbar({ show: true, msg: __('RelatedLists refreshed') })
      } else if ((result?.data?.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('RelatedLists refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('RelatedLists refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const getFields = (recordTab, formID, recruitConf, setRecruitConf, setisLoading, setSnackbar) => {
  const module = recordTab === 0 ? recruitConf.module : recruitConf.relatedlists[recordTab - 1].module
  if (!module) {
    return
  }

  setisLoading(true)
  const getFieldsRequestParams = {
    formID,
    module,
    dataCenter: recruitConf.dataCenter,
    clientId: recruitConf.clientId,
    clientSecret: recruitConf.clientSecret,
    tokenDetails: recruitConf.tokenDetails,
  }
  bitsFetch(getFieldsRequestParams, 'bitforms_zrecruit_get_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...recruitConf }
        if (result.data.fieldDetails) {
          if (!newConf.default.moduleData) {
            newConf.default.moduleData = {}
          }
          newConf.default.moduleData[module] = result.data.fieldDetails
          if (recordTab === 0) {
            newConf.field_map = generateMappedField(recordTab, newConf)
            if (Object.keys(newConf.default.moduleData[module].fileUploadFields).length > 0) {
              newConf.upload_field_map = generateMappedField(recordTab, newConf, true)
            }
          } else {
            newConf.relatedlists[recordTab - 1].field_map = generateMappedField(recordTab, newConf)
            if (Object.keys(newConf.default.moduleData[module].fileUploadFields).length > 0) {
              newConf.relatedlists[recordTab - 1].upload_field_map = generateMappedField(recordTab, newConf, true)
            }
          }
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setRecruitConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Fields refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const generateMappedField = (recordTab, recruitConf, uploadFields) => {
  const module = recordTab === 0 ? recruitConf.module : recruitConf.relatedlists[recordTab - 1].module
  if (uploadFields) {
    return recruitConf.default.moduleData[module].requiredFileUploadFields.length > 0 ? recruitConf.default.moduleData[module].requiredFileUploadFields?.map(field => ({ formField: '', zohoFormField: field })) : [{ formField: '', zohoFormField: '' }]
  }
  return recruitConf.default.moduleData[module].required.length > 0 ? recruitConf.default.moduleData[module].required?.map(field => ({ formField: '', zohoFormField: field })) : [{ formField: '', zohoFormField: '' }]
}

export const checkMappedFields = (recruitConf) => {
  const mappedFields = recruitConf?.field_map ? recruitConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && recruitConf?.default?.moduleData?.[recruitConf.module]?.required.indexOf(mappedField.zohoFormField) !== -1)) : []
  const mappedUploadFields = recruitConf?.upload_field_map ? recruitConf.upload_field_map.filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && recruitConf?.default?.moduleData?.[recruitConf.module]?.requiredFileUploadFields.indexOf(mappedField.zohoFormField) !== -1)) : []
  const mappedRelatedFields = recruitConf.relatedlists.map(relatedlist => relatedlist.field_map.filter(mappedField => !mappedField.formField && mappedField.zohoFormField))
  const mappedRelatedUploadFields = recruitConf.relatedlists.map(relatedlist => relatedlist.upload_field_map.filter(mappedField => !mappedField.formField && mappedField.zohoFormField))

  if (mappedFields.length > 0 || mappedUploadFields.length > 0 || mappedRelatedFields.some(relatedField => relatedField.length) || mappedRelatedUploadFields.some(relatedField => relatedField.length)) {
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
  const scopes = 'ZohoRecruit.users.ALL,ZohoRecruit.modules.all'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.zohoRedirectURL)}`
  const authWindow = window.open(apiEndpoint, 'zohoRecruit', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__bitforms_zohoRecruit')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__bitforms_zohoRecruit')
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
  bitsFetch(tokenRequestParams, 'bitforms_zrecruit_generate_token')
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
