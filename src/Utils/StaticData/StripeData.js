/* eslint-disable import/prefer-default-export */
export const layouts = {
  tabs: {
    type: 'tabs',
    defaultCollapsed: false,
  },
  accordion: {
    type: 'accordion',
    defaultCollapsed: false,
    radios: true,
    spacedAccordionItems: false,
  },
}

export const paymentMethodType = [
  {
    name: 'Pre-authorized debit payments',
    type: 'acss_debit',
    currency: ['usd'],
  },
  {
    name: 'MB WAY',
    type: 'mb_way',
    currency: ['eur'], // remove [cad, 'gbp',  'aud', 'nzd']
  },
  // {
  //   name: 'Pre-authorized debit payments',
  //   type: 'affirm',
  //   currency: ['cad'], // remove[usd,]
  // },
  {
    name: 'Afterpay / Clearpay',
    type: 'afterpay_clearpay',
    currency: ['usd'], // remove[eur, cad, 'gbp',  'aud', 'nzd']
  },
  {
    name: 'Alipay',
    type: 'alipay',
    currency: ['cny', 'usd'], // remove [eur, 'myr', 'jpy','nzd', 'hkd', 'cad', 'gbp',  'sgd',  'aud',]
  },
  // {
  //   name: 'BECS Direct Debit',
  //   type: 'au_becs_debit',
  //   currency: ['usd'],
  // },
  // {
  //   name: 'Bacs Direct Debit',
  //   type: 'bacs_debit',
  //   currency: ['usd'],
  // },
  {
    name: 'Bancontact',
    type: 'bancontact',
    currency: ['eur'],
  },
  // {
  //   name: 'BLIK',
  //   type: 'blik',
  //   currency: ['usd'],
  // },
  // {
  //   name: 'Boleto',
  //   type: 'boleto',
  //   currency: ['usd'],
  // },
  {
    name: 'Card payments',
    type: 'card',
    currency: ['usd', 'aed', 'eur', 'cad', 'gbp', 'aud', 'nzd', 'cny', 'hkd', 'jpy', 'sgd', 'myr', 'dkk', 'chf', 'nok', 'sek', 'czk', 'czk', 'pln'],
  },
  // {
  //   name: 'Stripe Terminal',
  //   type: 'card_present',
  //   currency: ['usd'],
  // },
  {
    name: 'Cash App Pay',
    type: 'cashapp',
    currency: ['usd'],
  },
  // {
  //   name: 'Cash Balance',
  //   type: 'customer_balance',
  //   currency: ['usd'],
  // },
  {
    name: 'EPS',
    type: 'eps',
    currency: ['eur'],
  },
  // {
  //   name: 'FPX',
  //   type: 'fpx',
  //   currency: ['usd'],
  // },
  {
    name: 'giropay',
    type: 'giropay',
    currency: ['eur'],
  },
  // {
  //   name: 'grabpay',
  //   type: 'grabpay',
  //   currency: ['usd'],
  // },
  {
    name: 'iDEAL',
    type: 'ideal',
    currency: ['eur'],
  },
  // {
  //   name: 'Stripe Terminal (interac)',
  //   type: 'interac_present',
  //   currency: ['usd'],
  // },
  {
    name: 'Klarna',
    type: 'klarna',
    currency: ['usd'], // 'eur','chf','czk', 'pln', 'sek', 'nok', 'dkk', 'nzd', 'aud', 'gbp',  cad temporay removed
  },
  // {
  //   name: 'Konbini',
  //   type: 'konbini',
  //   currency: ['usd'],
  // },
  // {
  //   name: 'Link',
  //   type: 'link',
  //   currency: ['usd'],
  // },
  // {
  //   name: 'XOXO',
  //   type: 'oxxo',
  //   currency: ['usd'],
  // },
  {
    name: 'Przelewy24',
    type: 'p24',
    currency: ['eur', 'pln'],
  },
  // {
  //   name: 'Pix',
  //   type: 'pix',
  //   currency: ['usd'],
  // },
  // {
  //   name: 'Promptpay',
  //   type: 'promptpay',
  //   currency: ['usd'],
  // },
  {
    name: 'SEPA Direct Debit',
    type: 'sepa_debit',
    currency: ['eur'],
  },
  {
    name: 'Sofort',
    type: 'sofort',
    currency: ['eur'],
  },
  {
    name: 'ACH Direct Debit',
    type: 'us_bank_account',
    currency: ['usd'],
  },
  {
    name: 'WeChat Pay',
    type: 'wechat_pay',
    currency: ['cny', 'usd'], // remove [eur,'nok', 'sek', 'chf' 'dkk', cad, 'gbp', 'aud', 'hkd', 'jpy',  'sgd', ]
  },
]
// Stripe Supported locales
export const localeCodes = [
  {
    region: 'Stripe detects the locale of the browser',
    code: 'auto',
  },
  {
    region: 'Bulgarian(Bulgaria)',
    code: 'bg',
  },
  {
    region: 'Arabic',
    code: 'ar',
  },
  {
    region: 'Czech(Czech Republic)',
    code: 'cs',
  },
  {
    region: 'Danish(Denmark)',
    code: 'da',
  },
  {
    region: 'German(Germany)',
    code: 'de',
  },
  {
    region: 'Greek(Greece)',
    code: 'el',
  },
  {
    region: 'English',
    code: 'en',
  },
  {
    region: 'English(United Kingdom)',
    code: 'en-GB',
  },
  {
    region: 'Spanish(Spain)',
    code: 'es',
  },
  {
    region: 'Spanish(Latin America)',
    code: 'es-419',
  },
  {
    region: 'Estonian(Estonia)',
    code: 'et',
  },
  {
    region: 'Finnish(Finland)',
    code: 'fi',
  },
  {
    region: 'Filipino(Philipines)',
    code: 'fil',
  },
  {
    region: 'French(France)',
    code: 'fr',
  },
  {
    region: 'French(Canada)',
    code: 'fr-CA',
  },
  {
    region: 'Hebrew(Isreal)',
    code: 'he',
  },
  {
    region: 'Croatian(Croatia)',
    code: 'hr',
  },
  {
    region: 'Hungarian(Hungary)',
    code: 'hu',
  },
  {
    region: 'Indonesian(Indonesia)',
    code: 'id',
  },
  {
    region: 'Italian(Italy)',
    code: 'it',
  },
  {
    region: 'Japanese(Japan)',
    code: 'ja',
  },
  {
    region: 'Korean(Korea)',
    code: 'ko',
  },
  {
    region: 'Lithuanian(Lithuania)',
    code: 'lt',
  },
  {
    region: 'Latvian(Latvia)',
    code: 'lv',
  },
  {
    region: 'Malay(Malaysia)',
    code: 'ms',
  },
  {
    region: 'Maltese(Malta)',
    code: 'mt',
  },
  {
    region: 'Norwegian Bokmål',
    code: 'nb',
  },
  {
    region: 'Dutch(Netherlands)',
    code: 'nl',
  },
  {
    region: 'Polish(Poland)',
    code: 'pl',
  },
  {
    region: 'Portuguese(Brazil)',
    code: 'pt-BR',
  },
  {
    region: 'Portuguese(Brazil)',
    code: 'pt',
  },
  {
    region: 'Romanian(Romania)',
    code: 'ro',
  },
  {
    region: 'Russian(Russia)',
    code: 'ru',
  },
  {
    region: 'Slovak(Slovakia)',
    code: 'sk',
  },
  {
    region: 'Slovenian(Slovenia)',
    code: 'sl',
  },
  {
    region: 'Swedish(Sweden)',
    code: 'sv',
  },
  {
    region: 'Thai(Thailand)',
    code: 'th',
  },
  {
    region: 'Turkish(Turkey)',
    code: 'tr',
  },
  {
    region: 'Vietnamese(Vietnam)',
    code: 'vi',
  },
  {
    region: 'Chinese Simplified(China)',
    code: 'zh',
  },
  {
    region: 'Chinese Traditional(Hong Kong)',
    code: 'zh-HK',
  },
  {
    region: 'Chinese Traditional(Taiwan)',
    code: 'zh-TW',
  },
]

