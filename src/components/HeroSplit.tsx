import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import './HeroSplit.css';

const HeroSplit: React.FC = () => {
  const isMobile = useIsMobile();
  const { t, setLanguage, language } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  return (
    <div className="hero-split">
      <div className="headline">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Left half */}
            <clipPath id="left">
              <rect x="0" y="0" width="600" height="600" />
            </clipPath>
            {/* Right half */}
            <clipPath id="right">
              <rect x="600" y="0" width="600" height="600" />
            </clipPath>
          </defs>

          {/* Left half (cyan, skewed left) */}
          <text
            x="50"
            y="150"
            fontSize="120"
            fontWeight="900"
            textLength="1100"
            className="cyan"
            clipPath="url(#left)"
            transform="skewY(-8) translate(0,85)"
          >
            <tspan>MAD</tspan>
            <tspan fill="#00CED1">V</tspan>
            <tspan>ERSE</tspan>
          </text>
          <text
            x="50"
            y="300"
            fontSize="100"
            fontWeight="900"
            textLength="1100"
            className="cyan"
            clipPath="url(#left)"
            transform="skewY(-8) translate(0,85)"
          >
            YOUTH AND COULTURE
          </text>
          <text
            x="50"
            y="450"
            fontSize="100"
            fontWeight="900"
            textLength="1100"
            className="cyan"
            clipPath="url(#left)"
            transform="skewY(-8) translate(0,85)"
          >
            ORGANIZATION
          </text>

          {/* Right half (black, skewed right) */}
          <text
            x="50"
            y="150"
            fontSize="120"
            fontWeight="900"
            textLength="1100"
            className="black"
            clipPath="url(#right)"
            transform="skewY(8) translate(0,-84)"
          >
            <tspan>MAD</tspan>
            <tspan fill="#000">V</tspan>
            <tspan>ERSE</tspan>
          </text>
          <text
            x="50"
            y="300"
            fontSize="100"
            fontWeight="900"
            textLength="1100"
            className="black"
            clipPath="url(#right)"
            transform="skewY(8) translate(0,-84)"
          >
            YOUTH AND COULTURE
          </text>
          <text
            x="50"
            y="450"
            fontSize="100"
            fontWeight="900"
            textLength="1100"
            className="black"
            clipPath="url(#right)"
            transform="skewY(8) translate(0,-84)"
          >
            ORGANIZATION
          </text>
        </svg>
      </div>

      <div className="vertical-left">YOUTH CULTURE ARTS SPORTS</div>
      <div className="vertical-right">EXPLORE PROGRAMS</div>

      <div className="pagination">01 — 06</div>
      {/* Language globe inside Hero */}
      <div className="hero-lang" ref={langRef}>
        <button
          type="button"
          aria-label="Language"
          className={`hero-lang-btn ${isMobile ? 'mobile' : 'desktop'}`}
          onClick={(e) => { e.stopPropagation(); setIsLangOpen(!isLangOpen); }}
        >
          <Globe size={18} color={'#000'} />
        </button>
        <AnimatePresence>
          {isLangOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className={`hero-lang-menu ${isMobile ? 'mobile' : 'desktop'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => { setLanguage('al'); setIsLangOpen(false); }} className={`hero-lang-item ${language==='al'? 'active':''}`}>Shqip (ALB)</button>
              <button onClick={() => { setLanguage('en'); setIsLangOpen(false); }} className={`hero-lang-item ${language==='en'? 'active':''}`}>English (ENG)</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!isMobile && (
        <div className="social">
          <a href="/contact">Contact</a>
          <a href="/about">About</a>
          <a href="/signup">Sign Up</a>
          <a href="/login">Login</a>
        </div>
      )}

      {/* Mobile CTAs moved to a dedicated mobile-only section component */}
    </div>
  );
};

export default HeroSplit;
