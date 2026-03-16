import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import BackIcn from '../Icons/BackIcn'
import app from '../styles/app.style'
import { __ } from '../Utils/i18nwrap'

export default function StripeSettings({ paySetting, handleInput }) {
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
        <h2 className={css({ w: '100%', ta: 'center' })}>{__('Stripe Settings')}</h2>
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
        <b className="wdt-200">{__('Publishable key:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="Publishable key"
          value={paySetting.publishableKey || ''}
          name="publishableKey"
          onChange={handleInput}
        />
      </div>
      <div className="flx mt-3">
        <b className="wdt-200">{__('Secret Key:')}</b>
        <input
          type="text"
          className="btcd-paper-inp"
          placeholder="Secret Key"
          value={paySetting.clientSecret || ''}
          name="clientSecret"
          onChange={handleInput}
        />
      </div>
      <div className="flx">
        <small className="d-blk mt-2" style={{ marginLeft: 170 }}>
          {__('To get Publishable key & Secret key, Please Visit')}
          {' '}
          <a
            className="btcd-link"
            href="https://dashboard.stripe.com/apikeys"
            target="_blank"
            rel="noreferrer"
          >
            {__('Stripe Developer Dashboard')}
          </a>
        </small>
      </div>
    </div>
  )
}
