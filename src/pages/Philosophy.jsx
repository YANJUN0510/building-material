import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import './Philosophy.css';

const AnimatedText = ({ text, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <span ref={ref} style={{ display: 'block', overflow: 'hidden' }}>
      <motion.span
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay }}
        style={{ display: 'block' }}
      >
        {text}
      </motion.span>
    </span>
  );
};

const PhilosophyPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="philosophy-page">
      
      {/* Hero Section */}
      <div className="ph-hero">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="ph-hero-bg"
        >
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Abstract Architecture" 
            className="ph-hero-img"
          />
          <div className="ph-hero-overlay" />
        </motion.div>
        
        <div className="ph-hero-content">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="ph-title"
          >
            PHILOSOPHY
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="ph-subtitle"
          >
            Beyond Materiality
          </motion.p>
        </div>
      </div>

      {/* Manifesto Section */}
      <section className="ph-manifesto">
        <div className="ph-manifesto-container">
          <h2 className="ph-manifesto-title">
            <AnimatedText text="We believe in the" />
            <AnimatedText text="silent power of" delay={0.1} />
            <AnimatedText text="precision." delay={0.2} />
          </h2>
          <div className="ph-manifesto-grid">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="ph-text"
            >
              Architecture is an act of optimism. It is the physical manifestation of a future we wish to create. Our role is to provide the skin, the shield, and the statement of that future.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="ph-text"
            >
              Every panel we fabricate, every joint we engineer, is a testament to the unyielding pursuit of perfection. We don't just cover buildings; we articulate them.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Principles Section - Horizontal / Grid */}
      <section className="ph-principles">
        <div className="ph-section-header">
          <h3 className="ph-section-title">OUR PRINCIPLES</h3>
        </div>
        
        <div className="ph-grid-3">
          {[
            {
              title: "Innovation",
              desc: "Pushing the boundaries of what metal can do. We experiment with form, finish, and function.",
              img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop"
            },
            {
              title: "Sustainability",
              desc: "Responsible sourcing and enduring materials. We build for generations, not just trends.",
              img: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop"
            },
            {
              title: "Craftsmanship",
              desc: "The human touch in an industrial world. Precision engineering meets artisanal dedication.",
              img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="ph-card"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="ph-card-img"
              />
              <div className="ph-card-content">
                <h4 className="ph-card-title">{item.title}</h4>
                <p className="ph-card-desc">
                  {item.desc}
                </p>
                <div className="ph-card-line" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="ph-quote-section">
        <div className="ph-big-text">
          FUTURE
        </div>
        <div className="ph-quote-content">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="ph-quote">
              "We are not just shaping metal; we are shaping the skyline, one reflection at a time."
            </p>
            <div className="ph-divider" />
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default PhilosophyPage;
