/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { $fieldsArr, $updateBtn } from '../../../GlobalStates/GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import Cooltip from '../../Utilities/Cooltip'
import Modal from '../../Utilities/Modal'
import TinyMCE from '../../Utilities/TinyMCE'

export default function RedirectEmailVerified({
  dataConf, setDataConf, showMdl, setCustomRedirectMdl, pages, title, type = '',
}) {
  const setUpdateBtn = useSetAtom($updateBtn)
  const formFields = useAtomValue($fieldsArr)
  const data = type ? dataConf[type] : dataConf
  const handleInput = (e) => {
    const { name, value } = e.target
    setDataConf(tmpConf => create(tmpConf, draft => {
      // eslint-disable-next-line no-param-reassign
      const tmp = type ? draft[type] : draft
      tmp[name] = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const tinymceHandle = (val, name) => {
    setDataConf(tmpConf => create(tmpConf, draft => {
      // eslint-disable-next-line no-param-reassign
      const tmp = type ? draft[type] : draft
      tmp[name] = val
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  useEffect(() => {
    if (!dataConf?.custom_redirect) {
      setDataConf(tmpConf => create(tmpConf, draft => {
        // eslint-disable-next-line no-param-reassign
        const tmp = type ? draft[type] : draft
        tmp.custom_redirect = 0
      }))
    }
  }, [])

  return (
    <Modal md show={showMdl} setModal={setCustomRedirectMdl} title={title} style={{ minHeight: 600 }} className="o-a">
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin={600}
      >
        <div className="mr-2 mb-3">
          <div className="mt-2">
            <CheckBox
              radio
              name="custom_redirect"
              onChange={handleInput}
              checked={data?.custom_redirect?.toString() === '0'}
              title={<small className="txt-dp"><b>Messgae</b></small>}
              value={0}
            />
            <CheckBox
              radio
              name="custom_redirect"
              onChange={handleInput}
              checked={data?.custom_redirect?.toString() === '1'}
              title={<small className="txt-dp"><b>Redirect Page</b></small>}
              value={1}
            />
          </div>
          {data?.custom_redirect?.toString() === '1' && (
            <div className="mt-3 ml-2">
              <div className="flx ">
                <div className="w-5 ">
                  <div className="f-m fw-500 ml-1">
                    {__('Success redirect Page:')}
                    <Cooltip icnSize={14} className="ml-1">
                      <div className="txt-body">
                        This page will show when the verification is successful.
                        <br />
                      </div>
                    </Cooltip>
                  </div>

                  <select
                    className="btcd-paper-inp mt-1"
                    name="succ_url"
                    value={data?.succ_url}
                    onChange={handleInput}
                  >
                    <option value="">{__('Custom Link')}</option>
                    {pages && pages.map((urlDetail, ind) => (
                      <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                    ))}
                  </select>

                </div>
                <div className="w-5 ml-2">
                  <div className="f-m fw-500">Link</div>
                  <input
                    placeholder="success page link"
                    onChange={handleInput}
                    name="succ_url"
                    className="btcd-paper-inp mt-1"
                    type="text"
                    value={data?.succ_url}
                  />
                </div>
              </div>

              <div className="flx mt-3">
                <div className="w-5 ">
                  <div className="f-m fw-500">
                    {__('Redirect page (already activated):')}
                    <Cooltip icnSize={14} className="ml-1">
                      <div className="txt-body">
                        This page will show if the account had already been activated.
                        {' '}
                        <br />
                      </div>
                    </Cooltip>
                  </div>
                  <select
                    className="btcd-paper-inp mt-1"
                    name="already_activated_url"
                    value={data?.already_activated_url}
                    onChange={handleInput}
                  >
                    <option value="">{__('Custom Link')}</option>
                    {pages && pages.map((urlDetail, ind) => (
                      <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                    ))}
                  </select>
                </div>
                <div className="w-5 ml-2">
                  <div className="f-m fw-500">Link</div>
                  <input
                    placeholder="already  activated page link"
                    onChange={handleInput}
                    name="already_activated_url"
                    className="btcd-paper-inp mt-1"
                    type="text"
                    value={data?.already_activated_url}
                  />
                </div>
              </div>

              <div className="flx mt-3">
                <div className="w-5 ">
                  <div className="f-m fw-500">
                    {__('Invalid redirect page:')}
                    <Cooltip icnSize={14} className="ml-1">
                      <div className="txt-body">
                        This page will show if the account activation fails or if the activation URL is invalid.
                        {' '}
                        {' '}
                        <br />
                      </div>
                    </Cooltip>
                  </div>
                  <select
                    className="btcd-paper-inp mt-1"
                    name="invalid_key_url"
                    value={data?.invalid_key_url}
                    onChange={handleInput}
                  >
                    <option value="">{__('Custom Link')}</option>
                    {pages && pages.map((urlDetail, ind) => (
                      <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                    ))}
                  </select>
                </div>
                <div className="w-5 ml-2">
                  <div className="f-m fw-500">Link</div>
                  <input
                    placeholder="invalid page link"
                    onChange={handleInput}
                    name="invalid_key_url"
                    className="btcd-paper-inp mt-1"
                    type="text"
                    value={data?.invalid_key_url}
                  />
                </div>
              </div>
              <div className="flx mt-3">
                <div className="w-5 ">
                  <div className="f-m fw-500">
                    {__('Rejection Success redirect page:')}
                    <Cooltip icnSize={14} className="ml-1">
                      <div className="txt-body">
                        This page will show if the account Rejection Success.
                        {' '}
                        {' '}
                        <br />
                      </div>
                    </Cooltip>
                  </div>
                  <select
                    className="btcd-paper-inp mt-1"
                    name="reject_success_url"
                    value={data?.reject_success_url}
                    onChange={handleInput}
                  >
                    <option value="">{__('Custom Link')}</option>
                    {pages && pages.map((urlDetail, ind) => (
                      <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                    ))}
                  </select>
                </div>
                <div className="w-5 ml-2">
                  <div className="f-m fw-500">Link</div>
                  <input
                    placeholder="invalid page link"
                    onChange={handleInput}
                    name="reject_success_url"
                    className="btcd-paper-inp mt-1"
                    type="text"
                    value={data?.reject_success_url}
                  />
                </div>
              </div>
            </div>
          )}
          {data?.custom_redirect?.toString() === '0' && (
            <div className="ml-2">
              <div className="mt-4">
                {/* <div className="f-m fw-500">{__('Activation success')}</div>
                  <input className="btcd-paper-inp mt-1" onChange={handleInput} name="acti_succ_msg" value={data?.acti_succ_msg} type="text" placeholder={__('Activation Success Message')} /> */}
                <b>{__('Activation success')}</b>
                <label htmlFor="mail-tem-acti_succ_msg" className="mt-2">
                  <TinyMCE
                    id="acti_succ_msg"
                    formFields={formFields}
                    value={data?.acti_succ_msg}
                    onChangeHandler={val => tinymceHandle(val, 'acti_succ_msg')}
                    // width="100%"
                    height="5px"
                  // toolbarMnu="form | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code "
                  />
                </label>
              </div>
              <div className="mt-4">
                {/* <div className="f-m fw-500">{__('Already activated account')}</div>
                  <input className="btcd-paper-inp mt-1" onChange={handleInput} name="already_activated_msg" value={data?.already_activated_msg} type="text" placeholder={__('Already account activation message')} /> */}
                <b>{__('Already activated account')}</b>
                <label htmlFor="already_activated_msg" className="mt-2">
                  <TinyMCE
                    id="already_activated_msg"
                    formFields={formFields}
                    value={data?.already_activated_msg}
                    onChangeHandler={val => tinymceHandle(val, 'already_activated_msg')}
                    // width="100%"
                    height="5px"
                  // toolbarMnu="formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code "
                  />
                </label>
              </div>
              <div className="mt-4">
                {/* <div className="f-m fw-500">{__('Invalid activation key')}</div>
                  <input className="btcd-paper-inp mt-1" onChange={handleInput} name="invalid_key_msg" value={data?.invalid_key_msg} type="text" placeholder={__('Invalid url or fail activation message')} /> */}
                <b>{__('Invalid activation key')}</b>
                <label htmlFor="invalid_key_msg" className="mt-2">
                  <TinyMCE
                    id="invalid_key_msg"
                    formFields={formFields}
                    value={data?.invalid_key_msg}
                    onChangeHandler={val => tinymceHandle(val, 'invalid_key_msg')}
                    // width="100%"
                    height="5px"
                  // toolbarMnu="formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code "
                  />
                </label>
              </div>
              <div className="mt-4">
                <b>{__('Reject Success Message')}</b>
                <label htmlFor="reject_success_msg" className="mt-2">
                  <TinyMCE
                    id="reject_success_msg"
                    formFields={formFields}
                    value={data?.reject_success_msg}
                    onChangeHandler={val => tinymceHandle(val, 'reject_success_msg')}
                    // width="100%"
                    height="5px"
                  // toolbarMnu="formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code "
                  />
                </label>
              </div>
              <br />
            </div>
          )}
        </div>
      </Scrollbars>
    </Modal>
  )
}
