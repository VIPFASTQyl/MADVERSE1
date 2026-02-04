import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Mouse } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/use-mobile";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
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
    <section className="relative h-[78vh] md:h-[80vh] pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent md:bg-black">
        <motion.img
          src="/Hero.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 hidden md:block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between h-[calc(78vh-4rem)] md:h-[calc(80vh-4rem)]">
          {/* PNG Image Overlay - Top on mobile, right on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1  }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex justify-center md:justify-end order-1 md:order-2 -mt-[15px] w-full md:w-auto"
          >
            <img
              src="/PNG.png"
              alt="PNG Overlay"
              className="max-w-48 sm:max-w-64 md:max-w-lg max-h-48 sm:max-h-64 md:max-h-lg object-contain"
            />
          </motion.div>

          {/* Text - Bottom on mobile, left on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center order-2 md:order-1 -mt-[10px] w-full md:w-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4">
              {title || t('welcomeMadverse')}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-white">
              {subtitle || t('heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Mouse */}
      <motion.div
        animate={{ y: isScrolled ? 0 : [0, 10, 0], opacity: isScrolled ? 0 : 1 }}
        transition={{ duration: 1, repeat: isScrolled ? 0 : Infinity }}
        className="absolute bottom-8 left-[45%] md:left-1/2 transform -translate-x-1/2 text-white z-20 flex flex-col items-center"
      >
        <Mouse size={32} />
      </motion.div>
    </section>
  );
};

export default HeroSection;