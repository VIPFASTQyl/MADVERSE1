import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  rest: { opacity: 1 },
  hover: { opacity: 1 }
};

const logoVariants = {
  rest: { rotate: 0 },
  hover: { rotate: 360, transition: { duration: 0.6, ease: 'easeInOut' } }
};

const textVariants = {
  rest: { scaleX: 0, opacity: 0, transition: { duration: 0.18 } },
  hover: { scaleX: 1, opacity: 1, transition: { duration: 0.25 } }
};

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setVisible(pct > 0.5);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 text-white bg-transparent p-0"
          variants={containerVariants}
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          <motion.span
            variants={textVariants}
            className="hidden sm:inline-block font-medium mr-2"
            style={{ pointerEvents: 'none', transformOrigin: 'right center', display: 'inline-block' }}
          >
            Back to Top!
          </motion.span>

          <motion.img
            src="/PNG.png"
            alt="Madverse logo"
            className="h-8 w-auto"
            variants={logoVariants}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
