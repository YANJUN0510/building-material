import React, { useState, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import './CallButton.css';

const CallButton = () => {
  const [showModal, setShowModal] = useState(false);
  const phoneNumber = '+61348285516';

  const handleClick = (e) => {
    // Always show the modal on both mobile and desktop
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <div className="floating-call-container">
        <a 
          href={`tel:${phoneNumber}`} 
          className="floating-call-btn"
          onClick={handleClick}
          title="Call for AI Support"
        >
          <Phone size={24} />
          <span className="pulse-ring"></span>
        </a>
      </div>

      {showModal && (
        <div className="call-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="call-modal-content" onClick={e => e.stopPropagation()}>
            <button className="call-modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <div className="call-modal-body">
              <div className="call-icon-circle">
                <Phone size={32} />
              </div>
              <h3 className="call-modal-title">AI Consulting Support</h3>
              <p className="call-modal-text">Call our AI agent for immediate assistance and technical consulting:</p>
              <a href={`tel:${phoneNumber}`} className="call-number-link">
                +61 3 4828 5516
              </a>
              <p className="call-note">Call +61 3 4828 5516 to get AI-powered answers and project consulting.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallButton;

