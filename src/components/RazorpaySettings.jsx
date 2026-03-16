import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import BackIcn from '../Icons/BackIcn'
import app from '../styles/app.style'
import { __ } from '../Utils/i18nwrap'

export default function RazorpaySettings({ paySetting, handleInput }) {
  const { css } = useFela()

  const webhookURL = `${window.location.origin}/wp-json/bitform/v1/payments/razorpay`

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
        <h2 className={css({ w: '100%', ta: 'center' })}>{__('Razorpay Settings')}</h2>
      </div>
      <div className="btcd-hr" />
      <div className="flx mt-3">
        <b className="wdt-150">{__('Integration Name:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="Integration Name"
          value={paySetting.name}
          name="name"
          onChange={handleInput}
        />
      </div>
      <div className="flx mt-3">
        <b className="wdt-150">{__('API Key:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="API Key"
          value={paySetting.apiKey}
          name="apiKey"
          onChange={handleInput}
        />
      </div>
      <div className="flx mt-3">
        <b className="wdt-150">{__('API Secret:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="API Secret"
          value={paySetting.apiSecret}
          name="apiSecret"
          onChange={handleInput}
        />
      </div>
      <div className="flx">
        <small className="d-blk mt-1" style={{ marginLeft: 130 }}>
          {__('To get API Key & Secret, Please Visit')}
          <a
            className="btcd-link"
            href="https://dashboard.razorpay.com/app/keys"
            target="_blank"
            rel="noreferrer"
          >
            {__('Razorpay Dashboard')}
          </a>
        </small>
      </div>
      <p>
        Please add the following webhook to your Razorpay account settings. Copy this webhook URL:&nbsp;
        <strong>{webhookURL}</strong>
        &nbsp;and paste it in your Razorpay account. To add this,&nbsp;
        <a
          href="https://dashboard.razorpay.com/app/developers/webhooks"
          target="_blank"
          rel="noreferrer"
        >
          go to Razorpay Webhooks Settings
        </a>
        &nbsp;and configure it with the following event:&nbsp;
        <code>payment.captured</code>
        .
      </p>

    </div>
  )
}
