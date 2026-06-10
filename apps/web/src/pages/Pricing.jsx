import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Lock, RefreshCw, Shield, Award, ArrowLeft } from 'lucide-react'
import { PLANS } from '../data/mockData'
import PricingCard from '../components/PricingCard'

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Torna alla home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Dovuto</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Scegli il tuo piano
          </h1>
          <p className="text-slate-500 mb-8">Inizia gratis, upgrade quando vuoi. Cancella in qualsiasi momento.</p>
          <div className="inline-flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >Mensile</button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Annuale
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${annual ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>-40%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {PLANS.map(plan => (
            <PricingCard key={plan.id} plan={plan} annual={annual} />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center mb-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Lock size={12} className="text-indigo-500" /> Pagamento sicuro via Stripe</span>
            <span className="flex items-center gap-1.5"><RefreshCw size={12} className="text-emerald-500" /> Cancella in qualsiasi momento</span>
            <span className="flex items-center gap-1.5"><Shield size={12} className="text-indigo-500" /> GDPR compliant</span>
            <span className="flex items-center gap-1.5"><Award size={12} className="text-amber-500" /> 30gg soddisfatti o rimborsati</span>
          </div>
        </div>

        <div className="text-center">
          <Link to="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            Continua con il piano Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
