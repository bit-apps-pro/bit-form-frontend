/* eslint-disable no-param-reassign */
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { $fieldsArr, $formId, $updateBtn } from '../GlobalStates/GlobalStates'
import { IS_PRO } from '../Utils/Helpers'
import { activationTamplate, fogotPassTamplate, pendingUserActiveRejectTamplateForAdmin } from '../Utils/StaticData/tamplate'
import tutorialLinks from '../Utils/StaticData/tutorialLinks'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import useSWROnce from '../hooks/useSWROnce'
import app from '../styles/app.style'
import Loader from './Loaders/Loader'
import LoaderSm from './Loaders/LoaderSm'
import CheckBox from './Utilities/CheckBox'
import SingleToggle2 from './Utilities/SingleToggle2'
import SnackMsg from './Utilities/SnackMsg'
import Forgot from './WPAuth/Forgot'
import Login from './WPAuth/Login'
import Register from './WPAuth/Registration/Registration'
import { checkMappedUserFields } from './WPAuth/Registration/UserHelperFunction'
import ResetPassword from './WPAuth/ResetPassword'
import { useResetAtom } from 'jotai/utils'

export default function AuthSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const formFields = useAtomValue($fieldsArr)
  const [type, setType] = useState('register')
  const formID = useAtomValue($formId)
  const { css } = useFela()
  const resetUpdateBtn = useResetAtom($updateBtn)

  const [dataConf, setDataConf] = useState({
    register: {
      user_map: [{}],
      succ_msg: __('Registration successfully done.'),
      meta_map: [{}],
      sub: __('Activate Your Account'),
      body: activationTamplate,
      acti_succ_msg: __('Your account has been activated successfully.&nbsp;You can now login.'),
      already_activated_msg: __('Your account is already activated!'),
      invalid_key_msg: __('Sorry! Your URL Is Invalid!!'),
      reject_success_msg: __('This Requested account has been rejected successfully.'),
      pendingUserSub: __('Your account is pending for admin approval.'),
      pendingUserBody: __('Your account is pending for admin approval. Please wait for admin approval.'),
      adminApprovalSub: __('New User Registration Request'),
      adminApprovalBody: pendingUserActiveRejectTamplateForAdmin,
      userRejectionSub: __('Your account has been rejected.'),
      userRejectionBody: __('<p>Your account has been rejected by admin.</p>'),
    },
    login: {
      login_map: [{}],
      succ_msg: __('You have been successfully logged in.'),
    },
    forgot: {
      forgot_map: [{}],
      succ_msg: __('We have e-mailed your password reset link!'),
      sub: 'Email Subject',
      body: fogotPassTamplate,
    },
    reset: {
      reset_map: [{}],
      succ_msg: 'Your password has been reset!.',
    },
  })

  const [pages, setPages] = useState([])
  const [status, setStatus] = useState(0)
  const [snack, setSnackbar] = useState({ show: false })
  const setUpdateBtn = useSetAtom($updateBtn)

  const { isLoading: isLoad, mutate: mutateAuthSettings } = useSWROnce('bitforms_get_auth_set', { formID }, {
    fetchCondition: IS_PRO,
    onSuccess: data => {
      setDataConf(oldConf => create(oldConf, draft => {
        draft[data[0]?.integration_name] = JSON.parse(data[0]?.integration_details)
      }))
      setType(data[0]?.integration_name)
      setStatus(Number(data[0]?.status))
    },
  })
  useSWROnce('bitforms_get_all_wp_pages', {}, { fetchCondition: IS_PRO, onSuccess: data => setPages(data) })

  const handleInput = e => {
    if (!IS_PRO) return
    const { name, value } = e.target
    setType(value)
    const tmpData = { ...dataConf }
    tmpData[name] = value
    setDataConf(tmpData)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleStatus = (e) => {
    if (!IS_PRO) return
    if (e.target.checked) {
      setStatus(1)
    } else {
      setStatus(0)
    }
  }

  const validation = () => {
    let submission = true
    if (type === 'register' && !checkMappedUserFields(dataConf[type], 'user_map', 'userField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    } if (type === 'register' && !dataConf[type]?.user_role) {
      setSnackbar({ show: true, msg: 'User Role field is required.' })
      submission = false
    } if (type === 'forgot' && !checkMappedUserFields(dataConf[type], 'forgot_map', 'forgotField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    } if (type === 'forgot' && !dataConf[type]?.redirect_url) {
      setSnackbar({ show: true, msg: 'redirect page link is required.' })
      submission = false
    } if (type === 'reset' && !checkMappedUserFields(dataConf[type], 'reset_map', 'resetField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    } if (type === 'login' && !checkMappedUserFields(dataConf[type], 'login_map', 'loginField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    }
    return submission
  }

  const saveSettings = (e) => {
    e.preventDefault()
    if (!IS_PRO) return
    setIsLoading(true)
    const tmpConf = create(dataConf, draft => {
      Object.keys(draft).forEach(key => type !== key && delete draft[key])
      draft.formId = formID
      draft.type = type
      draft.status = status
    })
    const submission = validation()
    if (!submission) {
      setIsLoading(false)
      return
    }
    const prom = bitsFetch(
      tmpConf,
      'bitforms_save_auth_settings',
    )
      .then((res) => {
        if (res !== undefined && res.success) {
          mutateAuthSettings(tmpConf)
          setIsLoading(false)
          resetUpdateBtn()
        }
      })
    toast.promise(prom, {
      success: __('Saved successfully.'),
      loading: __('Saving...'),
      error: __('Something went wrong, Try again.'),
    })
  }

  const userManagementType = () => {
    switch (type) {
      case 'login':
        return (
          <Login
            fields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      case 'forgot':
        return (
          <Forgot
            fields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      case 'reset':
        return (
          <ResetPassword
            fields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      case 'register':
        return (
          <Register
            formFields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      default:
        break
    }
  }
  return (
    <div className="pos-rel">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <h2 className="">{__('WP Authentication')}</h2>
      <h5>
        {__('How to setup WP Authentication:')}
        &nbsp;
        <a href={tutorialLinks.authSettings.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
          {__('YouTube')}
        </a>
        <a href={tutorialLinks.authSettingsDoc.link} target="_blank" rel="noreferrer" className="doc-txt">
          {__('Documentation')}
        </a>
      </h5>
      {!IS_PRO && (
        <div className="pro-blur flx" style={{ height: '111%', left: -53, width: '104%' }}>
          <div className="pro">
            {__('Available On')}
            <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
              <span className="txt-pro">
                {__('Premium')}
              </span>
            </a>
          </div>
        </div>
      )}
      {
        isLoad
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 70,
              transform: 'scale(0.7)',
            }}
            />
          ) : (
            <div>
              <div className="mt-2">
                <label htmlFor="status">
                  <b>{__('')}</b>
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'register'} title={<small className="txt-dp"><b>Registration</b></small>} value="register" />
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'login'} title={<small className="txt-dp"><b>Log In</b></small>} value="login" />
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'forgot'} title={<small className="txt-dp"><b>Forgot Password</b></small>} value="forgot" />
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'reset'} title={<small className="txt-dp"><b>Reset Password</b></small>} value="reset" />
                </label>
              </div>

              <div className="mt-2 ml-1 flx">
                <label htmlFor="status">
                  <b>{__('Enable')}</b>
                </label>
                <SingleToggle2 action={handleStatus} checked={status === 1} className="ml-4 flx" />
              </div>

              {userManagementType()}

              <button
                type="button"
                id="secondary-update-btn"
                onClick={saveSettings}
                className={css(app.btn, app.blueGrd, { px: 20 })}
                disabled={isLoading}
              >
                {__('Save')}
                {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
              </button>
              <div>
                {type !== 'register' && (
                  <p className="p-1 f-m">
                    <strong>{__('Note :')}</strong>
                    {' '}
                    {__('When the login, forgot password or reset password any of these feature enabled in the form, the entries will not be saved in the WP database.')}
                  </p>
                )}
              </div>
            </div>
          )
      }

    </div>
  )
}
