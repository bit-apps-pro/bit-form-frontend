import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import ViewAndEditAccess from './ViewAndEditAccess'

const TableBuilder = lazy(() => import('./TableBuilder'))

export default function DataViewsRoute() {
  return (
    <Routes>
      <Route index element={<ViewAndEditAccess />} />
      <Route path="/:viewId" element={<TableBuilder />} />
    </Routes>
  )
}
