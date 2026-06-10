import { useState, useMemo } from 'react'
import {
  Search, Filter, UserPlus, MoreHorizontal, Mail, Ban,
  CheckCircle, ChevronUp, ChevronDown, X, Save, Trash2,
  Eye, Edit2, AlertTriangle
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import { MOCK_USERS, PLAN_COLORS, STATUS_COLORS } from '../../data/adminData'

function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">Modifica utente</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <X size={15} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-400">{form.avatar}</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{form.name}</p>
              <p className="text-slate-500 text-xs">ID #{form.id} · Registrato {form.joined}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Nome</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Piano</label>
              <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors">
                <option value="free">Free</option>
                <option value="personal">Personal</option>
                <option value="famiglia">Famiglia</option>
                <option value="pro">Pro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Stato</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors">
                <option value="active">Attivo</option>
                <option value="trial">Trial</option>
                <option value="past_due">Pagamento</option>
                <option value="churned">Churned</option>
              </select>
            </div>
          </div>

          {/* Stats readonly */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { label: 'Scadenze',    value: form.deadlines },
              { label: 'MRR',         value: `€${form.mrr}` },
              { label: 'Ultimo accesso', value: form.lastSeen },
            ].map((s, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={() => onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all text-sm active:scale-95">
            <Save size={14} /> Salva modifiche
          </button>
          <button className="flex items-center gap-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 px-4 py-2.5 rounded-xl transition-all text-sm">
            <Ban size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers]       = useState(MOCK_USERS)
  const [search, setSearch]     = useState('')
  const [filterPlan, setFilterPlan]     = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy]     = useState('joined')
  const [sortDir, setSortDir]   = useState('desc')
  const [editUser, setEditUser] = useState(null)
  const [selected, setSelected] = useState([])

  const filtered = useMemo(() => {
    let list = [...users]
    if (search)           list = list.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    if (filterPlan !== 'all')   list = list.filter(u => u.plan === filterPlan)
    if (filterStatus !== 'all') list = list.filter(u => u.status === filterStatus)
    list.sort((a, b) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [users, search, filterPlan, filterStatus, sortBy, sortDir])

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const handleSave = (updated) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
    setEditUser(null)
  }

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleAll    = () => setSelected(prev => prev.length === filtered.length ? [] : filtered.map(u => u.id))

  const SortIcon = ({ col }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp   size={9} className={sortBy === col && sortDir === 'asc'  ? 'text-indigo-400' : 'text-slate-700'} />
      <ChevronDown size={9} className={sortBy === col && sortDir === 'desc' ? 'text-indigo-400' : 'text-slate-700'} />
    </span>
  )

  const totalMRR = filtered.filter(u => u.status === 'active').reduce((s, u) => s + u.mrr, 0)

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Utenti</h1>
            <p className="text-slate-500 text-sm mt-0.5">{filtered.length} utenti trovati · MRR: €{totalMRR.toFixed(2)}</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm active:scale-95">
            <UserPlus size={15} /> Invita utente
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cerca per nome o email..."
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors">
            <option value="all">Tutti i piani</option>
            <option value="free">Free</option>
            <option value="personal">Personal</option>
            <option value="famiglia">Famiglia</option>
            <option value="pro">Pro</option>
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors">
            <option value="all">Tutti gli stati</option>
            <option value="active">Attivi</option>
            <option value="trial">Trial</option>
            <option value="past_due">Pagamento</option>
            <option value="churned">Churned</option>
          </select>

          {selected.length > 0 && (
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl">
              <span className="text-xs text-indigo-400 font-medium">{selected.length} selezionati</span>
              <button className="text-xs text-rose-400 hover:text-rose-300 font-medium">Elimina</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 rounded accent-indigo-600" />
                  </th>
                  {[
                    { label: 'Utente',        col: 'name'     },
                    { label: 'Piano',         col: 'plan'     },
                    { label: 'Stato',         col: 'status'   },
                    { label: 'Scadenze',      col: 'deadlines'},
                    { label: 'MRR',           col: 'mrr'      },
                    { label: 'Registrato',    col: 'joined'   },
                    { label: 'Ultimo accesso',col: 'lastSeen' },
                    { label: '',              col: null       },
                  ].map((h, i) => (
                    <th key={i} onClick={() => h.col && handleSort(h.col)}
                      className={`px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap
                        ${h.col ? 'cursor-pointer hover:text-slate-300 transition-colors select-none' : ''}`}>
                      {h.label}{h.col && <SortIcon col={h.col} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(user => {
                  const sc  = STATUS_COLORS[user.status]
                  const pc  = PLAN_COLORS[user.plan]
                  const sel = selected.includes(user.id)
                  return (
                    <tr key={user.id}
                      className={`hover:bg-slate-800/50 transition-colors ${sel ? 'bg-indigo-500/5' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={sel} onChange={() => toggleSelect(user.id)}
                          className="w-3.5 h-3.5 rounded accent-indigo-600" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-indigo-400">{user.avatar}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${pc.bg} ${pc.text}`}>{pc.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${sc.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300 font-medium">{user.deadlines}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${user.mrr > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {user.mrr > 0 ? `€${user.mrr}` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{user.joined}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{user.lastSeen}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditUser(user)}
                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all">
                            <Edit2 size={13} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all">
                            <Mail size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Nessun utente trovato</p>
            </div>
          )}

          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-600">{filtered.length} di {users.length} utenti</p>
            <div className="flex gap-1">
              {[1, 2].map(p => (
                <button key={p} className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${p === 1 ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editUser && <UserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />}
    </AdminLayout>
  )
}
