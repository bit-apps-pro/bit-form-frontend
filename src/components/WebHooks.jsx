import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { memo, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { $confirmations, $fieldsArr, $updateBtn } from '../GlobalStates/GlobalStates'
import CloseIcn from '../Icons/CloseIcn'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import StackIcn from '../Icons/StackIcn'
import TrashIcn from '../Icons/TrashIcn'
import { deepCopy } from '../Utils/Helpers'
import { nonMappableFields } from '../Utils/StaticData/allStaticArrays'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import ut from '../styles/2.utilities'
import app from '../styles/app.style'
import LoaderSm from './Loaders/LoaderSm'
import Accordions from './Utilities/Accordions'
import Button from './Utilities/Button'
import ConfirmModal from './Utilities/ConfirmModal'
import SnackMsg from './Utilities/SnackMsg'

function WebHooks({ removeIntegration }) {
  const [confMdl, setConfMdl] = useState({ show: false, action: null })
  const [isLoading, setIsLoading] = useState({ id: 0, loading: false })
  const [snack, setSnackbar] = useState({ show: false })
  const [allConf, setAllConf] = useAtom($confirmations)
  const fieldsArr = useAtomValue($fieldsArr)
  const [filterFields] = useState(() => fieldsArr.filter(field => !nonMappableFields.includes(field.typ)))
  const setUpdateBtn = useSetAtom($updateBtn)
  const { css } = useFela()
  const testResponseRef = useRef([])

  const addToRefs = el => {
    if (el && !testResponseRef.current.includes(el)) {
      testResponseRef.current.push(el)
    }
  }

  const handleHookTitle = (e, idx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[idx].title = e.target.value
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleLink = (val, i) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[i].url = val
    confirmation.type.webHooks[i].params = splitParamsFromUrl(val)
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleMethod = (val, i) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[i].method = val
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleParam = (typ, val, hookIndx, paramIndx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[hookIndx].params[paramIndx][typ] = val
    confirmation.type.webHooks[hookIndx].url = getUrlWithParams(hookIndx, confirmation)
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const delParam = (hookIndx, paramIndx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.webHooks[hookIndx].params.splice(paramIndx, 1)
    confirmation.type.webHooks[hookIndx].url = getUrlWithParams(hookIndx, confirmation)
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addParam = hookIndx => {
    const confirmation = deepCopy(allConf)
    if (!confirmation.type.webHooks[hookIndx]?.params) {
      confirmation.type.webHooks[hookIndx].params = []
    }
    confirmation.type.webHooks[hookIndx].params.push({ key: 'key', value: 'value' })
    confirmation.type.webHooks[hookIndx].url = getUrlWithParams(hookIndx, confirmation)
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addMoreHook = () => {
    const confirmation = deepCopy(allConf)
    if (confirmation?.type?.webHooks) {
      confirmation.type.webHooks.push({ title: `Web Hook ${confirmation.type.webHooks.length + 1}`, url: '', method: 'GET' })
    } else {
      // eslint-disable-next-line no-param-reassign
      confirmation.type = { webHooks: [], ...confirmation.type }
      confirmation.type.webHooks.push({ title: `Web Hook ${confirmation.type.webHooks.length + 1}`, url: '', method: 'GET' })
    }
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const rmvHook = async i => {
    const confirmation = deepCopy(allConf)
    const tmpData = confirmation.type.webHooks[i]
    confirmation.type.webHooks.splice(i, 1)
    setAllConf(confirmation)
    confMdl.show = false
    setConfMdl({ ...confMdl })
    if (tmpData.id !== undefined) {
      const status = await removeIntegration(tmpData.id, 'hook')
      if (!status) {
        confirmation.type.webHooks.splice(i, 0, tmpData)
        setAllConf(confirmation)
      }
    }
  }

  const closeMdl = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
  }

  const showDelConf = (i) => {
    confMdl.show = true
    confMdl.action = () => rmvHook(i)
    setConfMdl({ ...confMdl })
  }

  const parseWebhookResponse = response => {
    try {
      return JSON.stringify(response, null, 2)
    } catch (e) {
      return response
    }
  }

  const testWebhook = webHookId => {
    setIsLoading({ id: webHookId, loading: true })
    const confirmation = deepCopy(allConf)
    bitsFetch({ hookDetails: confirmation.type.webHooks[webHookId] }, 'bitforms_test_webhook').then(response => {
      if (response && response.success) {
        setIsLoading({ id: webHookId, loading: false })
        if ((response.data.response).length === 0) {
          testResponseRef.current[webHookId].innerHTML = __('No response from the server')
        } else {
          testResponseRef.current[webHookId].innerHTML = `<pre>${parseWebhookResponse(response.data.response)}</pre>`
        }
        setSnackbar({ show: true, msg: __(response.data.msg) })
      } else if (response && response.data) {
        const msg = typeof response.data === 'string' ? response.data : 'Unknown error'
        setSnackbar({ show: true, msg: `${msg}. ${__('please try again')}` })
        setIsLoading({ id: webHookId, loading: false })
      } else {
        setSnackbar({ show: true, msg: __('Webhook tests failed. please try again') })
        setIsLoading({ id: webHookId, loading: false })
      }
    })
  }

  const getUrlWithParams = (hookIndx, confirmation) => {
    const { url, params } = confirmation.type.webHooks[hookIndx]
    try {
      const theUrl = new URL(url)
      theUrl.search = ''
      let newURL = theUrl.href
      if (params.length) {
        newURL += '?'
        newURL += params.map(({ key, value }) => `${key}=${value}`).join('&')
      }
      return newURL
    } catch (e) {
      return ''
    }
  }

  const splitParamsFromUrl = url => {
    try {
      const urlParams = new URLSearchParams(new URL(url).search)
      const allparams = []
      urlParams.forEach((value, key) => {
        allparams.push({ key, value })
      })
      return allparams
    } catch (e) {
      return []
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ConfirmModal
        action={confMdl.action}
        show={confMdl.show}
        body={__('Are you sure to delete this web hook?')}
        btnTxt={__('Delete')}
        close={closeMdl}
      />
      {allConf?.type?.webHooks
        ? allConf.type.webHooks.map((itm, i) => (
          <div key={`f-u-${i + 1}`} className="flx">
            <Accordions
              title={itm.title}
              titleEditable
              cls="mt-2 mr-2 w-9"
              onTitleChange={e => handleHookTitle(e, i)}
            >
              <br />
              <div className="flx">
                <div className="w-7 mr-2">
                  <div className="f-m">{__('Link:')}</div>
                  <input onChange={e => handleLink(e.target.value, i)} className="btcd-paper-inp mt-1" type="text" value={itm.url} />
                </div>

                <div className="w-3">
                  <div className="f-m">{__('Method:')}</div>
                  <select onChange={e => handleMethod(e.target.value, i)} defaultValue={itm.method} className="btcd-paper-inp mt-1">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="OPTION">OPTION</option>
                    <option value="DELETE">DELETE</option>
                    <option value="TRACE">TRACE</option>
                    <option value="CONNECT">CONNECT</option>
                  </select>
                </div>
              </div>
              <div className="f-m mt-2">{__('Add Url Parameter: (optional)')}</div>
              <div className="btcd-param-t-wrp mt-1">
                <div className="btcd-param-t">
                  <div className="tr">
                    <div className="td">{__('Key')}</div>
                    <div className="td">{__('Value')}</div>
                  </div>
                  {itm?.params && itm.params.map(({ key, value }, paramIdx) => (
                    <div key={`url-p-${paramIdx + 11}`} className="tr">
                      <div className="td">
                        <input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('key', e.target.value, i, paramIdx)} type="text" value={key} />
                      </div>
                      <div className="td">
                        <input className="btcd-paper-inp p-i-sm" onChange={e => handleParam('value', e.target.value, i, paramIdx)} type="text" value={value} />
                      </div>
                      <div className="flx p-atn">
                        <Button onClick={() => delParam(i, paramIdx)} icn>
                          <TrashIcn size={16} />
                        </Button>
                        <MultiSelect
                          options={filterFields.map(f => ({ label: f.name, value: `\${${f.key}}` }))}
                          className="btcd-paper-drpdwn wdt-200 ml-2"
                          singleSelect
                          onChange={val => handleParam('value', val, i, paramIdx)}
                          defaultValue={value}
                        />
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => addParam(i)} className="add-pram" icn><CloseIcn size="14" stroke="3" className="icn-rotate-45" /></Button>
                </div>
              </div>
              <Button onClick={() => testWebhook(i)} className={css(app.btn, app.btn_blue_otln)}>
                {__('Test Webhook')}
                {(isLoading.id === i && isLoading.loading) && <LoaderSm size={14} clr="#022217" className="ml-2" />}
                <ExternalLinkIcn size={18} className="ml-1" />
              </Button>
              <br />
              <div className="wh-resp-box">
                <div className="f-m wh-resp-box-title">{__('Response:')}</div>
                <div className="wh-resp-box-content" ref={addToRefs}> Test Webhook to see the response.</div>
              </div>
              <br />
            </Accordions>
            <Button onClick={() => showDelConf(i)} icn className="sh-sm white mt-2"><TrashIcn size={16} /></Button>
          </div>
        )) : (
          <div className={css(ut.btcdEmpty, ut.txCenter)}>
            <StackIcn size="50" />
            {__('Empty')}
          </div>
        )}
      <div className="txt-center">
        <Button onClick={addMoreHook} icn className="sh-sm blue tooltip mt-2" style={{ '--tooltip-txt': `'${__('Add More Hook')}'` }}>
          <CloseIcn size="14" stroke="3" className="icn-rotate-45" />
        </Button>
      </div>
    </div>
  )
}

export default memo(WebHooks)
