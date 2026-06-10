export const CATEGORIES = [
  { id: "immobili",     label: "Immobili & Utenze",      icon: "Home",    color: "indigo",  count: 3 },
  { id: "finanza",      label: "Finanza & Tasse",         icon: "Wallet",  color: "emerald", count: 5 },
  { id: "veicoli",      label: "Veicoli",                 icon: "Car",     color: "amber",   count: 3 },
  { id: "salute",       label: "Salute & Assicurazioni",  icon: "Heart",   color: "rose",    count: 2 },
  { id: "famiglia",     label: "Famiglia & Eventi",       icon: "Users",   color: "purple",  count: 4 },
  { id: "digitale",     label: "Digitale & Burocrazia",   icon: "Globe",   color: "sky",     count: 5 },
  { id: "abbonamenti",  label: "Abbonamenti & Animali",   icon: "Repeat",  color: "orange",  count: 4 },
]

export const DEADLINES = [
  { id: 1,  title: "Modello 730",             subtitle: "Dichiarazione dei redditi 2023",              category: "finanza",      date: "2024-06-15", amount: 0,    status: "critico",     priority: 1 },
  { id: 2,  title: "F24 IMU",                 subtitle: "Prima rata acconto IMU 2024",                 category: "immobili",     date: "2024-06-16", amount: 520,  status: "critico",     priority: 1 },
  { id: 3,  title: "Assicurazione Panda",     subtitle: "Rinnovo polizza RC Auto",                     category: "veicoli",      date: "2024-06-18", amount: 380,  status: "scade_oggi",  priority: 2 },
  { id: 4,  title: "Versamento PAC ETF",      subtitle: "Piano accumulo mensile - portafoglio ETF",    category: "finanza",      date: "2024-06-20", amount: 250,  status: "in_scadenza", priority: 2 },
  { id: 5,  title: "Rinnovo PEC",             subtitle: "Casella posta certificata aziendale",         category: "digitale",     date: "2024-06-22", amount: 45,   status: "in_scadenza", priority: 3 },
  { id: 6,  title: "Bollo Auto Panda",        subtitle: "Tassa automobilistica regionale",             category: "veicoli",      date: "2024-06-28", amount: 187,  status: "in_scadenza", priority: 3 },
  { id: 7,  title: "Concerto 26 Giugno",      subtitle: "Biglietti evento — Mediolanum Forum",         category: "famiglia",     date: "2024-06-26", amount: 120,  status: "programmato", priority: 3 },
  { id: 8,  title: "Rinnovo SPID",            subtitle: "Identità digitale — Poste Italiane",          category: "digitale",     date: "2024-07-10", amount: 0,    status: "programmato", priority: 4 },
  { id: 9,  title: "Rinnovo Dominio Web",     subtitle: "dominio.it — scadenza annuale",               category: "digitale",     date: "2024-07-15", amount: 25,   status: "programmato", priority: 4 },
  { id: 10, title: "Rinnovo Hosting",         subtitle: "Piano professionale — server VPS",            category: "digitale",     date: "2024-07-15", amount: 120,  status: "programmato", priority: 4 },
  { id: 11, title: "Passaporto Sergio",       subtitle: "Rinnovo documento — scade in 30gg",           category: "famiglia",     date: "2024-07-18", amount: 116,  status: "programmato", priority: 3 },
  { id: 12, title: "Rette Universitarie",     subtitle: "Seconda rata anno accademico 2023/24",        category: "famiglia",     date: "2024-07-31", amount: 1200, status: "programmato", priority: 2 },
  { id: 13, title: "Visita Veterinaria",      subtitle: "Controllo annuale canarini",                  category: "abbonamenti",  date: "2024-08-05", amount: 85,   status: "programmato", priority: 4 },
  { id: 14, title: "Cova Canarini",           subtitle: "Periodo riproduzione — monitoraggio nido",   category: "abbonamenti",  date: "2024-08-15", amount: 0,    status: "programmato", priority: 5 },
  { id: 15, title: "Acquisto Mangime",        subtitle: "Scorte mensili — misto semi tropicali",       category: "abbonamenti",  date: "2024-06-30", amount: 35,   status: "in_scadenza", priority: 4 },
  { id: 16, title: "Polizza Sanitaria",       subtitle: "Rinnovo annuale — famiglia completa",         category: "salute",       date: "2024-09-01", amount: 1850, status: "programmato", priority: 2 },
]

