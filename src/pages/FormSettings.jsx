import loadable from '@loadable/component'
import { useAtom, useSetAtom } from 'jotai'
import { Suspense, lazy, memo } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { NavLink, Route, Routes, useParams } from 'react-router-dom'
import { $isNewThemeStyleLoaded } from '../GlobalStates/GlobalStates'
import { $savedStylesAndVars } from '../GlobalStates/SavedStylesAndVars'
import { $allStyles } from '../GlobalStates/StylesState'
import { $allThemeColors } from '../GlobalStates/ThemeColorsState'
import { $allThemeVars } from '../GlobalStates/ThemeVarsState'
import CodeSnippetIcn from '../Icons/CodeSnippetIcn'
import ConditionalIcn from '../Icons/ConditionalIcn'
import ConversationIcn from '../Icons/ConversationIcn'
import EmailInbox from '../Icons/EmailInbox'
import FormDraftIcn from '../Icons/FormDraftIcn'
import InfoIcn from '../Icons/InfoIcn'
import MailOpenIcn from '../Icons/MailOpenIcn'
import PageLinkIcn from '../Icons/PageLinkIcn'
import PdfIcn from '../Icons/PdfIcn'
import Settings2 from '../Icons/Settings2'
import TableIcon from '../Icons/TableIcon'
import UserIcn from '../Icons/UserIcn'
import { isObjectEmpty } from '../Utils/Helpers'
import { JCOF } from '../Utils/globalHelpers'
import { __ } from '../Utils/i18nwrap'
import ErrorBoundary from '../components/ErrorBoundary'
import FSettingsLoader from '../components/Loaders/FSettingsLoader'
import IntegLoader from '../components/Loaders/IntegLoader'
import ProModal from '../components/Utilities/ProModal'
import useSWROnce from '../hooks/useSWROnce'

const EmailTemplate = lazy(() => import('../components/EmailTemplate'))
const PdfTemplate = lazy(() => import('../components/PDF/PdfTemplate'))
const WpAuth = lazy(() => import('../components/AuthSettings'))
const Integrations = loadable(() => import('../components/Integrations'), { fallback: <IntegLoader /> })
const Workflow = lazy(() => import('../components/Workflows/Workflow'))
const ConfType = lazy(() => import('../components/ConfType'))
const SingleFormSettings = lazy(() => import('../components/SingleFormSettings'))
const ConversationalFormSettings = lazy(() => import('../components/ConversationalFormSettings'))
const DoubleOptin = lazy(() => import('../components/CompSettings/doubleOptin/DoubleOptin'))
const FormAbandonment = lazy(() => import('../components/FormSettings/FormAbandonment'))
const StandaloneForm = lazy(() => import('../components/FormSettings/StandaloneForm'))
const DataViewsRoute = lazy(() => import('./BfTable/DataViewsRoute'))

function FormSettings() {
  // const { path } = useMatch()
  const { formType, formID } = useParams()
  const [isNewThemeStyleLoaded, setIsNewThemeStyleLoaded] = useAtom($isNewThemeStyleLoaded)
  const setAllThemeColors = useSetAtom($allThemeColors)
  const setAllThemeVars = useSetAtom($allThemeVars)
  const setAllStyles = useSetAtom($allStyles)
  const setSavedStylesAndVars = useSetAtom($savedStylesAndVars)

  useSWROnce(['bitforms_form_helpers_state', formID], { formID }, {
    fetchCondition: !isNewThemeStyleLoaded,
    onSuccess: data => {
      const fetchedBuilderHelperStates = data?.[0]?.builder_helper_state || {}
      if (!isObjectEmpty(fetchedBuilderHelperStates)) {
        const { themeVars, themeColors, style: oldAllStyles } = fetchedBuilderHelperStates
        setAllThemeColors(JCOF.parse(themeColors))
        setAllThemeVars(JCOF.parse(themeVars))
        setAllStyles(JCOF.parse(oldAllStyles))

        setSavedStylesAndVars({
          allThemeColors: themeColors,
          allThemeVars: themeVars,
          allStyles: oldAllStyles,
        })
        setIsNewThemeStyleLoaded(true)
      }
    },
  })

  return (
    <div className="btcd-f-settings">
      <aside className="btcd-f-sidebar">
        <Scrollbars autoHide style={{ overflowX: 'hidden' }}>
          <br />
          <br />
          <NavLink
            to={`/form/settings/${formType}/${formID}/form-settings`}
            className={({ isActive }) => ((isActive ? 'btcd-f-a' : ''))}
          >
            <span className="mr-1"><Settings2 size={21} /></span>
            {__('Form Settings')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/confirmations`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span><InfoIcn size="20" stroke="3" /></span>
            {__('Confirmations')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/workflow`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span><ConditionalIcn size="20" /></span>
            {__('Conditional Logics')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/email-templates`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1"><MailOpenIcn size="21" /></span>
            {__('Email Templates')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/integrations`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1"><CodeSnippetIcn size="19" /></span>
            {__('Integrations')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/form-abandonment`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1"><FormDraftIcn size="20" /></span>
            {__('Form Abandonment')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/data-views`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1"><TableIcon size="20" /></span>
            {__('Data Views & Edit')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/conversational-form-settings`}
            className={({ isActive }) => ((isActive ? 'btcd-f-a' : ''))}
          >
            <span className="mr-1"><ConversationIcn size={21} /></span>
            {__('Conversational Form')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/standalone-form`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1"><PageLinkIcn size="20" /></span>
            {__('Landing Form')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/pdf-templates`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1">
              <PdfIcn size="19" />
            </span>
            {__('PDF Templates')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/double-optin`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1"><EmailInbox size="21" /></span>
            {__('Double Opt-In')}
          </NavLink>
          <NavLink
            to={`/form/settings/${formType}/${formID}/auth-settings`}
            className={({ isActive }) => (isActive ? 'btcd-f-a' : '')}
          >
            <span className="mr-1"><UserIcn size="18" /></span>
            {__('WP Auth')}
          </NavLink>
        </Scrollbars>
      </aside>
      <div id="btcd-settings-wrp" className="btcd-s-wrp">
        <Suspense fallback={<FSettingsLoader />}>
          <ErrorBoundary>
            <Routes>
              <Route path="form-settings" element={<SingleFormSettings />} />
              <Route path="conversational-form-settings" element={<ConversationalFormSettings />} />
              <Route path="auth-settings" element={<WpAuth />} />
              <Route path="confirmations/*" element={<ConfType formType={formType} />} />
              <Route path="email-templates/*" element={<EmailTemplate />} />
              <Route path="pdf-templates/*" element={<PdfTemplate />} />
              <Route path="double-optin" element={<DoubleOptin />} />
              <Route path="workflow" element={<Workflow />} />
              <Route path="integrations/*" element={<Integrations />} />
              <Route path="data-views/*" element={<DataViewsRoute />} />
              <Route path="form-abandonment" element={<FormAbandonment />} />
              <Route path="standalone-form" element={<StandaloneForm />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        {/* <Routes>
          <>
            <Suspense fallback={<IntegLoader />}>
              <Route path={`${path}integrations`} element={<Integrations setProModal={setProModal} />} />
            </Suspense>
          </>
        </Routes> */}
        <ProModal />
        <div className="mb-50" />
      </div>
    </div>
  )
}

export default memo(FormSettings)
