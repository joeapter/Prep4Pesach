import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false
  }
});

type SeedUser = {
  email: string;
  password: string;
  role: 'admin' | 'worker' | 'client';
  fullName: string;
  phone: string;
};

const sampleUsers: SeedUser[] = [
  {
    email: 'admin@prep4pesach.com',
    password: 'Admin123!',
    role: 'admin',
    fullName: 'Prep4Pesach Admin',
    phone: '+972500000001'
  },
  {
    email: 'shmuel@prep4pesach.com',
    password: 'Worker123!',
    role: 'worker',
    fullName: 'Shmuel Worker',
    phone: '+972500000002'
  },
  {
    email: 'client@prep4pesach.com',
    password: 'Client123!',
    role: 'client',
    fullName: 'Ramat Client',
    phone: '+972500000003'
  }
];

type SeedContext = {
  adminProfileId: string;
  workerId: string;
  workerProfileId: string;
  workerPayRate: number;
  clientId: string;
  clientProfileId: string;
};

async function ensureAuthUser(email: string, password: string, metadata: Record<string, string>) {
  const { data: existingUsers, error: listError } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .limit(1)
    .maybeSingle();

  if (listError) {
    throw listError;
  }

  if (existingUsers?.id) {
    return existingUsers.id;
  }

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata
  });

  if (createError) {
    throw createError;
  }

  if (!data.user?.id) {
    throw new Error('Could not create auth user');
  }

  return data.user.id;
}

async function seed() {
  console.log('Starting dev seed...');

  const context: Partial<SeedContext> = {};

  for (const user of sampleUsers) {
    const profileId = await ensureAuthUser(user.email, user.password, {
      full_name: user.fullName,
      role: user.role
    });

    const { error } = await supabase.from('profiles').upsert(
      {
        id: profileId,
        role: user.role,
        full_name: user.fullName,
        phone: user.phone
      },
      { onConflict: 'id' }
    );

    if (error) {
      throw error;
    }

    if (user.role === 'admin') {
      context.adminProfileId = profileId;
    }

    if (user.role === 'worker') {
      context.workerProfileId = profileId;
      const { data: workerRecord, error: workerErr } = await supabase
        .from('workers')
        .upsert(
          {
            profile_id: profileId,
            pay_rate_cents: 1800
          },
          { onConflict: 'profile_id' }
        )
        .select('id')
        .maybeSingle();

      if (workerErr) {
        throw workerErr;
      }

      context.workerPayRate = 1800;
      context.workerId = workerRecord?.id ?? '';
    }

    if (user.role === 'client') {
      context.clientProfileId = profileId;
      const { data: clientRecord, error: clientErr } = await supabase
        .from('clients')
        .upsert(
          {
            profile_id: profileId,
            email: user.email,
            address_text: 'תל אביב, רחוב האורז 12',
            notes: 'Sample Pesach cleaning client'
          },
          { onConflict: 'profile_id' }
        )
        .select('id')
        .maybeSingle();

      if (clientErr) {
        throw clientErr;
      }

      context.clientId = clientRecord?.id ?? '';
    }
  }

  if (!context.adminProfileId || !context.workerId || !context.clientId || !context.workerPayRate) {
    throw new Error('Failed to seed required identities');
  }

  const slotStart = new Date('2026-02-10T08:00:00Z');
  const slotEnd = new Date('2026-02-10T12:00:00Z');

  const { data: slot, error: slotError } = await supabase
    .from('slots')
    .insert({
      start_at: slotStart.toISOString(),
      end_at: slotEnd.toISOString(),
      capacity_workers: 2,
      status: 'open',
      created_by: context.adminProfileId
    })
    .select('*')
    .limit(1)
    .maybeSingle();

  if (slotError) {
    throw slotError;
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert({
      client_id: context.clientId,
      slot_id: slot?.id,
      address_text: 'רחוב השקד 9, רמת גן',
      notes: 'סדנאות ניקוי פסח',
      status: 'invoiced',
      hourly_rate_cents: 25000,
      requested_team_size: 2
    })
    .select('*')
    .limit(1)
    .maybeSingle();

  if (jobError) {
    throw jobError;
  }

  await supabase.from('slots').update({ status: 'booked' }).eq('id', slot?.id);

  const { error: assignmentError } = await supabase.from('job_assignments').insert({
    job_id: job?.id,
    worker_id: context.workerId
  });

  if (assignmentError) {
    throw assignmentError;
  }

  const punchIn = new Date('2026-02-10T08:00:00Z');
  const punchOut = new Date('2026-02-10T12:00:00Z');

  const { error: timeEntryError } = await supabase.from('time_entries').insert({
    job_id: job?.id,
    worker_id: context.workerId,
    punch_in: punchIn.toISOString(),
    punch_out: punchOut.toISOString(),
    status: 'approved',
    approved_by: context.adminProfileId,
    approved_at: new Date().toISOString()
  });

  if (timeEntryError) {
    throw timeEntryError;
  }

  const hoursWorked = 4;
  const subtotal = 25000 * hoursWorked;

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      job_id: job?.id,
      client_id: context.clientId,
      status: 'sent',
      subtotal_cents: subtotal,
      total_cents: subtotal,
      sent_at: new Date().toISOString()
    })
    .select('*')
    .limit(1)
    .maybeSingle();

  if (invoiceError) {
    throw invoiceError;
  }

  const { error: invoiceLineError } = await supabase.from('invoice_lines').insert({
    invoice_id: invoice?.id,
    description: `Cleaning services (${hoursWorked} hours @ ${subtotal / hoursWorked / 100} per hour)`,
    quantity: hoursWorked,
    unit_price_cents: 25000,
    line_total_cents: subtotal
  });

  if (invoiceLineError) {
    throw invoiceLineError;
  }

  const workerPayment = context.workerPayRate * hoursWorked;

  const { error: workerPaymentError } = await supabase.from('worker_payments').insert({
    worker_id: context.workerId,
    amount_cents: workerPayment,
    job_id: job?.id,
    notes: 'Seed payment entry (assumes payment approved)'
  });

  if (workerPaymentError) {
    throw workerPaymentError;
  }

  console.log('Seed complete:');
  console.log(` - Admin profile: ${context.adminProfileId}`);
  console.log(` - Worker id: ${context.workerId}`);
  console.log(` - Client id: ${context.clientId}`);
  console.log(` - Sample job id: ${job?.id}`);
  console.log(` - Sample invoice id: ${invoice?.id}`);
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
