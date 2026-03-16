/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-param-reassign */
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { $bits, $fieldsArr, $formId, $updateBtn } from '../../../GlobalStates/GlobalStates'
import EditIcn from '../../../Icons/EditIcn'
import { IS_PRO, deepCopy } from '../../../Utils/Helpers'
import { dblOptinTamplate } from '../../../Utils/StaticData/tamplate'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import useSWROnce from '../../../hooks/useSWROnce'
import app from '../../../styles/app.style'
import Loader from '../../Loaders/Loader'
import Btn from '../../Utilities/Btn'
import Cooltip from '../../Utilities/Cooltip'
import SingleToggle2 from '../../Utilities/SingleToggle2'
import SnackMsg from '../../Utilities/SnackMsg'
import EmailNotification from '../../WPAuth/EmailNotification'
import RedirectEmailVerified from '../../WPAuth/Registration/RedirectEmailVerified'

export default function DoubleOptin() {
  const { css } = useFela()
  const [tem, setTem] = useState(
    {
      sub: 'Confirm the submission',
      body: dblOptinTamplate,
      dflt_temp: true,
      day: 1,
      custom_redirect: 0,
      acti_succ_msg: 'Thanks for the confirmation.',
      already_activated_msg: 'Your mail is already confirmed!',
      invalid_key_msg: 'Sorry! Your URL Is Invalid!',
    },
  )
  const bits = useAtomValue($bits)
  const [customRedirectMdl, setCustomRedirectMdl] = useState(false)
  const [dfltTampMdl, setDfltTamMdl] = useState(false)
  const [status, setStatus] = useState(false)
  const { isPro, allPages } = bits
  const [isLoading, setIsLoading] = useState(false)
  const formFields = useAtomValue($fieldsArr)
  const [snack, setSnackbar] = useState({ show: false })
  const formID = useAtomValue($formId)
  const setUpdateBtn = useSetAtom($updateBtn)

  const { isLoading: isLoad, mutate: mutateDoubleOptIn } = useSWROnce('bitforms_get_double_opt_in', { formID }, {
    fetchCondition: IS_PRO,
    onSuccess: data => {
      setStatus(Number(data[0]?.status))
      const details = JSON.parse(data[0]?.integration_details)
      setTem(details)
    },
  })

  const handleInput = ({ target: { name, value } }) => {
    setTem(prev => ({ ...prev, [name]: value }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }
  const toggleHandle = ({ target: { checked } }, name) => {
    const temp = deepCopy(tem)
    if (checked) {
      temp[name] = true
    } else {
      delete temp[name]
    }
    setTem(temp)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleStatus = (e) => {
    if (!IS_PRO) return
    if (e.target.checked) {
      setStatus(1)
    } else {
      setStatus(0)
    }
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const saveSettings = (e) => {
    e.preventDefault()
    if (!IS_PRO) return

    if (tem.dflt_temp && (tem?.fldkey === undefined || tem?.fldkey === '')) {
      setSnackbar({ show: true, msg: __('Email field is mandatory for double opt-in.') })
      return
    }
    setIsLoading(true)

    const tmpConf = create(tem, draft => {
      draft.formId = formID
      draft.status = status
    })

    const prom = bitsFetch(
      tmpConf,
      'bitforms_save_double_opt_in',
    )
      .then((res) => {
        if (res?.success && !res?.data?.errors) {
          setIsLoading(false)
          mutateDoubleOptIn(tmpConf)
        }
      })
    toast.promise(prom, {
      success: __('Saved successfully.'),
      loading: __('Saving...'),
      error: __('Something went wrong, Try again.'),
    })
  }

  const wrpStyle = {}
  if (status) {
    wrpStyle.opacity = 1
    wrpStyle.pointerEvents = 'auto'
    wrpStyle.userSelect = 'auto'
  } else {
    wrpStyle.opacity = 0.6
    wrpStyle.pointerEvents = 'none'
    wrpStyle.userSelect = 'none'
  }

  return (
    <div className="pos-rel">
      <h2>{__('Double Opt-In')}</h2>
      <h5>
        {__('How to setup Double Opt-In & Send Email Notification:')}
        &nbsp;
        <a href={tutorialLinks.doubleOptIn.link} target="_blank" rel="noreferrer" className="yt-txt">
          {__('YouTube')}
        </a>
        &nbsp;
        <a href={tutorialLinks.doubleOptInDoc.link} target="_blank" rel="noreferrer" className="doc-txt">
          {__('Documentation')}
        </a>
      </h5>
      {!isPro && (
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
              <SnackMsg snack={snack} setSnackbar={setSnackbar} />
              <div className="mt-6 flx">
                <label htmlFor="status">
                  <b>{__('Enable')}</b>
                </label>
                <SingleToggle2 name="status" action={handleStatus} checked={status === 1} className="ml-4 flx" />
              </div>
              <div style={wrpStyle}>
                <br />

                {/* <div className="mt-1 ml-0 flx">
                  <SingleToggle2 action={(e) => toggleHandle(e, 'add_param')} checked={'add_param' in tem} className="ml-4 flx" />
                  <label htmlFor="status">
                    {__('Add the verifed e-mail address to the confirmation link as parameter to handle it afterwards.')}
                  </label>
                </div> */}

                <div className="flx">
                  <SingleToggle2
                    name="auto_unconfirmed_deleted"
                    action={(e) => toggleHandle(e, 'auto_unconfirmed_deleted')}
                    checked={'auto_unconfirmed_deleted' in tem}
                    className="flx"
                  />
                  <label htmlFor="auto_unconfirmed_deleted">
                    {__('Delete the unconfirmed entries from responses after days:')}
                  </label>
                  &nbsp;
                  <input
                    onChange={handleInput}
                    name="day"
                    value={tem?.day || 1}
                    disabled={!tem.auto_unconfirmed_deleted}
                    className="btcd-paper-inp mr-2 wdt-100"
                    placeholder="1"
                    type="number"
                    min="1"
                  />
                </div>

                <div className="mt-2 flx">
                  <SingleToggle2
                    name="disable_loggin_user"
                    action={(e) => toggleHandle(e, 'disable_loggin_user')}
                    checked={'disable_loggin_user' in tem}
                    className="flx"
                  />
                  <label htmlFor="disable_loggin_user">
                    {__('Disable double opt-in confirmation for logged in users.')}
                  </label>
                </div>

                {/* <div className="flx w-8">

                  <div className="w-4 mt-3">
                    <TableCheckBox name="dflt_temp" onChange={(e) => toggleHandle(e, 'dflt_temp')} title={__('Enable default template')} checked={!!tem?.dflt_temp} value={false} />
                  </div>
                </div> */}
                <div className="mt-4 flx">
                  <SingleToggle2
                    name="dflt_temp"
                    action={(e) => toggleHandle(e, 'dflt_temp')}
                    checked={!!tem?.dflt_temp}
                    className="flx"
                  />
                  <label htmlFor="dflt_temp">
                    {__('Configure default confirmation email template')}
                  </label>
                  <Cooltip
                    className="ml-1"
                    icnSize={14}
                    width={600}
                  >
                    {__('By disabling this option, you can configure the double opt-in confirmation email from Conditional Logics manually.')}
                  </Cooltip>
                </div>
                {tem?.dflt_temp && (
                  <div className="w-8">
                    <div className="w-5 mt-4">
                      <b>Email</b>
                      <br />
                      <select
                        className="btcd-paper-inp mt-1 w-9"
                        name="fldkey"
                        value={tem?.fldkey}
                        defaultValue="empty"
                        onChange={handleInput}
                      >
                        <option disabled value="empty">{__('Select Email Field')}</option>
                        {
                          formFields?.filter(fld => (fld.type === 'email')).map(header => (
                            <option key={`${header.key}-1`} value={header.key}>
                              {header.name}
                            </option>
                          ))
                        }
                      </select>

                    </div>
                    <div className="flx">
                      <button
                        type="button"
                        className={css(app.btn)}
                        onClick={() => setDfltTamMdl(true)}
                      >
                        <EditIcn size={18} />
                        &nbsp;
                        {__('Customize Email template')}
                      </button>
                      <EmailNotification
                        dataConf={tem}
                        setDataConf={setTem}
                        showMdl={dfltTampMdl}
                        setshowMdl={setDfltTamMdl}
                        title="Customize Email template"
                      />
                      {tem?.dflt_temp && (
                        <div className="ml-2">
                          <button
                            type="button"
                            className={css(app.btn)}
                            onClick={() => setCustomRedirectMdl(true)}
                          >
                            <EditIcn size={18} />
                            &nbsp;
                            {__('Edit verification messages')}
                          </button>
                          <RedirectEmailVerified
                            dataConf={tem}
                            setDataConf={setTem}
                            showMdl={customRedirectMdl}
                            setCustomRedirectMdl={setCustomRedirectMdl}
                            pages={allPages}
                            title="Edit verification messages"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {!tem?.dflt_temp && (
                  <>
                    <p className="mb-0">
                      <strong>Note: </strong>
                      <span>Please make sure you have configured the </span>
                      <strong>double opt-in</strong>
                      <span> from </span>
                      <strong>conditional logics.</strong>
                      <br />
                      <span>Otherwise, the confirmation message will not sent to the responder.</span>
                    </p>
                    <div>
                      <button type="button" className={css(app.btn)} onClick={() => setCustomRedirectMdl(true)}>
                        <EditIcn size={18} />
                        &nbsp;
                        {__('Edit verification messages')}
                      </button>
                      <RedirectEmailVerified
                        dataConf={tem}
                        setDataConf={setTem}
                        showMdl={customRedirectMdl}
                        setCustomRedirectMdl={setCustomRedirectMdl}
                        pages={allPages}
                        title="Show after verification"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="br-5 w-6">
                <p className="mt-0">
                  <strong>{__('Note :')}</strong>
                  {__('The webhook, email notification & integrations will trigger after the responder confirms their Opt-In.')}
                </p>
              </div>
              <Btn
                onClick={saveSettings}
                disabled={isLoading}
              >
                {__('Save ')}
              </Btn>
            </div>
          )
      }
    </div>
  )
}
