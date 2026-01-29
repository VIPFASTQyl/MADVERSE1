import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustMarquee from "@/components/TrustMarquee";
import FeatureSection from "@/components/FeatureSection";
import ScrollingText from "@/components/ScrollingText";
import ShowcaseGrid from "@/components/ShowcaseGrid";
import TabsSection from "@/components/TabsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <TrustMarquee />

      <FeatureSection
        badge={t('madverseBadge')}
        title={t('whatIsMadverse')}
        description={t('whatIsMadverseDesc')}
        image="/Hero.png"
      />

      <FeatureSection
        badge={t('communityBadge')}
        title={t('feelCulture')}
        description={t('feelCultureDesc')}
        image="/Hero.png"
        reversed
      />

      <ScrollingText />

      <ShowcaseGrid />

      <TabsSection />

      <Footer />
    </div>
  );
};

export default Index;