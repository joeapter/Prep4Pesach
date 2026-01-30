"use client";

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { readJson } from '@/lib/http';

export function SlotGenerator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [block, setBlock] = useState('180');
  const [buffer, setBuffer] = useState('30');
  const [capacity, setCapacity] = useState('2');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch('/api/slots/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_at: from,
        end_at: to,
        block_minutes: Number(block),
        buffer_minutes: Number(buffer),
        capacity_workers: Number(capacity)
      })
    });

    setLoading(false);

    const payload = await readJson<{ error?: string; created?: number }>(response);
    if (!response.ok) {
      setStatus(payload?.error ?? 'Unable to generate slots.');
      return;
    }

    setStatus(`${payload?.created ?? 0} slots created.`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          placeholder="From (ISO)"
          required
        />
        <input
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          placeholder="To (ISO)"
          required
        />
        <input
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          type="number"
          min="1"
          placeholder="Capacity"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={block}
          onChange={(event) => setBlock(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          type="number"
          min="30"
          placeholder="Block minutes"
        />
        <input
          value={buffer}
          onChange={(event) => setBuffer(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          type="number"
          min="0"
          placeholder="Buffer minutes"
        />
      </div>
      <button
        className="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        disabled={loading}
      >
        {loading ? 'Generating…' : 'Generate slots'}
      </button>
      {status && <p className="text-xs text-slate-500">{status}</p>}
    </form>
  );
}
