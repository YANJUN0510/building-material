import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, X, Loader2, Search } from 'lucide-react';
import './Collections.css';

const API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-materials';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        // Assuming API returns { status: "success", data: [...] }
        if (result.status === 'success' && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          // Fallback if structure is different (e.g. direct array)
          setProducts(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error("Error loading building materials:", err);
        setError("Unable to load collections. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract hierarchy: Category -> Series
  const hierarchy = useMemo(() => {
    const map = {};
    products.forEach(p => {
      if (!p.category) return;
      if (!map[p.category]) {
        map[p.category] = new Set();
      }
      if (p.series) {
        map[p.category].add(p.series);
      }
    });
    // Convert Sets to Arrays and sort
    const sortedMap = {};
    Object.keys(map).sort().forEach(key => {
      const seriesArray = Array.from(map[key]).sort();
      if (seriesArray.length > 0) {
        sortedMap[key] = seriesArray;
      }
    });
    return sortedMap;
  }, [products]);

  // Default to the first series of the first category
  const defaultSeries = useMemo(() => {
    const categories = Object.keys(hierarchy);
    if (categories.length === 0) return "";
    const firstCat = categories[0];
    return hierarchy[firstCat][0] || "";
  }, [hierarchy]);

  const [activeSeries, setActiveSeries] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Update activeSeries when data loads
  useEffect(() => {
    if (defaultSeries && !activeSeries) {
      setActiveSeries(defaultSeries);
    }
  }, [defaultSeries, activeSeries]);

  // Handle series selection (clears search)
  const handleSeriesClick = (series) => {
    setActiveSeries(series);
    setSearchQuery(""); // Clear search when navigating
  };

  // Filter products based on search query OR active series
  const filteredProducts = useMemo(() => {
    // 1. If searching, filter globally
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return products.filter(p => 
        (p.code && p.code.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    
    // 2. Otherwise, filter by active series
    if (!activeSeries) return [];
    return products.filter(p => p.series === activeSeries);
  }, [products, activeSeries, searchQuery]);

  if (isLoading) {
    return (
      <div className="collections-page-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading Collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collections-page-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="col-btn-black">Retry</button>
      </div>
    );
  }

  return (
    <div className="collections-page">
      {/* Header Section */}
      <section className="col-header">
        <div className="col-header-content">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="col-title"
          >
            Material <span className="metallic-text">Library</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="col-subtitle"
          >
            A curated selection of premium architectural materials.
          </motion.p>
        </div>
      </section>

      {/* Core Module: Selector & Grid */}
      <section className="col-core-module">
        <div className="col-layout">
          
          {/* Left Sidebar: Categories -> Series */}
          <div className="col-sidebar">
            
            {/* Search Input */}
            <div className="col-search-box">
              <Search className="col-search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search code, name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="col-search-input"
              />
              {searchQuery && (
                <button className="col-search-clear" onClick={() => setSearchQuery("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <h3 className="col-sidebar-title">Collections</h3>
            <div className="col-nav">
              {Object.entries(hierarchy).map(([category, seriesList]) => (
                <div key={category} className="col-nav-group">
                  <h4 className="col-nav-category">{category}</h4>
                  <div className="col-nav-items">
                    {seriesList.map((series) => (
                      <button 
                        key={series}
                        className={`col-nav-btn ${activeSeries === series && !searchQuery ? 'active' : ''}`}
                        onClick={() => handleSeriesClick(series)}
                      >
                        <span className="col-nav-text">{series}</span>
                        {activeSeries === series && !searchQuery && (
                          <motion.div 
                            layoutId={null}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: '100%' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="col-nav-indicator" 
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Download Catalog CTA */}
            <div className="col-catalog-cta">
              <Download size={20} />
              <span>Download Full Catalog (PDF)</span>
            </div>
          </div>

          {/* Right Content: Materials Grid */}
          <div className="col-content">
            <AnimatePresence mode='wait'>
              <motion.div
                key={searchQuery ? 'search-results' : (activeSeries || 'empty')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="col-grid-container"
              >
                {searchQuery ? (
                  <div className="col-category-header">
                    <h2>Search Results</h2>
                    <p>
                      Found {filteredProducts.length} items matching "{searchQuery}"
                    </p>
                  </div>
                ) : activeSeries ? (
                  <div className="col-category-header">
                    <h2>{activeSeries}</h2>
                    <p>Explore our range of {activeSeries.toLowerCase()} designed for modern architecture.</p>
                  </div>
                ) : (
                   <div className="col-no-selection">
                     <p>Select a collection to view materials.</p>
                   </div>
                )}

                <div className="col-grid">
                  {filteredProducts.map((item, index) => (
                    <motion.div 
                      key={item.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="col-item-card"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <div className="col-item-img-box">
                        <img src={item.image} alt={item.name} />
                        <div className="col-item-overlay">
                          <button className="col-view-btn">View Specs</button>
                        </div>
                      </div>
                      <div className="col-item-info">
                        <div className="col-item-meta">
                          <span className="col-item-code">{item.code}</span>
                        </div>
                        <h4 className="col-item-name">{item.name}</h4>
                        <p className="col-item-desc-short">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-no-results">
                      <p>No products found.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className="col-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              className="col-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="col-modal-close" onClick={() => setSelectedProduct(null)}>
                <X size={24} />
              </button>
              
              <div className="col-modal-grid">
                <div className="col-modal-image">
                   <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="col-modal-details">
                  <span className="col-tag">{selectedProduct.category} / {selectedProduct.series}</span>
                  <div className="col-modal-header-group">
                    <h2>{selectedProduct.name}</h2>
                    <span className="col-modal-code">{selectedProduct.code}</span>
                  </div>
                  
                  <p className="col-modal-desc">{selectedProduct.description}</p>
                  
                  <div className="col-modal-specs">
                    <h3>Specifications</h3>
                    <ul>
                      {/* Handle both object specs (from mock) and array specs (from API) */}
                      {Array.isArray(selectedProduct.specs) ? (
                         selectedProduct.specs.map((spec, idx) => (
                           <li key={idx}>
                             <span className="spec-key">{spec.label}:</span>
                             <span className="spec-val">{spec.value}</span>
                           </li>
                         ))
                      ) : (
                        selectedProduct.specs && Object.entries(selectedProduct.specs).map(([key, value]) => (
                          <li key={key}>
                            <span className="spec-key">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="spec-val">{value}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <div className="col-modal-actions">
                    <button className="col-btn-black">Inquire</button>
                    <button className="col-btn-outline" style={{ color: '#000', borderColor: '#000' }}>
                      Download Spec Sheet
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspiration / Featured Project Section */}
      <section className="col-inspiration">
        <div className="col-insp-container">
          <div className="col-insp-image">
             <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1974&auto=format&fit=crop" alt="Featured Architecture" />
          </div>
          <div className="col-insp-content">
            <span className="col-tag">Featured Application</span>
            <h2 className="col-insp-title">The Monolith</h2>
            <p className="col-insp-desc">
              See how our Weathered Zinc panels were utilized to create a seamless, monolithic facade for the Modern Art Museum in Copenhagen.
            </p>
            <button className="col-btn-outline">
              Explore Project <ArrowRight size={16} style={{marginLeft: '8px'}}/>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="col-cta">
        <div className="col-cta-content">
          <h2>Ready to specify?</h2>
          <p>Request physical samples or consult with our material experts.</p>
          <div className="col-cta-buttons">
            <button className="col-btn-black">Request Samples</button>
            <button className="col-btn-white">Contact Sales</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;
