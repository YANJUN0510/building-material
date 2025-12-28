import React from 'react';
import { X, Mail } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal-container">
        {/* Left Side: Info */}
        <div className="contact-modal-info">
          <div className="contact-info-content">
            <h2 className="contact-title">GET IN TOUCH</h2>
            <p className="contact-desc">
              We'd love to hear from you. Our team is always here to chat.
            </p>

            <div className="contact-methods">
              <div className="contact-method-item">
                <div className="method-icon">
                  <Mail size={20} />
                </div>
                <div className="method-details">
                  <span className="method-label">Chat to us</span>
                  <a href="mailto:sales@quantummax.ai" className="method-value">sales@quantummax.ai</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-modal-form">
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          
          <h3 className="form-header">SEND US A MESSAGE</h3>
          
          <form className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="you@company.com" required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="+61 400 000 000" />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="How can we help?" />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea rows="4" placeholder="Tell us about your project..."></textarea>
            </div>

            <div className="form-group">
              <label>Attachments (Optional)</label>
              <div className="file-upload-area">
                <div className="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>Click to upload images</span>
                </div>
                <input type="file" className="file-input" />
              </div>
            </div>

            <button type="submit" className="submit-btn">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
