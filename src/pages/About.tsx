import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TrustMarquee from "@/components/TrustMarquee";
import LiquidEther from "@/components/LiquidEther";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getContentByLanguage } from "@/lib/contentService";
import ProgramsCarousel3D from "@/components/ProgramsCarousel3D";
import ComplexProfileCard from "@/components/ComplexProfileCard";

const About = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);
  
  
  // Initialize with empty state - will load from database
  const [aboutContent, setAboutContent] = useState<any>({
    whatTitle: "",
    whatDesc: "",
    ideaTitle: "",
    ideaDesc: "",
    goalsTitle: "",
    goalsDesc: "",
  });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log("Fetching About content for language:", language);
        // Force refresh to get latest data from Supabase
        const content = await getContentByLanguage(language, true);
        console.log("Fetched About content:", content);
        
        // Fetch about sections from database
        const whatTitle = content.find((item) => item.key === "about_whatismadverse_title");
        const whatDesc = content.find((item) => item.key === "about_whatismadverse_desc");
        const ideaTitle = content.find((item) => item.key === "about_idea_title");
        const ideaDesc = content.find((item) => item.key === "about_idea_desc");
        const goalsTitle = content.find((item) => item.key === "about_goals_title");
        const goalsDesc = content.find((item) => item.key === "about_goals_desc");
        
        console.log("About sections found:", { whatTitle, whatDesc, ideaTitle, ideaDesc, goalsTitle, goalsDesc });
        
        // Set content from database
        setAboutContent({
          whatTitle: whatTitle?.content || "",
          whatDesc: whatDesc?.content || "",
          ideaTitle: ideaTitle?.content || "",
          ideaDesc: ideaDesc?.content || "",
          goalsTitle: goalsTitle?.content || "",
          goalsDesc: goalsDesc?.content || "",
        });
        
        // Fetch team members
        const teamContent = content.filter((item) => item.section === "team");
        console.log("Team content found:", teamContent);
        
        const members = ["klest", "guri", "erion"].map((memberKey) => {
          const nameItem = teamContent.find((item) => item.key === `team_${memberKey}_name`);
          const titleItem = teamContent.find((item) => item.key === `team_${memberKey}_title`);
          const bioItem = teamContent.find((item) => item.key === `team_${memberKey}_bio`);
          const imageItem = teamContent.find((item) => item.key === `team_${memberKey}_image`);
          
          console.log(`Team member ${memberKey}:`, { nameItem, titleItem, bioItem, imageItem });
          
          return {
            key: memberKey,
            name: nameItem?.content || (memberKey === "klest" ? "Klest" : memberKey === "guri" ? "Guri" : "Erion"),
            title: titleItem?.content || "",
            bio: bioItem?.content || "",
            image: imageItem?.content || `/team-${memberKey}.png`,
          };
        });
        
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [language, t]);

  return (
    <div className="min-h-screen relative">
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

      {/* Our Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                {language === "en" ? "Our Team" : "Ekipi Ynë"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "en" 
                  ? "Meet the passionate people behind MADVERSE" 
                  : "Takoni njerëzit pasionantë prapa MADVERSE"}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <ComplexProfileCard
                  key={member.key}
                  image={member.image}
                  name={member.name}
                  position={member.title}
                  description={member.bio}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
