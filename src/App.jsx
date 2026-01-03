import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PhilosophyPage from './pages/Philosophy';
import Collections from './pages/Collections';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import FloatingContactButton from './components/FloatingContactButton';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import RequireAuth from './auth/RequireAuth';

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsContactOpen(true);
    window.addEventListener('bmw:open-contact', handler);
    return () => window.removeEventListener('bmw:open-contact', handler);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="dynamic-bg"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/philosophy" element={<PhilosophyPage />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/my-account"
          element={
            <RequireAuth>
              <MyAccount />
            </RequireAuth>
          }
        />
      </Routes>
      <FloatingContactButton onClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Footer />
    </Router>
  )
}

export default App
