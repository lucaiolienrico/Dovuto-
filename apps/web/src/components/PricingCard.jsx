import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { startCheckout } from '../lib/checkout'

export default function PricingCard({ plan, annual, compact = false }) {
  const isPopular = plan.id === 'personal'
  const price     = annual ? plan.annual : plan.price
  const period    = annual ? '/anno' : '/mese'

  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [err, setErr]   = useState('')

  const handleClick = async () => {
    setErr('')
    setBusy(true)
    const res = await startCheckout({
      planId: plan.id,
      billing: annual ? 'annual' : 'monthly',
      user,
    })
    setBusy(false)
    if (!res.ok) setErr(res.error)
  }

  const ctaBg = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200',
    violet:  'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200',
    outline: 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
  }

  const ringColor = {
    indigo:  'ring-2 ring-indigo-500 ring-offset-2',
    emerald: 'ring-2 ring-emerald-500 ring-offset-2',
    violet:  'ring-2 ring-violet-500 ring-offset-2',
    slate:   '',
  }

  const nameColor = {
    indigo:  'text-indigo-700',
    emerald: 'text-emerald-700',
    violet:  'text-violet-700',
    slate:   'text-slate-700',
  }

  const checkBg = {
    indigo:  'bg-indigo-100',
    emerald: 'bg-emerald-100',
    violet:  'bg-violet-100',
    slate:   'bg-slate-100',
  }

  const checkColor = {
    indigo:  'text-indigo-600',
    emerald: 'text-emerald-600',
    violet:  'text-violet-600',
    slate:   'text-slate-600',
  }

  return (
    <div className={`relative bg-white rounded-2xl flex flex-col transition-all duration-200 hover:shadow-xl
      ${compact ? 'p-5' : 'p-6'}
      ${isPopular
        ? `${ringColor[plan.color]} shadow-xl`
        : 'shadow-sm border border-slate-100 hover:border-slate-200'
      }
    `}>
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
          {plan.badge}
        </div>
      )}

      <div className="mb-4">
        <h3 className={`text-base font-bold mb-1 ${nameColor[plan.color]}`}>{plan.name}</h3>
        <p className="text-xs text-slate-500">{plan.desc}</p>
      </div>

      <div className="mb-5">
        {plan.price === 0 ? (
          <div className="text-3xl font-black text-slate-900">Gratis</div>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-slate-900">€{price}</span>
            <span className="text-sm text-slate-400 mb-1">{period}</span>
          </div>
        )}
        {annual && plan.price > 0 && (
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Risparmi €{((plan.price * 12) - plan.annual).toFixed(0)} vs mensile
          </div>
        )}
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5">
            {f.ok ? (
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${checkBg[plan.color]}`}>
                <Check size={10} className={checkColor[plan.color]} />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <X size={8} className="text-slate-400" />
              </div>
            )}
            <span className={`text-xs ${f.ok ? 'text-slate-700' : 'text-slate-400'}`}>{f.text}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={busy}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 ${ctaBg[plan.ctaStyle]}`}
      >
        {busy ? 'Attendere…' : plan.cta}
      </button>
      {err && <p className="text-xs text-rose-600 mt-2 text-center">{err}</p>}
    </div>
  )
}
