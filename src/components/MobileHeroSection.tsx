import React from 'react';
import { Link } from 'react-router-dom';
import './MobileHeroSection.css';

const MobileHeroSection: React.FC = () => {
  return (
    <section className="mobile-hero-section py-6 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3">
          <Link to="/about" className="mobile-hero-btn about">
            About Us
          </Link>
          <Link to="/contact" className="mobile-hero-btn contact">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileHeroSection;
