-- Server-only claims prevent repeated calls from sending the same receipt twice.
-- This does not alter users or submissions.
create table if not exists public.submission_email_receipts (
  user_id uuid not null references auth.users(id) on delete cascade,
  submitted_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'sent')),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  primary key (user_id, submitted_at)
);

alter table public.submission_email_receipts enable row level security;
revoke all on public.submission_email_receipts from public, anon, authenticated;
grant select, insert, update, delete on public.submission_email_receipts to service_role;
