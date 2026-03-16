import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import BackIcn from '../Icons/BackIcn'
import app from '../styles/app.style'
import { __ } from '../Utils/i18nwrap'

export default function MollieSetting({ paySetting, handleInput }) {
  const { css } = useFela()

  return (
    <div>
      <div className={css({ fd: 'row', flx: 'align-center' })}>
        <Link
          to="/app-settings/payments"
          className={`${css(app.btn)} btcd-btn-o-gray`}
        >
          <BackIcn className="mr-1" />
          Back
        </Link>
        <h2 className={css({ w: '100%', ta: 'center' })}>{__('Mollie Settings')}</h2>
      </div>
      <div className="btcd-hr" />
      <div className="flx mt-3">
        <b className="wdt-200">{__('Integration Name:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="Integration Name"
          value={paySetting.name || ''}
          name="name"
          onChange={handleInput}
        />
      </div>

      <div className="flx mt-3">
        <b className="wdt-200">{__('API key:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="API key"
          value={paySetting.apiKey || ''}
          name="apiKey"
          onChange={handleInput}
        />
      </div>
      <div className="flx">
        <small className="d-blk mt-2" style={{ marginLeft: 170 }}>
          {__('To get API key, Please Visit')}
          {' '}
          <a
            className="btcd-link"
            href="https://www.mollie.com/dashboard/developers/api-keys"
            target="_blank"
            rel="noreferrer"
          >
            {__('Mollie Developer Dashboard')}
          </a>
        </small>
      </div>
    </div>
  )
}
