import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingContactButton({ onClick }) {
  return (
    <div className="floating-contact-container">
      <button className="floating-contact-btn" onClick={onClick} type="button" aria-label="Contact us">
        <MessageCircle size={22} />
        <span className="floating-contact-pulse" />
      </button>
    </div>
  );
}

