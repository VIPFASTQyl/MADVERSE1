import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Sports = () => (
  <ActivityFeaturePage
    activeHref="/activity/sports"
    titleKey="sportsTitle"
    seoDescription="Join MADVERSE's sports programs designed to promote healthy living and athletic development in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/sports"
    ogImage="https://www.madverse-ks.page/og-sports.png"
    accentColor="#0B4B8B"
    sections={[
      {
        labelKey: "athleteExcellence",
        descriptionKey: "athleteExcellenceDesc",
        image: "/basketball.jpg",
      },
      {
        labelKey: "sportsTitle",
        titleKey: "fitnessWellness",
        descriptionKey: "fitnessWellnessDesc",
        image: "/featured1st.JPG",
      },
      {
        labelKey: "sportsTitle",
        titleKey: "teamworkSpirit",
        descriptionKey: "teamworkSpiritDesc",
        image: "/project-1.jpg",
      },
    ]}
  />
);

export default Sports;
