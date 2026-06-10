import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

export default function Success() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Pagamento completato!
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Il tuo piano è attivo. Riceverai una email di conferma a breve. Benvenuto in Dovuto.
        </p>
        <Link to="/dashboard"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm shadow-indigo-200 active:scale-95"
        >
          Vai alla Dashboard <ArrowRight size={16} />
        </Link>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <div className="w-5 h-5 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles size={11} className="text-white" />
          </div>
          Dovuto
        </div>
      </div>
    </div>
  )
}
