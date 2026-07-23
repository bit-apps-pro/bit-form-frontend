import loadable from '@loadable/component'
import { useAtomValue } from 'jotai'
import { Route, Routes } from 'react-router-dom'
import { $formId } from '../../GlobalStates/GlobalStates'
import FSettingsLoader from '../Loaders/FSettingsLoader'
import AllPdfTemplates from '../UIv3/PDFSettings/AllPdfTemplates'

const PdfTemplateEditor = loadable(() => import('../UIv3/PDFSettings/PdfTemplateEditor'), { fallback: <FSettingsLoader /> })
export default function PdfTemplate() {
  const formID = useAtomValue($formId)
  return (
    <Routes>
      <Route index element={<AllPdfTemplates formID={formID} />} />
      <Route path="/new" element={<PdfTemplateEditor />} />
      <Route path="/:id" element={<PdfTemplateEditor />} />
    </Routes>
  )
}
