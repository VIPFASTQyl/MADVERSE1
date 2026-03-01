import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityLanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={menuRef}
      className="fixed top-20 right-6 z-50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-full p-3 hover:bg-gray-200 transition-colors shadow-lg"
        aria-label="Change language"
      >
        <Globe size={24} color="#000" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-0 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={() => {
                setLanguage('en');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-semibold transition-colors ${
                language === 'en'
                  ? 'bg-primary text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              English (ENG)
            </button>
            <button
              onClick={() => {
                setLanguage('al');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-semibold transition-colors ${
                language === 'al'
                  ? 'bg-primary text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              Shqip (ALB)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityLanguageSwitcher;
