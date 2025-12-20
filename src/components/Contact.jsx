import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="contact">
      <h2 className="section-title">Start Your <span className="metallic-text">Legacy</span></h2>
      <p style={{color: '#666', marginTop: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem'}}>Consult with our design experts for your next project.</p>
      
      <form className="contact-form">
        <input type="text" placeholder="NAME" required />
        <input type="email" placeholder="EMAIL ADDRESS" required />
        <input type="text" placeholder="PROJECT TYPE" required />
        <textarea rows="5" placeholder="TELL US ABOUT YOUR VISION"></textarea>
        <button type="submit">Submit Inquiry</button>
      </form>
    </section>
  );
};

export default Contact;
