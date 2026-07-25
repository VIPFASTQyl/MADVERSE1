import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Youth = () => (
  <ActivityFeaturePage
    activeHref="/activity/youth"
    titleKey="youthTitle"
    seoDescription="Explore MADVERSE's youth empowerment programs designed to inspire and develop the next generation in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/youth"
    ogImage="https://www.madverse-ks.page/og-youth.png"
    accentColor="#F0A533"
    sections={[
      {
        labelKey: "youthTitle",
        titleKey: "youthInitiative",
        descriptionKey: "youthInitiativeDesc",
        image: "/youth-mural-green.jpg",
      },
      {
        labelKey: "youthTitle",
        titleKey: "communityService",
        descriptionKey: "communityServiceDesc",
        image: "/youth-mural-painting.jpg",
      },
    ]}
  />
);

export default Youth;
