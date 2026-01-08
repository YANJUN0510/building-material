import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = ({ onContactClick }) => {
  const [renderState, setRenderState] = useState({ isFixed: false, isHidden: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const lastScrollY = useRef(0);
  const currentState = useRef({ isFixed: false, isHidden: false });

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 250;
      const isDown = currentScrollY > lastScrollY.current;

      let nextIsFixed = currentState.current.isFixed;
      let nextIsHidden = currentState.current.isHidden;

      if (currentScrollY > threshold) {
        if (isDown) {
          if (currentState.current.isFixed) {
            nextIsHidden = true;
          } else {
            nextIsFixed = false;
            nextIsHidden = false;
          }
        } else {
          nextIsFixed = true;
          nextIsHidden = false;
        }
      } else {
        nextIsFixed = false;
        nextIsHidden = false;
      }

      if (nextIsFixed !== currentState.current.isFixed || nextIsHidden !== currentState.current.isHidden) {
        currentState.current = { isFixed: nextIsFixed, isHidden: nextIsHidden };
        setRenderState({ isFixed: nextIsFixed, isHidden: nextIsHidden });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { isFixed, isHidden } = renderState;

  return (
    <nav
      className={`navbar ${isFixed ? 'fixed' : 'absolute'} ${isHidden ? 'hidden' : ''} ${
        isMobileMenuOpen ? 'mobile-open' : ''
      }`}
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
