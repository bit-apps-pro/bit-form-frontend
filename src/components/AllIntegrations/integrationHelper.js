/* eslint-disable import/prefer-default-export */

import { $connectedApps } from '../../GlobalStates/AppSettingsStates'
import { getAtom, setAtom } from '../../GlobalStates/BitStore'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'

/**
 * Allowed fields for integration
 *
 * @param [array] formFields
 * @returns [array] formFields
 */
export const allowedFieldsForIntegration = (formFields) => {
  const allowFieldType = [
    'text',
    'textarea',
    'email',
    'number',
    'html-select',
    'radio',
    'check',
    'select',
    'file-up',
    'advanced-file-up',
    'country',
    'currency',
    'phone-number',
    'username',
    'password',
    'advanced-datetime',
    'date',
    'time',
    'datetime-local',
    'week',
    'month',
    'url',
    'color',
    'decision-box',
    'gdpr',
    'paypal',
    'razorpay',
    'stripe',
    'signature',
    'rating',
    'image-select',
    'repeater',
    'section',
    'hidden',
  ]
  return formFields.filter(field => allowFieldType.includes(field.typ))
}

/**
 * Remove field with type
 *
 * @param [array] formFields
 * @param [array] field type for remove field like ['text', 'textarea']
 * @returns [array] formFields
 */
export const removeFieldWithType = (formFields, removeFieldTypes) => formFields.filter(fld => !removeFieldTypes.includes(fld.typ))

export const saveConnectedIntegrationApp = (appConfig) => {
  bitsFetch(appConfig, 'bitforms_save_connected_integration_apps')
    .then(result => result)
    .then(async result => {
      if (result && result.success) {
        // setSnackbar({ show: true, msg: __('Authorized Successfully') })
        await fetchConnectedApp()
        console.log('Bitforms save connected integration apps success', result)
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        // setSnackbar({ show: true, msg: `${__('Authorization failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        // setSnackbar({ show: true, msg: __('Authorization failed. please try again') })
      }
      // setisLoading(false)
      console.log('Bitforms save connected integration apps failed', result)
    })
}

export async function fetchConnectedApp(filterData = {}) {
  bitsFetch(filterData, 'bitforms_get_connected_integration_apps')
    .then(result => {
      // const connectedApps = getAtom($connectedApps)
      setAtom($connectedApps, result.data)
      return result
    })
}

export const getConnectedAppList = (integraionTypes) => {
  const connectedApps = getAtom($connectedApps)
  if (!integraionTypes) return connectedApps
  return connectedApps?.filter(app => integraionTypes.includes(app.integration_type))
}

export const refreshConnectedApps = (setisLoading, setSnackbar, integrationType) => {
  setisLoading(true)
  const filterData = { integrationType }
  bitsFetch(filterData, 'bitforms_get_connected_integration_apps')
    .then(result => {
      if (result && result.success) {
        setAtom($connectedApps, result.data)
        setSnackbar({ show: true, msg: __(`Connected ${integrationType} apps refreshed`) })
      } else {
        setSnackbar({ show: true, msg: __(`Connected ${integrationType} apps refresh failed. Please try again`) })
      }
      setisLoading(false)
    }).catch(() => setisLoading(false))
}
