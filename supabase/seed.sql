-- Template seed data for Prep4Pesach (used as reference or for manual execution).
-- Because the tables reference auth.users, it is easiest to run `pnpm seed:dev` (scripts/seed-dev.ts) after
-- populating the SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY env vars. Alternatively, create auth users first,
-- replace the placeholder UUIDs below with their actual profile IDs, then execute this script.

insert into profiles (id, role, full_name, phone) values
  ('{ADMIN_PROFILE_UUID}', 'admin', 'Prep4Pesach Admin', '+972500000001'),
  ('{WORKER_PROFILE_UUID}', 'worker', 'Shmuel Worker', '+972500000002'),
  ('{CLIENT_PROFILE_UUID}', 'client', 'Ramat Client', '+972500000003');

insert into clients (id, profile_id, email, address_text, notes) values
  ('{CLIENT_RECORD_UUID}', '{CLIENT_PROFILE_UUID}', 'client@prep4pesach.com', 'רחוב האורז 12, רמת גן', 'Pesach demo client');

insert into workers (id, profile_id, pay_rate_cents) values
  ('{WORKER_RECORD_UUID}', '{WORKER_PROFILE_UUID}', 1800);

insert into worker_availability (worker_id, start_at, end_at, recurring_rule) values
  ('{WORKER_RECORD_UUID}', '2026-02-10T06:00:00Z', '2026-02-10T14:00:00Z', null);

insert into slots (id, start_at, end_at, capacity_workers, status, created_by) values
  ('{SLOT_RECORD_UUID}', '2026-02-10T08:00:00Z', '2026-02-10T12:00:00Z', 2, 'booked', '{ADMIN_PROFILE_UUID}');

insert into jobs (id, client_id, slot_id, address_text, notes, status, hourly_rate_cents, requested_team_size) values
  ('{JOB_RECORD_UUID}', '{CLIENT_RECORD_UUID}', '{SLOT_RECORD_UUID}', 'רחוב השקד 9, רמת גן', 'Demo Pesach cleaning', 'invoiced', 25000, 2);

insert into job_assignments (job_id, worker_id) values
  ('{JOB_RECORD_UUID}', '{WORKER_RECORD_UUID}');

insert into time_entries (job_id, worker_id, punch_in, punch_out, status, approved_by, approved_at)
values
  ('{JOB_RECORD_UUID}', '{WORKER_RECORD_UUID}', '2026-02-10T08:00:00Z', '2026-02-10T12:00:00Z', 'approved', '{ADMIN_PROFILE_UUID}', now());

insert into invoices (id, job_id, client_id, status, subtotal_cents, total_cents, sent_at)
values
  ('{INVOICE_RECORD_UUID}', '{JOB_RECORD_UUID}', '{CLIENT_RECORD_UUID}', 'sent', 100000, 100000, now());

insert into invoice_lines (invoice_id, description, quantity, unit_price_cents, line_total_cents)
values
  (
    '{INVOICE_RECORD_UUID}',
    'Cleaning services (4 hours @ 250)',
    4,
    25000,
    100000
  );

insert into worker_payments (worker_id, amount_cents, job_id, notes)
values
  ('{WORKER_RECORD_UUID}', 7200, '{JOB_RECORD_UUID}', 'Seed payroll adjustment');
