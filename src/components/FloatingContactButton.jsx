import React from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingContactButton({ isOpen, onClick }) {
  return (
    <div className="floating-contact-container">
      <button
        className="floating-contact-btn"
        onClick={onClick}
        type="button"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && <span className="floating-contact-pulse" />}
      </button>
    </div>
  );
}

