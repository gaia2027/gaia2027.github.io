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

The feature remains disabled until a sender domain is owned and verified. Do not enable `VITE_SUBMISSION_CONFIRMATION_EMAIL_ENABLED` or use the placeholder sender before then. Deployment and secret setup are documented in `docs/school-email-handoff.md`.
