import LiquidEther from "@/components/LiquidEther";
import PillNav from "@/components/PillNav";
import StaggeredMenu from "@/components/StaggeredMenu";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

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

const ScrollSection = ({
  title,
  description,
  imageUrl,
  index,
}: {
  title: string;
  description: string;
  imageUrl: string;
  index: number;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ opacity }}
    >
      <div className="max-w-5xl w-full">
        <div
          className={`flex flex-col ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } gap-8 items-center`}
        >
          {/* Image */}
          <motion.div
            className="flex-1 overflow-hidden rounded-lg"
            style={{ y, scale }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Youth = () => {
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);
  const { t } = useLanguage();

  const sections = [
    {
      title: t("leadershipDevelopment"),
      description: t("leadershipDesc"),
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    },
    {
      title: t("creativeExpression"),
      description: t("creativeExpressionDesc"),
      imageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    },
    {
      title: t("sportsWellness"),
      description: t("sportsWellnessDesc"),
      imageUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
    },
    {
      title: t("communityService"),
      description: t("communityServiceDesc"),
      imageUrl:
        "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop",
    },
  ];

  return (
    <>
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center">
          Youth
        </h1>
      </div>

      {/* Full Size Image */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <img
          src="/hover.png"
          alt="Youth"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Scroll Sections */}
      <div className="relative z-5 bg-black/40">
        {sections.map((section, index) => (
          <ScrollSection
            key={index}
            title={section.title}
            description={section.description}
            imageUrl={section.imageUrl}
            index={index}
          />
        ))}
      </div>

      {/* Bottom Spacing */}
      <div className="relative z-5 h-20 bg-black/80" />

      {/* Footer */}
      <div className="relative z-5 bg-black">
        <Footer />
      </div>
    </>
  );
};

export default Youth;
