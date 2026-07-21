import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Arts = () => (
  <ActivityFeaturePage
    activeHref="/activity/arts"
    titleKey="artsTitle"
    seoDescription="Discover MADVERSE's arts and street art programs promoting creative expression and urban culture in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/arts"
    ogImage="https://www.madverse-ks.page/og-arts.png"
    accentColor="#E40A0A"
    sections={[
      {
        labelKey: "unleashingCreativity",
        descriptionKey: "unleashingCreativityDesc",
        image: "/arts-1.jpeg",
      },
      {
        labelKey: "artsTitle",
        titleKey: "artisticCollaboration",
        descriptionKey: "artisticCollaborationDesc",
        image: "/arts-2.jpeg",
      },
      {
        labelKey: "artsTitle",
        titleKey: "communityThroughArt",
        descriptionKey: "communityThroughArtDesc",
        image: "/arts-3.jpeg",
      },
    ]}
  />
);

export default Arts;
