import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight,
  UserPlus, AlertTriangle, CreditCard, Activity, CheckCircle,
  XCircle, Clock, ChevronRight, RefreshCw
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import {
  MOCK_USERS, MRR_DATA, ACTIVITY_LOGS, PLAN_DISTRIBUTION,
  PLAN_COLORS, STATUS_COLORS
} from '../../data/adminData'

function StatCard({ label, value, icon: Icon, trend, trendLabel, color }) {
  const colors = {
    indigo:  { bg: 'bg-indigo-500/10',  icon: 'text-indigo-400',  border: 'border-indigo-500/20'  },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   border: 'border-amber-500/20'   },
    violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20'  },
    rose:    { bg: 'bg-rose-500/10',    icon: 'text-rose-400',    border: 'border-rose-500/20'    },
  }
  const c = colors[color] || colors.indigo
  const positive = trend > 0

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={16} className={c.icon} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      {trendLabel && <div className="text-[10px] text-slate-600 mt-0.5">{trendLabel}</div>}
    </div>
  )
}

function MiniBar({ data, activeIdx = data.length - 1 }) {
  const max = Math.max(...data.map(d => d.mrr))
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => {
        const h = Math.max((d.mrr / max) * 64, 4)
        const active = i === activeIdx
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-md transition-all ${active ? 'bg-indigo-500' : 'bg-slate-700 hover:bg-slate-600'}`}
              style={{ height: `${h}px` }}
            />
            <span className={`text-[9px] font-medium ${active ? 'text-indigo-400' : 'text-slate-600'}`}>{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

function DonutMini({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  let offset  = 0
  const r = 30, cx = 36, cy = 36, circ = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-4">
      <svg width="72" height="72" className="-rotate-90 flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        {data.map((d, i) => {
          const dash = (d.count / total) * circ
          const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={-offset} />
          offset += dash
          return el
        })}
      </svg>
      <div className="space-y-1.5 flex-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-slate-400 flex-1">{d.plan}</span>
            <span className="text-xs font-bold text-white">{d.count}</span>
            <span className="text-[10px] text-slate-600">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const LOG_ICONS = {
  signup:         { icon: UserPlus,      color: 'bg-emerald-500/10 text-emerald-400' },
  upgrade:        { icon: TrendingUp,    color: 'bg-indigo-500/10 text-indigo-400'   },
  payment_failed: { icon: AlertTriangle, color: 'bg-rose-500/10 text-rose-400'       },
  deadline_add:   { icon: CheckCircle,   color: 'bg-sky-500/10 text-sky-400'         },
  churn:          { icon: XCircle,       color: 'bg-slate-500/10 text-slate-400'     },
  login:          { icon: Activity,      color: 'bg-slate-500/10 text-slate-500'     },
  export:         { icon: ArrowUpRight,  color: 'bg-violet-500/10 text-violet-400'   },
}

export default function AdminOverview() {
  const totalMRR    = MRR_DATA[MRR_DATA.length - 1].mrr
  const prevMRR     = MRR_DATA[MRR_DATA.length - 2].mrr
  const mrrGrowth   = Math.round(((totalMRR - prevMRR) / prevMRR) * 100)
  const totalUsers  = MOCK_USERS.length
  const activeUsers = MOCK_USERS.filter(u => u.status === 'active').length
  const churnRate   = Math.round((MOCK_USERS.filter(u => u.status === 'churned').length / totalUsers) * 100)
  const pastDue     = MOCK_USERS.filter(u => u.status === 'past_due').length
  const arrEstimate = totalMRR * 12

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Dashboard amministratore — Dovuto</p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard label="MRR"           value={`€${totalMRR.toLocaleString('it-IT')}`} icon={DollarSign} trend={mrrGrowth}  trendLabel="vs mese scorso" color="emerald" />
          <StatCard label="ARR Stimato"   value={`€${arrEstimate.toLocaleString('it-IT')}`} icon={TrendingUp} trend={mrrGrowth}  trendLabel="proiezione annua" color="indigo" />
          <StatCard label="Utenti Totali" value={totalUsers}   icon={Users}          trend={+9}   trendLabel="vs mese scorso" color="violet" />
          <StatCard label="Utenti Attivi" value={activeUsers}  icon={CheckCircle}    trend={+12}  trendLabel="tasso attività"  color="emerald" />
          <StatCard label="Churn Rate"    value={`${churnRate}%`} icon={RefreshCw}   trend={-2}   trendLabel="in miglioramento" color="amber" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* MRR Chart */}
          <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Crescita MRR</h2>
                <p className="text-xs text-slate-500 mt-0.5">Gennaio — Giugno 2024</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white">€{totalMRR.toLocaleString('it-IT')}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 justify-end">
                  <ArrowUpRight size={11} /> +{mrrGrowth}% MoM
                </div>
              </div>
            </div>
            <MiniBar data={MRR_DATA} />
            {/* User count labels */}
            <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-800">
              {MRR_DATA.map((d, i) => (
                <div key={i} className="flex-1 text-center">
                  <p className="text-[9px] text-slate-600">{d.users}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-1">Utenti per mese</p>
          </div>

          {/* Plan distribution */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <h2 className="text-sm font-bold text-white mb-4">Distribuzione Piani</h2>
            <DonutMini data={PLAN_DISTRIBUTION} />
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-slate-500">ARPU</p>
                <p className="text-base font-black text-white">€{(totalMRR / activeUsers).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Pagamenti fail</p>
                <p className="text-base font-black text-rose-400">{pastDue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent users */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Utenti Recenti</h2>
              <Link to="/admin/users" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                Vedi tutti <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-800">
              {MOCK_USERS.slice(0, 5).map(user => {
                const sc = STATUS_COLORS[user.status]
                const pc = PLAN_COLORS[user.plan]
                return (
                  <div key={user.id} className="px-5 py-3 hover:bg-slate-800/50 transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-indigo-400">{user.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${pc.bg} ${pc.text}`}>{pc.label}</span>
                      <div className={`flex items-center gap-1 text-[10px] font-medium ${sc.text}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Attività Recente</h2>
              <Link to="/admin/logs" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                Vedi tutto <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-800">
              {ACTIVITY_LOGS.slice(0, 6).map(log => {
                const cfg  = LOG_ICONS[log.action] || LOG_ICONS.login
                const Icon = cfg.icon
                return (
                  <div key={log.id} className="px-5 py-3 hover:bg-slate-800/50 transition-colors flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white">{log.user}</p>
                        <span className="text-[10px] text-slate-600">{log.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{log.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Alert: past due */}
        {pastDue > 0 && (
          <div className="mt-4 flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-2xl">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{pastDue} pagament{pastDue === 1 ? 'o' : 'i'} in sospeso</p>
              <p className="text-xs text-rose-500/70">Questi utenti potrebbero effettuare churn se non contattati entro 48h.</p>
            </div>
            <Link to="/admin/users" className="text-xs font-semibold hover:text-rose-300 transition-colors flex items-center gap-1 flex-shrink-0">
              Gestisci <ChevronRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
