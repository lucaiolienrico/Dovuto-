import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Home, Car, Heart, Users, Globe, Repeat, Wallet,
  Bell, Search, Plus, ChevronLeft, ChevronRight,
  AlertTriangle, Clock, DollarSign, FileText, RefreshCw,
  BarChart2, Menu, Activity, Sparkles, Filter,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye,
  TrendingUp, CreditCard, Mail, Key, Server, Plane,
  Building2, Shield, Dog, GraduationCap, Music, PieChart, Check
} from 'lucide-react'
import {
  CATEGORIES, DEADLINES, MONTHLY_DATA, STATUS_CONFIG, CAT_COLORS,
  formatCurrency, formatDate, getDaysLeft
} from '../data/mockData'
import PricingModal from '../components/PricingModal'

const ICON_MAP = { Home, Car, Heart, Users, Globe, Repeat, Wallet, TrendingUp, FileText, Mail, Key, Server, Plane, Building2, Shield, Dog, GraduationCap, Music }

function MiniSparkline({ data, color = '#6366f1' }) {
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const w = 80, h = 32
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let offset = 0
  const r = 36, cx = 44, cy = 44, circ = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-4">
      <svg width="88" height="88" className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        {data.map((d, i) => {
          const dash = (d.value / total) * circ
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={d.color} strokeWidth="10"
              strokeDasharray={`${dash} ${circ}`}
              strokeDashoffset={-offset}
            />
          )
          offset += dash
          return el
        })}
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-slate-600 leading-none">{d.label}</span>
            <span className="text-xs font-semibold text-slate-800 ml-auto pl-3">€{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniCalendar({ deadlines }) {
  const [curr, setCurr] = useState(new Date(2024, 5, 1))
  const year = curr.getFullYear(), month = curr.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const adjusted = (firstDay + 6) % 7
  const monthName = curr.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
  const deadlineDays = deadlines.reduce((acc, d) => {
    const dd = new Date(d.date)
    if (dd.getFullYear() === year && dd.getMonth() === month) {
      const day = dd.getDate()
      if (!acc[day]) acc[day] = []
      acc[day].push(d.status)
    }
    return acc
  }, {})
  const cells = []
  for (let i = 0; i < adjusted; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  const today = 16
  const dotColor = (statuses) => {
    if (statuses.includes('critico'))     return 'bg-rose-500'
    if (statuses.includes('scade_oggi'))  return 'bg-amber-400'
    if (statuses.includes('in_scadenza')) return 'bg-orange-400'
    return 'bg-indigo-400'
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurr(new Date(year, month - 1, 1))} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <ChevronLeft size={14} className="text-slate-500" />
        </button>
        <span className="text-xs font-semibold text-slate-700 capitalize">{monthName}</span>
        <button onClick={() => setCurr(new Date(year, month + 1, 1))} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <ChevronRight size={14} className="text-slate-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['L','M','M','G','V','S','D'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => (
          <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-[11px] transition-all relative
            ${day === today ? 'bg-indigo-600 text-white font-bold' : day ? 'hover:bg-slate-100 cursor-pointer text-slate-700' : ''}
          `}>
            {day && <span className="leading-none">{day}</span>}
            {day && deadlineDays[day] && (
              <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${day === today ? 'bg-white' : dotColor(deadlineDays[day])}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeCategory, setActiveCategory]     = useState('all')
  const [mobileNav, setMobileNav]               = useState('dashboard')
  const [notifOpen, setNotifOpen]               = useState(false)
  const [showPricing, setShowPricing]           = useState(false)

  const criticalItems = useMemo(() =>
    DEADLINES.filter(d => ['critico','scade_oggi','in_scadenza'].includes(d.status))
      .sort((a, b) => a.priority - b.priority).slice(0, 5), [])

  const filteredDeadlines = useMemo(() =>
    activeCategory === 'all' ? DEADLINES : DEADLINES.filter(d => d.category === activeCategory),
  [activeCategory])

  const totalMonth  = MONTHLY_DATA[5].amount
  const totalYear   = MONTHLY_DATA.reduce((s, m) => s + m.amount, 0)
  const next7       = DEADLINES.filter(d => getDaysLeft(d.date) <= 7  && getDaysLeft(d.date) >= 0).length
  const next30      = DEADLINES.filter(d => getDaysLeft(d.date) <= 30 && getDaysLeft(d.date) >= 0).length
  const autoRenewals = DEADLINES.filter(d => ['digitale','abbonamenti'].includes(d.category)).length

  const donutData = [
    { label: 'Tasse & Tributi', value: 707,  color: '#6366f1' },
    { label: 'Assicurazioni',   value: 2230, color: '#10b981' },
    { label: 'Digitale',        value: 190,  color: '#0ea5e9' },
    { label: 'Famiglia',        value: 1436, color: '#a855f7' },
    { label: 'Animali',         value: 120,  color: '#f97316' },
  ]

  const kpis = [
    { label: 'Scadenze 7gg',   value: next7,                               icon: AlertTriangle, trend: +2,  color: 'rose',   spark: [1,2,1,3,2,next7]  },
    { label: 'Scadenze 30gg',  value: next30,                              icon: Clock,         trend: -1,  color: 'amber',  spark: [4,6,5,8,7,next30] },
    { label: 'Uscite Giugno',  value: `€${totalMonth.toLocaleString('it-IT')}`, icon: DollarSign,    trend: +18, color: 'indigo', spark: [420,180,650,290,510,2837] },
    { label: 'Totale Annuale', value: `€${totalYear.toLocaleString('it-IT')}`,  icon: BarChart2,     trend: +7,  color: 'emerald',spark: [420,830,1480,1770,2280,5117] },
    { label: 'Doc. Scadenza',  value: 4,                                   icon: FileText,      trend: 0,   color: 'purple', spark: [2,3,4,3,5,4]      },
    { label: 'Rinnovi Auto',   value: autoRenewals,                        icon: RefreshCw,     trend: +1,  color: 'sky',    spark: [5,6,7,7,8,autoRenewals] },
  ]

  const sparkColors  = { rose:'#f43f5e', amber:'#f59e0b', indigo:'#6366f1', emerald:'#10b981', purple:'#a855f7', sky:'#0ea5e9' }
  const kpiBg        = { rose:'bg-rose-50', amber:'bg-amber-50', indigo:'bg-indigo-50', emerald:'bg-emerald-50', purple:'bg-purple-50', sky:'bg-sky-50' }
  const kpiIconColor = { rose:'text-rose-600', amber:'text-amber-600', indigo:'text-indigo-600', emerald:'text-emerald-600', purple:'text-purple-600', sky:'text-sky-600' }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* SIDEBAR */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-slate-100 transition-all duration-300 flex-shrink-0 shadow-sm ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="text-sm font-bold text-slate-800">Dovuto</div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">LE TUE SCADENZE</div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
              ${activeCategory === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Activity size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <><span className="text-sm font-medium flex-1">Dashboard</span><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${activeCategory === 'all' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{DEADLINES.length}</span></>}
          </button>

          {!sidebarCollapsed && <div className="text-[10px] font-semibold text-slate-400 tracking-widest px-3 pt-3 pb-1">CATEGORIE</div>}

          {CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.icon] || Activity
            const cc   = CAT_COLORS[cat.color]
            const active = activeCategory === cat.id
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group
                  ${active ? `${cc.light} ${cc.text}` : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${active ? cc.bg : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                  <Icon size={14} className={active ? cc.text : 'text-slate-500'} />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1 leading-tight">{cat.label}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${active ? `${cc.bg} ${cc.text}` : 'bg-slate-100 text-slate-500'}`}>{cat.count}</span>
                  </>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1">
          <button
            onClick={() => setShowPricing(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all text-sm font-medium"
          >
            <Sparkles size={15} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-xs">Upgrade Piano</span>}
          </button>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-all text-sm"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Comprimi</span></>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="bg-white border-b border-slate-100 px-4 md:px-6 py-3.5 flex items-center gap-3 flex-shrink-0 shadow-sm">
          <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Menu size={18} className="text-slate-600" />
          </button>
          <div className="flex-1 max-w-sm relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Cerca scadenze, documenti..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-xs font-medium">
              <Filter size={12} /> Filtra
            </button>
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors relative">
                <Bell size={18} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">Notifiche</span>
                    <span className="text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">3 nuove</span>
                  </div>
                  {criticalItems.slice(0, 3).map(item => {
                    const sc   = STATUS_CONFIG[item.status]
                    const Icon = FileText
                    return (
                      <div key={item.id} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${sc.bg}`}>
                            <Icon size={14} className={sc.text} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500">{getDaysLeft(item.date) <= 0 ? 'Scaduto' : `Tra ${getDaysLeft(item.date)} giorni`}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${sc.badge}`}>{sc.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowPricing(true)}
              className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm shadow-indigo-200 active:scale-95"
            >
              <Plus size={15} /> Nuova
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer">
              E
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900">Buon pomeriggio, Enrico</h1>
              <p className="text-sm text-slate-500 mt-0.5">Domenica 16 Giugno 2024 — <span className="text-rose-600 font-medium">{next7} scadenze</span> entro 7 giorni</p>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
              {kpis.map((kpi, i) => {
                const Icon = kpi.icon
                return (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl ${kpiBg[kpi.color]} flex items-center justify-center`}>
                        <Icon size={15} className={kpiIconColor[kpi.color]} />
                      </div>
                      {kpi.trend !== 0 && (
                        <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${kpi.trend > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {kpi.trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {Math.abs(kpi.trend)}%
                        </div>
                      )}
                    </div>
                    <div className="text-xl font-bold text-slate-900 leading-none mb-1">{kpi.value}</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight">{kpi.label}</div>
                    <div className="mt-2">
                      <MiniSparkline data={kpi.spark} color={sparkColors[kpi.color]} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="xl:col-span-2 space-y-5">

                {/* PRIORITÀ */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                      <h2 className="text-sm font-bold text-slate-800">Priorità del Giorno</h2>
                      <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{criticalItems.length}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {criticalItems.map((item, idx) => {
                      const sc   = STATUS_CONFIG[item.status]
                      const cat  = CATEGORIES.find(c => c.id === item.category)
                      const cc   = cat ? CAT_COLORS[cat.color] : CAT_COLORS.indigo
                      const days = getDaysLeft(item.date)
                      return (
                        <div key={item.id} className={`px-5 py-3.5 hover:bg-slate-50/70 transition-all cursor-pointer ${idx === 0 ? 'bg-rose-50/40' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <span className="text-[10px] font-bold text-slate-500">#{idx + 1}</span>
                            </div>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cc.bg}`}>
                              <FileText size={16} className={cc.text} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                                {idx === 0 && <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">URGENTE</span>}
                              </div>
                              <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-800">{formatDate(item.date)}</p>
                                <p className={`text-[10px] font-semibold ${days <= 2 ? 'text-rose-600' : days <= 7 ? 'text-amber-600' : 'text-slate-400'}`}>
                                  {days <= 0 ? 'Scaduto' : days === 1 ? 'Domani' : `${days}gg`}
                                </p>
                              </div>
                              {item.amount > 0 && <p className="text-sm font-bold text-slate-900 hidden sm:block">{formatCurrency(item.amount)}</p>}
                              <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${sc.badge}`}>{sc.label}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* TIMELINE */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800">Timeline Scadenze</h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {filteredDeadlines.slice(0, 10).map(item => {
                      const sc   = STATUS_CONFIG[item.status]
                      const cat  = CATEGORIES.find(c => c.id === item.category)
                      const cc   = cat ? CAT_COLORS[cat.color] : CAT_COLORS.indigo
                      const days = getDaysLeft(item.date)
                      return (
                        <div key={item.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cc.bg}`}>
                                <FileText size={17} className={cc.text} />
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${sc.dot}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                              <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <div className="text-right hidden md:block">
                                <p className="text-xs font-bold text-slate-700">{formatDate(item.date)}</p>
                                <p className={`text-[10px] font-medium ${days <= 3 ? 'text-rose-500' : days <= 14 ? 'text-amber-500' : 'text-slate-400'}`}>
                                  {days <= 0 ? 'Scaduto' : days === 1 ? 'Domani' : `fra ${days}gg`}
                                </p>
                              </div>
                              {item.amount > 0 && <p className="text-sm font-bold text-slate-900 w-20 text-right hidden sm:block">{formatCurrency(item.amount)}</p>}
                              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${sc.badge} ${sc.border}`}>{sc.label}</span>
                              <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 transition-all">
                                <MoreHorizontal size={14} className="text-slate-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* BAR CHART */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">Andamento Spese</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Anno fiscale 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">€{totalYear.toLocaleString('it-IT')}</p>
                      <div className="flex items-center gap-1 text-[11px] text-rose-500 font-medium justify-end">
                        <ArrowUpRight size={11} /> 7% vs 2023
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-end gap-2 h-24">
                      {MONTHLY_DATA.map((d, i) => {
                        const max = Math.max(...MONTHLY_DATA.map(m => m.amount))
                        const h   = Math.max((d.amount / max) * 80, 4)
                        const isActive = i === 5
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                            <div
                              className={`w-full rounded-t-md transition-all duration-300 ${isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-slate-200 group-hover:bg-indigo-300'}`}
                              style={{ height: `${h}px` }}
                            />
                            <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{d.month}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-800">Calendario</h2>
                  </div>
                  <MiniCalendar deadlines={DEADLINES} />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">Distribuzione</h2>
                      <p className="text-xs text-slate-500">Spese per categoria</p>
                    </div>
                    <PieChart size={15} className="text-slate-400" />
                  </div>
                  <DonutChart data={donutData} />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-800">Centro Notifiche</h2>
                      <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
                    </div>
                    <Eye size={14} className="text-slate-400 cursor-pointer" />
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { title: 'Alert Fiscale',    msg: 'Modello 730 scaduto',           color: 'rose'   },
                      { title: 'Rinnovo Auto',     msg: 'Assicurazione Panda — urgente', color: 'amber'  },
                      { title: 'Documento',        msg: 'Passaporto Sergio — 32gg',       color: 'indigo' },
                      { title: 'Abbonamento',      msg: 'PEC aziendale — 22 Giu',         color: 'sky'    },
                    ].map((n, i) => {
                      const colors = { rose:'bg-rose-50 text-rose-600', amber:'bg-amber-50 text-amber-600', indigo:'bg-indigo-50 text-indigo-600', sky:'bg-sky-50 text-sky-600' }
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[n.color]}`}>
                            <Bell size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{n.msg}</p>
                          </div>
                          {i < 2 && <div className="w-2 h-2 bg-rose-500 rounded-full mt-1 flex-shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold">Rinnovi Automatici</h2>
                      <p className="text-xs text-indigo-200 mt-0.5">Monitorati dal sistema</p>
                    </div>
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <RefreshCw size={16} className="text-white" />
                    </div>
                  </div>
                  {[
                    { name: 'PEC Aziendale', date: '22 Giu', amount: '€45',  status: 'critico' },
                    { name: 'Dominio Web',   date: '15 Lug', amount: '€25',  status: 'ok'      },
                    { name: 'Hosting VPS',   date: '15 Lug', amount: '€120', status: 'ok'      },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5 mb-2 last:mb-0">
                      <div>
                        <p className="text-xs font-semibold text-white">{r.name}</p>
                        <p className="text-[10px] text-indigo-200">{r.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{r.amount}</span>
                        <div className={`w-2 h-2 rounded-full ${r.status === 'critico' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
                    <p className="text-xs text-indigo-200">Totale annuale</p>
                    <p className="text-sm font-bold text-white">€190</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* MOBILE NAV */}
        <nav className="md:hidden bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-around shadow-lg flex-shrink-0">
          {[
            { id: 'dashboard',  icon: Activity,  label: 'Dashboard'  },
            { id: 'scadenze',   icon: Clock,     label: 'Scadenze'   },
            { id: 'calendario', icon: Check,     label: 'Calendario' },
            { id: 'notifiche',  icon: Bell,      label: 'Notifiche'  },
          ].map(item => {
            const Icon   = item.icon
            const active = mobileNav === item.id
            return (
              <button key={item.id} onClick={() => setMobileNav(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${active ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && <div className="w-1 h-1 bg-indigo-600 rounded-full" />}
              </button>
            )
          })}
          <button onClick={() => {}} className="flex flex-col items-center gap-1 px-3 py-1.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Plus size={18} className="text-white" />
            </div>
          </button>
        </nav>
      </div>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  )
}
