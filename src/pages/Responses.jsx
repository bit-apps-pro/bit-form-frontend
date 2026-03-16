import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { $bits, $integrations, $newTableId } from '../GlobalStates/GlobalStates'
import ErrorBoundary from '../components/ErrorBoundary'
import FSettingsLoader from '../components/Loaders/FSettingsLoader'
import FormEntries from './FormEntries'

export default function Responses() {
  const [isLoading, setIsLoading] = useState(true)
  const [allResponse, setAllResponse] = useState([])
  // const [integrations, setIntegration] = useAtom($integrations)
  const integrations = useAtomValue($integrations)
  const setNewTableId = useSetAtom($newTableId)
  const bits = useAtomValue($bits)

  // setNewTableId(parseInt(bits.totalTables))
  return (

    <Suspense fallback={<FSettingsLoader />}>
      <ErrorBoundary>
        <Routes>
          {/* <Route path="form-settings" element={<SingleFormSettings />} /> */}
          <Route
            index
            element={(
              <FormEntries
                isLoading={isLoading}
                allResp={allResponse}
                setAllResp={setAllResponse}
                integrations={integrations}
              />
            )}
          />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  )
}
