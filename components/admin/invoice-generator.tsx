"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.error ?? 'Unable to generate invoice.');
      return;
    }

    const payload = await response.json();
    setStatus(`Invoice created (${payload.invoice_id}).`);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        className="rounded-2xl border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-white"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating…' : 'Generate invoice'}
      </button>
      {status && <p className="text-[10px] text-amber-200">{status}</p>}
    </div>
  );
}
