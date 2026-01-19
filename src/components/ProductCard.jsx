import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Eye, DollarSign } from 'lucide-react';

const ProductCard = ({ product, isCompact = false }) => {
  const navigate = useNavigate();
  console.log('ProductCard received product:', product); // Debug log
  
  const handleViewDetails = () => {
    // If it has a code, it's our internal product
    if (product.code) {
      navigate(`/collections/${product.code}`);
      return;
    }
    
    // Ensure link opens in new tab to preserve chat state
    if (product.detailUrl) {
      const link = document.createElement('a');
      link.href = product.detailUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isCompact) {
    return (
      <div className="product-card-compact">
        <div className="product-card-image-container">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="product-card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="product-card-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
            <Eye size={24} />
          </div>
        </div>
        
        <div className="product-card-info">
          <h4 className="product-card-title">{product.name}</h4>
          <p className="product-card-code">{product.code}</p>
          
          {product.price && (
            <div className="product-card-price">
              <DollarSign size={14} />
              <span>{typeof product.price === 'number' ? `AUD ${product.price}` : product.price}</span>
            </div>
          )}
          
          <button 
            className="product-card-button"
            onClick={handleViewDetails}
            type="button"
          >
            <span>View Details</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card-full">
      <div className="product-card-header">
        <div className="product-card-image-container">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="product-card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="product-card-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
            <Eye size={32} />
          </div>
        </div>
        
        <div className="product-card-info">
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-code">{product.code}</p>
          
          {product.category && product.series && (
            <div className="product-card-meta">
              <span className="meta-item">{product.category}</span>
              {product.series && <span className="meta-separator">•</span>}
              <span className="meta-item">{product.series}</span>
            </div>
          )}
        </div>
      </div>

      {product.description && (
        <p className="product-card-description">{product.description}</p>
      )}

      <div className="product-card-footer">
        {product.price && (
          <div className="product-card-price">
            <DollarSign size={16} />
            <span>{typeof product.price === 'number' ? `AUD ${product.price}` : product.price}</span>
          </div>
        )}
        
        <button 
          className="product-card-button"
          onClick={handleViewDetails}
          type="button"
        >
          <span>View Details</span>
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;