import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in, redirect to home or dashboard
        navigate('/', { replace: true });
      } else {
        // User is not signed in, redirect to sign-in
        navigate('/sign-in', { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-loading">
            <Loader2 size={32} className="spinning" />
            <h2>Processing authentication...</h2>
            <p>Please wait while we verify your account.</p>
          </div>
        </div>
      </div>
    );
  }

  // This component should redirect immediately when loaded
  return null;
};

export default AuthCallback;