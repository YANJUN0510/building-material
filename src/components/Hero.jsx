import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      {/* Background video */}
      <video 
        className="hero-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/video/homepage-video.mp4" type="video/mp4" />
      </video>
      
      {/* Video overlay */}
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <p className="hero-subtitle animate-fade-up" style={{animationDelay: '0.2s', opacity: 0}}>Wholesale Building Materials · Direct Project Supply · One-Stop Procurement</p>
        <h1 className="hero-title">
          <span className="metallic-text animate-fade-up" style={{animationDelay: '0.4s', opacity: 0}}>Building Material Warehouse</span>
          <div className="animate-fade-up" style={{animationDelay: '0.6s', opacity: 0}}>Building Materials</div>
          <span className="animate-fade-up" style={{animationDelay: '0.8s', opacity: 0}}>Reliable Supply for Projects of Any Scale</span>
        </h1>
      </div>

      {/* Scroll Down Indicator */}
      <a href="#intro" className="scroll-down animate-bounce" onClick={(e) => {
        e.preventDefault();
        document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
      }}>
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrow-span">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </a>
    </section>
  );
};

export default Hero;
