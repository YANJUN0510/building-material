import React from 'react';

const Navbar = () => {
  return (
    <nav>
      <div className="logo">LUXE METAL</div>
      <div className="nav-links">
        <a href="#hero">Home</a>
        <a href="#philosophy">Philosophy</a>
        <a href="#products">Collections</a>
        <a href="#showcase">Projects</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
