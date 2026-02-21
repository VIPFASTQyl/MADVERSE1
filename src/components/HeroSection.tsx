import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Mouse } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/use-mobile";
import { prefersReducedMotion } from "../lib/performanceUtils";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const prefersReduced = prefersReducedMotion();

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

  // Defer animation initialization slightly for better performance
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-[78vh] md:h-[80vh] pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent md:bg-black">
        <motion.img
          src="/Hero.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.6 }}
        />
        <div className="absolute inset-0 bg-black/50 hidden md:block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center h-[calc(78vh-4rem)] md:h-[calc(80vh-4rem)]">
          {/* Text - Centered */}
          <motion.div
            initial={{ opacity: 0, x: prefersReduced ? 0 : -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: prefersReduced ? 0 : -50 }}
            transition={{ duration: prefersReduced ? 0 : 0.8, ease: "easeOut" }}
            className="flex-1 text-center w-full md:w-auto"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-2 sm:mb-4">
              {title || t('welcomeMadverse')}
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl text-white mb-4 sm:mb-8">
              {subtitle || t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                className="bg-white hover:bg-white/90 text-black px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
                onClick={() => {
                  const element = document.getElementById('register-cta');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t('registerNow')}
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
                onClick={() => {
                  const element = document.getElementById('programs-carousel');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t('seePrograms')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Mouse */}
      {!isScrolled && !isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white z-20 flex flex-col items-center"
          onMouseEnter={() => {}}
        >
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={prefersReduced ? {} : { duration: 1.5, repeat: Infinity }}
          >
            <Mouse size={32} />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;