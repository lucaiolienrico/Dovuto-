// Avvia il checkout Stripe per un piano. Richiede utente autenticato.
export async function startCheckout({ planId, billing, user }) {
  if (planId === 'free') {
    // Free non richiede pagamento
    return { ok: true, free: true }
  }

  if (!user) {
    return { ok: false, error: 'Devi accedere per sottoscrivere un piano' }
  }

  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: planId,
        billing,                 // 'monthly' | 'annual'
        userId: user.id,
        email: user.email,
      }),
    })

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}))
      return { ok: false, error: error ?? 'Errore durante il checkout' }
    }

    const { url } = await res.json()
    if (url) {
      window.location.href = url   // redirect alla pagina Stripe
      return { ok: true }
    }
    return { ok: false, error: 'URL di checkout non ricevuto' }
  } catch (e) {
    console.error('[startCheckout]', e)
    return { ok: false, error: 'Errore di rete' }
  }
}
