import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, ArrowRight, Bell, Wallet, FileText, Shield,
  Calendar, BarChart2, Star, Lock, RefreshCw, AlertTriangle,
  Menu, X, Zap
} from 'lucide-react'
import { PLANS } from '../data/mockData'
import PricingCard from '../components/PricingCard'

const FEATURES = [
  { icon: Bell,      title: 'Alert Intelligenti',   desc: 'Notifiche 30, 7 e 1 giorno prima. Mai più una scadenza persa.',                      color: 'indigo' },
  { icon: Wallet,    title: 'Budget & Importi',      desc: 'Traccia ogni uscita prevista. Previsioni mensili e annuali automatiche.',              color: 'emerald' },
  { icon: FileText,  title: 'Documenti Italiani',    desc: '730, IMU, F24, bollo, PEC, SPID. Template preconfigurati per l\'Italia.',             color: 'amber' },
  { icon: Shield,    title: 'Privacy First',         desc: 'Dati cifrati, nessuna condivisione con terze parti. GDPR compliant.',                  color: 'rose' },
  { icon: Calendar,  title: 'Vista Calendario',      desc: 'Timeline visiva con indicatori colore per criticità e urgenza.',                       color: 'sky' },
  { icon: BarChart2, title: 'Analytics Personali',   desc: 'Trend di spesa, distribuzione per categoria, proiezioni future.',                     color: 'purple' },
]

const TESTIMONIALS = [
  { name: 'Marco R.',  role: 'Agente immobiliare, Milano', text: 'Ho smesso di pagare more per bolli e IMU dimenticati. In un anno ho risparmiato più di €400.', stars: 5 },
  { name: 'Giulia T.', role: 'Libera professionista, Roma', text: 'Finalmente tutto in un posto: 730, PEC, assicurazioni, passaporto. Zero ansia da scadenze.',  stars: 5 },
  { name: 'Luca F.',   role: 'Papà di 3, Torino',          text: 'Gestisco le scadenze di tutta la famiglia. Il piano Famiglia vale ogni centesimo.',             stars: 5 },
]

const FEAT_COLORS = {
  indigo:  'bg-indigo-100 text-indigo-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber:   'bg-amber-100 text-amber-600',
  rose:    'bg-rose-100 text-rose-600',
  sky:     'bg-sky-100 text-sky-600',
  purple:  'bg-purple-100 text-purple-600',
}

