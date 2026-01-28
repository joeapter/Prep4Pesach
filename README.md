# Prep4Pesach - Pesach Cleaning Business Platform

This repository will host the full-stack MVP for a Pesach cleaning company in Ramat Beit Shemesh. It pairs a **Next.js (App Router) + shadcn/ui** front end with **Supabase** (Postgres, Auth, Storage, RLS) and supporting services (Resend emails, PDF invoices, payroll tracking, PWA support). The focus during this phase is on the data foundation: schema, policies, and developer tooling to seed a working dataset.

- **Supabase schema + policies:** `supabase/migrations/000_init.sql` defines the core tables (`profiles`, `clients`, `workers`, `slots`, `jobs`, `time_entries`, `invoices`, etc.) plus helper functions (`app.is_admin()`, `app.current_worker_id()`, etc.) and the RLS policies that enforce role-based access.
- **Seed helpers:** `scripts/seed-dev.ts` uses the Supabase service role API to provision example admin/worker/client users, a slot, a job, time entries, an invoice, and a payroll payment. `supabase/seed.sql` contains a commented template of the same records for manual insertion if you prefer SQL.

## Setup (next steps for developers)
1. **Install dependencies (after enabling Corepack if needed):**
   - `corepack pnpm install`
2. **Configure Supabase:**
   - Run `supabase init` (if the project isn’t linked yet) and `supabase link --project-ref <ref>` or manage schema in the Supabase dashboard.
   - Apply the schema with `supabase db push` (or run `supabase/migrations/000_init.sql` manually).
3. **Seed the database (service role required):**
   - Copy `.env.example` → `.env.local`, fill in the variables, then run `corepack pnpm seed:dev`.
4. **Launch the Next.js app:**
   - `corepack pnpm dev` (Next.js App Router is in place already).

## Seed script notes

- `scripts/seed-dev.ts` calls `supabase.auth.admin.createUser` and writes to every table outlined in the schema so devs can immediately log in as admin/worker/client.
- The script assumes the Supabase service role key is available in `SUPABASE_SERVICE_ROLE_KEY` and that `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) is populated. It can be rerun safely (`upsert` is used for identity tables) but may create duplicate jobs/slots.
- `supabase/seed.sql` is provided as a reference, with placeholders like `{ADMIN_PROFILE_UUID}` if you prefer to seed manually.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (used later for sending invoices)
- `RESEND_FROM_EMAIL`
- `APP_BASE_URL`

## Next steps

1. Add Supabase route handlers & server actions (slot generation, job creation, invoice PDF upload + Resend email) that use `lib/supabase/{client,server,service}.ts`.
2. Implement richer forms, FullCalendar interactions, and payroll exports on the admin dashboard.
3. Enhance the mobile worker experience with offline-friendly behavior and detailed punch-in history.

## Server actions (implemented)

The following `app/api/*` routes already use the Supabase helpers for the admin-facing workflows:

- `POST /api/slots/generate` – takes a range and block/buffer settings to create open slots from worker availability (admin-only).
- `POST /api/jobs/create` – creates a job for the authenticated client, marks the slot as booked, and stores the hourly rate.
- `POST /api/time-entries/approve` – admin endpoint to approve or reject a worker’s time entry, stamping the approver.
- `POST /api/invoices/generate` – summarizes a job’s approved hours, creates invoice records + lines, renders the PDF with `@react-pdf/renderer`, uploads it to Supabase Storage, and returns the public URL.
- `POST /api/invoices/send` – delivers the generated invoice via Resend email and updates the invoice status/timestamp.
