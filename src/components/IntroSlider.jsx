import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES_API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-material-categories';

const IntroSlider = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef(null);
  const loopRef = useRef({ setWidth: 0 });

  const repeatedCategories = useMemo(() => {
    if (categories.length === 0) return [];
    return [...categories, ...categories, ...categories];
  }, [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORIES_API_URL);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        const cats = data.status === 'success' ? data.data : (Array.isArray(data) ? data : []);
        setCategories(cats.map(cat => ({
          id: cat.id,
          title: cat.category,
          image: cat.image,
          link: '/collections',
        })));
      } catch (e) {
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const smoothScroll = (element, target, duration) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease in-out function
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;

        element.scrollLeft = start + change * ease;

        if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateScroll);
        } else {
            animationRef.current = null;
        }
    };

    animationRef.current = requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || repeatedCategories.length === 0) return;

    const updateSetWidth = () => {
      const width = scrollContainer.scrollWidth / 3;
      loopRef.current.setWidth = width;
      scrollContainer.scrollLeft = width;
    };

    updateSetWidth();
    window.addEventListener('resize', updateSetWidth);

    return () => {
      window.removeEventListener('resize', updateSetWidth);
    };
  }, [repeatedCategories]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || repeatedCategories.length === 0) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const setWidth = loopRef.current.setWidth;
        if (setWidth) {
          if (scrollContainer.scrollLeft <= setWidth * 0.5) {
            scrollContainer.scrollLeft += setWidth;
          } else if (scrollContainer.scrollLeft >= setWidth * 1.5) {
            scrollContainer.scrollLeft -= setWidth;
          }
        }
        ticking = false;
      });
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [repeatedCategories]);

  useEffect(() => {
    if (isPaused || repeatedCategories.length === 0) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      const nextScrollLeft = scrollContainer.scrollLeft + 320;
      smoothScroll(scrollContainer, nextScrollLeft, 1200);
    }, 4000);

    return () => {
      clearInterval(interval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, repeatedCategories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320; // Card width + gap
      const target = direction === 'left' 
        ? current.scrollLeft - scrollAmount 
        : current.scrollLeft + scrollAmount;
      
      smoothScroll(current, target, 800); // Slightly faster for user interaction
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-white text-black">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (categories.length === 0) return null;

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
                {repeatedCategories.map((cat, index) => (
                    <motion.div 
                        key={`${cat.id}-${index}`} 
                        className="intro-slider-card"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: (index % categories.length) * 0.1 }}
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
