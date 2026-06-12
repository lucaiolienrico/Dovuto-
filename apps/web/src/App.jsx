import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import AdminGuard from './pages/admin/AdminGuard'

import Dashboard    from './pages/Dashboard'
import Landing      from './pages/Landing'
import Pricing      from './pages/Pricing'
import Success      from './pages/Success'

import AdminLogin    from './pages/admin/AdminLogin'
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers    from './pages/admin/AdminUsers'
import AdminDeadlines from './pages/admin/AdminDeadlines'
import { AdminRevenue, AdminLogs, AdminSettings } from './pages/admin/AdminExtra'

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<Landing />}   />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing"   element={<Pricing />}   />
          <Route path="/success"   element={<Success />}   />

          {/* Admin public */}
          <Route path="/admin"     element={<AdminLogin />} />

          {/* Admin protected */}
          <Route path="/admin/dashboard" element={<AdminGuard><AdminOverview /></AdminGuard>} />
          <Route path="/admin/users"     element={<AdminGuard><AdminUsers /></AdminGuard>}    />
          <Route path="/admin/deadlines" element={<AdminGuard><AdminDeadlines /></AdminGuard>} />
          <Route path="/admin/revenue"   element={<AdminGuard><AdminRevenue /></AdminGuard>}  />
          <Route path="/admin/logs"      element={<AdminGuard><AdminLogs /></AdminGuard>}     />
          <Route path="/admin/settings"  element={<AdminGuard><AdminSettings /></AdminGuard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
    </AuthProvider>
  )
}
