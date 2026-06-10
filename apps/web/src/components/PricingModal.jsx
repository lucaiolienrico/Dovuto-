import { useState } from 'react'
import { X, Lock, RefreshCw, Shield, Award } from 'lucide-react'
import { PLANS } from '../data/mockData'
import PricingCard from './PricingCard'

export default function PricingModal({ onClose }) {
  const [annual, setAnnual] = useState(true)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-base font-bold text-slate-900">Upgrade il tuo piano</h2>
            <p className="text-xs text-slate-500 mt-0.5">Sblocca scadenze illimitate e funzionalità avanzate</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAnnual(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >Mensile</button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                Annuale
                <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">-40%</span>
              </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <PricingCard key={plan.id} plan={plan} annual={annual} compact />
          ))}
        </div>

        {/* Trust bar */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Lock size={12} className="text-indigo-500" /> Pagamento sicuro via Stripe</span>
              <span className="flex items-center gap-1.5"><RefreshCw size={12} className="text-emerald-500" /> Cancella in qualsiasi momento</span>
              <span className="flex items-center gap-1.5"><Shield size={12} className="text-indigo-500" /> GDPR compliant</span>
              <span className="flex items-center gap-1.5"><Award size={12} className="text-amber-500" /> 30gg soddisfatti o rimborsati</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