// stripe currencies
export const currencyCodes = [
  { currency: 'United States Dollar', code: 'usd', minAmount: 0.5 },
  { currency: 'United Arab Emirates Dirham', code: 'aed', minAmount: 2 },
  { currency: 'Australian Dollar', code: 'aud', minAmount: 0.5 },
  { currency: 'Bulgarian Lev', code: 'bgn', minAmount: 1 },
  { currency: 'Brazilian Real', code: 'brl', minAmount: 0.5 },
  { currency: 'Canadian Dollar', code: 'cad', minAmount: 0.5 },
  { currency: 'Swiss Franc', code: 'chf', minAmount: 0.5 },
  { currency: 'Czech Koruna', code: 'czk', minAmount: 15 },
  { currency: 'Danish Krone', code: 'dkk', minAmount: 2.5 },
  { currency: 'Euro', code: 'eur', minAmount: 0.5 },
  { currency: 'British Pound', code: 'gbp', minAmount: 0.3 },
  { currency: 'Hong Kong Dollar', code: 'hkd', minAmount: 4 },
  { currency: 'Croatian Kuna', code: 'hrk', minAmount: 0.5 },
  { currency: 'Hungarian Forint', code: 'huf', minAmount: 175 },
  { currency: 'Indonesian Rupiah', code: 'inr', minAmount: 0.5 },
  { currency: 'JAPAN (Yen)', code: 'jpy', minAmount: 50 },
  { currency: 'Mexican Peso', code: 'mxn', minAmount: 10 },
  { currency: 'Malaysian Ringgit', code: 'myr', minAmount: 2 },
  { currency: 'Norwegian Krone', code: 'nok', minAmount: 3 },
  { currency: 'New Zealand Dollar', code: 'nzd', minAmount: 0.5 },
  { currency: 'Poland (Zloty)', code: 'pln', minAmount: 2 },
  { currency: 'Romanian Leu', code: 'ron', minAmount: 2 },
  { currency: 'Swedish Krona', code: 'sek', minAmount: 3 },
  { currency: 'Singapore Dollar', code: 'sgd', minAmount: 0.5 },
  { currency: 'Thailand (Baht)', code: 'thb', minAmount: 10 },
]

