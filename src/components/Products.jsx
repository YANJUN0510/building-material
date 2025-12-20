import React from 'react';

const Products = () => {
  return (
    <section id="products" className="products">
      <div className="products-header">
        <h2 className="section-title">Our <span className="metallic-text">Collections</span></h2>
        <p style={{color: '#666', marginTop: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem'}}>Engineered for excellence. Designed for impact.</p>
      </div>
      <div className="products-grid">
        <div className="product-card">
          <div className="product-img">
            <img src="https://plus.unsplash.com/premium_photo-1742461208369-b94967c4a794?q=80&w=1740&auto=format&fit=crop" alt="Aluminium Batten" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div className="product-info">
            <h3 className="product-title">Aluminium Batten</h3>
            <p className="product-desc">Sleek, linear profiles for modern depth.</p>
          </div>
        </div>
        <div className="product-card">
          <div className="product-img">
            <img src="https://images.unsplash.com/photo-1574848296471-28f79a036f79?q=80&w=1200&auto=format&fit=crop" alt="Facade Cladding" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div className="product-info">
            <h3 className="product-title">Facade Cladding</h3>
            <p className="product-desc">Protective skins with architectural elegance.</p>
          </div>
        </div>
        <div className="product-card">
          <div className="product-img">
            <img src="https://plus.unsplash.com/premium_photo-1676035241734-d21220c940af?q=80&w=1740&auto=format&fit=crop" alt="Louver Systems" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div className="product-info">
            <h3 className="product-title">Louver Systems</h3>
            <p className="product-desc">Light control meets structural beauty.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
