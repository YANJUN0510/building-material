import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <p className="hero-subtitle animate-fade-up" style={{animationDelay: '0.2s', opacity: 0}}>Architectural Metal Systems</p>
        <h1 className="hero-title">
          <span className="metallic-text animate-fade-up" style={{animationDelay: '0.4s', opacity: 0}}>Beyond</span>
          <div className="animate-fade-up" style={{animationDelay: '0.6s', opacity: 0}}>Structure</div>
          <span className="animate-fade-up" style={{animationDelay: '0.8s', opacity: 0}}>Redefining Facades</span>
        </h1>
        <a href="#contact" className="btn animate-fade-up" style={{animationDelay: '1s', opacity: 0}}>Inquire Now</a>
      </div>
    </section>
  );
};

export default Hero;
