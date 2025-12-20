import React from 'react';

const Philosophy = () => {
  return (
    <section id="philosophy" className="philosophy">
      <div className="philosophy-img">
        <img 
          src="https://plus.unsplash.com/premium_photo-1681400052502-1e6b926b6822?q=80&w=1632&auto=format&fit=crop" 
          alt="Architectural Metal Detail" 
          style={{width: '100%', height: '100%', objectFit: 'cover'}} 
        />
      </div>
      <div className="philosophy-text">
        <h2 className="section-title">The Art of <span className="metallic-text">Precision</span></h2>
        <p>We believe that architecture is not just about shelter, but about making a statement. Our vision is to transform ordinary structures into landmarks through the power of premium metal cladding and batten systems.</p>
        <p>Leveraging global design trends and precision engineering, we offer a one-stop solution for those who refuse to compromise on quality. From residential masterpieces to commercial icons, we bring the boldest visions to life.</p>
      </div>
    </section>
  );
};

export default Philosophy;
