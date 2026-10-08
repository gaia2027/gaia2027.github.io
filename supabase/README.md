# GAIA 2027 Supabase setup

1. Create a Supabase project on the Free plan in an Asia region.
2. Open **SQL Editor**, paste and run `migrations/202609020001_initial_user_submission_system.sql`.
   - If the initial script was run before the Data API grants were added, also run `migrations/202609020002_grant_data_api_access.sql`.
3. In **Authentication > URL Configuration**, set:
   - Site URL: `https://gaia2027.github.io/`
   - Redirect URL: `https://gaia2027.github.io/account`
   - Local redirect URLs: `http://localhost:5173/account`, `http://127.0.0.1:5173/account`, and `http://127.0.0.1:4173/account`
4. Copy the Project URL and publishable/anon key into `.env.local` for local development.
5. Add the same values as GitHub repository secrets named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. Register the organizer through the website, then grant administrator access in SQL Editor:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
```

Passwords remain in Supabase Auth and are never readable by the website or administrator. The storage bucket is private, submissions are limited to 20 MB, users can access only their own profile/files, and administrators can read all submissions and create signed download links.

## Submission confirmation email

The function source is `functions/send-submission-confirmation/index.ts`. It sends only to the signed-in user's verified account email and reads the submitted paper title and name from Supabase rather than trusting browser-supplied email content.

The sender now uses Gmail SMTP (TLS on port 465), with the display name `GAIA 2027 — No Reply`. The actual From address is `SMTP_USER`; no custom domain is required for this Gmail setup. Auth verification emails and submission receipts have separate configurations.

1. In Edge Functions > Secrets, save `SMTP_USER` and `SMTP_PASSWORD` (Google app password, not the account password). Never commit passwords or expose them through a `VITE_` variable. `SUPABASE_SERVICE_ROLE_KEY` is supplied by the hosted function runtime; never copy it into the browser.
2. In SQL Editor, run `migrations/202610080001_submission_email_receipts.sql`. It creates a server-only delivery ledger; existing users, submissions and files are unchanged.
3. Deploy `functions/send-submission-confirmation/index.ts` as `send-submission-confirmation` through the Dashboard editor. If already present, replace its code and deploy updates. With CLI authentication, the equivalent command is `supabase functions deploy send-submission-confirmation --project-ref dgvlxhtzpbkfikakauhv --no-verify-jwt`. The function itself validates every user token via Auth before reading any submission. The legacy gateway JWT check may need to be disabled for projects using asymmetric signing keys.
4. Verify the deployed function before setting GitHub repository variable `VITE_SUBMISSION_CONFIRMATION_EMAIL_ENABLED=true` and rebuilding Pages. Until this step, submission receipts stay disabled.
5. Sign in with a verified test account, submit its own paper, and check the verified login mailbox (including spam). SAVE must not send mail; a failed SMTP send must not undo the submission. Do not mark delivery verified until the recipient confirms receipt.

Tests: `node --experimental-vm-modules --test tests/submission-email.test.mjs` (mocked SMTP, no real emails). Runtime type check: `npx deno check --node-modules-dir=none --no-config --no-lock supabase/functions/send-submission-confirmation/index.ts`.

The ledger's unique `(user_id, submitted_at)` claim prevents concurrent duplicate sends of the same saved submission. Definite SMTP rejections release the claim for retry. Ambiguous timeouts leave it `pending`; check Gmail Sent and the function logs before clearing that record. Do not automatically retry an ambiguous send. Clicking Submit again creates a new submission timestamp and therefore a new receipt. SMTP acceptance is not proof of inbox delivery.
