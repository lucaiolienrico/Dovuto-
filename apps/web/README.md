# Dovuto

**Ciò che è dovuto, non si dimentica.**

Dashboard premium per la gestione centralizzata di scadenze personali, familiari e fiscali.
Template preconfigurati per 730, IMU, bollo, PEC, SPID e tutto il calendario fiscale italiano.

🌐 **dovuto.it** · 📧 support@dovuto.it

---

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **Lucide React**
- **React Router DOM 6**

## Avvio rapido

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build produzione
npm run preview   # preview build
```

## Struttura progetto

```
src/
├── components/
│   ├── PricingCard.jsx       # Card piano prezzi riusabile
│   └── PricingModal.jsx      # Modal upgrade in-dashboard
├── context/
│   └── AdminAuthContext.jsx  # Auth admin (sessionStorage)
├── data/
│   ├── mockData.js           # Scadenze, piani, categorie, utility
│   └── adminData.js          # Utenti mock, MRR, log attività
├── hooks/
│   └── useDashboard.js       # Hook stato dashboard
├── pages/
│   ├── Dashboard.jsx         # App principale utente
│   ├── Landing.jsx           # Landing page pubblica
│   ├── Pricing.jsx           # Pagina prezzi standalone
│   ├── Success.jsx           # Post-pagamento Stripe
│   └── admin/
│       ├── AdminGuard.jsx    # Route protection
│       ├── AdminLayout.jsx   # Sidebar + topbar dark
│       ├── AdminLogin.jsx    # Login amministratore
│       ├── AdminOverview.jsx # KPI, MRR, activity
│       ├── AdminUsers.jsx    # CRUD utenti
│       ├── AdminDeadlines.jsx# CRUD scadenze
│       └── AdminExtra.jsx    # Revenue, Logs, Settings
├── App.jsx                   # Router (public + admin)
├── main.jsx                  # Entry point
└── index.css                 # Tailwind + stili globali
```

## Route

| Path | Descrizione |
|---|---|
| `/` | Landing page |
| `/dashboard` | Dashboard utente |
| `/pricing` | Pagina prezzi |
| `/success` | Conferma pagamento |
| `/admin` | Login admin |
| `/admin/dashboard` | Overview admin |
| `/admin/users` | Gestione utenti |
| `/admin/deadlines` | Gestione scadenze |
| `/admin/revenue` | Metriche revenue |
| `/admin/logs` | Log attività |
| `/admin/settings` | Impostazioni |

## Admin demo

```
URL:       /admin
Email:     admin@dovuto.it
Password:  admin2024
```

## Deploy su Vercel

```bash
npm i -g vercel
vercel --prod
```

## Aggiungere Stripe (step successivo)

1. Crea `api/create-checkout.js` e `api/stripe-webhook.js`
2. Variabili ambiente su Vercel:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
3. Webhook URL: `https://dovuto.it/api/stripe-webhook`

## Roadmap

- [ ] Supabase Auth (login / registrazione utenti)
- [ ] CRUD scadenze reali su DB
- [ ] Stripe checkout live
- [ ] Notifiche email (Resend)
- [ ] Import da Google Calendar / iCal
- [ ] Export PDF scadenzario
- [ ] App mobile (React Native / Expo)

## Licenza

MIT — © 2024 Dovuto
