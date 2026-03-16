/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { saveConnectedIntegrationApp } from '../integrationHelper'

export const handleInput = (
  e,
  rapidmailConf,
  setRapidmailConf,
  setIsLoading,
  setSnackbar,
  isNew,
  error,
  setError,
) => {
  const newConf = { ...rapidmailConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setRapidmailConf({ ...newConf })
}

export const getAllRecipient = (
  rapidmailConf,
  setRapidmailConf,
  setIsLoading,
  setSnackbar,
) => {
  setIsLoading(true)
  const queryParams = {
    username: rapidmailConf.username,
    password: rapidmailConf.password,
  }
  const loadPostTypes = bitsFetch(
    queryParams,
    'bitforms_rapidmail_get_all_recipients',
  ).then((result) => {
    if (result && result.success) {
      const newConf = { ...rapidmailConf }
      if (!newConf.default) newConf.default = {}
      if (result.data.recipientlists) {
        newConf.default.recipientlists = result.data.recipientlists
      }
      setRapidmailConf({ ...newConf })
      setIsLoading(false)
      return 'Recipientlist refreshed successfully'
    } else {
      setIsLoading(false)
      return 'Recipientlist refresh failed. please try again'
    }
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred'),
    loading: __('Loading Recipientslist...'),
  })
}

export const generateMappedField = (rapidmailConf) => {
  const requiredFlds = rapidmailConf?.recipientsFields.filter(
    (fld) => fld.required === true,
  )
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: '',
      rapidmailFormField: field.key,
    }))
    : [{ formField: '', rapidmailFormField: '' }]
}

export const checkMappedFields = (rapidmailConf) => {
  const mappedFields = rapidmailConf?.field_map
    ? rapidmailConf.field_map.filter(
      (mappedField) => !mappedField.formField
        || !mappedField.rapidmailFormField
        || (!mappedField.formField === 'custom'
          && !mappedField.customValue),
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const handleAuthorize = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar,
) => {
  if (!confTmp.username || !confTmp.password) {
    setError({
      username: !confTmp.username
        ? __("Username can't be empty")
        : '',
      password: !confTmp.password
        ? __("Password can't be empty")
        : '',
    })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = {
    username: confTmp.username,
    password: confTmp.password,
  }

  bitsFetch(tokenRequestParams, 'bitforms_rapidmail_authorization')
    .then((result) => result)
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        saveConnectedIntegrationApp(newConf)
        setisAuthorized(true)
        setSnackbar({
          show: true,
          msg: __('Authorized Successfully'),
        })
      } else if (
        (result && result.data && result.data.data)
        || (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__('Authorization failed Cause:')}${result.data.data || result.data}. ${__('please try again')}`,
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Authorization failed. please try again'),
        })
      }
      setIsLoading(false)
    })
}
