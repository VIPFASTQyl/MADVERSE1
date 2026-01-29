import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/use-mobile";

const HeroSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent md:bg-black">
        <motion.img
          src="/Hero.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 hidden md:block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[calc(100vh-4rem)]">
          {/* PNG Image Overlay - Top on mobile, right on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1  }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex justify-center md:justify-end order-1 md:order-2 -mt-[15px]"
          >
            <img
              src="/PNG.png"
              alt="PNG Overlay"
              className="max-w-64 md:max-w-lg max-h-64 md:max-h-lg object-contain"
            />
          </motion.div>

          {/* Text - Bottom on mobile, left on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center order-2 md:order-1 -mt-[10px]"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              {t('welcomeMadverse')}
            </h1>
            <p className="text-xl md:text-2xl text-white">
              {t('heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Arrow */}
      <motion.div
        animate={{ y: isScrolled ? 0 : [0, 7, 0], opacity: isScrolled ? 0 : 1 }}
        transition={{ duration: 0.6, repeat: isScrolled ? 0 : Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 -ml-[20px] text-white z-20 flex flex-col items-center blur-[0.5px]"
      >
        <span className="text-sm font-medium mb-2">Explore</span>
        <ChevronDown size={48} />
      </motion.div>
    </section>
  );
};

export default HeroSection;