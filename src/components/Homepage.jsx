import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES_API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-material-categories';
const PRODUCTS_API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-materials';

const Homepage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const MENU_SIZE = 3;
  const navigate = useNavigate();
  const [menuAnimDirection, setMenuAnimDirection] = useState(null);
  const [menuAnimKey, setMenuAnimKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(CATEGORIES_API_URL),
          fetch(PRODUCTS_API_URL)
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        const categories = categoriesData.status === 'success' ? categoriesData.data : (Array.isArray(categoriesData) ? categoriesData : []);
        const products = productsData.status === 'success' ? productsData.data : (Array.isArray(productsData) ? productsData : []);

        // Map categories to slides format and attach relevant products
        const mappedSlides = categories.map(cat => {
          // Filter products that belong to this category
          let categoryProducts = products.filter(p => p.category === cat.category);
          
          // Special filter for Aluminium Building Products to only show Aluminium Ceiling Baffle series
          if (cat.category === 'Aluminium Building Products') {
            categoryProducts = categoryProducts.filter(p => p.series === 'Aluminium Ceiling Baffle');
          }
          
          // Randomize products for this category
          const shuffledProducts = [...categoryProducts].sort(() => 0.5 - Math.random());
          
          return {
            id: cat.id,
            title: cat.category,
            description: cat.description,
            bgImage: cat.image,
            products: shuffledProducts.slice(0, 5).map(p => ({
              code: p.code, // Include code for navigation
              name: p.name || p.series, // Fallback to series if name is missing
              category: p.category,
              series: p.series,
              description: p.description,
              specs: p.specs,
              price: p.price,
              image: p.image || (p.images && p.images[0]) || cat.image // Fallback image
            }))
          };
        });

        setSlides(mappedSlides);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setActiveProductIndex(0);
    // Reset scroll position to the first product when changing category
    const container = sliderRef.current;
    if (container) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeSlide]);

  // Auto-play functionality for products
  useEffect(() => {
    if (slides.length === 0 || !slides[activeSlide]) return;
    const currentSlide = slides[activeSlide];
    if (!currentSlide.products || currentSlide.products.length === 0) return;

    const interval = setInterval(() => {
      setActiveProductIndex(prev => {
        const nextIndex = (prev + 1) % currentSlide.products.length;
        // Scroll within the container only (not the whole page)
        const container = sliderRef.current;
        const target = container?.children?.[nextIndex];
        if (container && target) {
          const scrollLeft = target.offsetLeft - container.offsetLeft;
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
        return nextIndex;
      });
    }, 3000); // Auto-play every 3 seconds

    return () => clearInterval(interval);
  }, [slides, activeSlide]);

  useEffect(() => {
    if (!menuAnimDirection) return;
    const timeout = setTimeout(() => setMenuAnimDirection(null), 460);
    return () => clearTimeout(timeout);
  }, [menuAnimDirection]);

  const currentSlideData = slides[activeSlide];
  const visibleMenuSlides = useMemo(() => {
    if (slides.length === 0) return [];
    if (slides.length < MENU_SIZE) {
      return slides.map((slide, index) => ({ slide, index }));
    }
    const prevIndex = (activeSlide - 1 + slides.length) % slides.length;
    const nextIndex = (activeSlide + 1) % slides.length;
    return [
      { slide: slides[prevIndex], index: prevIndex },
      { slide: slides[activeSlide], index: activeSlide },
      { slide: slides[nextIndex], index: nextIndex }
    ];
  }, [slides, activeSlide]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const scrollToProduct = (index) => {
    if (!currentSlideData.products.length) return;
    const clampedIndex = Math.max(0, Math.min(index, currentSlideData.products.length - 1));
    setActiveProductIndex(clampedIndex);
    // Scroll within the container only (not the whole page)
    const container = sliderRef.current;
    const target = container?.children?.[clampedIndex];
    if (container && target) {
      const scrollLeft = target.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const handleProductClick = (product) => {
    // Navigate to collections page with product info
    navigate('/collections', { state: { productCode: product.code } });
  };

  const handleMenuNav = (direction) => {
    if (slides.length <= MENU_SIZE) return;
    const delta = direction === 'left' ? -1 : 1;
    setMenuAnimDirection(direction);
    setMenuAnimKey((prev) => prev + 1);
    setActiveSlide((prev) => (prev + delta + slides.length) % slides.length);
  };

  return (
    <section className="hero-slider-section" id="collections">
      {/* Category Menu */}
      <div className="category-menu-container">
        <h2 className="menu-title">Our Collections</h2>
          <div className="category-menu-controls">
          <button
            className="category-menu-nav-btn"
            onClick={() => handleMenuNav('left')}
            aria-label="Previous categories"
            disabled={slides.length <= MENU_SIZE}
          >
            <ChevronLeft size={18} />
          </button>
          <div
            key={menuAnimKey}
            className={`category-menu${menuAnimDirection ? ` is-animating-${menuAnimDirection}` : ''}`}
          >
            {visibleMenuSlides.map(({ slide, index }) => {
              return (
                <button
                  key={slide.id}
                  className={`category-menu-item ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                >
                  {slide.title}
                </button>
              );
            })}
          </div>
          <button
            className="category-menu-nav-btn"
            onClick={() => handleMenuNav('right')}
            aria-label="Next categories"
            disabled={slides.length <= MENU_SIZE}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Background Image with Overlay */}
      <div className="hero-bg" key={currentSlideData.id}>
        <img src={currentSlideData.bgImage} alt={currentSlideData.title} className="animate-fade-in" />
        <div className="hero-overlay"></div>
      </div>

      {/* Vertical Navigation (Left) */}
      <div className="vertical-nav">
        <div className="nav-line"></div>
        {slides.map((slide, index) => (
          <button 
            key={slide.id} 
            className={`nav-dot ${index === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === activeSlide && <span className="nav-number">0{index + 1}</span>}
          </button>
        ))}
        <div className="nav-line"></div>
      </div>

      <div className="hero-content-container">
        {/* Left Side: Text Info */}
        <div className="hero-text-content animate-slide-up" key={`text-${currentSlideData.id}`}>
          <h1 className="hero-title">{currentSlideData.title}</h1>
          <p className="hero-description">{currentSlideData.description}</p>
        </div>

        {/* Right Side: Product Slider */}
        <div className="hero-product-slider animate-slide-in-right" key={`slider-${currentSlideData.id}`}>
            <div className="product-cards-wrapper" ref={sliderRef}>
                {currentSlideData.products.map((product, idx) => (
                    <div 
                      key={idx} 
                      className="mini-product-card animate-card-up"
                      style={{ animationDelay: `${idx * 0.1 + 0.3}s` }}
                      onClick={() => handleProductClick(product)}
                    >
                        <div className="card-img">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="card-info">
                            <h4>{product.name}</h4>
                            <span>{product.category}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="slider-controls">
                <button
                  className="control-btn"
                  onClick={() => scrollToProduct(activeProductIndex - 1)}
                  aria-label="Previous product"
                  disabled={activeProductIndex === 0}
                >
                  <ChevronLeft size={20}/>
                </button>
                <button
                  className="control-btn"
                  onClick={() => scrollToProduct(activeProductIndex + 1)}
                  aria-label="Next product"
                  disabled={activeProductIndex === currentSlideData.products.length - 1}
                >
                  <ChevronRight size={20}/>
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
