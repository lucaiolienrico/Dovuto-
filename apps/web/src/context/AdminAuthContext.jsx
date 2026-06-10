import { createContext, useContext, useState } from 'react'
import { ADMIN_CREDENTIALS } from '../data/adminData'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('admin_session')) }
    catch { return null }
  })

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = { email, name: 'Admin', loginAt: Date.now() }
      sessionStorage.setItem('admin_session', JSON.stringify(session))
      setAdmin(session)
      return { ok: true }
    }
    return { ok: false, error: 'Credenziali non valide' }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_session')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)
