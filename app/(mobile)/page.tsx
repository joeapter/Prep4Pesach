"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

type JobAssignment = {
  job: {
    id: string;
    address_text: string;
    slot: { start_at: string; end_at: string };
    hourly_rate_cents: number;
  };
};

type TimeEntrySummary = {
  job_id: string;
  minutes_worked: number;
};

export default function MobilePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<JobAssignment[]>([]);
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<TimeEntrySummary[]>([]);

  const fetchAssignments = useCallback(
    async (worker: string) => {
      const { data } = await supabaseClient
        .from('job_assignments')
        .select('job(id, address_text, slot(start_at, end_at), hourly_rate_cents)')
        .eq('worker_id', worker);
      setAssignments(data ?? []);
    },
    [setAssignments]
  );

  const fetchWorker = useCallback(async () => {
    const {
      data: { session }
    } = await supabaseClient.auth.getSession();
    if (!session) {
      setEntries([]);
      setAssignments([]);
      setWorkerId(null);
      return;
    }

    const { data, error } = await supabaseClient
      .from('workers')
      .select('id')
      .eq('profile_id', session.user.id)
      .single();

    if (error || !data) {
      setStatus('Worker profile not found');
      return;
    }

    setWorkerId(data.id);
    await fetchAssignments(data.id);
  }, [fetchAssignments]);

  const fetchHours = useCallback(
    async (worker: string | null) => {
      if (!worker) {
        setEntries([]);
        return;
      }
      const { data } = await supabaseClient
        .from('time_entries')
        .select('job_id, minutes_worked')
        .eq('worker_id', worker)
        .eq('status', 'approved');
      setEntries(data ?? []);
    },
    [setEntries]
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetchWorker();
  }, [fetchWorker]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetchHours(workerId);
  }, [workerId, fetchHours]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const totalHours = useMemo(() => entries.reduce((sum, entry) => sum + (entry.minutes_worked ?? 0) / 60, 0), [entries]);

  const handleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus('Logged in. Fetching jobs…');
    fetchWorker();
  };

  const handlePunch = async (jobId: string, punchOut = false) => {
    if (!workerId) {
      setStatus('Log in first.');
      return;
    }

    if (punchOut) {
      const { error } = await supabaseClient
        .from('time_entries')
        .update({ punch_out: new Date().toISOString(), status: 'pending' })
        .eq('worker_id', workerId)
        .eq('job_id', jobId)
        .is('punch_out', null)
        .limit(1);
      if (error) {
        setStatus(error.message);
        return;
      }
      setStatus('Punched out');
      fetchHours(workerId);
      return;
    }

    const { error } = await supabaseClient.from('time_entries').insert({
      job_id: jobId,
      worker_id: workerId,
      punch_in: new Date().toISOString(),
      status: 'pending'
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus('Punched in');
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Worker login</p>
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
        {status && <p className="text-xs text-amber-200">{status}</p>}
        {workerId && (
          <p className="text-xs text-slate-400">Worker ID: {workerId} · Total approved hours: {totalHours.toFixed(2)}</p>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Jobs</h2>
        {assignments.map((assignment) => (
          <Card key={assignment.job.id}>
            <p className="text-sm font-semibold text-white">{assignment.job.address_text}</p>
            <p className="text-xs text-slate-400">
              {new Date(assignment.job.slot.start_at).toLocaleString()} -{' '}
              {new Date(assignment.job.slot.end_at).toLocaleString()}
            </p>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => handlePunch(assignment.job.id)}>Punch in</Button>
              <Button variant="ghost" onClick={() => handlePunch(assignment.job.id, true)}>
                Punch out
              </Button>
            </div>
          </Card>
        ))}
        {assignments.length === 0 && <p className="text-sm text-slate-500">No assigned jobs yet.</p>}
      </section>
    </div>
  );
}
