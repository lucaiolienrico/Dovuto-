import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminGuard({ children }) {
  const { admin } = useAdminAuth()
  if (!admin) return <Navigate to="/admin" replace />
  return children
}
