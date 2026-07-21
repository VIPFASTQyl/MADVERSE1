import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import PillNav from "@/components/PillNav";
import StaggeredMenu from "@/components/StaggeredMenu";
import ActivityLanguageSwitcher from "@/components/ActivityLanguageSwitcher";
import SEO from "@/components/SEO";
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
  sections: [FeatureSection, FeatureSection];
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

const ActivityFeaturePage = ({
  activeHref,
  titleKey,
  seoDescription,
  canonical,
  ogImage,
  sections,
}: ActivityFeaturePageProps) => {
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();
  const pageTitle = t(titleKey);

  const navItems = pageLinks.map(({ key, href }) => ({ label: t(key), href }));
  const menuItems = pageLinks.map(({ key, href }) => ({
    label: t(key),
    ariaLabel: t(key),
    link: href,
  }));

  return (
    <div className="min-h-screen bg-black text-white" lang={language === "al" ? "sq" : "en"}>
      <SEO
        title={pageTitle}
        description={seoDescription}
        canonical={canonical}
        ogImage={ogImage}
      />

      {!isMobile ? (
        <>
          <PillNav items={navItems} activeHref={activeHref} />
          <ActivityLanguageSwitcher />
        </>
      ) : (
        <StaggeredMenu
          isFixed
          items={menuItems}
          position="right"
          colors={["#FCF5AF", "#F0A533", "#E44F0A", "#BA011A"]}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          accentColor="#00CED1"
          displayItemNumbering={false}
          logoUrl="/mADVESERlong.png"
          closeOnClickAway
        />
      )}

      <main className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(240,165,51,0.12),transparent_62%)]"
        />

        <div className="relative mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
          {sections.map((section, index) => {
            const isReversed = index === 1;
            const sectionTitle = section.titleKey ? t(section.titleKey) : pageTitle;
            const HeadingTag = index === 0 ? "h1" : "h2";

            return (
              <motion.section
                key={section.descriptionKey}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`grid min-h-[calc(100vh-7rem)] grid-cols-1 items-center gap-9 border-white/10 py-16 md:grid-cols-2 md:gap-12 lg:gap-20 lg:py-24 ${
                  index === 1 ? "border-t" : ""
                }`}
              >
                <div className={isReversed ? "md:order-2" : "md:order-1"}>
                  <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#F0A533] sm:text-sm">
                    {t(section.labelKey)}
                  </p>
                  <HeadingTag
                    className={`${
                      index === 0 ? "text-5xl sm:text-6xl lg:text-7xl" : "text-4xl sm:text-5xl lg:text-6xl"
                    } max-w-2xl font-bold leading-[0.96] tracking-[-0.045em]`}
                  >
                    {sectionTitle}
                  </HeadingTag>
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
                      alt={`${sectionTitle} — ${t(section.labelKey)}`}
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
      </main>

      <div className="relative z-10 border-t border-white/10 bg-black">
        <Footer />
      </div>
    </div>
  );
};

export default ActivityFeaturePage;
