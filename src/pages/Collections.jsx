import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, X, Loader2, Search, FileText, ChevronDown, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../config/apiBase';
import './Collections.css';

const API_BASE = getApiBaseUrl();
const API_URL = `${API_BASE}/api/building-materials`;
const SERIES_API_URL = `${API_BASE}/api/building-material-series`;

const Collections = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
          fetch(SERIES_API_URL)
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

  const requestedCategory = useMemo(() => {
    const stateCategory = location.state?.category;
    if (stateCategory) return stateCategory;
    const params = new URLSearchParams(location.search);
    return params.get('category') || "";
  }, [location.search, location.state]);

  const requestedSeries = useMemo(() => {
    const stateSeries = location.state?.series;
    if (stateSeries) return stateSeries;
    const params = new URLSearchParams(location.search);
    return params.get('series') || "";
  }, [location.search, location.state]);

  // Update activeSeries when data loads
  useEffect(() => {
    if (requestedSeries && hierarchy[seriesToCategory[requestedSeries]]?.includes(requestedSeries)) {
      setActiveSeries(requestedSeries);
      setExpandedCategory(seriesToCategory[requestedSeries] || requestedCategory || "");
      setSearchQuery("");
      return;
    }

    if (defaultSeries && !activeSeries) {
      setActiveSeries(defaultSeries);
    }
  }, [defaultSeries, activeSeries, requestedSeries, requestedCategory, hierarchy, seriesToCategory]);

  // If navigated with a category, expand it and select its first series
  useEffect(() => {
    if (!requestedCategory || location.state?.productCode) return;
    if (requestedSeries) return;
    const seriesList = hierarchy[requestedCategory];
    if (!seriesList || seriesList.length === 0) return;

    setExpandedCategory(requestedCategory);
    setActiveSeries(seriesList[0]);
    setSearchQuery("");
  }, [requestedCategory, requestedSeries, hierarchy, location.state]);

  // Expand the category that contains the active series
  useEffect(() => {
    if (activeSeries && seriesToCategory[activeSeries]) {
      setExpandedCategory(seriesToCategory[activeSeries]);
    }
  }, [activeSeries, seriesToCategory]);

  // Auto-redirect to product detail if navigated from Homepage with state
  useEffect(() => {
    if (location.state?.productCode && products.length > 0) {
      navigate(`/collections/${location.state.productCode}`, { replace: true });
    }
  }, [location.state, products, navigate]);

  // Handle series selection (clears search)
  const handleSeriesClick = (series, category) => {
    setActiveSeries(series);
    setSearchQuery(""); // Clear search when navigating
    if (category) setExpandedCategory(category);
    setIsSidebarOpen(false);
    
    // Scroll to the top of the core module when changing series to prevent "jumping" feel
    const coreModule = document.querySelector('.col-core-module');
    if (coreModule) {
      const offset = 100; // Account for fixed navbar
      const elementPosition = coreModule.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
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
            <Menu size={18} className="col-menu-icon" />
            <span>Series Menu</span>
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
                      onClick={() => navigate(`/collections/${item.code}`, {
                        state: {
                          category: seriesToCategory[activeSeries] || expandedCategory,
                          series: activeSeries,
                        },
                      })}
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
