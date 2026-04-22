import LiquidEther from "@/components/LiquidEther";
import PillNav from "@/components/PillNav";
import StaggeredMenu from "@/components/StaggeredMenu";
import Footer from "@/components/Footer";
import PageTitleAnimation from "@/components/PageTitleAnimation";
import SEO from "@/components/SEO";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Youth', href: '/activity/youth' },
  { label: 'Arts', href: '/activity/arts' },
  { label: 'Sports', href: '/activity/sports' },
  { label: 'Culture', href: '/activity/culture' },
  { label: 'Exhibition', href: '/activity/exhibition' },
  { label: 'Volunteering', href: '/activity/volunteering' }
];

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to Home', link: '/' },
  { label: 'Youth', ariaLabel: 'Youth Programs', link: '/activity/youth' },
  { label: 'Arts', ariaLabel: 'Arts Programs', link: '/activity/arts' },
  { label: 'Sports', ariaLabel: 'Sports Programs', link: '/activity/sports' },
  { label: 'Culture', ariaLabel: 'Culture Programs', link: '/activity/culture' },
  { label: 'Exhibition', ariaLabel: 'Exhibition', link: '/activity/exhibition' },
  { label: 'Volunteering', ariaLabel: 'Volunteering', link: '/activity/volunteering' }
];

const Youth = () => {
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);

  return (
    <>
      <SEO
        title="Youth"
        description="Explore MADVERSE's youth empowerment programs designed to inspire and develop the next generation in Peja, Kosovo."
        canonical="https://www.madverse-ks.page/activity/youth"
        ogImage="https://www.madverse-ks.page/og-youth.png"
      />
      {/* Desktop Navigation */}
      {!isMobile && (
        <PillNav 
          items={navItems}
          activeHref="/activity/youth"
        />
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <StaggeredMenu 
          isFixed={true}
          items={menuItems}
          position="right"
          colors={['#FCF5AF', '#F0A533', '#E44F0A', '#BA011A']}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          accentColor="#00CED1"
          displayItemNumbering={false}
          logoUrl="/MADVESERlong.png"
          closeOnClickAway={true}
        />
      )}

      <div className="fixed inset-0 top-0 z-0 h-screen w-full pointer-events-none">
        {isMobile ? (
          <div className="w-full h-full bg-black" />
        ) : liquidEtherFailed ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-black animate-pulse" />
        ) : (
          <LiquidEther
            colors={['#FCF5AF', '#F0A533', '#E44F0A', '#BA011A']}
            mouseForce={15}
            cursorSize={100}
            isViscous={false}
            viscous={25}
            iterationsViscous={16}
            iterationsPoisson={16}
            resolution={0.4}
            isBounce={false}
            autoDemo={false}
            autoSpeed={0.4}
            autoIntensity={1}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            onError={() => setLiquidEtherFailed(true)}
          />
        )}
      </div>

      {/* Hero Section */}
      <PageTitleAnimation title="Youth" />

      {/* Full Size Image */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <img
          src="/hover.png"
          alt="Youth"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Coming Soon Section */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">
            Coming Soon<span className="animate-bounce inline-block ml-2">.</span><span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.2s' }}>.</span><span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.4s' }}>.</span>
          </h1>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-5 bg-black">
        <Footer />
      </div>
    </>
  );
};

export default Youth;
