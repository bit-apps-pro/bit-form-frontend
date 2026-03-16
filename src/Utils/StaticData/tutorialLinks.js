import { __ } from '../i18nwrap'

const tutorialLinks = {
  singleEntry: {
    title: __('Allow only one entry for each IP address.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#allow-single-entry-for-each-ip-address',
  },
  requiredLoggedInUser: {
    title: __('Allow only logged in users to submit the form.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#allow-only-logged-in-users-to-submit-the-form',
  },
  preventEmptySubmission: {
    title: __('This will prevent empty form submission.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#disallow-empty-form-submission',
  },
  validateFocusLost: {
    title: __('This will validate the field when the user leaves the field.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#validate-form-input-for-focus-lost',
  },
  disableEntryStoring: {
    title: __('This will disable storing the user entry in the database.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#disable-entry-storing-in-wordpress-database',
  },
  recaptchaV3: {
    title: __('This will enable reCAPTCHA v3.'),
    link: 'https://bitapps.pro/docs/bit-form/integrations/recaptcha-v3-integrations/',
  },
  honeypot: {
    title: `Honeypot protection provides security mechanisms to protect your site from form submission by spam bots. 
    If spam bot activity is detected, form submission is blocked.`,
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#honeypot',
  },
  limitEntry: {
    title: __('This will limit the number of entries.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#disable-this-form-after-limited-entry',
  },
  limitPeriod: {
    title: __('this will limit the form submission for specific period.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#limit-form-submission-period',
  },
  blockedIp: {
    title: __('This will block the specific IP address from submitting the form.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#blocked-ip-list',
  },
  allowedIp: {
    title: __('This will allow the specific IP address to submit the form.'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#allowed-ip-list',
  },
  googleAdds: {
    title: __('This will enable Google Ads conversion tracking.'),
    link: 'https://bitapps.pro/docs/bit-form/integrations/google-ads-integrations/',
  },
  confirmationDoc: {
    title: __('How to Configure Confirmation Message/Redirect page'),
    link: 'https://bitapps.pro/docs/bit-form/confirmation-message/',
  },
  conditionalLogic: {
    title: __('How to Configure Conditional Logic'),
    link: 'https://youtu.be/OjBgk_QuGsk',
  },
  conditionalLogicDoc: {
    title: __('How to Configure Conditional Logic'),
    link: 'https://bitapps.pro/docs/bit-form/conditional-logic/',
  },
  conversationalForm: {
    title: __('How to enable Conversational Form'),
    link: 'https://www.youtube.com/@bit-apps',
  },
  conversationalFormDoc: {
    title: __('How to enable Conversational Form'),
    link: 'https://bitapps.pro/docs/bit-form/conversational-form/',
  },
  integrations: {
    title: __('How to Setup Integrations'),
    link: 'https://youtu.be/vHnwV3Tekr8',
  },
  integrationsDoc: {
    title: __('How to Setup Integrations'),
    link: 'https://bitapps.pro/docs/bit-form/integrations/',
  },
  emailTemplates: {
    title: __('How to Configure Email Templates'),
    link: 'https://youtu.be/HpMUF5EO-Gg',
  },
  emailTemplatesDoc: {
    title: __('How to Configure Email Templates'),
    link: 'https://bitapps.pro/docs/bit-form/email-tempalate/',
  },
  acf: {
    title: __('How to Setup ACF integration'),
    link: 'https://www.youtube.com/watch?v=zu0zB4OgE20&ab_channel=BitApps',
  },
  activeCampaign: {
    title: __('How to Setup ActiveCampaign integration'),
    link: 'https://www.youtube.com/watch?v=CfKrN2yHDxw&ab_channel=BitApps',
  },
  acumbamail: {
    title: __('How to Setup Acumbamail integration'),
    link: 'https://www.youtube.com/watch?v=BKPC_qpN3Ck&ab_channel=BitApps',
  },
  autonami: {
    title: __('How to Setup Autonami integration'),
    link: 'https://www.youtube.com/watch?v=yp1CVdfVITw&ab_channel=BitApps',
  },
  dropbox: {
    title: __('How to Setup Dropbox integration'),
    link: 'https://www.youtube.com/watch?v=ErbHGx3u0xs&ab_channel=BitApps',
  },
  elasticemail: {
    title: __('How to Setup Elastic Email Integration'),
    link: 'https://www.youtube.com/watch?v=FFwpn-9N1lw&ab_channel=BitApps',
  },
  encharge: {
    title: __('How to Setup Encharge integration'),
    link: 'https://www.youtube.com/watch?v=0XM9KhOKWWw&ab_channel=BitApps',
  },
  fluentCRM: {
    title: __('How to Setup Fluent-CRM integration'),
    link: 'https://www.youtube.com/watch?v=kJ2pCH2FQwU&ab_channel=BitApps',
  },
  googelSheets: {
    title: __('How to Setup Google Sheets integration'),
    link: 'https://www.youtube.com/watch?v=Vb4CE-hXbbo&ab_channel=BitApps',
  },
  integrately: {
    title: __('How to Setup Integrately integration'),
    link: 'https://www.youtube.com/watch?v=2tj8MrDzfAA&ab_channel=BitApps',
  },
  integromat: {
    title: __('How to Setup Integromat integration'),
    link: 'https://www.youtube.com/watch?v=myB_pia6bBM&ab_channel=BitApps',
  },
  mailChimp: {
    title: __('How to Setup MailChamp integration'),
    link: 'https://www.youtube.com/watch?v=ZjAVXYbh7LY&ab_channel=BitApps',
  },
  mailPoet: {
    title: __('How to Setup MailPoet integration'),
    link: 'https://www.youtube.com/watch?v=5hDcm4vVwcg&ab_channel=BitApps',
  },
  mailerlite: {
    title: __('How to Setup MailerLite integration'),
    link: 'https://www.youtube.com/watch?v=5hDcm4vVwcg&ab_channel=BitApps',
  },
  metaBox: {
    title: __('How to Setup MetaBox integration'),
    link: 'https://www.youtube.com/watch?v=RSXaqSjqttc&ab_channel=BitApps',
  },
  pabbly: {
    title: __('How to Setup Pabbly integration'),
    link: 'https://www.youtube.com/watch?v=SE_ncIRtv7Q&ab_channel=BitApps',
  },
  pods: {
    title: __('How to Setup Pods integration'),
    link: 'https://www.youtube.com/watch?v=81Uu2Rbmm0Y&ab_channel=BitApps',
  },
  sendinblue: {
    title: __('How to Setup Brevo(SendinBlue) integration'),
    link: 'https://www.youtube.com/watch?v=DLWvKoPbbN8&ab_channel=BitApps',
  },
  telegram: {
    title: __('How to Setup Telegram integration'),
    link: 'https://www.youtube.com/watch?v=M0u1joqrRTA&ab_channel=BitApps',
  },
  wooCommerce: {
    title: __('How to Setup WooCommerce integration'),
    link: 'https://www.youtube.com/playlist?list=PL7c6CDwwm-AIRTzF919Kh67QBmTlNa3td',
  },
  zapier: {
    title: __('How to Setup Zapier integration'),
    link: 'https://www.youtube.com/watch?v=uORXmZANU3M&ab_channel=BitApps',
  },
  zohoAnalytics: {
    title: __('How to Setup Zoho Analytics integration'),
    link: 'https://www.youtube.com/watch?v=Eoxxu3U_3_s&ab_channel=BitApps',
  },
  zohoBigin: {
    title: __('How to Setup Zoho Bigin integration'),
    link: 'https://www.youtube.com/watch?v=9cU1Tn7m3rY&list=PLJDk81Wj7a_OmS6jPi1t7NeIVGJNPV344',
  },
  zohoCampaigns: {
    title: __('How to Setup Zoho Campaigns integration'),
    link: 'https://www.youtube.com/watch?v=ixJXIzy8hOQ&ab_channel=BitApps',
  },
  zohoCreator: {
    title: __('How to Setup Zoho Creator integration'),
    link: 'https://www.youtube.com/watch?v=muB8tE1-bVg&ab_channel=BitApps',
  },
  zohoCrm: {
    title: __('How to Setup Zoho-CRM integration'),
    link: 'https://www.youtube.com/watch?v=0fYVHhXqSJI&list=PL7c6CDwwm-ALDlpDo9vCBjdiJDJ33Xx0z&ab_channel=BitApps',
  },
  zohoDesk: {
    title: __('How to Setup Zoho Desk integration'),
    link: 'https://www.youtube.com/watch?v=zDKRmhTsYEM&ab_channel=BitApps',
  },
  zohoFlow: {
    title: __('How to Setup Zoho Flow integration'),
    link: 'https://www.youtube.com/watch?v=lbRiwN7J97Q&ab_channel=BitApps',
  },
  zohoMail: {
    title: __('How to Setup Zoho Mail integration'),
    link: 'https://www.youtube.com/watch?v=en6GWQ_8who&ab_channel=BitApps',
  },
  zohoMarketingHub: {
    title: __('How to Setup Zoho Marketing Hub integration'),
    link: 'https://www.youtube.com/watch?v=k_Es1XiSQrY&ab_channel=BitApps',
  },
  zohoProjects: {
    title: __('How to Setup Zoho Projects integration'),
    link: 'https://www.youtube.com/watch?v=CaxLekQ-xVY&ab_channel=BitApps',
  },
  zohoRecruit: {
    title: __('How to Setup Zoho Recruit integration'),
    link: 'https://www.youtube.com/watch?v=Bj-oMYQLDqI&list=PL7c6CDwwm-AJ2qnbOYW-UzZBQjWhRE0hg&ab_channel=BitApps',
  },
  zohoSheet: {
    title: __('How to Setup Zoho Sheet integration'),
    link: 'https://www.youtube.com/watch?v=GDYjKL0NRL0&ab_channel=BitApps',
  },
  zohoSign: {
    title: __('How to Setup Zoho Sign integration'),
    link: 'https://www.youtube.com/watch?v=3ClKsZ9CBYM&ab_channel=BitApps',
  },
  zohoWorkDrive: {
    title: __('How to Setup Zoho Work Drive integration'),
    link: 'https://www.youtube.com/watch?v=27v1F-cZLgg&ab_channel=BitApps',
  },
  doubleOptIn: {
    title: __('How to Configure Double Opt-In'),
    link: 'https://youtu.be/JCo2PsZBsVk',
  },
  doubleOptInDoc: {
    title: __('How to Configure Double Opt-In'),
    link: 'https://bitapps.pro/docs/bit-form/double-opt-in/',
  },
  formAbandonment: {
    title: __('How to Configure Form Abandonment'),
    link: 'https://youtu.be/JCo2PsZBsVk',
  },
  formAbandonmentDoc: {
    title: __('How to Configure Form Abandonment'),
    link: 'https://bitapps.pro/docs/bit-form/form-abandonment/',
  },
  pdfTemplate: {
    title: __('How to Configure PDF Template'),
    link: 'https://youtu.be/rE2LB-oYbE8',
  },
  pdfTemplateDoc: {
    title: __('How to Configure PDF Template'),
    link: 'https://bitapps.pro/docs/bit-form/pdf-attachment/',
  },
  flowmattic: {
    title: __('How to Setup FlowMattic integration'),
    link: '#',
  },
  automatorwp: {
    title: __('How to Setup AutomatorWP integration'),
    link: '#',
  },
  uncannyAutomator: {
    title: __('How to Setup Uncanny Automator integration'),
    link: '#',
  },
  sperseIO: {
    title: __('How to Setup Automate Hub by Sperse.IO integration'),
    link: '#',
  },
  thriveAutomator: {
    title: __('How to Setup Thrive Automator integration'),
    link: '#',
  },
  wpWebhooks: {
    title: __('How to Setup WP Webhooks integration'),
    link: '#',
  },
  advancedFormIntegration: {
    title: __('How to Setup Advanced Form Integration'),
    link: '#',
  },
  ifttt: {
    title: __('How to Setup IFTTT integration'),
    link: '#',
  },
  n8nIO: {
    title: __('How to Setup n8n.io integration'),
    link: '#',
  },
  sureTriggers: {
    title: __('How to Setup Sure Triggers integration'),
    link: '#',
  },
  authSettings: {
    title: __('How to Configure WP User Registration'),
    link: 'https://www.youtube.com/watch?v=_uo7hsIB0dM',
  },
  authSettingsDoc: {
    title: __('How to Configure WP User Registration'),
    link: 'https://bitapps.pro/docs/bit-form/wp-auth/',
  },
  allowUserToView: {
    title: __('Allow Only logged in users to view all entries'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#allow-all-logged-in-users-to-edit-form-entries',
  },
  allowUserToEdit: {
    title: __('Allow logged in users to edit form entries'),
    link: 'https://bitapps.pro/docs/bit-form/form-settings/#allow-all-logged-in-users-to-edit-form-entries',
  },
  globalValidationMsg: {
    title: __('Allow to Configure Global Validation Message'),
    link: 'https://bit-form.com/wp-docs/global-settings/#validation-error-invalid-message',
  },
}
export default tutorialLinks
