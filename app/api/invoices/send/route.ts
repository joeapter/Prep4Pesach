import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { sendEmail } from '@/lib/email/smtp';

type SendBody = {
  invoice_id: string;
};

export async function POST(req: Request) {
  const { invoice_id } = (await req.json()) as SendBody;
  if (!invoice_id) {
    return NextResponse.json({ error: 'Invoice ID required.' }, { status: 400 });
  }

  const { data: invoice } = await supabaseService
    .from('invoices')
    .select('id, pdf_path, status, clients(full_name, email)')
    .eq('id', invoice_id)
    .single();

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }

  if (!invoice.pdf_path) {
    return NextResponse.json({ error: 'Invoice PDF missing.' }, { status: 400 });
  }

  const { data: urlData, error: urlError } = supabaseService.storage.from('invoices').getPublicUrl(invoice.pdf_path);
  if (urlError) {
    return NextResponse.json({ error: urlError.message }, { status: 500 });
  }

  const clientEmail = invoice.clients?.email;
  if (!clientEmail) {
    return NextResponse.json({ error: 'Missing client email.' }, { status: 400 });
  }

  const watchers = (process.env.BOOKING_NOTIFICATION_RECIPIENTS ?? '')
    .split(',')
    .map((candidate) => candidate.trim())
    .filter(Boolean);

  await sendEmail({
    to: clientEmail,
    bcc: watchers.length ? watchers : undefined,
    subject: `Your Prep4Pesach invoice ${invoice.id}`,
    text: `Your invoice is ready. Download it here: ${urlData.publicUrl}`,
    html: `<p>Hi ${invoice.clients?.full_name ?? 'client'},</p><p>Your invoice is ready. <a href="${urlData.publicUrl}">Download the PDF</a>.</p>`
  });

  await supabaseService
    .from('invoices')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', invoice_id);

  return NextResponse.json({ sent: true, pdf: urlData.publicUrl });
}
