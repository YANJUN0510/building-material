import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingContactButton({ isOpen, onClick }) {
  if (isOpen) return null;

  return (
    <div className="floating-contact-container">
      <button
        className="floating-contact-btn"
        onClick={onClick}
        type="button"
        aria-label="Open chat"
      >
        <MessageCircle size={22} />
        <span className="floating-contact-pulse" />
      </button>
    </div>
  );
}
