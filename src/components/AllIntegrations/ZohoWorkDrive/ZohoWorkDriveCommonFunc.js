import { getAtom } from '../../../GlobalStates/BitStore'
import { $bits } from '../../../GlobalStates/GlobalStates'
import bitsFetch from '../../../Utils/bitsFetch'
import { sortArrOfObj } from '../../../Utils/Helpers'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { saveConnectedIntegrationApp } from '../integrationHelper'

export const handleInput = (e, workDriveConf, setWorkDriveConf, formID, setisLoading, setSnackbar, ind, isNew, error, setError) => {
  let newConf = { ...workDriveConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'team':
      newConf = teamChange(newConf, formID, setWorkDriveConf, setisLoading, setSnackbar)
      break
    case 'folder':
      newConf.folderMap = newConf.folderMap.slice(0, ind)
      newConf = folderChange(newConf, formID, setWorkDriveConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setWorkDriveConf({ ...newConf })
}

export const teamChange = (workDriveConf, formID, setWorkDriveConf, setisLoading, setSnackbar) => {
  const newConf = { ...workDriveConf }
  newConf.folder = ''

  if (newConf.team && !newConf?.default?.teamFolders?.[newConf.team]) {
    refreshTeamFolders(formID, newConf, setWorkDriveConf, setisLoading, setSnackbar)
  }
  return newConf
}

export const folderChange = (workDriveConf, formID, setWorkDriveConf, setisLoading, setSnackbar) => {
  const newConf = { ...workDriveConf }
  delete newConf.teamType

  if (newConf.folder && !newConf.default?.folders?.[newConf.folder]) {
    if (newConf.default?.teamFolders?.[newConf.team]?.[newConf.folder]?.type === 'private') {
      newConf.teamType = 'private'
    }
    refreshSubFolders(formID, newConf, setWorkDriveConf, setisLoading, setSnackbar)
  } else if (newConf.folder && newConf.folder !== newConf.folderMap[newConf.folderMap.length - 1]) newConf.folderMap.push(newConf.folder)

  return newConf
}

export const refreshTeams = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshTeamsRequestParams = {
    formID,
    id: workDriveConf.id,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
  }
  bitsFetch(refreshTeamsRequestParams, 'bitforms_zworkdrive_refresh_teams')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
        if (result.data.teams) {
          newConf.default = { ...newConf.default, teams: result.data.teams }
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Teams refreshed') })
        setWorkDriveConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Teams refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Teams refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTeamFolders = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshTeamFoldersRequestParams = {
    formID,
    id: workDriveConf.id,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
    team: workDriveConf.team,
  }
  bitsFetch(refreshTeamFoldersRequestParams, 'bitforms_zworkdrive_refresh_team_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
        if (!newConf.default.teamFolders) {
          newConf.default.teamFolders = {}
        }
        if (result.data.teamFolders) {
          newConf.default.teamFolders[newConf.team] = result.data.teamFolders
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Folders refreshed') })
        setWorkDriveConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Folders refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Folders refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshSubFolders = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar, ind) => {
  const folder = ind ? workDriveConf.folderMap[ind] : workDriveConf.folder
  setisLoading(true)
  const refreshSubFoldersRequestParams = {
    formID,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
    team: workDriveConf.team,
    folder,
    teamType: 'teamType' in workDriveConf ? 'private' : 'team',
  }

  bitsFetch(refreshSubFoldersRequestParams, 'bitforms_zworkdrive_refresh_sub_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
        if (result.data.folders) {
          if (!newConf.default.folders) {
            newConf.default.folders = {}
          }

          newConf.default.folders[folder] = sortArrOfObj(result.data.folders, 'folderName')
          if (!newConf.folderMap.includes(folder)) newConf.folderMap.push(folder)
          setSnackbar({ show: true, msg: __('Sub Folders refreshed') })
        } else {
          setSnackbar({ show: true, msg: __('No Sub Folder Found') })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setWorkDriveConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Sub Folders refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshUsers = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshUsersRequestParams = {
    formID,
    id: workDriveConf.id,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
    team: workDriveConf.team,
  }
  bitsFetch(refreshUsersRequestParams, 'bitforms_zworkdrive_refresh_users')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
        if (!newConf.default.users) {
          newConf.default.users = {}
        }
        if (result.data.users) {
          newConf.default.users[workDriveConf.team] = result.data.users
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Users refreshed') })
        setWorkDriveConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Users refresh failed Cause: %s. please try again'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Users refresh failed. please try again') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
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
  const scopes = 'WorkDrive.team.READ,WorkDrive.workspace.READ,WorkDrive.workspace.CREATE,WorkDrive.workspace.UPDATE,WorkDrive.files.READ,WorkDrive.files.CREATE'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.zohoRedirectURL)}`
  const authWindow = window.open(apiEndpoint, 'zohoWorkDrive', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__bitforms_zohoWorkDrive')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__bitforms_zohoWorkDrive')
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
  bitsFetch(tokenRequestParams, 'bitforms_zworkdrive_generate_token')
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
