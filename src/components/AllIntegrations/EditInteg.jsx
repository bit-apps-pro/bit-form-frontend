import { useAtom, useAtomValue } from 'jotai'
import { lazy, Suspense } from 'react'
import { useFela } from 'react-fela'
import { Link, useParams } from 'react-router-dom'
import { $fieldsArr, $integrations } from '../../GlobalStates/GlobalStates'
import ChevronLeft from '../../Icons/ChevronLeft'
import app from '../../styles/app.style'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import EditAdvancedFormIntegration from './AdvancedFormIntegration/EditAdvancedFormIntegration'
import EditAutomatorWP from './AutomatorWP/EditAutomatorWP'
import EditFlowMattic from './FlowMattic/EditFlowMattic'
import EditIFTTT from './IFTTT/EditIFTTT'
import EditN8NIO from './n8nIO/EditN8NIO'
import EditSperseIO from './SperseIO/EditSperseIO'
import EditThriveAutomator from './ThriveAutomator/EditThriveAutomator'
import EditUncannyAutomator from './UncannyAutomator/EditUncannyAutomator'
import EditWPWebhooks from './WPWebhooks/EditWPWebhooks'
import EditSureTriggers from './SureTriggers/EditSureTriggers'
import { allowedFieldsForIntegration } from './integrationHelper'

const EditZohoAnalytics = lazy(() => import('./ZohoAnalytics/EditZohoAnalytics'))
const EditZohoBigin = lazy(() => import('./ZohoBigin/EditZohoBigin'))
const EditZohoCampaigns = lazy(() => import('./ZohoCampaigns/EditZohoCampaigns'))
const EditZohoCreator = lazy(() => import('./ZohoCreator/EditZohoCreator'))
const EditZohoCRM = lazy(() => import('./ZohoCRM/EditZohoCRM'))
const EditZohoDesk = lazy(() => import('./ZohoDesk/EditZohoDesk'))
const EditZohoMail = lazy(() => import('./ZohoMail/EditZohoMail'))
const EditZohoMarketingHub = lazy(() => import('./ZohoMarketingHub/EditZohoMarketingHub'))
const EditZohoProjects = lazy(() => import('./ZohoProjects/EditZohoProjects'))
const EditZohoRecruit = lazy(() => import('./ZohoRecruit/EditZohoRecruit'))
const EditZohoSheet = lazy(() => import('./ZohoSheet/EditZohoSheet'))
const EditZohoSign = lazy(() => import('./ZohoSign/EditZohoSign'))
const EditZohoWorkDrive = lazy(() => import('./ZohoWorkDrive/EditZohoWorkDrive'))
const EditGoogleSheet = lazy(() => import('./GoogleSheet/EditGoogleSheet'))
const EditMailChimp = lazy(() => import('./MailChimp/EditMailChimp'))
const EditRapidmail = lazy(() => import('./Rapidmail/EditRapidmail'))
const EditHubspot = lazy(() => import('./Hubspot/EditHubspot'))
const EditGetgist = lazy(() => import('./Getgist/EditGetgist'))
const EditElasticEmail = lazy(() => import('./ElasticEmail/EditElasticEmail'))
const EditAcf = lazy(() => import('./Acf/EditAcf'))
const EditMetabox = lazy(() => import('./Metabox/EdtiMetabox'))
const EditPod = lazy(() => import('./Pods/EditPod'))
const EditMailPoet = lazy(() => import('./MailPoet/EditMailPoet'))
const EditSendinBlue = lazy(() => import('./SendinBlue/EditSendinBlue'))
const EditWooCommerce = lazy(() => import('./WooCommerce/EditWooCommerce'))
const EditActiveCampaign = lazy(() => import('./ActiveCampaign/EditActiveCampaign'))
const EditWebHooks = lazy(() => import('./WebHooks/EditWebHooks'))
const EditZapier = lazy(() => import('./Zapier/EditZapier'))
const EditIntegromat = lazy(() => import('./Integromat/EditIntegromat'))
const EditZohoFlow = lazy(() => import('./ZohoFlow/EditZohoFlow'))
const EditIntegrately = lazy(() => import('./Integrately/EditIntegrately'))
const EditPabbly = lazy(() => import('./Pabbly/EditPabbly'))
const EditTelegram = lazy(() => import('./Telegram/EditTelegram'))
const EditFluentCrm = lazy(() => import('./FluentCRM/EditFluentCrm'))
const EditEncharge = lazy(() => import('./Encharge/EditEncharge'))
const EditAutonami = lazy(() => import('./Autonami/EditAutonami'))
const EditDropbox = lazy(() => import('./Dropbox/EditDropbox'))
const EditOneDrive = lazy(() => import('./OneDrive/EditOneDrive'))
const EditAcumbamail = lazy(() => import('./Acumbamail/EditAcumbamail'))
const EditGroundhogg = lazy(() => import('./Groundhogg/EditGroundhogg'))
const EditSendFox = lazy(() => import('./SendFox/EditSendFox'))
const EditMailerLite = lazy(() => import('./MailerLite/EditMailerLite'))
const EditTwilio = lazy(() => import('./Twilio/EditTwilio'))

