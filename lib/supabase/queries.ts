import { createServerClient } from './server';

type SupabaseClient = ReturnType<typeof createServerClient>;

export async function getProfile(client: SupabaseClient) {
  const { data, error } = await client.from('profiles').select('*').single();
  if (error) throw error;
  return data;
}

export async function getOpenSlots(client: SupabaseClient) {
  const { data, error } = await client
    .from('slots')
    .select('*, jobs(*)')
    .eq('status', 'open')
    .order('start_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getClientJobs(client: SupabaseClient) {
  const { data, error } = await client
    .from('jobs')
    .select('*, slot(*), invoice(*), job_assignments(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getWorkerAssignedJobs(client: SupabaseClient) {
  const { data, error } = await client
    .from('job_assignments')
    .select('job:jobs(*, slot(*), clients(*)), worker:workers(id, pay_rate_cents)')
    .order('assigned_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getWorkerTimeEntries(client: SupabaseClient) {
  const { data, error } = await client
    .from('time_entries')
    .select('*, jobs(*), workers(*)')
    .order('punch_in', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getWorkerAvailability(client: SupabaseClient) {
  const { data, error } = await client.from('worker_availability').select('*').order('start_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllWorkerAvailability(client: SupabaseClient) {
  const { data, error } = await client
    .from('worker_availability')
    .select('*, workers(*)')
    .order('start_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAdminCalendar(client: SupabaseClient) {
  const { data, error } = await client
    .from('slots')
    .select('*, jobs(*, job_assignments(*, workers(*)))')
    .order('start_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAdminPayroll(client: SupabaseClient, startDate: string, endDate: string) {
  const { data, error } = await client.rpc('get_worker_payroll', { start_range: startDate, end_range: endDate });
  if (error) throw error;
  return data;
}

export async function createJobAssignment(client: SupabaseClient, jobId: string, workerId: string) {
  const { data, error } = await client.from('job_assignments').insert({ job_id: jobId, worker_id: workerId }).single();
  if (error) throw error;
  return data;
}

export async function upsertWorkerAvailability(client: SupabaseClient, availability: Record<string, unknown>) {
  const { data, error } = await client.from('worker_availability').upsert(availability).single();
  if (error) throw error;
  return data;
}
