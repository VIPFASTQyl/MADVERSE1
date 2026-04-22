import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustMarquee from "@/components/TrustMarquee";
import FeatureSection from "@/components/FeatureSection";
import ScrollingText from "@/components/ScrollingText";
import CurvedLoop from "@/components/CurvedLoop";
import FlowingMenu from "@/components/FlowingMenu";
import TabsSection from "@/components/TabsSection";
import CTASection from "@/components/CTASection";
import RegisterCTA from "@/components/RegisterCTA";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { getContentByLanguage } from "@/lib/contentService";

const Index = () => {
  console.log("🏠 Index component mounted");
  const { t, language } = useLanguage();
  console.log("📱 Language:", language);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");
  const [featuresTitle, setFeaturesTitle] = useState("");
  const [featuresDesc, setFeaturesDesc] = useState("");
  const [featuresBadge, setFeaturesBadge] = useState("");
  const [aboutHomeTitle, setAboutHomeTitle] = useState("");
  const [aboutHomeDesc, setAboutHomeDesc] = useState("");
  const [aboutHomeBadge, setAboutHomeBadge] = useState("");

  const menuItems = [
    { 
      text: 'Youth', 
      link: '/activity/youth', 
      image: '/Youth.jpg'
    },
    { 
      text: 'Arts', 
      link: '/activity/arts', 
      image: '/Arts.jpg'
    },
    { 
      text: 'Sports', 
      link: '/activity/sports', 
      image: '/project-1.jpg'
    },
    { 
      text: 'Exhibition', 
      link: '/activity/exhibition', 
      image: '/Exhibition.jpg'
    },
    { 
      text: 'Culture', 
      link: '/activity/culture', 
      image: '/Coulture.jpg'
    },
    { 
      text: 'Volunteering', 
      link: '/activity/volunteering', 
      image: '/project-3.jpg'
    }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log("Fetching content for language:", language);
        const content = await getContentByLanguage(language);
        console.log("Fetched content:", content);
        console.log("✅ Content keys:", content?.map((item: any) => item.key) || []);
        if (content && content.length > 0) {
          console.log("📄 First item structure:", JSON.stringify(content[0], null, 2));
        }
        
        // Hero section
        const heroTitleItem = content.find((item) => item.key === "heroTitle");
        const heroDescItem = content.find((item) => item.key === "heroDescription");
        
        console.log("🔍 Looking for 'heroTitle':", heroTitleItem);
        console.log("🔍 Looking for 'heroDescription':", heroDescItem);
        
        // Features section
        const featureTitleItem = content.find((item) => item.key === "featureTitle");
        const featureDescItem = content.find((item) => item.key === "featureDescription");
        const featureBadgeItem = content.find((item) => item.key === "featureBadge");
        
        // About home section
        const aboutHomeTitleItem = content.find((item) => item.key === "aboutHomeTitle");
        const aboutHomeDescItem = content.find((item) => item.key === "aboutHomeDescription");
        const aboutHomeBadgeItem = content.find((item) => item.key === "aboutHomeBadge");

        setHeroTitle(heroTitleItem?.content || t("welcomeMadverse"));
        setHeroDesc(heroDescItem?.content || t("heroSubtitle"));
        setFeaturesTitle(featureTitleItem?.content || t("whatIsMadverse"));
        setFeaturesDesc(featureDescItem?.content || t("whatIsMadverseDesc"));
        setFeaturesBadge(featureBadgeItem?.content || t("madverseBadge"));
        setAboutHomeTitle(aboutHomeTitleItem?.content || t("feelCulture"));
        setAboutHomeDesc(aboutHomeDescItem?.content || t("feelCultureDesc"));
        setAboutHomeBadge(aboutHomeBadgeItem?.content || t("communityBadge"));
        console.log("✅ Hero/Feature content set successfully");
      } catch (error) {
        console.error("Error fetching content:", error);
        // Fallback to translation keys
        setHeroTitle(t("welcomeMadverse"));
        setHeroDesc(t("heroSubtitle"));
        setFeaturesTitle(t("whatIsMadverse"));
        setFeaturesDesc(t("whatIsMadverseDesc"));
        setFeaturesBadge(t("madverseBadge"));
        setAboutHomeTitle(t("feelCulture"));
        setAboutHomeDesc(t("feelCultureDesc"));
        setAboutHomeBadge(t("communityBadge"));
      }
    };

    fetchContent();
  }, [language, t]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="MADVERSE"
        description="Discover MADVERSE - a dynamic organization in Peja, Kosovo dedicated to youth empowerment, urban art, culture, sports, and community exhibitions."
        canonical="https://www.madverse-ks.page/"
        ogImage="https://www.madverse-ks.page/og-home.png"
      />
      <OrganizationSchema />
      <Navigation />
      <HeroSection title={heroTitle} subtitle={heroDesc} />
      <TrustMarquee />

      <FeatureSection
        badge={featuresBadge}
        title={featuresTitle}
        description={featuresDesc}
        image="/Featured1st.JPG"
      />

      <FeatureSection
        badge={aboutHomeBadge}
        title={aboutHomeTitle}
        description={aboutHomeDesc}
        image="/Featured2nd.JPG"
        reversed
      />

      <ScrollingText />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-115px', paddingBottom: '200px' }}>
        <CurvedLoop 
          marqueeText="MADVERSE Organization"
          speed={1}
          curveAmount={400}
          interactive={false}
        />
      </div>

      <div style={{ height: '600px' }}>
        <FlowingMenu 
          items={menuItems}
          speed={15}
          bgColor="#000000"
          marqueeBgColor="#ffffff"
          marqueeTextColor="#000000"
          textColor="#ffffff"
          borderColor="#ffffff"
        />
      </div>

      <RegisterCTA />

      <Footer />
    </div>
  );
};

export default Index;