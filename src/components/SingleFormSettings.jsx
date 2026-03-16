/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
/*
  ⚠ Please don't remove this line, it's needed for the date picker documentation ⚠
  https://react-day-picker.js.org/
*/
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
/**
 * https://reactjsexample.com/google-keep-app-inspired-time-picker-for-react/
 */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import Timekeeper from 'react-timekeeper'
import { hideAll } from 'tippy.js'
import { $reCaptchaV3 } from '../GlobalStates/AppSettingsStates'
import { $additionalSettings, $fields, $formId, $proModal, $updateBtn } from '../GlobalStates/GlobalStates'
import { $staticStylesState } from '../GlobalStates/StaticStylesState'
import { $styles } from '../GlobalStates/StylesState'
import BlockIcn from '../Icons/BlockIcn'
import CloseIcn from '../Icons/CloseIcn'
import DBIcn from '../Icons/DBIcn'
import DateIcn from '../Icons/DateIcn'
import EmptyIcn from '../Icons/EmptyIcn'
import FocusIcn from '../Icons/FocusIcn'
import GoogleAdIcn from '../Icons/GoogleAdIcn'
import HoneypotIcn from '../Icons/HoneypotIcn'
import IpBlockIcn from '../Icons/IpBlockIcn'
import LockIcn from '../Icons/LockIcn'
import LoginIcn from '../Icons/LoginIcn'
import ReCaptchaIcn from '../Icons/ReCaptchaIcn'
import TrashIcn from '../Icons/TrashIcn'
import { deleteNestedObj } from '../Utils/FormBuilderHelper'
import { IS_PRO, dateTimeFormatter, deepCopy } from '../Utils/Helpers'
import proHelperData from '../Utils/StaticData/proHelperData'
import tutorialLinks from '../Utils/StaticData/tutorialLinks'
import { __ } from '../Utils/i18nwrap'
import ut from '../styles/2.utilities'
import Grow from './CompSettings/StyleCustomize/ChildComp/Grow'
import Accordions from './Utilities/Accordions'
import CheckBox from './Utilities/CheckBox'
import ConfirmModal from './Utilities/ConfirmModal'
import Downmenu from './Utilities/Downmenu'
import ProBadge from './Utilities/ProBadge'
import Select from './Utilities/Select'
import SingleToggle2 from './Utilities/SingleToggle2'
import TableCheckBox from './Utilities/TableCheckBox'
import LearnmoreTip from './Utilities/Tip/LearnmoreTip'
import { assignNestedObj } from './style-new/styleHelpers'

