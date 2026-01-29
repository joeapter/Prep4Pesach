import { Card } from '@/components/ui/card';
import { InvoiceActions } from '@/components/admin/invoice-actions';
import { createServerClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export default async function AdminInvoicesPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('invoices')
    .select('id, status, total_cents, pdf_path, created_at, clients(full_name, email), job(address_text)')
    .order('created_at', { ascending: false });
  const invoices = data ?? [];

  const enriched = await Promise.all(
    invoices.map(async (invoice: any) => {
      let pdfUrl: string | null = null;
      if (invoice.pdf_path) {
        const { data: urlData } = supabaseService.storage.from('invoices').getPublicUrl(invoice.pdf_path);
        pdfUrl = urlData.publicUrl;
      }
      return { ...invoice, pdfUrl };
    })
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Invoices</p>
        <h2 className="text-2xl font-semibold text-white">Generate, preview, and send</h2>
      </div>
      <div className="space-y-4">
        {enriched.map((invoice: any) => (
          <Card key={invoice.id}>
            <div className="flex flex-col gap-2 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{invoice.clients?.full_name ?? 'Client'}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{invoice.clients?.email}</p>
                <p className="text-[10px] text-slate-500">Job: {invoice.job?.address_text ?? 'N/A'}</p>
                <p className="text-[10px] text-slate-500">
                  Created: {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-amber-200">₪{(invoice.total_cents / 100).toFixed(2)}</p>
                <span className="rounded-full bg-slate-800/60 px-3 py-1 text-xs">{invoice.status}</span>
                {invoice.pdfUrl && (
                  <a
                    className="text-xs text-slate-300 underline"
                    href={invoice.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Preview PDF
                  </a>
                )}
                <InvoiceActions invoiceId={invoice.id} email={invoice.clients?.email ?? undefined} />
              </div>
            </div>
          </Card>
        ))}
        {invoices.length === 0 && <p className="text-sm text-slate-500">No invoices yet.</p>}
      </div>
    </section>
  );
}
