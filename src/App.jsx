import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PhilosophyPage from './pages/Philosophy';
import Collections from './pages/Collections';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="dynamic-bg"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/philosophy" element={<PhilosophyPage />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
