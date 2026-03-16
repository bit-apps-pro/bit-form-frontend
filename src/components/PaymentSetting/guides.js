import { __ } from '../../Utils/i18nwrap'

export default {
  mollie: [
    __('Choose a unique name to identify this integration within your app.'),
    __('Login to you Mollie account (or create on if you haven\'t already).'),
    `<a className="btcd-link" href="https://www.mollie.com/dashboard/developers/api-keys" target="_blank" rel="noreferrer">${__('Go to your Mollie Dashboard')}</a>${__(' and find the API section.')}`,
    __('Generate a new API key or use an existing one (you can use test API key for testing purposes). This key is required for authenticating API requests.'),
    `${__('Copy the API key and paste it in the Bit Form ')}<strong>API key</strong>${__(' field above.')}`,
    `${__('Then click on the ')}<strong>Save</strong>${__(' button to save the settings.')}`,
    __('Please go to your form now and add a Mollie payment field.'),
    `${__('For more details, please visit the ')}<a className="btcd-link" href="https://bit-form.com/wp-docs/payments-setup/setup-mollie-payment-integration/" target="_blank" rel="noreferrer">${__('Bit form Mollie Payment Gateway documentation')}</a>.`,
  ],
  paypal: [
    __('Choose a unique name to identify this integration within your app.'),
    __('Login to you PayPal account (or create on if you haven\'t already).'),
    `<a className="btcd-link" href="https://developer.paypal.com/developer/applications/" target="_blank" rel="noreferrer">${__('Go to your PayPal Dashboard')}</a>${__(' and find the API section.')}`,
    __('Select Transaction Mode (Live or Sandbox).'),
    `${__('Copy the')}<strong>Client Id</strong>${__(' and ')}<strong>${__('Client Secret')}</strong>${__(' from PayPal Dashboard and paste it in the Bit Form')}<strong>Client Id</strong>${__(' and ')}<strong>Client Secret</strong>${__(' field above (you can use Sandbox or Live mode).')}`,
    `${__('Then click on the ')}<strong>Save</strong>${__(' button to save the settings.')}`,
    __('Please go to your form now and add a PayPal payment field.'),
    `${__('For more details, please visit the ')}<a className="btcd-link" href="https://bit-form.com/wp-docs/payments-setup/setup-paypal-payment-integration/" target="_blank" rel="noreferrer">${__('Bit form PayPal Payment Gateway documentation')}</a>${__(' and watch ')}<a className="btcd-link" href="https://youtu.be/nN0U569jhRU?si=Alr666Ms5XAoLEip" target="_blank" rel="noreferrer">${__('PayPal Integrations Video')}</a>.`,
  ],
  stripe: [
    __('Choose a unique name to identify this integration within your app.'),
    __('Login to you Stripe account (or create on if you haven\'t already).'),
    `<a className="btcd-link" href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer">${__('Go to your Stripe Dashboard')}</a>${__(' and find the API Key section.')}`,
    `${__('Copy the ')}<strong>Publishable Key</strong>${__(' and ')}<strong>Secret Key</strong>${__(' from Stripe API Dashboard and paste it in the Bit Form ')}<strong>Publishable Key</strong>${__(' and ')}<strong>Secret Key</strong>${__(' field above (you can use test API key for testing purposes).')}`,
    `${__('Then click on the ')}<strong>Save</strong>${__(' button to save the settings.')}`,
    __('Please go to your form now and add a Stripe payment field.'),
    `${__('For more details, please visit the ')}<a className="btcd-link" href="https://bit-form.com/wp-docs/payments-setup/setup-stripe-payment-integration/" target="_blank" rel="noreferrer">${__('Bit form Stripe Payment Gateway documentation')}</a>${__(' and watch ')}<a className="btcd-link" href="https://youtu.be/mSlEG6412bM?si=qkIF5-KtU3zPyUYa" target="_blank" rel="noreferrer">${__('Stripe Integrations Video')}</a>.`,
  ],
  razorpay: [
    __('Choose a unique name to identify this integration within your app.'),
    __('Login to you Razorpay account (or create on if you haven\'t already).'),
    `<a className="btcd-link" href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noreferrer">${__('Go to your Razorpay Dashboard')}</a>${__(' and find the API Key section.')}`,
    `${__('Copy the ')}<strong>API Key</strong>${__(' and ')}<strong>API Secret</strong>${__(' from Razorpay API Dashboard and paste it in the Bit Form ')}<strong>API Key</strong>${__(' and ')}<strong>API Secret</strong>${__(' field above.')}`,
    `${__('Then click on the ')}<strong>Save</strong>${__(' button to save the settings.')}`,
    __('Please go to your form now and add a Razorpay payment field.'),
    `${__('For more details, please visit the ')}<a className="btcd-link" href="https://bit-form.com/wp-docs/payments-setup/setup-razorpay-payment-integration/" target="_blank" rel="noreferrer">${__('Bit form Razorpay Payment Gateway documentation')}</a>${__(' and watch ')}<a className="btcd-link" href="https://youtu.be/o1pNfKn2ZNU?si=YZDrkwpLrjKb8TZa" target="_blank" rel="noreferrer">${__('Razorpay Integrations Video')}</a>.`,
  ],
}
