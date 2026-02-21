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

const Sports = () => {
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);

  const sportsSections = [
    {
      title: "Building Strength & Character",
      description:
        "Sports is more than competition—it's about building character, resilience, and teamwork. Our sports programs foster physical fitness, mental toughness, and leadership skills. Whether beginners or seasoned athletes, we provide opportunities to grow, challenge yourself, and achieve greatness.",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop",
      imageAlt: "Sports and athletic training",
      reversed: false,
    },
    {
      title: "Teamwork & Community Spirit",
      description:
        "The heart of sports lies in teamwork and camaraderie. Our programs emphasize collaboration, mutual support, and community building. By bringing people together through sports, we create lasting friendships, build stronger communities, and celebrate shared victories.",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop",
      imageAlt: "Team sports and collaboration",
      reversed: true,
    },
    {
      title: "Excellence & Personal Growth",
      description:
        "We believe every athlete has untapped potential. Our coaching and training programs are designed to unlock that potential and push boundaries. From grassroots development to elite training, we support athletes at every stage of their journey toward excellence.",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop",
      imageAlt: "Athletic excellence and training",
      reversed: false,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <PillNav 
          items={navItems}
          activeHref="/activity/sports"
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
        <h1 className="text-5xl md:text-7xl font-bold text-white">Sports</h1>
      </div>

      {/* Full Size Image */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <img
          src="/hover.png"
          alt="Sports"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Alternating Content Sections */}
      <div className="relative z-5 bg-black/40">
        <AlternatingContent sections={sportsSections} />
      </div>

      {/* Footer */}
      <div className="relative z-5 bg-black">
        <Footer />
      </div>
    </>
  );
};

export default Sports;
