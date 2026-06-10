import { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, X, Save, ChevronUp, ChevronDown, Filter } from 'lucide-react'
import AdminLayout from './AdminLayout'
import { DEADLINES, CATEGORIES, STATUS_CONFIG, CAT_COLORS, formatCurrency, formatDate, getDaysLeft } from '../../data/mockData'

const EMPTY_DEADLINE = {
  id: null, title: '', subtitle: '', category: 'finanza',
  date: '', amount: 0, status: 'programmato', priority: 3
}

function DeadlineModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({ ...item })
  const isNew = !item.id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">{isNew ? 'Nuova scadenza' : 'Modifica scadenza'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <X size={15} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Titolo</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="es. Bollo auto Fiat 500"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Descrizione</label>
            <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})}
              placeholder="Dettagli aggiuntivi..."
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Categoria</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Data scadenza</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Importo (€)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: +e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Stato</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Priorità</label>
              <select value={form.priority} onChange={e => setForm({...form, priority: +e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors">
                {[1,2,3,4,5].map(p => <option key={p} value={p}>{p} — {['Critica','Alta','Media','Bassa','Minima'][p-1]}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={() => onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all text-sm active:scale-95">
            <Save size={14} /> {isNew ? 'Crea scadenza' : 'Salva modifiche'}
          </button>
          {!isNew && (
            <button className="flex items-center gap-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 px-4 py-2.5 rounded-xl transition-all text-sm">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminDeadlines() {
  const [items, setItems]         = useState(DEADLINES)
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy]       = useState('date')
  const [sortDir, setSortDir]     = useState('asc')
  const [editItem, setEditItem]   = useState(null)
  const [showNew, setShowNew]     = useState(false)

  const filtered = useMemo(() => {
    let list = [...items]
    if (search)             list = list.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
    if (filterCat !== 'all')    list = list.filter(d => d.category === filterCat)
    if (filterStatus !== 'all') list = list.filter(d => d.status === filterStatus)
    list.sort((a, b) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [items, search, filterCat, filterStatus, sortBy, sortDir])

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const handleSave = (updated) => {
    if (!updated.id) {
      setItems(prev => [...prev, { ...updated, id: Date.now() }])
    } else {
      setItems(prev => prev.map(d => d.id === updated.id ? updated : d))
    }
    setEditItem(null)
    setShowNew(false)
  }

  const handleDelete = (id) => setItems(prev => prev.filter(d => d.id !== id))

  const SortIcon = ({ col }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp   size={9} className={sortBy === col && sortDir === 'asc'  ? 'text-indigo-400' : 'text-slate-700'} />
      <ChevronDown size={9} className={sortBy === col && sortDir === 'desc' ? 'text-indigo-400' : 'text-slate-700'} />
    </span>
  )

  const totalAmount = filtered.reduce((s, d) => s + d.amount, 0)

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Scadenze</h1>
            <p className="text-slate-500 text-sm mt-0.5">{filtered.length} scadenze · Totale importi: {formatCurrency(totalAmount)}</p>
          </div>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm active:scale-95">
            <Plus size={15} /> Nuova scadenza
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cerca scadenze..."
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors">
            <option value="all">Tutte le categorie</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors">
            <option value="all">Tutti gli stati</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {[
                    { label: 'Scadenza',   col: 'title'    },
                    { label: 'Categoria',  col: 'category' },
                    { label: 'Data',       col: 'date'     },
                    { label: 'Importo',    col: 'amount'   },
                    { label: 'Stato',      col: 'status'   },
                    { label: 'Priorità',   col: 'priority' },
                    { label: '',           col: null       },
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
                {filtered.map(item => {
                  const sc    = STATUS_CONFIG[item.status]
                  const cat   = CATEGORIES.find(c => c.id === item.category)
                  const cc    = cat ? CAT_COLORS[cat.color] : CAT_COLORS.indigo
                  const days  = getDaysLeft(item.date)
                  const urgent = days <= 7 && days >= 0
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-4 py-3">
                        <div>
                          <p className={`text-sm font-medium ${urgent ? 'text-rose-300' : 'text-white'}`}>{item.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-48">{item.subtitle}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${cc.bg.replace('bg-', 'bg-').replace('-100', '-500/10')} ${cc.text}`}>
                          {cat?.label || item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-300 font-medium whitespace-nowrap">{formatDate(item.date)}</p>
                          <p className={`text-[10px] font-medium ${days <= 0 ? 'text-rose-400' : days <= 7 ? 'text-amber-400' : 'text-slate-600'}`}>
                            {days <= 0 ? 'Scaduto' : `fra ${days}gg`}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${item.amount > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {formatCurrency(item.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${sc.badge}`}>{sc.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(p => (
                            <div key={p} className={`w-2 h-2 rounded-full ${p <= item.priority ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditItem(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all">
                            <Trash2 size={13} />
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
              <Filter size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Nessuna scadenza trovata</p>
            </div>
          )}
        </div>
      </div>

      {editItem && <DeadlineModal item={editItem} onClose={() => setEditItem(null)} onSave={handleSave} />}
      {showNew  && <DeadlineModal item={EMPTY_DEADLINE} onClose={() => setShowNew(false)} onSave={handleSave} />}
    </AdminLayout>
  )
}
