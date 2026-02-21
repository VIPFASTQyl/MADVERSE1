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
import TabsSection from "@/components/TabsSection";

const About = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);
  
  
  // Initialize with translation fallbacks to show content immediately
  const [aboutContent, setAboutContent] = useState<any>({
    whatTitle: t("whatIsMadverse"),
    whatDesc: t("whatIsMadverseDescAbout"),
    feelTitle: t("feelCulture"),
    feelDesc: t("feelCultureDetail"),
  });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log("Fetching About content for language:", language);
        const content = await getContentByLanguage(language);
        console.log("Fetched About content:", content);
        
        // Fetch about sections
        const whatTitle = content.find((item) => item.key === "about_whatismadverse_title");
        const whatDesc = content.find((item) => item.key === "about_whatismadverse_desc");
        const feelTitle = content.find((item) => item.key === "about_feelculture_title");
        const feelDesc = content.find((item) => item.key === "about_feelculture_desc");
        
        console.log("About sections found:", { whatTitle, whatDesc, feelTitle, feelDesc });
        
        setAboutContent({
          whatTitle: whatTitle?.content || t("whatIsMadverse"),
          whatDesc: whatDesc?.content || t("whatIsMadverseDescAbout"),
          feelTitle: feelTitle?.content || t("feelCulture"),
          feelDesc: feelDesc?.content || t("feelCultureDetail"),
        });
        
        // Fetch team members
        const teamContent = content.filter((item) => item.section === "team");
        console.log("Team content found:", teamContent);
        
        const members = ["klest", "guri", "erion"].map((memberKey) => {
          const nameItem = teamContent.find((item) => item.key === `team_${memberKey}_name`);
          const titleItem = teamContent.find((item) => item.key === `team_${memberKey}_title`);
          const bioItem = teamContent.find((item) => item.key === `team_${memberKey}_bio`);
          
          console.log(`Team member ${memberKey}:`, { nameItem, titleItem, bioItem });
          
          return {
            key: memberKey,
            name: nameItem?.content || "",
            title: titleItem?.content || "",
            bio: bioItem?.content || "",
            image: memberKey === "klest" 
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              : memberKey === "guri"
              ? "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
              : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
          };
        });
        
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching content:", error);
        // Fallback to translation keys
        setAboutContent({
          whatTitle: t("whatIsMadverse"),
          whatDesc: t("whatIsMadverseDescAbout"),
          feelTitle: t("feelCulture"),
          feelDesc: t("feelCultureDetail"),
        });
        
        setTeamMembers([
          { key: "klest", name: t("klest"), title: t("klestTitleAbout"), bio: t("klestDescAbout"), image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
          { key: "guri", name: t("guri"), title: t("guriTitleAbout"), bio: t("guriDescAbout"), image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" },
          { key: "erion", name: t("erion"), title: t("erionTitleAbout"), bio: t("erionDescAbout"), image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" },
        ]);
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
            colors={['#00CED1', '#AFEEEE', '#FFFFFF']}
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

      {/* Culture You Can Feel and Interact Section */}
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
              {aboutContent.feelTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-left whitespace-pre-line">
              {aboutContent.feelDesc}
            </p>
            <div className="w-full h-px bg-white mb-16"></div>
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      <TabsSection />

      {/* Partners Section */}
      <TrustMarquee />

      <Footer />
      </div>
    </div>
  );
};

export default About;
