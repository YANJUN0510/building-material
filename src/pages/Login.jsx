import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => location.state?.from || '/my-account', [location.state]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1 className="auth-title metallic-text">Login</h1>
        <p className="auth-subtitle">Sign in to view your account.</p>

        {error ? <div className="auth-error" role="alert">{error}</div> : null}

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">
            Username
            <input className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </label>
          <label className="auth-label">
            Password
            <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          <button className="auth-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-hint">
          <div>Demo accounts (default):</div>
          <div><code>builder / builder123</code></div>
          <div><code>trader / trader123</code></div>
          <div><code>quest / quest123</code></div>
        </div>
      </div>
    </div>
  );
}

