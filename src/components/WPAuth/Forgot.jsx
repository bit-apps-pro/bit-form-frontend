// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { $updateBtn } from '../../GlobalStates/GlobalStates'
import EditIcn from '../../Icons/EditIcn'
import { fogotPassTamplate } from '../../Utils/StaticData/tamplate'
import Cooltip from '../Utilities/Cooltip'
import EmailNotification from './EmailNotification'
import FieldMap from './FieldMap'

function Forgot({ fields, dataConf, setDataConf, pages, type, status }) {
  const [showMdl, setshowMdl] = useState(false)
  const setUpdateBtn = useSetAtom($updateBtn)
  const forgotField = [
    {
      key: 'login',
      name: 'Username or Email Address',
      required: true,
    },
  ]

  useEffect(() => {
    setDataConf(tmpConf => create(tmpConf, draft => {
      if (!draft[type]?.forgot_map?.[0]?.forgotField) {
        // eslint-disable-next-line no-param-reassign
        draft[type].forgot_map = forgotField.filter(fld => fld.required).map(fl => ({ formField: '', forgotField: fl.key, required: fl.required }))
      }
    }))
  }, [])

  const inputHandler = (e) => {
    setDataConf(tmpConf => create(tmpConf, draft => {
      const { name, value } = e.target
      // eslint-disable-next-line no-param-reassign
      draft[type][name] = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handlePage = (e) => {
    setDataConf(tmpConf => create(tmpConf, draft => {
      // eslint-disable-next-line no-param-reassign
      draft[type].redirect_url = e.target.value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  return (
    <div style={{ width: 800, opacity: status === 0 && 0.6, pointerEvents: status === 0 && 'none' }}>
      <div>
        <div>
          <div className="mt-3 mb-1"><b>Forget Password Fields Mapping</b></div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-1">
            <div className="txt-dp"><b>{__('Form Fields')}</b></div>
            <div className="txt-dp"><b>{__('Forgot Password Fields')}</b></div>
          </div>
        </div>
      </div>
      {dataConf[type]?.forgot_map?.map((itm, i) => (
        <FieldMap
          key={`analytics-m-${i + 9}`}
          i={i}
          type="forgot"
          field={itm}
          formFields={fields}
          dataConf={dataConf}
          setDataConf={setDataConf}
          customFields={forgotField}
        />
      ))}

      <br />
      <div className="flx integ-fld-wrp">
        <div className="w-5 ">
          <div className="f-m fw-500">
            {__('Redirect Page:')}
            <Cooltip width={250} icnSize={17} className="ml-1 mt-4 p-0">
              <div className="txt-body">
                This redirect page will be redirected to the reset form when the email is verified.
                <br />
              </div>
            </Cooltip>
          </div>

          <select className="btcd-paper-inp mt-1" value={dataConf[type]?.redirect_url} onChange={e => handlePage(e)}>
            <option value="">{__('Custom Link')}</option>
            {pages && pages.map((urlDetail, ind) => (
              <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
            ))}
          </select>
        </div>
        <div className="w-5 ml-2 mt-5 fw-500">
          <div className="f-m">
            Link
            {' '}
            <span style={{ color: 'red' }}>*</span>
          </div>
          <input onChange={inputHandler} name="redirect_url" className="btcd-paper-inp mt-1" type="text" value={dataConf[type]?.redirect_url} />
        </div>
      </div>
      <br />
      <div className="flx w-5  mt-4">
        <span
          role="button"
          tabIndex="-1"
          className="cp"
          onClick={() => setshowMdl(true)}
          onKeyDown={() => setshowMdl(true)}
        >
          <EditIcn size={21} />
        </span>
        <div className="f-m ml-1">{__('Password reset email template')}</div>
      </div>
      <EmailNotification
        dataConf={dataConf}
        setDataConf={setDataConf}
        type={type}
        showMdl={showMdl}
        setshowMdl={setshowMdl}
        tamplate={fogotPassTamplate}
        title="Password reset email template"
      />
      <br />

      <div className="w-5">
        <div className="f-m fw-500">{__('Success Message:')}</div>
        <input className="btcd-paper-inp mt-1" onChange={(e) => inputHandler(e)} name="succ_msg" value={dataConf[type]?.succ_msg} type="text" placeholder={__('Success Message')} />
      </div>

    </div>
  )
}

export default Forgot
