import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Exhibition = () => (
  <ActivityFeaturePage
    activeHref="/activity/exhibition"
    titleKey="exhibitionTitle"
    seoDescription="Experience MADVERSE's exhibitions showcasing art, culture, and creative projects in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/exhibition"
    ogImage="https://www.madverse-ks.page/og-exhibition.png"
    accentColor="#00CED1"
    sections={[
      {
        labelKey: "artExhibitions",
        descriptionKey: "artExhibitionsDesc",
        image: "/exhibition.jpg",
      },
      {
        labelKey: "exhibitionTitle",
        titleKey: "interactiveExhibits",
        descriptionKey: "interactiveExhibitsDesc",
        image: "/exhibition2nd.jpg",
      },
      {
        labelKey: "exhibitionTitle",
        titleKey: "exhibitionVenues",
        descriptionKey: "exhibitionVenuesDesc",
        image: "/20260304_110123.jpg",
      },
      {
        labelKey: "exhibitionTitle",
        titleKey: "volunteerCreativity",
        descriptionKey: "volunteerCreativityDesc",
        image: "/volunteering-4.jpeg",
      },
      {
        labelKey: "exhibitionTitle",
        titleKey: "collectiveAchievement",
        descriptionKey: "collectiveAchievementDesc",
        image: "/volunteering-5.jpeg",
      },
    ]}
  />
);

export default Exhibition;
