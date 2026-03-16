import { NavLink, Route, Routes, useParams } from 'react-router-dom'
// import Cpt from '../components/Cpt/Cpt'
import Apikey from '../components/Apikey'
import Cpt from '../components/Cpt/Cpt'
import GCLID from '../components/GCLID'
import General from '../components/GeneralSettings/General'
// import Cpt from '../components/Cpt/Cpt';
import CaptchaRoutes from '../components/CaptchaRoutes'
import ErrorBoundary from '../components/ErrorBoundary'
import GlobalIntegrations from '../components/GlobalIntegrations'
import Payments from '../components/Payments'
import Pdf from '../components/Pdf'
import SMTP from '../components/Smtp/SMTP'
import APIIcon from '../Icons/APIIcon'
import CodeSnippetIcn from '../Icons/CodeSnippetIcn'
import CPTIcn from '../Icons/CPTIcn'
import GoogleAdIcn from '../Icons/GoogleAdIcn'
import MailOpenIcn from '../Icons/MailOpenIcn'
import PaymentsIcn from '../Icons/PaymentsIcn'
import PdfIcn from '../Icons/PdfIcn'
import ReCaptchaIcn from '../Icons/ReCaptchaIcn'
import SettingsIcn from '../Icons/SettingsIcn'
import { __ } from '../Utils/i18nwrap'

function AppSettingsPage() {
  const params = useParams()
  return (
    <div className="d-flx">
      <aside className="btcd-app-setting-sidebar mr-4">
        <NavLink
          to="/app-settings/general"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <SettingsIcn size="18" className="mr-2" />
          <span className="ml-2">{__('General')}</span>
        </NavLink>
        <NavLink
          to="/app-settings/recaptcha"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <ReCaptchaIcn size="21" className="mr-1" />
          {__('CAPTCHA')}
        </NavLink>
        <NavLink
          to="/app-settings/payments"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <PaymentsIcn size="20" className="mr-2" />
          <span className="ml-2">{__('Payments')}</span>
        </NavLink>
        <NavLink
          to="/app-settings/integrations"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <CodeSnippetIcn size="20" className="mr-2" />
          <span className="ml-2">{__('Integrations')}</span>
        </NavLink>
        <NavLink
          to="/app-settings/gclid"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <span className="mr-1"><GoogleAdIcn size={19} /></span>
          {__('Google Ads')}
        </NavLink>
        <NavLink
          to="/app-settings/smtp"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <span className="mr-1"><MailOpenIcn size="21" /></span>
          {__('SMTP')}
        </NavLink>
        <NavLink
          to="/app-settings/pdf"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          {/* <SettingsIcn size="18" className="mr-2" /> */}
          <PdfIcn size="18" className="mr-2" />
          <span className="ml-2">{__('PDF')}</span>
        </NavLink>
        <NavLink
          to="/app-settings/cpt"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <span className="mr-1"><CPTIcn size={21} /></span>
          {__('CPT')}
        </NavLink>
        <NavLink
          to="/app-settings/api"
          className={({ isActive }) => (isActive ? 'btcd-app-s-a' : '')}
        >
          <span className="mr-1"><APIIcon size={21} /></span>
          {__('API')}
        </NavLink>
      </aside>
      <ErrorBoundary resetKey={params?.['*']}>
        <Routes>
          {/* <Route path="/app-settings/recaptcha" element={<Captcha />} />
          <Route path="/app-settings/gclid" element={<GCLID />} />
          <Route path="/app-settings/smtp" element={<SMTP />} />
          <Route path="/app-settings/cpt" element={<Cpt />} />
          <Route path="/app-settings/api" element={<Apikey />} />
          <Route path="/app-settings/payments" element={<Payments />} /> */}
          {/* <Route path="app-settings/*"> */}
          <Route index path="recaptcha/*" element={<CaptchaRoutes />} />
          <Route path="integrations/*" element={<GlobalIntegrations />} />
          <Route path="gclid" element={<GCLID />} />
          <Route path="smtp" element={<SMTP />} />
          <Route path="cpt" element={<Cpt />} />
          <Route path="api" element={<Apikey />} />
          <Route path="payments/*" element={<Payments />} />
          <Route path="general" element={<General />} />
          <Route path="pdf" element={<Pdf />} />
          {/* </Route> */}
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default AppSettingsPage
