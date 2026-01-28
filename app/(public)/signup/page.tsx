'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabaseClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Check your inbox for a confirmation link.');
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12 rounded-3xl bg-slate-900/60 border border-slate-800">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Book or work</h1>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-400">
          <span>Full name</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </label>
        <label className="block text-sm text-slate-400">
          <span>Email</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="block text-sm text-slate-400">
          <span>Password</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      {message && <p className="text-sm text-amber-200">{message}</p>}
    </div>
  );
}
