import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Culture = () => (
  <ActivityFeaturePage
    activeHref="/activity/culture"
    titleKey="cultureTitle"
    seoDescription="Explore MADVERSE's cultural preservation and promotion initiatives celebrating Kosovo's rich heritage in Peja."
    canonical="https://www.madverse-ks.page/activity/culture"
    ogImage="https://www.madverse-ks.page/og-culture.png"
    sections={[
      {
        labelKey: "culturalHeritage",
        descriptionKey: "culturalHeritageDesc",
        image: "/Coulture.jpg",
      },
      {
        labelKey: "cultureTitle",
        titleKey: "culturalExchange",
        descriptionKey: "culturalExchangeDesc",
        image: "/kulture.jpg",
      },
    ]}
  />
);

export default Culture;
