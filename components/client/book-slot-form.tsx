"use client";

import { useState, FormEvent } from 'react';

type Slot = {
  id: string;
  start_at: string;
  end_at: string;
};

type Props = {
  slot: Slot;
};

export function BookSlotForm({ slot }: Props) {
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [hourlyRate, setHourlyRate] = useState('25000');
  const [teamSize, setTeamSize] = useState('2');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch('/api/jobs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slot_id: slot.id,
        address_text: address,
        notes,
        hourly_rate_cents: Number(hourlyRate),
        requested_team_size: Number(teamSize)
      })
    });

    setLoading(false);
    if (response.ok) {
      setStatus('Job submitted—admin will confirm and invoice you.');
      setAddress('');
      setNotes('');
    } else {
      const payload = await response.json();
      setStatus(payload.error ?? 'Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <label className="block text-xs uppercase tracking-[0.4em] text-slate-400">Book this slot</label>
      <input
        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
        placeholder="Job address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        required
      />
      <textarea
        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
          type="number"
          min="0"
          value={hourlyRate}
          onChange={(event) => setHourlyRate(event.target.value)}
          placeholder="Hourly rate (cents)"
        />
        <input
          className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
          type="number"
          min="1"
          value={teamSize}
          onChange={(event) => setTeamSize(event.target.value)}
          placeholder="Requested team size"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
        disabled={loading}
      >
        {loading ? 'Sending…' : 'Request slot'}
      </button>
      {status && <p className="text-xs text-amber-200">{status}</p>}
    </form>
  );
}
