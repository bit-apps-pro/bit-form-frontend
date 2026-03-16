import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { $bits } from '../GlobalStates/GlobalStates'
import { IS_PRO } from '../Utils/Helpers'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import useSWROnce from '../hooks/useSWROnce'
import app from '../styles/app.style'
import LoaderSm from './Loaders/LoaderSm'
import CopyText from './Utilities/CopyText'
import SnackMsg from './Utilities/SnackMsg'

const randomKey = () => {
  if (!IS_PRO) return
  const a = new Uint32Array(4)
  window.crypto.getRandomValues(a)
  return (performance.now().toString(36) + Array.from(a).map(A => A.toString(36)).join('')).replace(/\./g, '')
}

export default function Apikey() {
  const [key, setKey] = useState('')
  const bits = useAtomValue($bits)
  const { siteURL } = bits
  const [snack, setSnack] = useState({ show: false })
  const [isLoading, setisLoading] = useState(false)
  const { css } = useFela()

  const { mutate: mutateKey } = useSWROnce('bitforms_api_key', {}, { fetchCondition: IS_PRO, onSuccess: apiKey => setKey(apiKey) })
  const handleSubmit = () => {
    if (!IS_PRO) return
    setisLoading(true)
    const apiSaveProm = bitsFetch({ api_key: key }, 'bitforms_api_key')
      .then((res) => {
        setisLoading(false)
        if (res?.success) {
          setKey(res.data)
          mutateKey(res.data)
          return __('API key saved successfully')
        }
        return res?.data || __('Error Occured')
      })
    toast.promise(apiSaveProm, {
      success: data => data,
      error: data => data,
      loading: __('Saving API key...'),
    })
  }

  const changeKey = () => {
    setKey(randomKey())
  }

  return (
    <div className="btcd-captcha w-5">
      <div className="pos-rel">
        {!IS_PRO && (
          <div className="pro-blur flx" style={{ height: '135%', left: -12, width: '104%', marginTop: 10 }}>
            <div className="pro">
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {__('Available On Pro')}
                </span>
              </a>
            </div>
          </div>
        )}

        <SnackMsg snack={snack} setSnackbar={setSnack} />
        <h2>{__('API Integration')}</h2>
        <small className="d-blk mt-1 mb-1">
          <a
            className="btcd-link"
            href="https://bitapps.pro/docs/bit-form/api/"
            target="_blank"
            rel="noreferrer"
          >
            {__('Learn more about Bit Form API')}
          </a>
        </small>
        <div className="btcd-hr" />

        <div className="mt-2">
          <label htmlFor="captcha-key">
            {__('Domain URL')}
            <CopyText
              value={siteURL}
              name="domainURL"
              setSnackbar={setSnack}
              className="field-key-cpy w-12 ml-0"
              readOnly
            />
          </label>
        </div>
        <div className="mt-3">
          <label htmlFor="captcha-key">
            {__('API Key')}
            <CopyText
              value={key}
              name="siteKey"
              setSnackbar={setSnack}
              className="field-key-cpy w-12 ml-0"
              readOnly
            />
            <span
              className="btcd-link"
              role="button"
              tabIndex="-1"
              onClick={changeKey}
              onKeyDown={changeKey}
            >
              {__('Generate new API key')}
            </span>
          </label>
        </div>
        <button
          type="button"
          onClick={(e) => handleSubmit(e)}
          className={`${css(app.btn)} btn-lg f-left blue`}
          disabled={isLoading}
        >
          {__('Save')}
          {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
        </button>
      </div>
    </div>
  )
}
