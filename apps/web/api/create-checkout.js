import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Mappa piano → Stripe Price ID (configurati in dashboard Stripe)
const PRICE_IDS = {
  personal_monthly: process.env.STRIPE_PRICE_PERSONAL_MONTHLY,
  personal_annual:  process.env.STRIPE_PRICE_PERSONAL_ANNUAL,
  famiglia_monthly: process.env.STRIPE_PRICE_FAMIGLIA_MONTHLY,
  famiglia_annual:  process.env.STRIPE_PRICE_FAMIGLIA_ANNUAL,
  pro_monthly:      process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_annual:       process.env.STRIPE_PRICE_PRO_ANNUAL,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { plan, billing, userId, email } = req.body

    if (!plan || !billing || !userId || !email) {
      return res.status(400).json({ error: 'Parametri mancanti: plan, billing, userId, email' })
    }

    const priceKey = `${plan}_${billing}`
    const priceId = PRICE_IDS[priceKey]

    if (!priceId) {
      return res.status(400).json({ error: `Piano non valido: ${priceKey}` })
    }

    // Recupera o crea il customer Stripe, collegandolo all'utente Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    )

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    let customerId = sub?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      })
      customerId = customer.id
      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/pricing`,
      locale: 'it',
      metadata: { supabase_user_id: userId, plan },
      subscription_data: {
        metadata: { supabase_user_id: userId, plan },
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('[create-checkout]', err)
    return res.status(500).json({ error: 'Errore creazione sessione di pagamento' })
  }
}
