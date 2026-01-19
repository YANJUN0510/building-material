import React, { useEffect, useState } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PhilosophyPage from './pages/Philosophy';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import Chatbox from './components/Chatbox';
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
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
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
      <Navbar onContactClick={() => setIsContactOpen(true)} />
      <Routes location={backgroundLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/philosophy" element={<PhilosophyPage />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:code" element={<ProductDetail />} />
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
      <FloatingContactButton isOpen={isChatboxOpen} onClick={() => setIsChatboxOpen(prev => !prev)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Chatbox isOpen={isChatboxOpen} onClose={() => setIsChatboxOpen(false)} />
      <Footer />
    </>
  );
}

export default App
