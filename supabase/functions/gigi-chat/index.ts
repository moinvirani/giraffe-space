// Gigi chat: the only path from the app to OpenAI.
//
// POST { action: "status" }                      -> { premium, limit, remaining }
// POST { messages, userMessage, profile, userName } -> { reply, remaining }
//
// Free users get FREE_DAILY_LIMIT messages per UTC day, counted in
// public.gigi_usage. Premium is read from RevenueCat server-side, keyed by the
// Supabase user id (the app calls Purchases.logIn(user.id)).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildSystemPrompt, type GigiProfile } from './prompt.ts'

const FREE_DAILY_LIMIT = 10
const MAX_HISTORY = 10
const MAX_CHARS = 2000
const MAX_NAME_CHARS = 40

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function isPremium(userId: string): Promise<boolean> {
  const key = Deno.env.get('REVENUECAT_SECRET_KEY')
  if (!key) {
    console.error('REVENUECAT_SECRET_KEY not set; treating everyone as free')
    return false
  }
  try {
    const res = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`,
      { headers: { Authorization: `Bearer ${key}` } },
    )
    if (!res.ok) {
      console.error('RevenueCat lookup failed:', res.status)
      return false
    }
    const body = await res.json()
    const ent = body?.subscriber?.entitlements?.premium
    if (!ent) return false
    return !ent.expires_date || new Date(ent.expires_date).getTime() > Date.now()
  } catch (error) {
    console.error('RevenueCat lookup error:', error)
    return false
  }
}

function cleanHistory(raw: unknown): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
}

function cleanProfile(raw: unknown): GigiProfile | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const p = raw as Record<string, unknown>
  const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 10) : undefined)
  return { primaryFocus: strings(p.primaryFocus), challenges: strings(p.challenges) }
}

function cleanName(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined
  const name = raw.replace(/[\r\n`]/g, ' ').trim().slice(0, MAX_NAME_CHARS)
  return name || undefined
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return json({ error: 'No authorization header' }, 401)

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: userData, error: userError } = await admin.auth.getUser(token)
  if (userError || !userData.user) return json({ error: 'Invalid user token' }, 401)
  const userId = userData.user.id

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const premium = await isPremium(userId)

  if (body.action === 'status') {
    if (premium) return json({ premium: true, limit: null, remaining: null })
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await admin
      .from('gigi_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('day', today)
      .maybeSingle()
    const used = data?.count ?? 0
    return json({ premium: false, limit: FREE_DAILY_LIMIT, remaining: Math.max(0, FREE_DAILY_LIMIT - used) })
  }

  const userMessage = typeof body.userMessage === 'string' ? body.userMessage.trim().slice(0, MAX_CHARS) : ''
  if (!userMessage) return json({ error: 'Empty message' }, 400)

  let remaining: number | null = null
  if (!premium) {
    const { data: count, error } = await admin.rpc('gigi_consume_message', {
      p_user_id: userId,
      p_limit: FREE_DAILY_LIMIT,
    })
    if (error) {
      console.error('Usage check failed:', error)
      return json({ error: 'Usage check failed' }, 500)
    }
    if (count === null) return json({ error: 'daily_limit', limit: FREE_DAILY_LIMIT, remaining: 0 }, 429)
    remaining = Math.max(0, FREE_DAILY_LIMIT - count)
  }

  const refund = async () => {
    if (!premium) await admin.rpc('gigi_refund_message', { p_user_id: userId })
  }

  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiKey) {
    console.error('OPENAI_API_KEY not set')
    await refund()
    return json({ error: 'AI not configured' }, 503)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: buildSystemPrompt(cleanProfile(body.profile), cleanName(body.userName)) },
          ...cleanHistory(body.messages),
          { role: 'user', content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI error:', response.status, await response.text().catch(() => ''))
      await refund()
      return json({ error: 'AI request failed' }, 502)
    }

    const data = await response.json()
    const reply = String(data.choices?.[0]?.message?.content ?? '').trim()
    if (!reply) {
      await refund()
      return json({ error: 'Empty AI response' }, 502)
    }

    return json({ reply, remaining })
  } catch (error) {
    console.error('OpenAI call failed:', error)
    await refund()
    return json({ error: 'AI request failed' }, 502)
  }
})
