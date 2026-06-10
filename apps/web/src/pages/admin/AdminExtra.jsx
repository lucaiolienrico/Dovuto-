import { useState } from 'react'
import {
  TrendingUp, DollarSign, ArrowUpRight, CreditCard,
  Download, UserPlus, XCircle, CheckCircle, AlertTriangle,
  Activity, Search, Filter, Shield, Bell, Mail, Globe,
  Save, Eye, EyeOff, RefreshCw, Key
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import { MOCK_USERS, MRR_DATA, ACTIVITY_LOGS, PLAN_COLORS, STATUS_COLORS } from '../../data/adminData'

// ─── REVENUE ────────────────────────────────────────────────────────────────

export function AdminRevenue() {
  const totalMRR  = MRR_DATA[MRR_DATA.length - 1].mrr
  const prevMRR   = MRR_DATA[MRR_DATA.length - 2].mrr
  const growth    = (((totalMRR - prevMRR) / prevMRR) * 100).toFixed(1)
  const arr       = totalMRR * 12
  const payingUsers = MOCK_USERS.filter(u => u.mrr > 0 && u.status === 'active')
  const arpu      = payingUsers.length ? (totalMRR / payingUsers.length).toFixed(2) : 0

  const transactions = [
    { id: 'txn_001', user: 'Anna Bianchi',     plan: 'personal',  amount: 3.90,  date: '16 Giu', type: 'charge',  stripe: 'ch_xxx001' },
    { id: 'txn_002', user: 'Sofia Conti',       plan: 'famiglia',  amount: 49.00, date: '15 Giu', type: 'charge',  stripe: 'ch_xxx002' },
    { id: 'txn_003', user: 'Pietro Esposito',   plan: 'famiglia',  amount: 6.90,  date: '14 Giu', type: 'failed',  stripe: 'ch_xxx003' },
    { id: 'txn_004', user: 'Chiara Lombardi',   plan: 'pro',       amount: 12.90, date: '13 Giu', type: 'charge',  stripe: 'ch_xxx004' },
    { id: 'txn_005', user: 'Enrico Lucaioli',   plan: 'pro',       amount: 89.00, date: '10 Giu', type: 'charge',  stripe: 'ch_xxx005' },
    { id: 'txn_006', user: 'Giulia Trombetti',  plan: 'famiglia',  amount: 6.90,  date: '08 Giu', type: 'charge',  stripe: 'ch_xxx006' },
    { id: 'txn_007', user: 'Valentina Russo',   plan: 'personal',  amount: 3.90,  date: '07 Giu', type: 'refund',  stripe: 'ch_xxx007' },
    { id: 'txn_008', user: 'Marco Rossi',       plan: 'personal',  amount: 3.90,  date: '05 Giu', type: 'charge',  stripe: 'ch_xxx008' },
  ]

  const max = Math.max(...MRR_DATA.map(d => d.mrr))

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Revenue</h1>
            <p className="text-slate-500 text-sm mt-0.5">Metriche finanziarie e transazioni</p>
          </div>
          <button className="flex items-center gap-2 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 px-4 py-2.5 rounded-xl transition-all text-sm font-medium">
            <Download size={15} /> Esporta CSV
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'MRR',         value: `€${totalMRR.toLocaleString('it-IT')}`, sub: `+${growth}% MoM`,    color: 'emerald', icon: DollarSign  },
            { label: 'ARR',         value: `€${arr.toLocaleString('it-IT')}`,      sub: 'Proiezione annua',    color: 'indigo',  icon: TrendingUp  },
            { label: 'ARPU',        value: `€${arpu}`,                             sub: 'Per utente pagante',  color: 'violet',  icon: CreditCard  },
            { label: 'Utenti pag.', value: payingUsers.length,                     sub: 'Piano attivo',        color: 'amber',   icon: CheckCircle },
          ].map((k, i) => {
            const Icon = k.icon
            const bgs = { emerald:'bg-emerald-500/10', indigo:'bg-indigo-500/10', violet:'bg-violet-500/10', amber:'bg-amber-500/10' }
            const txts = { emerald:'text-emerald-400', indigo:'text-indigo-400', violet:'text-violet-400', amber:'text-amber-400' }
            return (
              <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                <div className={`w-9 h-9 rounded-xl ${bgs[k.color]} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={txts[k.color]} />
                </div>
                <p className="text-2xl font-black text-white">{k.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{k.sub}</p>
              </div>
            )
          })}
        </div>

        {/* MRR Chart */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Andamento MRR</h2>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <ArrowUpRight size={13} /> +{growth}%
            </div>
          </div>
          <div className="flex items-end gap-2 h-28">
            {MRR_DATA.map((d, i) => {
              const h = Math.max((d.mrr / max) * 96, 4)
              const active = i === MRR_DATA.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="text-[9px] text-slate-600 group-hover:text-slate-400 transition-colors">€{d.mrr}</div>
                  <div className={`w-full rounded-t-md transition-all ${active ? 'bg-emerald-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}
                    style={{ height: `${h}px` }} />
                  <span className={`text-[9px] font-medium ${active ? 'text-emerald-400' : 'text-slate-600'}`}>{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white">Transazioni Recenti</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {transactions.map((tx, i) => {
              const pc = PLAN_COLORS[tx.plan]
              const typeConfig = {
                charge: { label: 'Pagamento', color: 'text-emerald-400', bg: 'bg-emerald-500/10', sign: '+' },
                failed: { label: 'Fallito',   color: 'text-rose-400',    bg: 'bg-rose-500/10',    sign: ''  },
                refund: { label: 'Rimborso',  color: 'text-amber-400',   bg: 'bg-amber-500/10',   sign: '-' },
              }
              const tc = typeConfig[tx.type]
              return (
                <div key={i} className="px-5 py-3.5 hover:bg-slate-800/50 transition-colors flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0`}>
                    <CreditCard size={14} className={tc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{tx.user}</p>
                    <p className="text-xs text-slate-500 font-mono">{tx.stripe}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${pc.bg} ${pc.text}`}>{pc.label}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${tc.bg} ${tc.color}`}>{tc.label}</span>
                  <span className="text-xs text-slate-500 hidden sm:block">{tx.date}</span>
                  <span className={`text-sm font-bold ${tc.color} text-right w-16`}>{tc.sign}€{tx.amount.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

// ─── ACTIVITY LOGS ──────────────────────────────────────────────────────────

const LOG_ICONS = {
  signup:         { icon: UserPlus,      color: 'bg-emerald-500/10 text-emerald-400', label: 'Signup'    },
  upgrade:        { icon: TrendingUp,    color: 'bg-indigo-500/10 text-indigo-400',   label: 'Upgrade'   },
  payment_failed: { icon: AlertTriangle, color: 'bg-rose-500/10 text-rose-400',       label: 'Errore'    },
  deadline_add:   { icon: CheckCircle,   color: 'bg-sky-500/10 text-sky-400',         label: 'Scadenza'  },
  churn:          { icon: XCircle,       color: 'bg-slate-500/10 text-slate-400',     label: 'Churn'     },
  login:          { icon: Activity,      color: 'bg-slate-500/10 text-slate-500',     label: 'Login'     },
  export:         { icon: Download,      color: 'bg-violet-500/10 text-violet-400',   label: 'Export'    },
}

const EXTENDED_LOGS = [
  ...ACTIVITY_LOGS,
  { id: 9,  user: 'Luca Ferrari',     action: 'login',          detail: 'Accesso da Torino, IT',              time: '3 giorni fa', type: 'info'    },
  { id: 10, user: 'Enrico Lucaioli',  action: 'deadline_add',   detail: 'Aggiunta scadenza: Rinnovo Hosting', time: '3 giorni fa', type: 'info'    },
  { id: 11, user: 'Marco Rossi',      action: 'upgrade',        detail: 'Free → Personal (annuale)',          time: '4 giorni fa', type: 'revenue' },
  { id: 12, user: 'Chiara Lombardi',  action: 'export',         detail: 'Export CSV anno fiscale 2023',       time: '5 giorni fa', type: 'info'    },
]

export function AdminLogs() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filtered = EXTENDED_LOGS.filter(log => {
    const matchSearch = !search || log.user.toLowerCase().includes(search.toLowerCase()) || log.detail.toLowerCase().includes(search.toLowerCase())
    const matchType   = filterType === 'all' || log.action === filterType
    return matchSearch && matchType
  })

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Log Attività</h1>
          <p className="text-slate-500 text-sm mt-0.5">Tutti gli eventi registrati dalla piattaforma</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca utente o evento..."
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors">
            <option value="all">Tutti gli eventi</option>
            {Object.entries(LOG_ICONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {filtered.map(log => {
              const cfg  = LOG_ICONS[log.action] || LOG_ICONS.login
              const Icon = cfg.icon
              return (
                <div key={log.id} className="px-5 py-4 hover:bg-slate-800/50 transition-colors flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-white">{log.user}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cfg.color.replace('text-', 'bg-').replace('/10', '/5')} ${cfg.color.split(' ')[1]}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-600">{log.time}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">{log.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Activity size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Nessun log trovato</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

// ─── SETTINGS ───────────────────────────────────────────────────────────────

export function AdminSettings() {
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved]     = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    {
      title: 'Generale',
      icon: Globe,
      fields: [
        { label: 'Nome piattaforma',    type: 'text',  value: 'Dovuto',             placeholder: '' },
        { label: 'URL produzione',      type: 'text',  value: 'https://dovuto.it',   placeholder: '' },
        { label: 'Email supporto',      type: 'email', value: 'support@dovuto.it',   placeholder: '' },
        { label: 'Lingua default',      type: 'select',value: 'it',                      options: ['it','en'] },
      ]
    },
    {
      title: 'Email & Notifiche',
      icon: Mail,
      fields: [
        { label: 'Provider email',      type: 'select', value: 'resend', options: ['resend','sendgrid','postmark'] },
        { label: 'From address',        type: 'email',  value: 'noreply@dovuto.it', placeholder: '' },
        { label: 'Giorni alert anticipo', type: 'text', value: '30, 7, 1',              placeholder: '' },
        { label: 'Notifiche admin',     type: 'toggle', value: true },
      ]
    },
    {
      title: 'Sicurezza',
      icon: Shield,
      fields: [
        { label: 'Stripe Secret Key',   type: 'secret', value: 'sk_live_••••••••••••••••' },
        { label: 'Webhook Secret',      type: 'secret', value: 'whsec_••••••••••••••••'   },
        { label: 'Resend API Key',      type: 'secret', value: 're_••••••••••••••••'       },
        { label: '2FA Obbligatoria',    type: 'toggle', value: false },
      ]
    },
  ]

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Impostazioni</h1>
            <p className="text-slate-500 text-sm mt-0.5">Configurazione piattaforma</p>
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm active:scale-95
              ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
            {saved ? <><CheckCircle size={15} /> Salvato!</> : <><Save size={15} /> Salva tutto</>}
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, si) => {
            const SIcon = section.icon
            return (
              <div key={si} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <SIcon size={15} className="text-indigo-400" />
                  </div>
                  <h2 className="text-sm font-bold text-white">{section.title}</h2>
                </div>
                <div className="p-5 space-y-4">
                  {section.fields.map((field, fi) => (
                    <div key={fi} className="flex items-center gap-4">
                      <label className="w-40 flex-shrink-0 text-xs font-semibold text-slate-400 uppercase tracking-wide">{field.label}</label>
                      {field.type === 'toggle' ? (
                        <button className={`relative w-10 h-5 rounded-full transition-all ${field.value ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${field.value ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      ) : field.type === 'select' ? (
                        <select defaultValue={field.value}
                          className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors capitalize">
                          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : field.type === 'secret' ? (
                        <div className="flex-1 relative">
                          <input type={showKey ? 'text' : 'password'} defaultValue={field.value}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl pl-3 pr-10 py-2 focus:outline-none focus:border-indigo-500 transition-colors font-mono" />
                          <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                            {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      ) : (
                        <input type={field.type} defaultValue={field.value}
                          className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Danger zone */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} /> Zona pericolosa
            </h2>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 px-4 py-2 rounded-xl transition-all text-xs font-medium">
                <RefreshCw size={13} /> Reset dati demo
              </button>
              <button className="flex items-center gap-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 px-4 py-2 rounded-xl transition-all text-xs font-medium">
                <Key size={13} /> Rigenera API keys
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
