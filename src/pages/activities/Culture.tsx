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

const Culture = () => {
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);

  const cultureSections = [
    {
      title: "Preserving Our Heritage",
      description:
        "Culture is the foundation of identity and community. Our cultural programs celebrate traditions, languages, and customs that define who we are. Through exhibitions, performances, and educational events, we work to preserve cultural heritage for future generations while maintaining its relevance today.",
      image:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
      imageAlt: "Cultural heritage and traditions",
      reversed: false,
    },
    {
      title: "Cross-Cultural Understanding",
      description:
        "In our diverse world, understanding different cultures is essential. We create platforms for people to learn from one another, celebrate differences, and build bridges across communities. Through cultural exchange programs and collaborative initiatives, we foster respect, empathy, and global citizenship.",
      image:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
      imageAlt: "Cross-cultural collaboration",
      reversed: true,
    },
    {
      title: "Living Culture & Innovation",
      description:
        "Cultures evolve and adapt. We celebrate cultural continuity while embracing innovation and contemporary expressions. Our programs support cultural practitioners, artists, and community members who keep traditions alive while creating new forms of cultural expression.",
      image:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
      imageAlt: "Cultural innovation",
      reversed: false,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <PillNav 
          items={navItems}
          activeHref="/activity/culture"
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
        <h1 className="text-5xl md:text-7xl font-bold text-white">Culture</h1>
      </div>

      {/* Full Size Image */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <img
          src="/hover.png"
          alt="Culture"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Alternating Content Sections */}
      <div className="relative z-5 bg-black/40">
        <AlternatingContent sections={cultureSections} />
      </div>

      {/* Footer */}
      <div className="relative z-5 bg-black">
        <Footer />
      </div>
    </>
  );
};

export default Culture;