export default function Landing() {
  const [annual,     setAnnual]     = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Dovuto</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">Funzionalità</a>
            <a href="#pricing"  className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">Prezzi</a>
            <a href="#faq"      className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Accedi
            </Link>
            <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-200 active:scale-95">
              Prova gratis
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} className="text-slate-700" /> : <Menu size={20} className="text-slate-700" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-slate-100 px-4 py-4 bg-white space-y-3">
            <a href="#features" className="block text-sm text-slate-600 font-medium py-2">Funzionalità</a>
            <a href="#pricing"  className="block text-sm text-slate-600 font-medium py-2">Prezzi</a>
            <Link to="/dashboard" className="block w-full bg-indigo-600 text-white text-sm font-semibold px-4 py-3 rounded-xl text-center mt-2">
              Prova gratis
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #e0e7ff 0%, transparent 70%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fadeup inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <AlertTriangle size={12} />
            Hai mai pagato una multa per il bollo dimenticato?
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ciò che è dovuto<br />
            <span className="text-indigo-600 italic">non si dimentica.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            730, IMU, bollo auto, PEC, passaporto, polizze. <strong className="text-slate-700">Dovuto</strong> ti avvisa in anticipo,
            traccia gli importi e ti dà controllo totale sul tuo calendario fiscale e personale.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/dashboard"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              Inizia gratis — nessuna carta <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard"
              className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 font-semibold px-6 py-4 rounded-2xl text-sm hover:border-slate-300 transition-all"
            >
              Guarda la demo
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {['bg-indigo-400','bg-emerald-400','bg-amber-400','bg-rose-400'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-white`} />
                ))}
              </div>
              <span className="font-medium text-slate-700">1.200+</span> utenti attivi
            </div>
            <div className="w-px h-4 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              <span className="font-medium text-slate-700 ml-1">4.9</span>
            </div>
            <div className="w-px h-4 bg-slate-200 hidden sm:block" />
            <span className="hidden sm:block">Da <strong className="text-slate-700">€29/anno</strong></span>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="animate-float max-w-4xl mx-auto mt-16 px-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-rose-400 rounded-full" />
                <div className="w-3 h-3 bg-amber-400 rounded-full" />
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-lg px-3 py-1 text-xs text-slate-400 text-center border border-slate-200">
                  app.dovuto.it — dashboard
                </div>
              </div>
            </div>
            <div className="p-5 bg-slate-50">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                {[
                  { label: 'Scadenze 7gg',   value: '4',        color: 'bg-rose-50 border-rose-100'   },
                  { label: 'Scadenze 30gg',  value: '9',        color: 'bg-amber-50 border-amber-100' },
                  { label: 'Uscite Giugno',  value: '€2.837',   color: 'bg-indigo-50 border-indigo-100'},
                  { label: 'Totale Anno',    value: '€10.305',  color: 'bg-emerald-50 border-emerald-100'},
                  { label: 'Doc. Scadenza',  value: '4',        color: 'bg-purple-50 border-purple-100'},
                  { label: 'Rinnovi',        value: '9',        color: 'bg-sky-50 border-sky-100'     },
                ].map((k, i) => (
                  <div key={i} className={`rounded-xl p-3 border text-center ${k.color} bg-white`}>
                    <div className="text-base font-black text-slate-900">{k.value}</div>
                    <div className="text-[9px] text-slate-500 font-medium mt-0.5 leading-tight">{k.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                    <span className="text-xs font-bold text-slate-800">Priorità del Giorno</span>
                  </div>
                  {[
                    { title: 'Modello 730',         badge: 'URGENTE', bc: 'bg-rose-500 text-white'       },
                    { title: 'F24 IMU',              badge: 'Critico', bc: 'bg-rose-100 text-rose-600'    },
                    { title: 'Assicurazione Panda',  badge: 'Oggi',    bc: 'bg-amber-100 text-amber-600'  },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
                      <div className="w-5 h-5 bg-indigo-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <FileText size={10} className="text-indigo-600" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 flex-1 truncate">{item.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${item.bc}`}>{item.badge}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="text-xs font-bold text-slate-800 mb-3">Andamento Spese 2024</div>
                  <div className="flex items-end gap-1 h-14">
                    {[420,180,650,290,510,2837,1658,320,1960,430,280,540].map((v, i) => (
                      <div key={i}
                        className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        style={{ height: `${(v / 2837) * 48}px` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['G','F','M','A','M','G','L','A','S','O','N','D'].map((m, i) => (
                      <span key={i} className={`text-[8px] flex-1 text-center ${i === 5 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <Zap size={12} /> Funzionalità
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Dovuto. Costruito per<br /><em>la vita italiana.</em>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Template preconfigurati per 730, IMU, bollo, PEC, SPID e tutto il calendario fiscale italiano.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="group p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 cursor-pointer">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${FEAT_COLORS[f.color]}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Chi usa Dovuto non dimentica più
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Paga solo ciò che è dovuto
            </h2>
            <p className="text-slate-500 mb-8">Una multa per bollo dimenticato costa più di un anno intero di Dovuto.</p>
            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >Mensile</button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                Annuale
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">-40%</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(plan => (
              <PricingCard key={plan.id} plan={plan} annual={annual} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3">
              <span className="flex items-center gap-1.5"><Lock size={12} /> Pagamenti sicuri Stripe</span>
              <span className="flex items-center gap-1.5"><RefreshCw size={12} /> Cancella quando vuoi</span>
              <span className="flex items-center gap-1.5"><Shield size={12} /> GDPR compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Domande frequenti
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Posso cancellare in qualsiasi momento?',            a: 'Sì. Nessun vincolo, nessuna penale. Cancelli quando vuoi dal pannello account.' },
              { q: 'I miei dati sono al sicuro?',                       a: 'Tutti i dati sono cifrati in transito e a riposo. Non vendiamo né condividiamo informazioni con terze parti. GDPR compliant.' },
              { q: 'Funziona anche su mobile?',                         a: 'Sì, la dashboard è completamente responsive. Su mobile trovi anche la bottom navigation ottimizzata per touch.' },
              { q: 'Posso importare scadenze da un calendario esterno?', a: 'La funzione di import da Google Calendar e iCal è in roadmap per Q3 2024, disponibile sul piano Pro.' },
              { q: 'Come funziona il piano Famiglia?',                  a: 'Puoi aggiungere fino a 5 profili (es. coniuge, figli). Ogni profilo ha le proprie scadenze, visibili anche nella vista condivisa.' },
            ].map((item, i) => (
              <details key={i} className="bg-white rounded-2xl border border-slate-100 group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm text-slate-800 list-none">
                  {item.q}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="py-20 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ogni scadenza dimenticata è denaro perso.<br />Dovuto lo ricorda per te.
          </h2>
          <p className="text-indigo-200 mb-8">Da €2.41 al mese. Meno di un caffè. Il calcolo è semplice.</p>
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl text-base hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
          >
            Inizia gratis oggi <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Dovuto</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Termini di Servizio</a>
            <a href="#" className="hover:text-white transition-colors">Cookie</a>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
          <p className="text-xs">© 2024 Dovuto — P.IVA IT00000000000</p>
        </div>
      </footer>
    </div>
  )
}
