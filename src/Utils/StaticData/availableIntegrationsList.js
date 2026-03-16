import acf from '../../resource/img/integ/ACF.svg'
import Acumbamail from '../../resource/img/integ/Acumbamail.svg'
import oneDrive from '../../resource/img/integ/OneDrive.svg'
import activeCampaign from '../../resource/img/integ/activeCampaign.svg'
import advancedFormIntegration from '../../resource/img/integ/advancedFormIntegration.svg'
import zohoAnalytics from '../../resource/img/integ/analytics.svg'
import automatorWP from '../../resource/img/integ/automatorWP.svg'
import autonami from '../../resource/img/integ/autonami.svg'
import zohoBigin from '../../resource/img/integ/bigin.svg'
import zohoCamp from '../../resource/img/integ/campaigns.svg'
import zohoCreator from '../../resource/img/integ/creator.svg'
import zohoCRM from '../../resource/img/integ/crm.svg'
import zohoDesk from '../../resource/img/integ/desk.svg'
import dropbox from '../../resource/img/integ/dropbox.svg'
import elasticemail from '../../resource/img/integ/elasticemail.svg'
import encharge from '../../resource/img/integ/encharge .svg'
import flowmattic from '../../resource/img/integ/flowmattic.svg'
import fluentcrm from '../../resource/img/integ/fluentcrm.svg'
import getgist from '../../resource/img/integ/getgist.svg'
import googleSheet from '../../resource/img/integ/googleSheets.svg'
import groundhogg from '../../resource/img/integ/groundhogg.svg'
import zohoHub from '../../resource/img/integ/hub.svg'
import hubspot from '../../resource/img/integ/hubspot.svg'
import ifttt from '../../resource/img/integ/ifttt.svg'
import integrately from '../../resource/img/integ/integrately.svg'
import integromat from '../../resource/img/integ/integromat.svg'
import zohoMail from '../../resource/img/integ/mail.svg'
import mailChimp from '../../resource/img/integ/mailchimp.svg'
import mailerLite from '../../resource/img/integ/mailerLite.svg'
import mailPoet from '../../resource/img/integ/mailpoet.svg'
import metabox from '../../resource/img/integ/metabox.svg'
import n8n from '../../resource/img/integ/n8n.svg'
import pabbly from '../../resource/img/integ/pabbly.svg'
import pods from '../../resource/img/integ/pods.svg'
import zohoProjects from '../../resource/img/integ/projects.svg'
import rapidmail from '../../resource/img/integ/rapidmail.svg'
import zohoRecruit from '../../resource/img/integ/recruit.svg'
import sendfox from '../../resource/img/integ/sendfox.svg'
import sendinblue from '../../resource/img/integ/sendinblue.svg'
import zohoSheet from '../../resource/img/integ/sheet.svg'
import zohoSign from '../../resource/img/integ/sign.svg'
import sperseio from '../../resource/img/integ/sperseio.svg'
import sureTriggers from '../../resource/img/integ/sureTriggers.svg'
import telegram from '../../resource/img/integ/telegram.svg'
import thriveAutomator from '../../resource/img/integ/thriveAutomator.svg'
import twilio from '../../resource/img/integ/twilio.svg'
import uncannyAutomator from '../../resource/img/integ/uncannyAutomator.svg'
import webhooks from '../../resource/img/integ/webhooks.svg'
import wooCommerce from '../../resource/img/integ/woocommerce.svg'
import zohoWorkdrive from '../../resource/img/integ/workdrive.svg'
import wpWebhooks from '../../resource/img/integ/wpWebhooks.svg'
import zapier from '../../resource/img/integ/zapier.svg'
import zohoflow from '../../resource/img/integ/zohoflow.svg'

const integs = [
  { type: 'Zoho CRM', logo: zohoCRM },
  { type: 'Web Hooks', logo: webhooks },
  { type: 'Zapier', logo: zapier },
  { type: 'Integromat', logo: integromat, title: 'Make(Ingegromat)' },
  { type: 'Integrately', logo: integrately },
  { type: 'Pabbly', logo: pabbly },
  { type: 'Zoho Flow', logo: zohoflow },
  { type: 'Google Sheet', logo: googleSheet },
  { type: 'Mail Chimp', logo: mailChimp },
  { type: 'ACF', logo: acf },
  { type: 'MetaBox', logo: metabox },
  { type: 'Pods', logo: pods },
  { type: 'Mail Poet', logo: mailPoet },
  { type: 'Brevo(SendinBlue)', logo: sendinblue, title: 'Brevo(SendinBlue)' },
  { type: 'WooCommerce', logo: wooCommerce },
  { type: 'ActiveCampaign', logo: activeCampaign },
  { type: 'Telegram', logo: telegram },
  { type: 'Fluent CRM', logo: fluentcrm },
  { type: 'Autonami', logo: autonami },
  { type: 'Acumbamail', logo: Acumbamail },
  { type: 'OneDrive', logo: oneDrive },
  { type: 'Dropbox', logo: dropbox },
  { type: 'Encharge', logo: encharge },
  { type: 'Rapidmail', logo: rapidmail },
  { type: 'Hubspot', logo: hubspot },
  { type: 'Getgist', logo: getgist },
  { type: 'ElasticEmail', logo: elasticemail },
  { type: 'Groundhogg', logo: groundhogg },
  { type: 'SendFox', logo: sendfox },
  { type: 'Zoho Recruit', logo: zohoRecruit },
  { type: 'Zoho Analytics', logo: zohoAnalytics },
  { type: 'Zoho Campaigns', logo: zohoCamp },
  { type: 'Zoho WorkDrive', logo: zohoWorkdrive },
  { type: 'Zoho Desk', logo: zohoDesk },
  { type: 'Zoho Mail', logo: zohoMail },
  { type: 'Zoho Sheet', logo: zohoSheet },
  { type: 'Zoho Projects', logo: zohoProjects },
  { type: 'Zoho Sign', logo: zohoSign },
  { type: 'Zoho Marketing Hub', logo: zohoHub },
  { type: 'Zoho Creator', logo: zohoCreator },
  { type: 'Zoho Bigin', logo: zohoBigin },
  { type: 'MailerLite', logo: mailerLite },
  { type: 'Twilio', logo: twilio },
  { type: 'FlowMattic', logo: flowmattic },
  { type: 'AutomatorWP', logo: automatorWP },
  { type: 'Uncanny Automator', logo: uncannyAutomator },
  { type: 'Automate Hub SperseIO', logo: sperseio },
  { type: 'Thrive Automator', logo: thriveAutomator },
  { type: 'WP Webhooks', logo: wpWebhooks },
  { type: 'Advanced Form Integration', logo: advancedFormIntegration },
  { type: 'IFTTT', logo: ifttt },
  { type: 'N8NIO', logo: n8n },
  { type: 'SureTriggers', logo: sureTriggers },
]

export default integs
