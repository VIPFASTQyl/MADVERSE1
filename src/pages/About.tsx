import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TrustMarquee from "@/components/TrustMarquee";
import LiquidEther from "@/components/LiquidEther";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getContentByLanguage } from "@/lib/contentService";
import ProgramsCarousel3D from "@/components/ProgramsCarousel3D";

const About = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);
  
  
  // Initialize with empty state - will load from database
  const [aboutContent, setAboutContent] = useState<any>({
    whatTitle: "",
    whatDesc: "",
    essenceDesc: "",
    ideaTitle: "",
    ideaDesc: "",
    goalsTitle: "",
    goalsDesc: "",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log("Fetching About content for language:", language);
        const content = await getContentByLanguage(language, true);
        console.log("Fetched About content:", content);
        
        // Fetch about sections from database
        const whatTitle = content.find((item) => item.key === "about_whatismadverse_title");
        const whatDesc = content.find((item) => item.key === "about_whatismadverse_desc");
        const essenceDesc = content.find((item) => item.key === "about_essence");
        const ideaTitle = content.find((item) => item.key === "about_idea_title");
        const ideaDesc = content.find((item) => item.key === "about_idea_desc");
        const goalsTitle = content.find((item) => item.key === "about_goals_title");
        const goalsDesc = content.find((item) => item.key === "about_goals_desc");
        
        console.log("About sections found:", { whatTitle, whatDesc, essenceDesc, ideaTitle, ideaDesc, goalsTitle, goalsDesc });
        
        // Set content from database
        setAboutContent({
          whatTitle: whatTitle?.content || "",
          whatDesc: whatDesc?.content || "",
          essenceDesc: essenceDesc?.content || "",
          ideaTitle: ideaTitle?.content || "",
          ideaDesc: ideaDesc?.content || "",
          goalsTitle: goalsTitle?.content || "",
          goalsDesc: goalsDesc?.content || "",
        });
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [language, t]);

  return (
    <div className="min-h-screen relative">
      <SEO
        title="About MADVERSE | Our Mission & Vision"
        description="Learn about MADVERSE's mission to empower youth through art, culture, sports, and community programs in Peja, Kosovo."
        canonical="https://www.madverse-ks.page/about"
        ogImage="https://www.madverse-ks.page/og-about.png"
      />
      <Navigation />
      <div className="fixed inset-0 top-0 z-0 h-screen w-full pointer-events-none">
        {liquidEtherFailed ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-black animate-pulse" />
        ) : (
          <LiquidEther
            colors={['#FCF5AF', '#F0A533', '#E44F0A', '#BA011A']}
            mouseForce={isMobile ? 8 : 15}
            cursorSize={isMobile ? 60 : 100}
            isViscous={false}
            viscous={isMobile ? 15 : 25}
            iterationsViscous={isMobile ? 8 : 16}
            iterationsPoisson={isMobile ? 8 : 16}
            resolution={isMobile ? 0.25 : 0.4}
            isBounce={false}
            autoDemo={!isMobile}
            autoSpeed={isMobile ? 0.25 : 0.4}
            autoIntensity={1}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            onError={(error) => {
              console.error('LiquidEther error on About page:', error);
              setLiquidEtherFailed(true);
            }}
          />
        )}
      </div>
      <div className="relative z-10 pointer-events-auto">
      
      {/* What is Madverse Section */}
      <section className="py-24 lg:py-32 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-left">
              {aboutContent.whatTitle}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-left">
              {aboutContent.whatDesc}
            </p>
            <div className="w-full h-px bg-white mb-16"></div>
          </motion.div>
        </div>
      </section>

      {/* MADVERSE Essence Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-purple-900/20 to-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-center mx-auto"
          >
            <p className="text-3xl lg:text-4xl font-bold text-white leading-relaxed italic">
              {aboutContent.essenceDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Idea Behind MADVERSE Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-left">
              {aboutContent.ideaTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-left whitespace-pre-line">
              {aboutContent.ideaDesc}
            </p>
            <div className="w-full h-px bg-white mb-16"></div>
          </motion.div>
        </div>
      </section>

      {/* Our Goals Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-left">
              {aboutContent.goalsTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-left whitespace-pre-line">
              {aboutContent.goalsDesc}
            </p>
            <div className="w-full h-px bg-white mb-16"></div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <ProgramsCarousel3D />

      {/* Partners Section */}
      <TrustMarquee />

      <Footer />
      </div>
    </div>
  );
};

export default About;
