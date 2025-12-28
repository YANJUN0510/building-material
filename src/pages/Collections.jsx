import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, ChevronRight } from 'lucide-react';
import './Collections.css';

// Mock Data
const collectionsData = {
  "cladding": {
    label: "Cladding Systems",
    description: "High-performance metal facades designed for durability and aesthetic impact.",
    items: [
      { id: 'c1', name: "Brushed Aluminum", code: "AL-B01", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop" },
      { id: 'c2', name: "Weathered Zinc", code: "ZN-W02", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop" },
      { id: 'c3', name: "Corten Steel", code: "ST-C03", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop" },
      { id: 'c4', name: "Anodized Copper", code: "CU-A04", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop" },
      { id: 'c5', name: "Blackened Steel", code: "ST-B05", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop" },
      { id: 'c6', name: "Perforated Panel", code: "AL-P06", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop" },
    ]
  },
  "mesh": {
    label: "Architectural Mesh",
    description: "Versatile wire mesh solutions for shading, safety, and separation.",
    items: [
      { id: 'm1', name: "Woven Wire", code: "MS-W01", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop" },
      { id: 'm2', name: "Expanded Metal", code: "MS-E02", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop" },
      { id: 'm3', name: "Spiral Mesh", code: "MS-S03", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop" },
      { id: 'm4', name: "Cable Mesh", code: "MS-C04", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1740&auto=format&fit=crop" },
    ]
  },
  "interior": {
    label: "Interior Surfaces",
    description: "Refined textures and finishes for interior applications.",
    items: [
      { id: 'i1', name: "Hammered Brass", code: "BR-H01", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop" },
      { id: 'i2', name: "Polished Chrome", code: "ST-P02", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop" },
      { id: 'i3', name: "Matte Gold", code: "AU-M03", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop" },
    ]
  }
};

const Collections = () => {
  const [activeCategory, setActiveCategory] = useState("cladding");

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
            A curated selection of premium architectural metals.
          </motion.p>
        </div>
      </section>

      {/* Core Module: Selector & Grid */}
      <section className="col-core-module">
        <div className="col-layout">
          
          {/* Left Sidebar: Categories */}
          <div className="col-sidebar">
            <h3 className="col-sidebar-title">Categories</h3>
            <div className="col-nav">
              {Object.entries(collectionsData).map(([key, data]) => (
                <button 
                  key={key}
                  className={`col-nav-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="col-nav-text">{data.label}</span>
                  {activeCategory === key && (
                    <motion.div layoutId="activeIndicator" className="col-nav-indicator" />
                  )}
                </button>
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
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="col-grid-container"
              >
                <div className="col-category-header">
                  <h2>{collectionsData[activeCategory].label}</h2>
                  <p>{collectionsData[activeCategory].description}</p>
                </div>

                <div className="col-grid">
                  {collectionsData[activeCategory].items.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="col-item-card"
                    >
                      <div className="col-item-img-box">
                        <img src={item.img} alt={item.name} />
                        <div className="col-item-overlay">
                          <button className="col-view-btn">View Details</button>
                        </div>
                      </div>
                      <div className="col-item-info">
                        <span className="col-item-code">{item.code}</span>
                        <h4 className="col-item-name">{item.name}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

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
