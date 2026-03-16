import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import BackIcn from '../Icons/BackIcn'
import app from '../styles/app.style'
import { __ } from '../Utils/i18nwrap'
import CheckBox from './Utilities/CheckBox'

export default function PaypalSettings({ paySetting, handleInput }) {
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
        <h2 className={css({ w: '100%', ta: 'center' })}>{__('PayPal Settings')}</h2>
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
        <b className="wdt-150 mr-2">{__('Transaction Mode:')}</b>
        <CheckBox radio name="mode" onChange={handleInput} checked={paySetting.mode === 'sandbox'} title={<small className="txt-dp"><b>Sandbox</b></small>} value="sandbox" />
        <CheckBox radio name="mode" onChange={handleInput} checked={paySetting.mode === 'live'} title={<small className="txt-dp"><b>Live</b></small>} value="live" />
      </div>
      <div className="flx mt-3">
        <b className="wdt-200">{__('Client ID:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="Client ID"
          value={paySetting.clientID || ''}
          name="clientID"
          onChange={handleInput}
        />
      </div>
      <div className="flx mt-3">
        <b className="wdt-200">{__('Client Secret:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="Client Secret"
          value={paySetting.clientSecret || ''}
          name="clientSecret"
          onChange={handleInput}
        />
      </div>
      <div className="flx">
        <small className="d-blk mt-2" style={{ marginLeft: 170 }}>
          {__('To get Client ID & Secret, Please Visit')}
          {' '}
          <a
            className="btcd-link"
            href="https://developer.paypal.com/developer/applications/"
            target="_blank"
            rel="noreferrer"
          >
            {__('PayPal Developer Dashboard')}
          </a>
        </small>
      </div>
    </div>
  )
}
