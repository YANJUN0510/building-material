import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = ({ onContactClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`navbar fixed ${isMobileMenuOpen ? 'mobile-open' : ''}`}
    >
      <Link to="/" className="logo">
        <img src="/logo.png" alt="Logo" className="nav-logo-img" />
        <span className="nav-logo-text">Building Material Warehouse</span>
      </Link>

      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
        type="button"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/collections">Collections</Link>
        <Link to="/philosophy">Philosophy</Link>

        <SignedIn>
          <Link to="/my-account">My Account</Link>
        </SignedIn>

        <SignedOut>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => {
              navigate('/sign-in', { state: { backgroundLocation: location } });
              setIsMobileMenuOpen(false);
            }}
          >
            Login
          </button>
        </SignedOut>

        {onContactClick && (
          <button
            type="button"
            className="nav-contact-btn"
            onClick={() => {
              onContactClick();
              setIsMobileMenuOpen(false);
            }}
          >
            Contact Us
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
