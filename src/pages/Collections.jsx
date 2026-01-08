import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, X, Loader2, Search, FileText, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Collections.css';

const API_URL = 'https://solidoro-backend-production.up.railway.app/api/building-materials';

const Collections = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCodeAsc, setIsCodeAsc] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState("");

  const openContact = () => window.dispatchEvent(new Event('bmw:open-contact'));

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both products and series data in parallel
        const [productsRes, seriesRes] = await Promise.all([
          fetch(API_URL),
          fetch('https://solidoro-backend-production.up.railway.app/api/building-material-series')
        ]);

        if (!productsRes.ok) throw new Error('Failed to fetch products');
        if (!seriesRes.ok) throw new Error('Failed to fetch series');

        const productsResult = await productsRes.json();
        const seriesResult = await seriesRes.json();

        // Set products
        if (productsResult.status === 'success' && Array.isArray(productsResult.data)) {
          setProducts(productsResult.data);
        } else {
          setProducts(Array.isArray(productsResult) ? productsResult : []);
        }

        // Set series data
        if (seriesResult.status === 'success' && Array.isArray(seriesResult.data)) {
          setSeriesData(seriesResult.data);
        } else {
          setSeriesData(Array.isArray(seriesResult) ? seriesResult : []);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Unable to load collections. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const seriesToCategory = useMemo(() => {
    const map = {};
    Object.entries(hierarchy).forEach(([category, seriesList]) => {
      seriesList.forEach((series) => {
        map[series] = category;
      });
    });
    return map;
  }, [hierarchy]);

  const [activeSeries, setActiveSeries] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Update activeSeries when data loads
  useEffect(() => {
    if (defaultSeries && !activeSeries) {
      setActiveSeries(defaultSeries);
    }
  }, [defaultSeries, activeSeries]);

  useEffect(() => {
    if (expandedCategory) return;
    const categories = Object.keys(hierarchy);
    if (categories.length === 0) return;
    const next = (activeSeries && seriesToCategory[activeSeries]) || categories[0];
    setExpandedCategory(next);
  }, [activeSeries, expandedCategory, hierarchy, seriesToCategory]);

  // Auto-open product detail if navigated from Homepage
  useEffect(() => {
    if (location.state?.productCode && products.length > 0) {
      const product = products.find(p => p.code === location.state.productCode);
      if (product) {
        setSelectedProduct(product);
        setCurrentImageIndex(0); // Reset image index when opening product
        // Set active series to the product's series
        if (product.series) {
          setActiveSeries(product.series);
        }
      }
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state, products]);

  // Get all images for a product (main image + gallery)
  const getAllImages = (product) => {
    const images = [];
    if (product.image) {
      images.push(product.image);
    }
    if (product.gallery && Array.isArray(product.gallery)) {
      product.gallery.forEach(img => {
        if (img && typeof img === 'string') {
          images.push(img);
        }
      });
    }
    return images;
  };

  // Handle image navigation
  const handleNextImage = (e) => {
    e.stopPropagation();
    if (selectedProduct) {
      const allImages = getAllImages(selectedProduct);
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (selectedProduct) {
      const allImages = getAllImages(selectedProduct);
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const handleThumbnailClick = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Reset image index when product changes
  useEffect(() => {
    if (selectedProduct) {
      setCurrentImageIndex(0);
    }
  }, [selectedProduct]);

  // Handle series selection (clears search)
  const handleSeriesClick = (series, category) => {
    setActiveSeries(series);
    setSearchQuery(""); // Clear search when navigating
    if (category) setExpandedCategory(category);
    setIsSidebarOpen(false);
  };

  // Get PDF URL for a series
  const getSeriesPDF = (seriesName) => {
    const series = seriesData.find(s => s.name === seriesName);
    return series?.pdf || null;
  };

  // Handle PDF download
  const handleDownloadPDF = (seriesName, e) => {
    e.stopPropagation(); // Prevent series selection when clicking download
    const pdfUrl = getSeriesPDF(seriesName);
    
    if (pdfUrl) {
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
    } else {
      alert('PDF not available for this series.');
    }
  };

  // Filter products based on search query OR active series
  const filteredProducts = useMemo(() => {
    const sortByCode = (items) => {
      const compare = (a, b) => {
        const codeA = (a.code || '').toString();
        const codeB = (b.code || '').toString();
        return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
      };
      return [...items].sort((a, b) => (isCodeAsc ? compare(a, b) : compare(b, a)));
    };

    // 1. If searching, filter globally
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = products.filter(p => 
        (p.code && p.code.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
      return sortByCode(results);
    }
    
    // 2. Otherwise, filter by active series
    if (!activeSeries) return [];
    return sortByCode(products.filter(p => p.series === activeSeries));
  }, [products, activeSeries, searchQuery, isCodeAsc]);

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
        <div className="col-mobile-toolbar">
          <button
            type="button"
            className="col-mobile-filters-btn"
            onClick={() => {
              const categories = Object.keys(hierarchy);
              const next =
                (activeSeries && seriesToCategory[activeSeries]) ||
                expandedCategory ||
                categories[0] ||
                "";
              if (next) setExpandedCategory(next);
              setIsSidebarOpen(true);
            }}
          >
            Series Menu
          </button>
        </div>
        <div className="col-layout">
          <button
            type="button"
            className={`col-sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close series menu"
          />
          
          {/* Left Sidebar: Categories -> Series */}
          <div className={`col-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="col-sidebar-header">
              <h3 className="col-sidebar-title">Collections</h3>
              <button
                type="button"
                className="col-sidebar-close"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close series menu"
              >
                <X size={18} />
              </button>
            </div>
            
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

            <div className="col-nav">
              {Object.entries(hierarchy).map(([category, seriesList]) => (
                <div key={category} className={`col-nav-group ${expandedCategory === category ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="col-nav-category-btn"
                    onClick={() => setExpandedCategory((prev) => (prev === category ? "" : category))}
                    aria-expanded={expandedCategory === category}
                  >
                    <span className="col-nav-category">{category}</span>
                    <ChevronDown size={16} className="col-nav-chevron" />
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedCategory === category && (
                      <motion.div
                        key={`${category}-items`}
                        className="col-nav-items"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {seriesList.map((series) => {
                          const hasPDF = getSeriesPDF(series);
                          return (
                            <div key={series} className="col-nav-item-wrapper">
                              <button
                                className={`col-nav-btn ${activeSeries === series && !searchQuery ? 'active' : ''}`}
                                onClick={() => handleSeriesClick(series, category)}
                                type="button"
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
                              {hasPDF && (
                                <button
                                  className="col-nav-download-btn"
                                  onClick={(e) => handleDownloadPDF(series, e)}
                                  title="Download PDF Catalog"
                                  type="button"
                                >
                                  <FileText size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    <div className="col-category-header-row">
                      <h2>Search Results</h2>
                      <button
                        className="col-sort-btn"
                        onClick={() => setIsCodeAsc((prev) => !prev)}
                        type="button"
                      >
                        Order by code: {isCodeAsc ? 'Ascending' : 'Descending'}
                      </button>
                    </div>
                    <p>
                      Found {filteredProducts.length} items matching "{searchQuery}"
                    </p>
                  </div>
                ) : activeSeries ? (
                  <div className="col-category-header">
                    <div className="col-category-header-row">
                      <h2>{activeSeries}</h2>
                      <button
                        className="col-sort-btn"
                        onClick={() => setIsCodeAsc((prev) => !prev)}
                        type="button"
                      >
                        Order by code: {isCodeAsc ? 'Ascending' : 'Descending'}
                      </button>
                    </div>
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
                  {(() => {
                    const allImages = getAllImages(selectedProduct);
                    if (allImages.length === 0) {
                      return (
                        <div className="col-modal-main-image">
                          <p>No image available</p>
                        </div>
                      );
                    }
                    return (
                      <>
                        <div className="col-modal-main-image">
                          <img 
                            src={allImages[currentImageIndex]} 
                            alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                          />
                          {allImages.length > 1 && (
                            <>
                              <button 
                                className="col-image-nav-btn prev"
                                onClick={handlePrevImage}
                                aria-label="Previous image"
                              >
                                <ChevronLeft size={24} />
                              </button>
                              <button 
                                className="col-image-nav-btn next"
                                onClick={handleNextImage}
                                aria-label="Next image"
                              >
                                <ChevronRight size={24} />
                              </button>
                              <div className="col-image-counter">
                                {currentImageIndex + 1} / {allImages.length}
                              </div>
                            </>
                          )}
                        </div>
                        {allImages.length > 1 && (
                          <div className="col-modal-thumbnails">
                            {allImages.map((img, idx) => (
                              <div
                                key={idx}
                                className={`col-thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={(e) => handleThumbnailClick(idx, e)}
                              >
                                <img src={img} alt={`Thumbnail ${idx + 1}`} />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="col-modal-details">
                  <span className="col-tag">{selectedProduct.category} / {selectedProduct.series}</span>
                  <div className="col-modal-header-group">
                    <h2>{selectedProduct.name}</h2>
                    <span className="col-modal-code">{selectedProduct.code}</span>
                  </div>

                  <div className="col-modal-price">
                    <span className="col-modal-price-label">Price</span>
                    {selectedProduct.price === null || selectedProduct.price === undefined || selectedProduct.price === '' ? (
                      <button
                        type="button"
                        className="col-modal-price-value col-modal-price-link"
                        onClick={openContact}
                      >
                        Contact for pricing
                      </button>
                    ) : (
                      <span className="col-modal-price-value">
                        {typeof selectedProduct.price === 'number'
                          ? `$${selectedProduct.price.toLocaleString()}`
                          : selectedProduct.price}
                      </span>
                    )}
                  </div>
                  
                  <div className="col-modal-desc">
                    {selectedProduct.description
                      ? selectedProduct.description
                          .split(/\n/)
                          .map((paragraph) => paragraph.trim())
                          .filter(Boolean)
                          .map((paragraph, idx) => (
                            <p className="col-modal-desc-paragraph" key={idx}>
                              {paragraph}
                            </p>
                          ))
                      : null}
                  </div>
                  
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
                    <button 
                      className="col-btn-black"
                      onClick={openContact}
                    >
                      Inquire
                    </button>
                    {/* <button className="col-btn-outline" style={{ color: '#000', borderColor: '#000' }}>
                      Download Spec Sheet
                    </button> */}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="col-cta">
        <div className="col-cta-content">
          <h2>Ready to specify?</h2>
          <p>Consult with our material experts for your project needs.</p>
          <div className="col-cta-buttons">
            <button 
              className="col-btn-white" 
              onClick={openContact}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Collections;
