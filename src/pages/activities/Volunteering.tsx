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

const Volunteering = () => {
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);

  const volunteeringSections = [
    {
      title: "Making a Difference Together",
      description:
        "Volunteering is about giving back and making a tangible impact in your community. Our volunteer programs provide meaningful opportunities to contribute your time, skills, and passion. Whether you're interested in education, sustainability, arts, or social causes, there's a place for you to make a difference.",
      image:
        "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop",
      imageAlt: "Community volunteering",
      reversed: false,
    },
    {
      title: "Building Stronger Communities",
      description:
        "When people volunteer, they strengthen the social fabric of communities. Our programs connect volunteers with causes they care about, creating networks of support and driving sustainable change. Volunteering builds connections, fosters empathy, and reminds us of our shared humanity.",
      image:
        "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop",
      imageAlt: "Community building and support",
      reversed: true,
    },
    {
      title: "Growing While Giving",
      description:
        "Volunteering is a two-way street. While you're helping others, you're also developing new skills, expanding your network, and growing personally. Our programs are designed to provide meaningful experiences that enrich both volunteers and the communities they serve.",
      image:
        "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop",
      imageAlt: "Personal growth through volunteering",
      reversed: false,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <PillNav 
          items={navItems}
          activeHref="/activity/volunteering"
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
        <h1 className="text-5xl md:text-7xl font-bold text-white">Volunteering</h1>
      </div>

      {/* Full Size Image */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <img
          src="/hover.png"
          alt="Volunteering"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Alternating Content Sections */}
      <div className="relative z-5 bg-black/40">
        <AlternatingContent sections={volunteeringSections} />
      </div>

      {/* Footer */}
      <div className="relative z-5 bg-black">
        <Footer />
      </div>
    </>
  );
};

export default Volunteering;
