import React, { useEffect, useState } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PhilosophyPage from './pages/Philosophy';
import Collections from './pages/Collections';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import FloatingContactButton from './components/FloatingContactButton';
import MyAccount from './pages/MyAccount';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import AuthModal from './components/AuthModal';
import SsoCallback from './pages/SsoCallback';

function RequireClerkAuth({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation || location;

  useEffect(() => {
    const handler = () => setIsContactOpen(true);
    window.addEventListener('bmw:open-contact', handler);
    return () => window.removeEventListener('bmw:open-contact', handler);
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="dynamic-bg"></div>
      <Navbar />
      <Routes location={backgroundLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/philosophy" element={<PhilosophyPage />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/login" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in/*" element={<Home />} />
        <Route path="/sign-up/*" element={<Home />} />
        <Route path="/sso-callback" element={<SsoCallback />} />
        <Route
          path="/my-account"
          element={
            <RequireClerkAuth>
              <MyAccount />
            </RequireClerkAuth>
          }
        />
      </Routes>
      <AuthModal />
      <FloatingContactButton onClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Footer />
    </>
  )
}

export default App
