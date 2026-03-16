import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import BackIcn from '../../../Icons/BackIcn'
import CloseIcn from '../../../Icons/CloseIcn'
import ExternalLinkIcn from '../../../Icons/ExternalLinkIcn'
import TrashIcn from '../../../Icons/TrashIcn'
import app from '../../../styles/app.style'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Btn from '../../Utilities/Btn'
import Button from '../../Utilities/Button'
import BitformFieldMapping from './BitformFieldMapping'
import { IS_PRO } from '../../../Utils/Helpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { nonMappableFields } from '../../../Utils/StaticData/allStaticArrays'

export default function WebHooksLayouts({
  formID, formFields, webHooks, setWebHooks, step, setstep, setSnackbar, create, isInfo,
}) {
  const [filterFields] = useState(() => formFields.filter(field => !nonMappableFields.includes(field.typ)))

  const getUrlParams = (url) => {
    if (!url) return null
    const matches = []
    const regex = /(\?|&)([^=&#]*)=?([^&#]*)/g
    let match
    while ((match = regex.exec(url)) !== null) {
      matches.push(`${match[1]}${match[2]}=${match[3]}`)
    }
    return matches.length ? matches : null
  }
  const [isLoading, setIsLoading] = useState(false)
  const method = ['GET', 'POST', 'PUT', 'PATCH', 'OPTION', 'DELETE', 'TRACE', 'CONNECT']
  const { css } = useFela()
  const testResponseRef = useRef(null)

  const parseWebhookResponse = response => {
    try {
      return JSON.stringify(response, null, 2)
    } catch (e) {
      return response
    }
  }

  const testWebHook = (webHooksDetaila) => {
    setIsLoading(true)
    bitsFetch({ hookDetails: webHooksDetaila }, 'bitforms_test_webhook').then(response => {
      if (response && response.success) {
        testResponseRef.current.innerHTML = `<pre>${parseWebhookResponse(response.data.response)}</pre>`
        setSnackbar({ show: true, msg: __(response.data.msg) })
        setIsLoading(false)
      } else if (response && response.data) {
        const msg = typeof response.data === 'string' ? response.data : 'Unknown error'
        setSnackbar({ show: true, msg: `${msg}. ${__('please try again')}` })
        setIsLoading(false)
      } else {
        setSnackbar({ show: true, msg: __('Webhook tests failed. please try again') })
        setIsLoading(false)
      }
    })
  }

  const handleParam = (typ, val, pram, childindx) => {
    const tmpConf = { ...webHooks }
    const { url } = tmpConf

    const [baseUrl, queryString = ''] = url.split('?')

    if (!queryString) {
      tmpConf.url = baseUrl
      setWebHooks(tmpConf)
      return
    }

    const rawParams = queryString.split('&')

    const paramsArray = rawParams.map(p => {
      const [key, value] = p.split('=')
      return { [key]: value }
    })

    const index = childindx
    if (index !== -1) {
      if (typ === 'key') {
        const oldKey = Object.keys(paramsArray[index])[0]
        const oldValue = paramsArray[index][oldKey]
        paramsArray[index] = { [val]: oldValue }
      } else {
        const key = Object.keys(paramsArray[index])[0]
        paramsArray[index] = { [key]: val }
      }
    }

    const newSearchParams = paramsArray
      .map(param => {
        const key = Object.keys(param)[0]
        const value = param[key]
        return `${key}=${value}`
      })
      .join('&')

    tmpConf.url = newSearchParams ? `${baseUrl}?${newSearchParams}` : baseUrl

    setWebHooks(tmpConf)
  }

  const handleInput = (e) => {
    const tmpConfConf = { ...webHooks }
    tmpConfConf[e.target.name] = e.target.value
    setWebHooks({ ...tmpConfConf })
  }

  const setFromField = (val, param) => {
    const tmpConf = { ...webHooks }
    const a = param.split('=')
    a[1] = val
    tmpConf.url = tmpConf.url.replace(param, a.join('='))
    setWebHooks(tmpConf)
  }
  const addParam = () => {
    const tmpConf = { ...webHooks }
    if (tmpConf.url.match(/\?/g) !== null) {
      tmpConf.url += '&key=value'
    } else {
      tmpConf.url += '?key=value'
    }
    setWebHooks(tmpConf)
  }

  const delParam = (childindx) => {
    const tmpConf = { ...webHooks }
    const { url } = tmpConf

    const [baseUrl, queryString] = url.split('?')

    if (!queryString) {
      tmpConf.url = baseUrl
      setWebHooks(tmpConf)
      return
    }

    const rawParams = queryString.split('&')

    rawParams.splice(childindx, 1)

    const newUrl = rawParams.length > 0
      ? `${baseUrl}?${rawParams.join('&')}`
      : baseUrl

    tmpConf.url = newUrl

    setWebHooks(tmpConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
  }

  return (
    <div style={{ ...{ width: isInfo && 900 } }}>
      <div className="flx ">
        <div className="w-7 mr-2 mb-4 mt-2">
          <div className="f-m">{__('Integration name')}</div>
          <input
            name="name"
            onChange={e => handleInput(e, webHooks, setWebHooks)}
            className="btcd-paper-inp mt-1"
            type="text"
            value={webHooks.name}
            disabled={isInfo}
          />
        </div>
      </div>
      <div className="flx flx-start">
        <div className="w-7">
          <div className="f-m">{__('Link:')}</div>
          <input
            name="url"
            onChange={e => handleInput(e, webHooks, setWebHooks)}
            className="btcd-paper-inp mt-1"
            type="text"
            value={webHooks.url}
            disabled={isInfo}
          />
          {webHooks?.apiConsole && (
            <small className="d-blk mt-2">
              {__('To got Webhook , Please Visit')}
              {' '}
              <a
                className="btcd-link"
                href={webHooks.apiConsole}
                target="_blank"
                rel="noreferrer"
              >
                {__(`${webHooks.type} Dashboard`)}
              </a>
            </small>
          )}
        </div>

        <div className="w-3 px-1">
          <div className="f-m">{__('Method:')}</div>
          <select
            name="method"
            onChange={e => handleInput(e, webHooks, setWebHooks)}
            defaultValue={webHooks.method}
            className="btcd-paper-inp mt-1"
            disabled={isInfo}
          >
            {method.map((itm, indx) => (<option key={`method-${indx * 2}`} value={itm}>{itm}</option>))}
          </select>
        </div>
      </div>
      <br />
      <div className="f-m">{__('Add Url Parameter: (optional)')}</div>
      <div className="btcd-param-t-wrp mt-1">
        <div className="btcd-param-t">
          <div className="tr">
            <div className="td">{__('Key')}</div>
            <div className="td">{__('Value')}</div>
          </div>
          {getUrlParams(webHooks.url) !== null && getUrlParams(webHooks.url)?.map((itm, childindx) => (
            <div className="tr" key={`fu-1${childindx * 3}`}>
              <div className="td">
                <input
                  className="btcd-paper-inp p-i-sm"
                  onChange={e => handleParam('key', e.target.value, itm, childindx)}
                  type="text"
                  value={itm.split('=')[0].substr(1)}
                  disabled={isInfo}
                />
              </div>
              <div className="td">
                <input
                  className="btcd-paper-inp p-i-sm"
                  onChange={e => handleParam('val', e.target.value, itm, childindx)}
                  type="text"
                  value={itm.split('=')[1]}
                  disabled={isInfo}
                />
              </div>
              {!isInfo && (
                <div className="flx p-atn">
                  <Button
                    onClick={() => delParam(childindx)}
                    icn
                  >
                    <TrashIcn size={16} />
                  </Button>

                  <select
                    className="btcd-paper-inp p-i-sm"
                    name=""
                    id=""
                    onChange={(e) => setFromField(e.target.value, itm, webHooks, setWebHooks)}
                    defaultValue={itm.split('=')[1]}
                  >
                    {/* <BitformFieldMapping
                      formFields={formFields}
                      notAllowFieldType={['file-up', 'advanced-file-up']}
                      shortCode
                    /> */}
                    <option value="">{__('Add field')}</option>
                    <optgroup label="Form Fields">
                      {filterFields !== null && filterFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
                    </optgroup>
                    <optgroup label={`General Smart Codes ${IS_PRO ? '' : '(PRO)'}`}>
                      {IS_PRO && SmartTagField?.map(f => !f.name.match(/^(bf_all_data|bf_all_data.onlyValues|_bf_separator|_bf_math\(\)|_bf_concat\(\)|_bf_datetime_difference\(\)|_bf_query_param\(\))$/) && (
                        <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
                          {f.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}
            </div>
          ))}
          {!isInfo && (
            <Button
              onClick={() => addParam(webHooks, setWebHooks)}
              className="add-pram"
              icn
            >
              <CloseIcn size="14" className="icn-rotate-45" />
            </Button>
          )}
        </div>
      </div>
      {
        !isInfo && (
          <>
            <Button
              onClick={() => testWebHook(webHooks, setIsLoading, setSnackbar)}
              className={css(app.btn, app.btn_blue_otln)}
            >
              {__('Test Webhook')}
              {isLoading && <LoaderSm size={14} clr="#022217" className="ml-2" />}
              <ExternalLinkIcn size={18} className="ml-1" />
            </Button>
            <div className="wh-resp-box">
              <div className="f-m wh-resp-box-title">{__('Response:')}</div>
              <div
                className="wh-resp-box-content"
                ref={testResponseRef}
              >
                Test Webhook to see the response.
              </div>
            </div>
          </>
        )
      }
      <small className="d-blk mt-2 mb-2">
        {__('Try our free webhook test website: ')}
        <a
          className="btcd-link"
          href="https://app.webhook.is/test"
          target="_blank"
          rel="noreferrer"
        >
          https://app.webhook.is/test
        </a>
      </small>
      {
        create && (
          <Btn
            variant="success"
            onClick={() => nextPage()}
            type="button"
          >
            {__('Next')}
            <BackIcn className="ml-1 rev-icn" />
          </Btn>
        )
      }
    </div>
  )
}
