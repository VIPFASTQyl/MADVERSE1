import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Youth = () => (
  <ActivityFeaturePage
    activeHref="/activity/youth"
    titleKey="youthTitle"
    seoDescription="Explore MADVERSE's youth empowerment programs designed to inspire and develop the next generation in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/youth"
    ogImage="https://www.madverse-ks.page/og-youth.png"
    sections={[
      {
        labelKey: "leadershipDevelopment",
        descriptionKey: "leadershipDesc",
        image: "/Youth.jpg",
      },
      {
        labelKey: "youthTitle",
        titleKey: "creativeExpression",
        descriptionKey: "creativeExpressionDesc",
        image: "/project-1.jpg",
      },
    ]}
  />
);

export default Youth;
