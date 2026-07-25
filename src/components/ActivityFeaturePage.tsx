import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "@/components/Footer";
import LiquidEther from "@/components/LiquidEther";
import LineSidebar from "@/components/LineSidebar";
import PageTitleAnimation from "@/components/PageTitleAnimation";
import PillNav from "@/components/PillNav";
import SEO from "@/components/SEO";
import StaggeredMenu from "@/components/StaggeredMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

type TranslationKey = string;

interface FeatureSection {
  labelKey: TranslationKey;
  titleKey?: TranslationKey;
  descriptionKey: TranslationKey;
  image: string;
}

interface ActivityFeaturePageProps {
  activeHref: string;
  titleKey: TranslationKey;
  seoDescription: string;
  canonical: string;
  ogImage: string;
  accentColor: string;
  sections: FeatureSection[];
}

const pageLinks = [
  { key: "home", href: "/" },
  { key: "youth", href: "/activity/youth" },
  { key: "arts", href: "/activity/arts" },
  { key: "sports", href: "/activity/sports" },
  { key: "culture", href: "/activity/culture" },
  { key: "exhibition", href: "/activity/exhibition" },
  { key: "volunteering", href: "/activity/volunteering" },
];

const sidebarItems = [
  "MADVERSE x Rugove",
  "MADVERSE x Karta Rinore",
  ...Array.from({ length: 8 }, () => "Coming Soon..."),
];

const ActivityFeaturePage = ({
  activeHref,
  titleKey,
  seoDescription,
  canonical,
  ogImage,
  accentColor,
  sections,
}: ActivityFeaturePageProps) => {
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);
  const pageTitle = t(titleKey);

  const navItems = pageLinks.map(({ key, href }) => ({ label: t(key), href }));
  const menuItems = pageLinks.map(({ key, href }) => ({
    label: t(key),
    ariaLabel: t(key),
    link: href,
  }));

  const handleSidebarClick = (index: number) => {
    const targetId = index >= 2 ? "activity-coming-soon" : `activity-feature-${index}`;
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-black text-white" lang={language === "al" ? "sq" : "en"}>
      <SEO
        title={pageTitle}
        description={seoDescription}
        canonical={canonical}
        ogImage={ogImage}
      />

      {!isMobile ? (
        <PillNav items={navItems} activeHref={activeHref} />
      ) : (
        <StaggeredMenu
          isFixed
          items={menuItems}
          position="right"
          colors={[accentColor, "#111111", "#000000", accentColor]}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          accentColor="#00CED1"
          displayItemNumbering={false}
          logoUrl="/hover.png"
          closeOnClickAway
        />
      )}

      <div className="pointer-events-none fixed inset-0 z-0 h-screen w-full">
        {isMobile ? (
          <div className="h-full w-full bg-black" />
        ) : liquidEtherFailed ? (
          <div className="h-full w-full animate-pulse bg-gradient-to-br from-purple-900 via-black to-black" />
        ) : (
          <LiquidEther
            colors={[accentColor, accentColor, "#111111", "#000000"]}
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

      <div className="absolute left-5 top-[calc(50vh+1.5rem)] z-30 hidden -translate-y-1/2 md:block lg:left-8">
        <LineSidebar
          items={sidebarItems}
          accentColor={accentColor}
          textColor="#bdbdbd"
          markerColor="#555"
          proximityRadius={160}
          maxShift={36}
          markerLength={58}
          itemGap={26}
          fontSize={0.82}
          smoothing={80}
          defaultActive={0}
          onItemClick={handleSidebarClick}
        />
      </div>

      <main className="relative z-10 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem]"
          style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}1f, transparent 62%)` }}
        />

        <PageTitleAnimation title={pageTitle} />

        <section
          aria-label="MADVERSE"
          className="relative flex min-h-screen w-full items-center justify-center px-5 py-24 sm:px-8 lg:px-12"
        >
          <img
            src="/hover.png"
            alt="MADVERSE logo"
            className="h-auto w-full max-w-4xl object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.18)]"
            decoding="async"
          />
        </section>

        <div className="relative mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
          {sections.map((section, index) => {
            const isReversed = index % 2 === 1;
            const sectionTitle = section.titleKey ? t(section.titleKey) : pageTitle;

            return (
              <motion.section
                key={`${section.image}-${section.descriptionKey}`}
                id={index < 2 ? `activity-feature-${index}` : undefined}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`grid min-h-[calc(100vh-7rem)] grid-cols-1 items-center gap-9 border-white/10 py-16 md:grid-cols-2 md:gap-12 lg:gap-20 lg:py-24 ${
                  index > 0 ? "border-t" : ""
                }`}
              >
                <div className={isReversed ? "md:order-2" : "md:order-1"}>
                  <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#F0A533] sm:text-sm">
                    <span style={{ color: accentColor }}>{t(section.labelKey)}</span>
                  </p>
                  <h2 className="max-w-2xl text-4xl font-bold leading-[0.96] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                    {sectionTitle}
                  </h2>
                  <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 text-white/65 sm:text-lg lg:text-xl lg:leading-9">
                    {t(section.descriptionKey)}
                  </p>
                </div>

                <motion.figure
                  initial={{ opacity: 0, x: isReversed ? -35 : 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/50 ${
                    isReversed ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <div className="aspect-[4/3] w-full sm:aspect-[16/11]">
                    <img
                      src={section.image}
                      alt={`${sectionTitle} - ${t(section.labelKey)}`}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.04]"
                  />
                </motion.figure>
              </motion.section>
            );
          })}
        </div>

        <section id="activity-coming-soon" className="flex min-h-screen w-full items-center justify-center px-4 py-20">
          <h2 className="text-center text-6xl font-bold text-white md:text-8xl">
            {t("comingSoon")}
            <span aria-hidden="true" className="ml-2 inline-block animate-bounce">.</span>
            <span aria-hidden="true" className="ml-1 inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
            <span aria-hidden="true" className="ml-1 inline-block animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
          </h2>
        </section>
      </main>

      <div className="relative z-10 border-t border-white/10 bg-black">
        <Footer />
      </div>
    </div>
  );
};

export default ActivityFeaturePage;
