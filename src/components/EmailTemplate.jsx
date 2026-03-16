import loadable from '@loadable/component'
import { useAtomValue } from 'jotai'
import { Route, Routes } from 'react-router-dom'
import { $formId } from '../GlobalStates/GlobalStates'
import AllEmailTemplates from './AllEmailTemplates'
import ErrorBoundary from './ErrorBoundary'
import FSettingsLoader from './Loaders/FSettingsLoader'

const EmailTemplateNew = loadable(() => import('./EmailTemplateNew'), { fallback: <FSettingsLoader /> })
const EmailTemplateEdit = loadable(() => import('./EmailTemplateEdit'), { fallback: <FSettingsLoader /> })

export default function EmailTemplate() {
  const formID = useAtomValue($formId)
  return (
    <ErrorBoundary>
      <Routes>
        <Route index element={<AllEmailTemplates formID={formID} />} />
        <Route path="/new" element={<EmailTemplateNew />} />
        <Route path="/:id" element={<EmailTemplateEdit />} />
      </Routes>
    </ErrorBoundary>
  )
}
