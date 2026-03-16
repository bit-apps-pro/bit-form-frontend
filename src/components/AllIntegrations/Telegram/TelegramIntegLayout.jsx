import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import CheckBox from '../../Utilities/CheckBox'
import TinyMCE from '../../Utilities/TinyMCE'
import TelegramActions from './TelegramActions'
import { allowUploadedFiletype, refreshGetUpdates } from './TelegramCommonFunc'

export default function TelegramIntegLayout({ formFields, telegramConf, setTelegramConf, isLoading, setisLoading, setSnackbar }) {
  const formFieldsNew = formFields.filter(f => (!allowUploadedFiletype.includes(f.type)))

  const handleInput = e => {
    const newConf = { ...telegramConf }
    newConf[e.target.name] = e.target.value
    setTelegramConf(newConf)
  }

  const setFromField = (val) => {
    setTelegramConf(prevState => create(prevState, draft => {
      draft.body = val
    }))
  }
  const changeActionRun = (e) => {
    const newConf = { ...telegramConf }
    if (newConf?.body) {
      newConf.body = ''
    }
    newConf.parse_mode = e.target.value
    setTelegramConf(newConf)
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-150 d-in-b">{__('Chat List:')}</b>
        <select
          onChange={handleInput}
          name="chat_id"
          value={telegramConf.chat_id}
          className="btcd-paper-inp w-5"
        >
          <option value="">{__('Select Chat List')}</option>
          {
            telegramConf?.default?.telegramChatLists && Object.keys(telegramConf.default.telegramChatLists).map(chatListname => (
              <option key={chatListname} value={telegramConf.default.telegramChatLists[chatListname].id}>
                {telegramConf.default.telegramChatLists[chatListname].name}
              </option>
            ))
          }
        </select>
        <button
          onClick={() => refreshGetUpdates(telegramConf, setTelegramConf, setisLoading, setSnackbar)}
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{ '--tooltip-txt': `'${__('Refresh Telegram List')}'` }}
          type="button"
          disabled={isLoading}
        >
          &#x21BB;
        </button>
      </div>
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {telegramConf?.chat_id
        && (
          <>
            <div className="flx mt-4">
              <b className="wdt-150 d-in-b">{__('Parse Mode:')}</b>
              <CheckBox
                radio
                onChange={e => changeActionRun(e)}
                name="HTML"
                title={<small className="txt-dp">{__('HTML')}</small>}
                checked={telegramConf.parse_mode === 'HTML'}
                value="HTML"
              />
              <CheckBox
                radio
                onChange={e => changeActionRun(e)}
                name="MarkdownV2"
                title={<small className="txt-dp">{__('Markdown v2')}</small>}
                checked={telegramConf.parse_mode === 'MarkdownV2'}
                value="MarkdownV2"
              />
            </div>
            <div className="flx mt-4">
              <b className="wdt-150 d-in-b">{__('Messages:')}</b>
              {telegramConf?.parse_mode === 'HTML' ? (
                <TinyMCE
                  formFields={formFieldsNew}
                  value={telegramConf.body}
                  onChangeHandler={setFromField}
                  width="100%"
                  toolbarMnu="bold italic underline strikethrough | link | code | addFormField | addSmartField"
                />
              ) : (
                <>
                  <textarea
                    className="w-7"
                    onChange={handleInput}
                    name="body"
                    rows="5"
                    value={telegramConf.body}
                  />
                  <MultiSelect
                    options={formFieldsNew.map(f => ({ label: f.name, value: `\${${f.key}}` }))}
                    className="btcd-paper-drpdwn wdt-200 ml-2"
                    singleSelect
                    onChange={val => setFromField(val)}
                  />
                </>
              )}
            </div>
            <div className="mt-4"><b className="wdt-100">{__('Actions')}</b></div>
            <div className="btcd-hr mt-1" />
            <TelegramActions
              telegramConf={telegramConf}
              setTelegramConf={setTelegramConf}
              formFields={formFields}
            />
          </>
        )}
    </>
  )
}
