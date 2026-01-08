import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES_API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-material-categories';

const IntroSlider = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef(null);

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

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const smoothScroll = (element, target, duration) => {
    cancelAnimation();

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
    if (!scrollContainer) return;

    const onPointerDown = () => cancelAnimation();

    scrollContainer.addEventListener('pointerdown', onPointerDown, { passive: true });
    scrollContainer.addEventListener('touchstart', onPointerDown, { passive: true });

    return () => {
      scrollContainer.removeEventListener('pointerdown', onPointerDown);
      scrollContainer.removeEventListener('touchstart', onPointerDown);
    };
  }, [categories.length]);

  // Auto-play removed - users control via buttons only

  const getCards = () => {
    const track = scrollRef.current;
    if (!track) return [];
    return Array.from(track.querySelectorAll('.intro-slider-card'));
  };

  const getSnapPaddingLeft = () => {
    const track = scrollRef.current;
    if (!track) return 0;
    const styles = window.getComputedStyle(track);
    const paddingLeft = Number.parseFloat(styles.paddingLeft || '0') || 0;
    return paddingLeft;
  };

  const getTargetScrollLeftForIndex = (index) => {
    const track = scrollRef.current;
    if (!track) return 0;

    const cards = getCards();
    if (cards.length === 0) return 0;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const paddingLeft = getSnapPaddingLeft();
    const card = cards[Math.max(0, Math.min(index, cards.length - 1))];
    const desired = card.offsetLeft - paddingLeft;

    return Math.max(0, Math.min(maxScrollLeft, desired));
  };

  const getNearestIndex = () => {
    const track = scrollRef.current;
    if (!track) return 0;

    const cards = getCards();
    if (cards.length === 0) return 0;

    const currentScrollLeft = track.scrollLeft;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < cards.length; i += 1) {
      const target = getTargetScrollLeftForIndex(i);
      const distance = Math.abs(currentScrollLeft - target);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }

    return bestIndex;
  };

  const scrollToIndex = (index) => {
    const track = scrollRef.current;
    if (!track) return;
    smoothScroll(track, getTargetScrollLeftForIndex(index), 600);
  };

  const getScrollStep = () => {
    const track = scrollRef.current;
    if (!track) return 300;

    const card = track.querySelector('.intro-slider-card');
    if (!card) return 300;

    const trackStyles = window.getComputedStyle(track);
    const gapValue = trackStyles.gap || trackStyles.columnGap || '0px';
    const gap = Number.parseFloat(gapValue) || 0;
    const width = card.getBoundingClientRect().width;

    return width + gap;
  };

  const scroll = (direction) => {
    if (!scrollRef.current || categories.length === 0) return;
    
    const step = getScrollStep();
    if (step <= 0) return;

    const currentIndex = getNearestIndex();
    const delta = direction === 'left' ? -1 : 1;
    const nextIndex = (currentIndex + delta + categories.length) % categories.length;
    scrollToIndex(nextIndex);
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
        <div className="intro-slider-wrapper">
          <div className="intro-slider-container">
            <button
              className="slider-nav-btn left"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              type="button"
            >
                <ArrowLeft size={24} />
            </button>
            
            <div className="intro-slider-track" ref={scrollRef}>
                {categories.map((cat, index) => (
                    <motion.div 
                        key={cat.id ?? index} 
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

            <button
              className="slider-nav-btn right"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              type="button"
            >
                <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSlider;
