import React from 'react';

const Showcase = () => {
  return (
    <section id="showcase" className="showcase">
      <div className="showcase-item" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="shimmer-line"></div>
        <div className="showcase-content">
          <h3 className="showcase-title">Commercial</h3>
          <span className="showcase-subtitle">High-rise Facade Integration</span>
        </div>
      </div>
      <div className="showcase-item" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="shimmer-line" style={{animationDelay: '1s'}}></div>
        <div className="showcase-content">
          <h3 className="showcase-title">Residential</h3>
          <span className="showcase-subtitle">Luxury Villa Exterior Solutions</span>
        </div>
      </div>
      <div className="showcase-item" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="shimmer-line" style={{animationDelay: '2s'}}></div>
        <div className="showcase-content">
          <h3 className="showcase-title">Interior</h3>
          <span className="showcase-subtitle">Feature Walls & Ceilings</span>
        </div>
      </div>
      <div className="showcase-item" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="shimmer-line" style={{animationDelay: '3s'}}></div>
        <div className="showcase-content">
          <h3 className="showcase-title">Bespoke</h3>
          <span className="showcase-subtitle">Custom Fabricated Art Installations</span>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
