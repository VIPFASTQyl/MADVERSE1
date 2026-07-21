import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Arts = () => (
  <ActivityFeaturePage
    activeHref="/activity/arts"
    titleKey="artsTitle"
    seoDescription="Discover MADVERSE's arts and street art programs promoting creative expression and urban culture in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/arts"
    ogImage="https://www.madverse-ks.page/og-arts.png"
    sections={[
      {
        labelKey: "unleashingCreativity",
        descriptionKey: "unleashingCreativityDesc",
        image: "/Arts.jpg",
      },
      {
        labelKey: "artsTitle",
        titleKey: "artisticCollaboration",
        descriptionKey: "artisticCollaborationDesc",
        image: "/project-2.jpg",
      },
    ]}
  />
);

export default Arts;
