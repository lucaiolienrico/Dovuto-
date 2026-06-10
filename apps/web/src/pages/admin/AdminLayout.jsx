import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, Users, FileText, CreditCard,
  Activity, Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, Shield, Menu, X
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview'        },
  { path: '/admin/users',     icon: Users,           label: 'Utenti'          },
  { path: '/admin/deadlines', icon: FileText,        label: 'Scadenze'        },
  { path: '/admin/revenue',   icon: CreditCard,      label: 'Revenue'         },
  { path: '/admin/logs',      icon: Activity,        label: 'Attività'        },
  { path: '/admin/settings',  icon: Settings,        label: 'Impostazioni'    },
]

export default function AdminLayout({ children }) {
  const { admin, logout }     = useAdminAuth()
  const location              = useLocation()
  const navigate              = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-slate-900 border-r border-slate-800 ${mobile ? 'w-64' : (collapsed ? 'w-16' : 'w-60')} transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles size={15} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <div className="text-white font-bold text-sm leading-tight">Dovuto</div>
            <div className="text-slate-500 text-[10px] font-medium tracking-widest">ADMIN</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {(!collapsed || mobile) && (
          <div className="text-[10px] font-semibold text-slate-600 tracking-widest px-3 pt-2 pb-1">NAVIGAZIONE</div>
        )}
        {NAV_ITEMS.map(item => {
          const Icon    = item.icon
          const active  = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                ${active
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }
                ${collapsed && !mobile ? 'justify-center' : ''}
              `}
            >
              <Icon size={16} className="flex-shrink-0" />
              {(!collapsed || mobile) && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={13} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin</p>
              <p className="text-[10px] text-slate-500 truncate">{admin?.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all
            ${collapsed && !mobile ? 'justify-center' : ''}
          `}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span className="text-sm font-medium">Logout</span>}
        </button>
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-400 transition-all text-xs
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Comprimi</span></>}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-3.5 flex items-center gap-3 flex-shrink-0">
          <button className="md:hidden p-2 rounded-xl hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(true)}>
            <Menu size={18} className="text-slate-400" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-slate-600">Admin</span>
            <ChevronRight size={14} className="text-slate-700" />
            <span className="text-slate-300 font-medium capitalize">
              {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'Panel'}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Live badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-xl hover:bg-slate-800 transition-colors relative">
              <Bell size={16} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>

            {/* Link to main app */}
            <Link to="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-xs font-medium">
              ← App
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  )
}
