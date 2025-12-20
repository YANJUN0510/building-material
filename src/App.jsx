import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Products from './components/Products';
import Showcase from './components/Showcase';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div className="dynamic-bg"></div>
      <Navbar />
      <Hero />
      <Philosophy />
      <Products />
      <Showcase />
      <Contact />
      <Footer />
    </>
  )
}

export default App
