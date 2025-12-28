import React from 'react';
import Hero from '../components/Hero';
import Homepage from '../components/Homepage';
import Philosophy from '../components/Philosophy';
import Sourcing from '../components/Sourcing';
import Products from '../components/Products';
import Showcase from '../components/Showcase';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Homepage />
      {/* 
          Hidden sections as requested by user.
          - Philosophy section ("The Art of Precision")
          - Sourcing section
          - Products section
          - Showcase section ("Commercial", "Residential", etc.)
      */}
      {/* <Philosophy /> */}
      {/* <Sourcing /> */}
      {/* <Products /> */}
      {/* <Showcase /> */}
      <Contact />
    </>
  );
};

export default Home;
