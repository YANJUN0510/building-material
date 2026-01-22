import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      {/* Background video */}
      <video 
        className="hero-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/video/homepage-video.mp4" type="video/mp4" />
      </video>
      
      {/* Video overlay */}
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-subtitle"
        >
          Premier Wholesale & Project Supply
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="hero-title"
        >
          <span className="metallic-text">Building Material</span>
          <div>Warehouse</div>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="hero-tagline"
        >
          Reliable Solutions. Any Scale.
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="hero-cta-group"
        >
          <a href="/collections" className="btn">View Collections</a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
