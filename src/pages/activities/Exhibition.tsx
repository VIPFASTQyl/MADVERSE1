import LiquidEther from "@/components/LiquidEther";
import PillNav from "@/components/PillNav";
import StaggeredMenu from "@/components/StaggeredMenu";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { AlternatingContent } from "@/components/AlternatingContent";

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

const Exhibition = () => {
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);

  const exhibitionSections = [
    {
      title: "Showcasing Incredible Talent",
      description:
        "Our exhibitions are platforms for artists, creators, and innovators to showcase their work. From emerging talents to established masters, we provide spaces that celebrate excellence, inspire audiences, and spark meaningful conversations about art, culture, and society.",
      image:
        "https://images.unsplash.com/photo-1578926078328-123f5474f1d3?w=800&h=600&fit=crop",
      imageAlt: "Art exhibition display",
      reversed: false,
    },
    {
      title: "Connecting Artists & Audiences",
      description:
        "Exhibitions create powerful connections between creators and the community. Through interactive displays, guided tours, and artist talks, we foster dialogue and understanding. Our goal is to make art accessible, thought-provoking, and transformative for everyone who experiences it.",
      image:
        "https://images.unsplash.com/photo-1578926078328-123f5474f1d3?w=800&h=600&fit=crop",
      imageAlt: "Exhibition visitors and interaction",
      reversed: true,
    },
    {
      title: "Inspiring New Perspectives",
      description:
        "Through carefully curated exhibitions, we challenge perspectives and inspire new ways of thinking. Each exhibition tells stories, explores themes, and invites audiences to look at the world differently. We believe exhibitions have the power to educate, inspire, and transform.",
      image:
        "https://images.unsplash.com/photo-1578926078328-123f5474f1d3?w=800&h=600&fit=crop",
      imageAlt: "Exhibition inspiration",
      reversed: false,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <PillNav 
          items={navItems}
          activeHref="/activity/exhibition"
        />
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <StaggeredMenu 
          isFixed={true}
          items={menuItems}
          position="right"
          colors={['#000', '#1a1a1a']}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          accentColor="#00CED1"
          displayItemNumbering={false}
          logoUrl="/MADVESERlong.png"
        />
      )}
      <div className="fixed inset-0 top-0 z-0 h-screen w-full pointer-events-none">
        {isMobile ? (
          <div className="w-full h-full bg-black" />
        ) : liquidEtherFailed ? (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900 via-black to-black animate-pulse" />
        ) : (
          <LiquidEther
              colors={["#00CED1", "#AFEEEE", "#FFFFFF"]}
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
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-5xl md:text-7xl font-bold text-white">Exhibition</h1>
      </div>

      {/* Full Size Image */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <img
          src="/hover.png"
          alt="Exhibition"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Alternating Content Sections */}
      <div className="relative z-5 bg-black/40">
        <AlternatingContent sections={exhibitionSections} />
      </div>

      {/* Footer */}
      <div className="relative z-5 bg-black">
        <Footer />
      </div>
    </>
  );
};

export default Exhibition;
