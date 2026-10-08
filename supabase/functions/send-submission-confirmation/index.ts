const allowedOrigin = Deno.env.get('GAIA_SITE_ORIGIN') ?? 'https://gaia2027.github.io'

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
})[character])

const getPublishableKey = () => {
  const legacyKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (legacyKey) return legacyKey

  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}')
    return keys.default ?? Object.values(keys)[0]
  } catch {
    return undefined
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  const requestOrigin = request.headers.get('Origin')
  if (requestOrigin && requestOrigin !== allowedOrigin) return json({ error: 'Origin not allowed.' }, 403)

  const authorization = request.headers.get('Authorization')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const publishableKey = getPublishableKey()
  if (!authorization || !supabaseUrl || !publishableKey) return json({ error: 'Authentication is unavailable.' }, 401)

  const authenticatedHeaders = {
    Authorization: authorization,
    apikey: publishableKey,
  }

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: authenticatedHeaders })
  if (!userResponse.ok) return json({ error: 'Invalid session.' }, 401)

  const user = await userResponse.json()
  if (!user.email || !user.email_confirmed_at) return json({ error: 'A verified account email is required.' }, 403)

  const submissionUrl = new URL(`${supabaseUrl}/rest/v1/submissions`)
  submissionUrl.searchParams.set('select', 'paper_title,status,submitted_at')
  submissionUrl.searchParams.set('user_id', `eq.${user.id}`)
  submissionUrl.searchParams.set('limit', '1')

  const profileUrl = new URL(`${supabaseUrl}/rest/v1/profiles`)
  profileUrl.searchParams.set('select', 'first_name,last_name')
  profileUrl.searchParams.set('user_id', `eq.${user.id}`)
  profileUrl.searchParams.set('limit', '1')

  const [submissionResponse, profileResponse] = await Promise.all([
    fetch(submissionUrl, { headers: authenticatedHeaders }),
    fetch(profileUrl, { headers: authenticatedHeaders }),
  ])
  if (!submissionResponse.ok || !profileResponse.ok) return json({ error: 'Submission details could not be loaded.' }, 400)

  const [submission] = await submissionResponse.json()
  const [profile] = await profileResponse.json()
  if (!submission || submission.status !== 'submitted' || !submission.submitted_at) {
    return json({ error: 'Submit the paper before requesting confirmation.' }, 400)
  }

  const recipientName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'participant'
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const sender = Deno.env.get('GAIA_EMAIL_FROM')
  if (!resendApiKey || !sender) return json({ error: 'Confirmation email is not configured.' }, 503)

  const text = `Dear ${recipientName},\n\nYour submission has been uploaded for the conference ‘Geomechanics Alliance in Asia’\n\nThe reference of your submission is:\n${submission.paper_title}, ${recipientName}\n\nBest Regards,\nGAIA Committee`
  const html = `<p>Dear ${escapeHtml(recipientName)},</p><p>Your submission has been uploaded for the conference ‘Geomechanics Alliance in Asia’</p><p>The reference of your submission is:<br>${escapeHtml(submission.paper_title)}, ${escapeHtml(recipientName)}</p><p>Best Regards,<br>GAIA Committee</p>`
  const idempotencyKey = `gaia-${user.id}-${submission.submitted_at}`.replace(/[^a-zA-Z0-9_-]/g, '-')

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: sender,
      to: [user.email],
      subject: 'GAIA 2027 — Submission confirmation',
      text,
      html,
    }),
  })

  if (!emailResponse.ok) return json({ error: 'Confirmation email could not be sent.' }, 502)
  return json({ sent: true })
})
