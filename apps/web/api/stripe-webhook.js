import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Disabilita il body parser: Stripe richiede il raw body per la firma
export const config = { api: { bodyParser: false } }

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// Mappa Stripe Price ID → piano interno
const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_PERSONAL_MONTHLY]: 'personal',
  [process.env.STRIPE_PRICE_PERSONAL_ANNUAL]:  'personal',
  [process.env.STRIPE_PRICE_FAMIGLIA_MONTHLY]: 'famiglia',
  [process.env.STRIPE_PRICE_FAMIGLIA_ANNUAL]:  'famiglia',
  [process.env.STRIPE_PRICE_PRO_MONTHLY]:      'pro',
  [process.env.STRIPE_PRICE_PRO_ANNUAL]:       'pro',
}

async function buffer(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

async function syncSubscription(subscription) {
  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    console.warn('[webhook] subscription senza supabase_user_id')
    return
  }

  const priceId = subscription.items.data[0]?.price?.id
  const plan = PRICE_TO_PLAN[priceId] ?? 'free'

  const statusMap = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    incomplete: 'incomplete',
    unpaid: 'past_due',
  }

  await supabase.from('subscriptions').update({
    stripe_subscription_id: subscription.id,
    plan,
    status: statusMap[subscription.status] ?? 'incomplete',
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  }).eq('user_id', userId)

  // Allinea il piano sul profilo (per i controlli di feature gating)
  await supabase.from('profiles').update({ plan }).eq('id', userId)

  await supabase.from('activity_logs').insert({
    user_id: userId,
    action: `subscription_${subscription.status}`,
    detail: `Piano ${plan} — ${subscription.status}`,
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook] firma non valida', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncSubscription(event.data.object)
        break

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const userId = sub.metadata?.supabase_user_id
        if (userId) {
          await supabase.from('subscriptions').update({
            plan: 'free', status: 'canceled', cancel_at_period_end: false,
          }).eq('user_id', userId)
          await supabase.from('profiles').update({ plan: 'free' }).eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer
        await supabase.from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', customerId)
        break
      }

      default:
        // Evento non gestito — ack comunque per evitare retry
        break
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('[webhook] errore handler', err)
    return res.status(500).json({ error: 'Errore elaborazione webhook' })
  }
}
