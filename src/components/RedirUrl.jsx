import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { memo, useState } from 'react'
import { useFela } from 'react-fela'
import { $confirmations, $fieldsArr, $updateBtn } from '../GlobalStates/GlobalStates'
import CloseIcn from '../Icons/CloseIcn'
import StackIcn from '../Icons/StackIcn'
import TrashIcn from '../Icons/TrashIcn'
import { deepCopy } from '../Utils/Helpers'
import { nonMappableFields } from '../Utils/StaticData/allStaticArrays'
import { __ } from '../Utils/i18nwrap'
import useSWROnce from '../hooks/useSWROnce'
import ut from '../styles/2.utilities'
import Accordions from './Utilities/Accordions'
import Button from './Utilities/Button'
import ConfirmModal from './Utilities/ConfirmModal'

function RedirUrl({ removeIntegration }) {
  const [confMdl, setConfMdl] = useState({ show: false, action: null })
  const [redirectUrls, setredirectUrls] = useState(null)
  const [allConf, setAllConf] = useAtom($confirmations)
  const fieldsArr = useAtomValue($fieldsArr)
  const [filterFields] = useState(() => fieldsArr.filter(field => !nonMappableFields.includes(field.typ)))
  const setUpdateBtn = useSetAtom($updateBtn)
  const { css } = useFela()

  useSWROnce('bitforms_get_all_wp_pages', null, { onSuccess: data => setredirectUrls(data) })

  const handleUrlTitle = (e, idx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[idx].title = e.target.value
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handlePage = (e, idx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[idx].url = e.target.value
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleLink = (val, i) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[i].url = val
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const getUrlParams = url => url.match(/(\?|&)([^=]+)=([^&]+|)/gi)

  const handleParam = (typ, val, pram, i) => {
    const confirmation = deepCopy(allConf)
    if (val !== '') {
      if (typ === 'key') {
        confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(pram, `${pram.charAt(0)}${val}=${pram.split('=')[1]}`)
      } else {
        confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(pram, `${pram.split('=')[0]}=${val}`)
      }
    } else if (pram.match(/\?/g) === null) {
      confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(pram, '')
    } else {
      confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(`${pram}&`, '?')
    }
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const delParam = (i, param) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(param, '')
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addParam = i => {
    const confirmation = deepCopy(allConf)
    if (confirmation.type.redirectPage[i].url.match(/\?/g) !== null) {
      confirmation.type.redirectPage[i].url += '&key=value'
    } else {
      confirmation.type.redirectPage[i].url += '?key=value'
    }
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const setFromField = (val, i, param) => {
    const confirmation = deepCopy(allConf)
    const a = param.split('=')
    a[1] = val
    confirmation.type.redirectPage[i].url = confirmation.type.redirectPage[i].url.replace(param, a.join('='))
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addMoreUrl = () => {
    const confirmation = deepCopy(allConf)
    if (confirmation?.type?.redirectPage) {
      confirmation.type.redirectPage.push({ title: `Redirect Url ${confirmation.type.redirectPage.length + 1}`, url: '' })
    } else {
      // eslint-disable-next-line no-param-reassign
      confirmation.type = { redirectPage: [], ...confirmation.type }
      confirmation.type.redirectPage.push({ title: `Redirect Url ${confirmation.type.redirectPage.length + 1}`, url: '' })
    }
    setAllConf(confirmation)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const rmvUrl = async i => {
    const confirmation = deepCopy(allConf)
    const tmpData = confirmation.type.redirectPage[i]
    confirmation.type.redirectPage.splice(i, 1)
    setAllConf(confirmation)
    confMdl.show = false
    setConfMdl({ ...confMdl })
    if (tmpData.id !== undefined) {
      const status = await removeIntegration(tmpData.id, 'url')
      if (!status) {
        confirmation.type.redirectPage.splice(i, 0, tmpData)
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
    confMdl.action = () => rmvUrl(i)
    setConfMdl({ ...confMdl })
  }

  return (
    <div>
      <ConfirmModal
        action={confMdl.action}
        show={confMdl.show}
        body={__('Are you sure to delete this URL ?')}
        btnTxt={__('Delete')}
        close={closeMdl}
      />
      {allConf?.type?.redirectPage ? allConf.type.redirectPage.map((itm, i) => (
        <div key={`f-u-${i + 1}`} className="flx">
          <Accordions
            title={itm.title}
            titleEditable
            cls="mt-2 mr-2 w-9"
            onTitleChange={e => handleUrlTitle(e, i)}
          >
            <div className="f-m">{__('Select A Page:')}</div>
            <select
              className="btcd-paper-inp mt-1"
              onChange={e => handlePage(e, i)}
            >
              <option value="">{__('Custom Link')}</option>
              {redirectUrls
                && redirectUrls.map((urlDetail, ind) => (
                  <option
                    key={`r-url-${ind + 22}`}
                    value={urlDetail.url}
                  >
                    {urlDetail.title}
                  </option>
                ))}
            </select>
            <br />
            <br />
            <div className="f-m">Link:</div>
            <input
              onChange={e => handleLink(e.target.value, i)}
              className="btcd-paper-inp mt-1"
              type="text"
              value={itm.url}
            />
            <br />
            <br />
            <div className="f-m">{__('Add Url Parameter: (optional)')}</div>
            <div className="btcd-param-t-wrp mt-1">
              <div className="btcd-param-t">
                <div className="tr">
                  <div className="td">{__('Key')}</div>
                  <div className="td">{__('Value')}</div>
                </div>
                {getUrlParams(itm.url) !== null && getUrlParams(itm.url).map((item, childIdx) => (
                  <div key={`url-p-${childIdx + 21}`} className="tr">
                    <div className="td">
                      <input
                        className="btcd-paper-inp p-i-sm"
                        onChange={e => handleParam('key', e.target.value, item, i)}
                        type="text"
                        value={item.split('=')[0].substr(1)}
                      />

                    </div>
                    <div className="td">
                      <input
                        className="btcd-paper-inp p-i-sm"
                        onChange={e => handleParam('val', e.target.value, item, i)}
                        type="text"
                        value={item.split('=')[1]}
                      />
                    </div>
                    <div className="flx p-atn">
                      <Button onClick={() => delParam(i, item)} icn><TrashIcn size={16} /></Button>
                      <span className="tooltip" style={{ '--tooltip-txt': `'${__('set Form Field')}'`, position: 'relative' }}>
                        <select className="btcd-paper-inp p-i-sm mt-1" onChange={e => setFromField(e.target.value, i, item)} defaultValue={item.split('=')[1]}>
                          <option value="">{__('Select Form Field')}</option>
                          {filterFields !== null && filterFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
                        </select>
                      </span>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => addParam(i)}
                  className="add-pram"
                  icn
                >
                  <CloseIcn
                    size="14"
                    stroke="3"
                    className="icn-rotate-45"
                  />
                </Button>
              </div>
            </div>
          </Accordions>
          <Button
            onClick={() => showDelConf(i)}
            icn
            className="sh-sm white mt-2"
          >
            <TrashIcn size={16} />
          </Button>
        </div>
      )) : (
        <div className={css(ut.btcdEmpty, ut.txCenter)}>
          <StackIcn size="50" />
          {__('Empty')}
        </div>
      )}
      <div className="txt-center">
        <Button
          onClick={addMoreUrl}
          icn
          className="sh-sm blue tooltip mt-2"
          style={{ '--tooltip-txt': `'${__('Add More Alternative URl')}'` }}
        >
          <CloseIcn size="14" stroke="3" className="icn-rotate-45" />
        </Button>
      </div>
    </div>
  )
}

export default memo(RedirUrl)
