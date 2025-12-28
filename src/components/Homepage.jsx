import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Aluminium Batten System",
      description: "Aluminium Batten is a sleek, durable cladding system for any building. With hundreds of customizable designs available—from standard profiles to bespoke configurations—our batten systems offer limitless creative possibilities.",
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      products: [
        { name: "Aluminium Batten", category: "Interior & Exterior", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" },
        { name: "Aluminum Ceiling", category: "Interior Decoration", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop" },
        { name: "Decorative Wall Panel", category: "Interior Decoration", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop" },
        { name: "Acoustic Panel", category: "Sound Proofing", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1740&auto=format&fit=crop" },
      ]
    },
    {
      id: 2,
      title: "Metal Facades",
      description: "Transform building exteriors with our premium metal facade solutions. Engineered for durability and aesthetic impact.",
      bgImage: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1740&auto=format&fit=crop",
      products: [
        { name: "Perforated Panel", category: "Facades", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" },
        { name: "Expanded Mesh", category: "Facades", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" },
        { name: "Solid Sheet", category: "Cladding", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop" },
      ]
    },
    {
      id: 3,
      title: "Custom Fabrication",
      description: "Bespoke architectural solutions tailored to your vision. From concept to installation, we bring complex designs to life.",
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      products: [
        { name: "Custom Screens", category: "Bespoke", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1674&auto=format&fit=crop" },
        { name: "Feature Walls", category: "Interior", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" },
      ]
    }
  ];

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
          <Link to="/contact" className="hero-cta-btn">
            Quick Quote
          </Link>
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
