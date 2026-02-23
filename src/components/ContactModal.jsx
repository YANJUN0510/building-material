import React, { useState } from 'react';
import { X, Mail, CheckCircle, Phone } from 'lucide-react';
// import ElevenLabsWidget from './ElevenLabsWidget'; // Hidden as requested

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin))
    .replace(/\/+$/, '');
const MESSAGE_API_URL = `${API_BASE}/api/messages`;

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const phoneNumber = '+61348285516';

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formPayload = new FormData();
      formPayload.append('email', formData.email);
      formPayload.append('phone', formData.phone);
      formPayload.append('subject', formData.subject);
      formPayload.append('message', formData.message);

      // Append attachments
      attachments.forEach(file => {
        formPayload.append('attachments', file);
      });

      const response = await fetch(MESSAGE_API_URL, {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitSuccess(true);
      setFormData({ email: '', phone: '', subject: '', message: '' });
      setAttachments([]);

      // Close modal after 2 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              
              <div className="contact-method-item contact-phone-item" onClick={() => setShowCallModal(true)}>
                <div className="method-icon phone-icon">
                  <Phone size={20} />
                </div>
                <div className="method-details">
                  <span className="method-label">Call us</span>
                  <span className="method-value phone-number">+61 3 4828 5516</span>
                </div>
              </div>

              {/* ElevenLabsWidget hidden as requested */}
              {/* <div className="contact-ai-widget">
                <div className="contact-ai-title">AI Agent</div>
                <div className="contact-ai-subtitle">Chat with our AI agent for quick help.</div>
                <div className="contact-ai-embed">
                  <ElevenLabsWidget />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-modal-form">
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          
          <h3 className="form-header">SEND US A MESSAGE</h3>
          
          {submitSuccess ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '400px',
              gap: '1rem'
            }}>
              <CheckCircle size={64} color="#22c55e" />
              <h3 style={{ color: '#22c55e', fontSize: '1.5rem', margin: 0 }}>Message Sent Successfully!</h3>
              <p style={{ color: '#666', textAlign: 'center' }}>Thank you for contacting us. We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="you@company.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+61 400 000 000" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="How can we help?" 
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  name="message"
                  rows="4" 
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Attachments (Optional)</label>
                <div className="file-upload-area">
                  <div className="upload-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <span>Click to upload images</span>
                    {attachments.length > 0 && <span style={{ fontSize: '12px', color: '#666' }}>({attachments.length} file(s) selected)</span>}
                  </div>
                  <input 
                    type="file" 
                    className="file-input" 
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {error && <div style={{ color: 'red', fontSize: '14px', marginBottom: '1rem' }}>{error}</div>}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Call Modal - Reused from CallButton */}
      {showCallModal && (
        <div className="call-modal-overlay" onClick={() => setShowCallModal(false)}>
          <div className="call-modal-content" onClick={e => e.stopPropagation()}>
            <button className="call-modal-close" onClick={() => setShowCallModal(false)}>
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
    </div>
  );
};

export default ContactModal;