// https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts

export const themes = {
  stripe: {
    theme: 'stripe',
  },
  night: {
    theme: 'night',
    labels: 'floating',
  },
  flat: {
    theme: 'flat',
  },
  minimal: {
    theme: 'flat',
    variables: {
      fontFamily: ' "Gill Sans", sans-serif',
      fontLineHeight: '1.5',
      borderRadius: '10px',
      colorBackground: '#F6F8FA',
      colorPrimaryText: '#262626',
    },
    rules: {
      '.Block': {
        backgroundColor: 'var(--colorBackground)',
        boxShadow: 'none',
        padding: '12px',
      },
      '.Input': {
        padding: '12px',
      },
      '.Input:disabled, .Input--invalid:disabled': {
        color: 'lightgray',
      },
      '.Tab': {
        padding: '10px 12px 8px 12px',
        border: 'none',
      },
      '.Tab:hover': {
        border: 'none',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
      },
      '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
        border: 'none',
        backgroundColor: '#fff',
        boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
      },
      '.Label': {
        fontWeight: '500',
      },
    },
  },
  bubblegum: {
    theme: 'flat',
    variables: {
      fontWeightNormal: '500',
      borderRadius: '2px',
      colorBackground: 'white',
      colorPrimary: '#DF1B41',
      colorPrimaryText: 'white',
      spacingGridRow: '15px',
    },
    rules: {
      '.Label': {
        marginBottom: '6px',
      },
      '.Tab, .Input, .Block': {
        boxShadow: '0px 3px 10px rgba(18, 42, 66, 0.08)',
        padding: '12px',
      },
    },
  },
  'ninety five': {
    theme: 'none',
    variables: {
      fontFamily: 'Verdana',
      fontLineHeight: '1.5',
      borderRadius: '0',
      colorBackground: '#dfdfdf',
    },
    rules: {
      '.Input': {
        backgroundColor: '#ffffff',
        boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
      },
      '.Input--invalid': {
        color: '#DF1B41',
      },
      '.Tab, .Block': {
        boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
      },
      '.Tab:hover': {
        backgroundColor: '#eee',
      },
      '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
        backgroundColor: '#ccc',
      },
    },
  },
  dark: {
    theme: 'night',
    variables: {
      fontFamily: 'Sohne, system-ui, sans-serif',
      fontWeightNormal: '500',
      borderRadius: '8px',
      colorBackground: '#0A2540',
      colorPrimary: '#EFC078',
      colorPrimaryText: '#1A1B25',
      colorText: 'white',
      colorTextSecondary: 'white',
      colorTextPlaceholder: '#727F96',
      colorIconTab: 'white',
      colorLogo: 'dark',
    },
    rules: {
      '.Input, .Block': {
        backgroundColor: 'transparent',
        border: '1.5px solid var(--colorPrimary)',
      },
    },
  },
}
