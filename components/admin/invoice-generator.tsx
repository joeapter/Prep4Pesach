"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { readJson } from '@/lib/http';

type Props = {
  jobId: string;
};

export function InvoiceGenerator({ jobId }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    if (!window.confirm('Generate invoice for this job?')) {
      setLoading(false);
      return;
    }
    setStatus(null);
    const response = await fetch('/api/invoices/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId })
    });
    setLoading(false);

    const payload = await readJson<{ error?: string; invoice_id?: string }>(response);
    if (!response.ok) {
      setStatus(payload?.error ?? 'Unable to generate invoice.');
      return;
    }

    setStatus(`Invoice created (${payload?.invoice_id ?? 'unknown'}).`);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating…' : 'Generate invoice'}
      </button>
      {status && <p className="text-[10px] text-slate-500">{status}</p>}
    </div>
  );
}