export default function SingleFormSettings() {
  const [additionalSetting, setadditional] = useAtom($additionalSettings)
  const fields = useAtomValue($fields)
  const formID = useAtomValue($formId)
  const [alertMdl, setAlertMdl] = useState({ show: false, msg: '' })
  const [showCaptchaAdvanced, setShowCaptchaAdvanced] = useState(false)
  const reCaptchaV3 = useAtomValue($reCaptchaV3)
  const setUpdateBtn = useSetAtom($updateBtn)
  const setStaticStyleState = useSetAtom($staticStylesState)
  const setProModal = useSetAtom($proModal)
  // const [proModal, setProModal] = useState({ show: false, msg: '' })
  const setStyles = useSetAtom($styles)
  const { css } = useFela()

  const clsAlertMdl = () => {
    const tmpAlert = { ...alertMdl }
    tmpAlert.show = false
    setAlertMdl(tmpAlert)
  }

  const addMoreBlockIp = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.blocked_ip })
      return
    }
    const additional = deepCopy(additionalSetting)
    if ('blocked_ip' in additional.settings) {
      additional.settings.blocked_ip.push({ ip: '', status: false })
    } else {
      additional.settings.blocked_ip = []
      additional.settings.blocked_ip.push({ ip: '', status: false })
    }
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm()
  }

  const addMorePrivateIp = () => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.private_ip })
      return
    }
    const additional = deepCopy(additionalSetting)
    if ('private_ip' in additional.settings) {
      additional.settings.private_ip.push({ ip: '', status: false })
    } else {
      additional.settings.private_ip = []
      additional.settings.private_ip.push({ ip: '', status: false })
    }
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const delBlkIp = i => {
    const additional = deepCopy(additionalSetting)
    additional.settings.blocked_ip.splice(i, 1)
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const delPrivateIp = i => {
    const additional = deepCopy(additionalSetting)
    additional.settings.private_ip.splice(i, 1)
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const setEntryLimitSettings = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.entryLimit })
      return
    }
    if (e.target.type === 'number' && e.target.value <= 0) return
    const additional = deepCopy(additionalSetting)
    const propertyName = e.target.name
    additional.settings[propertyName] = e.target.value
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }
  useEffect(() => {
    const isTrue = additionalSetting.enabled?.onePerIp
      || additionalSetting.enabled?.restrict_form
      || additionalSetting.enabled?.is_login
      || additionalSetting.enabled?.entry_limit
      || additionalSetting.enabled?.entry_limit_by_user
      || additionalSetting.settings?.blocked_ip?.[0]?.ip
      || additionalSetting.settings?.blocked_ip?.[0]?.ip
    setStyles(prevStyle => create(prevStyle, draft => {
      if (isTrue) {
        assignNestedObj(draft, 'form', {
          ...draft.form,
          [`._frm-ovrly-b${formID}`]: {
            display: 'flex',
            background: 'hsla(0, 0%, 0%, 32%)',
            position: 'absolute',
            top: 0,
            left: 0,
            'z-index': 9999,
            width: '100%',
            height: '100%',
            'align-items': 'center',
            'justify-content': 'center',
            overflow: 'auto',
            padding: '15px',
            color: 'hsla(0, 0%, 100%, 100%)',
            'border-radius': '5px',
          },
          [`._frm-ovrly-msg-b${formID}`]: {
            background: 'hsla(0, 0%, 100%, 100%)',
            padding: '20px',
            'border-radius': '5px',
            color: 'hsla(0, 100%, 50%, 100%)',
          },
        })
        assignNestedObj(draft, `form->._frm-bg-b${formID}`, { position: 'relative' })
      } else {
        deleteNestedObj(draft, `form->._frm-ovrly-b${formID}`)
        deleteNestedObj(draft, `form->._frm-ovrly-msg-b${formID}`)
        deleteNestedObj(draft, `form->._frm-bg-b${formID}->position`)
      }
    }))
  }, [additionalSetting])

  const setAdditionalSettingsStyle = (e, setting) => {
    const additionalSettings = deepCopy(additionalSetting)
    if (e.target.checked) {
      additionalSettings.enabled[setting] = true
    } else {
      delete additionalSettings.enabled[setting]
    }
    additionalSettings.updateForm = 1
    setadditional(additionalSettings)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const setOnePerIp = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.singleEntry })
      return
    }
    setAdditionalSettingsStyle(e, 'onePerIp')
    // saveForm('addional', additionalSettings)
  }

  const storeSubmission = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.disableEntryStoring })
      return
    }
    const additionalSettings = deepCopy(additionalSetting)
    if (e.target.checked) {
      additionalSettings.enabled.submission = true
    } else {
      delete additionalSettings.enabled.submission
    }
    setadditional(additionalSettings)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }
  const setCustomMsg = (e, typ) => {
    if (!IS_PRO) return
    const additionalSettings = deepCopy(additionalSetting)
    additionalSettings.settings[typ][e.target.name] = e.target.value
    setadditional(additionalSettings)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const setSettingsMessages = (e, typ) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.customMessages })
      return
    }
    const additionalSettings = deepCopy(additionalSetting)
    if (!additionalSettings.settings.messages) additionalSettings.settings.messages = {}
    additionalSettings.settings.messages[typ] = e.target.value
    setadditional(additionalSettings)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const enableReCaptchav3 = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      let msg
      if (!reCaptchaV3 || !reCaptchaV3?.siteKey || !reCaptchaV3?.secretKey) {
        msg = __(<p>
          to use ReCaptchaV3, you must set site key and secret from
          &nbsp;
          <Link to="/app-settings/recaptcha">app settings</Link>
        </p>)
        setAlertMdl({ show: true, msg })
        return false
      }

      const captchaFlds = fields ? Object.values(fields).find(fld => fld.typ === 'recaptcha') : undefined

      if (captchaFlds) {
        msg = __(<p>
          You can use either ReCaptchaV2 or ReCaptchaV3 in a form. to use ReCaptchaV3 remove the ReCaptchaV2 from the form builder.
        </p>)
        setAlertMdl({ show: true, msg })
        return false
      }

      additional.enabled.recaptchav3 = true
      additional.updateForm = 1
      if (!additional.settings.recaptchav3) {
        additional.settings.recaptchav3 = {
          score: '0.6',
          message: __('ReCaptcha validation failed.'),
        }
      }
    } else {
      delete additional.enabled.recaptchav3
      additional.updateForm = 1
      delete additional.settings.recaptchav3
    }
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const toggleCaptureGCLID = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.captureGCLID })
      return false
    }
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.captureGCLID = true
    } else {
      delete additional.enabled.captureGCLID
    }
    additional.updateForm = 1
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm('addional', additional)
  }

  const tolggleHoneypot = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.honeypot })
      return false
    }
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.honeypot = true
    } else {
      delete additional.enabled.honeypot
    }
    additional.updateForm = 1
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm('addional', additional)
  }

  const handleEntryLimit = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.entryLimit })
      return
    }
    const propertyName = e.target.name
    const additionalSettings = deepCopy(additionalSetting)
    if (e.target.checked) {
      additionalSettings.enabled[propertyName] = true
      if (propertyName === 'entry_limit') {
        if (!additionalSettings.settings?.entry_limit) {
          additionalSettings.settings.entry_limit = 1
        }
        if (!additionalSettings.settings?.entry_limit_count_type) {
          additionalSettings.settings.entry_limit_count_type = 'total'
        }
        if (!additionalSettings.settings?.messages) {
          additionalSettings.settings.messages = {}
        }
        if (!additionalSettings.settings?.messages?.entry_limit_message) {
          additionalSettings.settings.messages.entry_limit_message = __('The form has reached its maximum number of submissions.')
        }
      } else if (propertyName === 'entry_limit_by_user') {
        if (!additionalSettings.settings?.entry_limit_by_user) {
          additionalSettings.settings.entry_limit_by_user = 1
        }
        if (!additionalSettings.settings?.entry_limit_by_user_type) {
          additionalSettings.settings.entry_limit_by_user_type = 'per_user_ip'
        }
        if (!additionalSettings.settings?.entry_limit_by_user_count_type) {
          additionalSettings.settings.entry_limit_by_user_count_type = 'total'
        }
        if (!additionalSettings.settings?.messages) {
          additionalSettings.settings.messages = {}
        }
        if (!additionalSettings.settings?.messages?.entry_limit_per_user_message) {
          additionalSettings.settings.messages.entry_limit_per_user_message = __('You have reached the maximum number of submissions allowed.')
        }
      }
    } else {
      delete additionalSettings.enabled[propertyName]
    }
    additionalSettings.updateForm = 1
    setadditional(additionalSettings)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // setAdditionalSettingsStyle(e, e.target.name)
  }

  const hideReCaptchaBadge = e => {
    const additional = deepCopy(additionalSetting)
    if (!additional.settings.recaptchav3) additional.settings.recaptchav3 = {}
    setStaticStyleState(prvStyle => create(prvStyle, draft => {
      if (e.target.checked) {
        additional.settings.recaptchav3.hideReCaptcha = true
        const path = 'staticStyles->.grecaptcha-badge->visibility'
        assignNestedObj(draft, path, 'hidden !important')
      } else {
        delete additional.settings.recaptchav3.hideReCaptcha
        const path = 'staticStyles->.grecaptcha-badge'
        deleteNestedObj(draft, path)
      }
    }))
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm('addional', additional)
  }

  const setReCaptchaScore = e => {
    const additional = deepCopy(additionalSetting)
    const { value } = e.target
    if (!additional.settings.recaptchav3) additional.settings.recaptchav3 = {}
    if (value) {
      if (Number(value) < 0) additional.settings.recaptchav3.score = 0
      else if (Number(value) > 1) additional.settings.recaptchav3.score = 1
      else additional.settings.recaptchav3.score = value
    } else {
      delete additional.settings.recaptchav3.score
    }
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const setReCaptchaLowScoreMessage = e => {
    const additional = deepCopy(additionalSetting)
    const { value } = e.target
    if (!additional.settings.recaptchav3) additional.settings.recaptchav3 = {}
    if (value) {
      additional.settings.recaptchav3.message = value
    } else {
      delete additional.settings.recaptchav3.message
    }
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleIpStatus = (e, i, type) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...(type === 'private' ? proHelperData.private_ip : proHelperData.blocked_ip) })
      return
    }
    const additional = deepCopy(additionalSetting)
    if (type === 'private') {
      additional.settings.private_ip[i].status = e.target.checked
      if (e.target.checked) {
        additional.enabled.private_ip = true
      } else if (additional.settings.private_ip.some(itm => itm.status === true)) {
        additional.enabled.private_ip = true
      } else if (!(additional.settings.private_ip.some(itm => itm.status === true))) {
        delete additional.enabled.private_ip
      }
    } else {
      additional.settings.blocked_ip[i].status = e.target.checked
      if (e.target.checked) {
        additional.enabled.blocked_ip = true
      } else if (additional.settings.blocked_ip.some(itm => itm.status === true)) {
        additional.enabled.private_ip = true
      } else if (!(additional.settings.blocked_ip.some(itm => itm.status === true))) {
        delete additional.enabled.blocked_ip
      }
    }
    additional.updateForm = 1
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleIp = (e, i, typ) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...(typ === 'private' ? proHelperData.private_ip : proHelperData.blocked_ip) })
      return
    }
    const additional = deepCopy(additionalSetting)
    if (typ === 'blocked') {
      additional.settings.blocked_ip[i].ip = e.target.value
    } else {
      additional.settings.private_ip[i].ip = e.target.value
    }
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const toggleAllIpStatus = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.blocked_ip })
      return false
    }
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.blocked_ip = true
      for (let i = 0; i < additional.settings.blocked_ip.length; i += 1) {
        additional.settings.blocked_ip[i].status = true
      }
    } else {
      delete additional.enabled.blocked_ip
      for (let i = 0; i < additional.settings.blocked_ip.length; i += 1) {
        additional.settings.blocked_ip[i].status = false
      }
    }
    additional.updateForm = 1
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm('addional', additional)
  }

  const toggleAllPvtIpStatus = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.private_ip })
      return false
    }
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.private_ip = true
      for (let i = 0; i < additional.settings.private_ip.length; i += 1) {
        additional.settings.private_ip[i].status = true
      }
    } else {
      delete additional.enabled.private_ip
      for (let i = 0; i < additional.settings.private_ip.length; i += 1) {
        additional.settings.private_ip[i].status = false
      }
    }
    additional.updateForm = 1
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm('addional', additional)
  }

  const handleRestrictFrom = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.limit_submission })
      return false
    }
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      if (additional.settings.restrict_form === undefined
        || additional.settings.restrict_form.date === undefined
        || additional.settings.restrict_form.time === undefined) {
        additional.settings.restrict_form = { day: ['Everyday'], date: { from: new Date(), to: new Date() }, time: { from: '00:00', to: '23:59' } }
      }
      additional.enabled.restrict_form = true
    } else {
      delete additional.enabled.restrict_form
    }
    additional.updateForm = 1
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm('addional', additional)
  }

  const checkAllDayInArr = arr => {
    let flg = false
    for (let i = 0; i < arr.length; i += 1) {
      if (arr.length === 7 && (arr[i] === 'Friday'
        || arr[i] === 'Saturday'
        || arr[i] === 'Sunday'
        || arr[i] === 'Monday'
        || arr[i] === 'Tuesday'
        || arr[i] === 'Wednesday'
        || arr[i] === 'Thursday')) {
        flg = true
      } else {
        flg = false
      }
    }
    return flg
  }

  const handleDate = (val, typ) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.limit_submission })
      return false
    }
    if (!val) hideAll()
    let date = val
    if (val) date = dateTimeFormatter(val, 'Y-m-d')
    setadditional(prvState => create(prvState, drft => {
      if (!drft.settings) drft.settings = {}
      if (!drft.settings.restrict_form) drft.settings.restrict_form = {}
      if (!drft.settings.restrict_form.date) drft.settings.restrict_form.date = {}
      drft.settings.restrict_form.date[typ] = date
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleTime = (formatted24time, typ) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.limit_submission })
      return false
    }
    setadditional(prvState => create(prvState, drft => {
      if (!drft.settings) drft.settings = {}
      if (!drft.settings.restrict_form) drft.settings.restrict_form = {}
      if (!drft.settings.restrict_form.time) drft.settings.restrict_form.time = {}
      drft.settings.restrict_form.time[typ] = formatted24time
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const setRestrictForm = e => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.limit_submission })
      return false
    }
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      if ('restrict_form' in additional.settings && 'day' in additional.settings.restrict_form) {
        if (e.target.value === 'Everyday' || checkAllDayInArr(additional.settings.restrict_form.day)) {
          additional.settings.restrict_form.day = ['Everyday']
        } else if (e.target.value === 'Custom') {
          additional.settings.restrict_form.day = ['Custom']
          additional.settings.restrict_form.date = { from: new Date(), to: new Date() }
        } else {
          if (additional.settings.restrict_form.day.indexOf('Custom') > -1) {
            const i = additional.settings.restrict_form.day.indexOf('Custom')
            additional.settings.restrict_form.day.splice(i, 1)
          }
          additional.settings.restrict_form.day.push(e.target.value)
        }
      } else {
        if (!('restrict_form' in additional.settings)) {
          additional.settings.restrict_form = {}
        }
        additional.settings.restrict_form.day = []
        if (e.target.value === 'Everyday' || checkAllDayInArr(additional.settings.restrict_form.day)) {
          additional.settings.restrict_form.day = ['Everyday']
        } else if (e.target.value === 'Custom') {
          additional.settings.restrict_form.day = ['Custom']
        } else {
          if (additional.settings.restrict_form.day.indexOf('Custom') > -1) {
            const i = additional.settings.restrict_form.day.indexOf('Custom')
            additional.settings.restrict_form.day.splice(i, 1)
          }
          additional.settings.restrict_form.day.push(e.target.value)
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (e.target.value === 'Everyday') {
        additional.settings.restrict_form.day = ['Friday']
      } else if (e.target.value === 'Custom') {
        additional.settings.restrict_form.day = ['Everyday']
      } else if (e.target.value !== 'Everyday' && e.target.value !== 'Custom' && additional.settings.restrict_form.day.indexOf('Everyday') > -1) {
        const days = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
        days.splice(days.indexOf(e.target.value), 1)
        additional.settings.restrict_form.day = days
      } else {
        const i = additional.settings.restrict_form.day.indexOf(e.target.value)
        additional.settings.restrict_form.day.splice(i, 1)
      }
    }
    setadditional({ ...additional })
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const checkRestrictFromExist = val => {
    const additional = deepCopy(additionalSetting)
    if ('restrict_form' in additional.settings
      && 'day' in additional.settings.restrict_form
      && additional.settings.restrict_form.day.some(itm => (itm === val))) {
      return true
    }
    if ('restrict_form' in additional.settings
      && 'day' in additional.settings.restrict_form
      && additional.settings.restrict_form.day.some(itm => (itm === val || itm === 'Everyday'))
      && val !== 'Custom'
    ) {
      return true
    }
    return false
  }

  const showToleranceLabel = score => {
    if (score) {
      if (score < 0.45) {
        return 'Low'
      }
      if (score < 0.75) {
        return 'Medium'
      }
      if (score >= 0.75) {
        return 'High'
      }
    }
    return 'Medium'
  }

  const toggleCaptchaAdvanced = () => setShowCaptchaAdvanced(show => !show)

  const setValidateFocusLost = e => {
    const additional = deepCopy(additionalSetting)
    if (e.target.checked) {
      additional.enabled.validateFocusLost = true
    } else {
      delete additional.enabled.validateFocusLost
    }
    additional.updateForm = 1
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
    // saveForm('addional', additional)
  }

  const setAccordingEnable = (e, type, title) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData[type] })
      return
    }
    const additional = deepCopy(additionalSetting)

    let msg = ''
    if (type === 'is_login') msg = __('You must be logged in.')
    else msg = __('Empty form cannot be submitted.')

    if (e.target.checked) {
      if (!additional.settings[type]) {
        additional.settings[type] = { message: __(msg) }
      }
      additional.enabled[type] = true
    } else {
      delete additional.enabled[type]
      delete additional.settings[type]
    }
    setadditional(additional)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const fromDate = additionalSetting?.settings?.restrict_form?.date?.from
  const toDate = additionalSetting?.settings?.restrict_form?.date?.to
  const fromTime = additionalSetting?.settings?.restrict_form?.time?.from || '00:00'
  const toTime = additionalSetting?.settings?.restrict_form?.time?.to || '00:00'
  const timeConverter = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

    if (time.length > 1) {
      time = time.slice(1)
      time[5] = +time[0] < 12 ? 'AM' : 'PM'
      time[0] = +time[0] % 12 || 12
    }
    return time.join('')
  }

  return (
    <div>
      <h2>{__('Settings')}</h2>

      <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2">
              <IpBlockIcn size="22" />
            </span>
            <b>{__('Allow single entry for each IP address')}</b>
            <LearnmoreTip {...tutorialLinks.singleEntry} />
            {!IS_PRO && <ProBadge proProperty="singleEntry" />}
          </div>
          <SingleToggle2
            action={setOnePerIp}
            checked={'onePerIp' in additionalSetting.enabled}
            className="flx"
          />
        </div>
      </div>

      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2"><LoginIcn size={20} /></span>
              {__('Require user to be logged in for submit form')}
            </b>
            <LearnmoreTip {...tutorialLinks.requiredLoggedInUser} />
          </span>
        )}
        toggle
        action={(e) => setAccordingEnable(e, 'is_login', 'User Require Login')}
        checked={'is_login' in additionalSetting.enabled}
        cls="w-6 mt-3"
        isPro
        proProperty="is_login"
      >
        <div className="mb-2 ml-2">
          <b>Error message</b>
          <br />
          <input
            aria-label="Error messages"
            type="text"
            placeholder="Error message"
            name="message"
            className="btcd-paper-inp w-6 mt-1"
            onChange={(e) => setCustomMsg(e, 'is_login')}
            value={additionalSetting.settings?.is_login?.message}
          />
        </div>
      </Accordions>
      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2">
                <EmptyIcn size="20" />
              </span>
              {__('Prevent empty form submission')}
            </b>
            <LearnmoreTip {...tutorialLinks.emptySubmission} />
          </span>
        )}
        cls="w-6 mt-3"
        toggle
        action={(e) => setAccordingEnable(e, 'empty_submission', 'Empty Submission')}
        checked={additionalSetting?.enabled?.empty_submission || false}
        isPro
        proProperty="empty_submission"
      >
        <div className="mb-2 ml-2">
          <b>Error message</b>
          <br />
          <input aria-label="Error messages" type="text" placeholder="Error message" name="message" className="btcd-paper-inp w-6 mt-1" onChange={(e) => setCustomMsg(e, 'empty_submission')} value={additionalSetting.settings?.empty_submission?.message} />
        </div>

      </Accordions>

      <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2 flx">
              <FocusIcn size="20" />
            </span>
            <b>
              {__('Validate form input on focus lost')}
            </b>
            <LearnmoreTip {...tutorialLinks.validateFocusLost} />
          </div>
          <SingleToggle2 action={setValidateFocusLost} checked={'validateFocusLost' in additionalSetting.enabled} className="flx" />
        </div>
      </div>

      <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2">
              <DBIcn size="20" />
            </span>
            <b>
              {__('Disable entry storing in WordPress database')}
            </b>
            <LearnmoreTip {...tutorialLinks.disableEntryStoring} />
            {!IS_PRO && <ProBadge proProperty="submission" />}
          </div>
          <SingleToggle2 action={storeSubmission} checked={'submission' in additionalSetting.enabled} className="flx" />
        </div>
      </div>
      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2">
                <ReCaptchaIcn size="20" />
              </span>
              {__('Enable ReCaptcha V3')}
            </b>
            <LearnmoreTip {...tutorialLinks.recaptchaV3} />
          </span>
        )}
        cls="w-6 mt-3"
      >
        <div className="flx mb-2 ml-2">
          <SingleToggle2 action={enableReCaptchav3} checked={'recaptchav3' in additionalSetting.enabled} className="flx" />
          {__('Enable / Disable')}
        </div>
        {additionalSetting.enabled.recaptchav3 && (
          <>
            <div className="flx mb-4 ml-2">
              <SingleToggle2 action={hideReCaptchaBadge} checked={additionalSetting.settings?.recaptchav3?.hideReCaptcha || ''} className="flx" />
              {__('Hide ReCaptcha Badge')}
            </div>
            <span
              className="btcd-link mb-4 ml-2"
              onClick={toggleCaptchaAdvanced}
              onKeyDown={toggleCaptchaAdvanced}
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
            >
              {__(`${!showCaptchaAdvanced ? 'Show' : 'Hide'} Advanced Settings`)}
            </span>
            {showCaptchaAdvanced && (
              <>
                <div className="mt-3 mb-4 ml-2">
                  <b>Tolerance Level</b>
                  <br />
                  <div className="flx mt-1">
                    <div className="mt-1">
                      <input aria-label="Recaptcha tolerance label range input" type="range" className="btc-range mr-2" min="0.3" max="0.9" step="0.3" onChange={setReCaptchaScore} value={additionalSetting.settings?.recaptchav3?.score} />
                      <p className="m-0">
                        <b>{showToleranceLabel(additionalSetting.settings?.recaptchav3?.score)}</b>
                      </p>
                    </div>
                    <input aria-label="Recaptcha tolerance label input" className="btcd-paper-inp w-1" type="number" min="0" max="1" step="0.1" onChange={setReCaptchaScore} value={additionalSetting.settings?.recaptchav3?.score} />
                  </div>

                </div>
                <div className="mb-2 ml-2">
                  <b>Low Score Message</b>
                  <br />
                  <input aria-label="Low Score Messages" type="text" placeholder="Low Score Message" className="btcd-paper-inp w-6 mt-1" onChange={setReCaptchaLowScoreMessage} value={additionalSetting.settings?.recaptchav3?.message} />
                </div>
              </>
            )}
          </>
        )}
      </Accordions>

      <div className="w-6 mt-3">
        <div className={`flx flx-between sh-sm br-10 btcd-setting-opt cooltip-box ${!IS_PRO && 'btcd-inte-pro'}`}>
          <div className="">
            <div className="flx">
              <HoneypotIcn w="20" h="19" />
              <span className="flx ml-2">
                <b>{__('Honeypot trap for bot')}</b>
                <LearnmoreTip {...tutorialLinks.honeypot} />
                {!IS_PRO && (<ProBadge proProperty="honeypot" />)}
              </span>
            </div>
          </div>
          <div className="flx">
            <SingleToggle2 action={tolggleHoneypot} checked={'honeypot' in additionalSetting.enabled} className="flx" />
          </div>
        </div>
      </div>

      {/* <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2"><NoneIcn size="15" /></span>
              {__('Disable this form after limited entry')}
            </b>
            <LearnmoreTip {...tutorialLinks.limitEntry} />
            {!IS_PRO && (<ProBadge proProperty="entryLimit" />)}
          </div>
          <div className="flx">
            <input name="entry_limit" aria-label="Disable this form after limited entry" onChange={setEntryLimitSettings} value={additionalSetting.settings.entry_limit} disabled={!('entry_limit' in additionalSetting.enabled)} className="btcd-paper-inp mr-2 wdt-200" placeholder="Limit" type="number" min="1" />
            <SingleToggle2 action={handleEntryLimit} checked={'entry_limit' in additionalSetting.enabled} className="flx" />
          </div>
        </div>
      </div> */}

      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2">
                <DateIcn w="15" />
              </span>
              {__('Manage Submission Limits (by count, time, or user)')}
            </b>
            <LearnmoreTip {...tutorialLinks.limitEntry} />
          </span>
        )}
        cls="w-6 mt-3"
        isPro
        proProperty="restrict_form"
        // toggle
        // checked={'entry_limit' in additionalSetting.enabled || false}
        action={handleEntryLimit}
      >
        <div className="mb-4">
          <TableCheckBox
            name="entry_limit"
            onChange={e => handleEntryLimit(e)}
            title={__('Limit By Submission Count')}
            checked={'entry_limit' in additionalSetting.enabled}
            className={css(ut.flxc, ut.mb1)}
          />
          <Grow
            open={'entry_limit' in additionalSetting.enabled}
            classNames="wrapper-left-border"
          >
            <input
              title={__('Submission Limit')}
              aria-label="Disable this form after limited entry"
              name="entry_limit"
              onChange={setEntryLimitSettings}
              value={additionalSetting.settings.entry_limit}
              disabled={!('entry_limit' in additionalSetting.enabled)}
              className="btcd-paper-inp mr-2 wdt-150"
              placeholder="Limit Total Entry"
              type="number"
              min="1"
            />

            <Select
              title={__('Limit period type')}
              className="btcd-paper-inp "
              value={additionalSetting.settings.entry_limit_count_type}
              inputName="entry_limit_count_type"
              onChange={(val, e) => setEntryLimitSettings(e)}
              options={[
                { label: 'Total Entries', value: 'total' },
                { label: 'Per Minute', value: 'per_minute' },
                { label: 'Per hour', value: 'per_hour' },
                { label: 'Per Day', value: 'per_day' },
                { label: 'Per Week', value: 'per_week' },
                { label: 'Per Month', value: 'per_month' },
                { label: 'Per Year', value: 'per_year' },
              ]}
              w={'200px !important'}
            />

            <div className="mt-2 d-flx flx-col">
              <label htmlFor="limit-message-input">Limit message</label>

              <textarea
                id="limit-message-input"
                aria-label="Error messages"
                type="textarea"
                placeholder="Form Limit message"
                name="entry_limit_message"
                className="btcd-paper-inp w-9 mt-1"
                onChange={(e) => setSettingsMessages(e, 'entry_limit_message')}
                value={additionalSetting.settings?.messages?.entry_limit_message}
              />
            </div>
          </Grow>
        </div>

        <div>
          <TableCheckBox
            name="entry_limit_by_user"
            onChange={e => handleEntryLimit(e)}
            title={__('Limit By Per User')}
            checked={'entry_limit_by_user' in additionalSetting.enabled}
            className={css(ut.flxc, ut.mt2, ut.mb1)}
          />
          <Grow
            open={'entry_limit_by_user' in additionalSetting.enabled}
            classNames="wrapper-left-border"
          >

            <input
              aria-label="Disable this form after limited entry"
              name="entry_limit_by_user"
              onChange={setEntryLimitSettings}
              value={additionalSetting.settings.entry_limit_by_user}
              disabled={!('entry_limit_by_user' in additionalSetting.enabled)}
              className="btcd-paper-inp mr-2 wdt-150"
              placeholder="Limit User Entry"
              type="number"
              min="1"
            />

            <Select
              title={__('User verify type')}
              className="btcd-paper-inp"
              inputName="entry_limit_by_user_type"
              value={additionalSetting.settings.entry_limit_by_user_type}
              onChange={(val, e) => setEntryLimitSettings(e)}
              options={[
                { label: 'Per User (IP Address)', value: 'per_user_ip' },
                { label: 'Per User (Logged in ID)', value: 'per_user_id' },
              ]}
              w={'200px !important'}
            />
            {/* {
            ['per_user_ip', 'per_user_id'].includes(additionalSetting.settings.entry_limit) && ( */}
            <Select
              title={__('Limit period type')}
              className="btcd-paper-inp w-2 ml-2"
              value={additionalSetting.settings.entry_limit_by_user_count_type}
              inputName="entry_limit_by_user_count_type"
              onChange={(val, e) => setEntryLimitSettings(e)}
              options={[
                { label: 'Total Per User Entries', value: 'total' },
                { label: 'Per Minute', value: 'per_minute' },
                { label: 'Per hour', value: 'per_hour' },
                { label: 'Per Day', value: 'per_day' },
                { label: 'Per Week', value: 'per_week' },
                { label: 'Per Month', value: 'per_month' },
                { label: 'Per Year', value: 'per_year' },
              ]}
              w={150}
            />

            <div className="mt-2 d-flx flx-col">
              <label htmlFor="limit-per-user-message-input">Limit message</label>
              <textarea
                id="limit-per-user-message-input"
                aria-label="Error messages"
                type="textarea"
                placeholder="Form Limit message"
                name="entry_limit_per_user_message"
                className="btcd-paper-inp w-9 mt-1"
                onChange={(e) => setSettingsMessages(e, 'entry_limit_per_user_message')}
                value={additionalSetting.settings?.messages?.entry_limit_per_user_message}
              />
            </div>
          </Grow>
        </div>

      </Accordions>
      {/* // temproray block for Date/Time library issue */}
      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2">
                <DateIcn w="15" />
              </span>
              {__('Limit Form Submission Period')}
            </b>
            <LearnmoreTip {...tutorialLinks.limitPeriod} />
          </span>
        )}
        cls="w-6 mt-3"
        isPro
        proProperty="restrict_form"
        toggle
        checked={'restrict_form' in additionalSetting.enabled || false}
        action={handleRestrictFrom}
      >
        {/* <div className="flx mb-2 ml-2">
          <SingleToggle2 cls="flx" action={handleRestrictFrom} checked={'restrict_form' in additionalSetting.enabled} />
          {__('Enable / Disable')}
        </div> */}
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Everyday')} value="Everyday" title={__('Every Day')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Friday')} value="Friday" title={__('Friday')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Saturday')} value="Saturday" title={__('Saturday')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Sunday')} value="Sunday" title={__('Sunday')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Monday')} value="Monday" title={__('Monday')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Tuesday')} value="Tuesday" title={__('Tuesday')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Wednesday')} value="Wednesday" title={__('Wednesday')} />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Thursday')} value="Thursday" title={__('Thursday')} />
        <br />
        <CheckBox onChange={setRestrictForm} checked={checkRestrictFromExist('Custom')} value="Custom" title={__('Custom Date')} />
        {'restrict_form' in additionalSetting.settings && additionalSetting.settings.restrict_form.day.indexOf('Custom') > -1 && (

          <div className="flx">
            <span className="mt-2 ml-2">Date:</span>
            <div className="mr-2 ml-2">
              <div><small>{__('From')}</small></div>
              <Downmenu>
                <div className="btcd-custom-date-range white" style={{ width: 175 }}>
                  {fromDate && (
                    <>
                      <span className="m-a">
                        {dateTimeFormatter(fromDate || '', 'm-d-Y')}
                      </span>
                      <button
                        aria-label="Close"
                        type="button"
                        className="icn-btn"
                        onClick={() => handleDate('', 'from')}
                      >
                        <CloseIcn size="12" />
                      </button>
                    </>
                  )}
                  {!fromDate && (
                    <span className="m-a">
                      Select From Date
                    </span>
                  )}
                </div>

                <DayPicker
                  mode="single"
                  selected={fromDate ? new Date(fromDate) : ''}
                  onSelect={val => handleDate(val, 'from')}
                />
              </Downmenu>
            </div>
            <div>
              <div><small>{__('To')}</small></div>
              <Downmenu>
                <div className="btcd-custom-date-range white" style={{ width: 175 }}>
                  {toDate && (
                    <>
                      <span className="m-a">
                        {dateTimeFormatter(toDate || '', 'm-d-Y')}
                      </span>
                      <button
                        aria-label="Close"
                        type="button"
                        className="icn-btn"
                        onClick={() => handleDate('', 'to')}
                      >
                        <CloseIcn size="12" />
                      </button>
                    </>
                  )}
                  {!toDate && (
                    <span className="m-a">
                      Select To Date
                    </span>
                  )}
                </div>
                <DayPicker
                  mode="single"
                  selected={toDate ? new Date(toDate) : ''}
                  onSelect={val => handleDate(val, 'to')}
                />
              </Downmenu>
            </div>
          </div>
        )}

        <div className="flx mt-2">
          <span className="mt-2 ml-2">{__('Time:')}</span>
          <div className="mr-2 ml-2">
            <div><small>{__('From')}</small></div>
            <Downmenu>
              <div className="btcd-custom-date-range white" style={{ width: 175 }}>
                {fromTime && (
                  <>
                    <span className="m-a">
                      {timeConverter(fromTime)}
                    </span>
                    <button
                      aria-label="Close"
                      type="button"
                      className="icn-btn"
                      onClick={() => handleTime('', 'from')}
                    >
                      <CloseIcn size="12" />
                    </button>
                  </>
                )}
                {!fromTime && (
                  <span className="m-a">
                    Select To Time
                  </span>
                )}
              </div>
              <Timekeeper
                time={fromTime || new Date()}
                closeOnMinuteSelect
                onChange={({ formatted24 }) => handleTime(formatted24, 'from')}
              />
            </Downmenu>
          </div>
          <div>
            <div><small>{__('To')}</small></div>
            <Downmenu>
              <div className="btcd-custom-date-range white" style={{ width: 175 }}>
                {toTime && (
                  <>
                    <span className="m-a">
                      {timeConverter(toTime)}
                    </span>
                    <button
                      aria-label="Close"
                      type="button"
                      className="icn-btn"
                      onClick={() => handleTime('', 'to')}
                    >
                      <CloseIcn size="12" />
                    </button>
                  </>
                )}
                {!toTime && (
                  <span className="m-a">
                    Select To Time
                  </span>
                )}
              </div>
              <Timekeeper
                time={toTime || new Date()}
                closeOnMinuteSelect
                onChange={({ formatted24 }) => handleTime(formatted24, 'to')}
              />
            </Downmenu>
          </div>
        </div>
      </Accordions>

      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2">
                <BlockIcn size="20" />
              </span>
              {__('Blocked IP list')}
            </b>
            <LearnmoreTip {...tutorialLinks.blockedIp} />
          </span>
        )}
        cls="w-6 mt-3"
        isPro
        proProperty="blocked_ip"
      >
        {'blocked_ip' in additionalSetting.settings && additionalSetting.settings.blocked_ip.length > 0 && (
          <div className="flx mb-2">
            <SingleToggle2
              cls="flx"
              action={toggleAllIpStatus}
              checked={'blocked_ip' in additionalSetting.enabled && additionalSetting.enabled.blocked_ip}
            />
            {__('Enable / Disable')}
          </div>
        )}

        {'blocked_ip' in additionalSetting.settings && additionalSetting.settings.blocked_ip.map((itm, i) => (
          <div className="flx mt-1" key={`blk-ip-${i + 11}`}>
            <SingleToggle2 action={(e) => handleIpStatus(e, i)} checked={itm.status} />
            <input type="text" onChange={(e) => handleIp(e, i, 'blocked')} className="btcd-paper-inp" value={itm.ip} placeholder="000.0.0.00" />
            <button onClick={() => delBlkIp(i)} className="icn-btn ml-2" aria-label="delete" type="button"><TrashIcn /></button>
          </div>
        ))}
        <div className="txt-center">
          <button onClick={addMoreBlockIp} className="icn-btn sh-sm mt-1" type="button">+</button>
        </div>
      </Accordions>

      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2">
                <LockIcn size="18" />
              </span>
              {__('Allowed IP')}
            </b>
            <LearnmoreTip {...tutorialLinks.allowedIp} />
          </span>
        )}
        cls="w-6 mt-3"
        isPro
        proProperty="private_ip"
      >
        <div>
          <b>
            {__('Note')}
            :
          </b>
          {' '}
          {__('By enabling this option only listed IP can submit this form.')}
        </div>

        {'private_ip' in additionalSetting.settings && additionalSetting.settings.private_ip.length > 0 && (
          <div className="flx mb-2 mt-3">
            <SingleToggle2 cls="flx" action={toggleAllPvtIpStatus} checked={'private_ip' in additionalSetting.enabled && additionalSetting.enabled.private_ip} />
            {__('Enable / Disable')}
          </div>
        )}

        {'private_ip' in additionalSetting.settings && additionalSetting.settings.private_ip.map((itm, i) => (
          <div className="flx mt-1" key={`blk-ip-${i + 11}`}>
            <SingleToggle2 action={(e) => handleIpStatus(e, i, 'private')} checked={itm.status} />
            <input aria-label="ip" type="text" onChange={(e) => handleIp(e, i, 'private')} className="btcd-paper-inp" value={itm.ip} placeholder="000.0.0.00" />
            <button onClick={() => delPrivateIp(i)} className="icn-btn ml-2" aria-label="delete" type="button"><TrashIcn /></button>
          </div>
        ))}
        <div className="txt-center">
          <button onClick={addMorePrivateIp} className="icn-btn sh-sm mt-1" type="button">+</button>
        </div>
      </Accordions>

      <div className="w-6 mt-3">
        <div className={`flx flx-between sh-sm br-10 btcd-setting-opt ${!IS_PRO && 'btcd-inte-pro'}`}>
          <div className="flx">
            <GoogleAdIcn size={18} />
            <b className="ml-2">{__('Capture Google Ads (Click ID)')}</b>
            <LearnmoreTip {...tutorialLinks.googleAdds} />
            {!IS_PRO && (<ProBadge proProperty="captureGCLID" />)}
          </div>
          <SingleToggle2 action={toggleCaptureGCLID} checked={'captureGCLID' in additionalSetting.enabled} className="flx" />
        </div>
      </div>

      {/* <div className="w-6 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2">
              <IpBlockIcn size="22" />
            </span>
            <b>{__('Form Entry Edit (for logged in users only)')}</b>
            {!IS_PRO && <ProBadge proProperty="formEntryEdit" />}
          </div>
          <SingleToggle2
            action={setFormEntryEdit}
            checked={'form_entry_edit' in additionalSetting.enabled}
            className="flx"
          />
        </div>
      </div> */}

      {/* <div>
        <Modal
          sm
          show={proModal.show}
          setModal={() => setProModal({ show: false })}
          title={__('Premium Feature')}
          className="pro-modal"
        >
          <h4 className="txt-center mt-5">
            {proModal.msg}
          </h4>
          <div className="txt-center">
            <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer"><button className="btn btn-lg blue" type="button">{__('Buy Premium')}</button></a>
          </div>

        </Modal>
      </div> */}
      <div className="mb-4 mt-4"><br /></div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="red"
        btnTxt="Close"
        show={alertMdl.show}
        close={clsAlertMdl}
        action={clsAlertMdl}
        title="Sorry"
      >
        <div className="txt-center">
          {alertMdl.msg}
        </div>
      </ConfirmModal>
    </div>
  )
}
