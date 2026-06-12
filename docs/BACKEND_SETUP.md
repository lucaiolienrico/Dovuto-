# Setup Backend — Dovuto

Guida per attivare backend reale (Supabase) e pagamenti (Stripe).

---

## 1. Supabase

### Crea il progetto
1. Vai su [supabase.com](https://supabase.com) → New project
2. Salva `Project URL` e `anon key` (Settings → API)
3. Salva anche la `service_role key` (segreta — solo per i webhook)

### Applica lo schema
```bash
# Opzione A — Supabase CLI
supabase link --project-ref TUO_PROJECT_REF
supabase db push

# Opzione B — SQL Editor della dashboard
# Copia/incolla il contenuto di supabase/migrations/0001_initial_schema.sql
```

Lo schema crea: `profiles`, `deadlines`, `subscriptions`, `activity_logs`,
con Row Level Security attiva e un trigger che crea automaticamente
profilo + abbonamento `free` ad ogni registrazione.

---

## 2. Stripe

### Crea i prodotti
Dashboard Stripe → Products → crea per ogni piano un prezzo mensile e annuale:

| Piano | Mensile | Annuale |
|-------|---------|---------|
| Personal | €3.90 | €29 |
| Famiglia | €6.90 | €49 |
| Pro | €12.90 | €89 |

Copia i 6 `price_...` ID.

### Configura il webhook
```
Dashboard → Developers → Webhooks → Add endpoint
URL:    https://TUO-DOMINIO/api/stripe-webhook
Eventi: customer.subscription.created
        customer.subscription.updated
        customer.subscription.deleted
        invoice.payment_failed
```
Copia il `whsec_...` (signing secret).

---

## 3. Variabili d'ambiente

Copia `apps/web/.env.example` → `.env.local` e compila tutto.

Su **Vercel** (Settings → Environment Variables) aggiungi le stesse variabili
**server-side** (senza prefisso `VITE_`):
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_URL`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, e i 6 `STRIPE_PRICE_*`.

---

## 4. Test locale dei pagamenti

```bash
# Stripe CLI inoltra i webhook in locale
stripe listen --forward-to localhost:5173/api/stripe-webhook
# Usa il whsec_ che stampa come STRIPE_WEBHOOK_SECRET in .env.local

# Carta di test: 4242 4242 4242 4242 — qualsiasi data futura, qualsiasi CVC
```

---

## 5. Mobile

Il package `@dovuto/api` è condiviso. Su React Native serve passare un
adapter di storage (AsyncStorage) a `createDovutoClient`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createDovutoClient } from '@dovuto/api'

createDovutoClient({
  url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  storage: AsyncStorage,
})
```

---

## Stato attuale

✅ Schema DB + RLS · client/query typed · AuthContext web · checkout + webhook · validazione · test
⏳ Da fare: sostituire i dati mock nelle pagine UI con le chiamate `@dovuto/api`
