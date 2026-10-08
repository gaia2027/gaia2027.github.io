import nodemailer from 'npm:nodemailer@10.0.15'

const allowedOrigin = Deno.env.get('GAIA_SITE_ORIGIN') ?? 'https://gaia2027.github.io'

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})

const escapeHtml = (value: string) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
})[character]!)

const getPublishableKey = () => {
  const legacyKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (legacyKey) return legacyKey

  try {
    const keys: Record<string, string> = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}')
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
  const smtpUser = Deno.env.get('SMTP_USER')
  const smtpPassword = Deno.env.get('SMTP_PASSWORD')?.replace(/\s/g, '')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!smtpUser || !smtpPassword || !serviceKey) return json({ error: 'Confirmation email is not configured.' }, 503)

  const text = `Dear ${recipientName},\n\nYour submission has been uploaded for the conference ‘Geomechanics Alliance in Asia’\n\nThe reference of your submission is:\n${submission.paper_title}, ${recipientName}\n\nBest Regards,\nGAIA Committee`
  const html = `<p>Dear ${escapeHtml(recipientName)},</p><p>Your submission has been uploaded for the conference ‘Geomechanics Alliance in Asia’</p><p>The reference of your submission is:<br>${escapeHtml(submission.paper_title)}, ${escapeHtml(recipientName)}</p><p>Best Regards,<br>GAIA Committee</p>`
  const idempotencyKey = `gaia-${user.id}-${submission.submitted_at}`.replace(/[^a-zA-Z0-9_-]/g, '-')

  // Gmail has no idempotency API: claim this submission before sending.
  // Only the server role can access receipt records.
  const receiptUrl = new URL(`${supabaseUrl}/rest/v1/submission_email_receipts`)
  receiptUrl.searchParams.set('user_id', `eq.${user.id}`)
  receiptUrl.searchParams.set('submitted_at', `eq.${submission.submitted_at}`)
  const receiptHeaders = {
    Authorization: `Bearer ${serviceKey}`,
    apikey: serviceKey,
    'Content-Type': 'application/json',
  }
  const claim = await fetch(`${supabaseUrl}/rest/v1/submission_email_receipts`, {
    method: 'POST',
    headers: receiptHeaders,
    body: JSON.stringify({ user_id: user.id, submitted_at: submission.submitted_at }),
  })
  if (claim.status === 409) {
    const existing = await fetch(receiptUrl, { headers: receiptHeaders })
    if (!existing.ok) return json({ error: 'Email status could not be loaded.' }, 503)
    const [receipt] = await existing.json()
    return receipt?.status === 'sent'
      ? json({ sent: true, alreadySent: true })
      : json({ error: 'Email delivery is pending confirmation. Please contact the organizer before retrying.' }, 409)
  }
  if (!claim.ok) return json({ error: 'Email tracking is not configured.' }, 503)

  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPassword },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    disableFileAccess: true,
    disableUrlAccess: true,
  })
  try {
    const result = await transport.sendMail({
      from: { name: 'GAIA 2027 — No Reply', address: smtpUser },
      to: user.email,
      subject: 'GAIA 2027 — Submission confirmation',
      messageId: `<${idempotencyKey}@gmail.com>`,
      text,
      html,
    })
    if (!result.accepted?.length) throw Object.assign(new Error('Recipient rejected'), { code: 'EENVELOPE' })
  } catch (error) {
    // Release definite rejections; leave ambiguous timeouts pending to avoid duplicates.
    const failure = error as { code?: string; responseCode?: number }
    if (['EAUTH', 'EENVELOPE', 'ECONNECTION', 'EDNS'].includes(failure.code ?? '') || (failure.responseCode ?? 0) >= 400) {
      await fetch(receiptUrl, { method: 'DELETE', headers: receiptHeaders }).catch(() => null)
    }
    console.error('Submission email failed', { code: failure.code, responseCode: failure.responseCode })
    return json({ error: 'Confirmation email could not be sent. Your submission is saved.' }, 502)
  } finally {
    transport.close()
  }

  const recorded = await fetch(receiptUrl, {
    method: 'PATCH',
    headers: receiptHeaders,
    body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString() }),
  }).catch(() => null)
  if (!recorded?.ok) console.error('SMTP accepted email, but receipt status could not be saved.')
  return json({ sent: true })
})
