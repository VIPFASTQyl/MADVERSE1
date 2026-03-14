import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/use-mobile";
import { getContentByLanguage } from "../lib/contentService";
import TextPressure from "./CircularText";
import BubbleText from "./BubbleTextComponent";
import "./HeroSection.css";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [is3D, setIs3D] = useState(true); // true = 3D mode (with shadows), false = 2D mode (flat)
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [youthCultureText, setYouthCultureText] = useState("Youth Culture Arts & Sports Organization");
  const [becomePartnerText, setBecomePartnerText] = useState("Become a Partner");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getContentByLanguage(language, true);
        
        const youthCultureItem = content.find((item) => item.key === "hero_youth_culture_text");
        const becomePartnerItem = content.find((item) => item.key === "hero_become_partner_text");
        
        setYouthCultureText(youthCultureItem?.content || "Youth Culture Arts & Sports Organization");
        setBecomePartnerText(becomePartnerItem?.content || "Become a Partner");
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    };

    fetchContent();
  }, [language]);

  return (
    <section className="relative w-full h-screen overflow-hidden homeHero">
      {/* Animated Gradient Blob Background */}
      <div className="blob-outer-container">
        <div className="blob-inner-container">
          <div className="blob"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full max-w-7xl text-center flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-screen flex flex-col items-center justify-center"
          >
            <div 
              className={`meta-animation ${!is3D ? 'mobile-toggled' : ''}`}
              onClick={() => setIs3D(!is3D)}
              style={{ cursor: 'pointer' }}
              title={`Click to toggle ${is3D ? '2D' : '3D'} mode`}
            >
              MADVERSE
            </div>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 w-full flex justify-between items-end px-6 sm:px-12 pb-8 bottom-text-container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-sm font-light youth-culture-text bottom-text-link"
            onClick={() => navigate('/about')}
          >
            <BubbleText text={youthCultureText} className="inline" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-sm font-light bottom-text-link"
            onClick={() => navigate('/contact')}
          >
            <BubbleText text={becomePartnerText} className="inline" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;