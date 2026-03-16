import { useAtom, useAtomValue } from 'jotai'
import { lazy, Suspense } from 'react'
import { useFela } from 'react-fela'
import { Link, useParams } from 'react-router-dom'
import { $connectedApps } from '../../GlobalStates/AppSettingsStates'
import { $fieldsArr } from '../../GlobalStates/GlobalStates'
import ChevronLeft from '../../Icons/ChevronLeft'
import app from '../../styles/app.style'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import CommonNoticeForWebhook from './CommonNoticeForWebhook'
import { allowedFieldsForIntegration } from './integrationHelper'
import MailChimpGlobal from './MailChimp/MailChimpGlobal'
import OneDriveGlobal from './OneDrive/OneDriveGlobal'
import ZohoAnalyticsGlobal from './ZohoAnalytics/ZohoAnalyticsGlobal'
import ZohoBiginGlobal from './ZohoBigin/ZohoBiginGlobal'
import ZohoCampaignsGlobal from './ZohoCampaigns/ZohoCampaignsGlobal'
import ZohoCreatorGlobal from './ZohoCreator/ZohoCreatorGlobal'
import ZohoCRMGlobal from './ZohoCRM/ZohoCRMGlobal'
import ZohoDeskGlobal from './ZohoDesk/ZohoDeskGlobal'
import ZohoMailGlobal from './ZohoMail/ZohoMailGlobal'
import ZohoMarketingHubGlobal from './ZohoMarketingHub/ZohoMarketingHubGlobal'
import ZohoProjectsGlobal from './ZohoProjects/ZohoProjectsGlobal'
import ZohoRecruitGlobal from './ZohoRecruit/ZohoRecruitGlobal'
import ZohoSheetGlobal from './ZohoSheet/ZohoSheetGlobal'
import ZohoSignGlobal from './ZohoSign/ZohoSignGlobal'
import ZohoWorkDriveGlobal from './ZohoWorkDrive/ZohoWorkDriveGlobal'

const GoogleSheetGlobal = lazy(() => import('./GoogleSheet/GoogleSheetGlobal'))
const RapidmailGlobal = lazy(() => import('./Rapidmail/RapidmailGlobal'))
const ActiveCampaignGlobal = lazy(() => import('./ActiveCampaign/ActiveCampaignGlobal'))

const DropboxGlobal = lazy(() => import('./Dropbox/DropboxGlobal'))
const AcumbamailGlobal = lazy(() => import('./Acumbamail/AcumbamailGlobal'))
const GroundhoggGlobal = lazy(() => import('./Groundhogg/GroundhoggGlobal'))

export default function NewAppConnection({ allIntegURL }) {
  const { integUrlName } = useParams()
  const [globalConnectedApps, setConnectedApps] = useAtom($connectedApps)
  const connectedApps = deepCopy(globalConnectedApps)
  // const formFields = useAtomValue($fieldsArr)
  const formFields = allowedFieldsForIntegration(useAtomValue($fieldsArr))
  const { css } = useFela()

  const renderIntegByName = () => {
    switch (integUrlName) {
      case 'Zoho CRM':
        return <ZohoCRMGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Recruit':
        return <ZohoRecruitGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Analytics':
        return <ZohoAnalyticsGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Campaigns':
        return <ZohoCampaignsGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Desk':
        return <ZohoDeskGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho WorkDrive':
        return <ZohoWorkDriveGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Mail':
        return <ZohoMailGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Sheet':
        return <ZohoSheetGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Projects':
        return <ZohoProjectsGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Sign':
        return <ZohoSignGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Marketing Hub':
        return <ZohoMarketingHubGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Creator':
        return <ZohoCreatorGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Zoho Bigin':
        return <ZohoBiginGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Google Sheet':
        return <GoogleSheetGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Mail Chimp':
        return <MailChimpGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Rapidmail':
        return <RapidmailGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'ActiveCampaign':
        return <ActiveCampaignGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Dropbox':
        return <DropboxGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Acumbamail':
        return <AcumbamailGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'OneDrive':
        return <OneDriveGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />
      case 'Groundhogg':
        return <GroundhoggGlobal allIntegURL={allIntegURL} formFields={formFields} connectedApps={connectedApps} setConnectedApps={setConnectedApps} />

      // this types are temporary added
      case 'Telegram':
      case 'Encharge':
      case 'SendFox':
      case 'MailerLite':
      case 'Twilio':
      case 'Hubspot':
      case 'Getgist':
      case 'ElasticEmail':
      case 'SendinBlue':
      case 'ACF':// this types are
      case 'Autonami':
      case 'Fluent CRM':
      case 'Mail Poet':
      case 'MetaBox':
      case 'Pods':
      case 'WooCommerce':
      case 'WP Webhooks':
      case 'Web Hooks':
      case 'Uncanny Automator':
      case 'Thrive Automator':
      case 'FlowMattic':
      case 'Automate Hub SperseIO':
      case 'AutomatorWP':
      case 'Advanced Form Integration':
      case 'IFTTT':
      case 'Zapier':
      case 'Integromat':
      case 'Integrately':
      case 'Pabbly':
      case 'N8NIO':
      case 'Zoho Flow':
      case 'SureTriggers':

        return <CommonNoticeForWebhook allIntegURL={allIntegURL} integrationName={integUrlName} />
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
          <div className="mb-1">
            <b className="f-lg">{integUrlName === 'SendinBlue' ? 'Brevo(SendinBlue)' : integUrlName}</b>
          </div>
          <div>{__('Integration Settings')}</div>
        </div>
      </div>

      <Suspense fallback={<Loader className="g-c" style={{ height: '90vh' }} />}>
        {renderIntegByName()}
      </Suspense>
    </div>
  )
}
