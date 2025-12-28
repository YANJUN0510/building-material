import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const IntroSlider = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const categories = [
    {
      id: 1,
      title: "Mesh",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      link: "/collections"
    },
    {
      id: 2,
      title: "Metal Facades",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1740&auto=format&fit=crop",
      link: "/collections"
    },
    {
      id: 3,
      title: "Cladding Systems",
      image: "https://plus.unsplash.com/premium_photo-1673602573826-222167644988?q=80&w=2070&auto=format&fit=crop",
      link: "/collections"
    },
    {
      id: 4,
      title: "Interior Finishes",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      link: "/collections"
    },
    {
      id: 5,
      title: "Custom Fabrication",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      link: "/collections"
    }
  ];

  useEffect(() => {
    if (isPaused) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        if (scrollContainer.scrollLeft >= maxScrollLeft - 5) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320; // Card width + gap
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="intro-slider-section" id="intro">
      <div className="intro-container">
        {/* Left Side: Text Introduction */}
        <div className="intro-text">
          <h2 className="intro-title">
            Crafting <span className="metallic-text">Excellence</span>
          </h2>
          <p className="intro-description">
            We specialize in high-end architectural metal systems that redefine modern facades. 
            From sleek aluminium battens to complex custom fabrications, our products combine 
            aesthetic beauty with structural integrity.
          </p>
          <Link to="/collections" className="intro-link">
            Explore All Products <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right Side: Slider */}
        <div 
            className="intro-slider-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
          <div className="intro-slider-container">
            <button className="slider-nav-btn left" onClick={() => scroll('left')} aria-label="Scroll left">
                <ArrowLeft size={24} />
            </button>
            
            <div className="intro-slider-track" ref={scrollRef}>
                {categories.map((cat, index) => (
                    <motion.div 
                        key={cat.id} 
                        className="intro-slider-card"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="intro-card-image-wrapper">
                            <img src={cat.image} alt={cat.title} className="intro-slider-img" />
                        </div>
                        <div className="intro-slider-overlay">
                            <h3>{cat.title}</h3>
                        </div>
                        <Link to={cat.link} className="intro-slider-link-overlay"></Link>
                    </motion.div>
                ))}
            </div>

            <button className="slider-nav-btn right" onClick={() => scroll('right')} aria-label="Scroll right">
                <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSlider;
