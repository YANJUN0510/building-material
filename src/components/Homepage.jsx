import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES_API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-material-categories';
const PRODUCTS_API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-materials';

const Homepage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);

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
          // Note: Matching logic depends on exact string match between cat.category and product.category
          const categoryProducts = products.filter(p => p.category === cat.category);
          
          return {
            id: cat.id,
            title: cat.category,
            description: cat.description,
            bgImage: cat.image,
            products: categoryProducts.slice(0, 5).map(p => ({
              name: p.name || p.series, // Fallback to series if name is missing
              category: p.category,
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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const currentSlideData = slides[activeSlide];

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="hero-slider-section" id="collections">
      {/* Category Menu */}
      <div className="category-menu-container">
        <h2 className="menu-title">Our Collections</h2>
        <div className="category-menu">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`category-menu-item ${index === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            >
              {slide.title}
            </button>
          ))}
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
                    <Link 
                      to="/collections" 
                      key={idx} 
                      className="mini-product-card animate-card-up"
                      style={{ animationDelay: `${idx * 0.1 + 0.3}s` }}
                    >
                        <div className="card-img">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="card-info">
                            <h4>{product.name}</h4>
                            <span>{product.category}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="slider-controls">
                <button className="control-btn" onClick={() => scrollSlider('left')}><ChevronLeft size={20}/></button>
                <button className="control-btn" onClick={() => scrollSlider('right')}><ChevronRight size={20}/></button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