export default function EditInteg({ allIntegURL }) {
  const { id } = useParams()
  const [integs, setIntegration] = useAtom($integrations)
  const integrations = deepCopy(integs)
  const formFields = allowedFieldsForIntegration(useAtomValue($fieldsArr))
  const { css } = useFela()

  const renderIntegByType = () => {
    switch (integrations[id].type) {
      case 'Zoho CRM':
        return <EditZohoCRM allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Recruit':
        return <EditZohoRecruit allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Analytics':
        return <EditZohoAnalytics allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Campaigns':
        return <EditZohoCampaigns allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Desk':
        return <EditZohoDesk allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho WorkDrive':
        return <EditZohoWorkDrive allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Mail':
        return <EditZohoMail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Sheet':
        return <EditZohoSheet allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Projects':
        return <EditZohoProjects allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Sign':
        return <EditZohoSign allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Marketing Hub':
        return <EditZohoMarketingHub allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Creator':
        return <EditZohoCreator allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Bigin':
        return <EditZohoBigin allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Google Sheet':
        return <EditGoogleSheet allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Mail Chimp':
        return <EditMailChimp allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Rapidmail':
        return <EditRapidmail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Hubspot':
        return <EditHubspot allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Getgist':
        return <EditGetgist allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'ElasticEmail':
        return <EditElasticEmail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'ACF':
        return <EditAcf allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'MetaBox':
        return <EditMetabox allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Pods':
        return <EditPod allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Mail Poet':
        return <EditMailPoet allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'SendinBlue': case 'Brevo(SendinBlue)':
        return <EditSendinBlue allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'WooCommerce':
        return <EditWooCommerce allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'ActiveCampaign':
        return <EditActiveCampaign allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Web Hooks':
        return <EditWebHooks allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zapier':
        return <EditZapier allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Integromat':
        return <EditIntegromat allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Integrately':
        return <EditIntegrately allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Pabbly':
        return <EditPabbly allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Flow':
        return <EditZohoFlow allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Telegram':
        return <EditTelegram allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Fluent CRM':
        return <EditFluentCrm allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Encharge':
        return <EditEncharge allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Autonami':
        return <EditAutonami allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Dropbox':
        return <EditDropbox allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Acumbamail':
        return <EditAcumbamail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'OneDrive':
        return <EditOneDrive allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Groundhogg':
        return <EditGroundhogg allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'SendFox':
        return <EditSendFox allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'MailerLite':
        return <EditMailerLite allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Twilio':
        return <EditTwilio allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'FlowMattic':
        return <EditFlowMattic allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'AutomatorWP':
        return <EditAutomatorWP allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Uncanny Automator':
        return <EditUncannyAutomator allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Automate Hub SperseIO':
        return <EditSperseIO allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Thrive Automator':
        return <EditThriveAutomator allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'WP Webhooks':
        return <EditWPWebhooks allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Advanced Form Integration':
        return <EditAdvancedFormIntegration allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'IFTTT':
        return <EditIFTTT allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'N8NIO':
        return <EditN8NIO allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'SureTriggers':
        return <EditSureTriggers allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      default:
        break
    }
    return null
  }

  return (
    <div>
      <div className="flx">
        <Link to={allIntegURL} className={`${css(app.btn)} btcd-btn-o-gray`}>
          <ChevronLeft size="15" />
          &nbsp;Back
        </Link>
        <div className="w-8 txt-center">
          <b className="f-lg">{integrations[id].type}</b>
          <div>{__('Integration Settings')}</div>
        </div>
      </div>
      <Suspense fallback={<Loader className="g-c" style={{ height: '90vh' }} />}>
        {renderIntegByType()}
      </Suspense>
    </div>
  )
}
