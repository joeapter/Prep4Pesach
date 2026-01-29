"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { readJson } from '@/lib/http';

type Props = {
  invoiceId: string;
  email?: string;
};

export function InvoiceActions({ invoiceId, email }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!email) {
      setStatus('Client email missing.');
      return;
    }
    if (!window.confirm('Send this invoice to the client via email?')) {
      return;
    }
    setLoading(true);
    const response = await fetch('/api/invoices/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_id: invoiceId })
    });
    setLoading(false);

    if (response.ok) {
      setStatus('Invoice sent by email.');
      router.refresh();
      return;
    }

    const payload = await readJson<{ error?: string }>(response);
    setStatus(payload?.error ?? 'Unable to send invoice.');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="rounded-2xl border border-amber-400 px-4 py-1 text-xs uppercase tracking-[0.3em] text-amber-200"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Sending…' : 'Send invoice'}
      </button>
      {status && <p className="text-xs text-amber-200">{status}</p>}
    </div>
  );
}
