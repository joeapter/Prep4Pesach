'use client';

import { FormEvent, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Signed in. Refresh page to access your workspace.');
  };

  return (
    <div className="modal-overlay open">
      <div className="modal active" aria-hidden="false" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>Sign in</h3>
          <a className="modal-close" href="/" aria-label="Close">
            &times;
          </a>
        </div>
        <p className="modal-intro">Continue to your account to manage bookings, availability, and payments.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button className="primary full" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          {message && <p className="modal-footnote modal-message">{message}</p>}
          <p className="modal-footnote">
            Forgot your password? <a href="#">Reset it here</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
