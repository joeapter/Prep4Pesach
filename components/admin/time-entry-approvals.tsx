"use client";

import { useState } from 'react';
import { readJson } from '@/lib/http';

type TimeEntry = {
  id: string;
  job_id: string;
  worker: { full_name: string } | null;
  punch_in: string;
  minutes_worked: number | null;
  status: string;
};

type Props = {
  entries: TimeEntry[];
};

export function TimeEntryApprovals({ entries }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  const handleAction = async (entryId: string, approve: boolean) => {
    setMessage(null);
    const response = await fetch('/api/time-entries/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_id: entryId, approve })
    });

    if (response.ok) {
      setSelected((prev) => new Set(prev).add(entryId));
      setMessage(`Entry ${entryId} ${approve ? 'approved' : 'rejected'}.`);
    } else {
      const payload = await readJson<{ error?: string }>(response);
      setMessage(payload?.error ?? 'Unable to update entry.');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">Time entry approvals</h3>
      {entries.length === 0 && <p className="text-xs text-slate-400">No pending entries.</p>}
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{entry.worker?.full_name ?? 'Worker'}</p>
            <p className="text-sm text-white">Entry {entry.id}</p>
            <p className="text-xs text-slate-400">
              {entry.minutes_worked ?? 0} minutes · {new Date(entry.punch_in).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full border border-emerald-400 px-3 py-1 text-xs text-emerald-300"
              onClick={() => handleAction(entry.id, true)}
            >
              Approve
            </button>
            <button
              className="rounded-full border border-red-400 px-3 py-1 text-xs text-red-300"
              onClick={() => handleAction(entry.id, false)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
      {message && <p className="text-xs text-amber-200">{message}</p>}
    </div>
  );
}
