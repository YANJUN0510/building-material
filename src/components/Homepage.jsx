import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Homepage = () => {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const categories = [
    {
      title: "Metal Facades",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      link: "#facades"
    },
    {
      title: "Cladding Systems",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1740&auto=format&fit=crop",
      link: "#cladding"
    },
    {
      title: "Interior Finishes",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      link: "#interior"
    },
    {
      title: "Custom Fabrication",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      link: "#custom"
    },
    {
      title: "Architectural Mesh",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop",
      link: "#mesh"
    }
  ];
  
  // Double the categories to ensure smooth infinite scroll
  const infiniteCategories = [...categories, ...categories, ...categories];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 400; // 每次滑动的距离
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let animationFrameId;

    // Initialize scroll position ONLY ONCE when component mounts
    // Using a simple flag on the DOM element itself or just running it once
    if (scrollContainer && !scrollContainer.hasInitialized) {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
        scrollContainer.hasInitialized = true;
    }

    const autoScroll = () => {
      if (!isPaused && scrollContainer) {
        // Check for loop reset
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 3) * 2) {
            scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
        } else if (scrollContainer.scrollLeft <= 0) {
             // Handle manual scroll to extreme left
             scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
        } else {
             scrollContainer.scrollLeft += 1; 
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);


  return (
    <section className="homepage-collections">
      {/* Feature Section - Moved to Top */}
      <div className="feature-section">
        <div className="feature-content">
          <h2 className="feature-title">Architectural Solutions</h2>
          <p className="feature-text">
            Explore our comprehensive range of architectural metal systems designed to elevate modern construction. 
            From bespoke facades to precision-engineered cladding, we deliver excellence in every detail.
          </p>
          <a href="#solutions" className="feature-btn">View All Solutions</a>
        </div>
        <div className="feature-image">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1740&auto=format&fit=crop" alt="Architectural Solutions" />
        </div>
      </div>

      {/* Section Header for Transition */}
      <div className="homepage-header animate-fade-up">
        <span className="section-subtitle">Discover Our Range</span>
        <h2 className="section-title">Product Categories</h2>
      </div>

      <div className="homepage-grid">
        {/* Carousel Layout */}
        <div 
            className="carousel-container" 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
          <button className="carousel-btn left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
          
          <div className="carousel-track" ref={scrollContainerRef}>
            {infiniteCategories.map((cat, index) => (
              <div key={index} className="carousel-item">
                <div className="carousel-img-wrapper">
                  <img src={cat.image} alt={cat.title} className="carousel-img" />
                  <div className="carousel-overlay"></div>
                </div>
                <div className="carousel-content">
                  <h3 className="carousel-title">{cat.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-btn right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Section - Full Width Banners */}
        <div className="banner-grid">
          <div className="banner-item">
            <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" alt="Sustainable Metals" />
            <div className="banner-content">
              <h3>Sustainable Metals</h3>
              <a href="#sustainable">Learn More</a>
            </div>
          </div>
          <div className="banner-item">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop" alt="Innovation Lab" />
            <div className="banner-content">
              <h3>Innovation Lab</h3>
              <a href="#innovation">Discover</a>
            </div>
          </div>
        </div>
        
        {/* Design Philosophy Section */}
        <div className="design-philosophy">
            <div className="dp-image">
                <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1674&auto=format&fit=crop" alt="Design Philosophy" />
            </div>
            <div className="dp-content">
                <h3>Elevating Design</h3>
                <p>
                    Work one-on-one with our professional designers to visualize a quick update or a complete remodel.
                    We bring your vision to life with precision and artistry.
                </p>
                <a href="#design" className="dp-btn">Start Your Project</a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