export const MONTHLY_DATA = [
  { month: "Gen", amount: 420 },
  { month: "Feb", amount: 180 },
  { month: "Mar", amount: 650 },
  { month: "Apr", amount: 290 },
  { month: "Mag", amount: 510 },
  { month: "Giu", amount: 2837 },
  { month: "Lug", amount: 1658 },
  { month: "Ago", amount: 320 },
  { month: "Set", amount: 1960 },
  { month: "Ott", amount: 430 },
  { month: "Nov", amount: 280 },
  { month: "Dic", amount: 540 },
]

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    annual: 0,
    desc: "Per iniziare senza rischi",
    color: "slate",
    cta: "Inizia gratis",
    ctaStyle: "outline",
    features: [
      { text: "Fino a 10 scadenze",     ok: true  },
      { text: "3 categorie",            ok: true  },
      { text: "Notifiche base",         ok: true  },
      { text: "Importi e budget",       ok: false },
      { text: "Export PDF",             ok: false },
      { text: "Profili famiglia",       ok: false },
      { text: "Supporto prioritario",  ok: false },
    ],
  },
  {
    id: "personal",
    name: "Personal",
    price: 3.9,
    annual: 29,
    desc: "Per professionisti e autonomi",
    color: "indigo",
    badge: "Più scelto",
    cta: "Attiva Personal",
    ctaStyle: "primary",
    features: [
      { text: "Scadenze illimitate",    ok: true  },
      { text: "Tutte le categorie",     ok: true  },
      { text: "Notifiche email + push", ok: true  },
      { text: "Importi e budget",       ok: true  },
      { text: "Export PDF",             ok: true  },
      { text: "Profili famiglia",       ok: false },
      { text: "Supporto prioritario",  ok: false },
    ],
  },
  {
    id: "famiglia",
    name: "Famiglia",
    price: 6.9,
    annual: 49,
    desc: "Per nuclei familiari complessi",
    color: "emerald",
    cta: "Attiva Famiglia",
    ctaStyle: "emerald",
    features: [
      { text: "Scadenze illimitate",    ok: true  },
      { text: "Tutte le categorie",     ok: true  },
      { text: "Notifiche email + push", ok: true  },
      { text: "Importi e budget",       ok: true  },
      { text: "Export PDF",             ok: true  },
      { text: "Fino a 5 profili",       ok: true  },
      { text: "Supporto prioritario",  ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 12.9,
    annual: 89,
    desc: "Per chi non lascia nulla al caso",
    color: "violet",
    cta: "Attiva Pro",
    ctaStyle: "violet",
    features: [
      { text: "Scadenze illimitate",    ok: true },
      { text: "Tutte le categorie",     ok: true },
      { text: "Notifiche email + push", ok: true },
      { text: "Importi e budget",       ok: true },
      { text: "Export PDF + CSV",       ok: true },
      { text: "Profili illimitati",     ok: true },
      { text: "Supporto prioritario",  ok: true },
    ],
  },
]

export const STATUS_CONFIG = {
  critico:     { label: "Critico",      bg: "bg-rose-50",   text: "text-rose-700",   dot: "bg-rose-500",   badge: "bg-rose-100 text-rose-700",   border: "border-rose-200"   },
  scade_oggi:  { label: "Scade Oggi",   bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  badge: "bg-amber-100 text-amber-700",  border: "border-amber-200"  },
  in_scadenza: { label: "In Scadenza",  bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400", badge: "bg-orange-100 text-orange-700", border: "border-orange-200" },
  programmato: { label: "Programmato",  bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400", badge: "bg-indigo-100 text-indigo-700", border: "border-indigo-200" },
  completato:  { label: "Completato",   bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500",badge: "bg-emerald-100 text-emerald-700",border: "border-emerald-200"},
}

export const CAT_COLORS = {
  indigo:  { bg: "bg-indigo-100",  text: "text-indigo-600",  light: "bg-indigo-50"  },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", light: "bg-emerald-50" },
  amber:   { bg: "bg-amber-100",   text: "text-amber-600",   light: "bg-amber-50"   },
  rose:    { bg: "bg-rose-100",    text: "text-rose-600",    light: "bg-rose-50"    },
  purple:  { bg: "bg-purple-100",  text: "text-purple-600",  light: "bg-purple-50"  },
  sky:     { bg: "bg-sky-100",     text: "text-sky-600",     light: "bg-sky-50"     },
  orange:  { bg: "bg-orange-100",  text: "text-orange-600",  light: "bg-orange-50"  },
}

export const formatCurrency = (n) => n === 0 ? "—" : `€${n.toLocaleString("it-IT")}`
export const formatDate = (d) => new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })
export const getDaysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000)
