import React from 'react';

const Showcase = () => {
  return (
    <section id="showcase" className="showcase">
      <div className="showcase-item" style={{backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1742457608557-762308aa7ebf?q=80&w=1740&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="shimmer-line"></div>
        <div className="showcase-content">
          <h3 className="showcase-title">Commercial</h3>
          <span className="showcase-subtitle">High-rise Facade Integration</span>
        </div>
      </div>
      <div className="showcase-item" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=1600&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="shimmer-line" style={{animationDelay: '1s'}}></div>
        <div className="showcase-content">
          <h3 className="showcase-title">Residential</h3>
          <span className="showcase-subtitle">Luxury Villa Exterior Solutions</span>
        </div>
      </div>
      <div className="showcase-item" style={{backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1723795479089-718ec4a9bd10?q=80&w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="shimmer-line" style={{animationDelay: '2s'}}></div>
        <div className="showcase-content">
          <h3 className="showcase-title">Interior</h3>
          <span className="showcase-subtitle">Feature Walls & Ceilings</span>
        </div>
      </div>
      <div className="showcase-item" style={{backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1725975475732-2466c2fb082e?q=80&w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
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
