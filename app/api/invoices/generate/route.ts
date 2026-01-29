import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { renderInvoiceToBuffer, uploadInvoicePdf, InvoiceTemplateProps } from '@/lib/invoice/service';

type InvoiceBody = {
  job_id: string;
};

export async function POST(req: Request) {
  const { job_id } = await req.json() as InvoiceBody;
  if (!job_id) {
    return NextResponse.json({ error: 'Job ID required.' }, { status: 400 });
  }

  const { data: job, error: jobError } = await supabaseService
    .from('jobs')
    .select('id, address_text, hourly_rate_cents, client_id, slot(start_at, end_at), clients(full_name, email, address_text)')
    .eq('id', job_id)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: jobError?.message ?? 'Job not found.' }, { status: 404 });
  }

  const { data: timeEntries } = await supabaseService
    .from('time_entries')
    .select('minutes_worked')
    .eq('job_id', job_id)
    .eq('status', 'approved');

  const totalMinutes = (timeEntries ?? []).reduce((sum, entry) => sum + (entry.minutes_worked ?? 0), 0);
  if (totalMinutes === 0) {
    return NextResponse.json({ error: 'No approved hours yet.' }, { status: 400 });
  }

  const hours = totalMinutes / 60;
  const lineTotal = Math.round(job.hourly_rate_cents * hours);

  const { data: invoice } = await supabaseService
    .from('invoices')
    .insert({
      job_id: job.id,
      client_id: job.client_id,
      status: 'draft',
      subtotal_cents: lineTotal,
      total_cents: lineTotal
    })
    .select('*')
    .single();

  if (!invoice) {
    return NextResponse.json({ error: 'Could not create invoice.' }, { status: 500 });
  }

  await supabaseService.from('invoice_lines').insert({
    invoice_id: invoice.id,
    description: `Cleaning services (${hours.toFixed(2)}h @ ₪${(job.hourly_rate_cents / 100).toFixed(2)})`,
    quantity: hours,
    unit_price_cents: job.hourly_rate_cents,
    line_total_cents: lineTotal
  });

  const getClientValue = (field: 'full_name' | 'address_text') => {
    if (!job.clients) {
      return undefined;
    }
    if (Array.isArray(job.clients)) {
      return job.clients[0]?.[field];
    }
    return job.clients[field];
  };

  const invoicePdf: InvoiceTemplateProps = {
    invoiceNumber: invoice.id,
    clientName: getClientValue('full_name') ?? 'Client',
    clientAddress: getClientValue('address_text') ?? 'Unknown address',
    jobAddress: job.address_text,
    createdAt: invoice.created_at ?? new Date().toISOString(),
    lines: [
      {
        description: `Cleaning services`,
        quantity: hours,
        unit_price_cents: job.hourly_rate_cents,
        line_total_cents: lineTotal
      }
    ],
    subtotal: lineTotal,
    total: lineTotal
  };

  const buffer = await renderInvoiceToBuffer(invoicePdf);
  const filename = `${invoice.id}.pdf`;
  const pdfUrl = await uploadInvoicePdf(buffer, filename);

  await supabaseService.from('invoices').update({ pdf_path: filename }).eq('id', invoice.id);

  return NextResponse.json({ invoice_id: invoice.id, pdf_url: pdfUrl });
}
