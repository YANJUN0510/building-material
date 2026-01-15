import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

const CATEGORIES_API_URL = 'https://bmw-backend-production.up.railway.app/api/building-material-categories';

const IntroSlider = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Duplicate categories for seamless loop
  // Only duplicate if we have at least 2 categories for seamless effect
  // If less than 2, we can't create a seamless loop, so just use original
  const duplicatedCategories = categories.length >= 2 
    ? [...categories, ...categories] 
    : categories;

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
            <div className={`intro-slider-track ${categories.length >= 2 ? 'animate-marquee' : ''}`}>
                {duplicatedCategories.map((cat, index) => {
                    // Generate unique key: use category ID with duplicate indicator
                    // For the second set, add offset to ensure uniqueness
                    const isDuplicate = index >= categories.length;
                    const uniqueKey = `${cat.id ?? `cat-${index % categories.length}`}-${isDuplicate ? 'dup' : 'orig'}-${index}`;
                    
                    return (
                    <div 
                        key={uniqueKey}
                        className="intro-slider-card"
                    >
                        <div className="intro-card-image-wrapper">
                            <img src={cat.image} alt={cat.title} className="intro-slider-img" />
                        </div>
                        <div className="intro-slider-overlay">
                            <h3>{cat.title}</h3>
                        </div>
                        <Link to={cat.link} className="intro-slider-link-overlay"></Link>
                    </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSlider;
