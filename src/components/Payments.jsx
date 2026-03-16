import { useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import Payment from './Payment'
import PaymentSettings from './PaymentSettings'
import SnackMsg from './Utilities/SnackMsg'

export default function Payments() {
  const location = useLocation()
  const [snack, setSnackbar] = useState({ show: false })
  const allIntegURL = useRef(location.pathname).current
  return (
    <div className="pb-6 w-7">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ErrorBoundary>
        <Routes>
          <Route index element={<PaymentSettings setSnackbar={setSnackbar} />} />
          <Route path=":type" element={<Payment allIntegURL={allIntegURL} />} />
          <Route path=":type/:indx" element={<Payment allIntegURL={allIntegURL} />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}
