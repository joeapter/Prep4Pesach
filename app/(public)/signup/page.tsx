'use client';

import { FormEvent, useState } from 'react';
import { readJson } from '@/lib/http';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, phone })
      });

      const payload = await readJson<{ error?: string }>(response);
      setLoading(false);

      if (!response.ok) {
        setMessage(payload?.error ?? 'Unable to create account.');
        return;
      }

      setMessage('Account created. You can now sign in.');
    } catch {
      setLoading(false);
      setMessage('Failed to fetch. Please try again.');
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal active" aria-hidden="false" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>Create an account</h3>
          <a className="modal-close" href="/" aria-label="Close">
            &times;
          </a>
        </div>
        <p className="modal-intro">Join Prep4Pesach and schedule your personalized clean in a few clicks.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              type="text"
              placeholder="Sarah Cohen"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>
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
            Phone
            <input
              type="tel"
              placeholder="+972 50 123 4567"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>
          <button className="primary full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          {message && <p className="modal-footnote modal-message">{message}</p>}
          <p className="modal-footnote">
            We’ll email you confirmation and allow you to manage bookings inside the Prep4Pesach portal.
          </p>
        </form>
      </div>
    </div>
  );
}
