import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Loader2, ArrowLeft, Send, Share2 } from 'lucide-react';
import './ProductDetail.css';

const API_URL = 'https://bmw-backend-production.up.railway.app/api/building-materials';

const ProductDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openContact = () => window.dispatchEvent(new Event('bmw:open-contact'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/${code}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Product not found');
          throw new Error('Failed to fetch product details');
        }
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          setProduct(result.data);
        } else {
          setProduct(result);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      fetchProduct();
    }
  }, [code]);

  const getAllImages = (p) => {
    const images = [];
    if (p.image) images.push(p.image);
    if (p.gallery && Array.isArray(p.gallery)) {
      p.gallery.forEach(img => {
        if (img && typeof img === 'string') images.push(img);
      });
    }
    return images;
  };

  if (isLoading) {
    return (
      <div className="product-detail-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading Product Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Oops!</h2>
        <p>{error || "Product not found"}</p>
        <Link to="/collections" className="btn-back-home">
          <ArrowLeft size={18} /> Back to Collections
        </Link>
      </div>
    );
  }

  const allImages = getAllImages(product);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Navigation Breadcrumb */}
        <nav className="product-breadcrumb">
          <div className="breadcrumb-main">
            <button onClick={() => navigate(-1)} className="breadcrumb-back">
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <div className="breadcrumb-path">
              <Link to="/collections">Collections</Link>
              <span className="separator">/</span>
              <span className="current">{product.category}</span>
              <span className="separator">/</span>
              <span className="current">{product.series}</span>
            </div>
          </div>
          <button className="breadcrumb-share" onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: product.name,
                url: window.location.href
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard');
            }
          }}>
            <Share2 size={18} />
          </button>
        </nav>

        <motion.div 
          className="product-main-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left: Image Gallery */}
          <div className="product-gallery-section">
            <div className="main-image-viewport">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={allImages[currentImageIndex]}
                  alt={`${product.name} - View ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              
              {allImages.length > 1 && (
                <>
                  <button className="nav-btn prev" onClick={handlePrevImage}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="nav-btn next" onClick={handleNextImage}>
                    <ChevronRight size={24} />
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="thumbnail-strip">
                {allImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    className={`thumbnail-btn ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="product-info-section">
            <header className="product-header">
              <motion.span 
                className="product-series-tag"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {product.series}
              </motion.span>
              <motion.h1 
                className="product-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {product.name}
              </motion.h1>
              <motion.span 
                className="product-code-badge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {product.code}
              </motion.span>
            </header>

            <motion.div 
              className="product-price-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="price-label">Estimated Price</span>
              {(!product.price || product.price === '') ? (
                <motion.div 
                  className="price-inquiry" 
                  onClick={openContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Request a Quote
                </motion.div>
              ) : (
                <motion.div 
                  className="price-value"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {typeof product.price === 'number'
                    ? `$${product.price.toLocaleString()}`
                    : product.price}
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="product-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3>Description</h3>
              {product.description
                ? product.description.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))
                : <p>No description available.</p>
              }
            </motion.div>

            <motion.div 
              className="product-specs-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h3>Specifications</h3>
              <div className="specs-grid">
                {Array.isArray(product.specs) ? (
                  product.specs.map((spec, idx) => (
                    <div className="spec-item" key={idx}>
                      <span className="spec-label">{spec.label}</span>
                      <span className="spec-value">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <div className="spec-item" key={key}>
                      <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="spec-value">{String(value)}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div 
              className="product-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <button className="btn-primary inquiry-btn" onClick={openContact}>
                <Send size={18} />
                Inquire Now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modern Industrial Footer CTA */}
      <section className="product-footer-cta">
        <div className="cta-content">
          <h2>Interested in this material?</h2>
          <p>Our experts can help you with technical details and project implementation.</p>
          <button className="btn-outline" onClick={openContact}>Contact Technical Support</button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
