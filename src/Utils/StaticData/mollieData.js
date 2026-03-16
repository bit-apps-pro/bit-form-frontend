export const currencies = {
  AED: 'United Arab Emirates Dirham',
  AUD: 'Australian Dollar',
  BGN: 'Bulgarian Lev',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CZK: 'Czech Koruna',
  DKK: 'Danish Krone',
  EUR: 'Euro',
  GBP: 'British Pound Sterling',
  HKD: 'Hong Kong Dollar',
  HRK: 'Croatian Kuna',
  HUF: 'Hungarian Forint',
  ILS: 'Israeli New Sheqel',
  ISK: 'Icelandic Króna',
  JPY: 'Japanese Yen',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  PLN: 'Polish Zloty',
  RON: 'Romanian Leu',
  RUB: 'Russian Ruble',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TWD: 'New Taiwan Dollar',
  USD: 'United States Dollar',
  ZAR: 'South African Rand',
}

export const locale = {
  en_US: 'English (United States)(en_US)',
  en_GB: 'English (United Kingdom)(en_GB)',
  nl_NL: 'Dutch (Netherlands)(nl_NL)',
  nl_BE: 'Dutch (Belgium)(nl_BE)',
  fr_FR: 'French (France)(fr_FR)',
  fr_BE: 'French (Belgium)(fr_FR)',
  de_DE: 'German (Germany)(fr_FR)',
  de_AT: 'German (Austria)(fr_FR)',
  de_CH: 'German (Switzerland)(fr_FR)',
  es_ES: 'Spanish (Spain)(fr_FR)',
  ca_ES: 'Catalan (Spain)(fr_FR)',
  pt_PT: 'Portuguese (Portugal)(fr_FR)',
  it_IT: 'Italian (Italy)(fr_FR)',
  nb_NO: 'Norwegian (Bokmål)(fr_FR)',
  sv_SE: 'Swedish (Sweden)(fr_FR)',
  fi_FI: 'Finnish (Finland)(fr_FR)',
  da_DK: 'Danish (Denmark)(fr_FR)',
  is_IS: 'Icelandic (Iceland)(fr_FR)',
  hu_HU: 'Hungarian (Hungary)(fr_FR)',
  pl_PL: 'Polish (Poland)(fr_FR)',
  lv_LV: 'Latvian (Latvia)(fr_FR)',
  lt_LT: 'Lithuanian (Lithuania)(fr_FR)',
}

// supported payment methods
// https://docs.mollie.com/payments/multicurrency 
export const paymentMethodLists = [
  { title: 'Apple Pay', method: 'applepay', min: 0.01, max: 50000 },
  { title: 'Bancontact', method: 'bancontact', min: 0.01, max: 50000 },
  { title: 'Bank Transfer', method: 'banktransfer', min: 0.01, max: 1000000 },
  { title: 'Belfius', method: 'belfius', min: 0.01, max: 50000 },
  { title: 'Credit Card', method: 'creditcard', min: 0, max: 10000 },
  { title: 'Direct Debit', method: 'directdebit', min: 0.01, max: 1000 },
  { title: 'EPS', method: 'eps', min: 1, max: 10000 },
  { title: 'Gift Card', method: 'giftcard', min: 0.01, max: 50000 },
  { title: 'Giropay', method: 'giropay', min: 1, max: 10000 },
  { title: 'iDEAL', method: 'ideal', min: 0.01, max: 50000 },
  { title: 'KBC', method: 'kbc', min: 0.01, max: 50000 },
  { title: 'MyBank', method: 'mybank', min: 0.01, max: 50000 },
  { title: 'PayPal', method: 'paypal', min: 0, max: 10000 },
  { title: 'Paysafecard', method: 'paysafecard', min: 1, max: 999 },
  { title: 'Przelewy24', method: 'przelewy24', min: 0.01, max: 55000 },
  { title: 'Sofort', method: 'sofort', min: 0.01, max: 50000 },
  { title: 'Twint', method: 'twint', min: 0.01, max: 50000 },
]
// [
//   {
//     "payment_method": "Bancontact",
//     "minimum_amount": 0.02,
//     "maximum_amount": 50000
//   },
//   {
//     "payment_method": "Belfius Direct Net",
//     "minimum_amount": 0.01,
//     "maximum_amount": 50000
//   },
//   {
//     "payment_method": "Billie",
//     "minimum_amount": 1,
//     "maximum_amount": 25000
//   },
//   {
//     "payment_method": "Credit card",
//     "minimum_amount": 0,
//     "maximum_amount": 10000
//   },
//   {
//     "payment_method": "eps",
//     "minimum_amount": 1,
//     "maximum_amount": 10000
//   },
//   {
//     "payment_method": "Gift cards",
//     "minimum_amount": 0.01,
//     "maximum_amount": 50000
//   },
//   {
//     "payment_method": "Giropay",
//     "minimum_amount": 1,
//     "maximum_amount": 10000
//   },
//   {
//     "payment_method": "iDEAL",
//     "minimum_amount": 0.01,
//     "maximum_amount": 50000
//   },
//   {
//     "payment_method": "in3",
//     "minimum_amount": 50,
//     "maximum_amount": 5000
//   },
//   {
//     "payment_method": "KBC/CBC",
//     "minimum_amount": 0.01,
//     "maximum_amount": 50000
//   },
//   {
//     "payment_method": "Klarna: Pay later",
//     "minimum_amount": 0.01,
//     "maximum_amount": {
//       "France": 1500,
//       "Sweden": 100000,
//       "Denmark": 50000,
//       "Norway": 75000,
//       "Netherlands": 2500,
//       "Belgium": 1500,
//       "Germany": 4000,
//       "Austria": 5000,
//       "Finland": 3000
//     }
//   },
//   {
//     "payment_method": "Klarna: Pay now",
//     "minimum_amount": 0.10,
//     "maximum_amount": {
//       "default": 10000,
//       "Sweden": 100000
//     }
//   },
//   {
//     "payment_method": "Klarna: Slice it / Pay in 3",
//     "minimum_amount": {
//       "Netherlands": 35,
//       "Germany": 45,
//       "Finland and Austria": 100,
//       "Sweden": 250,
//       "Denmark": 350,
//       "Norway": 250,
//       "Spain, Italy, Portugal": 35
//     },
//     "maximum_amount": {
//       "Netherlands": 4000,
//       "Germany": 5000,
//       "Finland and Austria": 5000,
//       "Sweden": 100000,
//       "Denmark": 50000,
//       "Norway": 75000,
//       "Spain, Italy, Portugal": 1500
//     }
//   },
//   {
//     "payment_method": "PayPal",
//     "minimum_amount": 0,
//     "maximum_amount": {
//       "JPY": 1000000
//     }
//   },
//   {
//     "payment_method": "paysafecard",
//     "minimum_amount": 1,
//     "maximum_amount": 999
//   },
//   {
//     "payment_method": "Przelewy 24",
//     "minimum_amount": 0.01,
//     "maximum_amount": 55000
//   },
//   {
//     "payment_method": "SEPA bank transfer",
//     "minimum_amount": 0.01,
//     "maximum_amount": 1000000
//   },
//   {
//     "payment_method": "SEPA Direct Debit",
//     "minimum_amount": 0.01,
//     "maximum_amount": 1000
//   }
// ]
