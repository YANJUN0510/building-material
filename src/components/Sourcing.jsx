import React from 'react';

const Sourcing = () => {
  return (
    <section id="sourcing" className="sourcing">
      <div className="sourcing-header">
        <h2 className="section-title">Global <span className="metallic-text">Sourcing</span></h2>
        <p className="sourcing-subtitle">Connecting Australian Builders with Premier Chinese Manufacturers</p>
      </div>
      
      <div className="sourcing-grid">
        <div className="sourcing-card">
          <div className="card-icon">01</div>
          <h3>Direct Access</h3>
          <p>We bridge the gap between Australian projects and China's leading building material manufacturers, eliminating unnecessary middlemen.</p>
        </div>
        <div className="sourcing-card">
          <div className="card-icon">02</div>
          <h3>Quality Assurance</h3>
          <p>All products are rigorously vetted to meet or exceed Australian Standards (AS/NZS), ensuring compliance and peace of mind.</p>
        </div>
        <div className="sourcing-card">
          <div className="card-icon">03</div>
          <h3>Logistics Mastery</h3>
          <p>From factory floor to your building site, we handle the complexities of international shipping, customs, and delivery.</p>
        </div>
        <div className="sourcing-card">
          <div className="card-icon">04</div>
          <h3>Cost Efficiency</h3>
          <p>Leverage our network to access high-value materials at competitive prices, maximizing your project's budget without compromising quality.</p>
        </div>
      </div>
    </section>
  );
};

export default Sourcing;
