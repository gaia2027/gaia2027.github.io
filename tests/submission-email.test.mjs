import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SourceTextModule, SyntheticModule, createContext } from 'node:vm'
import ts from 'typescript'

const source = ts.transpileModule(readFileSync(new URL('../supabase/functions/send-submission-confirmation/index.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText

async function setup(options = {}) {
  let handler
  let receipt = options.receipt
  let transportOptions
  let closed = 0
  const messages = []
  const writes = []
  const env = {
    SUPABASE_URL: 'https://project.example', SUPABASE_ANON_KEY: 'public-test-key',
    SUPABASE_SERVICE_ROLE_KEY: 'server-test-key', SMTP_USER: 'sender@gmail.com',
    SMTP_PASSWORD: 'abcd efgh ijkl mnop', ...options.env,
  }
  const reply = (value, status = 200) => new Response(JSON.stringify(value), { status })
  const context = createContext({
    URL, Response, console: { error() {} },
    Deno: { env: { get: (name) => env[name] }, serve: (callback) => { handler = callback } },
    fetch: async (input, init) => {
      const url = new URL(input)
      if (url.pathname.includes('submission_email_receipts')) {
        assert.equal(init.headers.apikey, 'server-test-key')
        const method = init.method ?? 'GET'
        writes.push(method)
        if (options.ledgerUnavailable) return reply({}, 503)
        if (method === 'POST') {
          if (receipt) return reply({}, 409)
          assert.deepEqual(JSON.parse(init.body), { user_id: 'user-1', submitted_at: '2026-10-08T00:00:00Z' })
          receipt = { status: 'pending' }
          return reply({}, 201)
        }
        assert.equal(url.searchParams.get('user_id'), 'eq.user-1')
        assert.equal(url.searchParams.get('submitted_at'), 'eq.2026-10-08T00:00:00Z')
        if (method === 'PATCH') {
          if (options.recordFailure) throw new Error('Database unavailable')
          receipt = JSON.parse(init.body)
        }
        if (method === 'DELETE') receipt = undefined
        return reply(receipt ? [receipt] : [])
      }
      assert.equal(init.headers.apikey, 'public-test-key')
      assert.equal(init.headers.Authorization, 'Bearer user-token')
      if (url.pathname.endsWith('/user')) return reply({
        id: 'user-1', email: 'verified@example.com',
        email_confirmed_at: options.unverified ? null : '2026-10-01T00:00:00Z',
      }, options.invalidToken ? 401 : 200)
      assert.equal(url.searchParams.get('user_id'), 'eq.user-1')
      if (options.dataFailure) return reply({}, 403)
      if (url.pathname.endsWith('/submissions')) return reply(options.noSubmission ? [] : [{
        paper_title: '<Research & results>', status: options.draft ? 'draft' : 'submitted',
        submitted_at: '2026-10-08T00:00:00Z', contact_email: 'unverified@example.com',
      }])
      if (url.pathname.endsWith('/profiles')) return reply([{ first_name: 'A<', last_name: 'B&' }])
      throw new Error(`Unexpected request: ${url}`)
    },
  })
  const smtp = new SyntheticModule(['default'], function () {
    this.setExport('default', { createTransport(config) {
      transportOptions = config
      return {
        async sendMail(message) {
          messages.push(message)
          if (options.smtpError) throw options.smtpError
          return { accepted: options.rejected ? [] : [message.to] }
        },
        close() { closed++ },
      }
    } })
  }, { context })
  const module = new SourceTextModule(source, { context })
  await module.link((name) => {
    assert.equal(name, 'npm:nodemailer@10.0.15')
    return smtp
  })
  await module.evaluate()
  const invoke = (overrides = {}) => handler(new Request('https://project.example/functions/v1/send-submission-confirmation', {
    method: 'POST', headers: { Authorization: 'Bearer user-token', Origin: 'https://gaia2027.github.io' },
    body: JSON.stringify({ to: 'attacker@example.com', paper_title: 'forged' }), ...overrides,
  }))
  return { invoke, messages, writes, state: () => ({ receipt, transportOptions, closed }) }
}

test('uses verified login email, server content and TLS; ignores browser recipients; escapes HTML', async () => {
  const app = await setup()
  assert.equal((await app.invoke()).status, 200)
  const [mail] = app.messages
  assert.equal(mail.to, 'verified@example.com')
  assert.equal(mail.from.address, 'sender@gmail.com')
  assert.equal(mail.from.name, 'GAIA 2027 — No Reply')
  assert.match(mail.html, /&lt;Research &amp; results&gt;/)
  assert.match(mail.html, /A&lt; B&amp;/)
  assert.ok(!mail.text.includes('forged'))
  assert.equal(app.state().transportOptions.port, 465)
  assert.equal(app.state().transportOptions.secure, true)
  assert.equal(app.state().transportOptions.auth.pass, 'abcdefghijklmnop')
  assert.equal(app.state().receipt.status, 'sent')
  assert.equal(app.state().closed, 1)
  assert.equal((await app.invoke()).status, 200)
  assert.equal(app.messages.length, 1)
})

for (const [name, options, status] of [
  ['invalid token', { invalidToken: true }, 401], ['unverified email', { unverified: true }, 403],
  ['draft', { draft: true }, 400], ['no submission', { noSubmission: true }, 400],
  ['data access failure', { dataFailure: true }, 400],
  ['missing password', { env: { SMTP_PASSWORD: undefined } }, 503],
  ['missing ledger', { ledgerUnavailable: true }, 503],
  ['pending duplicate', { receipt: { status: 'pending' } }, 409],
  ['sent duplicate', { receipt: { status: 'sent' } }, 200],
]) test(`does not send: ${name}`, async () => {
  const app = await setup(options)
  assert.equal((await app.invoke()).status, status)
  assert.equal(app.messages.length, 0)
})

test('rejects anonymous callers, wrong origins and GET; allows OPTIONS', async () => {
  const app = await setup()
  assert.equal((await app.invoke({ headers: {} })).status, 401)
  assert.equal((await app.invoke({ headers: { Origin: 'https://other.example' } })).status, 403)
  assert.equal((await app.invoke({ method: 'GET', body: undefined })).status, 405)
  const response = await app.invoke({ method: 'OPTIONS', body: undefined })
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://gaia2027.github.io')
  assert.equal(response.status, 200)
  assert.equal(app.messages.length, 0)
})

test('concurrent requests send only once', async () => {
  const app = await setup()
  await Promise.all([app.invoke(), app.invoke()])
  assert.equal(app.messages.length, 1)
})

for (const smtpError of [{ code: 'EAUTH' }, { responseCode: 550 }]) test('definite SMTP failure releases claim', async () => {
  const app = await setup({ smtpError })
  assert.equal((await app.invoke()).status, 502)
  assert.equal(app.state().receipt, undefined)
  assert.equal(app.state().closed, 1)
})

test('ambiguous timeout stays pending and is not resent', async () => {
  const app = await setup({ smtpError: { code: 'ETIMEDOUT' } })
  assert.equal((await app.invoke()).status, 502)
  assert.equal((await app.invoke()).status, 409)
  assert.equal(app.messages.length, 1)
})

test('accepted SMTP with failed status update does not trigger duplicate delivery', async () => {
  const app = await setup({ recordFailure: true })
  assert.equal((await app.invoke()).status, 200)
  assert.equal((await app.invoke()).status, 409)
  assert.equal(app.messages.length, 1)
})

test('rejected recipient is not marked sent', async () => {
  const app = await setup({ rejected: true })
  assert.equal((await app.invoke()).status, 502)
  assert.equal(app.state().receipt, undefined)
})
