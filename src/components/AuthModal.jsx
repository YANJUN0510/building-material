import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp } from '@clerk/clerk-react';

function getModalMode(pathname) {
  if (pathname.startsWith('/sign-up')) return 'sign-up';
  if (pathname.startsWith('/sign-in')) return 'sign-in';
  return null;
}

function getClerkFriendlyError(err) {
  const first = err?.errors?.[0];
  return first?.longMessage || first?.message || err?.message || 'Something went wrong';
}

export default function AuthModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = getModalMode(location.pathname);
  if (!mode) return null;

  const background = location.state?.backgroundLocation;
  const onClose = () => {
    if (background?.pathname) navigate(background.pathname, { replace: true });
    else navigate('/', { replace: true });
  };

  const switchTo = (nextMode) => {
    navigate(nextMode === 'sign-in' ? '/sign-in' : '/sign-up', { state: { backgroundLocation: background || location } });
  };

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true">
      <div className="auth-modal-backdrop" onClick={onClose} />
      <div className="auth-modal-container">
        <button className="auth-modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="auth-modal-body">
          {mode === 'sign-in' ? (
            <HeadlessSignIn
              onSuccess={() => navigate('/my-account', { replace: true, state: null })}
              onSwitch={() => switchTo('sign-up')}
            />
          ) : (
            <HeadlessSignUp
              onSuccess={() => navigate('/my-account', { replace: true, state: null })}
              onSwitch={() => switchTo('sign-in')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function HeadlessSignIn({ onSuccess, onSwitch }) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = 'Sign in';
  const subtitle = 'Welcome back. Please sign in to continue.';

  const oauthRedirectUrl = '/sso-callback';
  const oauthRedirectUrlComplete = '/my-account';

  const handleGoogle = async () => {
    if (!isLoaded) return;
    setError('');
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: oauthRedirectUrl,
        redirectUrlComplete: oauthRedirectUrlComplete,
      });
    } catch (err) {
      setError(getClerkFriendlyError(err));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError('');
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onSuccess();
        return;
      }
      setError('Additional verification required. Please use Google sign-in or contact support.');
    } catch (err) {
      setError(getClerkFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authx">
      <div className="authx-header">
        <div className="authx-title metallic-text">{title}</div>
        <div className="authx-subtitle">{subtitle}</div>
      </div>

      <button className="authx-oauth" type="button" onClick={handleGoogle} disabled={!isLoaded}>
        Continue with Google
      </button>

      <div className="authx-divider">
        <span>or</span>
      </div>

      {error ? <div className="authx-error" role="alert">{error}</div> : null}

      <form className="authx-form" onSubmit={submit}>
        <label className="authx-label">
          Email
          <input
            className="authx-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="authx-label">
          Password
          <input
            className="authx-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="authx-submit" type="submit" disabled={!isLoaded || isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="authx-footer">
        <span>Don’t have an account?</span>
        <button className="authx-link" type="button" onClick={onSwitch}>Sign up</button>
      </div>
    </div>
  );
}

function HeadlessSignUp({ onSuccess, onSwitch }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [step, setStep] = useState('form'); // form | verify

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = 'Create account';
  const subtitle = 'Join Building Material Warehouse in under a minute.';

  const handleGoogle = async () => {
    if (!isLoaded) return;
    setError('');
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/my-account',
      });
    } catch (err) {
      setError(getClerkFriendlyError(err));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError('');
    try {
      const result = await signUp.create({ emailAddress: email, password });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onSuccess();
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err) {
      setError(getClerkFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onSuccess();
        return;
      }
      setError('Verification incomplete. Please try again.');
    } catch (err) {
      setError(getClerkFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authx">
      <div className="authx-header">
        <div className="authx-title metallic-text">{title}</div>
        <div className="authx-subtitle">{subtitle}</div>
      </div>

      {step === 'form' ? (
        <>
          <button className="authx-oauth" type="button" onClick={handleGoogle} disabled={!isLoaded}>
            Continue with Google
          </button>
          <div className="authx-divider"><span>or</span></div>
          {error ? <div className="authx-error" role="alert">{error}</div> : null}
          <form className="authx-form" onSubmit={submit}>
            <label className="authx-label">
              Email
              <input
                className="authx-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="authx-label">
              Password
              <input
                className="authx-input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button className="authx-submit" type="submit" disabled={!isLoaded || isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create account'}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="authx-note">
            We sent a verification code to <strong>{email}</strong>.
          </div>
          {error ? <div className="authx-error" role="alert">{error}</div> : null}
          <form className="authx-form" onSubmit={verify}>
            <label className="authx-label">
              Verification code
              <input
                className="authx-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </label>
            <button className="authx-submit" type="submit" disabled={!isLoaded || isSubmitting}>
              {isSubmitting ? 'Verifying…' : 'Verify'}
            </button>
            <button className="authx-secondary" type="button" onClick={() => setStep('form')} disabled={isSubmitting}>
              Back
            </button>
          </form>
        </>
      )}

      <div className="authx-footer">
        <span>Already have an account?</span>
        <button className="authx-link" type="button" onClick={onSwitch}>Sign in</button>
      </div>
    </div>
  );
}
